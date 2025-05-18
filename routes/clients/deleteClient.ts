import { Request, Response } from "express";
import { Client } from "../../models/client";
import path from "path";
import fs from "fs";

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    // Удаляем файл профиля, если он существует
    if (client.profile) {
      const filePath = path.join(__dirname, "..", "..", client.profile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Profile file deleted:", filePath);
      }
    }

    await client.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({ error: "Failed to delete client" });
  }
};
