import cors from 'cors';

const corsOptions = {
  origin: [
    'https://fitness-frontend-9rggfvan4-h1ghwalkers-projects.vercel.app', // Добавляем новый домен Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешаем нужные методы
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);