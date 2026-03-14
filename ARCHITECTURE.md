# TaskFlow - Project Concept & Architecture

## 📋 Project Concept

**TaskFlow** is a modern, full-stack task management application designed to help individuals and teams organize, track, and manage their tasks efficiently. The application provides an intuitive interface for creating, updating, filtering, and monitoring tasks with various attributes like priority levels, status tracking, tags, and due dates.

### Key Features
- ✅ **CRUD Operations**: Create, Read, Update, Delete tasks
- 🎯 **Priority Management**: Low, Medium, High priority levels
- 📊 **Status Tracking**: Todo, In Progress, Done
- 🏷️ **Tag System**: Organize tasks with custom labels
- 🔍 **Advanced Filtering**: Search and filter by status, priority
- 📅 **Due Date Management**: Set and track task deadlines
- 📱 **Responsive Design**: Mobile-first, works on all devices
- ⚡ **Real-time Updates**: State management with Zustand
- 🎨 **Modern UI**: Beautiful interface with HeroUI components

---

## 🏗️ Overall Architecture

TaskFlow follows a **Client-Server Architecture** with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js 15 (React 19)                  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  UI Layer (HeroUI Components)                │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  State Management (Zustand)                  │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  API Layer (Axios)                           │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                    HTTP/REST API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    SERVER (Backend)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Express.js Server                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Routes Layer                                │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Controllers (Business Logic)                │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Models (Mongoose Schemas)                   │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Middleware (Validation, Error Handling)     │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                    Mongoose ODM
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    DATABASE                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MongoDB                                │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  tasks Collection                            │  │   │
│  │  │  - _id, title, description, status           │  │   │
│  │  │  - priority, tags, dueDate                   │  │   │
│  │  │  - createdAt, updatedAt                      │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture (Client)

### Tech Stack
- **Framework**: Next.js 15.5.6 (App Router)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.x
- **UI Library**: HeroUI 2.8.5
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand 5.0.8
- **HTTP Client**: Axios 1.12.2
- **Build Tool**: Turbopack

### Directory Structure

```
client/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with navbar
│   │   └── page.tsx             # Main dashboard page
│   │
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation component
│   │   ├── Providers.tsx        # HeroUI provider wrapper
│   │   ├── TaskCard.tsx         # Individual task card
│   │   ├── TaskModal.tsx        # Create/Edit task modal
│   │   └── dashboard/
│   │       ├── DashboardHeader.tsx    # Page header
│   │       ├── TaskFilters.tsx        # Search & filters
│   │       ├── TaskStatusTabs.tsx     # Status tabs
│   │       ├── TaskEmptyState.tsx     # Empty state UI
│   │       ├── TaskGrid.tsx           # Task card grid
│   │       └── index.ts               # Barrel export
│   │
│   ├── stores/
│   │   ├── useStore.ts          # Example store
│   │   └── useTaskStore.ts      # Task state management
│   │
│   ├── types/
│   │   ├── task.d.ts            # Task type definitions
│   │   └── store/
│   │       └── useStore.d.ts    # Store types
│   │
│   ├── lib/
│   │   └── api/
│   │       └── taskAPI.ts       # API integration layer
│   │
│   ├── utils/
│   │   └── sampleData.ts        # Mock data for development
│   │
│   ├── config/
│   │   └── hero.ts              # HeroUI theme configuration
│   │
│   ├── constants/
│   │   └── routes.ts            # Route & API constants
│   │
│   └── styles/
│       └── globals.css          # Global styles
│
├── public/                      # Static assets
└── package.json
```

### Component Architecture

```
Page (page.tsx)
├── DashboardHeader
├── TaskFilters
│   ├── Search Input
│   ├── Priority Select
│   └── New Task Button
├── TaskStatusTabs
│   └── Tab (All, Todo, In Progress, Done)
├── TaskEmptyState (conditional)
│   └── Empty state actions
└── TaskGrid (conditional)
    └── TaskCard[]
        ├── Card Header (title, status, priority)
        ├── Card Body (description, tags)
        ├── Card Footer (dates)
        └── Actions Dropdown
            ├── Edit
            └── Delete
```

