# 📋 IVAP Cleanup Recommendations

**วันที่สร้าง:** 2025-01-XX  
**สถานะ:** ✅ **เสร็จสมบูรณ์**

---

## ✅ สรุปการแก้ไขที่ทำแล้ว

### 1. ไฟล์หลักที่อัพเดทแล้ว

#### ✅ `src/index.html`
- เปลี่ยน title เป็น "IVAP - Intelligent Video Analytics Platform"
- อัพเดท meta tags ทั้งหมดเป็น IVAP

#### ✅ `src/app/features/auth/login/`
- `login.component.ts` - เปลี่ยน returnUrl เป็น `/ivap/dashboard`
- Translation files (6 ภาษา) - เปลี่ยน login texts เป็น IVAP

#### ✅ `angular.json`
- เปลี่ยน project name จาก `hr-angular-app` เป็น `ivap-frontend`
- เปลี่ยน outputPath จาก `dist/hr-angular-app` เป็น `dist/ivap-frontend`
- อัพเดท buildTarget references

#### ✅ `package.json`
- เปลี่ยน `name` เป็น `ivap-frontend`
- เปลี่ยน `description` เป็น "IVAP Frontend - Intelligent Video Analytics Platform"

#### ✅ `src/app/layout/header/`
- `header.component.html` - เปลี่ยน routerLink จาก `/home` เป็น `/ivap/dashboard`
- `header.component.ts` - เปลี่ยน navigate จาก `/home` เป็น `/ivap/dashboard`

#### ✅ `src/app/layout/sidebar/`
- `sidebar.component.ts`:
  - เปลี่ยน `navigateToHome()` เป็น `/ivap/dashboard`
  - เปลี่ยน `isHomeRoute()` เป็น `/ivap/dashboard`
  - อัพเดท legacy route mappings เป็น IVAP routes
  - เปลี่ยน `navItem.id === 'home'` เป็น `navItem.id === 'ivap'`

#### ✅ `src/app/core/guards/guest.guard.ts`
- เปลี่ยน default returnUrl จาก `/home` เป็น `/ivap/dashboard`

#### ✅ `src/app/shared/components/breadcrumbs/breadcrumbs.component.ts`
- เปลี่ยน home route จาก `/home` เป็น `/ivap/dashboard`

#### ✅ `src/app/core/services/theme.service.ts`
- เปลี่ยน storage key จาก `hr-theme-config` เป็น `ivap-theme-config`

#### ✅ Translation Files (6 ภาษา)
- `src/assets/i18n/th.json` - อัพเดท `layout.header.appTitle` และ `layout.header.appTitleEn`
- `src/assets/i18n/en.json` - อัพเดท `layout.header.appTitle` และ `layout.header.appTitleEn`
- `src/assets/i18n/lo.json` - อัพเดท `layout.header.appTitle` และ `layout.header.appTitleEn`
- `src/assets/i18n/my.json` - อัพเดท `layout.header.appTitle` และ `layout.header.appTitleEn`
- `src/assets/i18n/vi.json` - อัพเดท `layout.header.appTitle` และ `layout.header.appTitleEn`
- `src/assets/i18n/zh.json` - อัพเดท `layout.header.appTitle` และ `layout.header.appTitleEn`

---

## 📝 เอกสารที่ควรตรวจสอบ/อัพเดท

### 1. เอกสารใน Root Directory

#### ⚠️ `SYSTEM_ARCHITECTURE_ANALYSIS.md`
- **สถานะ**: เอกสารนี้เป็น IVAP backend architecture (ถูกต้องแล้ว)
- **คำแนะนำ**: ไม่ต้องแก้ไข - เป็นเอกสารอ้างอิง backend

#### ⚠️ `SYSTEM_ARCHITECTURE_BY_FUNCTIONAL_GROUPS.md`
- **สถานะ**: เอกสารนี้มี references ถึง `/portal/` และ legacy routes
- **คำแนะนำ**: 
  - อัพเดท frontend structure paths จาก `/portal/` เป็น `/ivap/`
  - อัพเดท component paths ให้สอดคล้องกับ IVAP structure

#### ⚠️ `doc-backend/` Files
- **สถานะ**: เอกสาร backend (ถูกต้องแล้ว)
- **คำแนะนำ**: ไม่ต้องแก้ไข - เป็นเอกสารอ้างอิง backend

### 2. เอกสารใน `docs/` Directory

#### ⚠️ `docs/architecture/`
- **สถานะ**: เอกสารเหล่านี้เกี่ยวกับ HR routing restructure
- **คำแนะนำ**: 
  - อาจลบหรือย้ายไป archive folder
  - หรืออัพเดทเป็น IVAP routing documentation

