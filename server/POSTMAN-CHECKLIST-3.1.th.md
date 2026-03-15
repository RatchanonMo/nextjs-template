# POSTMAN CHECKLIST 3.1 (ฉบับเทสได้กับโปรเจกต์นี้)

เอกสารนี้แปลง Checklist Function 3.1 จากภาพ ให้ทดสอบได้กับ backend ปัจจุบันในโฟลเดอร์ server

หมายเหตุสำคัญ
- โปรเจกต์นี้ใช้ TypeScript entry file เป็น src/index.ts (ไม่ใช่ server.js)
- ค่า port จริงอ่านจาก env และ default คือ 5001
- โปรเจกต์นี้ไม่มี route /scan?token=admin แบบตัวอย่างในภาพ
- จึงแมปการทดสอบ C3-C5 ไปที่ endpoint จริงของระบบ auth

## เตรียมก่อนเทส

1. เปิด Terminal ที่โฟลเดอร์ server
2. ติดตั้งแพ็กเกจ
- pnpm install
3. ตั้งค่าไฟล์ .env ให้ครบอย่างน้อย
- PORT=5001
- MONGODB_URI=your_mongodb_uri
- JWT_SECRET=your_secret
- CORS_ORIGIN=http://localhost:3000
4. รันเซิร์ฟเวอร์
- pnpm dev

----------------------------------------

## C1. Server รันได้สำเร็จ

วิธีเทส
1. รันคำสั่ง pnpm dev
2. ดู Terminal ว่ามีข้อความประมาณ Server running ... on port 5001
3. ทดสอบ health endpoint
- GET http://localhost:5001/health

Expected
- ได้ Status 200
- ได้ JSON มี success: true

จุดที่พังบ่อย
- EADDRINUSE: มี process ใช้พอร์ตอยู่แล้ว
- Missing required env variable: ลืมตั้ง MONGODB_URI หรือ JWT_SECRET

----------------------------------------

## C2. มี request log ใน Terminal

วิธีเทส
1. ระหว่าง server รันอยู่ ให้ยิง request ใดก็ได้ เช่น
- GET http://localhost:5001/health
2. สังเกต log ใน Terminal

Expected
- มีบรรทัด log รูปแบบ METHOD PATH เช่น GET /health

หมายเหตุ
- โปรเจกต์นี้ยังไม่ใช้ Morgan โดยตรง แต่มี request logging middleware ใน index.ts
- ถ้าอาจารย์บังคับว่าต้องเป็น Morgan ให้เพิ่ม morgan middleware ภายหลัง

----------------------------------------

## C3. รับค่าจาก req.query ได้ถูกต้อง

(แมปจาก token query ในตัวอย่าง ไปเป็น email query ที่มีจริงในโปรเจกต์)

Endpoint สำหรับเทส
- GET /api/auth/check-email?email=...

วิธีเทส
1. ส่ง request
- GET http://localhost:5001/api/auth/check-email?email=test@example.com
2. เปลี่ยนค่า query เป็นอีเมลอื่น แล้วส่งซ้ำ

Expected
- Response data.email ต้องตรงกับค่าที่ส่งใน query
- Response data.available เปลี่ยนตามข้อมูลผู้ใช้ที่มี/ไม่มีใน DB

จุดที่พังบ่อย
- ส่ง email ไม่ถูก format จะโดน 400 จาก validation
- อ่านค่าจาก req.params แทน req.query จะผิด requirement

----------------------------------------

## C4. เคสถูกต้องต้องได้ JSON + Status 200

วิธีเทส
1. ส่ง request ถูกต้องไปที่
- GET http://localhost:5001/api/auth/check-email?email=valid@example.com
2. ดูใน Postman แท็บ Status และ Body

Expected
- Status 200 OK
- Body เป็น JSON โครงสร้าง success/data

ตัวอย่างผลลัพธ์
- success: true
- data.email: valid@example.com
- data.available: true หรือ false

----------------------------------------

## C5. เคสไม่ผ่านต้องได้ 401 (Unauthorized)

(แมปจาก token ผิดในภาพ ไปเป็น protected route ที่ไม่มี token)

Endpoint สำหรับเทส
- GET /api/auth/me (ต้องมี Bearer token)

วิธีเทส
1. ส่ง request โดยไม่ใส่ Authorization header
- GET http://localhost:5001/api/auth/me
2. หรือใส่ token มั่ว
- Authorization: Bearer invalid_token

Expected
- Status 401 Unauthorized
- Body เป็น JSON แจ้งว่า Authentication required หรือ token invalid

----------------------------------------

## C6. โค้ดเขียน import/export ถูกต้อง

วิธีเทส
1. เปิดไฟล์หลักของระบบ
- src/index.ts
2. ตรวจว่ามีการใช้ import ... from ... ใน source
3. รัน type check
- pnpm typecheck
4. รัน build
- pnpm build

Expected
- typecheck ผ่าน
- build ผ่าน
- ไม่เจอ syntax error เกี่ยวกับ module import/export

หมายเหตุ
- โปรเจกต์นี้เป็น TypeScript และ compile ไป CommonJS ตาม tsconfig
- จึงไม่จำเป็นต้องมี type: module ใน package.json เพื่อให้ผ่านเงื่อนไขการใช้ import ใน source TypeScript

----------------------------------------

## ชุดคำสั่งเร็วสำหรับอัดวิดีโอเดโม

1) Start server
- pnpm dev

2) C1
- เปิด browser: http://localhost:5001/health

3) C2
- ดู log ใน terminal หลังเรียก /health

4) C3 + C4
- Postman GET http://localhost:5001/api/auth/check-email?email=test@example.com

5) C5
- Postman GET http://localhost:5001/api/auth/me โดยไม่ส่ง token

6) C6
- รัน pnpm typecheck และ pnpm build
