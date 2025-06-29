import express from 'express';
import { Session } from '../models/session';
import { Client } from '../models/client';
import { User } from '../models/user';
import { Op } from 'sequelize';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = express.Router();

// Создать сессию
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { clientId, date, time, note, duration } = req.body;
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    // Проверяем, существует ли клиент и принадлежит ли он текущему тренеру
    const client = await Client.findOne({
      where: {
        id: clientId,
        trainer_id: trainerId
      }
    });

    if (!client) {
      console.error('Client not found or does not belong to trainer:', {
        clientId,
        trainerId
      });
      res.status(404).json({ message: 'Client not found or does not belong to you' });
      return;
    }

    // Парсим дату и время
    let hours = 0;
    let minutes = 0;
    
    if (time) {
      [hours, minutes] = time.split(':').map(Number);
    }

    // Создаем дату из строки и устанавливаем время
    const [year, month, day] = date.split('T')[0].split('-').map(Number);
    const sessionDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));

    console.log('Creating session with params:', {
      clientId,
      trainerId,
      date: sessionDate.toISOString(),
      time,
      parsedTime: { hours, minutes },
      note,
      duration
    });

    const session = await Session.create({ 
      clientId, 
      trainerId, 
      date: sessionDate, 
      note,
      duration: duration ? parseInt(duration) : undefined
    });

    // Обновляем nextSession у клиента
    // Находим ближайшую сессию для клиента
    const nextSession = await Session.findOne({
      where: {
        clientId,
        date: {
          [Op.gte]: new Date() // только будущие сессии
        }
      },
      order: [['date', 'ASC']]
    });

    // Обновляем nextSession у клиента
    await client.update({
      nextSession: nextSession ? nextSession.date : undefined
    });

    console.log('Session created:', session.id);

    const createdSession = await Session.findOne({
      where: { id: session.id },
      include: [
        {
          model: Client,
          as: 'Client',
          include: [{ 
            model: User,
            as: 'User',
            attributes: ['id', 'name', 'email']
          }]
        },
        {
          model: User,
          as: 'Trainer',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!createdSession) {
      throw new Error('Failed to fetch created session');
    }

    console.log('Session fetched successfully:', createdSession.id);

    res.status(201).json(createdSession);
  } catch (err) {
    console.error('Error creating session:', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      params: { clientId, date, time, note, duration, trainerId }
    });
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// Получить сессии для календаря
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { month } = req.query;
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!month) {
    res.status(400).json({ message: 'Month parameter is required (format: YYYY-MM)' });
    return;
  }

  try {
    const [year, monthNum] = (month as string).split('-').map(Number);
    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

    console.log('Fetching sessions with params:', {
      trainerId,
      start: start.toISOString(),
      end: end.toISOString()
    });

    const sessions = await Session.findAll({
      where: {
        trainerId,
        date: { [Op.between]: [start, end] },
      },
      include: [
        {
          model: Client,
          as: 'Client',
          include: [{ 
            model: User,
            as: 'User',
            attributes: ['id', 'name', 'email']
          }]
        },
        {
          model: User,
          as: 'Trainer',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['date', 'ASC']],
      attributes: ['id', 'date', 'note', 'duration', 'clientId', 'trainerId']
    });
    
    console.log('Found sessions:', sessions.length);
    
    const formattedSessions = sessions.map(session => ({
      ...session.toJSON(),
      date: session.date.toISOString()
    }));

    res.json(formattedSessions);
  } catch (err) {
    console.error('Error fetching sessions:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      query: { month, trainerId }
    });
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
});

// Удалить сессию
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    // Проверяем существование сессии и принадлежность текущему тренеру
    const session = await Session.findOne({
      where: {
        id,
        trainerId
      }
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found or does not belong to you' });
      return;
    }

    // Удаляем сессию
    await session.destroy();

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error('Error deleting session:', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      sessionId: id,
      trainerId
    });
    res.status(500).json({ message: 'Failed to delete session' });
  }
});

// Обновить сессию
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { date, time, note, duration } = req.body;
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    // Проверяем существование сессии и принадлежность текущему тренеру
    const session = await Session.findOne({
      where: {
        id,
        trainerId
      },
      include: [
        {
          model: Client,
          as: 'Client',
          include: [{ 
            model: User,
            as: 'User',
            attributes: ['id', 'name', 'email']
          }]
        },
        {
          model: User,
          as: 'Trainer',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found or does not belong to you' });
      return;
    }

    // Парсим дату и время если они предоставлены
    let sessionDate = session.date;
    if (date) {
      let hours = 0;
      let minutes = 0;
      
      if (time) {
        [hours, minutes] = time.split(':').map(Number);
      }

      const [year, month, day] = date.split('T')[0].split('-').map(Number);
      sessionDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
    }

    // Обновляем сессию
    await session.update({
      date: sessionDate,
      note,
      duration: duration ? parseInt(duration) : undefined
    });

    // Перезагружаем сессию с включенными данными
    await session.reload();

    res.status(200).json(session);
  } catch (err) {
    console.error('Error updating session:', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      sessionId: id,
      trainerId,
      params: { date, time, note, duration }
    });
    res.status(500).json({ message: 'Failed to update session' });
  }
});

export default router;
