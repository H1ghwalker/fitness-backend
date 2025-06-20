import express from 'express';
import { WorkoutTemplate, WorkoutExercise, Exercise } from '../models';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = express.Router();

// Простая функция для получения trainerId
const getTrainerId = (req: AuthRequest): number => {
  if (!req.user?.id) {
    throw new Error('Unauthorized');
  }
  return req.user.id;
};

// Получить все шаблоны тренера
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const trainerId = getTrainerId(req);
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
    if (err instanceof Error && err.message === 'Unauthorized') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Failed to fetch templates' });
    }
  }
});

// Получить шаблон по id
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const trainerId = getTrainerId(req);
    const { id } = req.params;
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
    if (err instanceof Error && err.message === 'Unauthorized') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Failed to fetch template' });
    }
  }
});

// Создать шаблон тренировки с упражнениями
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const trainerId = getTrainerId(req);
    const { name, exercises } = req.body;
    if (!name || !Array.isArray(exercises) || exercises.length === 0) {
      res.status(400).json({ message: 'Name and exercises are required' });
      return;
    }

    // Валидация exerciseId - проверяем, что все упражнения существуют
    for (const exercise of exercises) {
      const existingExercise = await Exercise.findByPk(exercise.exerciseId);
      if (!existingExercise) {
        res.status(400).json({ 
          message: `Exercise with ID ${exercise.exerciseId} not found` 
        });
        return;
      }
    }

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
    if (err instanceof Error && err.message === 'Unauthorized') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Failed to create template' });
    }
  }
});

// Обновить шаблон тренировки
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const trainerId = getTrainerId(req);
    const { id } = req.params;
    const { name, exercises } = req.body;
    
    // Проверяем, что шаблон существует и принадлежит тренеру
    const template = await WorkoutTemplate.findOne({
      where: { id, createdBy: trainerId }
    });
    
    if (!template) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }
    
    // Валидация входных данных
    if (!name || !Array.isArray(exercises) || exercises.length === 0) {
      res.status(400).json({ message: 'Name and exercises are required' });
      return;
    }

    // Валидация exerciseId - проверяем, что все упражнения существуют
    for (const exercise of exercises) {
      const existingExercise = await Exercise.findByPk(exercise.exerciseId);
      if (!existingExercise) {
        res.status(400).json({ 
          message: `Exercise with ID ${exercise.exerciseId} not found` 
        });
        return;
      }
    }
    
    // Обновляем название шаблона
    await template.update({ name });
    
    // Удаляем все существующие упражнения
    await WorkoutExercise.destroy({
      where: { workoutTemplateId: template.id }
    });
    
    // Добавляем новые упражнения
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
    
    // Возвращаем обновленный шаблон
    const updatedTemplate = await WorkoutTemplate.findByPk(template.id, {
      include: [{
        model: WorkoutExercise,
        as: 'Exercises',
        include: [{ model: Exercise, as: 'Exercise' }],
        order: [['orderIndex', 'ASC']]
      }]
    });
    
    res.json({ template: updatedTemplate });
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Failed to update template' });
    }
  }
});

// Удалить шаблон тренировки
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const trainerId = getTrainerId(req);
    const { id } = req.params;
    
    // Проверяем, что шаблон существует и принадлежит тренеру
    const template = await WorkoutTemplate.findOne({
      where: { id, createdBy: trainerId }
    });
    
    if (!template) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }
    
    // Удаляем шаблон (WorkoutExercise удалятся автоматически благодаря CASCADE)
    await template.destroy();
    
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Failed to delete template' });
    }
  }
});

export default router; 