### State Management (Zustand)

```typescript
TaskStore {
  // State
  tasks: Task[]
  searchQuery: string
  filterStatus: TaskStatus | "all"
  filterPriority: string
  
  // Actions
  addTask(task)
  updateTask(id, updatedTask)
  deleteTask(id)
  setSearchQuery(query)
  setFilterStatus(status)
  setFilterPriority(priority)
  getFilteredTasks()
  loadSampleData()
}
```

### Data Types

```typescript
type TaskStatus = "todo" | "in-progress" | "done"
type TaskPriority = "low" | "medium" | "high"

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  tags: string[]
}
```

---

## ⚙️ Backend Architecture (Server)

### Tech Stack
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 8.0.3
- **Validation**: Express-validator 7.0.1
- **Runtime**: Node.js (ES Modules)
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration

### Directory Structure

```
server/
├── src/
│   ├── index.js                 # Main entry point
│   │
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── env.js               # Environment variables
│   │
│   ├── models/
│   │   └── Task.js              # Mongoose schema & model
│   │
│   ├── controllers/
│   │   └── taskController.js    # Business logic
│   │
│   ├── routes/
│   │   └── taskRoutes.js        # API route definitions
│   │
│   └── middleware/
│       ├── errorHandler.js      # Error handling middleware
│       └── validators.js        # Request validation
│
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── package.json
```

### API Architecture

#### Layered Architecture

```
HTTP Request
      ↓
┌─────────────────┐
│   Routes        │  ← Define endpoints & attach validators
└────────┬────────┘
         ↓
┌─────────────────┐
│   Validators    │  ← Validate request data
└────────┬────────┘
         ↓
┌─────────────────┐
│   Controllers   │  ← Business logic & data processing
└────────┬────────┘
         ↓
┌─────────────────┐
│   Models        │  ← Database operations via Mongoose
└────────┬────────┘
         ↓
┌─────────────────┐
│   MongoDB       │  ← Data persistence
└────────┬────────┘
         ↓
HTTP Response
```

### Database Schema (Mongoose)

```javascript
TaskSchema {
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [String],
  dueDate: Date,
  timestamps: true  // createdAt, updatedAt
}
```

### Middleware Stack

1. **CORS**: Enable cross-origin requests from frontend
2. **Body Parser**: Parse JSON/URL-encoded requests
3. **Request Logger**: Log incoming requests
4. **Route Handlers**: Process business logic
5. **Validation**: Validate input data
6. **Error Handler**: Catch and format errors
7. **Not Found Handler**: Handle 404 errors

---

## 🔄 Data Flow

### Creating a Task

```
User Action (Frontend)
      ↓
1. User clicks "New Task" button
      ↓
2. TaskModal opens with form
      ↓
3. User fills form & clicks "Create"
      ↓
4. Frontend validation (required fields)
      ↓
5. Zustand store: addTask(task)
      ↓
6. API call: POST /api/tasks
      ↓
7. Backend: Validate request data
      ↓
8. Backend: Create Task in MongoDB
      ↓
9. Backend: Return created task
      ↓
10. Frontend: Update Zustand store
      ↓
11. Frontend: Re-render task list
      ↓
12. User sees new task in grid
```

### Filtering Tasks

```
User Action
      ↓
1. User selects priority filter OR types search
      ↓
2. Zustand: setFilterPriority() / setSearchQuery()
      ↓
3. Zustand: getFilteredTasks() computed value
      ↓
4. React: useMemo re-calculates filtered list
      ↓
5. UI: Re-renders TaskGrid with filtered tasks
```

---

## 🌐 API Design

### RESTful Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/tasks` | Get all tasks | - |
| `GET` | `/api/tasks?status=todo` | Get filtered tasks | - |
| `GET` | `/api/tasks?priority=high` | Get by priority | - |
| `GET` | `/api/tasks?search=keyword` | Search tasks | - |
| `GET` | `/api/tasks/:id` | Get single task | - |
| `POST` | `/api/tasks` | Create new task | Task object |
| `PUT` | `/api/tasks/:id` | Update task | Partial task |
| `DELETE` | `/api/tasks/:id` | Delete task | - |
| `GET` | `/health` | Health check | - |

