# 📋 แผนการจัดการ: การแปลงระบบ HR เป็น IVAP Frontend

**วันที่สร้าง:** 2025-01-XX  
**เวอร์ชัน:** 1.0.0  
**สถานะ:** 📋 วางแผน

---

## 🎯 วัตถุประสงค์

แปลง Angular HR System เป็น **IVAP Frontend** (Intelligent Video Analytics Platform) โดย:
1. ลบโค้ดและ references ที่เกี่ยวกับ HR features ทั้งหมด
2. ปรับโครงสร้างให้สอดคล้องกับ IVAP Backend API
3. ใช้โครงสร้างและสไตล์เดิม (Angular 17+, Tailwind CSS, Glass Morphism)
4. เตรียมโครงสร้างสำหรับ IVAP features ครบถ้วน

---

## 📊 สถานะปัจจุบัน

### ✅ สิ่งที่มีอยู่แล้ว

1. **IVAP Features (บางส่วน)**
   - `src/app/features/ivap/` - มี modules หลายตัวแล้ว:
     - `access-control/` ✅
     - `analytics/` ✅
     - `biometric/` ✅
     - `dashboard/` ✅
     - `devices/` ✅
     - `events/` ✅
     - `guests/` ✅
     - `notifications/` ✅
     - `organization/` ✅
     - `parking/` ✅
     - `qr-rfid/` ✅
     - `system/` ✅
     - `time-attendance/` ✅
     - `vehicles/` ✅
     - `verification/` ✅
     - `video-ai/` ✅
     - `visitors/` ✅

2. **IVAP Services**
   - `src/app/core/services/ivap/` - มี services หลายตัวแล้ว:
     - `auth.service.ts` ✅
     - `company.service.ts` ✅
     - `visitor.service.ts` ✅
     - `guest.service.ts` ✅
     - `event.service.ts` ✅
     - `device.service.ts` ✅
     - `door.service.ts` ✅
     - `parking.service.ts` ✅
     - `vehicle.service.ts` ✅
     - และอื่นๆ ✅

3. **IVAP Models**
   - `src/app/core/models/ivap/ivap-models.ts` ✅

4. **Environment Configuration**
   - `src/environments/environment.ts` - ปรับเป็น IVAP API แล้ว ✅

5. **Base Service**
   - `src/app/core/services/base-api.service.ts` ✅

### ❌ สิ่งที่ต้องลบ/ปรับ

1. **HR References** (613 files พบ references)
   - References ใน routes, navigation, constants
   - Comments และ documentation ที่เกี่ยวกับ HR
   - Unused imports และ dependencies

2. **Routes Constants**
   - `src/app/core/constants/routes.constant.ts` - ยังมี HR routes เยอะมาก

3. **Navigation Constants**
   - `src/app/core/constants/navigation.constant.ts` - ยังมี HR navigation items เยอะมาก

4. **Sidebar Modules**
   - `src/app/core/constants/sidebar-modules.constant.ts` - อาจมี HR modules

---

## 🗂️ โครงสร้างเป้าหมาย

```
IVAP_FRONTEND/
├── src/app/
│   ├── core/                    # ✅ เก็บไว้ (ปรับบางส่วน)
│   │   ├── services/
│   │   │   ├── base-api.service.ts  # ✅ มีแล้ว
│   │   │   └── ivap/            # ✅ มีแล้ว
│   │   ├── models/
│   │   │   └── ivap/            # ✅ มีแล้ว
│   │   ├── constants/
│   │   │   ├── routes.constant.ts      # ⚠️ ปรับใหม่ (ลบ HR routes)
│   │   │   ├── navigation.constant.ts  # ⚠️ ปรับใหม่ (ลบ HR navigation)
│   │   │   └── sidebar-modules.constant.ts  # ⚠️ ปรับใหม่
│   │   ├── guards/              # ✅ เก็บไว้
│   │   └── interceptors/        # ✅ เก็บไว้
│   ├── shared/                  # ✅ เก็บไว้
│   ├── layout/                  # ✅ เก็บไว้
│   └── features/                # ⚠️ ปรับใหม่
│       ├── auth/                # ✅ เก็บไว้ (ปรับใหม่)
│       ├── home/                # ⚠️ ปรับใหม่ (IVAP Dashboard)
│       ├── demo/                # ⚠️ พิจารณาเก็บไว้
│       ├── ivap/                # ✅ มีแล้ว (ปรับปรุง)
│       ├── error/               # ✅ เก็บไว้
│       └── not-found/           # ✅ เก็บไว้
├── doc-backend/                 # ✅ เก็บไว้
├── docs/                        # ⚠️ เคลียร์เอกสาร HR
└── src/environments/            # ✅ ปรับแล้ว
```

