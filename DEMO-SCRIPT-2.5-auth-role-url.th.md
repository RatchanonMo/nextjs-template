# Demo Script (Function 2.5) - Auth, Role Guard, URL Param

เอกสารนี้ใช้พูดและเดโมให้อาจารย์ดูได้ทันที

## สิ่งที่ต้องเตรียม

- เปิด backend: `cd server && pnpm dev`
- เปิด frontend: `cd client && pnpm dev`
- เปิด Postman และตั้ง Environment
  - `baseUrl = http://localhost:5001`
  - `token =` (ว่างไว้ก่อน)

## Postman Requests ที่ต้องมี

1. `POST {{baseUrl}}/api/auth/login`
2. `GET {{baseUrl}}/api/auth/me`
3. `POST {{baseUrl}}/api/auth/logout`
4. `GET {{baseUrl}}/api/admin/users`

## Script สำหรับ Postman (ใส่ใน Tests ของ login)

```javascript
pm.environment.set("token", pm.response.json().data.token);
```

---

## Demo 1: Auth Logic (Login/Logout + Zustand)

### Step
1. ยิง `POST /api/auth/login` ด้วยบัญชีที่มีอยู่
2. ยิง `GET /api/auth/me` โดยใส่ Header: `Authorization: Bearer {{token}}`
3. กลับไปหน้าเว็บและรีเฟรชหน้า

### Expected
- Login สำเร็จ `200`
- `/me` สำเร็จ `200`
- รีเฟรชหน้าแล้วยังอยู่ในระบบ (auth bootstrap ผ่าน)

### โค้ดอ้างอิง
- Zustand auth state: `client/src/stores/useAuthStore.ts`
- Auth gate: `client/src/components/AuthGate.tsx`

---

## Demo 2: Blacklist หลัง Logout (สำคัญมาก)

### Step
1. ใช้ token เดิมเรียก `POST /api/auth/logout`
2. ใช้ token เดิมเรียก `GET /api/auth/me` อีกครั้ง

### Expected
- logout: `200`, message: `Logged out securely`
- `/me` หลัง logout: `401`, message: `Session revoked. Please login again.`

### โค้ดอ้างอิง
- Blacklist check ใน middleware: `server/src/middleware/auth.ts`
- Blacklist service: `server/src/services/tokenBlacklistService.ts`

---

## Demo 3: Role Guard (User เข้า Admin ไม่ได้)

### Step
1. login ด้วย user role ปกติ
2. Postman เรียก `GET /api/admin/users`
3. เปิดหน้าเว็บไปที่ `/admin`

### Expected
- API ตอบ `403` `Insufficient role permissions`
- หน้าเว็บถูกเด้งออกจาก `/admin` กลับหน้า `/`

### โค้ดอ้างอิง
- Backend role guard: `server/src/middleware/authorizeRole.ts`
- Admin route protection: `server/src/routes/adminRoutes.ts`
- Frontend route block: `client/src/components/AuthGate.tsx`

---

## Demo 4: URL Sync (Filter เปลี่ยน -> URL เปลี่ยน)

### Step
1. login เป็น admin
2. เข้า `/admin`
3. เปลี่ยน filter เช่น role/status/search/page

### Expected
- URL เปลี่ยนตามทันที เช่น `?status=deactivated&page=2`

### โค้ดอ้างอิง
- URLSearchParams + router.replace: `client/src/app/admin/page.tsx`

---

## Demo 5: Deep Linking (เปิด URL ที่มี Param แล้วผลตรงทันที)

### Step
1. คัดลอก URL admin ที่มี query param
2. เปิดแท็บใหม่แล้ววาง URL เดิม

### Expected
- หน้าโหลดแล้วแสดงผลตาม param นั้นทันที

### โค้ดอ้างอิง
- อ่าน query ตอนเริ่มหน้า: `client/src/app/admin/page.tsx`

---

## Demo 6: Conditional UI ตาม Role

### Step
1. login เป็น user ปกติ -> ดู Sidebar
2. login เป็น admin -> ดู Sidebar

### Expected
- user ปกติ: ไม่มีเมนู Admin
- admin: มีเมนู Admin

### โค้ดอ้างอิง
- `client/src/components/Sidebar.tsx`

---

## เช็กลิสต์สรุปตอนพรีเซนต์

- [ ] Login/Logout ทำงานจริง
- [ ] Token หลัง logout ใช้ไม่ได้ (blacklist)
- [ ] User role ปกติเข้า admin ไม่ได้
- [ ] Filter sync ไป URL
- [ ] เปิด URL ที่มี param แล้วโหลดผลตรงทันที (deep link)
- [ ] UI เปลี่ยนตาม role (admin menu)
