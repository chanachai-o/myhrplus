# Admin Migration Plan - ย้าย Admin Components จาก frontend/ มาโปรเจกต์หลัก

**วันที่**: 2025-01-02  
**สถานะ**: 🚧 กำลังดำเนินการ

---

## 📋 ภาพรวม

ย้าย logic หน้าจอและการทำงานต่างๆจาก `frontend/` folder มาใส่ในโปรเจกต์หลัก (`src/`) ทีละส่วน เริ่มจากส่วนของ admin ระบบ

---

## 🎯 เป้าหมาย

1. **Super Admin Components** - ย้าย components สำหรับ super admin
2. **Portal Admin Components** - ย้าย components สำหรับ company admin (portal)
3. **Services & Models** - ย้าย services และ models ที่เกี่ยวข้อง
4. **Routes & Guards** - อัปเดต routes และ guards

---

## 📊 โครงสร้างปัจจุบัน

### frontend/ (Source)
```
frontend/src/app/features/
├── super-admin/          # Super Admin Components
│   ├── companies/
│   ├── users/
│   ├── rbac/
│   ├── system-settings/
│   ├── audit-logs/
│   ├── backup-restore/
│   ├── license-management/
│   ├── maintenance/
│   ├── module-subscription/
│   └── super-admin-layout/
│
└── portal/              # Portal Admin Components (Company Admin)
    ├── dashboard/
    ├── employees/
    ├── visitors/
    ├── guests/
    ├── departments/
    ├── positions/
    ├── shifts/
    ├── access-control/
    ├── doors/
    ├── vehicles/
    ├── parking-spots/
    ├── devices/
    ├── attendance/
    ├── monitoring/
    ├── video-analytics/
    ├── notifications/
    ├── events/
    ├── locations/
    ├── leaves/
    ├── qr-codes/
    ├── biometric-data/
    ├── rfid-cards/
    ├── ai-models/
    ├── alerts/
    ├── template-management/
    ├── reports/
    └── portal-layout/
```

### src/ (Target)
```
src/app/features/
├── auth/                 # ✅ มีอยู่แล้ว
├── demo/                 # ✅ มีอยู่แล้ว
├── error/                # ✅ มีอยู่แล้ว
├── ivap/                 # ✅ มีอยู่แล้ว
├── not-found/            # ✅ มีอยู่แล้ว
├── admin/                # 🆕 สร้างใหม่ - Super Admin
└── portal/                # 🆕 สร้างใหม่ - Portal Admin
```

---

## 🚀 Phase 1: Super Admin Components

### 1.1 สร้างโครงสร้าง Feature Module

**Files to Create**:
- `src/app/features/admin/admin.module.ts`
- `src/app/features/admin/admin-routing.module.ts`
- `src/app/features/admin/admin-layout/admin-layout.component.ts`
- `src/app/features/admin/admin-layout/admin-layout.component.html`
- `src/app/features/admin/admin-layout/admin-layout.component.scss`

### 1.2 Components to Migrate

1. **Companies Management**
   - `companies.component.ts/html/scss`
   - Route: `/admin/companies`

2. **User Management**
   - `users.component.ts/html/scss`
   - Route: `/admin/users`

3. **RBAC (Role-Based Access Control)**
   - `rbac.component.ts/html/scss`
   - Route: `/admin/rbac`

4. **System Settings**
   - `system-settings.component.ts/html/scss`
   - Route: `/admin/settings`

5. **Audit Logs**
   - `audit-logs.component.ts/html/scss`
   - Route: `/admin/audit-logs`

6. **Backup & Restore**
   - `backup-restore.component.ts/html/scss`
   - Route: `/admin/backup-restore`

7. **License Management**
   - `license-management.component.ts/html/scss`
   - Route: `/admin/license`

8. **Maintenance**
   - `maintenance.component.ts/html/scss`
   - Route: `/admin/maintenance`

9. **Module Subscription**
   - `module-subscription.component.ts/html/scss`
   - Route: `/admin/module-subscription`

### 1.3 Dependencies to Check

- Services: `frontend/src/app/core/services/`
- Models: `frontend/src/app/core/models/`
- Guards: `frontend/src/app/core/guards/`
- Shared Components: `frontend/src/app/shared/components/`

---

## 🚀 Phase 2: Portal Admin Components

### 2.1 สร้างโครงสร้าง Feature Module

