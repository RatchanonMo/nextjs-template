# TaskFlow Backend API

Express.js + MongoDB backend for TaskFlow task management application.

## 🚀 Features

- RESTful API for task management
- MongoDB with Mongoose ODM
- Input validation with express-validator
- Error handling middleware
- CORS enabled
- Text search support
- Task statistics endpoint

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

## 🛠️ Installation

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

4. **Run the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Health Check
```
GET /health
```

### Tasks

#### Get all tasks
```
GET /api/tasks
```
**Query Parameters:**
- `status` - Filter by status (todo, in-progress, done)
- `priority` - Filter by priority (low, medium, high)
- `search` - Text search in title and description
- `sortBy` - Sort field (default: -createdAt)

**Example:**
```
GET /api/tasks?status=todo&priority=high&sortBy=-createdAt
```

#### Get single task
```
GET /api/tasks/:id
```

#### Create task
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "in-progress",
  "priority": "high",
  "tags": ["work", "urgent"],
  "dueDate": "2026-03-01"
}
```

#### Update task
```
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "status": "done"
}
```

#### Delete task
```
DELETE /api/tasks/:id
```

#### Get task statistics
```
GET /api/tasks/stats
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 📝 Task Schema

```javascript
{
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  status: Enum ['todo', 'in-progress', 'done'],
  priority: Enum ['low', 'medium', 'high'],
  tags: Array of Strings (max 10),
  dueDate: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🗂️ Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── env.js           # Environment variables
│   ├── controllers/
│   │   └── taskController.js # Business logic
│   ├── middleware/
│   │   ├── errorHandler.js  # Error handling
│   │   └── validators.js    # Input validation
│   ├── models/
│   │   └── Task.js          # Mongoose schema
│   ├── routes/
│   │   └── taskRoutes.js    # API routes
│   └── index.js             # Entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/taskflow |
| NODE_ENV | Environment (development/production) | development |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |

## 🧪 Testing with cURL

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test",
    "status": "todo",
    "priority": "medium"
  }'

# Update a task
curl -X PUT http://localhost:5000/api/tasks/:id \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/:id
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **express-validator** - Input validation

## 🔐 Security Notes

For production deployment:
- Enable authentication/authorization
- Use helmet.js for security headers
- Implement rate limiting
- Use HTTPS
- Sanitize user inputs
- Set up proper MongoDB user permissions

## 📄 License

MIT
