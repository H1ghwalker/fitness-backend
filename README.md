Setup for Local Development with Docker
Prerequisites

Docker Desktop (Windows/macOS) or Docker (Linux): Download

Why Two Containers?

The project uses two containers to separate the database (fitness_db) and backend (fitness-backend):
Database (PostgreSQL): Handles data storage.
Backend (Node.js): Runs the application.


This separation mirrors the production architecture on Render, where the database and backend are separate services. It ensures isolation, easier debugging, and scalability.


Clone the repository:
git clone https://github.com/H1ghwalker/fitness-backend.git
cd fitness-backend


Set up environment variables:

Copy the .env.example file to .env:cp .env.example .env


The default DATABASE_URL uses:
User: fitness_user
Password: fitness_password
Database: fitness_db
Port: 5432




Run PostgreSQL and Backend using Docker:

Start the containers:docker-compose up -d --build


Note: Dependencies are installed automatically inside the container (npm install is not required on your machine).
This will start:
PostgreSQL container (fitness_db, port 5432).
Backend container (fitness-backend, port 1337).




Access the backend:

The server will be available at http://localhost:1337.
Test the API:
GET http://localhost:1337/api/clients: List all clients.
POST http://localhost:1337/api/clients: Add a new client (e.g., {"name": "Test Client", "email": "test@example.com", "plan": "Premium Monthly"}).





Testing on Render (Test Environment)

The current Render environment (fitness-backend-hh69) is used as a test environment.
Database: fitness_db_69fw.
After local development, deploy changes to test:git add .
git commit -m "Add new feature"
git push


Test the application at https://fitness-backend-hh69.onrender.com.

Viewing Database Data in TablePlus (Recommended)

Download TablePlus: https://tableplus.com
Local Development:
Host: localhost
Port: 5432
Database: fitness_db
Username: fitness_user
Password: fitness_password
SSL: Disable


Test Environment (Render):
Host: dpg-d01rq63e5dus73bgq0v0-a.frankfurt-postgres.render.com
Port: 5432
Database: fitness_db_69fw
Username: fitness_admin
Password: (get from Render Dashboard)
SSL: Enable (Require)



