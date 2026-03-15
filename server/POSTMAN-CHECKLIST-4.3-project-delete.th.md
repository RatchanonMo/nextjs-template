# Checklist Function 4.3 (ใช้ Project Delete + Task Unlink แทน Order/Stock)

Checklist นี้ปรับจาก rubric 4.3 ให้ตรงกับฟังก์ชันที่มีจริงในระบบปัจจุบัน

ฟังก์ชันที่ใช้แทน
- `DELETE /api/workspace/projects/:projectId`

เหตุผลที่ใช้ฟังก์ชันนี้แทน
- มีการ pre-check ว่า project มีจริงหรือไม่
- มีการแก้ข้อมูลหลายส่วนในคำสั่งเดียว
- ใช้ MongoDB transaction (`session.withTransaction`)
- มีผลลัพธ์ที่ server คำนวณเอง (`unlinkedTasksCount`)
- ถ้าเกิด error กลางทาง ระบบควร rollback ได้

อ้างอิงโค้ด
- route: [server/src/routes/workspaceRoutes.ts](server/src/routes/workspaceRoutes.ts)
- controller: [server/src/controllers/workspaceController.ts](server/src/controllers/workspaceController.ts)

## 0) เตรียม Postman Environment

ตัวแปร
- `baseUrl` = `http://localhost:5001`
- `token` = เว้นว่างก่อน
- `projectId` = เว้นว่างก่อน
- `linkedTaskId1` = เว้นว่างก่อน
- `linkedTaskId2` = เว้นว่างก่อน

Headers
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

---

## Pre-step: Login และสร้างข้อมูลสำหรับทดสอบ

### P0-1 Register
- `POST {{baseUrl}}/api/auth/register`

```json
{
  "name": "Atomic Tester",
  "email": "atomic.tester@example.com",
  "password": "123456"
}
```

Expected
- `201 Created`

### P0-2 Login
- `POST {{baseUrl}}/api/auth/login`

```json
{
  "email": "atomic.tester@example.com",
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

### P0-3 Create Project
- `POST {{baseUrl}}/api/workspace/projects`

```json
{
  "name": "Atomic Delete Project",
  "description": "used for transaction test",
  "category": "DEVELOPMENT",
  "icon": "📦",
  "accentColor": "#2563eb"
}
```

Expected
- `201 Created`
- `data.id` มีค่า

Tests script
```javascript
pm.environment.set("projectId", pm.response.json().data.id);
```

### P0-4 Create linked tasks 2 งาน
- `POST {{baseUrl}}/api/tasks`

Body 1
```json
{
  "title": "Linked Task 1",
  "description": "linked to project",
  "status": "todo",
  "priority": "medium",
  "category": "DEVELOPMENT",
  "projectId": "{{projectId}}"
}
```

Body 2
```json
{
  "title": "Linked Task 2",
  "description": "linked to project",
  "status": "in-progress",
  "priority": "high",
  "category": "DEVELOPMENT",
  "projectId": "{{projectId}}"
}
```

Expected
- ทั้ง 2 request ต้องได้ `201 Created`

ถ้าต้องการเก็บ id
```javascript
pm.environment.set("linkedTaskId1", pm.response.json().data.id);
```
และอีก request ใช้ `linkedTaskId2`

---

## C1: การเช็กก่อนลบทำงานจริง (Pre-check Validation)

วัตถุประสงค์
- ต้องลบได้เฉพาะ project ที่มีอยู่จริง

### เคส 1: project id ไม่มีจริง
Request
- `DELETE {{baseUrl}}/api/workspace/projects/not-found-project`

Expected
- `404 Not Found`
- `success: false`
- `message: "Project not found"`

### เคส 2: project id ว่างหรือส่งไม่ครบ
อันนี้ทำตรง URL ไม่ได้มากนักใน Postman แต่ logic validator มีอยู่
- ถ้าส่ง path param ไม่ครบ route จะไม่ match
- ถ้าส่งค่าที่ไม่ใช่ string เปล่าใน route นี้ ตัว controller จะหาไม่เจอและตอบ `404`

เกณฑ์ผ่าน
- project ที่ไม่มีจริงต้องไม่ถูกลบมั่ว
- task ที่ผูกกับ project อื่นต้องไม่โดนแก้ไข

---

## C2: ความถูกต้องของการตัดความสัมพันธ์ (แทน Stock Deduction)

วัตถุประสงค์
- เมื่อลบ project สำเร็จ task ที่เคยอ้าง `projectId` นี้ต้องถูกถอดความสัมพันธ์ออก

Request
- `DELETE {{baseUrl}}/api/workspace/projects/{{projectId}}`

Expected
- `200 OK`
- `success: true`
- `meta.unlinkedTasksCount` ต้องเป็น `2` ถ้าคุณสร้าง linked task ไว้ 2 งาน
- project นี้หายจาก `GET /api/workspace`

วิธีตรวจซ้ำ
- เรียก `GET {{baseUrl}}/api/tasks`
- ตรวจ task เดิมที่เคยผูก project

Expected เพิ่มเติม
- task ยังอยู่
- แต่ `projectId` ของ task ไม่ควรชี้ค่าเดิมแล้ว

จุดสำคัญ
- นี่คือ “data update หลายส่วน” แบบเดียวกับแนว stock deduction
- ต่างกันตรงระบบนี้ไม่ได้ลด stock แต่ unlink task ออกจาก project

---

## C3: Server-side Calculation (แทน totalPrice)

วัตถุประสงค์
- ตรวจว่าค่าที่สำคัญถูกคำนวณจาก server ไม่ใช่ client ส่งมาเอง

ในระบบนี้ค่าเทียบเคียงคือ
- `meta.unlinkedTasksCount`

Request
- `DELETE {{baseUrl}}/api/workspace/projects/{{projectId}}`

Expected
- response มี

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "unlinkedTasksCount": 2,
    "atomic": true
  }
}
```

