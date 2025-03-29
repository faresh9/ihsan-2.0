# ihsan 2.0 Technical Guide

This document provides an in-depth explanation of the UI components and backend architecture for the ihsan 2.0 application.

## Table of Contents
- [UI Components](#ui-components)
  - [Layout Components](#layout-components)
  - [Authentication Components](#authentication-components)
  - [Dashboard Components](#dashboard-components)
  - [Task Components](#task-components)
  - [Note Components](#note-components)
  - [Calendar Components](#calendar-components)
  - [Prayer Components](#prayer-components)
  - [Timer Components](#timer-components)
  - [UI Component Library](#ui-component-library)
- [Backend Architecture](#backend-architecture)
  - [NestJS Modules](#nestjs-modules)
  - [Authentication System](#authentication-system)
  - [Database Models](#database-models)
  - [API Routes](#api-routes)
  - [Services](#services)
  - [Middleware and Guards](#middleware-and-guards)
  - [Caching Strategy](#caching-strategy)

## UI Components

### Layout Components

#### Dashboard Layout (`src/components/layout/Dashboard.tsx`)
The main layout component that wraps all authenticated pages. It provides:
- A consistent background with gradient and pattern
- Header with navigation and user controls
- Glass morphism effect for the main content area
- Animation effects for page transitions

```typescript
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="absolute inset-0 w-full h-full grid-pattern"></div>
      <Header />
      <main className="pt-16 relative z-10 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass rounded-xl p-6 shadow-xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
```

#### Header (`src/components/layout/Header.tsx`)
The application header that provides:
- Logo and brand identity
- Main navigation links
- User account dropdown
- Responsive mobile menu for smaller screens
- Visual feedback for the currently active route

### Authentication Components

#### LoginForm (`src/components/auth/LoginForm.tsx`)
Handles user authentication with:
- Email and password input fields with validation
- Error state handling
- "Remember me" option
- Link to registration page
- Client-side form validation

#### RegisterForm (`src/components/auth/RegisterForm.tsx`)
Handles new user registration with:
- Fields for name, email, and password
- Password strength indicators
- Terms of service agreement
- Client-side form validation

#### ProtectedRoute (`src/components/auth/ProtectedRoute.tsx`)
Acts as a guard for authenticated routes:
- Checks authentication status using `useAuth()` hook
- Redirects unauthenticated users to login page
- Shows loading state during authentication check
- Renders children only when authentication is confirmed

```typescript
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : null;
};
```

### Dashboard Components

#### WelcomeMessage (`src/components/dashboard/WelcomeMessage.tsx`)
Provides a personalized greeting:
- Shows different greeting based on time of day
- Addresses the user by their first name
- Includes quick action buttons to navigate to key features
- Uses animation for a welcoming feel

#### LifeBalanceHexagon (`src/components/dashboard/LifeBalanceHexagon.tsx`)
Visualizes the user's life balance:
- SVG-based hexagon chart with six dimensions of life
- Interactive sliders to adjust each area's value
- Color-coded areas for visual distinction
- Info tooltips explaining each life dimension
- Calculates and displays overall life balance score

```typescript
// SVG hexagon generation logic
const generatePolygonPoints = () => {
  return lifeBalanceAreas.map((area, index) => {
    const angle = (Math.PI * 2 * index) / lifeBalanceAreas.length - Math.PI / 2;
    const radius = (area.value / 10) * 90; // 90% of the available space
    const x = 100 + Math.cos(angle) * radius;
    const y = 100 + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(' ');
};
```

#### QuickAdd (`src/components/dashboard/QuickAdd.tsx`)
Provides a shortcut to add new items:
- Multi-purpose input field
- Contextual actions based on input
- Can quickly add tasks, notes, or events
- Uses natural language processing for date detection

#### RecentActivity (`src/components/dashboard/RecentActivity.tsx`)
Shows recent user activity:
- Timeline of recent tasks, notes, and events
- Chronologically sorted with relative timestamps
- Visual indicators for activity types
- Interactive links to related items

### Task Components

#### TaskList (`src/components/tasks/TaskList.tsx`)
Displays and manages task items:
- Sortable and filterable task list
- Checkbox for completion status
- Priority indicators
- Due date displays with visual cues for approaching deadlines
- Category badges
- Batch action capabilities (delete, categorize)

```typescript
// Task filtering logic example
const filteredTasks = useMemo(() => {
  return tasks
    .filter(task => {
      if (filterStatus === 'completed') return task.completed;
      if (filterStatus === 'incomplete') return !task.completed;
      return true; // 'all' status
    })
    .filter(task => {
      if (!filterCategory) return true;
      return task.category === filterCategory;
    })
    .filter(task => {
      if (!searchTerm) return true;
      return task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    });
}, [tasks, filterStatus, filterCategory, searchTerm]);
```

### Note Components

#### NotesList (`src/components/notes/NotesList.tsx`)
Manages user notes:
- Grid or list view of notes
- Rich text preview
- Tag display
- Creation/update timestamps
- Search and filter capabilities
- Card-based UI with hover effects

### Calendar Components

#### Calendar (`src/components/calendar/Calendar.tsx`)
Full calendar view with:
- Month, week, and day view options
- Event display with color coding
- Drag and drop event management
- Event creation through clicking on time slots
- Today button for quick navigation
- Mini-month navigator

#### CalendarDay (`src/components/calendar/CalendarDay.tsx`)
Day cell component with:
- Date display with current day highlighting
- Event indicators
- Overflow handling for days with many events
- Click handler for day selection

#### EventItem (`src/components/calendar/EventItem.tsx`)
Visual representation of calendar events:
- Category color indicator
- Time and title display
- Interactive with click support
- Truncation for long titles
- Visual cues for all-day events

#### EventsList (`src/components/calendar/EventsList.tsx`)
List view of calendar events:
- Chronological sorting
- Grouping by date
- Status indicators (past, current, upcoming)
- Search and filter options
- Expandable event details

#### AddEventDialog (`src/components/calendar/AddEventDialog.tsx`)
Modal for creating and editing events:
- Date and time pickers with validation
- Title and description fields
- Category selector with color preview
- All-day event toggle
- Location input with optional geocoding
- Repeating event options

#### ViewEventDialog (`src/components/calendar/ViewEventDialog.tsx`)
Modal for viewing event details:
- All event information in a formatted view
- Edit and delete options
- Sharing capabilities
- Related tasks/notes links

### Prayer Components

#### PrayerTimes (`src/components/prayer/PrayerTimes.tsx`)
Displays Islamic prayer times:
- Current time indicator
- Next prayer highlighting
- Countdown to next prayer
- Arabic names with transliteration
- Optional notification settings
- Prayer status (upcoming, current, missed)

```typescript
// Logic to determine next prayer time
const determineNextPrayer = () => {
  const now = new Date();
  const upcomingPrayers = prayerTimes
    .filter(prayer => prayer.time > now)
    .sort((a, b) => a.time.getTime() - b.time.getTime());
  
  return upcomingPrayers.length > 0 ? upcomingPrayers[0] : null;
};
```

### Timer Components

#### PomodoroTimer (`src/components/timer/PomodoroTimer.tsx`)
Productivity timer with:
- Work and break intervals
- Visual countdown
- Progress indicator
- Sound notifications
- Session tracking
- Customizable duration settings
- Pause, resume, and reset controls

### UI Component Library

The application uses the `shadcn/ui` component library, which provides a set of accessible, customizable, and reusable components. Key components include:

#### Button (`src/components/ui/button.tsx`)
Versatile button component with:
- Multiple variants (default, destructive, outline, etc.)
- Size options (default, sm, lg, icon)
- Loading state
- Icon support
- Disabled state styling

#### Card (`src/components/ui/card.tsx`)
Container component with:
- Header, content, and footer sections
- Consistent styling
- Title and description subcomponents
- Border and shadow effects

#### Dialog (`src/components/ui/dialog.tsx`)
Modal dialog with:
- Focus trapping
- Keyboard navigation (ESC to close)
- Animated transitions
- Backdrop with click-away
- Title, description, and action areas

#### Form components
Various form elements including:
- Input
- Checkbox
- RadioGroup
- Select
- Textarea
- Switch
- Slider

#### Calendar (`src/components/ui/calendar.tsx`)
Date picker component with:
- Month navigation
- Day selection
- Range selection support
- Disabled dates
- Customizable appearance

#### Progress (`src/components/ui/progress.tsx`)
Progress indicator with:
- Animated fill
- Percentage value
- Customizable colors
- Accessible labeling

## Backend Architecture

### NestJS Modules

The backend is organized into modules, each handling a specific domain:

#### AppModule (`backend/src/app.module.ts`)
The root module that imports all other modules:
- Configures database connection
- Sets up authentication
- Registers global middleware
- Imports feature modules

#### AuthModule (`backend/src/auth/auth.module.ts`)
Handles all authentication-related functionality:
- User login and registration
- JWT token generation and validation
- Password hashing and verification
- Protection strategies for routes

```typescript
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

#### UsersModule (`backend/src/users/users.module.ts`)
Manages user profiles and credentials:
- User creation and management
- User data retrieval
- Password encryption
- User preferences

#### TasksModule (`backend/src/tasks/tasks.module.ts`)
Handles task management:
- CRUD operations for tasks
- Task categorization
- Task completion tracking
- Due date management
- Task filtering and searching

#### NotesModule (`backend/src/notes/notes.module.ts`)
Manages note functionality:
- Note creation and storage
- Rich text support
- Note categorization
- Tagging system
- Search capabilities

#### EventsModule (`backend/src/events/events.module.ts`)
Handles calendar events:
- Event scheduling
- Recurring events
- Date-based queries
- Event notifications
- Event categories

### Authentication System

The authentication system uses Passport.js with JWT tokens:

#### Local Strategy (`backend/src/auth/strategies/local.strategy.ts`)
Validates user credentials:
- Email and password verification
- User lookup
- Password hashing comparison
- Error handling for invalid credentials

```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

#### JWT Strategy (`backend/src/auth/strategies/jwt.strategy.ts`)
Handles token validation:
- JWT extraction from request
- Token verification
- User identity extraction
- Attaching user to request object

#### Guards
Protect routes based on authentication status:
- `JwtAuthGuard`: Ensures valid JWT token
- `LocalAuthGuard`: Validates username/password
- Custom role-based guards

### Database Models

The application uses TypeORM entities to define database schema:

#### User Entity (`backend/src/users/entities/user.entity.ts`)
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  @OneToMany(() => Note, note => note.user)
  notes: Note[];

  @OneToMany(() => Event, event => event.user)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Task Entity (`backend/src/tasks/entities/task.entity.ts`)
Defines the task database model:
- UUID primary key
- Title and description
- Completion status
- Due date and creation timestamp
- Priority level
- Category reference
- User relationship

#### Note Entity (`backend/src/notes/entities/note.entity.ts`)
Defines the note database model:
- UUID primary key
- Title and content fields
- Tags array
- Creation and update timestamps
- Category reference
- User relationship

#### Event Entity (`backend/src/events/entities/event.entity.ts`)
Defines the calendar event model:
- UUID primary key
- Title and description
- Start and end times
- All-day flag
- Location field
- Category and color
- User relationship

### API Routes

The application exposes RESTful API endpoints:

#### Authentication Routes
- `POST /auth/register`: Create new user account
- `POST /auth/login`: Authenticate and receive JWT token
- `POST /auth/refresh`: Get new token using refresh token

#### User Routes
- `GET /users/me`: Get current user profile
- `PATCH /users/me`: Update user profile
- `PUT /users/me/password`: Change password

#### Task Routes
- `GET /tasks`: List all tasks (with filtering)
- `GET /tasks/:id`: Get specific task
- `POST /tasks`: Create new task
- `PATCH /tasks/:id`: Update task
- `DELETE /tasks/:id`: Delete task
- `PATCH /tasks/:id/complete`: Toggle completion status

#### Note Routes
- `GET /notes`: List all notes (with filtering)
- `GET /notes/:id`: Get specific note
- `POST /notes`: Create new note
- `PATCH /notes/:id`: Update note
- `DELETE /notes/:id`: Delete note
- `GET /notes/tags`: Get all unique tags

#### Event Routes
- `GET /events`: List all events
- `GET /events/month`: Get events for specific month
- `GET /events/:id`: Get specific event
- `POST /events`: Create new event
- `PATCH /events/:id`: Update event
- `DELETE /events/:id`: Delete event

### Services

Services contain the business logic for each feature:

#### AuthService (`backend/src/auth/auth.service.ts`)
Handles authentication logic:
- User validation
- Token generation
- Password comparison
- User registration

```typescript
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
```

#### TasksService (`backend/src/tasks/tasks.service.ts`)
Implements task management logic:
- CRUD operations
- Task filtering and sorting
- Task completion logic
- Task categorization

#### NotesService (`backend/src/notes/notes.service.ts`)
Implements note management:
- CRUD operations
- Rich text handling
- Tag management
- Search functionality

#### EventsService (`backend/src/events/events.service.ts`)
Handles event management:
- CRUD operations
- Date range queries
- Recurring event pattern
- Event notifications

### Middleware and Guards

The application uses various middleware for request handling:

#### Global Middleware
- Request logging
- CORS configuration
- Body parsing
- Rate limiting

#### Guards
Protect routes based on authentication and authorization:
- `JwtAuthGuard`: Ensures valid JWT token
- `RolesGuard`: Role-based access control
- Custom feature-specific guards

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    return super.canActivate(context);
  }
}
```

### Caching Strategy

The application uses Redis for caching:

#### Cache Module Setup
```typescript
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        ttl: 300, // 5 minutes default TTL
      }),
      inject: [ConfigService],
    }),
    // Other imports...
  ],
  // ...
})
```

#### Cache Strategies
- Cache invalidation on updates
- Route-specific cache rules
- User-specific cache keys
- Cache-Control headers
- Conditional response caching

#### Example Cache Implementation
```typescript
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(userId: string): Promise<Note[]> {
    const cacheKey = `notes_user_${userId}`;
    const cachedNotes = await this.cacheManager.get(cacheKey);
    
    if (cachedNotes) {
      return cachedNotes as Note[];
    }
    
    const notes = await this.notesRepository.find({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
    });
    
    await this.cacheManager.set(cacheKey, notes, { ttl: 300 });
    return notes;
  }

  async create(createNoteDto: CreateNoteDto, user: User): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      user,
    });
    
    const savedNote = await this.notesRepository.save(note);
    await this.cacheManager.del(`notes_user_${user.id}`);
    
    return savedNote;
  }
}
```

## Advanced Topics

### Error Handling Strategy

The backend implements a comprehensive error handling strategy:

#### HTTP Exception Filters
Global filter that transforms exceptions into HTTP responses:
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? exceptionResponse.message
        : exception.message;
    }
    
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

#### Validation Pipes
Transform and validate incoming data:
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const messages = errors.map(err => 
        Object.values(err.constraints).join(', ')
      );
      return new BadRequestException(messages);
    },
  }),
);
```

### Database Transaction Management

The backend implements transaction management for data integrity:

```typescript
async transferTaskToAnotherCategory(taskId: string, newCategoryId: string, userId: string) {
  return this.connection.transaction(async manager => {
    const task = await manager.findOne(Task, {
      where: { id: taskId, user: { id: userId } },
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    const category = await manager.findOne(Category, {
      where: { id: newCategoryId, user: { id: userId } },
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    task.category = category;
    return manager.save(task);
  });
}
```
