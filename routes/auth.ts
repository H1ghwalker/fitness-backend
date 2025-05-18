import { Router } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { AuthRequest, requireAuth } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res): Promise<void> => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ message: "Missing fields" });
    return;
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken({ id: user.id, role: user.role });

  res
    .clearCookie("token")
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",  // 🔥 обязательно для кросс-доменных запросов
      secure: true,       // 🔥 обязательно для https
    })
    .status(201)
    .json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// POST /api/auth/login
router.post("/login", async (req, res): Promise<void> => {
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

  res
    .clearCookie("token")
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",  // 🔥 обязательно для кросс-доменных запросов
      secure: true,       // 🔥 обязательно для https
    })
    .status(200)
    .json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// POST /api/auth/logout
router.post("/logout", (req, res): void => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  }).status(200).json({ message: "Logged out" });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
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
});

export default router;
