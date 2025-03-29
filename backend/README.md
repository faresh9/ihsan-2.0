
# ihsan 2.0 Backend

This is the NestJS backend for the ihsan 2.0 application.

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Redis server

## Setup

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Copy the example environment file: `cp .env.example .env`
5. Update the `.env` file with your database and Redis connection details
6. Start the development server: `npm run start:dev`

## Environment Variables

Create a `.env` file with the following variables:

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ihsan

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user

### Tasks

- `GET /tasks` - Get all tasks for the authenticated user
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Notes

- `GET /notes` - Get all notes for the authenticated user
- `GET /notes/:id` - Get a specific note
- `POST /notes` - Create a new note
- `PATCH /notes/:id` - Update a note
- `DELETE /notes/:id` - Delete a note

### Events

- `GET /events` - Get all events for the authenticated user
- `GET /events/month?date=YYYY-MM-DD` - Get events for a specific month
- `GET /events/:id` - Get a specific event
- `POST /events` - Create a new event
- `PATCH /events/:id` - Update an event
- `DELETE /events/:id` - Delete an event

## Database Schema

The application uses the following database tables:

- `user` - User accounts
- `task` - User tasks
- `note` - User notes
- `event` - User calendar events
