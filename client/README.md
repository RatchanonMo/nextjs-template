# TaskFlow - Modern Task Management System

A full-stack task management application built with Next.js 15, HeroUI, and Zustand. TaskFlow provides an intuitive dashboard for managing tasks with priorities, statuses, tags, and due dates.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![HeroUI](https://img.shields.io/badge/HeroUI-2.8.5-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-cyan)

## 🚀 Features

- ✅ **Task Management**: Create, edit, delete, and organize tasks
- 🎯 **Priority Levels**: Set task priorities (Low, Medium, High)
- 📊 **Status Tracking**: Track tasks through To Do, In Progress, and Done
- 🏷️ **Tagging System**: Organize tasks with custom tags
- 🔍 **Smart Filters**: Search and filter tasks by status and priority
- 📅 **Due Dates**: Set and track task deadlines
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎨 **Modern UI**: Built with HeroUI component library
- ⚡ **Fast Performance**: Powered by Next.js 15 with Turbopack

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.6 with App Router
- **UI Library**: HeroUI 2.8.5 (Hero UI component library)
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand 5.0.8
- **Language**: TypeScript 5.x
- **HTTP Client**: Axios 1.12.2

### Development Tools
- ESLint for code linting
- Prettier for code formatting
- Turbopack for fast builds

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd nextjs-template
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. **Run the development server**
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started

1. Visit [http://localhost:3000](http://localhost:3000) to see the task dashboard
2. Click "Load Sample Data" to populate with 7 example tasks
3. Or click "New Task" to create your first custom task

### Creating a Task

1. Click the "New Task" button
2. Fill in the task details:
   - **Title**: Task name (required)
   - **Description**: Additional details
   - **Status**: To Do, In Progress, or Done
   - **Priority**: Low, Medium, or High
   - **Due Date**: Optional deadline
   - **Tags**: Custom labels for organization
3. Click "Create" to save

### Managing Tasks

- **Edit**: Click the three-dot menu on a task card and select "Edit"
- **Delete**: Click the three-dot menu and select "Delete"
- **Filter by Status**: Use the tabs to view tasks by status
- **Filter by Priority**: Use the priority dropdown
- **Search**: Type in the search box to find tasks

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with navbar
│   ├── page.tsx            # Landing page
│   └── page.tsx            # Task dashboard (main page)
│   ├── Navbar.tsx          # Navigation component
│   ├── Providers.tsx       # Context providers
│   ├── TaskCard.tsx        # Task card component
│   └── TaskModal.tsx       # Task creation/edit modal
├── config/
│   └── hero.ts             # HeroUI theme configuration
├── constants/
│   └── routes.ts           # App routes and API endpoints
├── hooks/
│   └── useCounter.ts       # Example custom hook
├── stores/
│   ├── useStore.ts         # Example Zustand store
│   └── useTaskStore.ts     # Task management store
├── styles/
│   └── globals.css         # Global styles
├── types/
│   ├── task.d.ts           # Task type definitions
│   └── store/
│       └── useStore.d.ts   # Store type definitions
└── utils/
    └── sampleData.ts       # Sample task data
```

## 🔌 Backend Integration (To Be Implemented)

The frontend is ready for backend integration. Here's what you'll need to implement:

### API Endpoints

```typescript
// GET /api/tasks - Fetch all tasks
// POST /api/tasks - Create a new task
// PUT /api/tasks/:id - Update a task
// DELETE /api/tasks/:id - Delete a task
```

### Example API Integration

Update the Zustand store to use API calls:

```typescript
// src/stores/useTaskStore.ts
import axios from 'axios';
import { API } from '@/constants/routes';

// In your store actions:
addTask: async (task) => {
  const response = await axios.post(API.TASKS, task);
  set((state) => ({
    tasks: [...state.tasks, response.data],
  }));
},
```

### Recommended Backend Stack

- **Node.js** with Express or Fastify
- **Database**: PostgreSQL, MongoDB, or Prisma
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod or Joi
- **ORM**: Prisma or Drizzle

## 🎨 Customization

### Theme Configuration

Edit the HeroUI theme in `src/config/hero.ts`:

```typescript
export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: "#00c7be",
          // ... customize colors
        }
      }
    }
  }
});
```

### Routes

Add new routes in `src/constants/routes.ts`:

```typescript
export enum ROUTES {
  HOME = "/",
  TASKS = "/tasks",
  // Add your routes here
}
```

## 📝 Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🚧 Roadmap

- [ ] Backend API implementation
- [ ] User authentication
- [ ] Task collaboration features
- [ ] Real-time updates with WebSockets
- [ ] Task categories/projects
- [ ] Due date notifications
- [ ] Dark mode support
- [ ] Task comments and attachments
- [ ] Export/import functionality
- [ ] Mobile app (React Native)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using Next.js and HeroUI

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
