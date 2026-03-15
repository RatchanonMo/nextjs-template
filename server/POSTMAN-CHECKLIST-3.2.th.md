# POSTMAN CHECKLIST 3.2 (ฉบับเทสได้กับโปรเจกต์นี้)

เอกสารนี้ทำตามหัวข้อในภาพ Checklist Function 3.2 และอ้างอิง backend จริงของโปรเจกต์

- Health endpoint: GET /health
- Port ปัจจุบันของโปรเจกต์: 5001 (ถ้าไม่ได้ตั้ง PORT ใหม่)

## เตรียมก่อนเทส

1. เปิด Terminal ที่โฟลเดอร์ server
2. ติดตั้งแพ็กเกจ (ถ้ายังไม่ได้ติดตั้ง)
- pnpm install
3. รันเซิร์ฟเวอร์
- pnpm dev
4. เปิด Postman หรือ Browser

----------------------------------------

## C1. Endpoint Correct (GET /health)

วิธีเทส
1. เรียก URL
- http://localhost:5001/health
2. ทดสอบทั้ง Browser และ Postman

Expected
- ได้ Status 200 OK
- ได้ JSON ตอบกลับ (ไม่ใช่ HTML error)

จุดที่ต้องระวัง
- ถ้าเรียกผิด path เช่น /heath หรือ /api/health จะได้ 404

----------------------------------------

## C2. Real-time Uptime (ค่าต้องเพิ่มขึ้น)

วิธีเทส
1. เปิด http://localhost:5001/health
2. Refresh 3-4 ครั้ง ห่างกันครั้งละ 1-2 วินาที
3. ดู field uptime

Expected
- uptime ต้องเพิ่มขึ้นทุกครั้งที่ refresh
- ถ้า restart server ค่า uptime จะเริ่มใหม่

จุดที่ต้องระวัง
- ถ้าค่าไม่เปลี่ยนเลย แปลว่าอาจเป็นค่าคงที่ ไม่ได้ดึงจาก process.uptime()

----------------------------------------

## C3. Memory Conversion (Bytes -> MB)

วิธีเทส
1. ดู field memory_usage_mb ใน response
2. เทสหลายรอบ (refresh ซ้ำ)

Expected
- memory_usage_mb เป็นเลขหน่วย MB (เช่น 40.25)
- โดยทั่วไปจะอยู่หลักสิบถึงหลักร้อย MB ตามสภาพแวดล้อม

จุดที่ต้องระวัง
- ถ้าค่าใหญ่ผิดปกติเป็นหลักล้านแบบไม่แปลงหน่วย แปลว่ายังส่ง bytes ตรงๆ

----------------------------------------

## C4. ISO Timestamp (รูปแบบเวลาสากล)

วิธีเทส
1. ดู field timestamp
2. ตรวจรูปแบบวันที่

Expected
- เป็นรูปแบบ ISO 8601 เช่น 2026-03-15T10:30:00.000Z
- ต้องมี T คั่นวันเวลา และลงท้ายด้วย Z

จุดที่ต้องระวัง
- ถ้าเป็นรูปแบบ local time ยาวๆ (เช่น Mon Mar...) แปลว่าไม่ได้ใช้ toISOString()

----------------------------------------

## C5. JSON Format (ความสมบูรณ์ของข้อมูล)

วิธีเทส
1. เปิดใน Postman แล้วดูแท็บ Pretty/JSON
2. ตรวจ key หลักใน body

Expected
- Content เป็น JSON object ที่ parse ได้
- มี key อย่างน้อย:
  - success
  - message
  - uptime
  - memory_usage_mb
  - timestamp

----------------------------------------

## ตัวอย่างผลลัพธ์ที่ควรได้

```json
{
  "success": true,
  "message": "Server is running",
  "uptime": 123.45,
  "memory_usage_mb": 56.78,
  "timestamp": "2026-03-15T10:30:00.000Z"
}
```

----------------------------------------

## ชุดคำสั่งเร็วสำหรับเดโม

1) Start server
- pnpm dev

2) เรียก endpoint
- GET http://localhost:5001/health

3) Refresh ซ้ำเพื่อโชว์ C2-C4
- ดู uptime เพิ่ม
- ดู memory_usage_mb เป็น MB
- ดู timestamp เป็น ISO
