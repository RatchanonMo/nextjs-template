# Checklist Function 4.5 (ใช้ Task Virtuals + Stats แทน Product salePrice)

Checklist นี้ปรับจาก rubric 4.5 ให้ตรงกับระบบจริงในโปรเจกต์นี้

ฟีเจอร์ที่ใช้แทน
- Virtual fields ของ `Task`
  - `isOverdue`
  - `assigneeCount`
  - `tagCount`
- Aggregation endpoint
  - `GET /api/tasks/stats`
  - `GET /api/tasks/analytics`

อ้างอิงโค้ด
- schema + virtuals: [server/src/models/Task.ts](server/src/models/Task.ts)
- stats: [server/src/controllers/taskController.ts](server/src/controllers/taskController.ts)
- analytics: [server/src/controllers/taskController.ts](server/src/controllers/taskController.ts)

## ข้อควรรู้ก่อนเทส

ในระบบนี้ `GET /api/tasks` ใช้ `.lean()`
ดังนั้น virtual fields อาจไม่แสดงใน list endpoint นี้

ถ้าจะเทส virtual field display ให้ใช้
- response จาก `POST /api/tasks`
- หรือ `GET /api/tasks/:id`

เพราะสองจุดนี้คืนค่าเป็น document ที่ serialize ผ่าน `toJSON` ของ schema

---

## 0) เตรียม Postman Environment

ตัวแปร
- `baseUrl` = `http://localhost:5001`
- `token` = เว้นว่างก่อน
- `taskId` = เว้นว่างก่อน

Headers
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

---

## Pre-step: Login

### P0-1 Register
- `POST {{baseUrl}}/api/auth/register`

```json
{
  "name": "Virtual Tester",
  "email": "virtual.tester@example.com",
  "password": "123456"
}
```

Expected
- `201 Created`

### P0-2 Login
- `POST {{baseUrl}}/api/auth/login`

```json
{
  "email": "virtual.tester@example.com",
  "password": "123456"
}
```

Expected
- `200 OK`
- `data.token` มีค่า

Tests script
```javascript
pm.environment.set("token", pm.response.json().data.token);
```

---

## C1: Virtual Field Display

วัตถุประสงค์
- ตรวจว่า virtual fields ถูกส่งออกมาใน JSON response

Request
- `POST {{baseUrl}}/api/tasks`

```json
{
  "title": "Virtual field task",
  "description": "testing virtual fields",
  "status": "todo",
  "priority": "medium",
  "category": "DEVELOPMENT",
  "tags": ["node", "express"],
  "assignees": [
    { "name": "Alice", "color": "#3b82f6" },
    { "name": "Bob", "color": "#10b981" }
  ],
  "dueDate": "2024-01-01"
}
```

Expected
- `201 Created`
- `success: true`
- ใน `data` ควรมี field เสมือน เช่น
  - `isOverdue`
  - `assigneeCount`
  - `tagCount`

Expected logic
- `assigneeCount = 2`
- `tagCount = 2`
- `isOverdue = true` ถ้าวันที่ `dueDate` ย้อนหลังและ status ไม่ใช่ `done`

Tests script
```javascript
pm.environment.set("taskId", pm.response.json().data.id);
```

ทดสอบซ้ำได้ด้วย
- `GET {{baseUrl}}/api/tasks/{{taskId}}`

Expected
- virtual fields ควรยังแสดงอยู่

---

## C2: No Redundant Data

วัตถุประสงค์
- ตรวจว่า virtual field ไม่ได้ถูกเก็บซ้ำจริงใน document database

วิธีตรวจ
1. สร้าง task จาก C1
2. เปิด MongoDB Compass ไปที่ collection `tasks`
3. เปิด document ที่ตรงกับ task นั้น

Expected
- ใน document จริง ไม่ควรมี field เหล่านี้เก็บอยู่ถาวร
  - `isOverdue`
  - `assigneeCount`
  - `tagCount`

เหตุผล
- field เหล่านี้เป็น virtual ควรถูกคำนวณตอน serialize ไม่ใช่เก็บซ้ำใน DB

---

## C3: Aggregation Accuracy

วัตถุประสงค์
- ตรวจว่ารายงานจาก aggregation คำนวณถูกจากข้อมูลจริง

### C3.1 Task Stats

Request
- `GET {{baseUrl}}/api/tasks/stats`

