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

console.log('Starting server initialization...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || '1337');

dotenv.config();
export const app: Express = express();
const port: number = parseInt(process.env.PORT || '1337', 10);

console.log('Express app created');

// Security middleware
app.use(helmet());
console.log('Helmet middleware added');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
console.log('Rate limiting middleware added');

// Middleware
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(jsonParserMiddleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
console.log('All middleware added');

// Initialize models
console.log('Initializing models...');
try {
  initializeModels();
  console.log('Models initialized successfully');
} catch (error) {
  console.error('Error initializing models:', error);
}

// Routes
app.use('/api', routes);
console.log('Routes added');

// Error handling
app.use(errorHandlerMiddleware);
console.log('Error handler added');

// Server launch
if (process.env.NODE_ENV !== 'test') {
  console.log('Starting database sync...');
  
  // Option to reset database in production
  const shouldResetDB = process.env.RESET_DATABASE === 'true';
  
  if (shouldResetDB) {
    console.log('🔄 Resetting database...');
    sequelize.drop().then(() => {
      console.log('✅ Database dropped successfully');
      return sequelize.sync();
    }).then(() => {
      console.log('✅ Database synced successfully');
      console.log('Starting server on port:', port);
      app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
        console.log(`✅ Environment: ${process.env.NODE_ENV}`);
        console.log(`✅ Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
      });
    }).catch((err: Error) => {
      console.error('❌ Failed to reset/sync database:', err);
      console.error('❌ Database URL:', process.env.DATABASE_URL);
    });
  } else {
    sequelize.sync().then(() => {
      console.log('Database synced successfully');
      console.log('Starting server on port:', port);
      app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
        console.log(`✅ Environment: ${process.env.NODE_ENV}`);
        console.log(`✅ Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
      });
    }).catch((err: Error) => {
      console.error('❌ Failed to sync database:', err);
      console.error('❌ Database URL:', process.env.DATABASE_URL);
    });
  }
} else {
  console.log('Test environment detected, skipping server start');
}