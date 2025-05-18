import { Response } from "express";
import { Client } from "../../models/client";
import { User } from "../../models/user";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../../middleware/auth";

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  const trainerId = req.user?.id;
  if (!trainerId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

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

    const hashedPassword = await bcrypt.hash("default123", 10);
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: "Client",
    });

    const client = await Client.create({
      user_id: user.id,
      goal: goal || undefined,
      phone: phone || undefined,
      address: address || undefined,
      notes: notes || undefined,
      profile,
      plan: plan || undefined,
      type: type === "One-time" ? "One-time" : "Subscription",
      nextSession: nextSession || undefined,
      trainer_id: trainerId,
    });

    res.status(201).json({
      ...client.toJSON(),
      name,
      email,
      role: "Client",
    });
  } catch (err: any) {
    console.error("Error creating client:", err.message, err.stack);
    res.status(500).json({ error: "Failed to create client", details: err.message });
  }
};