**Files to Create**:
- `src/app/features/portal/portal.module.ts`
- `src/app/features/portal/portal-routing.module.ts`
- `src/app/features/portal/portal-layout/portal-layout.component.ts`
- `src/app/features/portal/portal-layout/portal-layout.component.html`
- `src/app/features/portal/portal-layout/portal-layout.component.scss`

### 2.2 Components to Migrate (Priority Order)

**High Priority** (Core Admin Functions):
1. Dashboard
2. Employees
3. Visitors
4. Guests
5. Departments
6. Positions
7. Access Control
8. Doors
9. Devices

**Medium Priority** (Workforce Management):
10. Attendance
11. Shifts
12. Leaves
13. Monitoring

**Low Priority** (Advanced Features):
14. Video Analytics
15. AI Models
16. Alerts
17. Notifications
18. Events
19. Reports
20. Template Management

---

## 🔧 Migration Strategy

### Step 1: Copy Files
- Copy component files (.ts, .html, .scss) จาก `frontend/` ไป `src/`
- Copy service files จาก `frontend/src/app/core/services/` ไป `src/app/core/services/`
- Copy model files จาก `frontend/src/app/core/models/` ไป `src/app/core/models/`

### Step 2: Convert Standalone to Module-based
- แปลง standalone components เป็น module-based components
- เพิ่ม imports ใน feature module
- อัปเดต component decorators

### Step 3: Update Imports
- อัปเดต import paths จาก `frontend/` เป็น `src/`
- ใช้ path aliases (`@core/`, `@shared/`, `@features/`)
- อัปเดต service imports

### Step 4: Update Routes
- เพิ่ม routes ใน feature routing module
- อัปเดต app-routing.module.ts
- อัปเดต route constants

### Step 5: Update Guards
- ตรวจสอบ guards ที่ใช้
- อัปเดต guard imports
- เพิ่ม guards ใน routes

### Step 6: Testing
- ทดสอบแต่ละ component
- ตรวจสอบ routes
- ตรวจสอบ guards
- ตรวจสอบ services

---

## 📝 Checklist

### Phase 1: Super Admin
- [ ] สร้าง admin.module.ts
- [ ] สร้าง admin-routing.module.ts
- [ ] สร้าง admin-layout component
- [ ] ย้าย companies component
- [ ] ย้าย users component
- [ ] ย้าย rbac component
- [ ] ย้าย system-settings component
- [ ] ย้าย audit-logs component
- [ ] ย้าย backup-restore component
- [ ] ย้าย license-management component
- [ ] ย้าย maintenance component
- [ ] ย้าย module-subscription component
- [ ] อัปเดต routes
- [ ] อัปเดต guards
- [ ] ทดสอบ

### Phase 2: Portal Admin
- [ ] สร้าง portal.module.ts
- [ ] สร้าง portal-routing.module.ts
- [ ] สร้าง portal-layout component
- [ ] ย้าย dashboard component
- [ ] ย้าย employees component
- [ ] ย้าย visitors component
- [ ] ย้าย guests component
- [ ] ย้าย departments component
- [ ] ย้าย positions component
- [ ] ย้าย shifts component
- [ ] ย้าย access-control component
- [ ] ย้าย doors component
- [ ] ย้าย devices component
- [ ] ย้าย attendance component
- [ ] ย้าย monitoring component
- [ ] อัปเดต routes
- [ ] อัปเดต guards
- [ ] ทดสอบ

---

## 🚨 ข้อควรระวัง

1. **Standalone vs Module**: frontend/ ใช้ standalone components แต่โปรเจกต์หลักใช้ module-based
2. **Path Aliases**: ต้องใช้ path aliases (`@core/`, `@shared/`, `@features/`)
3. **Services**: ตรวจสอบว่า services มีอยู่แล้วหรือต้องย้าย
4. **Models**: ตรวจสอบว่า models มีอยู่แล้วหรือต้องย้าย
5. **Guards**: ตรวจสอบว่า guards มีอยู่แล้วหรือต้องย้าย
6. **Shared Components**: ตรวจสอบว่า shared components มีอยู่แล้วหรือต้องย้าย

---

## 📚 References

- [Angular Module Architecture](./MODULE_ARCHITECTURE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Component Standards](./COMPONENT_INTERFACE_STANDARDS.md)

---

**Last Updated**: 2025-01-02  
**Status**: 🚧 In Progress

