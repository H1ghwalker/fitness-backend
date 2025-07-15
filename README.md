# Fitness Backend

Express.js backend for fitness trainer application with PostgreSQL and Sequelize.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitness_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=3001
```

3. Run database migrations:
```bash
# Apply the weightDate migration
psql -h localhost -U your_username -d fitness_db -f migrations/add_weight_date_to_clients.sql
```

4. Start the server:
```bash
npm run dev
```

## Database Migrations

### Adding weightDate field to clients table

To track when a trainer added weight to a client's profile, run:

```bash
psql -h localhost -U your_username -d fitness_db -f migrations/add_weight_date_to_clients.sql
```

This will:
- Add `weightDate` TIMESTAMP column to the `clients` table
- Set current timestamp for existing clients who have weight specified
- Enable automatic tracking of weight entry dates for new/updated clients

## API Endpoints

- `GET /api/clients` - Get all clients for trainer
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client (automatically sets weightDate when weight changes)
- `DELETE /api/clients/:id` - Delete client

## Features

- **Automatic weightDate tracking**: When a trainer updates a client's weight in their profile, the system automatically records the date and time of this change
- **Progress tracking integration**: The weightDate is used in progress tracking to show the actual date when the weight was first recorded
- **Backward compatibility**: Existing clients with weight will have weightDate set to current timestamp



