# Postman Checklist Function 4.2 (ฉบับใช้กับโค้ดปัจจุบัน)

Checklist นี้ทำตามภาพ 4.2 แต่ปรับให้ตรงกับระบบจริงในโปรเจกต์นี้

- ระบบปัจจุบันไม่มี field `isDeleted` และ `deletedAt` ใน user
- ระบบใช้ `accountStatus` (`active` | `suspended` | `deactivated`) แทน soft delete
- endpoint ที่เกี่ยวข้องอยู่ใน [server/src/routes/adminRoutes.ts](server/src/routes/adminRoutes.ts)

## 0) เตรียม Postman Environment

ตัวแปรที่ใช้

- `baseUrl` = `http://localhost:5001`
- `adminToken` = เว้นว่างก่อน
- `adminUserId` = เว้นว่างก่อน
- `targetUserId` = เว้นว่างก่อน

Headers

- `Content-Type: application/json`
- `Authorization: Bearer {{adminToken}}`

## 1) Prerequisite (ต้องมี Admin ก่อน)

เพราะ endpoint `/api/admin/*` ต้องเป็น role `admin`

1. สมัครผู้ใช้ 2 คน (admin candidate + target user)
- `POST {{baseUrl}}/api/auth/register`

2. ตั้ง role ของ admin candidate เป็น `admin` ใน MongoDB Compass (ชั่วคราวสำหรับเทส)
- collection `users`
- แก้ document ของ admin candidate ให้ `role: "admin"`

3. login ด้วย admin candidate
- `POST {{baseUrl}}/api/auth/login`
- เก็บ token ลง env

Tests script (ใน Postman ของ request login admin)

```javascript
pm.environment.set("adminToken", pm.response.json().data.token);
```

---

## C1: Default Value ถูกต้อง (ใช้ accountStatus แทน isDeleted)

วัตถุประสงค์
- ยืนยันว่าผู้ใช้ใหม่เริ่มต้นด้วยสถานะใช้งานได้

Request

- `POST {{baseUrl}}/api/auth/register`
- body

```json
{
  "name": "Function42 User",
  "email": "function42.user@example.com",
  "password": "123456"
}
```

Expected result

- Status `201 Created`
- `success: true`
- `data.user.accountStatus` เป็น `active` (ค่า default)

หมายเหตุ
- ในโค้ด default อยู่ที่ model user ใน [server/src/models/User.ts](server/src/models/User.ts)

---

## C2: Soft Delete ทำงานจริง (Update instead of Delete)

วัตถุประสงค์
- ยืนยันว่าไม่ลบ document จริง แต่เปลี่ยนสถานะเป็น deactivated

Step A: ดึง user list หา `targetUserId`

- `GET {{baseUrl}}/api/admin/users`
- Header: `Authorization: Bearer {{adminToken}}`

Expected

- Status `200 OK`
- `data` เป็น array ผู้ใช้

Step B: เปลี่ยนสถานะ user เป็น deactivated

- `PATCH {{baseUrl}}/api/admin/users/{{targetUserId}}/status`
- body

```json
{
  "accountStatus": "deactivated"
}
```

Expected

- Status `200 OK`
- `success: true`
- `data.accountStatus` เป็น `deactivated`

จุดตรวจสำคัญ

- ไม่ได้ใช้ `findByIdAndDelete`
- ยังหา user เดิมเจอใน `/api/admin/users` ได้ แต่สถานะเปลี่ยนเป็น `deactivated`

---

## C3: บันทึกเวลาที่ลบ (deletedAt Tracking)

สถานะในระบบปัจจุบัน

- ไม่มี `deletedAt` สำหรับ user ใน schema ปัจจุบัน
- ดังนั้น C3 ตามภาพจะ "ยังไม่รองรับ" แบบตรงตัว

สิ่งที่เทสแทนได้ตอนนี้

- หลัง `PATCH .../status` แล้วดู `data.updatedAt` เปลี่ยนเป็นเวลาปัจจุบัน

Request

- ใช้ request เดียวกับ C2 Step B

Expected result (เท่าที่รองรับ)

- `updatedAt` เปลี่ยนค่า
- ไม่มี field `deletedAt`

---

## C4: GET Logic ต้องกรองข้อมูลที่ถูก deactivate ได้

วัตถุประสงค์
- ยืนยันว่าระบบกรองผู้ใช้ตามสถานะได้

Step A: เรียกเฉพาะ active

- `GET {{baseUrl}}/api/admin/users?status=active`

Expected

- Status `200`
- ผู้ใช้ที่ `accountStatus = deactivated` ต้องไม่อยู่ในผลลัพธ์

Step B: เรียกเฉพาะ deactivated

- `GET {{baseUrl}}/api/admin/users?status=deactivated`

Expected

- Status `200`
- ต้องเจอ user ที่เพิ่ง deactivate

---

## C5: Response สวยงาม (User Experience)

วัตถุประสงค์
- ตรวจรูปแบบ response และ error behavior

เคสสำเร็จ

- `PATCH /api/admin/users/{{targetUserId}}/status`

Expected

- Status `200 OK`
- body รูปแบบประมาณ

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user",
    "accountStatus": "deactivated"
  }
}
```

เคสล้มเหลว (id ไม่ถูกต้อง)

- `PATCH /api/admin/users/not-a-valid-id/status`

Expected

- Status `400 Bad Request`
- `success: false`
- มี error array จาก validator

เคสล้มเหลว (ไม่พบ user)

- `PATCH /api/admin/users/507f1f77bcf86cd799439011/status` (id รูปแบบถูก แต่ไม่มีจริง)

Expected

- Status `404 Not Found`
- `message: "User not found"`

---

## สรุปผ่าน/ไม่ผ่าน ตาม 4.2 กับโค้ดปัจจุบัน

- C1: ผ่าน (ใช้ `accountStatus: active` เป็น default)
- C2: ผ่าน (soft delete เชิงสถานะ ด้วย `deactivated`)
- C3: ยังไม่ครบตาม rubric เดิม (ไม่มี `deletedAt` ของ user)
- C4: ผ่าน (filter ด้วย `status` query)
- C5: ผ่าน (200/400/404 ชัดเจน)

## ถ้าต้องการให้ตรง rubric เดิม 100%

ต้องเพิ่มใน user schema

- `isDeleted: boolean` (default false)
- `deletedAt: Date | null`

และเพิ่ม endpoint ลบผู้ใช้แบบ soft delete โดยเฉพาะ เช่น

- `DELETE /api/users/:id` -> update `isDeleted=true`, `deletedAt=new Date()`
