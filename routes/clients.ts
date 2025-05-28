import { Router } from "express";
import { Client } from "../models/client";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { AuthRequest, requireAuth, requireRole } from "../middleware/auth";
import { upload } from "../middleware/upload";
import logger from "../utils/logger";

const router = Router();

const isTrainerAndOwnsClient = (req: AuthRequest, client: Client): boolean => {
  return req.user?.role === "Trainer" && client.trainer_id === req.user.id;
};

const deleteFileIfExists = (relativePath: string) => {
  const filePath = path.join(__dirname, "..", relativePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== "Trainer") {
      logger.warn('Unauthorized access attempt', {
        userId: req.user?.id,
        role: req.user?.role,
        endpoint: '/clients'
      });
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const clients = await Client.findAll({
      where: { trainer_id: req.user.id },
      include: [
        {
          model: User,
          as: "User", // Заменено на правильный alias из index.ts
          attributes: ["name", "email"],
        }
      ],
    });

    logger.info('Clients fetched successfully', {
      trainerId: req.user.id,
      clientCount: clients.length
    });

    res.status(200).json(clients);
  } catch (err) {
    logger.error('Error fetching clients', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      trainerId: req.user?.id
    });
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "User", // Заменено на правильный alias из index.ts
          attributes: ["name", "email"],
        }
      ],
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    if (!isTrainerAndOwnsClient(req, client)) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.status(200).json(client);
  } catch (err) {
    console.error("Error fetching client by id:", err);
    res.status(500).json({ error: "Failed to fetch client" });
  }
});

router.post(
  "/",
  requireAuth,
  requireRole("Trainer"),
  upload.single("profile"),
  async (req: AuthRequest, res) => {
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

    logger.info('Creating new client', {
      trainerId: req.user?.id,
      clientEmail: email,
      plan: plan
    });

    if (!name || !email) {
      logger.warn('Invalid client creation attempt', {
        missingFields: !name ? 'name' : 'email',
        trainerId: req.user?.id
      });
      res.status(400).json({ error: "Name and email are required" });
      return;
    }

    const profile = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        logger.warn('Duplicate email attempt', {
          email,
          trainerId: req.user?.id
        });
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
        trainer_id: req.user!.id,
      });

      logger.info('Client created successfully', {
        clientId: client.id,
        trainerId: req.user?.id,
        plan: plan
      });

      res.status(201).json({
        ...client.toJSON(),
        name,
        email,
        role: "Client",
      });
    } catch (err) {
      logger.error('Error creating client', {
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        trainerId: req.user?.id,
        clientEmail: email
      });
      res.status(500).json({ error: "Failed to create client" });
    }
  }
);

router.put("/:id", requireAuth, upload.single("profile"), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, email, goal, phone, address, notes, plan, nextSession } = req.body;
  const profile = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const client = await Client.findByPk(id, {
      include: [
        {
          model: User,
          as: "User", // Заменено на правильный alias из index.ts
          attributes: ["name", "email"],
        }
      ],
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    if (!isTrainerAndOwnsClient(req, client)) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    if (profile && client.profile) {
      deleteFileIfExists(client.profile);
    }

    await User.update({ name, email }, { where: { id: client.user_id } });

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

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    if (!isTrainerAndOwnsClient(req, client)) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    if (client.profile) {
      deleteFileIfExists(client.profile);
    }

    await client.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({ error: "Failed to delete client" });
  }
});

export default router;