---

## 📝 แผนการดำเนินงาน (12 Phases)

### 🔄 Phase 1: Preparation (เตรียมความพร้อม)

**วัตถุประสงค์:** Backup และเตรียมความพร้อม

#### 1.1 Git Operations
- [ ] สร้าง backup branch: `git checkout -b backup-hr-system`
- [ ] Push backup branch: `git push origin backup-hr-system`
- [ ] สร้าง branch ใหม่: `git checkout -b ivap-frontend-cleanup`
- [ ] Commit current state: `git commit -am "Backup before IVAP cleanup"`

#### 1.2 วิเคราะห์ Dependencies
- [ ] ตรวจสอบ `package.json` - ระบุ dependencies ที่ไม่ใช้
- [ ] ตรวจสอบ imports ที่ไม่ใช้

#### 1.3 สร้าง Documentation
- [ ] สร้าง `IVAP_MIGRATION_LOG.md` สำหรับบันทึกการเปลี่ยนแปลง

**เวลาโดยประมาณ:** 30 นาที

---

### 🗑️ Phase 2: Cleanup - Routes Constants ✅ **เสร็จสมบูรณ์**

**วัตถุประสงค์:** ลบ HR routes และปรับเป็น IVAP routes

#### 2.1 ปรับ Routes Constants ✅
- [x] แก้ไข `src/app/core/constants/routes.constant.ts`
  - [x] ลบ `ROUTES.PORTAL.*` (HR routes ทั้งหมด)
  - [x] ลบ `ROUTES.LEGACY.*` (HR legacy routes)
  - [x] เพิ่ม IVAP routes ครบถ้วน:
    - Dashboard, Organization, Time & Attendance
    - Visitors, Guests, Events
    - Access Control, Devices, Verification
    - Biometric, Vehicles, Parking
    - QR/RFID, Notifications, Analytics
    - Video AI, System Administration

#### 2.2 ตรวจสอบ Route References ✅
- [x] ค้นหา references ถึง `ROUTES.PORTAL.*` และ `ROUTES.LEGACY.*`
- [x] แก้ไข `error.component.ts` - ใช้ `ROUTES.IVAP.DASHBOARD`
- [x] แก้ไข `not-found.component.ts` - ใช้ `ROUTES.IVAP.DASHBOARD`
- [x] แก้ไข `unauthorized.component.ts` - ใช้ `ROUTES.IVAP.DASHBOARD`
- [x] แก้ไข `app-routing.module.ts` - เพิ่ม IVAP route และเปลี่ยน default redirect

#### 2.3 ไฟล์ที่แก้ไข
- ✅ `src/app/core/constants/routes.constant.ts` - ลบ HR routes, เพิ่ม IVAP routes
- ✅ `src/app/app-routing.module.ts` - เพิ่ม IVAP route
- ✅ `src/app/features/error/error.component.ts` - แก้ไข route reference
- ✅ `src/app/features/not-found/not-found.component.ts` - แก้ไข route reference
- ✅ `src/app/features/auth/unauthorized/unauthorized.component.ts` - แก้ไข route reference

