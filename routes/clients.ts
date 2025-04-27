import { Router, Request, Response } from 'express';
import { Client } from '../models/Client';

const router = Router();

// GET Clients
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// POST Clients
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, email, goal, phone, address, notes, profile, plan, nextSession } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  try {
    const client = await Client.create({ name, email, goal, phone, address, notes, profile, plan, nextSession });
    res.status(201).json(client);
  } catch (err: any) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create client' });
    }
  }
});

// DELETE Client
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    await client.destroy();
    res.status(204).send();
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// UPDATE Client (Edit button)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, goal, phone, address, notes, profile, plan, nextSession } = req.body;

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    await client.update({
      name: name || client.name,
      email: email || client.email,
      goal: goal !== undefined ? goal : client.goal,
      phone: phone !== undefined ? phone : client.phone,
      address: address !== undefined ? address : client.address,
      notes: notes !== undefined ? notes : client.notes,
      profile: profile !== undefined ? profile : client.profile,
      plan: plan !== undefined ? plan : client.plan,
      nextSession: nextSession !== undefined ? nextSession : client.nextSession,
    });

    res.status(200).json(client);
  } catch (err: any) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update client' });
    }
  }
});

// GET one Client (View button)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.status(200).json(client);
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

export default router;