เกณฑ์ผ่าน
- client ไม่ได้ส่ง `unlinkedTasksCount` เข้าไปใน body
- server เป็นคนคำนวณเองจาก `Task.updateMany(...).modifiedCount`

---

## C4: Atomic Operation (Concurrency / Transaction Protection)

วัตถุประสงค์
- ตรวจว่าการลบ project และการ unlink task อยู่ใน transaction เดียวกัน

สิ่งที่ต้องเช็กจากโค้ด
- มี `mongoose.startSession()`
- มี `session.withTransaction(...)`
- มีการ save workspace และ `Task.updateMany(..., { session })`
- response มี `meta.atomic: true`

วิธีเทสเชิงผลลัพธ์
1. สร้าง project และ task ที่ผูกอยู่
2. ลบ project ด้วย `DELETE /api/workspace/projects/{{projectId}}`
3. ตรวจว่าทั้ง 2 อย่างเกิดพร้อมกัน

Expected
- project ถูกลบ
- task ทุกอันที่อ้าง projectId นี้ถูก unlink
- response มี `meta.atomic: true`

หมายเหตุ
- จาก Postman เพียงอย่างเดียว จะพิสูจน์ concurrency race แบบหนัก ๆ ได้จำกัด
- แต่เช็กลิสต์นี้เพียงพอสำหรับแสดงว่าโค้ดใช้ transaction จริง

---

## C5: Data Integrity / Error Recovery

วัตถุประสงค์
- ถ้าเกิด error ระบบต้องไม่ค้างครึ่งทาง

วิธีเทสที่ทำได้จากภายนอก

### เคส 1: ลบ project ที่ไม่มีจริง
Request
- `DELETE {{baseUrl}}/api/workspace/projects/not-existing-project-id`

Expected
- `404 Not Found`
- `success: false`
- ไม่มี task ใดถูก unlink ผิดพลาด

### เคส 2: ลบ project แล้วตรวจ state หลังบ้าน
หลัง delete สำเร็จ ให้เช็ก 2 จุด
- `GET {{baseUrl}}/api/workspace`
- `GET {{baseUrl}}/api/tasks`

Expected
- project หายจาก workspace
- task ยังคงอยู่ครบ
- task ที่เคยผูก project ถูกถอด `projectId` ออก
- ไม่เกิดสภาพข้อมูลครึ่งเดียว เช่น project หายแต่ task ยังอ้าง projectId เดิมอยู่

---

## Quick Summary (ผ่าน/ไม่ผ่าน)

- C1 ผ่าน: ลบ project ที่ไม่มีจริงต้องได้ `404`
- C2 ผ่าน: ลบ project แล้ว task ถูก unlink ถูกจำนวน
- C3 ผ่าน: `unlinkedTasksCount` คำนวณจาก server เอง
- C4 ผ่าน: มี transaction และ response บอก `atomic: true`
- C5 ผ่าน: ข้อมูลไม่ค้างครึ่งทางหลัง delete หรือ error

---

## หมายเหตุสำหรับส่งงาน

ถ้าอาจารย์ยอมให้ใช้ฟังก์ชันที่ “มีคุณสมบัติเทียบเท่า” แทน order/stock:
- ใช้ checklist นี้ได้ เพราะมันครอบคลุม pre-check, atomic update, server-side computed result, และ data integrity ครบ

ถ้าอาจารย์บังคับเรื่อง order/stock ตามภาพเป๊ะ:
- โปรเจกต์นี้ยังไม่มี module `orders/products/stock`
- ต้องสร้าง feature เพิ่มก่อน แล้วค่อยทำ checklist แบบตรง rubric เดิม
