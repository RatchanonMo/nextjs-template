# TASKMODAL CHECKLIST 6.5 (Schema-to-UI)

เอกสารนี้ใช้เทส Function 6.5 บน Task Modal ของเว็บนี้โดยตรง

หน้าใช้งาน
- เปิดหน้า Home แล้วกด New Task เพื่อเปิด Task Modal

ไฟล์ที่เกี่ยวข้อง
- client/src/components/TaskModal.tsx

## C1: Dynamic Field Rendering

เป้าหมาย
- เพิ่ม field ใหม่ใน schema แล้ว UI ขึ้นทันทีโดยไม่ต้องเขียน JSX ใหม่

วิธีเทส
1. เปิดไฟล์ TaskModal
2. ใน TASK_MODAL_SCHEMA เพิ่ม field ใหม่ใน group settings เช่น

```ts
{
  kind: "field",
  key: "ownerAlias",
  label: "Owner Alias",
  type: "text",
  placeholder: "nickname",
}
```

3. Save แล้วเปิด Task Modal

ผลที่ต้องได้
- มีช่อง Owner Alias ขึ้นใน Modal ทันที
- ไม่ต้องเพิ่ม input JSX แบบ hardcode

----------------------------------------

## C2: Runtime Validation Generation

เป้าหมาย
- validation มาจาก validation_rules ใน schema runtime

วิธีเทส
1. ใน field task.title ตั้ง validation_rules.min เป็น 8
2. เปิด Task Modal แล้วกรอก title สั้นกว่า 8 ตัว
3. กด Save

ผลที่ต้องได้
- มี error ใต้ field title
- toast แจ้งให้แก้ validation

----------------------------------------

## C3: Conditional Display Logic

เป้าหมาย
- show_if ต้องทำงานจริง

วิธีเทส
1. ใน Task Modal เลือก Task Status = done
2. สังเกต field Done Note ต้องแสดงขึ้น
3. เปลี่ยนกลับเป็น todo หรือ in-progress

ผลที่ต้องได้
- Done Note หายจาก DOM เมื่อ status ไม่ใช่ done
- Done Note บังคับกรอกเมื่อ status = done

----------------------------------------

## C4: Payload Construction

เป้าหมาย
- payload ที่ส่งออกตรงโครงสร้าง TaskFormData ของระบบ

วิธีเทส
1. กรอกข้อมูลครบแล้วกด Save
2. เปิด Network ดู request create/update task

ผลที่ต้องได้
- body มี key สำคัญครบ: title, status, category, startTime, endTime, dueDate, projectId, tags
- status/category มาจาก schema field
- labelId จาก UI ถูกแมปเป็น tags

----------------------------------------

## C5: Recursive Components (Nested)

เป้าหมาย
- renderer ต้อง render field ซ้อนกันได้จาก group ซ้อน group

วิธีเทส
1. ดู schema ส่วน schedule > date และ schedule > time
2. เปิด Task Modal

ผลที่ต้องได้
- ทั้ง date group และ time group ถูก render ผ่าน recursive renderer ปกติ
- ไม่มี infinite loop หรือ crash

----------------------------------------

## Regression Check (TaskModal must be the same)

1. ยังสร้าง task ได้
2. ยังแก้ไข task ได้
3. ยังลบ task ได้
4. ปุ่ม Save ยังทำงานพร้อม toast success/error
5. หน้าตา Modal และโครงสร้างหลักยังเหมือนเดิม (Task Name, Project/Label, Category/Status, Date/Time)
