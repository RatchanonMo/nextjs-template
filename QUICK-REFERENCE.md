# TaskFlow - Quick Reference Guide

## 🚀 Project Overview

**TaskFlow** is a full-stack task management application built with:
- **Frontend**: Next.js 15 + React 19 + TypeScript + HeroUI + Zustand
- **Backend**: Express.js + MongoDB + Mongoose
- **Architecture**: RESTful API, Client-Server Model

---

## 📁 Project Structure

```
taskflow/
├── client/              # Frontend (Next.js)
│   ├── src/
│   │   ├── app/        # Pages (App Router)
│   │   ├── components/ # React Components
│   │   ├── stores/     # Zustand State Management
│   │   ├── types/      # TypeScript Types
│   │   └── lib/        # Utilities & API Client
│   └── package.json
│
├── server/              # Backend (Express)
│   ├── src/
│   │   ├── models/     # Mongoose Schemas
│   │   ├── controllers/# Business Logic
│   │   ├── routes/     # API Routes
│   │   ├── middleware/ # Express Middleware
│   │   └── config/     # Configuration
│   └── package.json
│
├── ARCHITECTURE.md      # Full architecture documentation (EN)
├── ARCHITECTURE.th.md   # Architecture documentation (TH)
├── DIAGRAMS.md          # Visual diagrams
└── README.md            # Setup & usage guide
```

---

## 🔧 Development Commands

### Frontend (client/)
```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
```

### Backend (server/)
```bash
npm run dev       # Start with nodemon (http://localhost:5000)
npm start         # Start production server
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `POST` | `/api/tasks` | Create new task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/health` | Health check |

### Query Parameters
- `?status=todo` - Filter by status (todo, in-progress, done)
- `?priority=high` - Filter by priority (low, medium, high)
- `?search=keyword` - Search in title/description

---

## 💾 Data Model

```typescript
Task {
  _id: string                    // MongoDB ID
  title: string                  // Required, max 200 chars
  description: string            // Optional, max 1000 chars
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  tags: string[]                 // Max 10 tags
  dueDate?: Date                 // Optional
  createdAt: Date                // Auto-generated
  updatedAt: Date                // Auto-updated
}
```

---

## 🎯 Key Components

### Frontend Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `DashboardHeader` | `components/dashboard/` | Page title & description |
| `TaskFilters` | `components/dashboard/` | Search & filter controls |
| `TaskStatusTabs` | `components/dashboard/` | Status tabs with counts |
| `TaskGrid` | `components/dashboard/` | Task cards grid layout |
| `TaskCard` | `components/` | Individual task display |
| `TaskModal` | `components/` | Create/Edit task form |
| `Navbar` | `components/` | Navigation bar |

### Backend Files

| File | Location | Purpose |
|------|----------|---------|
| `index.js` | `src/` | Server entry point |
| `Task.js` | `src/models/` | Mongoose schema |
| `taskController.js` | `src/controllers/` | Business logic |
| `taskRoutes.js` | `src/routes/` | Route definitions |
| `validators.js` | `src/middleware/` | Input validation |
| `errorHandler.js` | `src/middleware/` | Error handling |

---

## 🔄 Common Workflows

### Adding a New Feature

1. **Define Types** (if needed)
   ```typescript
   // client/src/types/task.d.ts
   export interface NewFeature { ... }
   ```

2. **Update Database Model**
   ```javascript
   // server/src/models/Task.js
   newField: { type: String, ... }
   ```

3. **Create/Update API Endpoint**
   ```javascript
   // server/src/controllers/taskController.js
   export const newAction = async (req, res) => { ... }
   ```

4. **Add Route**
   ```javascript
   // server/src/routes/taskRoutes.js
   router.post('/new-endpoint', validators, newAction);
   ```

5. **Update Frontend Store**
   ```typescript
   // client/src/stores/useTaskStore.ts
   newAction: () => { ... }
   ```

6. **Create/Update Component**
   ```tsx
   // client/src/components/NewComponent.tsx
   export default function NewComponent() { ... }
   ```

---

## 🐛 Debugging Tips

### Frontend Issues
```bash
# Check browser console for errors
# Use React DevTools
# Check Zustand DevTools
# Verify API calls in Network tab
```

### Backend Issues
```bash
# Check server console logs
# Test endpoints with:
curl -X GET http://localhost:5000/api/tasks
# OR use Postman/Insomnia
# Check MongoDB connection
mongosh
> show dbs
> use taskflow
> db.tasks.find()
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | MongoDB not running | Start MongoDB: `mongod` |
| `Cannot GET /api/tasks` | Backend not running | Start server: `npm run dev` |
| `Network Error` | CORS issue | Check CORS config in `server/src/index.js` |
| `ValidationError` | Invalid data | Check data types match schema |

---

## 📚 Important Files to Know

### Configuration Files

| File | Purpose |
|------|---------|
| `client/next.config.ts` | Next.js configuration |
| `client/tailwind.config.js` | Tailwind CSS settings |
| `client/tsconfig.json` | TypeScript configuration |
| `server/.env` | Environment variables (backend) |
| `client/.env.local` | Environment variables (frontend) |

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🎨 Styling Guide

### Tailwind CSS Classes
```tsx
// Spacing
className="p-4 m-2 gap-4"

// Layout
className="flex flex-col md:flex-row items-center justify-between"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Colors
className="bg-primary-500 text-white"
className="bg-content1 text-default-600"
```

### HeroUI Components
```tsx
import { Button, Input, Modal, Card, Chip } from "@heroui/react";

<Button color="primary" size="lg">Click</Button>
<Input label="Title" placeholder="Enter title" />
<Chip color="success">Done</Chip>
```

---

## 🧪 Testing

### Test API with cURL

```bash
# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing API",
    "status": "todo",
    "priority": "high"
  }'

# Get all tasks
curl http://localhost:5000/api/tasks

# Update task
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Delete task
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID
```

---

## 🚢 Deployment Checklist

### Pre-deployment
- [ ] Test all features locally
- [ ] Update environment variables
- [ ] Build frontend: `pnpm build`
- [ ] Test production build
- [ ] Commit all changes

### Frontend (Vercel)
- [ ] Connect GitHub repo
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test live URL

### Backend (Render/Railway)
- [ ] Connect GitHub repo
- [ ] Set environment variables
- [ ] Set start command: `npm start`
- [ ] Deploy
- [ ] Test API endpoints

### Database (MongoDB Atlas)
- [ ] Create cluster
- [ ] Create database user
- [ ] Whitelist IP addresses
- [ ] Update MONGODB_URI
- [ ] Test connection

---

## 📞 Quick Links

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **MongoDB**: mongodb://localhost:27017

---

## 🆘 Need Help?

1. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed docs
2. Check [DIAGRAMS.md](./DIAGRAMS.md) for visual guides
3. Search issues in project repo
4. Check framework docs:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Express Docs](https://expressjs.com)
   - [MongoDB Docs](https://docs.mongodb.com)
   - [HeroUI Docs](https://www.heroui.com)

---

**Last Updated**: February 22, 2026
