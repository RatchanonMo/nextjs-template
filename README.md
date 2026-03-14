# TaskFlow - Full Stack Task Management

Complete task management application with Next.js frontend and Express + MongoDB backend.

## � Documentation

- **[Quick Reference Guide](./QUICK-REFERENCE.md)** - Developer quick reference for daily work
- **[Architecture Guide (English)](./ARCHITECTURE.md)** - Detailed system architecture and design
- **[คู่มือสถาปัตยกรรม (ไทย)](./ARCHITECTURE.th.md)** - เอกสารสถาปัตยกรรมระบบภาษาไทย
- **[Architecture Diagrams](./DIAGRAMS.md)** - Visual system architecture diagrams

## �🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- pnpm (or npm/yarn)

### Setup

1. **Clone and install frontend dependencies**
```bash
pnpm install
```

2. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

3. **Setup environment variables**

Frontend (root directory):
```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

Backend (server directory):
```bash
cd server
cp .env.example .env
# Edit .env if needed
```

4. **Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas and update MONGODB_URI in server/.env
```

5. **Start both servers**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
pnpm dev
```

Visit: http://localhost:3000

## 📂 Project Structure

```
nextjs-template/
├── src/                    # Frontend source
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── stores/            # Zustand state management
│   ├── lib/               # API client & utilities
│   └── types/             # TypeScript types
├── server/                # Backend source
│   └── src/
│       ├── config/        # Configuration
│       ├── controllers/   # Business logic
│       ├── middleware/    # Express middleware
│       ├── models/        # MongoDB models
│       └── routes/        # API routes
└── README.md
```

## 🔌 Connecting Frontend to Backend

The frontend is already configured to use the backend API. The Zustand store can be updated to use real API calls:

### Example: Update Zustand Store

```typescript
// src/stores/useTaskStore.ts
import { taskAPI } from "@/lib/api/taskAPI";

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  // Fetch tasks from API
  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskAPI.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      set({ isLoading: false });
    }
  },

  // Create task via API
  addTask: async (task) => {
    try {
      const newTask = await taskAPI.createTask(task);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  },

  // ... similar for update and delete
}));
```

## 🛠️ Tech Stack

### Frontend
- Next.js 15 with App Router
- React 19
- TypeScript
- HeroUI (UI Components)
- Zustand (State Management)
- Tailwind CSS 4
- Axios (HTTP Client)

### Backend
- Express.js
- MongoDB with Mongoose
- Express Validator
- CORS

## 📚 API Documentation

See [server/README.md](server/README.md) for complete API documentation.

## 🎯 Features

- ✅ Create, read, update, delete tasks
- 🎨 Modern, responsive UI with HeroUI
- 🔍 Search and filter tasks
- 🏷️ Tag system
- 📊 Task statistics
- ⚡ Fast performance
- 🔄 Real-time updates

## 📝 Available Scripts

### Frontend
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Backend
```bash
npm run dev       # Start development server with nodemon
npm start         # Start production server
```

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🚢 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`

### Backend (Railway/Render/Heroku)
1. Push server directory to GitHub
2. Deploy to your platform
3. Add environment variables
4. Update frontend `NEXT_PUBLIC_API_URL`

## 📄 License

MIT
