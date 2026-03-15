# คู่มือทดสอบ Mobile App — Checklist 7.1 – 7.5

> **วิธีใช้:** เปิดแอปบน Expo Go หรือ dev-build → ทดสอบแต่ละข้อตามลำดับด้านล่าง  
> ✅ = ผ่าน | ❌ = ต้องแก้ไข

---

## 7.1 — Profile Screen

### เปิดหน้า
1. Login เข้าสู่ระบบ
2. แตะแท็บ **Profile** (ไอคอนรูปคน ขวาสุดแถบล่าง)

### C1 — วงกลม Avatar
- [ ] เห็นวงกลมขนาดใหญ่กลางหน้าจอ
- [ ] วงกลมแสดงตัวอักษรแรกของชื่อ (เช่น "J" สำหรับ John)
- [ ] ขนาดวงกลม: `width = height = 150` → ต้องกลมสมบูรณ์

### C2 — Flexbox Center Layout
- [ ] Avatar และชื่อ/อีเมลจัดอยู่**กึ่งกลางแนวนอน** (alignItems: center)
- [ ] Container เป็น `flex: 1, justifyContent: center, alignItems: center`

### C3 — Random Border Color
- [ ] กด Avatar หรือปุ่ม **Edit Profile** / **Share Profile**
- [ ] สี border วงกลม **เปลี่ยนเป็นสีสุ่มใหม่** ทุกครั้งที่กด
- [ ] กดซ้ำหลายครั้ง → สีเปลี่ยนทุกครั้ง (อาจซ้ำบ้างเป็นเรื่องปกติ)

### C4 — Alert on Button Press
- [ ] กดปุ่ม **Edit Profile** → เห็น `Alert.alert("Edit Profile")` popup
- [ ] กดปุ่ม **Share Profile** → เห็น `Alert.alert("Share Profile")` popup
- [ ] กด Avatar → เห็น Alert แสดง**ชื่อผู้ใช้**

---

## 7.2 — Focus Planner (Glassmorphism + Reusable Component)

### เปิดหน้า
1. แตะแท็บ **Focus** (ไอคอนนาฬิกา/timer)

### C1 — Numeric Input + Real-time Calculation
- [ ] เห็นช่อง input "Available hours today"
- [ ] พิมพ์ `4` → cards แสดงผลทันที (Pomodoros, Tasks, Focus Time ฯลฯ)
- [ ] **ทดสอบ edge case:** ลบค่าออก (ช่องว่าง) → cards แสดง `—` ไม่ใช่ `NaN` หรือ `0`
- [ ] พิมพ์ `0` → แสดง `—` (guard ทำงาน)
- [ ] พิมพ์ `8` → Pomodoros ≈ 16, Tasks ≈ 8

### C2 — Glassmorphism Styling
- [ ] พื้นหลังเป็น **gradient สีเข้ม** ( navy → blue)
- [ ] Cards มี `backgroundColor: rgba(255,255,255,0.2)` → รู้สึก "โปร่งแสง"
- [ ] Cards มี shadow และ borderColor ขาวโปร่งแสง
- [ ] elevation > 5 → เห็น shadow ชัดบน Android

### C3 — StatCard Reusable Component
- [ ] นับจำนวน card บนหน้าจอ → **ต้องมีอย่างน้อย 3 cards** (จริงๆ มี 6)
- [ ] ทุก card ใช้ component เดียวกัน (StatCard) รับ `label` และ `value` props
- [ ] รูปแบบสม่ำเสมอทุก card (font, สี, ขนาด ไม่แตกต่างกัน)

### C4 — Numeric Keyboard + KeyboardAvoidingView
- [ ] แตะช่อง input → keyboard เป็น**แบบตัวเลข** (ไม่มีตัวอักษร)
- [ ] บน iOS: keyboard ไม่ทับ input field (KeyboardAvoidingView ทำงาน)
- [ ] บน Android: กด `height` behavior ทำให้ content เลื่อนขึ้น

---

## 7.3 — Task Detail + Lazy Loading + Favorites

### เปิดหน้า
1. แตะแท็บ **Inbox**
2. รอให้รายการ task โหลดเสร็จก่อน

### C1 — Lazy Loading (โหลด list ก่อน → detail เมื่อกด)
- [ ] รอรายการ task แสดงใน Inbox ก่อน (ไม่ต้องรอ detail)
- [ ] กดปุ่ม **Details** บน task ใดก็ได้
- [ ] หน้า TaskDetail เปิดขึ้น → เห็น **ActivityIndicator** หมุน (ขณะโหลด)
- [ ] query detail ไฟร์ **เฉพาะเมื่อกด** (enabled: !!taskId → lazy)

### C2 — Navigation with Params
- [ ] กด **Details** → navigate ไปหน้า TaskDetail พร้อม `taskId`
- [ ] หน้า TaskDetail แสดง ID ของ task ที่กดในหัวข้อ subtitle
- [ ] กลับมา Inbox โดยกดปุ่ม **← Back to List**
- [ ] กด task อีกตัว → ข้อมูลในหน้า Detail เปลี่ยน (params ทำงาน)

### C3 — Favorite State Sync
- [ ] ในหน้า TaskDetail เห็นปุ่ม **☆ Add to Favorites**
- [ ] กดปุ่ม → เปลี่ยนเป็น **★ Remove Favorite** ทันที (state อัปเดต)
- [ ] กดอีกครั้ง → กลับเป็น ☆ (toggle)
- [ ] **ปิดแอปแล้วเปิดใหม่** → Favorite ยังคงอยู่ (AsyncStorage persist)
- [ ] เปิด task อื่น → แสดง ☆ (state แยกต่างหากต่อ task)