#### 2.4 หมายเหตุ
- ⚠️ `settings-screens.constant.ts` และ `company-screens.constant.ts` ยังใช้ `ROUTES.PORTAL.*` อยู่ (เป็น legacy screens constants สำหรับ migration จาก JSP - จะจัดการใน Phase 7-8)

**เวลาโดยประมาณ:** 1-2 ชั่วโมง  
**เวลาที่ใช้จริง:** ~1 ชั่วโมง  
**สถานะ:** ✅ เสร็จสมบูรณ์

---

### 🗑️ Phase 3: Cleanup - Navigation Constants ✅ **เสร็จสมบูรณ์**

**วัตถุประสงค์:** ลบ HR navigation และปรับเป็น IVAP navigation

#### 3.1 ปรับ Navigation Constants ✅
- [x] แก้ไข `src/app/core/constants/navigation.constant.ts`
  - [x] ลบ HR navigation items ทั้งหมด (Admin, Company Management, Settings)
  - [x] เพิ่ม IVAP navigation items ครบถ้วน:
    - Dashboard
    - Organization Management (Companies, Departments, Positions, Employees, Members)
    - Time & Attendance (Timestamps, Shifts, Leaves)
    - Visitor Management
    - Guest Management
    - Event Management
    - Access Control & Devices
    - Verification & Biometric
    - Vehicles & Parking
    - QR & RFID
    - Notifications & Alerts
    - Analytics & Reporting
    - Video Analytics & AI
    - System Administration

#### 3.2 ตรวจสอบ Navigation References ✅
- [x] ตรวจสอบว่า navigation structure สอดคล้องกับ IVAP routes
- [x] ตรวจสอบ routes ใน navigation items ให้ตรงกับ `routes.constant.ts`

#### 3.3 ไฟล์ที่แก้ไข
- ✅ `src/app/core/constants/navigation.constant.ts` - ลบ HR navigation, เพิ่ม IVAP navigation

**เวลาโดยประมาณ:** 2-3 ชั่วโมง  
**เวลาที่ใช้จริง:** ~30 นาที  
**สถานะ:** ✅ เสร็จสมบูรณ์

---

### 🗑️ Phase 4: Cleanup - Sidebar Modules ✅ **เสร็จสมบูรณ์**

**วัตถุประสงค์:** ลบ HR modules จาก sidebar

#### 4.1 ปรับ Sidebar Modules ✅
- [x] แก้ไข `src/app/core/constants/sidebar-modules.constant.ts`
  - [x] ลบ HR modules ทั้งหมด (home, company, personal, ta, payroll, welfare, training, recruit, appraisal, setting)
  - [x] เพิ่ม IVAP modules ครบถ้วน:
    - Dashboard, Organization, Time & Attendance
    - Visitors, Guests, Events
    - Access Control, Devices, Verification, Biometric
    - Vehicles, Parking, QR & RFID
    - Notifications, Analytics, Video & AI, System

#### 4.2 ตรวจสอบ Sidebar References ✅
- [x] แก้ไข `sidebar.component.ts`:
  - [x] ปรับ `mapRouteToModuleId()` ให้รองรับ IVAP routes
  - [x] ปรับ `getModuleCodeFromRoute()` ให้รองรับ IVAP routes
  - [x] ปรับ `getModuleHomeRoute()` ให้ใช้ IVAP routes

#### 4.3 ไฟล์ที่แก้ไข
- ✅ `src/app/core/constants/sidebar-modules.constant.ts` - ลบ HR modules, เพิ่ม IVAP modules
- ✅ `src/app/layout/sidebar/sidebar.component.ts` - ปรับ route mapping functions

**เวลาโดยประมาณ:** 1 ชั่วโมง  
**เวลาที่ใช้จริง:** ~20 นาที  
**สถานะ:** ✅ เสร็จสมบูรณ์

---

### 🗑️ Phase 5: Cleanup - App Routing

**วัตถุประสงค์:** ลบ HR routes และเพิ่ม IVAP routes

