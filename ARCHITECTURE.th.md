# TaskFlow - แนวคิดและสถาปัตยกรรมโครงการ

## 📋 แนวคิดโครงการ (Project Concept)

**TaskFlow** คือแอปพลิเคชันจัดการงาน (Task Management) แบบ Full-stack ที่ออกแบบมาเพื่อช่วยให้บุคคลและทีมสามารถจัดระเบียบ ติดตาม และบริหารจัดการงานต่างๆ ได้อย่างมีประสิทธิภาพ

### ฟีเจอร์หลัก
- ✅ สร้าง แก้ไข ลบ และดูรายการงาน
- 🎯 จัดการระดับความสำคัญ (Low, Medium, High)
- 📊 ติดตามสถานะงาน (Todo, In Progress, Done)
- 🏷️ ระบบแท็กสำหรับจัดหมวดหมู่
- 🔍 ค้นหาและกรองข้อมูล
- 📅 กำหนดวันครบกำหนด

---

## 🏗️ สถาปัตยกรรมระบบโดยรวม

### โครงสร้างแบบ 3 ชั้น (3-Tier Architecture)

```
┌─────────────────────────────────────┐
│         Frontend (Client)           │
│      Next.js + React + HeroUI       │
│         Port: 3000                  │
└──────────────┬──────────────────────┘
               │
          REST API (HTTP)
               │
┌──────────────▼──────────────────────┐
│         Backend (Server)            │
│       Express.js + Node.js          │
│         Port: 5000                  │
└──────────────┬──────────────────────┘
               │
          Mongoose ODM
               │
┌──────────────▼──────────────────────┐
│         Database                    │
│          MongoDB                    │
│         Port: 27017                 │
└─────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture

### เทคโนโลยีที่ใช้
- **Framework**: Next.js 15 (React 19)
- **ภาษา**: TypeScript
- **UI Components**: HeroUI 2.8.5
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand
- **HTTP Client**: Axios

### โครงสร้างโฟลเดอร์

```
client/src/
├── app/                    # หน้าเว็บ (Pages)
│   ├── layout.tsx         # Layout หลัก
│   └── page.tsx           # Dashboard
│
├── components/             # คอมโพเนนต์
│   ├── TaskCard.tsx       # การ์ดแสดงงาน
│   ├── TaskModal.tsx      # ฟอร์มสร้าง/แก้ไขงาน
│   └── dashboard/         # คอมโพเนนต์ Dashboard
│       ├── DashboardHeader.tsx
│       ├── TaskFilters.tsx
│       ├── TaskStatusTabs.tsx
│       ├── TaskEmptyState.tsx
│       └── TaskGrid.tsx
│
├── stores/                 # State Management
│   └── useTaskStore.ts    # Zustand store สำหรับงาน
│
├── types/                  # Type Definitions
│   └── task.d.ts          # ประเภทข้อมูลงาน
│
└── lib/                    # Utilities
    └── api/
        └── taskAPI.ts     # ฟังก์ชันเรียก API
```

### การไหลของข้อมูล (Data Flow)

```
User Interface
      ↓
React Components
      ↓
Zustand Store (State)
      ↓
API Layer (Axios)
      ↓
Backend API
```

---

## ⚙️ Backend Architecture

### เทคโนโลยีที่ใช้
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Validation**: Express-validator
- **Runtime**: Node.js (ES Modules)

### โครงสร้างโฟลเดอร์

```
server/src/
├── index.js                # Entry point
│
├── config/                 # การตั้งค่า
│   ├── database.js        # เชื่อมต่อ MongoDB
│   └── env.js             # ตัวแปร Environment
│
├── models/                 # Database Models
│   └── Task.js            # Schema ของงาน
│
├── controllers/            # Business Logic
│   └── taskController.js  # ฟังก์ชันจัดการงาน
│
├── routes/                 # API Routes
│   └── taskRoutes.js      # เส้นทาง API
│
└── middleware/             # Middleware
    ├── errorHandler.js    # จัดการ Error
    └── validators.js      # ตรวจสอบข้อมูล
```

### Architecture Pattern

```
Request → Routes → Validators → Controllers → Models → Database
                                              ↓
Response ← Error Handler ← Controllers ← Models
```

---

## 🌐 API Endpoints

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/api/tasks` | ดึงงานทั้งหมด |
| `GET` | `/api/tasks/:id` | ดึงงานตาม ID |
| `POST` | `/api/tasks` | สร้างงานใหม่ |
| `PUT` | `/api/tasks/:id` | แก้ไขงาน |
| `DELETE` | `/api/tasks/:id` | ลบงาน |

