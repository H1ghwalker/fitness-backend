import express, { Express, Request, Response, NextFunction } from 'express';
import { Sequelize, DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app: Express = express();
const port: number = parseInt(process.env.PORT || '1337', 10);

// Middleware
app.use(cors({ 
  origin: 
  [
    'http://localhost:3000',
    'https://fitness-frontend-blush.vercel.app'
  ] 
}));
app.use(express.json());

// Connection to PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
});

// Interface for Client model
interface ClientAttributes {
  id?: number;
  name: string;
  email: string;
  goal?: string;
  phone?: string;
  address?: string;
  notes?: string;
  profile?: string;
}

// Client model
class Client extends Model<ClientAttributes> implements ClientAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public goal?: string;
  public phone?: string;
  public address?: string;
  public notes?: string;
  public profile?: string;
}

Client.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  goal: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  notes: { type: DataTypes.STRING },
  profile: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'Client',
  timestamps: false,
});

// Routes
// GET Clients
app.get('/api/clients', async (_req: Request, res: Response): Promise<void> => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// POST Clients
app.post('/api/clients', async (req: Request, res: Response): Promise<void> => {
  const { name, email, goal, phone, address, notes, profile }: ClientAttributes = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  try {
    const client = await Client.create({ name, email, goal, phone, address, notes, profile });
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
app.delete('/api/clients/:id', async (req: Request, res: Response): Promise<void> => {
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

//UPDATE Client (Edit button)
app.put('/api/clients/:id', async (req: Request, res:Response ): Promise<void> =>{
    const { id } = req.params;
    const { name, email, goal, phone, address, notes, profile }: ClientAttributes = req.body;

    try {
        const client = await Client.findByPk(id);
        if (!client) {
            res.status(404).json({ error: 'Client not found '});
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
        });

        res.status(200).json(client);
    }   catch (err:any) {
            if(err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json({ error: 'Email already exists' });
            } else {
                res.status(500).json({ error: 'Failed to update client ' });
            }

        }
});

// GET one Client (View button)
app.get('/api/clients/:id', async (req: Request, res: Response): Promise<void> => {
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
  
// Error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server launch
sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch((err: Error) => {
  console.error('Failed to sync database:', err);
});