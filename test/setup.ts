import dotenv from 'dotenv';
import sequelize from '../models';

// Загружаем переменные окружения из .env.test
dotenv.config({ path: '.env.test' });

// Глобальные настройки для тестов
beforeAll(async () => {
  // Синхронизируем базу данных перед тестами
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Закрываем соединение с базой данных после тестов
  await sequelize.close();
}); 