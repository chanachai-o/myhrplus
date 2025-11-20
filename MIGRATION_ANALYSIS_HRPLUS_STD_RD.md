# รายงานวิเคราะห์การ Migrate จาก hrplus-std-rd

## 📋 สรุปภาพรวม

รายงานนี้วิเคราะห์สิ่งที่ควรนำมาจากโปรเจ็ค `hrplus-std-rd` มา migrate ใส่ในโปรเจ็ค `angular-hr-migration` โดยพิจารณาจาก:
- โครงสร้างและสถาปัตยกรรม
- Services และ Business Logic
- Models และ Data Structures
- Components และ UI Elements
- Utilities และ Helpers
- Configuration และ Interceptors

---

## 🔍 การเปรียบเทียบโครงสร้าง

### โปรเจ็ค hrplus-std-rd
- **Angular Version**: 20.1.7 (ใหม่กว่า)
- **Architecture**: Module-based (NgModule) + Standalone Components
- **Structure**: `src/app/component/` (feature modules), `src/app/services/`, `src/app/models/`
- **Layout**: `ess-layout/` (ESS Layout Module)

### โปรเจ็ค angular-hr-migration (ปัจจุบัน)
- **Angular Version**: 17.0.0 (เก่ากว่า)
- **Architecture**: Feature-based + Standalone Components
- **Structure**: `src/app/features/`, `src/app/core/`, `src/app/shared/`
- **Layout**: `layout/` (Main Layout)

---

## ✅ สิ่งที่ควร Migrate (Priority: High)

### 1. **Services ที่ยังไม่มีในโปรเจ็คปัจจุบัน**

#### 1.1 Business Logic Services
```
hrplus-std-rd/src/app/services/
├── approve.service.ts              ✅ ควร migrate
├── assess.service.ts               ✅ ควร migrate
├── backpay.service.ts              ✅ ควร migrate
├── bank.service.ts                 ✅ ควร migrate
├── company.service.ts              ⚠️ ตรวจสอบว่ามีแล้วหรือยัง
├── employee.service.ts             ⚠️ ตรวจสอบว่ามีแล้วหรือยัง
├── highcost.service.ts             ✅ ควร migrate
├── holiday2.service.ts             ✅ ควร migrate
├── mempl-groupallowance.service.ts ✅ ควร migrate
├── mempl.service.ts                ✅ ควร migrate
├── moliprice.service.ts            ✅ ควร migrate
├── mrate.service.ts                ✅ ควร migrate
├── myjob.service.ts                ✅ ควร migrate
├── orgchartnew.service.ts          ✅ ควร migrate
├── position-group.service.ts       ✅ ควร migrate
├── private-message.service.ts      ✅ ควร migrate
├── resign-reason.service.ts        ✅ ควร migrate
├── shift-temp.service.ts          ✅ ควร migrate
├── shiftplan.service.ts           ✅ ควร migrate
├── swaplang-code.service.ts       ✅ ควร migrate
├── tc1.service.ts                 ✅ ควร migrate
├── time.service.ts                ⚠️ ตรวจสอบว่ามีแล้วหรือยัง
├── time0.service.ts               ✅ ควร migrate
├── totmdate.service.ts            ✅ ควร migrate
├── transfer-roster.service.ts     ✅ ควร migrate
├── uprofile.service.ts            ✅ ควร migrate
├── vshift.service.ts              ✅ ควร migrate
├── work-area.service.ts           ✅ ควร migrate
├── workarea.service.ts            ✅ ควร migrate
├── workflow.service.ts            ✅ ควร migrate
└── working-time.service.ts       ✅ ควร migrate
```

#### 1.2 Utility Services
```
├── Calendar.ts                    ✅ ควร migrate (ถ้ายังไม่มี)
├── certificate-template.service.ts ✅ ควร migrate
├── dashboard-service.service.ts    ✅ ควร migrate
├── datepicker-ngb.service.ts      ✅ ควร migrate
├── encode-cypto.service.ts        ✅ ควร migrate (Encryption/Decryption)
├── eventgrp.service.ts            ✅ ควร migrate
├── field-masking-config.service.ts ✅ ควร migrate (Data Masking)
├── gworkarea0.service.ts          ✅ ควร migrate
└── logHistory.service.ts          ✅ ควร migrate (Action Logging)
```