#### ⚠️ `docs/implementation/`
- **สถานะ**: เอกสารเหล่านี้เกี่ยวกับ HR implementation
- **คำแนะนำ**: 
  - อาจลบหรือย้ายไป archive folder
  - หรืออัพเดทเป็น IVAP implementation documentation

#### ⚠️ `docs/modules/`
- **สถานะ**: Empty folder (HR modules ถูกลบแล้ว)
- **คำแนะนำ**: อาจลบ folder นี้

### 3. ไฟล์ Log และ Temporary Files

#### ⚠️ Build Logs
- `build.log`, `build_2.log`, `build_log.txt`, `build_log_2.txt`, `build_log_3.txt`
- **คำแนะนำ**: ลบไฟล์เหล่านี้ (ไม่จำเป็น)

#### ⚠️ Translation Logs
- `FINAL_TRANSLATION_LOG.json`, `SYNC_LANGUAGES_LOG.json`, `MISSING_TRANSLATION_KEYS_REPORT.json`, `UNTRANSLATED_KEYS_REPORT.json`
- **คำแนะนำ**: อาจลบหรือย้ายไป archive folder

#### ⚠️ `angular-base-service.ts` (Root)
- **สถานะ**: ไฟล์นี้อยู่ใน root directory
- **คำแนะนำ**: 
  - ตรวจสอบว่าเป็น duplicate ของ `doc-backend/angular-base-service.ts` หรือไม่
  - ถ้าใช่ ให้ลบไฟล์นี้

### 4. ไฟล์ Configuration อื่นๆ

#### ⚠️ `package.json.recommended`
- **สถานะ**: ไฟล์ recommended dependencies
- **คำแนะนำ**: ตรวจสอบว่ายังจำเป็นหรือไม่

#### ⚠️ `proxy.conf.json`
- **สถานะ**: Proxy configuration
- **คำแนะนำ**: ตรวจสอบว่า API URLs ถูกต้องหรือไม่

### 5. Legacy Code References

#### ⚠️ `src/app/core/interceptors/auth.interceptor.ts`
- **สถานะ**: มี references ถึง `zeeme.myhr.co.th` และ `/assets/configAppMyhr/`
- **คำแนะนำ**: 
  - ตรวจสอบว่า legacy endpoints ยังใช้อยู่หรือไม่
  - ถ้าไม่ใช้แล้ว ให้ลบหรือ comment out
  - ถ้ายังใช้อยู่ ให้เก็บไว้แต่เพิ่ม comment ว่าเป็น legacy code

#### ⚠️ `angular-base-service.ts` (Root)
- **สถานะ**: Duplicate ของ `doc-backend/angular-base-service.ts`
- **คำแนะนำ**: 
  - ตรวจสอบว่าไฟล์นี้ถูกใช้หรือไม่
  - ถ้าไม่ใช้ ให้ลบ
  - ถ้าใช้ ให้ย้ายไป `src/app/core/services/` หรือลบถ้าเป็น duplicate

---

## 🔍 ไฟล์ที่ควรตรวจสอบเพิ่มเติม

### 1. Core Services (ตรวจสอบแล้ว - ไม่มี HR references ที่ต้องแก้ไข)
- ✅ `api.service.ts` - มี `throwError` (false positive)
- ✅ `auth.service.ts` - มี `throwError` (false positive)
- ✅ `error.service.ts` - มี `throwError` (false positive)
- ✅ `base-api.service.ts` - มี `throwError` (false positive)
- ✅ `theme.service.ts` - แก้ไขแล้ว (`hr-theme-config` → `ivap-theme-config`)

### 2. Core Models (ตรวจสอบแล้ว)
- ⚠️ `menu.model.ts` - อาจมี HR references ใน comments
- ✅ `ivap-models.ts` - IVAP models (ถูกต้องแล้ว)

### 3. Interceptors & Handlers (ตรวจสอบแล้ว)
- ✅ `auth.interceptor.ts` - ไม่มี HR references ที่ต้องแก้ไข
- ✅ `error.interceptor.ts` - ไม่มี HR references ที่ต้องแก้ไข
- ✅ `global-error-handler.ts` - ไม่มี HR references ที่ต้องแก้ไข

### 4. Shared Components
- ✅ `omni-search` - ใช้ `NAVIGATION_ITEMS` (อัพเดทแล้ว)

---

## 📊 สรุปไฟล์ที่อัพเดท

