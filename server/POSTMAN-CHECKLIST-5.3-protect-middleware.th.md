# Checklist Function 5.3 (Protect Middleware Robustness)

เอกสารนี้ปรับจาก rubric 5.3 ให้ตรง middleware protect ในระบบนี้

อ้างอิงโค้ด
- protect middleware: server/src/middleware/auth.ts
- change password: server/src/controllers/authController.ts

## C1: Ghost User Test

วัตถุประสงค์
- ผู้ใช้ถูกลบจาก DB แล้ว token เก่าต้องใช้ไม่ได้

วิธีทดสอบ
1. Login เป็น User A แล้วเก็บ token
2. ลบ User A จาก MongoDB Compass
3. เรียก GET /api/auth/me ด้วย token เดิม

Expected result
- 401
- message: User no longer exists

## C2: Password Change Test

วัตถุประสงค์
- หลังเปลี่ยนรหัสผ่าน token เดิมต้องใช้ไม่ได้

วิธีทดสอบ
1. Login แล้วเก็บ token เก่า
2. เรียก POST /api/auth/change-password ด้วย token เก่า
3. เรียก GET /api/auth/me ด้วย token เก่าอีกครั้ง

Expected result
- change-password: 200
- เรียก /me ด้วย token เก่า: 401 และ message แนว Password changed. Please login again.

## C3: Timestamp Logic Check

วัตถุประสงค์
- ตรวจการเทียบเวลา iat จาก JWT กับ passwordChangedAt/tokenInvalidBefore

วิธีทดสอบ
- ใช้ขั้นตอน C2 แล้วสังเกตว่า token ก่อนเปลี่ยนรหัสผ่านใช้ไม่ได้ทันที

Expected result
- token เก่าถูกบล็อกถูกต้อง
- token ใหม่หลัง login ใหม่ใช้งานได้

## C4: Decoded Payload Injection Check

วัตถุประสงค์
- ตรวจว่า middleware ใส่ข้อมูลผู้ใช้ใน req.user ให้ route ถัดไป

วิธีทดสอบ
1. เรียก endpoint ที่ต้อง protect เช่น GET /api/auth/me
2. หรือเพิ่ม temporary log ใน middleware ตอนพัฒนา

Expected result
- endpoint ทำงานได้เมื่อส่ง Bearer token ถูกต้อง
- แปลว่า req.user ถูกเติมครบ

## C5: Error Handling Check

วัตถุประสงค์
- ตรวจว่า token ผิดรูปแบบหรือหมดอายุ ไม่ทำให้ server crash

วิธีทดสอบ
1. ส่ง token มั่ว 1 ตัวอักษร
2. ส่ง token หมดอายุ (ถ้ามี)

Expected result
- token มั่ว: 401 Invalid token
- token หมดอายุ: 401 Token expired. Please login again.
- ไม่มี 500 จากกรณี token ผิด
