import { Request, Response } from 'express';
import { Client } from '../../models/client';
import { User } from '../../models/user';
import { AuthRequest } from '../../middleware/auth';

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  const trainerId = req.user?.id;

  if (!trainerId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const clients = await Client.findAll({
      where: { trainer_id: trainerId },
      include: [{ model: User, as: 'User', attributes: ['name', 'email'] }],
    });

    res.status(200).json(clients);
  } catch (err: any) {
    console.error('Error fetching clients:', err.message);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};
