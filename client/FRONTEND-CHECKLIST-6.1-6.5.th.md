# Frontend Checklist Function 6.1-6.5 (วิธีเทสตามระบบปัจจุบัน)

เอกสารนี้สรุปวิธีเทสจากโค้ดจริงในโปรเจกต์นี้ (Web client)

อ้างอิงไฟล์หลัก
- Form login: client/src/components/login/LoginForm.tsx
- Signup flow context + async validation + persistence: client/src/contexts/SignupFlowContext.tsx
- Debounce hook: client/src/hooks/useDebouncedValue.ts
- API retry interceptor: client/src/lib/api/client.ts
- Optimistic update + rollback: client/src/stores/useTaskStore.ts

---

## Function 6.1: Form Validation + RHF + API Submit + UX feedback

### C1 Validation Logic

วิธีเทส
1. เปิดหน้า login
2. กรอก email ผิดรูปแบบ เช่น `test@mail`
3. กรอกรหัสสั้นกว่า 6 ตัวอักษร
4. กด Submit โดยปล่อยว่างบางช่อง

Expected
- แสดง error message ใต้ฟิลด์ทันที
- Email format ผิดต้องขึ้นข้อความ valid email
- Password สั้นต้องขึ้นข้อความขั้นต่ำ
- ช่อง required ที่ว่างต้องขึ้นข้อความชัดเจน

### C2 React Hook Form Implementation

วิธีเทส
1. เปิด DevTools Console
2. กด Submit แล้วดูว่าไม่มี page refresh
3. ตรวจโค้ดใช้ `handleSubmit` + `register` + `errors`

Expected
- หน้าไม่รีเฟรชเมื่อ submit
- validation message มาจาก errors object ไม่ใช่ hardcoded

### C3 Axios & API Communication

วิธีเทส
1. เปิด DevTools > Network
2. ลอง login ด้วยข้อมูลถูก

Expected
- มี request ไป endpoint auth login
- Method = POST
- Payload เป็น JSON ถูกต้อง
- ถ้าสำเร็จได้ status 200 และมี token ใน response

### C4 UX & Visual Feedback

วิธีเทส
1. กด submit ตอน login
2. สังเกตปุ่มตอนส่งคำขอ
3. ลอง login ผิด

Expected
- ปุ่มถูก disable และมี loading state (`Signing in…`)
- ถ้าผิดมีกล่อง error feedback ชัดเจน
- ไม่มีการ submit ซ้ำระหว่างกำลังโหลด

### C5 Error Handling

วิธีเทส
1. ตั้ง API URL ผิดหรือปิด server
2. ลอง submit login

Expected
- หน้าไม่ crash
- ผู้ใช้เห็นข้อความ error ที่อ่านได้
- ยังสามารถลองใหม่ได้

---

## Function 6.2: Fetch + Debounce + Loading/Empty/Error + Optimization

### C1 API Fetching & Rendering

วิธีเทส
1. เปิดหน้าหลัก dashboard
2. ดูว่ารายการ task โหลดขึ้นจริง

Expected
- โหลดครั้งแรกมีข้อมูลแสดง
- ถ้าข้อมูลว่างจะมี empty state
- ไม่มี warning key ใน console (ถ้ามีต้องแก้ที่ render list)

### C2 Debouncing Logic

วิธีเทส
1. เปิด DevTools > Network
2. พิมพ์ช่อง search รัว ๆ บนหน้าหลัก

Expected
- request ไม่ยิงทุกตัวอักษร
- ยิงหลังหน่วงเวลาประมาณ 300-350ms
- จำนวน request ลดลงชัดเจน

### C3 Skeleton Loading UX

วิธีเทส
1. ตั้ง Network เป็น Slow 3G
2. เปิดหน้า task list

Expected
- ระหว่างโหลดมี skeleton/placeholder
- layout ไม่กระโดดแรงระหว่างโหลดเสร็จ

### C4 Empty & Error States

วิธีเทส
1. ค้นหาคำที่ไม่มีจริง
2. ปิด server แล้วรีเฟรชหน้า

Expected
- no-result ต้องเป็น empty state ชัดเจน
- server error ต้องมีข้อความแจ้ง ไม่เป็นหน้าขาว

### C5 Component Optimization

วิธีเทส
1. ตรวจว่า search ใช้ค่าที่ debounced แล้วค่อย fetch
2. ตรวจ cleanup ใน debounce hook

Expected
- มี clearTimeout ใน cleanup
- ลดการ fetch ซ้ำโดยไม่จำเป็น

---

## Function 6.3: Async Validation + Conditional Validation + State Persistence + Context

### C1 Async Validation (username/email availability)

ระบบปัจจุบันใช้ email availability ใน signup step 1

วิธีเทส
1. ไปหน้า signup
2. ใส่ email ที่มีอยู่แล้ว
3. กด Next step

