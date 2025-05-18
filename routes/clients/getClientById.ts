import { Request, Response } from 'express';
import { Client } from '../../models/client';
import { User } from '../../models/user';

export const getClientById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const client = await Client.findByPk(id, {
      include: [{ model: User, as: "User", attributes: ['name', 'email'] }],
    });

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.status(200).json(client);
  } catch (err: any) {
    console.error('Error fetching client by id:', id, err.message);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};
