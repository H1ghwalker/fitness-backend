import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import { app } from '../../server';
import { User } from '../../models/user';
import sequelize from '../../models';

console.log('App:', app); // Отладочный вывод
const request = supertest(app);
console.log('Request:', request); // Отладочный вывод

describe('Auth Endpoints', () => {
  // Очищаем БД перед каждым тестом
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  // Закрываем соединение с БД после всех тестов
  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      console.log('Starting test...'); // Отладочный вывод
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Trainer'
      };

      console.log('Sending request...'); // Отладочный вывод
      const response = await request
        .post('/api/auth/register')
        .send(userData);

      console.log('Response:', response); // Отладочный вывод

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.role).toBe(userData.role);
      expect(response.body).not.toHaveProperty('password');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      // Сначала создаем пользователя
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        role: 'Trainer'
      });

      // Пытаемся создать пользователя с тем же email
      const response = await request
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'test@example.com',
          password: 'password123',
          role: 'Client'
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should validate registration data', async () => {
      const response = await request
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123',
          role: 'Client'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(3); // email, password, name validation errors
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Создаем тестового пользователя перед каждым тестом
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'Client'
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should not login with invalid password', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
}); 