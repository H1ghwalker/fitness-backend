import { Router } from 'express';
import authRoutes from './auth';
import clientRoutes from './clients';
import sessionRoutes from './sessions';
import exerciseRoutes from './exercises';
import workoutTemplateRoutes from './workoutTemplates';
import progressRoutes from './progress';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Подключаем роуты
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/sessions', sessionRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/workout-templates', workoutTemplateRoutes);
router.use('/progress', progressRoutes);

export default router;