#### 5.1 ปรับ App Routing
- [ ] แก้ไข `src/app/app-routing.module.ts`
  - [ ] ลบ HR feature routes (ถ้ามี)
  - [ ] ตรวจสอบ IVAP routes (อาจมีอยู่แล้วใน `features/ivap/`)

#### 5.2 ตรวจสอบ Route Guards
- [ ] ตรวจสอบ guards ที่เกี่ยวข้องกับ HR routes
- [ ] ปรับ guards สำหรับ IVAP routes

**เวลาโดยประมาณ:** 1 ชั่วโมง

---

### 🗑️ Phase 6: Cleanup - Services & Models

**วัตถุประสงค์:** ลบ HR services/models และตรวจสอบ IVAP services/models

#### 6.1 ตรวจสอบ Services
- [ ] ตรวจสอบ `src/app/core/services/`
  - [ ] ลบ HR-specific services (ถ้ามี)
  - [ ] ตรวจสอบ IVAP services ใน `src/app/core/services/ivap/`
  - [ ] ปรับ services ให้ใช้ `BaseApiService` จาก `doc-backend/`

#### 6.2 ตรวจสอบ Models
- [ ] ตรวจสอบ `src/app/core/models/`
  - [ ] ลบ HR-specific models (ถ้ามี)
  - [ ] ตรวจสอบ IVAP models ใน `src/app/core/models/ivap/`
  - [ ] ปรับ models ให้สอดคล้องกับ `doc-backend/angular-models.ts`

#### 6.3 ปรับ Base Service
- [ ] ตรวจสอบ `src/app/core/services/base-api.service.ts`
  - [ ] เปรียบเทียบกับ `doc-backend/angular-base-service.ts`
  - [ ] ปรับให้สอดคล้องกัน

**เวลาโดยประมาณ:** 2-3 ชั่วโมง

---

### 🗑️ Phase 7: Cleanup - Components & Templates

**วัตถุประสงค์:** ลบ HR components และตรวจสอบ IVAP components

#### 7.1 ตรวจสอบ Feature Components
- [ ] ตรวจสอบ `src/app/features/`
  - [ ] ลบ HR feature modules (ถ้ามี):
    - `appraisal/` (ถ้ามี)
    - `empview/` (ถ้ามี)
    - `personal/` (ถ้ามี)
    - `payroll/` (ถ้ามี)
    - `recruit/` (ถ้ามี)
    - `ta/` (ถ้ามี)
    - `training/` (ถ้ามี)
    - `welfare/` (ถ้ามี)
  - [ ] ตรวจสอบ IVAP components ใน `src/app/features/ivap/`

#### 7.2 ตรวจสอบ Shared Components
- [ ] ตรวจสอบ `src/app/shared/components/`
  - [ ] ลบ HR-specific components (ถ้ามี)
  - [ ] เก็บ shared components ที่ใช้ได้

#### 7.3 ปรับ Home/Dashboard
- [ ] แก้ไข `src/app/features/home/` (ถ้ามี)
  - [ ] ปรับเป็น IVAP Dashboard
  - [ ] หรือใช้ `src/app/features/ivap/dashboard/` แทน

**เวลาโดยประมาณ:** 2-3 ชั่วโมง

---

### 🗑️ Phase 8: Cleanup - Documentation

**วัตถุประสงค์:** เคลียร์เอกสาร HR

#### 8.1 ลบ HR Documentation
- [ ] ตรวจสอบ `docs/`
  - [ ] ลบ `docs/modules/` (HR modules) - ถ้ามี
  - [ ] ลบ `docs/implementation/` (HR implementation) - ถ้ามี
  - [ ] เก็บไว้เฉพาะ docs ที่เกี่ยวกับ:
    - Architecture
    - Styling
    - Theme
    - Components (shared)

#### 8.2 อัพเดท Documentation
- [ ] อัพเดท `README.md` สำหรับ IVAP Frontend
- [ ] สร้าง `IVAP_FRONTEND_GUIDE.md` (ถ้าจำเป็น)