### Query Parameters
- `?status=todo` - กรองตามสถานะ
- `?priority=high` - กรองตามความสำคัญ
- `?search=keyword` - ค้นหา

---

## 💾 โครงสร้างข้อมูล (Data Schema)

### Task Model

```typescript
{
  _id: ObjectId              // MongoDB ID
  title: string              // ชื่องาน (required)
  description: string        // รายละเอียด
  status: enum               // todo | in-progress | done
  priority: enum             // low | medium | high
  tags: string[]             // แท็ก
  dueDate: Date              // วันครบกำหนด
  createdAt: Date            // วันที่สร้าง (auto)
  updatedAt: Date            // วันที่แก้ไข (auto)
}
```

---

## 🔄 การทำงานของระบบ (System Flow)

### 1. สร้างงานใหม่ (Create Task)

```
1. ผู้ใช้คลิก "New Task"
         ↓
2. เปิด Modal ฟอร์ม
         ↓
3. กรอกข้อมูลและกด "Create"
         ↓
4. ตรวจสอบข้อมูล (Frontend)
         ↓
5. POST /api/tasks
         ↓
6. ตรวจสอบข้อมูล (Backend)
         ↓
7. บันทึกลง MongoDB
         ↓
8. ส่งข้อมูลกลับ
         ↓
9. อัพเดท Zustand Store
         ↓
10. แสดงผลในหน้าเว็บ
```

### 2. กรองและค้นหา (Filter & Search)

```
1. ผู้ใช้เลือกตัวกรองหรือพิมพ์ค้นหา
         ↓
2. อัพเดท State (Zustand)
         ↓
3. คำนวณผลลัพธ์ใหม่ (useMemo)
         ↓
4. แสดงผลที่กรองแล้ว
```

---

## 🔒 ความปลอดภัย (Security)

### Backend
- ✅ ตรวจสอบความถูกต้องของข้อมูล (Validation)
- ✅ ป้องกัน MongoDB Injection
- ✅ CORS Configuration
- ✅ Error Handling

### Frontend
- ✅ TypeScript Type Safety
- ✅ Client-side Validation
- ✅ Error Boundaries

---

## 📊 จุดเด่นของสถาปัตยกรรม

### 1. **Separation of Concerns**
- Frontend และ Backend แยกกันชัดเจน
- แต่ละ Layer มีหน้าที่เฉพาะ

### 2. **Scalability**
- สามารถขยายได้ทั้ง Frontend และ Backend
- MongoDB รองรับข้อมูลจำนวนมาก

### 3. **Maintainability**
- Code แยกเป็นส่วนๆ ชัดเจน
- ง่ายต่อการดูแลและแก้ไข

### 4. **Developer Experience**
- TypeScript ช่วยตรวจสอบ Type
- Hot Reload สำหรับพัฒนา
- Modular Components

---

## 🚀 การ Deploy

### Development
```
Frontend: localhost:3000
Backend:  localhost:5000
MongoDB:  localhost:27017
```

### Production (แนะนำ)
```
Frontend: Vercel / Netlify
Backend:  Render / Railway / Heroku
MongoDB:  MongoDB Atlas
```

---

## 🔮 การพัฒนาในอนาคต

### Phase 2
- [ ] ระบบ Login/Authentication
- [ ] มีผู้ใช้หลายคน
- [ ] แจ้งเตือนทาง Email
- [ ] อัพโหลดไฟล์แนบ

### Phase 3
- [ ] Comment ในงาน
- [ ] ประวัติการแก้ไข
- [ ] Dashboard Analytics
- [ ] Export/Import ข้อมูล

---

## 📖 สรุป

**TaskFlow** ใช้สถาปัตยกรรมแบบ **Client-Server** ที่:

1. **Frontend** - Next.js + React สำหรับ UI ที่สวยงามและตอบสนองเร็ว
2. **Backend** - Express.js สำหรับ RESTful API ที่มีประสิทธิภาพ
3. **Database** - MongoDB สำหรับจัดเก็บข้อมูลแบบ Flexible

ระบบออกแบบให้:
- ✅ ใช้งานง่าย
- ✅ ขยายได้
- ✅ ดูแลรักษาง่าย
- ✅ ปลอดภัย
- ✅ Performance ดี

---

**สร้างด้วย ❤️ โดยใช้เทคโนโลยีสมัยใหม่**