### C4 — ActivityIndicator + Empty State
- [ ] ระหว่างโหลด detail → เห็น `ActivityIndicator` + ข้อความ "Loading task details…"
- [ ] ถ้า offline และ task ไม่อยู่ใน cache → เห็น error card "Could not load task details"
- [ ] error card มีปุ่ม **Retry**

---

## 7.4 — Analytics: Parallel Queries + Partial Failure + Offline Cache

### เปิดหน้า
1. แตะแท็บ **Analytics**

### C1 — Promise.all Parallel Queries
- [ ] เปิดหน้า → **ทั้ง statsQuery และ analyticsQuery ไฟร์พร้อมกัน** (ไม่ queue)
- [ ] กด refresh (pull-down หรือกดปุ่ม refresh ที่ header)
- [ ] ดู console → เห็น request 2 ตัวออกไปพร้อมกัน (parallel)
- [ ] spinner เดียวแสดงสถานะ refreshing ของทั้งสอง query

### C2 — Partial Failure Handling
> *เทสข้อนี้ต้องจำลอง failure โดย:*
> - ปิด server ชั่วคราว แล้วเปิด analytics screen ขณะ offline แล้วกลับมา online
> - หรือ แก้ URL ของ endpoint ใดเป็น URL ผิดๆ ชั่วคราว

- [ ] ถ้า **statsQuery fail** → เห็น card "Stats Service Unavailable" (analytics การ์ดยังโชว์ปกติ)
- [ ] ถ้า **analyticsQuery fail** → เห็น card "Analytics Service Unavailable" (stats การ์ดยังโชว์ปกติ)
- [ ] **ทั้งสอง query อิสระจากกัน** — fail หนึ่งตัวไม่ทำให้อีกตัวพัง

### C3 — Offline Cached Data Banner
- [ ] เปิดหน้า Analytics ขณะ online → โหลดข้อมูลปกติ
- [ ] **ปิด WiFi/Data** หรือ Airplane Mode
- [ ] กลับมาที่หน้า Analytics → เห็น banner `"📦 Cached Data — Offline mode"`
- [ ] ข้อมูลเก่า (TanStack Query cache) ยังแสดงอยู่ ไม่หายไป

---

## 7.5 — Offline Queue: Persistence, Sync, Duplicate Prevention

### การเตรียมตัวทดสอบ
1. เปิดแอปและ login
2. **ปิด Network** (Airplane Mode หรือปิด WiFi/Data)

### C1 — Offline Persistence + Unique ID Generation
- [ ] ขณะ offline → กดปุ่ม **Add quick task** ใน Inbox
- [ ] เห็น NetworkBanner: "Offline mode: 1 change queued"
- [ ] สร้าง task เพิ่มอีก 2-3 ครั้ง → counter เพิ่มขึ้น
- [ ] **ปิดแอปและเปิดใหม่** (ยังปิด network อยู่)
- [ ] NetworkBanner ยังแสดง pending count ถูกต้อง (AsyncStorage ยังจำ)
- [ ] ตรวจสอบใน code: `id = "q-${Date.now()}-${randomHex}"` → unique ทุก item

### C2 — Network Status Awareness (NetworkBanner)
- [ ] ขณะ offline → เห็น banner สีส้ม: `"Offline mode: X changes queued"`
- [ ] **เปิด Network** → banner เปลี่ยนเป็นสีน้ำเงิน: `"Syncing X queued changes"`
- [ ] หลัง sync สำเร็จ → **banner หายไป** (queue ว่าง, online)
- [ ] Banner แสดงทุกหน้า (อยู่ใน Screen component ทุกหน้า)

### C3 — Auto Background Sync
- [ ] สร้าง task ขณะ offline (NetworkBanner แสดง pending count)
- [ ] **เปิด Network กลับมา** → รอ 3-5 วินาที
- [ ] task ที่ queue ไว้ถูก sync ไปยัง server **อัตโนมัติ** (ไม่ต้องกดปุ่มเอง)
- [ ] ไป Inbox → เห็น task ใหม่ (ที่สร้างขณะ offline) ปรากฏในรายการ
- [ ] NetworkBanner หายไปหลัง sync เสร็จ

### C4 — Duplicate Prevention (ไม่ส่งซ้ำ)
- [ ] หลัง sync สำเร็จ (C3) → **ปิด network อีกครั้งแล้วเปิดใหม่**
- [ ] NetworkBanner **ไม่แสดง** pending items (queue ถูก clear หลัง sync)
- [ ] task ที่สร้างก่อนหน้าไม่ถูกสร้างซ้ำใน server
- [ ] ตรวจสอบ: `syncManager` เขียน `remaining[]` คืน (items ที่ fail เท่านั้น → ไม่ re-send ที่ success)

---

## สรุปไฟล์ที่เกี่ยวข้อง

| Checklist | ไฟล์หลัก |
|-----------|---------|
| 7.1 | `src/features/settings/screens/ProfileScreen.tsx` |
| 7.2 | `src/features/productivity/screens/FocusPlannerScreen.tsx`, `src/components/common/CurrencyCard.tsx` (StatCard) |
| 7.3 | `src/features/tasks/screens/TaskDetailScreen.tsx`, `src/store/favoriteStore.ts` |
| 7.4 | `src/features/analytics/screens/AnalyticsScreen.tsx` |
| 7.5 | `src/offline/queueStore.ts`, `src/offline/syncManager.ts`, `src/components/common/NetworkBanner.tsx` |
