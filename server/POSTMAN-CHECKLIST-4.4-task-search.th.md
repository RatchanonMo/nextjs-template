# Checklist Function 4.4 (ใช้ Task Search แทน Post Search)

Checklist นี้ปรับจาก rubric 4.4 ให้ตรงกับระบบจริงในโปรเจกต์นี้

ฟังก์ชันที่ใช้แทน
- `GET /api/tasks?tagsAll=...`

เหตุผล
- ระบบมี field `tags` ใน task
- มีการ parse query string เป็น array
- ใช้ `$all` สำหรับ exact tag matching แบบต้องมีครบทุก tag
- มี pagination (`page`, `limit`, `skip`)
- มี pagination metadata ใน response
- ถ้าไม่พบข้อมูล จะตอบ `200 OK` พร้อม array ว่าง

อ้างอิงโค้ด
- route: [server/src/routes/taskRoutes.ts](server/src/routes/taskRoutes.ts)
- query parsing: [server/src/middleware/queryParams.ts](server/src/middleware/queryParams.ts)
- query logic: [server/src/controllers/taskController.ts](server/src/controllers/taskController.ts)

## 0) เตรียม Postman Environment

ตัวแปร
- `baseUrl` = `http://localhost:5001`
- `token` = เว้นว่างก่อน
- `taskAId` = เว้นว่างก่อน
- `taskBId` = เว้นว่างก่อน
- `taskCId` = เว้นว่างก่อน

Headers
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

---

## Pre-step: Login และสร้างข้อมูลทดสอบ

### P0-1 Register
- `POST {{baseUrl}}/api/auth/register`

```json
{
  "name": "Search Tester",
  "email": "search.tester@example.com",
  "password": "123456"
}
```

Expected
- `201 Created`

### P0-2 Login
- `POST {{baseUrl}}/api/auth/login`

