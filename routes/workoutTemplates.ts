import express from 'express';
import { WorkoutTemplate, WorkoutExercise, Exercise } from '../models';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = express.Router();

// Получить все шаблоны тренера
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const trainerId = req.user?.id;
  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const templates = await WorkoutTemplate.findAll({
      where: { createdBy: trainerId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: WorkoutExercise,
        as: 'Exercises',
        include: [{ model: Exercise, as: 'Exercise' }],
        order: [['orderIndex', 'ASC']]
      }]
    });
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

// Получить шаблон по id
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const trainerId = req.user?.id;
  const { id } = req.params;
  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const template = await WorkoutTemplate.findOne({
      where: { id, createdBy: trainerId },
      include: [{
        model: WorkoutExercise,
        as: 'Exercises',
        include: [{ model: Exercise, as: 'Exercise' }],
        order: [['orderIndex', 'ASC']]
      }]
    });
    if (!template) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json({ template });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch template' });
  }
});

// Создать шаблон тренировки с упражнениями
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const trainerId = req.user?.id;
  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const { name, exercises } = req.body;
  if (!name || !Array.isArray(exercises) || exercises.length === 0) {
    res.status(400).json({ message: 'Name and exercises are required' });
    return;
  }
  try {
    const template = await WorkoutTemplate.create({ name, createdBy: trainerId });
    for (let i = 0; i < exercises.length; i++) {
      const { exerciseId, sets, reps, weight, notes } = exercises[i];
      await WorkoutExercise.create({
        workoutTemplateId: template.id,
        exerciseId,
        sets,
        reps,
        weight,
        notes,
        orderIndex: i
      });
    }
    const fullTemplate = await WorkoutTemplate.findByPk(template.id, {
      include: [{
        model: WorkoutExercise,
        as: 'Exercises',
        include: [{ model: Exercise, as: 'Exercise' }],
        order: [['orderIndex', 'ASC']]
      }]
    });
    res.status(201).json({ template: fullTemplate });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create template' });
  }
});

export default router; 