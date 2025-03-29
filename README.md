
# ihsan 2.0

A comprehensive life management application with Islamic features including tasks, notes, events, and prayer times tracking.

![ihsan 2.0](public/og-image.png)

## Overview

ihsan 2.0 is a holistic life management dashboard designed to help Muslims organize their daily activities while staying connected to their spiritual practices. The name "ihsan" refers to the Islamic concept of excellence and perfection in worship and daily life.

## Features

### Core Features
- **User Authentication**: Secure login/register system
- **Task Management**: Create, organize, and track tasks with priorities and categories
- **Note Taking**: Rich text notes with tagging and categorization
- **Calendar & Events**: Schedule and manage appointments and events
- **Prayer Times**: Track daily prayer schedules
- **Pomodoro Timer**: Stay productive with customizable work/break cycles

### Islamic Features
- **Prayer Times Tracking**: Visual indicators for current and upcoming prayers
- **Life Balance Visualization**: Hexagon chart showing balance across key life areas including spiritual dimensions
- **Integrated Spiritual Reminders**: Seamlessly incorporate worship into daily planning

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: 
  - Zustand for client-side state
  - React Query for server state management
- **Routing**: React Router v6
- **Form Management**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **UI Components**: 
  - Headless UI components from shadcn/ui
  - Lucide React for iconography

### Backend
- **Framework**: NestJS (TypeScript-based Node.js framework)
- **Database**: PostgreSQL with TypeORM for ORM
- **Authentication**: JWT-based authentication
- **Caching**: Redis for improved performance
- **API**: RESTful API architecture

## Documentation

- [Main README](README.md) - Project overview and setup
- [Technical Guide](docs/TECHNICAL_GUIDE.md) - Detailed explanation of UI components and backend architecture

## Project Structure

```
ihsan-2.0/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── calendar/        # Calendar components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── layout/          # Layout components
│   │   ├── notes/           # Notes components
│   │   ├── prayer/          # Prayer time components
│   │   ├── tasks/           # Task management components
│   │   ├── timer/           # Pomodoro timer
│   │   └── ui/              # UI components (shadcn)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and shared code
│   │   ├── api.ts           # API client
│   │   ├── auth.tsx         # Authentication context
│   │   ├── store.ts         # Zustand store
│   │   ├── types.ts         # TypeScript types
│   │   └── utils.ts         # Utility functions
│   ├── pages/               # Main application pages
│   └── main.tsx             # Application entry point
├── backend/                 # NestJS backend code
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── tasks/           # Tasks module
│   │   ├── notes/           # Notes module
│   │   ├── events/          # Events module
│   │   └── users/           # Users module
│   └── main.ts              # Backend entry point
└── package.json             # Project dependencies
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Redis (optional, for caching)

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/ihsan-2.0.git
cd ihsan-2.0
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the example:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```
VITE_API_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the example:
```bash
cp .env.example .env
```

4. Set up your environment variables in the `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=ihsan
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
REDIS_HOST=localhost
REDIS_PORT=6379
```

5. Start the development server:
```bash
npm run start:dev
```

## Key Concepts

### State Management

The application uses Zustand for local state management with persistence:

```typescript
// Example of the Zustand store structure
const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: uuidv4(), createdAt: new Date() }]
      })),
      // Other actions...
    }),
    { name: 'life-dashboard-storage' }
  )
);
```

### Authentication Flow

The authentication system uses JWT tokens stored in localStorage:

1. User submits credentials (email/password)
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Protected routes check for token presence
5. API requests include token in Authorization header
6. Tokens expire after the configured time (default: 1 day)

### Life Balance Visualization

The application features a unique hexagon visualization for life balance:

- Users rate 6 key life areas on a scale of 1-10
- The data is visualized as a hexagon, with each point representing an area
- The visualization helps users identify imbalances and areas for improvement
- Values are stored in the Zustand store for persistence

## Deployment

### Backend Deployment

1. Build the NestJS application:
```bash
cd backend
npm run build
```

2. Start the production server:
```bash
npm run start:prod
```

### Frontend Deployment

1. Build the React application:
```bash
npm run build
```

2. Serve the built files using a static file server or configure your web server to serve the `dist` directory.

## Docker Deployment

The application can also be containerized using Docker:

```bash
# Build and run the frontend
docker build -t ihsan-frontend -f Dockerfile.frontend .
docker run -p 80:80 ihsan-frontend

# Build and run the backend
docker build -t ihsan-backend -f Dockerfile.backend .
docker run -p 3000:3000 ihsan-backend
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide Icons](https://lucide.dev/) for the icon set
- [NestJS](https://nestjs.com/) for the backend framework
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [React Query](https://tanstack.com/query) for data fetching