```json
{
  "email": "search.tester@example.com",
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

### P0-3 Create Task A
- `POST {{baseUrl}}/api/tasks`

```json
{
  "title": "Task A",
  "description": "tag node only",
  "status": "todo",
  "priority": "medium",
  "category": "DEVELOPMENT",
  "tags": ["node"]
}
```

Expected
- `201 Created`

### P0-4 Create Task B
- `POST {{baseUrl}}/api/tasks`

```json
{
  "title": "Task B",
  "description": "tag node and express",
  "status": "todo",
  "priority": "medium",
  "category": "DEVELOPMENT",
  "tags": ["node", "express"]
}
```

Expected
- `201 Created`

### P0-5 Create Task C
- `POST {{baseUrl}}/api/tasks`

```json
{
  "title": "Task C",
  "description": "tag express only",
  "status": "todo",
  "priority": "medium",
  "category": "DEVELOPMENT",
  "tags": ["express"]
}
```

Expected
- `201 Created`

---

## C1: Exact Tag Matching

วัตถุประสงค์
- ตรวจว่าระบบดึงเฉพาะ task ที่มี tag ครบทุกตัวตามที่ระบุ

Request
- `GET {{baseUrl}}/api/tasks?tagsAll=node,express`

Expected
- `200 OK`
- `success: true`
- ใน `data` ต้องแสดงเฉพาะ Task B
- Task A ต้องไม่โผล่
- Task C ต้องไม่โผล่

เหตุผล
- ระบบใช้ `$all` ไม่ใช่ `$in`
- แปลว่า task ต้องมีครบทั้ง `node` และ `express`

---

## C2: Array Parsing จาก URL

วัตถุประสงค์
- ตรวจว่า string ใน query เช่น `node,express` ถูกแปลงเป็น array ก่อน query จริง

Request
- `GET {{baseUrl}}/api/tasks?tagsAll=node,express`

Expected
- `200 OK`
- ได้ผลเหมือนการค้นหาแบบ array เต็มรูป
- แสดงเฉพาะ Task B

เทสเพิ่มได้อีกแบบ
- `GET {{baseUrl}}/api/tasks?tagsAll=node&tagsAll=express`

Expected
- ผลลัพธ์ต้องเหมือนกัน คือได้เฉพาะ Task B

เหตุผล
- ใน middleware มีการรองรับทั้ง string เดี่ยวและหลายค่า
- มีการ split `,` และ trim ค่าก่อนใช้งาน

---

## C3: Skip และ Limit Logic

วัตถุประสงค์
- ตรวจว่าการแบ่งหน้าใช้ `skip = (page - 1) * limit` ถูกต้อง

วิธีทดสอบ
- สร้าง task อย่างน้อย 5 ถึง 6 รายการเพิ่ม เพื่อให้เห็นหลายหน้า

Request 1
- `GET {{baseUrl}}/api/tasks?page=1&limit=3`

Expected
- `200 OK`
- `data.length` ไม่เกิน 3
- ได้หน้าแรกของข้อมูล

Request 2
- `GET {{baseUrl}}/api/tasks?page=2&limit=3`

Expected
- `200 OK`
- `data.length` ไม่เกิน 3
- ข้อมูลในหน้า 2 ต้องไม่ซ้ำกับหน้า 1

จุดตรวจ
- ลำดับต้องต่อเนื่องตาม sort ที่ใช้
- default sort คือ `-createdAt`

---

## C4: Pagination Metadata

วัตถุประสงค์
- ตรวจว่า response ส่งข้อมูล pagination กลับมาครบ

Request
- `GET {{baseUrl}}/api/tasks?page=1&limit=3`

Expected
- `200 OK`
- response มี field ต่อไปนี้
  - `count`
  - `total`
  - `page`
  - `limit`
  - `totalPages`
  - `pagination`

Expected ใน `pagination`
- `total`
- `count`
- `page`
- `limit`
- `totalPages`
- `hasPrevPage`
- `hasNextPage`
- `prevPage`
- `nextPage`

ตัวอย่างที่ควรได้

```json
{
  "success": true,
  "count": 3,
  "total": 6,
  "page": 1,
  "limit": 3,
  "totalPages": 2,
  "pagination": {
    "total": 6,
    "count": 3,
    "page": 1,
    "limit": 3,
    "totalPages": 2,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "data": []
}
```

---

## C5: Empty Result Handling

วัตถุประสงค์
- ตรวจว่าถ้า search แล้วไม่พบข้อมูล ระบบต้องไม่ error

Request
- `GET {{baseUrl}}/api/tasks?tagsAll=superman`

Expected
- `200 OK`
- `success: true`
- `data: []`
- `count` เป็น `0`
- `total` เป็น `0`
- `pagination.totalPages` อย่างน้อยเป็น `1`

จุดสำคัญ
- ห้ามตอบ `404`
- ห้ามตอบ `500`
- การไม่พบข้อมูลจาก search เป็นกรณีปกติ ต้องตอบสำเร็จพร้อม array ว่าง

---

## Quick Summary (ผ่าน/ไม่ผ่าน)

- C1 ผ่าน: `tagsAll=node,express` ได้เฉพาะ task ที่มีครบทั้งสอง tag
- C2 ผ่าน: query string ถูก parse เป็น array ถูกต้อง
- C3 ผ่าน: `page` และ `limit` ทำงานไม่ซ้ำหน้า
- C4 ผ่าน: มี pagination metadata ครบ
- C5 ผ่าน: ไม่พบข้อมูลแล้วตอบ `200` พร้อม array ว่าง

---

## หมายเหตุสำหรับส่งงาน

ถ้าอาจารย์ยอมให้ใช้ entity/function ที่เทียบแนวคิดเดียวกัน:
- ใช้ checklist นี้ได้ เพราะฟังก์ชันค้นหา tag ใน tasks รองรับ exact matching + pagination ครบ

ถ้าอาจารย์บังคับ `posts/search?tags=` ตามภาพเป๊ะ:
- โปรเจกต์นี้ไม่มี module posts โดยตรง
- แต่ behavior ที่ต้องการมีอยู่แล้วใน `tasks?tagsAll=`