### Request/Response Format

#### Create Task Request
```json
POST /api/tasks
{
  "title": "Design new landing page",
  "description": "Create responsive design",
  "status": "todo",
  "priority": "high",
  "tags": ["design", "frontend"],
  "dueDate": "2026-02-25"
}
```

#### Success Response
```json
{
  "success": true,
  "data": {
    "_id": "65f8a9b2c1d2e3f4a5b6c7d8",
    "title": "Design new landing page",
    "description": "Create responsive design",
    "status": "todo",
    "priority": "high",
    "tags": ["design", "frontend"],
    "dueDate": "2026-02-25T00:00:00.000Z",
    "createdAt": "2026-02-22T10:30:00.000Z",
    "updatedAt": "2026-02-22T10:30:00.000Z"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Task title is required"
    }
  ]
}
```

---

## 🔒 Security & Best Practices

### Backend
- ✅ Input validation with express-validator
- ✅ MongoDB injection protection (Mongoose sanitization)
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Environment variable management
- ✅ Request logging
- ✅ Schema validation at database level

### Frontend
- ✅ TypeScript for type safety
- ✅ Client-side validation before API calls
- ✅ Error boundaries for React components
- ✅ Environment-specific API URLs
- ✅ Proper state management
- ✅ Component isolation and reusability

---

## 🚀 Deployment Architecture

### Development
```
Frontend (localhost:3000) ← → Backend (localhost:5000) ← → MongoDB (localhost:27017)
```

### Production
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Vercel/       │       │   Render/       │       │   MongoDB       │
│   Netlify       │  ←→   │   Railway/      │  ←→   │   Atlas         │
│   (Frontend)    │       │   Heroku        │       │   (Cloud)       │
│   Next.js       │       │   (Backend)     │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 📊 Performance Considerations

### Frontend
- **Code Splitting**: Next.js automatic code splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: useMemo for filtered tasks
- **Optimistic Updates**: Immediate UI feedback
- **Debouncing**: Search input debouncing

### Backend
- **Database Indexing**: Index on frequently queried fields
- **Query Optimization**: Efficient MongoDB queries
- **Connection Pooling**: Mongoose connection management
- **Pagination**: (Future enhancement)
- **Caching**: (Future enhancement with Redis)

---

## 🔮 Future Enhancements

### Phase 2
- [ ] User authentication (JWT)
- [ ] Multi-user support
- [ ] Task assignment
- [ ] Real-time updates (WebSockets)
- [ ] File attachments

### Phase 3
- [ ] Task comments
- [ ] Activity history
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Export/Import functionality

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] Collaboration features
- [ ] Advanced search
- [ ] Custom workflows

---

## 📝 Development Workflow

```
1. Plan Feature
      ↓
2. Define Types (TypeScript)
      ↓
3. Create Database Model (Mongoose)
      ↓
4. Build API Endpoint (Express)
      ↓
5. Create Frontend Components (React)
      ↓
6. Integrate with Zustand Store
      ↓
7. Test API & UI
      ↓
8. Deploy
```

---

## 🛠️ Technology Decisions

### Why Next.js?
- Server-side rendering capabilities
- Built-in routing
- Excellent developer experience
- Production-ready optimizations
- Large ecosystem

### Why HeroUI?
- Beautiful, modern components
- Tailwind CSS integration
- TypeScript support
- Accessible by default
- Extensive component library

### Why Zustand?
- Minimal boilerplate
- Simple API
- Great TypeScript support
- No provider wrapper needed
- Small bundle size

### Why Express + MongoDB?
- **Express**: Minimal, flexible, battle-tested
- **MongoDB**: Schema flexibility, JSON-native
- **Mongoose**: Type safety, validation, middleware
- Perfect for rapid prototyping and scaling

---

**Built with ❤️ using modern web technologies**
