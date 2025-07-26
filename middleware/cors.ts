import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://fitness-frontend-blush.vercel.app',
  'https://fitness-frontend-9rggfvan4-h1ghwalkers-projects.vercel.app',
  'https://trainerhub.fitness',
];

const corsOptionsDelegate = function (req: any, callback: any) {
  const origin = req.header('Origin');
  if (allowedOrigins.includes(origin)) {
    callback(null, {
      origin: true,
      credentials: true,
    });
  } else {
    callback(null, {
      origin: false,
    });
  }
};

export const corsMiddleware = cors(corsOptionsDelegate);
