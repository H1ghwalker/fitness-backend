import { Router, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { AuthRequest, requireAuth } from "../middleware/auth";
import { validateRegistration, validateLogin, validate } from "../middleware/validators";

const router = Router();

// POST /api/auth/register
router.post("/register", validateRegistration, validate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });
    const token = signToken({ id: user.id, role: user.role });

    // Определяем iOS устройство по User-Agent
    const userAgent = req.headers['user-agent'] || '';
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    
    console.log('Registration for iOS device:', isIOS);
    console.log('User-Agent:', userAgent);

    // Исправленные настройки cookie для iOS Safari
    const cookieOptions = {
      httpOnly: true,
      sameSite: "none" as const,
      secure: true,
      path: "/",
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    };

    // Для iOS добавляем дополнительные заголовки
    if (isIOS) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    res
      .clearCookie("token", cookieOptions)
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isIOS: isIOS // Добавляем информацию о iOS для фронтенда
      });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Internal server error during registration" });
  }
});

// POST /api/auth/login
router.post("/login", validateLogin, validate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.unscoped().findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = signToken({ id: user.id, role: user.role });

    // Определяем iOS устройство по User-Agent
    const userAgent = req.headers['user-agent'] || '';
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    
    console.log('Login for iOS device:', isIOS);
    console.log('User-Agent:', userAgent);

    // Исправленные настройки cookie для iOS Safari
    const cookieOptions = {
      httpOnly: true,
      sameSite: "none" as const,
      secure: true,
      path: "/",
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    };

    // Для iOS добавляем дополнительные заголовки
    if (isIOS) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    res
      .clearCookie("token", cookieOptions)
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isIOS: isIOS // Добавляем информацию о iOS для фронтенда
      });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error during login" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res): void => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    domain: process.env.COOKIE_DOMAIN || undefined,
  })
  .status(200).json({ message: "Logged out" });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