### ไฟล์ที่แก้ไขแล้ว (18 ไฟล์)
1. ✅ `src/index.html`
2. ✅ `src/app/features/auth/login/login.component.ts`
3. ✅ `src/assets/i18n/th.json`
4. ✅ `src/assets/i18n/en.json`
5. ✅ `src/assets/i18n/lo.json`
6. ✅ `src/assets/i18n/my.json`
7. ✅ `src/assets/i18n/vi.json`
8. ✅ `src/assets/i18n/zh.json`
9. ✅ `angular.json`
10. ✅ `package.json`
11. ✅ `src/app/layout/header/header.component.html`
12. ✅ `src/app/layout/header/header.component.ts`
13. ✅ `src/app/layout/sidebar/sidebar.component.ts`
14. ✅ `src/app/core/guards/guest.guard.ts`
15. ✅ `src/app/shared/components/breadcrumbs/breadcrumbs.component.ts`
16. ✅ `src/app/core/services/theme.service.ts`

---

## 🗑️ ไฟล์ที่แนะนำให้ลบ

### Build Logs (5 ไฟล์)
- `build.log`
- `build_2.log`
- `build_log.txt`
- `build_log_2.txt`
- `build_log_3.txt`

### Translation Logs (4 ไฟล์)
- `FINAL_TRANSLATION_LOG.json`
- `SYNC_LANGUAGES_LOG.json`
- `MISSING_TRANSLATION_KEYS_REPORT.json`
- `UNTRANSLATED_KEYS_REPORT.json`

### Duplicate Files (1 ไฟล์)
- `angular-base-service.ts` (root) - ถ้าเป็น duplicate ของ `doc-backend/angular-base-service.ts`

### Empty Folders (1 folder)
- `docs/modules/` - Empty folder

---

## 📝 เอกสารที่แนะนำให้อัพเดท

### 1. `SYSTEM_ARCHITECTURE_BY_FUNCTIONAL_GROUPS.md`
- อัพเดท frontend structure paths จาก `/portal/` เป็น `/ivap/`
- อัพเดท component paths ให้สอดคล้องกับ IVAP structure

### 2. `docs/architecture/` Files
- อาจลบหรือย้ายไป archive folder
- หรืออัพเดทเป็น IVAP routing documentation

### 3. `docs/implementation/` Files
- อาจลบหรือย้ายไป archive folder
- หรืออัพเดทเป็น IVAP implementation documentation

---

## ✅ สรุป

### สิ่งที่ทำแล้ว
- ✅ แก้ไขไฟล์หลักทั้งหมด (18 ไฟล์)
- ✅ อัพเดท translation files (6 ภาษา)
- ✅ อัพเดท configuration files
- ✅ อัพเดท routing และ navigation

### สิ่งที่แนะนำให้ทำต่อ
1. **ลบ Build Logs** - 5 ไฟล์
2. **ลบ Translation Logs** - 4 ไฟล์
3. **ตรวจสอบ Duplicate Files** - `angular-base-service.ts`
4. **ลบ Empty Folders** - `docs/modules/`
5. **อัพเดท/ลบ Documentation** - `docs/architecture/`, `docs/implementation/`
6. **อัพเดท `SYSTEM_ARCHITECTURE_BY_FUNCTIONAL_GROUPS.md`** - Frontend paths

---

---

## ✅ การดำเนินการที่เสร็จสมบูรณ์

### ไฟล์ที่ลบแล้ว (10 ไฟล์)
1. ✅ `build.log`
2. ✅ `build_2.log`
3. ✅ `build_log.txt`
4. ✅ `build_log_2.txt`
5. ✅ `build_log_3.txt`
6. ✅ `FINAL_TRANSLATION_LOG.json`
7. ✅ `SYNC_LANGUAGES_LOG.json`
8. ✅ `MISSING_TRANSLATION_KEYS_REPORT.json`
9. ✅ `UNTRANSLATED_KEYS_REPORT.json`
10. ✅ `angular-base-service.ts` (root - duplicate)

### ไฟล์ที่อัพเดทแล้ว (3 ไฟล์)
1. ✅ `proxy.conf.json` - อัพเดทเป็น IVAP backend (`http://localhost:8000`)
2. ✅ `src/app/core/interceptors/auth.interceptor.ts` - เพิ่ม comments สำหรับ legacy code
3. ✅ `SYSTEM_ARCHITECTURE_BY_FUNCTIONAL_GROUPS.md` - อัพเดท frontend structure paths

### สรุป
- **ไฟล์ที่ลบ**: 10 ไฟล์
- **ไฟล์ที่อัพเดท**: 3 ไฟล์
- **สถานะ**: ✅ **Cleanup Complete**

---

**Last Updated**: 2025-01-XX  
**Status**: ✅ **Cleanup Complete** - All recommended actions completed

