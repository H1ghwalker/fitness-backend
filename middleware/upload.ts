import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

// Разрешенные типы файлов
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Функция для проверки типа файла
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Проверяем MIME тип
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error(`Invalid file type. Only JPG and PNG files are allowed. Received: ${file.mimetype}`));
    return;
  }

  // Проверяем расширение файла
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
    cb(new Error(`Invalid file extension. Only .jpg, .jpeg, and .png files are allowed. Received: ${fileExtension}`));
    return;
  }

  cb(null, true);
};

// Конфигурация хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Генерируем безопасное имя файла
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${fileExtension}`);
  },
});

// Конфигурация multer с валидацией
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Максимум 1 файл за раз
  }
});

// Middleware для обработки ошибок загрузки файлов
export const handleUploadError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large', 
        message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files', 
        message: 'Only one file can be uploaded at a time' 
      });
    }
    return res.status(400).json({ 
      error: 'Upload error', 
      message: err.message 
    });
  }
  
  if (err.message.includes('Invalid file type') || err.message.includes('Invalid file extension')) {
    return res.status(400).json({ 
      error: 'Invalid file type', 
      message: err.message 
    });
  }

  next(err);
};
