import express, { Express } from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initClientModel } from './models/Client';
import clientsRouter from './routes/clients';
import { corsMiddleware } from './middleware/cors';
import { jsonParserMiddleware } from './middleware/jsonParser';
import { loggerMiddleware } from './middleware/logger';
import { errorHandlerMiddleware } from './middleware/errorHandler';
import path from 'path';

dotenv.config();
const app: Express = express();
const port: number = parseInt(process.env.PORT || '1337', 10);

// Connection to PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
});

// Middleware
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(jsonParserMiddleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Убедимся, что путь к папке uploads правильный

// Initialize models
initClientModel(sequelize);

// Routes
app.use('/api/clients', clientsRouter);

// Error handling
app.use(errorHandlerMiddleware);

// Server launch
sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch((err: Error) => {
  console.error('Failed to sync database:', err);
});