**เวลาโดยประมาณ:** 1 ชั่วโมง

---

### ⚙️ Phase 9: Configuration - Environment & Services

**วัตถุประสงค์:** ปรับ configuration ให้สอดคล้องกับ IVAP

#### 9.1 ตรวจสอบ Environment
- [ ] ตรวจสอบ `src/environments/environment.ts`
  - [ ] ตรวจสอบว่าใช้ IVAP API URLs แล้ว ✅
  - [ ] ตรวจสอบ `apiEndpoints` ให้ครบถ้วน

#### 9.2 ปรับ Base Service
- [ ] ตรวจสอบ `src/app/core/services/base-api.service.ts`
  - [ ] ใช้ `environment.baseUrl` และ `environment.apiVersion`
  - [ ] เปรียบเทียบกับ `doc-backend/angular-base-service.ts`

#### 9.3 ปรับ Auth Service
- [ ] ตรวจสอบ `src/app/core/services/auth.service.ts`
  - [ ] เปรียบเทียบกับ `doc-backend/angular-services-examples.ts`
  - [ ] ปรับให้ใช้ IVAP Auth API

**เวลาโดยประมาณ:** 1-2 ชั่วโมง

---

### 🆕 Phase 10: Enhancement - IVAP Features

**วัตถุประสงค์:** ปรับปรุงและเพิ่มเติม IVAP features

#### 10.1 ตรวจสอบ IVAP Features
- [ ] ตรวจสอบ `src/app/features/ivap/`
  - [ ] ตรวจสอบว่า modules ครบถ้วนตาม `SYSTEM_ARCHITECTURE_ANALYSIS.md`
  - [ ] ตรวจสอบ routing ในแต่ละ module
  - [ ] ตรวจสอบ components ในแต่ละ module

#### 10.2 เพิ่ม Features ที่ขาด
- [ ] เพิ่ม features ที่ยังไม่มี (ถ้ามี):
  - [ ] `monitoring/` (ถ้ายังไม่มี)
  - [ ] `reports/` (ถ้ายังไม่มี)
  - [ ] อื่นๆ ตาม `SYSTEM_ARCHITECTURE_ANALYSIS.md`

#### 10.3 ปรับปรุง Features ที่มี
- [ ] ปรับปรุง components ให้ใช้ services จาก `src/app/core/services/ivap/`
- [ ] ปรับปรุง components ให้ใช้ models จาก `src/app/core/models/ivap/`
- [ ] เพิ่ม error handling และ loading states

**เวลาโดยประมาณ:** 4-6 ชั่วโมง

---

### 🧪 Phase 11: Testing & Cleanup

**วัตถุประสงค์:** ทดสอบและเคลียร์โค้ด

#### 11.1 Build & Lint
- [ ] รัน `npm run build` - ตรวจสอบ build errors
- [ ] แก้ไข build errors
- [ ] รัน `npm run lint` - ตรวจสอบ linter errors
- [ ] แก้ไข linter errors

#### 11.2 Testing
- [ ] ทดสอบ Authentication (login/logout)
- [ ] ทดสอบ Navigation (sidebar, routing)
- [ ] ทดสอบ IVAP Dashboard
- [ ] ทดสอบ IVAP Features (visitors, guests, events, etc.)

#### 11.3 Dependencies Cleanup
- [ ] ตรวจสอบ `package.json` - ลบ dependencies ที่ไม่ใช้
- [ ] รัน `npm install` - อัพเดท dependencies
- [ ] ตรวจสอบ bundle size

#### 11.4 Final Cleanup
- [ ] ลบ unused imports
- [ ] ลบ unused files
- [ ] ลบ unused comments
- [ ] อัพเดท README.md

**เวลาโดยประมาณ:** 2-3 ชั่วโมง

---

### 📝 Phase 12: Documentation & Summary

**วัตถุประสงค์:** สร้างเอกสารสรุป

