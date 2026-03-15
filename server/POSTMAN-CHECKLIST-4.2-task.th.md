# Checklist Function 4.2 (ใช้ Task แทน User)

เวอร์ชันนี้ใช้ `Task` เป็นตัวเทสแทน `User` เพื่อให้ตรงแนวคิด soft delete ตาม rubric
เพราะในระบบปัจจุบัน `Task` มีทั้ง `isDeleted` และ `deletedAt` อยู่แล้ว

อ้างอิงโค้ด
- soft delete: [server/src/controllers/taskController.ts](server/src/controllers/taskController.ts)
- schema: [server/src/models/Task.ts](server/src/models/Task.ts)

## 0) เตรียม Postman Environment

ตั้งค่า Environment
- `baseUrl` = `http://localhost:5001`
- `token` = เว้นว่างก่อน
- `taskId` = เว้นว่างก่อน

Headers หลัก
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

---

## Pre-step: Login เพื่อเอา token

### A) Register (ถ้ายังไม่มี user)
- `POST {{baseUrl}}/api/auth/register`

```json
{
  "name": "Task SoftDelete Tester",
  "email": "task.softdelete@example.com",
  "password": "123456"
}
```

Expected
- `201 Created`
- `success: true`

### B) Login
- `POST {{baseUrl}}/api/auth/login`

```json
{
  "email": "task.softdelete@example.com",
  "password": "123456"
}
```

Expected
- `200 OK`
- `success: true`
- มี `data.token`

Tests script (Postman)
```javascript
pm.environment.set("token", pm.response.json().data.token);
```

---

## C1: ค่าเริ่มต้นถูกต้อง (Default Value)

วัตถุประสงค์
- ตรวจว่าเมื่อสร้าง task ใหม่ โดยไม่ส่ง `isDeleted` เอง ระบบตั้ง default ให้ถูกต้อง

Request
- `POST {{baseUrl}}/api/tasks`

```json
{
  "title": "Default check task",
  "description": "check isDeleted default",
  "status": "todo",
  "priority": "medium",
  "category": "DEVELOPMENT"
}
```

Expected
- `201 Created`
- `success: true`
- ใน `data` ต้องเห็น
  - `isDeleted: false`
  - `deletedAt: null`

Tests script (เก็บ taskId)
```javascript
pm.environment.set("taskId", pm.response.json().data.id);
```

---

## C2: Soft Delete ทำงานจริง (Update instead of Delete)

วัตถุประสงค์
- ตรวจว่าการลบเป็นการ update สถานะ ไม่ใช่ลบแถวทิ้ง

Request
- `DELETE {{baseUrl}}/api/tasks/{{taskId}}`

Expected
- `200 OK`
- `success: true`
- `mode: "soft"`
- `data.isDeleted: true`
- `data.deletedAt` มีค่าเวลา

จุดตรวจสำคัญ
- ถ้าเป็น hard delete จะมี `mode: "hard"` (ไม่ใช่ที่เราต้องการ)
- soft delete ต้องยัง restore ได้

---

## C3: บันทึกเวลาที่ลบ (deletedAt Tracking)

วัตถุประสงค์
- ตรวจว่า deletedAt ถูกตั้งค่าเมื่อ soft delete

วิธีตรวจ
1. หลังทำ C2 ให้ดู response ของ `DELETE`
2. เรียก `GET {{baseUrl}}/api/tasks/deleted`

Expected
- `DELETE` response มี `data.deletedAt` เป็นวันที่เวลา (ISO string)
- ใน `GET /deleted` task เดิมต้องมี `isDeleted: true` และ `deletedAt != null`

---

## C4: การกรองข้อมูลสำเร็จ (GET Logic)

วัตถุประสงค์
- ตรวจว่า task ที่ลบแล้วไม่โผล่ใน list ปกติ แต่ไปอยู่ใน list deleted

ขั้นตอน
1. `GET {{baseUrl}}/api/tasks`
2. `GET {{baseUrl}}/api/tasks/deleted`

Expected
- ใน `/api/tasks` ต้องไม่เห็น task ที่โดน soft delete
- ใน `/api/tasks/deleted` ต้องเห็น task นั้น

ทดสอบกลับ (restore)
- `PATCH {{baseUrl}}/api/tasks/{{taskId}}/restore`

Expected
- `200 OK`
- `success: true`
- `message: "Task restored successfully"`

หลัง restore
- task กลับมาใน `/api/tasks`
- หายจาก `/api/tasks/deleted`

---

## C5: Response สวยงาม (User Experience)

วัตถุประสงค์
- ตรวจ status code และ message ใน success/error

### เคสสำเร็จ
- `DELETE {{baseUrl}}/api/tasks/{{taskId}}`

Expected
- `200 OK`
- `success: true`
- `message` ชัดเจน (`Task soft deleted`)
- มี field `mode`

### เคสล้มเหลว 1: id format ไม่ถูก
- `DELETE {{baseUrl}}/api/tasks/not-a-valid-id`

Expected
- `400 Bad Request`
- `success: false`
- `errors` array (จาก validator)

### เคสล้มเหลว 2: id ถูก format แต่ไม่พบข้อมูล
- `DELETE {{baseUrl}}/api/tasks/507f1f77bcf86cd799439011`

Expected
- `404 Not Found`
- `success: false`
- `message: "Task not found"`

---

## Quick Summary (ผ่าน/ไม่ผ่าน)

- C1 ผ่าน: create task แล้วได้ `isDeleted: false`
- C2 ผ่าน: delete แบบ soft ได้ `mode: soft`
- C3 ผ่าน: มี `deletedAt` ตอนลบ
- C4 ผ่าน: list ปกติไม่เห็น แต่ list deleted เห็น
- C5 ผ่าน: status/message ถูกต้องทั้ง success และ error

---

## หมายเหตุสำคัญสำหรับส่งงาน

ถ้าอาจารย์ยอมให้เปลี่ยน entity จาก users เป็น tasks:
- ใช้เอกสารนี้ส่งได้ตรงฟังก์ชัน soft delete ครบกว่าของ user ในระบบปัจจุบัน

ถ้าอาจารย์บังคับ users เท่านั้น:
- ต้องเพิ่ม `isDeleted` + `deletedAt` ใน user schema และเพิ่ม endpoint ลบผู้ใช้แบบ soft delete เพิ่ม
