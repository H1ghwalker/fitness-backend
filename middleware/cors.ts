import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://fitness-frontend-blush.vercel.app',
  ],
};

export const corsMiddleware = cors(corsOptions);