#### 1.3 System Services
```
├── http-request.interceptor.ts    ⚠️ ควร migrate (ปรับให้เข้ากับโครงสร้างใหม่)
├── idleTimeout.service.ts         ✅ ควร migrate (Session Timeout)
└── swaplang-code.service.ts       ✅ ควร migrate (Language Swapping)
```

### 2. **Models (329 files)**

**สถานะ**: โปรเจ็ค hrplus-std-rd มี Models ครบถ้วนมากกว่า (329 files) ในขณะที่โปรเจ็คปัจจุบันมีเพียง 5 files

**ควร migrate ทั้งหมด** โดยเฉพาะ:
- Employee-related models
- Workflow models
- Time & Attendance models
- Leave models
- Payroll models
- Training models
- Welfare models
- Company/Organization models

**ตำแหน่งที่ควรวาง**: `src/app/core/models/` หรือ `src/app/shared/models/`

### 3. **Pipes**

#### 3.1 Custom Pipes ที่ยังไม่มี
```
hrplus-std-rd/src/app/pipes/
├── custom-round.pipe.ts           ✅ ควร migrate
├── minus-one-check.pipe.ts        ✅ ควร migrate
└── safe-html.pipe.ts              ⚠️ ตรวจสอบว่ามีแล้วหรือยัง
```

**สถานะปัจจุบัน**: โปรเจ็คมี `safe-html.pipe.ts` และ `date-format.pipe.ts` แล้ว

### 4. **Interceptors**

#### 4.1 HTTP Request Interceptor
**ไฟล์**: `hrplus-std-rd/src/app/services/http-request.interceptor.ts`

**คุณสมบัติ**:
- Token injection (Bearer token)
- URL transformation
- Response caching
- Error handling
- Zeeme token support

**ควร migrate และปรับให้เข้ากับ**:
- `src/app/core/interceptors/auth.interceptor.ts` (อาจรวมกัน)
- `src/app/core/interceptors/error.interceptor.ts`

### 5. **Utilities & Helpers**

#### 5.1 Idle Timeout Service
**ไฟล์**: `hrplus-std-rd/src/app/services/idleTimeout.service.ts`

**ประโยชน์**: จัดการ session timeout อัตโนมัติ

**ควร migrate**: ✅

#### 5.2 Log History Service
**ไฟล์**: `hrplus-std-rd/src/app/services/logHistory.service.ts`

**ประโยชน์**: บันทึก action log ของผู้ใช้

**ควร migrate**: ✅

#### 5.3 Field Masking Service
**ไฟล์**: `hrplus-std-rd/src/app/services/field-masking-config.service.ts`

**ประโยชน์**: Mask sensitive data (บัตรประชาชน, เบอร์โทร, บัญชีธนาคาร)

**ควร migrate**: ✅ (สำคัญมากสำหรับ GDPR/PDPA compliance)

#### 5.4 Encryption Service
**ไฟล์**: `hrplus-std-rd/src/app/services/encode-cypto.service.ts`

**ประโยชน์**: Encrypt/Decrypt sensitive data

**ควร migrate**: ✅ (แม้จะยังไม่ได้ใช้งาน แต่ควรมีไว้)

---

## ⚠️ สิ่งที่ควรตรวจสอบก่อน Migrate (Priority: Medium)

### 1. **Auth Service & Guard**

**สถานะ**:
- โปรเจ็คปัจจุบันมี `AuthService` ที่พัฒนามาแล้วและดีกว่า
- โปรเจ็ค hrplus-std-rd มี `auth.service.ts` และ `auth.guard.ts` แบบเก่า

**คำแนะนำ**:
- ❌ **ไม่ควร migrate** auth service/guard จาก hrplus-std-rd
- ✅ **ควรตรวจสอบ** methods ที่อาจมีใน hrplus-std-rd แต่ยังไม่มีในโปรเจ็คปัจจุบัน:
  - `setMailForgetPassword()` - Forgot password
  - `savePassword()` - Change password (มีแล้วในโปรเจ็คปัจจุบัน)
  - `getDatabase()` - Get database list (มีแล้วในโปรเจ็คปัจจุบัน)
  - `getPdpa()` - Get PDPA consent
  - `savePdpa()` - Save PDPA consent

