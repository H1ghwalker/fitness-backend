import express from 'express';
import authRoutes from './auth';
import clientRoutes from './clients';
import sessionRoutes from './sessions';
import exerciseRoutes from './exercises';
import workoutTemplateRoutes from './workoutTemplates';

const router = express.Router();

// Подключаем роуты
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/sessions', sessionRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/workout-templates', workoutTemplateRoutes);

export default router;