Expected
- มี async check ก่อนผ่าน step
- ถ้า email ซ้ำ แสดง `Email is already registered`
- ถ้าเช็กไม่ผ่าน ต้องไป step ถัดไปไม่ได้

### C2 Conditional Validation

สถานะปัจจุบัน
- ยังไม่มี flow เงื่อนไขแบบ occupation -> required field ตาม role แบบในภาพ
- มี schema validation ครบสำหรับ signup flow ทั่วไป

วิธีเทสที่ทำได้ตอนนี้
- password/confirm mismatch
- ไม่ติ๊ก agree แล้ว submit

Expected
- ระบบ block ด้วย validation ตาม schema

### C3 Data Persistence

วิธีเทส
1. กรอก signup step 1 บางส่วน
2. รีเฟรชหน้า

Expected
- ค่าที่กรอกยังอยู่ (persist ใน localStorage)
- submit สำเร็จแล้ว draft ถูกลบ

### C4 Context + Form Provider

วิธีเทส
1. กรอก step 1 แล้วไป step 2
2. กด Back กลับ step 1

Expected
- ค่าที่กรอกยังอยู่ (single source of truth ผ่าน context + form provider)
- submit ขั้นสุดท้ายรวมข้อมูลครบทั้ง flow

---

## Function 6.4: Instant UX + Retry + Rollback + Notification + Robustness

### C1 Instant UX (Optimistic)

วิธีเทส
1. ลากการ์ด task เปลี่ยนคอลัมน์ หรือ action ที่ใช้ optimistic update
2. สังเกต UI เปลี่ยนทันทีหรือไม่

Expected
- UI เปลี่ยนทันที (optimistic)
- ถ้า API สำเร็จ ข้อมูลคงอยู่

### C2 Retry Logic

ระบบปัจจุบันมี axios retry interceptor สำหรับ network/transient errors

วิธีเทส
1. เปิด DevTools Network แล้ว throttle/ทำให้ request fail ชั่วคราว
2. เรียก action ที่เป็น method retryable

Expected
- มี retry ตามรอบที่ตั้ง (default 2)
- มี delay แบบ exponential backoff + jitter

### C3 Rollback เมื่อไม่สำเร็จ

วิธีเทส
1. ทำ action ที่ใช้ optimisticUpdateTaskAsync
2. ทำให้ API fail (ปิด server หรือบล็อก request)

Expected
- UI revert กลับค่าเดิมอัตโนมัติ
- ไม่ค้าง state ผิดบนหน้า

### C4 User Notification

สถานะปัจจุบัน
- ใช้ error text บนหน้าเป็นหลัก
- ยังไม่มี toast ครอบทั้งระบบตามภาพ

Expected ที่มีตอนนี้
- ผู้ใช้เห็น feedback error ชัดเจน
- หน้าไม่พัง

### C5 Code Robustness

วิธีตรวจ
- optimistic flow มีเก็บ previousTask แล้ว rollback ใน catch
- interceptor ไม่กลืน error และ throw กลับ

Expected
- component ยัง handle catch ได้
- ไม่มี silent failure

---

## Function 6.5: Dynamic Form Rendering from JSON

สถานะปัจจุบัน: ยังไม่มีฟีเจอร์ dynamic-form-driven-by-JSON แบบเต็มตามภาพ

สรุป
- C1 Dynamic Field Rendering: ยังไม่มี
- C2 Runtime Validation Generation: ยังไม่มี
- C3 Conditional Display จาก schema runtime: ยังไม่มี
- C4 Payload Construction จาก dynamic schema: ยังไม่มี
- C5 Recursive fields/group rendering: ยังไม่มี

วิธีเทสเชิงยืนยันว่า "ยังไม่มี"
1. ค้นในโค้ดว่ามีระบบอ่าน JSON schema เพื่อ render field runtime หรือไม่
2. ตรวจว่า form ปัจจุบันเป็น static fields ที่ประกาศตรงใน component

Expected
- ไม่พบ dynamic form engine ใน client ตอนนี้

ทางเลือกถ้าต้องการผ่าน 6.5
- สร้าง schema-driven form component แยก
- map JSON -> RHF register + zod schema runtime
- รองรับ conditional visibility + nested fields + recursive renderer

---

## สรุปสั้นแบบส่งงาน

- 6.1: ผ่านได้จาก Login/Signup form ปัจจุบัน
- 6.2: ผ่านได้จาก search debounce + loading/empty/error
- 6.3: ผ่านได้บางส่วน (async email + persistence + context ผ่าน, conditional ตาม role ยังไม่ครบ)
- 6.4: ผ่านได้บางส่วน (optimistic + rollback + retry ผ่าน, toast ทั้งระบบยังไม่ครบ)
- 6.5: ยังไม่ implement ในระบบนี้
