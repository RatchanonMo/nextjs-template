# Checklist Function 5.4 (Role Authorization)

เอกสารนี้ปรับจาก rubric 5.4 ให้ตรงระบบ role guard ปัจจุบัน

อ้างอิงโค้ด
- role middleware: server/src/middleware/authorizeRole.ts
- admin routes: server/src/routes/adminRoutes.ts

## C1: Forbidden Test

วัตถุประสงค์
- user role ธรรมดาต้องเข้า route admin ไม่ได้

วิธีทดสอบ
1. Login ด้วย user ปกติ
2. เรียก GET /api/admin/users

Expected result
- 403
- message: Insufficient role permissions

## C2: Hierarchy Test

วัตถุประสงค์
- admin ต้องผ่าน route ที่อนุญาต admin ได้

วิธีทดสอบ
1. Login ด้วย admin
2. เรียก GET /api/admin/users

Expected result
- 200
- success true

## C3: Multiple Roles Test (Code Capability)

วัตถุประสงค์
- middleware รองรับหลาย role ผ่าน allowedRoles.includes

วิธีตรวจ
- ดูโค้ด authorizeRole ที่รับ ...allowedRoles

Expected result
- middleware รองรับ route แบบ authorizeRole('admin','user') ได้
- แม้ตอนนี้ route จริงใช้เฉพาะ admin

## C4: Status Code Check

วัตถุประสงค์
- แยก 401 กับ 403 ให้ถูก

วิธีทดสอบ
- ไม่ส่ง token เรียก /api/admin/users
- ส่ง token user role ปกติเรียก /api/admin/users

Expected result
- ไม่มี token: 401 Authentication required
- มี token แต่สิทธิ์ไม่พอ: 403 Insufficient role permissions

## C5: Middleware Order Check

วัตถุประสงค์
- กัน error req.user undefined

วิธีตรวจ
- adminRoutes ใช้ router.use(protect, authorizeRole('admin'))

Expected result
- protect ทำงานก่อน authorizeRole เสมอ
- ไม่เกิด runtime error จาก currentRole undefined ที่ไม่ถูกจัดการ
