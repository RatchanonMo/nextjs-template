# DEMO SCRIPT: ฟังก์ชัน 6.4 และ 6.5 (Frontend)

ไฟล์นี้ใช้เป็นคู่มือทดสอบแบบโชว์งาน โดยอ้างอิงหน้าที่เพิ่มจริงในเว็บ:

- 6.4: `/inventory-optimistic`
- 6.5: `/form-builder`

## เตรียมระบบก่อนทดสอบ

1. เปิด terminal ที่โฟลเดอร์ `client`
2. ติดตั้ง dependency (ถ้ายังไม่ติดตั้ง)

```bash
pnpm install
```

3. รัน dev server

```bash
pnpm dev
```

4. เปิดเบราว์เซอร์ที่ `http://localhost:3000`

---

## 6.4 Optimistic UI + Retry + Rollback

### เป้าหมาย

ยืนยันว่า UI อัปเดตทันที (optimistic), ถ้าล้มเหลวมี retry สูงสุด 3 ครั้ง, และ rollback ข้อมูลกลับเมื่อสุดท้ายยัง fail

### หน้าใช้งาน

- `http://localhost:3000/inventory-optimistic`

### Step ทดสอบหลัก

1. เข้าไปที่หน้า `inventory-optimistic`
2. กดปุ่ม `Delete` ของ item ใดก็ได้
3. สังเกตว่ารายการหายทันทีโดยไม่ต้องรอ response (Optimistic Update)
4. กด `Toggle In Stock` ของรายการที่เหลือ แล้วดูว่าสถานะเปลี่ยนทันที
5. เปิดสวิตช์ `Force network failure`
6. ลองกด `Delete` หรือ `Toggle In Stock` อีกครั้ง
7. ดู console ว่ามี log `Retrying... (1)`, `Retrying... (2)` และ `Retrying... (3)`
8. หลัง retry ไม่สำเร็จ ให้ดูว่าข้อมูลถูก rollback กลับสภาพเดิม
9. สังเกตแถบข้อความแจ้งผลว่าล้มเหลว/rollback ชัดเจน

### Expected Result

- เมื่อปกติ: UI เปลี่ยนทันที และคงสถานะใหม่เมื่อสำเร็จ
- เมื่อบังคับ fail: ระบบ retry 3 ครั้ง แล้ว rollback กลับค่าเดิม
- มี feedback ให้ผู้ใช้รู้ผลสำเร็จ/ล้มเหลว

### Checklist ผ่าน/ไม่ผ่าน (6.4)

- [ ] มี optimistic update ทันที
- [ ] มี retry สูงสุด 3 ครั้งพร้อม log
- [ ] มี rollback เมื่อสุดท้าย fail
- [ ] มี feedback บอกสถานะการทำงาน

---

## 6.5 Dynamic Form Engine (Schema-driven)

### เป้าหมาย

ยืนยันว่า form ถูกสร้างจาก schema JSON และสามารถแก้ schema เพื่อเปลี่ยน UI/validation ได้โดยไม่แก้โค้ด component

### หน้าใช้งาน

- `http://localhost:3000/form-builder`

### ความสามารถที่ต้องโชว์

- Render field จาก schema (`text`, `select`, `checkbox`, `group`)
- Validation ตามกฎ (`required`, `min`, `max`, `pattern`)
- Conditional field ด้วย `show_if`
- Nested field ผ่าน `group.fields`
- Payload preview แสดงข้อมูลผลลัพธ์

### Step ทดสอบหลัก

1. เข้าไปหน้า `form-builder`
2. กด `Apply Schema` โดยไม่แก้อะไร เพื่อยืนยัน schema เริ่มต้นใช้งานได้
3. กด `Submit` ทันที
4. ตรวจสอบว่ามี error ของ field บังคับ เช่น `Full Name`, `Role`, `Email`
5. กรอก `Full Name` สั้นกว่า 3 ตัวอักษร แล้ว submit
6. ตรวจสอบ error `must be at least 3 characters`
7. เลือก `Role = admin`
8. ตรวจสอบว่า field `Admin Code` โผล่มาอัตโนมัติ (conditional)
9. ไม่กรอก `Admin Code` แล้ว submit ต้องเจอ required error
10. กรอก email รูปแบบผิด แล้ว submit ต้องเจอ pattern error
11. กรอกทุก field ให้ถูกต้องแล้วกด `Submit`
12. ตรวจสอบกล่อง `Payload Preview` ว่ามีข้อมูลล่าสุดครบ

### ทดสอบว่าเปลี่ยน Schema ได้จริง

1. แก้ JSON ใน textarea โดยเพิ่ม field ใหม่ เช่น:

```json
{
  "type": "text",
  "name": "phone",
  "label": "Phone",
  "validation_rules": { "pattern": "^[0-9]{10}$" }
}
```

2. ใส่ field นี้ลงใน `fields` ของ schema
3. กด `Apply Schema`
4. ตรวจสอบว่ามี input `Phone` โผล่ทันทีโดยไม่ต้องแก้โค้ด TSX
5. ลองกรอกค่าไม่ครบ 10 หลักแล้ว submit ต้องเจอ pattern error

### Expected Result

- UI form เปลี่ยนตาม schema ได้แบบ runtime
- Validation เป็นไปตาม schema
- Field เงื่อนไขแสดง/ซ่อนตามค่า field อื่น
- โครงสร้างซ้อน (`group`) ทำงานและเก็บ payload ถูกต้อง

### Checklist ผ่าน/ไม่ผ่าน (6.5)

- [ ] สร้างฟอร์มจาก schema ได้จริง
- [ ] Validation จาก schema ใช้งานได้
- [ ] Conditional field (`show_if`) ทำงาน
- [ ] Nested/group field ทำงาน
- [ ] เปลี่ยน schema แล้ว UI เปลี่ยนทันที
- [ ] ส่งออก payload ได้ถูกต้อง

---

## หมายเหตุสำหรับการพรีเซนต์

- ถ้าต้องการโชว์ rollback แบบชัดเจน ให้เปิด `Force network failure` ในหน้า 6.4
- เปิด DevTools Console ระหว่าง demo เพื่อโชว์ retry log
- หน้า 6.5 ให้เตรียมตัวอย่าง schema ที่เพิ่ม field ใหม่ล่วงหน้าเพื่อสลับโชว์ได้เร็ว
