# TaskFlow - System Architecture Diagrams

## Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                               │
│                      (Web Browser/Mobile)                           │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                           HTTP/HTTPS
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                         FRONTEND LAYER                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js Application                      │   │
│  │                  (http://localhost:3000)                    │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Pages (App Router)                                   │ │   │
│  │  │  - Dashboard (page.tsx)                               │ │   │
│  │  │  - Layout (layout.tsx)                                │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Components                                           │ │   │
│  │  │  - TaskCard, TaskModal, Navbar                        │ │   │
│  │  │  - Dashboard Components (Filters, Tabs, Grid, etc)   │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  State Management (Zustand)                           │ │   │
│  │  │  - useTaskStore                                       │ │   │
│  │  │  - tasks, filters, actions                            │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  API Client Layer (Axios)                             │ │   │
│  │  │  - taskAPI.ts                                         │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                          REST API Calls
                       (JSON over HTTP)
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                         BACKEND LAYER                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Express.js Server                        │   │
│  │                  (http://localhost:5000)                    │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Middleware Stack                                     │ │   │
│  │  │  1. CORS                                              │ │   │
│  │  │  2. JSON Parser                                       │ │   │
│  │  │  3. Request Logger                                    │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Routes                                               │ │   │
│  │  │  - /api/tasks (taskRoutes.js)                         │ │   │
│  │  │  - /health                                            │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Validators                                           │ │   │
│  │  │  - express-validator middleware                       │ │   │
│  │  │  - Request body validation                            │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Controllers                                          │ │   │
│  │  │  - taskController.js                                  │ │   │
│  │  │  - Business logic                                     │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Models                                               │ │   │
│  │  │  - Task.js (Mongoose Schema)                          │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Error Handlers                                       │ │   │
│  │  │  - errorHandler.js                                    │ │   │
│  │  │  - notFound.js                                        │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                          Mongoose ODM
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                       DATABASE LAYER                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    MongoDB Database                         │   │
│  │                    (localhost:27017)                        │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  Collections                                          │ │   │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │   │
│  │  │  │  tasks                                          │ │ │   │
│  │  │  │  ├─ _id: ObjectId                               │ │ │   │
│  │  │  │  ├─ title: String                               │ │ │   │
│  │  │  │  ├─ description: String                         │ │ │   │
│  │  │  │  ├─ status: String (enum)                       │ │ │   │
│  │  │  │  ├─ priority: String (enum)                     │ │ │   │
│  │  │  │  ├─ tags: Array<String>                         │ │ │   │
│  │  │  │  ├─ dueDate: Date                               │ │ │   │
│  │  │  │  ├─ createdAt: Date                             │ │ │   │
│  │  │  │  └─ updatedAt: Date                             │ │ │   │
│  │  │  └─────────────────────────────────────────────────┘ │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Request Flow Diagram

### Creating a New Task

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Clicks "New Task"
     ▼
┌─────────────────┐
│   TaskModal     │
│  (Component)    │
└────┬────────────┘
     │ 2. Fill form & Submit
     ▼
┌─────────────────┐
│  useTaskStore   │
│   (Zustand)     │
└────┬────────────┘
     │ 3. addTask(task)
     ▼
┌─────────────────┐
│   taskAPI.ts    │
│   (Axios)       │
└────┬────────────┘
     │ 4. POST /api/tasks
     │    Content-Type: application/json
     │    Body: { title, description, ... }
     ▼
┌─────────────────┐
│ Express Server  │
│  Routes Layer   │
└────┬────────────┘
     │ 5. Route: POST /api/tasks
     ▼
┌─────────────────┐
│   Validators    │
│ (express-       │
│  validator)     │
└────┬────────────┘
     │ 6. Validate request
     ▼
┌─────────────────┐
│  taskController │
│  .createTask()  │
└────┬────────────┘
     │ 7. Business logic
     ▼
┌─────────────────┐
│  Task Model     │
│  (Mongoose)     │
└────┬────────────┘
     │ 8. Task.create()
     ▼
┌─────────────────┐
│    MongoDB      │
│   Database      │
└────┬────────────┘
     │ 9. Insert document
     │ 10. Return created doc
     ▼
┌─────────────────┐
│  Response       │
│  { success,     │
│    data: task } │
└────┬────────────┘
     │ 11. JSON Response
     ▼
┌─────────────────┐
│  useTaskStore   │
│  Update state   │
└────┬────────────┘
     │ 12. Re-render
     ▼
┌─────────────────┐
│   TaskGrid      │
│  Show new task  │
└─────────────────┘
```

## Component Hierarchy

```
App (layout.tsx)
│
├── Navbar
│   └── Brand + Title
│
└── Page (page.tsx)
    │
    ├── DashboardHeader
    │   ├── Title
    │   └── Description
    │
    ├── TaskFilters
    │   ├── Search Input
    │   ├── Priority Select
    │   └── "New Task" Button
    │
    ├── TaskStatusTabs
    │   ├── All Tasks Tab
    │   ├── Todo Tab
    │   ├── In Progress Tab
    │   └── Done Tab
    │
    ├── TaskGrid (if tasks exist)
    │   └── TaskCard[]
    │       ├── Card Header
    │       │   ├── Title
    │       │   ├── Status Chip
    │       │   ├── Priority Chip
    │       │   └── Actions Menu
    │       ├── Card Body
    │       │   ├── Description
    │       │   └── Tags[]
    │       └── Card Footer
    │           ├── Due Date
    │           └── Updated Date
    │
    ├── TaskEmptyState (if no tasks)
    │   ├── Icon
    │   ├── Message
    │   └── Action Buttons
    │       ├── "Create First Task"
    │       └── "Load Sample Data"
    │
    └── TaskModal (conditional)
        ├── Modal Header
        ├── Modal Body
        │   ├── Title Input
        │   ├── Description Textarea
        │   ├── Status Select
        │   ├── Priority Select
        │   ├── Due Date Input
        │   └── Tags Input
        └── Modal Footer
            ├── Cancel Button
            └── Create/Update Button
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    useTaskStore (Zustand)                   │
├─────────────────────────────────────────────────────────────┤
│  State:                                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  - tasks: Task[]                                      │ │
│  │  - searchQuery: string                                │ │
│  │  - filterStatus: TaskStatus | "all"                   │ │
│  │  - filterPriority: string                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Actions:                                                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  - addTask(task)                                      │ │
│  │  - updateTask(id, updatedTask)                        │ │
│  │  - deleteTask(id)                                     │ │
│  │  - setSearchQuery(query)                              │ │
│  │  - setFilterStatus(status)                            │ │
│  │  - setFilterPriority(priority)                        │ │
│  │  - getFilteredTasks()                                 │ │
│  │  - loadSampleData()                                   │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Subscribe
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    React Components                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ TaskFilters│  │ StatusTabs │  │  TaskGrid  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

## API Layer Architecture

```
Frontend (Client)                Backend (Server)
─────────────────               ──────────────────

Zustand Store                   Express Routes
      │                                │
      ├── addTask()              POST /api/tasks
      │        │                       │
      │        └──────► Axios ────────►│
      │                                ▼
      │                         Validator Middleware
      │                                │
      │                                ▼
      │                         taskController.createTask
      │                                │
      │                                ▼
      │                         Task.create() (Mongoose)
      │                                │
      │                                ▼
      │                         MongoDB Insert
      │                                │
      │     Response                   │
      │◄────────────────────────────────┘
      │
      └── Update State
            │
            ▼
      Re-render UI
```

## Database Schema Relationships

```
┌─────────────────────────────────────────┐
│           tasks Collection              │
├─────────────────────────────────────────┤
│  Document Structure:                    │
│                                         │
│  {                                      │
│    _id: ObjectId                        │
│    ├─ Auto-generated                    │
│    └─ Primary Key                       │
│                                         │
│    title: String                        │
│    ├─ Required                          │
│    ├─ Max 200 chars                     │
│    └─ Trimmed                           │
│                                         │
│    description: String                  │
│    ├─ Optional                          │
│    ├─ Max 1000 chars                    │
│    └─ Trimmed                           │
│                                         │
│    status: String                       │
│    ├─ Enum: ['todo', 'in-progress',    │
│    │         'done']                    │
│    └─ Default: 'todo'                   │
│                                         │
│    priority: String                     │
│    ├─ Enum: ['low', 'medium', 'high']  │
│    └─ Default: 'medium│                                         │
│    tags: [String]                       │
│    ├─ Array of strings                  │
│    ├─ Max 10 tags                       │
│    └─ Max 30 chars each                 │
│                                         │
│    dueDate: Date                        │
│    └─ Optional                          │
│                                         │
│    createdAt: Date                      │
│    └─ Auto-generated (timestamps)       │
│                                         │
│    updatedAt: Date                      │
│    └─ Auto-updated (timestamps)         │
│  }                                      │
│                                         │
│  Indexes:                               │
│  ├─ _id: Primary Index                  │
│  ├─ status: Query Optimization          │
│  ├─ priority: Query Optimization        │
│  └─ createdAt: Sorting                  │
└─────────────────────────────────────────┘
```

## Deployment Architecture

### Development Environment

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Developer      │     │   Developer      │     │   Developer      │
│   Machine        │     │   Machine        │     │   Machine        │
│                  │     │                  │     │                  │
│  Frontend:3000   │     │  Frontend:3000   │     │  Frontend:3000   │
│  Backend:5000    │     │  Backend:5000    │     │  Backend:5000    │
│  MongoDB:27017   │     │  MongoDB:27017   │     │  MongoDB:27017   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN / Edge Network                      │
│                    (Static Assets Distribution)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Frontend Hosting                             │
│                  (Vercel / Netlify)                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  - Next.js SSR/SSG                                        │ │
│  │  - Edge Functions                                         │ │
│  │  - Auto-scaling                                           │ │
│  │  - Global CDN                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                       API Requests
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Backend Hosting                              │
│              (Render / Railway / Heroku)                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  - Express.js Server                                      │ │
│  │  - Auto-scaling                                           │ │
│  │  - Load Balancing                                         │ │
│  │  - Health Monitoring                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                       Mongoose ODM
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Database Hosting                             │
│                    (MongoDB Atlas)                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  - Managed MongoDB                                        │ │
│  │  - Automated Backups                                      │ │
│  │  - Replica Sets                                           │ │
│  │  - Multi-region Support                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: February 22, 2026
