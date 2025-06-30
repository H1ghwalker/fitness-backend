import supertest from 'supertest';
import { app } from '../../server';
import { User, Client, WorkoutLog, ClientProgress } from '../../models';
import sequelize from '../../models';
import bcrypt from 'bcryptjs';

const request = supertest(app);

describe('Simple Progress Tracking', () => {
  let trainer: User;
  let client: Client;
  let authToken: string;

  beforeAll(async () => {
    // Создаем тестового тренера
    const passwordHash = await bcrypt.hash('password123', 10);
    trainer = await User.create({
      name: 'Test Trainer',
      email: 'trainer@test.com',
      passwordHash,
      role: 'Trainer'
    });

    // Создаем тестового клиента
    const clientUser = await User.create({
      name: 'Test Client',
      email: 'client@test.com',
      passwordHash,
      role: 'Client'
    });

    client = await Client.create({
      user_id: clientUser.id,
      trainer_id: trainer.id,
      goal: 'Lose weight',
      plan: 'Premium Monthly',
      type: 'Subscription'
    });

    // Получаем токен авторизации
    const loginResponse = await request
      .post('/api/auth/login')
      .send({
        email: 'trainer@test.com',
        password: 'password123'
      });

    authToken = loginResponse.headers['set-cookie'][0];
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Очищаем данные перед каждым тестом
    await ClientProgress.destroy({ where: {} });
    await WorkoutLog.destroy({ where: {} });
  });

  describe('Workout Logs', () => {
    it('should create a simple workout log', async () => {
      const workoutLogData = {
        clientId: client.id,
        date: '2024-01-15',
        status: 'completed',
        notes: 'Great workout!'
      };

      const response = await request
        .post('/api/workout-logs')
        .set('Cookie', authToken)
        .send(workoutLogData);

      expect(response.status).toBe(201);
      expect(response.body.workoutLog).toBeDefined();
      expect(response.body.workoutLog.clientId).toBe(client.id);
      expect(response.body.workoutLog.status).toBe('completed');
      expect(response.body.workoutLog.notes).toBe('Great workout!');
    });

    it('should get workout logs for client', async () => {
      // Создаем тестовый лог
      await WorkoutLog.create({
        clientId: client.id,
        trainerId: trainer.id,
        date: new Date('2024-01-15'),
        status: 'completed',
        notes: 'Test workout'
      });

      const response = await request
        .get(`/api/workout-logs/client/${client.id}`)
        .set('Cookie', authToken);

      expect(response.status).toBe(200);
      expect(response.body.workoutLogs).toHaveLength(1);
      expect(response.body.workoutLogs[0].clientId).toBe(client.id);
    });
  });

  describe('Client Progress', () => {
    it('should create a progress record', async () => {
      const progressData = {
        clientId: client.id,
        date: '2024-01-15',
        weight: 75.5,
        notes: 'Good progress!'
      };

      const response = await request
        .post('/api/client-progress')
        .set('Cookie', authToken)
        .send(progressData);

      expect(response.status).toBe(201);
      expect(response.body.progress).toBeDefined();
      expect(response.body.progress.clientId).toBe(client.id);
      expect(response.body.progress.weight).toBe(75.5);
      expect(response.body.progress.notes).toBe('Good progress!');
    });

    it('should get progress for client', async () => {
      // Создаем тестовую запись прогресса
      await ClientProgress.create({
        clientId: client.id,
        date: new Date('2024-01-15'),
        weight: 75.5,
        notes: 'Test progress'
      });

      const response = await request
        .get(`/api/client-progress/client/${client.id}`)
        .set('Cookie', authToken);

      expect(response.status).toBe(200);
      expect(response.body.progress).toHaveLength(1);
      expect(response.body.progress[0].clientId).toBe(client.id);
      expect(response.body.progress[0].weight).toBe(75.5);
    });

    it('should require weight field', async () => {
      const progressData = {
        clientId: client.id,
        date: '2024-01-15',
        notes: 'Missing weight'
      };

      const response = await request
        .post('/api/client-progress')
        .set('Cookie', authToken)
        .send(progressData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('weight are required');
    });
  });
}); 