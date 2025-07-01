import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ValidationError, NotFoundError, AuthenticationError, DatabaseError } from '../utils/errors';
import multer from 'multer';

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Логируем ошибку с контекстом
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id
  });

  // Определяем тип ошибки и статус
  if (err instanceof ValidationError) {
    res.status(400).json({ 
      error: 'Validation Error', 
      message: err.message,
      field: err.field 
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ 
      error: 'Not Found', 
      message: err.message 
    });
    return;
  }

  if (err instanceof AuthenticationError) {
    res.status(401).json({ 
      error: 'Authentication Error', 
      message: err.message 
    });
    return;
  }

  if (err instanceof DatabaseError) {
    res.status(500).json({ 
      error: 'Database Error', 
      message: process.env.NODE_ENV === 'production' ? 'Database operation failed' : err.message 
    });
    return;
  }

  // Обработка ошибок multer
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ 
        error: 'File too large', 
        message: 'File size must be less than 5MB' 
      });
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({ 
        error: 'Too many files', 
        message: 'Only one file can be uploaded at a time' 
      });
      return;
    }
    res.status(400).json({ 
      error: 'Upload error', 
      message: err.message 
    });
    return;
  }
  
  // Обработка ошибок валидации файлов
  if (err.message && (err.message.includes('Invalid file type') || err.message.includes('Invalid file extension'))) {
    res.status(400).json({ 
      error: 'Invalid file type', 
      message: err.message 
    });
    return;
  }

  // Неизвестная ошибка
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
};