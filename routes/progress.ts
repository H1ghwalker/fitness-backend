import express, { Request, Response } from 'express';
import { Progress } from '../models/index';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Получить прогресс клиента
router.get('/clients/:clientId/progress', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { clientId } = req.params;
  const { type, category } = req.query;

  let whereClause: any = { clientId: parseInt(clientId) };
  
  if (type) {
    whereClause.type = type;
  }
  
  if (category) {
    whereClause.category = category;
  }

  const progress = await Progress.findAll({
    where: whereClause,
    order: [['date', 'DESC']]
  });

  res.json(progress);
}));

// Получить статистику прогресса клиента
router.get('/clients/:clientId/progress-stats', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { clientId } = req.params;
  
  // Получаем все записи прогресса клиента
  const progressRecords = await Progress.findAll({
    where: { clientId: parseInt(clientId) },
    order: [['date', 'DESC']]
  });

  // Получаем сессии клиента (нужно импортировать модель Session)
  const { Session } = await import('../models/index');
  const sessions = await Session.findAll({
    where: { clientId: parseInt(clientId) }
  });

  // Вычисляем статистику
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled').length;
  const attendanceRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Вычисляем изменения веса
  const weightRecords = progressRecords.filter(p => p.type === 'weight').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const averageWeight = weightRecords.length > 0 
    ? weightRecords.reduce((sum, record) => sum + record.value, 0) / weightRecords.length 
    : undefined;
  
  const weightChange = weightRecords.length >= 2 
    ? weightRecords[0].value - weightRecords[weightRecords.length - 1].value 
    : undefined;

  // Вычисляем прогресс в силовых показателях
  const strengthProgress: Record<string, { current: number; previous: number; change: number }> = {};
  const strengthRecords = progressRecords.filter(p => p.type === 'strength');
  
  strengthRecords.forEach(record => {
    if (!strengthProgress[record.category]) {
      strengthProgress[record.category] = { current: 0, previous: 0, change: 0 };
    }
    
    const existing = strengthProgress[record.category];
    if (existing.current === 0) {
      existing.current = record.value;
    } else if (existing.previous === 0) {
      existing.previous = record.value;
      existing.change = existing.current - existing.previous;
    }
  });

  // Вычисляем изменения в измерениях
  const measurements: Record<string, { current: number; previous: number; change: number }> = {};
  const measurementRecords = progressRecords.filter(p => p.type === 'measurements');
  
  measurementRecords.forEach(record => {
    if (!measurements[record.category]) {
      measurements[record.category] = { current: 0, previous: 0, change: 0 };
    }
    
    const existing = measurements[record.category];
    if (existing.current === 0) {
      existing.current = record.value;
    } else if (existing.previous === 0) {
      existing.previous = record.value;
      existing.change = existing.current - existing.previous;
    }
  });

  res.json({
    totalSessions,
    completedSessions,
    cancelledSessions,
    attendanceRate,
    averageWeight,
    weightChange,
    strengthProgress,
    measurements
  });
}));

// Создать запись прогресса
router.post('/progress', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const progress = await Progress.create(req.body);
  res.status(201).json(progress);
}));

// Обновить запись прогресса
router.put('/progress/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const progress = await Progress.findByPk(id);
  
  if (!progress) {
    return res.status(404).json({ message: 'Progress record not found' });
  }
  
  await progress.update(req.body);
  res.json(progress);
}));

// Удалить запись прогресса
router.delete('/progress/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const progress = await Progress.findByPk(id);
  
  if (!progress) {
    return res.status(404).json({ message: 'Progress record not found' });
  }
  
  await progress.destroy();
  res.status(204).send();
}));

export default router; 