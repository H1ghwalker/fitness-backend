import express from 'express';
import { Op } from 'sequelize';
import { Exercise } from '../models';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = express.Router();

// Get all exercises (global + personal trainer)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.user?.role !== 'Trainer') {
    res.status(403).json({ message: 'Only trainers can access exercises' });
    return;
  }

  try {
    const exercises = await Exercise.findAll({
      where: {
        [Op.or]: [
          { isGlobal: true }, // Global exercises
          { createdBy: trainerId } // Personal trainer exercises
        ]
      },
      order: [['name', 'ASC']]
    });

    res.json({ exercises });
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ message: 'Failed to fetch exercises' });
  }
});

// Get only global exercises
router.get('/global', requireAuth, async (req: AuthRequest, res) => {
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.user?.role !== 'Trainer') {
    res.status(403).json({ message: 'Only trainers can access exercises' });
    return;
  }

  try {
    const exercises = await Exercise.findAll({
      where: { isGlobal: true },
      order: [['name', 'ASC']]
    });

    res.json({ exercises });
  } catch (err) {
    console.error('Error fetching global exercises:', err);
    res.status(500).json({ message: 'Failed to fetch global exercises' });
  }
});

// Get only personal trainer exercises
router.get('/personal', requireAuth, async (req: AuthRequest, res) => {
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.user?.role !== 'Trainer') {
    res.status(403).json({ message: 'Only trainers can access exercises' });
    return;
  }

  try {
    const exercises = await Exercise.findAll({
      where: { 
        createdBy: trainerId,
        isGlobal: false
      },
      order: [['name', 'ASC']]
    });

    res.json({ exercises });
  } catch (err) {
    console.error('Error fetching personal exercises:', err);
    res.status(500).json({ message: 'Failed to fetch personal exercises' });
  }
});

// Create new exercise (personal only)
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.user?.role !== 'Trainer') {
    res.status(403).json({ message: 'Only trainers can create exercises' });
    return;
  }

  const { name, description, category, muscleGroup } = req.body;

  if (!name || !description || !category || !muscleGroup) {
    res.status(400).json({ message: 'Name, description, category and muscleGroup are required' });
    return;
  }

  try {
    const exercise = await Exercise.create({
      name,
      description,
      category,
      muscleGroup,
      createdBy: trainerId,
      isGlobal: false // Trainers can only create personal exercises
    });

    res.status(201).json({ exercise });
  } catch (err) {
    console.error('Error creating exercise:', err);
    res.status(500).json({ message: 'Failed to create exercise' });
  }
});

// Delete exercise (personal only)
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const exercise = await Exercise.findOne({
      where: { 
        id, 
        createdBy: trainerId,
        isGlobal: false // Can only delete personal exercises
      }
    });

    if (!exercise) {
      res.status(404).json({ message: 'Exercise not found or cannot be deleted' });
      return;
    }

    await exercise.destroy();
    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    console.error('Error deleting exercise:', err);
    res.status(500).json({ message: 'Failed to delete exercise' });
  }
});

export default router; 