Expected
- `200 OK`
- response มี

```json
{
  "success": true,
  "data": {
    "total": 1,
    "byStatus": {
      "todo": 1,
      "in-progress": 0,
      "done": 0
    },
    "byPriority": {
      "low": 0,
      "medium": 1,
      "high": 0
    }
  }
}
```

เกณฑ์ผ่าน
- `total` ต้องตรงกับจำนวน task ที่ยังไม่ถูกลบ
- `byStatus` และ `byPriority` ต้องตรงกับข้อมูลใน DB

### C3.2 Task Analytics

Request
- `GET {{baseUrl}}/api/tasks/analytics`

Expected
- `200 OK`
- มี `data.overview`
- มี `completionRate`
- มี `byStatus`, `byPriority`, `byCategory`, `dueTimeline`, `topTags`

เกณฑ์ผ่าน
- `completionRate` ต้องคำนวณจาก `done / total * 100`
- `topTags` ต้องมาจาก tags จริง ไม่ใช่ค่าคงที่
- `dueTimeline` ต้องเปลี่ยนตาม dueDate จริง

---

## C4: Schema Configuration

วัตถุประสงค์
- ตรวจว่าตั้ง schema ให้ serialize virtuals ออก JSON จริง

วิธีตรวจจากโค้ด
- เปิด [server/src/models/Task.ts](server/src/models/Task.ts)

จุดที่ต้องมี
- `taskSchema.set('toJSON', { virtuals: true, ... })`
- `taskSchema.set('toObject', { virtuals: true })`
- ประกาศ virtual เช่น
  - `taskSchema.virtual('isOverdue')`
  - `taskSchema.virtual('assigneeCount')`
  - `taskSchema.virtual('tagCount')`

เกณฑ์ผ่าน
- virtuals ถูกประกาศใน schema
- toJSON/toObject เปิด virtuals ไว้

หมายเหตุสำคัญ
- ถึง schema ถูกต้อง แต่ endpoint ที่ใช้ `.lean()` อาจไม่แสดง virtuals
- นี่เป็น behavior ของ query path ไม่ใช่ schema พัง

---

## C5: Empty State Handling

วัตถุประสงค์
- ตรวจว่า stats/analytics รับมือกรณีไม่มีข้อมูลได้

วิธีทดสอบ
1. ลบ task ทั้งหมดของ user หรือใช้ user ใหม่ที่ยังไม่มี task
2. เรียก endpoint ต่อไปนี้
- `GET {{baseUrl}}/api/tasks/stats`
- `GET {{baseUrl}}/api/tasks/analytics`

Expected สำหรับ `/stats`

```json
{
  "success": true,
  "data": {
    "total": 0,
    "byStatus": {
      "todo": 0,
      "in-progress": 0,
      "done": 0
    },
    "byPriority": {
      "low": 0,
      "medium": 0,
      "high": 0
    }
  }
}
```

Expected สำหรับ `/analytics`
- `200 OK`
- `overview.total = 0`
- `overview.completionRate = 0`
- array ต่าง ๆ เป็น array ว่างได้
- ต้องไม่ error 500

---

## Quick Summary (ผ่าน/ไม่ผ่าน)

- C1 ผ่าน: `POST /api/tasks` หรือ `GET /api/tasks/:id` แสดง virtual fields
- C2 ผ่าน: virtual fields ไม่ถูกเก็บซ้ำใน MongoDB document
- C3 ผ่าน: stats และ analytics คำนวณถูกจากข้อมูลจริง
- C4 ผ่าน: schema ตั้ง `toJSON`/`toObject` พร้อม `virtuals: true`
- C5 ผ่าน: ไม่มี task แล้ว stats/analytics ยังตอบ `200` พร้อมค่า default ที่ปลอดภัย

---

## หมายเหตุสำหรับส่งงาน

ถ้าอาจารย์ยอมให้ใช้ฟังก์ชัน “เทียบแนวคิดเดียวกัน” แทน `salePrice`:
- checklist นี้ใช้ได้ เพราะระบบมี virtual fields และ aggregation จริงครบตามหลักการของข้อ 4.5

ถ้าอาจารย์บังคับ `products/salePrice` ตามภาพเป๊ะ:
- โปรเจกต์นี้ยังไม่มี product module แบบนั้น
- แต่แนวคิดเดียวกันมีอยู่ใน task virtuals และ task reporting แล้ว