#### 12.1 สร้าง Migration Summary
- [ ] สร้าง `IVAP_MIGRATION_SUMMARY.md`
  - [ ] สรุปการเปลี่ยนแปลง
  - [ ] ไฟล์ที่ลบ
  - [ ] ไฟล์ที่เพิ่ม
  - [ ] ไฟล์ที่ปรับปรุง

#### 12.2 อัพเดท Documentation
- [ ] อัพเดท `README.md`
- [ ] อัพเดท `IVAP_FRONTEND_GUIDE.md` (ถ้ามี)

#### 12.3 Commit & Push
- [ ] Commit changes: `git commit -am "IVAP Frontend migration complete"`
- [ ] Push to branch: `git push origin ivap-frontend-cleanup`

**เวลาโดยประมาณ:** 1 ชั่วโมง

---

## 📊 สรุปการเปลี่ยนแปลง

### ไฟล์ที่ต้องลบ/ปรับ

| หมวดหมู่ | จำนวน (ประมาณ) | สถานะ |
|---------|----------------|--------|
| HR Routes Constants | 200+ lines | ⚠️ ปรับ |
| HR Navigation Items | 100+ items | ⚠️ ปรับ |
| HR References | 613 files | ⚠️ ปรับ |
| HR Documentation | 20+ files | ❌ ลบ |
| Unused Dependencies | 10+ packages | ❌ ลบ |

### ไฟล์ที่เก็บไว้

| หมวดหมู่ | จำนวน (ประมาณ) | สถานะ |
|---------|----------------|--------|
| Core Services | 10+ services | ✅ เก็บ |
| IVAP Services | 20+ services | ✅ มีแล้ว |
| Shared Components | 50+ components | ✅ เก็บ |
| Layout Components | 4 components | ✅ เก็บ |
| IVAP Features | 15+ modules | ✅ มีแล้ว |
| Auth Module | 1 module | ✅ เก็บ |

### ไฟล์ที่ต้องเพิ่ม/ปรับปรุง

| หมวดหมู่ | จำนวน (ประมาณ) | สถานะ |
|---------|----------------|--------|
| IVAP Routes | 20+ routes | 🆕 เพิ่ม |
| IVAP Navigation Items | 30+ items | 🆕 เพิ่ม |
| IVAP Documentation | 5+ files | 🆕 เพิ่ม |

---

## ⚠️ ข้อควรระวัง

1. **Backup ก่อนลบ:** ต้อง backup โปรเจ็คก่อนลบไฟล์
2. **Git History:** เก็บ git history ไว้สำหรับ reference
3. **Dependencies:** ตรวจสอบ dependencies ที่ไม่ใช้แล้ว
4. **Build Errors:** แก้ไข build errors ทีละขั้นตอน
5. **Testing:** ทดสอบแต่ละ phase ก่อนไปต่อ
6. **IVAP Features:** ตรวจสอบว่า IVAP features ที่มีอยู่แล้วทำงานได้ถูกต้อง

---

## 📚 เอกสารอ้างอิง

- `doc-backend/SYSTEM_ARCHITECTURE_ANALYSIS.md` - IVAP Backend Architecture
- `doc-backend/API_DOCUMENTATION.md` - IVAP API Documentation
- `doc-backend/ANGULAR_INTEGRATION_GUIDE.md` - Angular Integration Guide
- `doc-backend/angular-base-service.ts` - Base API Service
- `doc-backend/angular-models.ts` - TypeScript Models
- `doc-backend/angular-services-examples.ts` - Service Examples
- `doc-backend/CLEANUP_CHECKLIST.md` - Detailed Checklist
- `doc-backend/PROJECT_CLEANUP_ANALYSIS.md` - Detailed Analysis

---

## 🎯 Timeline

