import express, { Express } from 'express';
import dotenv from 'dotenv';
import { initializeModels } from './models';
import { jsonParserMiddleware } from './middleware/jsonParser';
import { corsMiddleware } from './middleware/cors';
import { loggerMiddleware } from './middleware/logger';
import { errorHandlerMiddleware } from './middleware/errorHandler';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import routes from './routes';
import sequelize from './models';

dotenv.config();
export const app: Express = express();
const port: number = parseInt(process.env.PORT || '1337', 10);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

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
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }).catch((err: Error) => {
    console.error('Failed to sync database:', err);
  });
}