### 2. **Shared UI Components**

**สถานะ**: hrplus-std-rd มี shared-ui components มากมาย

**ควรตรวจสอบ**:
- Components ที่ยังไม่มีในโปรเจ็คปัจจุบัน
- Components ที่อาจต้องปรับปรุง

**Components ที่น่าสนใจ**:
```
hrplus-std-rd/src/app/component/shared-ui/
├── modal-employee/              ✅ ควรตรวจสอบ
├── modal-mix/                   ✅ ควรตรวจสอบ
├── datepicker-i18n-thai/        ✅ ควรตรวจสอบ (Thai datepicker)
├── language-datepicker/         ✅ ควรตรวจสอบ
├── chat/                        ✅ ควรตรวจสอบ (Private message)
├── dashboards/                  ✅ ควรตรวจสอบ
└── toast/                       ⚠️ ตรวจสอบว่ามีแล้วหรือยัง
```

### 3. **ESS Layout**

**สถานะ**: hrplus-std-rd มี `ess-layout/` module

**คำแนะนำ**:
- ตรวจสอบว่ามี features ที่ยังไม่มีในโปรเจ็คปัจจุบัน
- อาจนำบางส่วนมาใช้ถ้าจำเป็น

---

## 📦 Dependencies ที่ควรพิจารณา

### Packages ที่มีใน hrplus-std-rd แต่ยังไม่มีในโปรเจ็คปัจจุบัน:

```json
{
  "@balkangraph/orgchart.js": "^8.4.0",        // ✅ ควรมี (Org Chart)
  "@fullcalendar/angular": "^7.0.0-rc.0",     // ⚠️ พิจารณา (Calendar)
  "@ng-bootstrap/ng-bootstrap": "^19.0.1",     // ⚠️ พิจารณา (ถ้าใช้ Bootstrap)
  "@ngx-translate/core": "15.0.0",             // ⚠️ พิจารณา (i18n)
  "@ngx-translate/http-loader": "8.0.0",        // ⚠️ พิจารณา (i18n)
  "angular-file-saver": "^1.1.3",              // ✅ ควรมี (File download)
  "angular-formio": "^4.11.5",                 // ⚠️ พิจารณา (Form builder)
  "angular-notifier": "^14.0.0",               // ⚠️ พิจารณา (Notifications)
  "crypto-js": "^3.1.8",                       // ✅ ควรมี (Encryption)
  "jsonwebtoken": "^8.5.1",                    // ⚠️ ตรวจสอบ (JWT)
  "ng2-pdf-viewer": "^10.4.0",                 // ✅ ควรมี (PDF viewer)
  "slick-carousel": "^1.8.1",                  // ⚠️ พิจารณา (Carousel)
  "ts-xlsx": "0.0.11",                         // ⚠️ ตรวจสอบ (Excel)
  "xlsx-js-style": "^1.2.0"                   // ✅ ควรมี (Excel with styles)
}
```

---

## 🎯 แผนการ Migrate แนะนำ

### Phase 1: Core Services & Utilities (High Priority)
1. ✅ Migrate Field Masking Service
2. ✅ Migrate Log History Service
3. ✅ Migrate Idle Timeout Service
4. ✅ Migrate HTTP Request Interceptor (ปรับให้เข้ากับโครงสร้างใหม่)
5. ✅ Migrate Encryption Service
6. ✅ Migrate Custom Pipes (custom-round, minus-one-check)

### Phase 2: Business Logic Services (High Priority)
1. ✅ Migrate Workflow Service
2. ✅ Migrate Time & Attendance Services (time0, time, shiftplan, etc.)
3. ✅ Migrate Employee Services (mempl, mempl-groupallowance, etc.)
4. ✅ Migrate Company Services (orgchartnew, work-area, etc.)
5. ✅ Migrate Training Services
6. ✅ Migrate Welfare Services

