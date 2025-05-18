import { Request, Response } from "express";
import { Client } from "../../models/client";
import { User } from "../../models/user";
import path from "path";
import fs from "fs";

export const updateClient = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, goal, phone, address, notes, plan, nextSession } = req.body;
  const profile = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const client = await Client.findByPk(id, {
      include: [{ model: User, attributes: ["name", "email"] }],
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    // Удаляем старый файл профиля, если загружается новый
    if (profile && client.profile) {
      const oldFilePath = path.join(__dirname, "..", "..", client.profile);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("Old profile file deleted:", oldFilePath);
      }
    }

    // Обновляем имя и email в таблице пользователей
    await User.update({ name, email }, { where: { id: client.user_id } });

    // Обновляем клиента
    await client.update({
      goal: goal ?? client.goal,
      phone: phone ?? client.phone,
      address: address ?? client.address,
      notes: notes ?? client.notes,
      profile: profile ?? client.profile,
      plan: plan ?? client.plan,
      type: "Subscription",
      nextSession: nextSession ?? client.nextSession,
    });

    await client.reload();

    res.status(200).json({
      ...client.toJSON(),
      name,
      email,
      role: "Client",
    });
  } catch (err: any) {
    console.error("Error updating client:", err.message, err.stack);
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Failed to update client" });
    }
  }
};
