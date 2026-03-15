# Checklist Function 5.1 (Auth Hashing & User Data Protection)

เอกสารนี้ปรับจาก rubric 5.1 ให้ตรงระบบปัจจุบัน

อ้างอิงโค้ด
- user schema: server/src/models/User.ts
- auth controller: server/src/controllers/authController.ts

## C1: Auto-Hashing Validation

วัตถุประสงค์
- ตรวจว่า password ถูก hash อัตโนมัติเมื่อสร้างผู้ใช้

วิธีทดสอบ
1. ส่ง POST /api/auth/register
2. เปิด MongoDB Compass ดู document ใน collection users

Request
- POST {{baseUrl}}/api/auth/register

```json
{
  "name": "Hash Tester",
  "email": "hash.tester@example.com",
  "password": "123456"
}
```

Expected result
- Status 201
- ใน DB ค่า password ต้องไม่ใช่ 123456
- password ต้องขึ้นต้นลักษณะ bcrypt เช่น $2a$, $2b$ หรือ $2y$

## C2: Selective Selection Validation

วัตถุประสงค์
- ตรวจว่า field password ไม่ถูกส่งกลับใน response ทั่วไป

วิธีทดสอบ
1. Register หรือ Login สำเร็จ
2. ดู response body และเรียก GET /api/auth/me

Expected result
- Status 200 หรือ 201 ตาม endpoint
- response.data.user หรือ response.data ต้องไม่มี field password

## C3: Double-Hash Prevention

วัตถุประสงค์
- ตรวจว่า update user ที่ไม่แก้ password จะไม่ hash ซ้ำ

วิธีทดสอบ
1. จดค่า password hash ปัจจุบันใน DB
2. อัปเดตฟิลด์อื่นของ user จาก DB หรือ endpoint admin (เช่น role/status)
3. ดูค่า password hash อีกครั้ง

Expected result
- ค่า hash ต้องเท่าเดิม
- ไม่ควรเปลี่ยนทุกครั้งที่ save ถ้าไม่ได้แก้ password

## C4: Cost Factor Check

วัตถุประสงค์
- ตรวจระดับ salt rounds ของ bcrypt

วิธีตรวจจากโค้ด
- เปิด user schema แล้วดู bcrypt.genSalt(10)

Expected result
- ระบบนี้ใช้ cost factor = 10
- ถ้าจะเทียบ rubric ที่ต้อง 12 ให้ถือเป็นข้อปรับปรุงเพิ่ม

## C5: Email Normalization (Case Insensitive)

วัตถุประสงค์
- ตรวจว่า email ถูก normalize เป็น lowercase และกันซ้ำข้ามตัวพิมพ์เล็ก/ใหญ่

วิธีทดสอบ
1. Register ด้วย User@Example.com
2. Register ซ้ำด้วย user@example.com

Expected result
- ครั้งแรก 201
- ครั้งสอง 409 Email is already registered

เกณฑ์ผ่าน
- ระบบต้องกันซ้ำได้แม้ต่างกันแค่ตัวพิมพ์
- schema มี lowercase: true บน field email