### Phase 3: Models (High Priority)
1. ✅ Migrate Models ทั้งหมด (329 files)
2. ✅ จัดระเบียบ Models ตาม feature/module
3. ✅ สร้าง index files สำหรับ easy import

### Phase 4: Components & UI (Medium Priority)
1. ⚠️ ตรวจสอบและ migrate Shared UI Components ที่จำเป็น
2. ⚠️ Migrate Modal Components (modal-employee, modal-mix)
3. ⚠️ Migrate Thai Datepicker Components
4. ⚠️ Migrate Chat Component (ถ้าต้องการ private message)

### Phase 5: Dependencies & Configuration (Medium Priority)
1. ⚠️ ติดตั้ง dependencies ที่จำเป็น
2. ⚠️ ปรับ configuration files
3. ⚠️ Update angular.json (ถ้าจำเป็น)

---

## 📝 ข้อควรระวัง

### 1. **Angular Version Compatibility**
- hrplus-std-rd ใช้ Angular 20.1.7
- โปรเจ็คปัจจุบันใช้ Angular 17.0.0
- **ต้องตรวจสอบ** compatibility ของ code ที่ migrate

### 2. **Architecture Differences**
- hrplus-std-rd ใช้ Module-based architecture
- โปรเจ็คปัจจุบันใช้ Feature-based + Standalone Components
- **ต้องปรับ** code ให้เข้ากับ architecture ใหม่

### 3. **API Endpoints**
- ตรวจสอบว่า API endpoints ใน hrplus-std-rd ยังใช้งานได้หรือไม่
- ปรับให้เข้ากับ environment configuration ของโปรเจ็คปัจจุบัน

### 4. **Dependencies Conflicts**
- ตรวจสอบ dependencies ที่อาจ conflict กัน
- ใช้ version ที่ compatible กับ Angular 17

### 5. **Code Quality**
- Review code ก่อน migrate
- Refactor code ให้เข้ากับ coding standards ของโปรเจ็คปัจจุบัน
- เพิ่ม type safety และ error handling

---

## 🔧 ขั้นตอนการ Migrate แนะนำ

### สำหรับแต่ละ Service/Component:

1. **อ่านและทำความเข้าใจ** code ใน hrplus-std-rd
2. **ตรวจสอบ** ว่ามีในโปรเจ็คปัจจุบันแล้วหรือยัง
3. **ปรับ** code ให้เข้ากับ architecture ใหม่ (Standalone Components)
4. **ทดสอบ** functionality
5. **อัพเดท** dependencies ถ้าจำเป็น
6. **Document** การเปลี่ยนแปลง

---

## 📊 สรุป

### สิ่งที่ควร Migrate (Priority: High)
- ✅ **Services**: ~40 services (Business Logic + Utilities)
- ✅ **Models**: 329 models
- ✅ **Pipes**: 2-3 pipes
- ✅ **Interceptors**: HTTP Request Interceptor
- ✅ **Utilities**: Field Masking, Log History, Idle Timeout, Encryption

### สิ่งที่ควรตรวจสอบก่อน (Priority: Medium)
- ⚠️ **Shared UI Components**: Modal, Datepicker, Chat, etc.
- ⚠️ **Dependencies**: Packages ที่ยังไม่มี
- ⚠️ **ESS Layout**: Features ที่อาจยังไม่มี

### สิ่งที่ไม่ควร Migrate
- ❌ **Auth Service/Guard**: โปรเจ็คปัจจุบันดีกว่า
- ❌ **App Structure**: โปรเจ็คปัจจุบันมี architecture ที่ดีกว่า

---

## 📅 Timeline แนะนำ

- **Week 1-2**: Phase 1 (Core Services & Utilities)
- **Week 3-4**: Phase 2 (Business Logic Services)
- **Week 5-6**: Phase 3 (Models)
- **Week 7-8**: Phase 4 (Components & UI)
- **Week 9-10**: Phase 5 (Dependencies & Configuration) + Testing

---

**หมายเหตุ**: รายงานนี้เป็นแนวทางเบื้องต้น ควรมีการ review และปรับปรุงตามความเหมาะสมของโปรเจ็ค

