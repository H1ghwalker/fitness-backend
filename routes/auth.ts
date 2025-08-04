import { Router, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { AuthRequest, requireAuth } from "../middleware/auth";
import { validateRegistration, validateLogin, validate } from "../middleware/validators";

const router = Router();

// POST /api/auth/jwt - для NextAuth
router.post("/jwt", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // Если есть name, это регистрация
    if (name) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(409).json({ message: "User already exists" });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash, role });
      const token = signToken({ id: user.id, role: user.role });

      res.status(201).json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        accessToken: token
      });
    } else {
      // Логин
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

      res.status(200).json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        accessToken: token
      });
    }
  } catch (error) {
    console.error('JWT auth error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/register - оставляем для совместимости
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

    res.status(201).json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Internal server error during registration" });
  }
});

// POST /api/auth/login - оставляем для совместимости
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

    res.status(200).json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error during login" });
  }
});

// POST /api/auth/logout - упрощаем для stateless
router.post("/logout", (req, res): void => {
  res.status(200).json({ message: "Logged out" });
});

// GET /api/auth/me - обновляем для header-based аутентификации
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
