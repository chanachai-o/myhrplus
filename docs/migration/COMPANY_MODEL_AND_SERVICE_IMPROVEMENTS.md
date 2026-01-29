# Company Module - การปรับปรุง Model และ Service

**Last Updated**: 2026-01-26

## สรุป

เอกสารนี้อธิบายการปรับปรุงโมเดล (models) และบริการ (services) ใน Company Module ให้ใช้ฟิลด์ตาม API โดยตรง ลดการ map ซ้ำซ้อน และแก้ไขข้อผิดพลาด TypeScript ที่เกี่ยวข้อง

---

## 1. การปรับปรุง Model

### 1.1 ชื่อ Interface หลัก (XxxModel)

- **branch.model.ts**: เปลี่ยน interface หลักจาก `Branch` เป็น `BranchModel` และเพิ่ม `export type Branch = BranchModel` สำหรับ backward compatibility
- **company.model.ts**: เพิ่ม `export type CompanyModel = Company` เพื่อให้ components/services ใช้ `CompanyModel` ได้
- **section.model.ts**: เปลี่ยน interface หลักจาก `Section` เป็น `SectionModel` และเพิ่ม `export type Section = SectionModel`

### 1.2 Bank Company Model (ตาม API)

ปรับ `BankCompanyModel` ให้ตรงกับ JSON ที่ API ส่ง/รับ:

| ฟิลด์ | ประเภท | หมายเหตุ |
|--------|--------|-----------|
| bankId, companyId, bankBranch, branch, bankClient, lineNo | string | |
| bankClientThname, bankClientEngname | string | ใช้ตัวเล็กตาม API |
| account, contactPerson, tel, transOtherDesc | string | |
| transAts, transMedia, transOther, dayDisk, dayCheque | number | 0/1 |
| isdefault | string | ตัว d ตัวเล็ก ตาม API |
| bankTdesc, bankEdesc | string? | จาก relation สำหรับแสดงผล |

---

## 2. การปรับปรุง Service

### 2.1 ลบการ Map ใน getAll / getAllWithPagination

**ก่อน**: map แต่ละ item เป็น object ตามฟิลด์ของ model  
**หลัง**: ใช้ `response.content ?? []` เป็นข้อมูลโดยตรง (type ตาม model)

- **company-type.service.ts**: ลบ `response.content.map((item) => ({ codeId, tdesc, ... }))` ใช้ `PaginatedResponse<CompanyTypeModel>` และ `response.content ?? []`
- **company-group.service.ts**: ลบ `.map((item) => this.normalizeFromApiFormat(item))` ใช้ `response.content ?? []`
- **bank-company.service.ts**: ลบ `.map((item) => this.normalizeFromApiFormat(item))` ใช้ `response.content ?? []`

### 2.2 Bank Company Service – ลบการ Map ใน create/update

- ลบเมธอด `normalizeToApiFormat` และ `normalizeFromApiFormat`
- **create()**: ส่ง `data` ตรงๆ ให้ `this.http.post<BankCompanyModel>(this.apiUrl, data)`
- **update()**: ส่ง `data` ตรงๆ ให้ POST เช่นกัน
- ไม่ map request/response อีกต่อไป ใช้ค่าตาม model โดยตรง

---

## 3. การแก้ไข Routing

อัปเดต `company-routing.module.ts` ให้โหลด component ตามชื่อ class จริง:

| path | ก่อน | หลัง |
|------|------|------|
| company-asset | AssetListComponent | AssetModelListComponent |
| division | DivisionListComponent | DivisionModelListComponent |
| department | DepartmentListComponent | DepartmentModelListComponent |
| section | SectionListComponent | SectionModelListComponent |
| company | CompanyListComponent | CompanyModelListComponent |
| branch | BranchListComponent | BranchModelListComponent |

---

## 4. การแก้ไข Components

### 4.1 Import และ Type

- **Branch**: ใช้ `BranchService` (ไม่ใช้ BranchModelService), ใช้ `BranchModel` จาก branch.model
- **Asset**: ใช้ `AssetService`, `AssetFormComponent`, `AssetModel` (ไม่ใช้ Asset, AssetModelService, AssetModelFormComponent)
- **Section**: ใช้ `SectionModel`, `SectionFormComponent` (ไม่ใช้ Section, SectionModelFormComponent)
- **Company type**: ใช้ `CompanyTypeModel` (ไม่ใช้ CompanyType)
- **Department / Division**: ใช้ `DepartmentService`, `DivisionService` (ไม่ใช้ DepartmentModelService, DivisionModelService)
- **Bank company / Company group**: ใช้ `BankCompanyModel`, `CompanyGroupModel` สำหรับ selectedItem และ type

### 4.2 Bank Company Form/List

- Form controls: `bankClientThname`, `bankClientEngname`, `isdefault`, `transAts` (number), `transMedia`, `transOther`, `transOtherDesc`, `dayDisk`, `dayCheque`
- Checkbox: `isdefault` เป็น string `'1'/'0'`, `transAts` เป็น number 0/1
- List columns และ modelFields ใช้ชื่อฟิลด์ตาม model ใหม่

### 4.3 การจัดการ Error (delete callback)

ใน branch-list, asset-list, department-list, division-list ใช้ type ชัดเจนสำหรับ `err`:

```ts
const errObj = err as { error?: { message?: string }; message?: string };
const errorMessage = errObj?.error?.message || errObj?.message || this.translate.instant(...);
```

### 4.4 Company Form

- ใช้ `isCompany` แทน `isCompanyModel` ใน form และ patchValue/reset

---

## 5. ไฟล์ที่เกี่ยวข้อง

| หมวด | ไฟล์ |
|------|------|
| Models | `models/branch.model.ts`, `company.model.ts`, `section.model.ts`, `bank-company.model.ts` |
| Services | `services/company-type.service.ts`, `company-group.service.ts`, `bank-company.service.ts`, `asset.service.ts`, `branch.service.ts` |
| Routing | `company-routing.module.ts` |
| Components | branch-form/list, asset-form/list, section-form/list, company-type form/list, department form/list, division form/list, bank-company form/list, company-form |

---

## 6. แนวทางสำหรับ Module อื่น

1. **Model**: ตั้งชื่อ interface หลักเป็น `XxxModel` และให้ฟิลด์ตรงกับ API (camelCase หรือตามที่ API กำหนด)
2. **Service getAll/getAllWithPagination**: ใช้ `response.content ?? []` เป็น array ของ model โดยตรง ไม่ map field เอง
3. **Service create/update**: ส่ง `data` ตาม model ตรงๆ ไม่ต้องมี normalizeToApiFormat/normalizeFromApiFormat ถ้า API รับรูปแบบเดียวกับ model
4. **Components**: ใช้ชื่อ Service/Model ให้ตรงกับที่ export จริง (เช่น XxxService, XxxModel) และใช้ชื่อฟิลด์ตาม model ใน columns, modelFields และ form controls
