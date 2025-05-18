import { Router, Request, Response } from "express";
import { Client } from "../models/client"
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { AuthRequest, requireAuth, requireRole } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// GET /api/clients - Только свои клиенты
router.get("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "Trainer") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const clients = await Client.findAll({
      where: { trainer_id: req.user.id },
      include: [{ model: User, as: "User", attributes: ["name", "email"] }],
    });

    res.status(200).json(clients);
  } catch (err: any) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// GET /api/clients/:id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const client = await Client.findOne({
      where: { user_id: id },
      include: [{ model: User, as: "User", attributes: ["name", "email"] }],
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.status(200).json(client);
  } catch (err: any) {
    console.error("Error fetching client:", err);
    res.status(500).json({ error: "Failed to fetch client" });
  }
});

// POST /api/clients
router.post(
  "/",
  requireAuth,
  requireRole("Trainer"),
  upload.single("profile"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const trainerId = req.user?.id;
    const {
      name,
      email,
      goal,
      phone,
      address,
      notes,
      plan,
      type,
      nextSession,
    } = req.body;

    const profile = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required" });
      return;
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: "Email already exists" });
        return;
      }

      const passwordHash = await bcrypt.hash("default123", 10);
      const user = await User.create({
        name,
        email,
        passwordHash,
        role: "Client",
      });

      const client = await Client.create({
        user_id: user.id,
        goal,
        phone,
        address,
        notes,
        profile,
        plan,
        type: type === "One-time" ? "One-time" : "Subscription",
        nextSession,
        trainer_id: trainerId,
      });

      res.status(201).json({
        ...client.toJSON(),
        name,
        email,
        role: "Client",
      });
    } catch (err: any) {
      console.error("Error creating client:", err);
      res.status(500).json({ error: "Failed to create client" });
    }
  }
);

// PUT /api/clients/:id
router.put("/:id", upload.single("profile"), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, goal, phone, address, notes, plan, nextSession } = req.body;
  const profile = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const client = await Client.findByPk(id, {
      include: [{ model: User, as: "User", attributes: ["name", "email"] }],
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    // Удаление старого профиля
    if (profile && client.profile) {
      const oldPath = path.join(__dirname, "..", client.profile);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Обновление User
    await User.update({ name, email }, { where: { id: client.user_id } });

    // Обновление Client
    await client.update({
      goal,
      phone,
      address,
      notes,
      profile: profile ?? client.profile,
      plan,
      type: "Subscription",
      nextSession,
    });

    await client.reload();

    res.status(200).json({
      ...client.toJSON(),
      name,
      email,
      role: "Client",
    });
  } catch (err: any) {
    console.error("Error updating client:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Failed to update client" });
    }
  }
});

// DELETE /api/clients/:id
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    if (client.profile) {
      const filePath = path.join(__dirname, "..", client.profile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await client.destroy();
    res.status(204).send();
  } catch (err: any) {
    console.error("Error deleting client:", err);
    res.status(500).json({ error: "Failed to delete client" });
  }
});

export default router;
