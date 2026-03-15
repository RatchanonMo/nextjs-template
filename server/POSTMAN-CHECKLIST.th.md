# Postman Checklist (TaskFlow Server)

เอกสารนี้เป็นเช็กลิสต์เทสแบบทีละข้อพร้อมผลลัพธ์ที่คาดหวัง โดยอิงโค้ดปัจจุบันของโปรเจกต์

## 0) เตรียม Environment ใน Postman

สร้าง Environment ชื่อ TaskFlow Local แล้วใส่ตัวแปร

- baseUrl = http://localhost:5001
- token = (เว้นว่างก่อน)
- taskId = (เว้นว่างก่อน)
- deletedTaskId = (เว้นว่างก่อน)
- projectId = (เว้นว่างก่อน)

Headers มาตรฐานที่ใช้บ่อย

- Content-Type: application/json
- Authorization: Bearer {{token}} (เฉพาะ endpoint ที่ต้อง login)

---

## C1: Server + MongoDB ทำงานจริง

วัตถุประสงค์
- ยืนยันว่าเซิร์ฟเวอร์รันได้และต่อ MongoDB สำเร็จ

ขั้นตอน
1. รันเซิร์ฟเวอร์ใน terminal
2. ยิง request: GET {{baseUrl}}/health

Expected result
- Status Code = 200
- Body มี success = true
- Body มี message = Server is running
- ใน terminal ควรเห็น log แนว Server running on port ... และ MongoDB Connected ...

---

## C2: Validation เมื่อ POST ข้อมูลไม่ถูกต้อง ต้องได้ 400

วัตถุประสงค์
- ยืนยันว่า validation ของ tasks ตอบ Bad Request เมื่อข้อมูลผิด

Prerequisite
- ต้องมี token ก่อน (ทำจากขั้น Auth-1 และ Auth-2 ด้านล่าง)

Request
- POST {{baseUrl}}/api/tasks
- Header: Authorization: Bearer {{token}}
- Body
{
  "description": "missing title",
  "priority": "medium"
}

Expected result
- Status Code = 400
- success = false
- มี errors array
- ข้อความเกี่ยวกับ title is required

หมายเหตุ
- ในระบบนี้ title เป็น required field

---

## C3: Validation เมื่อส่ง enum ไม่ถูกต้อง ต้องได้ 400

วัตถุประสงค์
- ยืนยันว่าค่า category ที่ไม่อยู่ในชุดที่กำหนด ถูก reject

Request
- POST {{baseUrl}}/api/tasks
- Header: Authorization: Bearer {{token}}
- Body
{
  "title": "Toy task",
  "description": "enum test",
  "category": "TOY",
  "priority": "medium",
  "status": "todo"
}

Expected result
- Status Code = 400
- success = false
- errors มีข้อความ Invalid category

---

## C4: Unique Constraint (เทียบเท่าในโปรเจกต์นี้)

หมายเหตุสำคัญ
- โปรเจกต์นี้ไม่มี /api/products และไม่มี unique ที่ชื่อสินค้า
- unique ที่มีจริงคือ email ตอนสมัครสมาชิก

ขั้นตอน
1. ยิงสมัครครั้งที่ 1
- POST {{baseUrl}}/api/auth/register
- Body
{
  "name": "Tester",
  "email": "duplicate@example.com",
  "password": "123456"
}
- Expected: 201 Created

2. ยิงสมัครซ้ำด้วย email เดิม
- POST {{baseUrl}}/api/auth/register
- Body เดิม

Expected result
- Status Code = 409
- success = false
- message = Email is already registered

---

## C5: GET พร้อม filter แล้วข้อมูลต้องถูกกรองจริง

วัตถุประสงค์
- ยืนยันว่า query params ของ tasks ทำงานถูกต้อง

ขั้นตอน
1. สร้างข้อมูลทดสอบ 3 งาน

A)
- POST {{baseUrl}}/api/tasks
- Body
{
  "title": "Task High",
  "priority": "high",
  "status": "todo",
  "category": "DEVELOPMENT"
}

B)
- POST {{baseUrl}}/api/tasks
- Body
{
  "title": "Task Medium",
  "priority": "medium",
  "status": "in-progress",
  "category": "DESIGN"
}

C)
- POST {{baseUrl}}/api/tasks
- Body
{
  "title": "Task Low",
  "priority": "low",
  "status": "done",
  "category": "MARKETING"
}