| Phase | เวลาโดยประมาณ | เวลาที่ใช้จริง | สถานะ |
|-------|--------------|----------------|--------|
| Phase 1: Preparation | 30 นาที | - | ⏳ Pending |
| Phase 2: Routes Constants | 1-2 ชั่วโมง | ~1 ชั่วโมง | ✅ **เสร็จสมบูรณ์** |
| Phase 3: Navigation Constants | 2-3 ชั่วโมง | ~30 นาที | ✅ **เสร็จสมบูรณ์** |
| Phase 4: Sidebar Modules | 1 ชั่วโมง | ~20 นาที | ✅ **เสร็จสมบูรณ์** |
| Phase 5: App Routing | 1 ชั่วโมง | ⏳ Pending |
| Phase 6: Services & Models | 2-3 ชั่วโมง | ⏳ Pending |
| Phase 7: Components | 2-3 ชั่วโมง | ⏳ Pending |
| Phase 8: Documentation | 1 ชั่วโมง | ⏳ Pending |
| Phase 9: Configuration | 1-2 ชั่วโมง | ⏳ Pending |
| Phase 10: IVAP Features | 4-6 ชั่วโมง | ⏳ Pending |
| Phase 11: Testing | 2-3 ชั่วโมง | ⏳ Pending |
| Phase 12: Documentation | 1 ชั่วโมง | ⏳ Pending |
| **รวม** | **18-26 ชั่วโมง** | ⏳ Pending |

---

---

## 📈 Progress Tracking

### ✅ Phase 2: Cleanup Routes Constants - **เสร็จสมบูรณ์** (2025-01-XX)

**สรุปการเปลี่ยนแปลง:**
- ลบ HR routes ทั้งหมด (`PORTAL.*`, `LEGACY.*`) จาก `routes.constant.ts`
- เพิ่ม IVAP routes ครบถ้วนตามโครงสร้าง IVAP Backend
- แก้ไข error components ให้ใช้ `ROUTES.IVAP.DASHBOARD`
- เพิ่ม IVAP route ใน `app-routing.module.ts`
- เปลี่ยน default redirect จาก `/home` เป็น `/ivap`

**ไฟล์ที่แก้ไข:** 5 ไฟล์  
**Linter Errors:** 0  
**Build Status:** ✅ ผ่าน

---

### ✅ Phase 3: Cleanup Navigation Constants - **เสร็จสมบูรณ์** (2025-01-XX)

**สรุปการเปลี่ยนแปลง:**
- ลบ HR navigation items ทั้งหมด (Admin, Company Management, Settings) จาก `navigation.constant.ts`
- เพิ่ม IVAP navigation items ครบถ้วนตามโครงสร้าง IVAP Backend
- ปรับโครงสร้าง navigation ให้สอดคล้องกับ IVAP routes
- ตรวจสอบ routes ใน navigation items ให้ตรงกับ `routes.constant.ts`

**ไฟล์ที่แก้ไข:** 1 ไฟล์  
**Linter Errors:** 0  
**Build Status:** ✅ ผ่าน

---

### ✅ Phase 4: Cleanup Sidebar Modules - **เสร็จสมบูรณ์** (2025-01-XX)

**สรุปการเปลี่ยนแปลง:**
- ลบ HR modules ทั้งหมด (home, company, personal, ta, payroll, welfare, training, recruit, appraisal, setting) จาก `sidebar-modules.constant.ts`
- เพิ่ม IVAP modules ครบถ้วนตามโครงสร้าง IVAP Backend
- ปรับ `sidebar.component.ts` ให้รองรับ IVAP routes:
  - `mapRouteToModuleId()` - ใช้ `MODULE_ROUTE_MAP` สำหรับ IVAP
  - `getModuleCodeFromRoute()` - รองรับ `/ivap/*` routes
  - `getModuleHomeRoute()` - ใช้ `/ivap/dashboard` เป็น default

**ไฟล์ที่แก้ไข:** 2 ไฟล์  
**Linter Errors:** 0  
**Build Status:** ✅ ผ่าน

---

**อัพเดทล่าสุด:** 2025-01-XX  
**เวอร์ชัน:** 1.0.1  
**สถานะ:** 🔄 กำลังดำเนินการ (Phase 2 เสร็จสมบูรณ์)

