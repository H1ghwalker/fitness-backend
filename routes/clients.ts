import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Client } from '../models/Client';
import fs from 'fs';
import path from 'path';

// Настройка multer для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    console.log('Upload path:', uploadPath);
    // Проверяем, существует ли папка uploads
    if (!fs.existsSync(uploadPath)) {
      console.log('Creating uploads directory');
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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
router.post('/', upload.single('profile'), async (req: Request, res: Response): Promise<void> => {
  console.log('Received POST /api/clients request');
  console.log('Body:', req.body);
  console.log('File:', req.file);

  const { name, email, goal, phone, address, notes, plan, nextSession } = req.body;
  const profile = req.file ? `/uploads/${req.file.filename}` : undefined;

  // Проверяем, сохранён ли файл
  if (req.file) {
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    console.log('Checking if file exists:', filePath);
    if (fs.existsSync(filePath)) {
      console.log('File saved successfully:', filePath);
    } else {
      console.log('File not found after saving:', filePath);
    }
  }

  if (!name || !email) {
    console.log('Validation failed: Name or email missing');
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  try {
    const clientData = {
      name,
      email,
      goal: goal || undefined,
      phone: phone || undefined,
      address: address || undefined,
      notes: notes || undefined,
      profile,
      plan: plan || undefined,
      nextSession: nextSession || undefined,
    };
    console.log('Client data to create:', clientData);
    const client = await Client.create(clientData);
    console.log('Client created:', client);
    res.status(201).json(client);
  } catch (err: any) {
    console.error('Error details:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      console.log('Error: Email already exists');
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.log('Error creating client:', err.message);
      res.status(500).json({ error: 'Failed to create client: ' + err.message });
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
router.put('/:id', upload.single('profile'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, goal, phone, address, notes, plan, nextSession } = req.body;
  const profile = req.file ? `/uploads/${req.file.filename}` : undefined;

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