2. ยิง filter
- GET {{baseUrl}}/api/tasks?priority=high
- Header: Authorization: Bearer {{token}}

Expected result
- Status Code = 200
- success = true
- data เป็น array
- ทุก item ใน data ต้องมี priority = high

แนะนำเทสเพิ่ม
- GET {{baseUrl}}/api/tasks?status=done
- GET {{baseUrl}}/api/tasks?search=High

---

## C6: createdAt และ updatedAt ต้องมีและถูก format

วัตถุประสงค์
- ยืนยันว่า timestamps ถูกส่งกลับใน response

ขั้นตอน
1. สร้าง task ใหม่
- POST {{baseUrl}}/api/tasks
- Body
{
  "title": "Timestamp Check",
  "priority": "medium",
  "status": "todo",
  "category": "PRODUCT"
}

2. ดู response ของ POST หรือ GET /api/tasks

Expected result
- Status Code = 201 (ตอนสร้าง) หรือ 200 (ตอนอ่าน)
- ใน data มี createdAt และ updatedAt
- ค่าเป็น datetime string ที่ parse ได้

---

## Auth Checklist (ต้องทำก่อนเทส Tasks)

### Auth-1: Register

Request
- POST {{baseUrl}}/api/auth/register
- Body
{
  "name": "Postman User",
  "email": "postman.user@example.com",
  "password": "123456"
}

Expected result
- Status Code = 201
- success = true
- data.token มีค่า

### Auth-2: Login

Request
- POST {{baseUrl}}/api/auth/login
- Body
{
  "email": "postman.user@example.com",
  "password": "123456"
}

Expected result
- Status Code = 200
- success = true
- data.token มีค่า

Postman Test script (ใส่ในแท็บ Tests ของ request login)
pm.environment.set("token", pm.response.json().data.token);

---

## Task CRUD เสริม (แนะนำทำเพื่อปิดงานครบ)

### T1: Create task สำเร็จ

Request
- POST {{baseUrl}}/api/tasks

Body
{
  "title": "Create from Postman",
  "description": "full flow",
  "status": "todo",
  "priority": "medium",
  "category": "DEVELOPMENT",
  "tags": ["api", "postman"]
}

Expected
- 201 Created
- success = true
- data.id มีค่า

Test script
pm.environment.set("taskId", pm.response.json().data.id);

### T2: Get by id

Request
- GET {{baseUrl}}/api/tasks/{{taskId}}

Expected
- 200 OK
- data.id ตรงกับ {{taskId}}

### T3: Update

Request
- PUT {{baseUrl}}/api/tasks/{{taskId}}
- Body
{
  "status": "in-progress",
  "priority": "high"
}

Expected
- 200 OK
- data.status = in-progress
- data.priority = high

### T4: Soft delete

Request
- DELETE {{baseUrl}}/api/tasks/{{taskId}}

Expected
- 200 OK
- mode = soft
- data.isDeleted = true

### T5: Get deleted + restore

1) GET {{baseUrl}}/api/tasks/deleted
- Expected: มี task ที่เพิ่งลบ
- ดึง id จาก list แล้วเก็บเป็น deletedTaskId

2) PATCH {{baseUrl}}/api/tasks/{{deletedTaskId}}/restore
- Expected: 200 OK, message = Task restored successfully

---

## Workspace เสริม (สำหรับเทส refresh/filter ฝั่ง mobile)

### W1: Get workspace
- GET {{baseUrl}}/api/workspace
- Expected: 200, data.projects และ data.labels มีค่า

### W2: Create project
- POST {{baseUrl}}/api/workspace/projects
- Body
{
  "name": "Mobile QA",
  "description": "project from postman",
  "category": "DEVELOPMENT",
  "icon": "📱",
  "accentColor": "#3b82f6"
}
- Expected: 201, data.id มีค่า

---

## สรุปเกณฑ์ผ่านขั้นต่ำ (ตามแนว C1-C6)

- C1 ผ่าน: health = 200 และ DB connected
- C2 ผ่าน: POST ข้อมูลผิด -> 400
- C3 ผ่าน: enum ไม่ถูก -> 400
- C4 ผ่าน: register email ซ้ำ -> 409
- C5 ผ่าน: filter query แล้วผลลัพธ์ถูกกรองจริง
- C6 ผ่าน: createdAt, updatedAt ปรากฏใน response
