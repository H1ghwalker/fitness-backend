import express, { Express } from 'express';
import dotenv from 'dotenv';
import { initializeModels } from './models';
import { jsonParserMiddleware } from './middleware/jsonParser';
import { corsMiddleware } from './middleware/cors';
import { loggerMiddleware } from './middleware/logger';
import { errorHandlerMiddleware } from './middleware/errorHandler';
import path from 'path';

import cookieParser from 'cookie-parser';
import routes from './routes';


dotenv.config();
const app: Express = express();
const port: number = parseInt(process.env.PORT || '1337', 10);

// Middleware
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(jsonParserMiddleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

// Initialize models
initializeModels();

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandlerMiddleware);

// Server launch
import sequelize from './models';
sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch((err: Error) => {
  console.error('Failed to sync database:', err);
});