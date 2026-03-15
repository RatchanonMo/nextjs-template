# Checklist Function 5.5 (Brute Force + Logout Blacklist)

เอกสารนี้ปรับจาก rubric 5.5 ให้ตรงระบบปัจจุบัน

อ้างอิงโค้ด
- brute force guard: server/src/middleware/authBruteForce.ts
- login route: server/src/routes/authRoutes.ts
- blacklist check: server/src/middleware/auth.ts
- blacklist service: server/src/services/tokenBlacklistService.ts

## C1: Brute Force Block Check

วัตถุประสงค์
- หลังพยายาม login ผิดหลายครั้ง ต้องถูกบล็อกชั่วคราว

วิธีทดสอบ
1. ยิง POST /api/auth/login ด้วย email เดิมและ password ผิดซ้ำหลายครั้ง
2. ทำเกินค่าที่กำหนด (default 5)

Expected result
- ช่วงแรก: 401 พร้อม remaining attempts
- พอครบ limit: 401 ข้อความ lock
- ครั้งถัดไประหว่าง lock window: 429 พร้อม Retry-After header

## C2: Artificial Delay Check

สถานะในระบบปัจจุบัน
- ไม่มีการหน่วงเวลาจงใจใน login path

ผลที่คาดหวัง
- login ที่ผิดไม่ควรช้าแบบตั้งใจ 2s ตาม rubric เดิม
- ระบบนี้เน้น block ด้วย attempt counter + lock window แทน

## C3: Real Logout / Blacklist Check

วัตถุประสงค์
- logout แล้ว token เดิมต้องใช้ไม่ได้ทันที

วิธีทดสอบ
1. login แล้วเก็บ token
2. เรียก POST /api/auth/logout ด้วย token เดิม
3. ใช้ token เดิมเรียก GET /api/auth/me

Expected result
- logout: 200 Logged out securely
- เรียก /me ด้วย token เดิม: 401 Session revoked. Please login again.

## C4: IP-Based Limit Check

วัตถุประสงค์
- ตรวจว่า brute force key มี IP เป็นส่วนหนึ่ง

วิธีตรวจจากโค้ด
- key ถูกสร้างจาก ip + email

Expected result
- ผู้ใช้คนละ email หรือคนละ IP ไม่กระทบกันตรง ๆ แบบ key เดียว
- บล็อกระดับ ip+email pair

## C5: Blacklist Logic Placement Check

วัตถุประสงค์
- ตรวจว่า protect เช็ก blacklist ก่อนโหลดข้อมูล user

วิธีตรวจจากโค้ด auth middleware
- หลัง verify token จะเรียก isTokenBlacklisted(token)
- ถ้า true return 401 ทันที

Expected result
- token ที่ blacklist แล้วไม่ไป query user ต่อ
- ลดภาระ DB และปิดช่อง token reuse หลัง logout
