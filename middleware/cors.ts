import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://fitness-frontend-blush.vercel.app',
  'https://fitness-frontend-9rggfvan4-h1ghwalkers-projects.vercel.app',
  'https://trainerhub.fitness',
  // Добавляем поддержку для мобильных браузеров
  'capacitor://localhost',
  'ionic://localhost',
];

const corsOptionsDelegate = function (req: any, callback: any) {
  const origin = req.header('Origin');
  
  // Логируем для отладки
  console.log('CORS request from origin:', origin);
  
  if (allowedOrigins.includes(origin)) {
          callback(null, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        exposedHeaders: ['Set-Cookie'],
        maxAge: 86400, // 24 часа
        preflightContinue: false,
        optionsSuccessStatus: 204,
      });
  } else {
    // Для отладки - разрешаем все origins в development
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: allowing all origins');
      callback(null, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
        exposedHeaders: ['Set-Cookie'],
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 204,
      });
    } else {
      console.log('Production mode: blocking origin:', origin);
      callback(null, {
        origin: false,
      });
    }
  }
};

export const corsMiddleware = cors(corsOptionsDelegate);
