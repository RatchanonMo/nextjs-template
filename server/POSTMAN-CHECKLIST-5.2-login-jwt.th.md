# Checklist Function 5.2 (Login & JWT Validation)

เอกสารนี้ปรับจาก rubric 5.2 ให้ตรงระบบปัจจุบัน

อ้างอิงโค้ด
- login logic: server/src/controllers/authController.ts
- auth middleware: server/src/middleware/auth.ts
- env config: server/src/config/env.ts

## C1: Manual Selection Check

วัตถุประสงค์
- ตรวจว่า controller ดึง password เฉพาะตอน login เท่านั้น

วิธีตรวจจากโค้ด
- login ต้องใช้ .select(+password)

Expected result
- ใน login มี User.findOne(...).select(+password)
- endpoint อื่นที่ไม่ต้องเทียบรหัสผ่านไม่ควร select password

## C2: Bcrypt Comparison Check

วัตถุประสงค์
- ตรวจว่า compare รหัสผ่านทำงานถูก

วิธีทดสอบ
1. ล็อกอินด้วย password ผิด
2. ล็อกอินด้วย password ถูก

Expected result
- ผิด: 401 พร้อมข้อความ Invalid email or password...
- ถูก: 200 และได้ token

## C3: Token Transport Security Check (Current Implementation)

หมายเหตุสำคัญ
- ระบบนี้ส่ง JWT กลับใน JSON response body
- ไม่ได้ใช้ HttpOnly cookie

วิธีทดสอบ
- เรียก POST /api/auth/login สำเร็จ
- ตรวจว่ามี data.token ใน body

Expected result
- Status 200
- data.token มีค่า
- ไม่มีการตั้ง cookie jwt แบบ HttpOnly ใน response

## C4: JWT Payload Check

วัตถุประสงค์
- ตรวจ payload ของ JWT ว่ามีเฉพาะข้อมูลจำเป็น

วิธีทดสอบ
1. copy token จาก login
2. decode ที่ jwt.io

Expected result
- payload มี userId, iat, exp
- ต้องไม่มี password หรือข้อมูลลับอื่น

## C5: Secret Key Isolation

วัตถุประสงค์
- ตรวจว่า JWT secret มาจาก env เท่านั้น

วิธีตรวจ
- เปิด config/env.ts และดู required(JWT_SECRET)

Expected result
- ถ้าไม่มี JWT_SECRET ตอน start ระบบต้อง error และไม่รัน
- ไม่มี hardcoded secret ในโค้ด
