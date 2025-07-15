import express, { Request, Response } from 'express';
import { ProgressMeasurement, Client } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Получить все измерения прогресса клиента
router.get('/:clientId', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { clientId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Проверяем, что клиент принадлежит текущему тренеру
  const client = await Client.findOne({
    where: { 
      id: clientId,
      trainer_id: req.user!.id 
    }
  });

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  const offset = (Number(page) - 1) * Number(limit);

  const measurements = await ProgressMeasurement.findAndCountAll({
    where: { clientId },
    order: [['date', 'DESC']],
    limit: Number(limit),
    offset,
  });

  res.json({
    measurements: measurements.rows,
    total: measurements.count,
    page: Number(page),
    totalPages: Math.ceil(measurements.count / Number(limit)),
  });
}));

// Добавить новое измерение
router.post('/', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { clientId, date, weight, chest, waist, hips, biceps, notes } = req.body;

  // Проверяем, что клиент принадлежит текущему тренеру
  const client = await Client.findOne({
    where: { 
      id: clientId,
      trainer_id: req.user!.id 
    }
  });

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  // Проверяем, что хотя бы одно измерение указано
  if (!weight && !chest && !waist && !hips && !biceps) {
    return res.status(400).json({ error: 'At least one measurement is required' });
  }

  // Проверяем, нет ли уже измерения на эту дату
  const existingMeasurement = await ProgressMeasurement.findOne({
    where: { clientId, date }
  });

  if (existingMeasurement) {
    return res.status(400).json({ error: 'Measurement for this date already exists' });
  }

  const measurement = await ProgressMeasurement.create({
    clientId,
    date,
    weight,
    chest,
    waist,
    hips,
    biceps,
    notes,
  });

  res.status(201).json(measurement);
}));

// Обновить измерение
router.put('/:id', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { date, weight, chest, waist, hips, biceps, notes } = req.body;

  const measurement = await ProgressMeasurement.findOne({
    where: { id },
    include: [{
      model: Client,
      as: 'Client',
      where: { trainer_id: req.user!.id }
    }]
  });

  if (!measurement) {
    return res.status(404).json({ error: 'Measurement not found' });
  }

  // Проверяем, что хотя бы одно измерение указано
  if (!weight && !chest && !waist && !hips && !biceps) {
    return res.status(400).json({ error: 'At least one measurement is required' });
  }

  // Если дата изменилась, проверяем, нет ли уже измерения на новую дату
  if (date && date !== measurement.date) {
    const existingMeasurement = await ProgressMeasurement.findOne({
      where: { 
        clientId: measurement.clientId, 
        date,
        id: { [require('sequelize').Op.ne]: id }
      }
    });

    if (existingMeasurement) {
      return res.status(400).json({ error: 'Measurement for this date already exists' });
    }
  }

  await measurement.update({
    date,
    weight,
    chest,
    waist,
    hips,
    biceps,
    notes,
  });

  res.json(measurement);
}));

// Удалить измерение
router.delete('/:id', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  console.log(`🗑️ Attempting to delete measurement with ID: ${id}`);
  console.log(`👤 User ID: ${req.user!.id}`);

  const measurement = await ProgressMeasurement.findOne({
    where: { id },
    include: [{
      model: Client,
      as: 'Client',
      where: { trainer_id: req.user!.id }
    }]
  });

  console.log(`🔍 Found measurement:`, measurement ? 'Yes' : 'No');

  if (!measurement) {
    console.log(`❌ Measurement not found or user doesn't have access`);
    return res.status(404).json({ error: 'Measurement not found' });
  }

  console.log(`✅ Measurement found, proceeding with deletion`);
  await measurement.destroy();
  console.log(`✅ Measurement deleted successfully`);
  res.status(204).send();
}));

// Получить статистику прогресса клиента
router.get('/:clientId/stats', requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { clientId } = req.params;

  // Проверяем, что клиент принадлежит текущему тренеру
  const client = await Client.findOne({
    where: { 
      id: clientId,
      trainer_id: req.user!.id 
    }
  });

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  const measurements = await ProgressMeasurement.findAll({
    where: { clientId },
    order: [['date', 'ASC']],
  });

  // Статистика по весу
  const weightMeasurements = measurements.filter(m => m.weight !== null);
  const currentWeight = weightMeasurements.length > 0 ? weightMeasurements[weightMeasurements.length - 1].weight : null;
  const initialWeight = weightMeasurements.length > 0 ? weightMeasurements[0].weight : null;
  const weightChange = currentWeight && initialWeight ? currentWeight - initialWeight : null;

  // Расчёт прогресса к цели
  let weightGoalProgress = null;
  if (currentWeight && initialWeight && client.targetWeight) {
    const totalDistance = Math.abs(initialWeight - client.targetWeight);
    const currentDistance = Math.abs(currentWeight - client.targetWeight);
    const progress = Math.max(0, Math.min(100, ((totalDistance - currentDistance) / totalDistance) * 100));
    weightGoalProgress = {
      targetWeight: client.targetWeight,
      progress: Math.round(progress),
      remaining: Math.abs(currentWeight - client.targetWeight),
      isGoalAchieved: Math.abs(currentWeight - client.targetWeight) < 0.5 // Цель достигнута если разница меньше 0.5 кг
    };
  }

  // Статистика по объемам
  const volumeStats = {
    chest: getVolumeStats(measurements, 'chest'),
    waist: getVolumeStats(measurements, 'waist'),
    hips: getVolumeStats(measurements, 'hips'),
    biceps: getVolumeStats(measurements, 'biceps'),
  };

  res.json({
    totalMeasurements: measurements.length,
    weightMeasurements: weightMeasurements.length,
    currentWeight,
    initialWeight,
    weightChange,
    weightGoalProgress,
    volumeStats,
    lastMeasurement: measurements.length > 0 ? measurements[measurements.length - 1] : null,
  });
}));

// Вспомогательная функция для расчета статистики объемов
function getVolumeStats(measurements: any[], field: string) {
  const fieldMeasurements = measurements.filter(m => m[field] !== null);
  if (fieldMeasurements.length === 0) return null;

  const current = fieldMeasurements[fieldMeasurements.length - 1][field];
  const initial = fieldMeasurements[0][field];
  const change = current - initial;

  return {
    current,
    initial,
    change,
    measurements: fieldMeasurements.length,
  };
}

export default router; 