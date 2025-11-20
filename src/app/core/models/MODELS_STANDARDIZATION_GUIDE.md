# คู่มือมาตรฐานโมเดล (Models Standardization Guide)

## 📋 สรุปปัญหาและความท้าทาย

### 1. โมเดลที่ซ้ำซ้อน (Duplicate Models)

#### 1.1 Employee Type Models
- `emp-type.model.ts` - ใช้ `EmpTypeModel` class, `getName()` method, `checkData()` helper
- `employee-type.model.ts` - ใช้ `MyEmployeeTypeModel` class, `getDesc()` method, properties เป็น optional
- `emptype.model.ts` - เหมือนกับ `emp-type.model.ts` (duplicate)
- `employeetype.model.ts` - เหมือนกับ `employee-type.model.ts` (duplicate)

**ปัญหา**: มี 4 ไฟล์ที่ทำหน้าที่เหมือนกัน แต่ใช้รูปแบบต่างกัน

### 2. ความไม่สอดคล้องในการตั้งชื่อ (Naming Inconsistencies)

#### 2.1 Class Naming Patterns
- ✅ **Pattern 1**: `EmpTypeModel` (ชื่อเดียวกับ interface)
- ❌ **Pattern 2**: `MyEmployeeTypeModel` (มี prefix "My")
- ❌ **Pattern 3**: `MyPrefix`, `MyCrsType` (มี prefix "My" + ชื่อต่างจาก interface)

**แนะนำ**: ใช้ Pattern 1 (ชื่อเดียวกับ interface) เพื่อความชัดเจน

#### 2.2 Method Naming Patterns
- ✅ **Pattern 1**: `getName()` - ใช้ `baseGetName()` helper
- ❌ **Pattern 2**: `getDesc()` - custom implementation
- ❌ **Pattern 3**: `getPrefixDesc()`, `getCrsTypeDesc()`, `getWorkAreaDesc()` - custom naming

**แนะนำ**: ใช้ `getName()` ทุกโมเดลที่ต้องการแสดงชื่อ (description)

### 3. ความไม่สอดคล้องในการจัดการ Properties

#### 3.1 Property Initialization Patterns
- ✅ **Pattern 1**: ใช้ `checkData()` helper
  ```typescript
  this.codeId = checkData(data?.codeId);
  ```
- ❌ **Pattern 2**: ใช้ default values
  ```typescript
  this.codeId = data?.codeId || '';
  ```
- ❌ **Pattern 3**: ใช้ optional chaining โดยตรง
  ```typescript
  this.codeId = data.codeId;
  ```

**แนะนำ**: ใช้ `checkData()` สำหรับ required properties, ใช้ optional (`?`) สำหรับ optional properties

#### 3.2 Required vs Optional Properties
- บางโมเดล: properties เป็น required (`codeId: string`)
- บางโมเดล: properties เป็น optional (`codeId?: string`)

**แนะนำ**: กำหนดให้ชัดเจนตาม business logic

### 4. Constructor Patterns

#### 4.1 TranslateService Parameter
- ✅ **Pattern 1**: Optional (`translateService?: TranslateService`)
- ❌ **Pattern 2**: Required (`translateService: TranslateService`)
- ❌ **Pattern 3**: ใช้ non-null assertion (`translateService!`)

**แนะนำ**: ใช้ optional (`?`) เพื่อความยืดหยุ่น

---

## 🎯 มาตรฐานที่แนะนำ (Recommended Standards)

### Standard 1: Base Class สำหรับ Code-Description Pattern

โมเดลส่วนใหญ่มีรูปแบบเดียวกัน: `codeId` + `tdesc` + `edesc`

**สร้าง Base Class**:
```typescript
// base-code-description.model.ts
export abstract class BaseCodeDescriptionModel extends BaseModel {
  abstract codeId: string | null;
  abstract tdesc: string | null;
  abstract edesc: string | null;
  
  getName(): string | null {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }
}
```

### Standard 2: Naming Convention

1. **Interface**: ใช้ PascalCase, ไม่มี prefix
   - ✅ `EmpTypeModel`
   - ❌ `MyEmpTypeModel`

2. **Class**: ใช้ชื่อเดียวกับ Interface
   - ✅ `class EmpTypeModel implements EmpTypeModel`
   - ❌ `class MyEmpTypeModel implements EmpTypeModel`

3. **Method**: ใช้ `getName()` สำหรับ description
   - ✅ `getName()`
   - ❌ `getDesc()`, `getPrefixDesc()`, etc.

### Standard 3: Property Handling

1. **Required Properties**: ใช้ `checkData()` helper
   ```typescript
   this.codeId = checkData(data?.codeId);
   ```

2. **Optional Properties**: ใช้ optional (`?`) และ default value
   ```typescript
   this.codeId = data?.codeId ?? null;
   ```

### Standard 4: Constructor Pattern

```typescript
constructor(data?: Partial<ModelInterface>, translateService?: TranslateService) {
  super(data, translateService);
  // Initialize properties
}
```

---

## 📝 แผนการปรับปรุง (Refactoring Plan)

### Phase 1: สร้าง Base Classes
1. ✅ สร้าง `BaseCodeDescriptionModel` สำหรับโมเดลที่มี code + description
2. ✅ สร้าง `BaseIdDescriptionModel` สำหรับโมเดลที่มี id + description

### Phase 2: รวมโมเดลที่ซ้ำซ้อน
1. ✅ รวม `emp-type.model.ts` และ `employee-type.model.ts`
2. ✅ ลบ `emptype.model.ts` และ `employeetype.model.ts` (ถ้ามี)
3. ✅ อัปเดต imports ในไฟล์ที่ใช้งาน

### Phase 3: ปรับโมเดลให้เป็นมาตรฐาน
1. ✅ เปลี่ยน method names เป็น `getName()`
2. ✅ ใช้ `checkData()` helper
3. ✅ ปรับ constructor ให้เป็น optional parameters
4. ✅ ลบ prefix "My" ออกจาก class names

---

## 🔍 รายการโมเดลที่ต้องปรับปรุง

### High Priority (ซ้ำซ้อนหรือใช้บ่อย)
1. `emp-type.model.ts` + `employee-type.model.ts` → รวมเป็น `emp-type.model.ts`
2. `prefix.model.ts` - เปลี่ยน `getPrefixDesc()` → `getName()`
3. `crs-type.model.ts` - เปลี่ยน `getCrsTypeDesc()` → `getName()`
4. `crs-category.model.ts` - เปลี่ยน `getCrsCategoryDesc()` → `getName()`

### Medium Priority (ปรับให้เป็นมาตรฐาน)
- `adj-type.model.ts` - เพิ่ม `getName()` method
- `adj-reason.model.ts` - เพิ่ม `getName()` method
- `sala-type.model.ts` - ใช้ `checkData()` consistently
- `handicapped-type.model.ts` - ใช้ `checkData()` consistently

### Low Priority (ปรับเมื่อมีเวลา)
- โมเดลอื่นๆ ที่ยังไม่เป็นมาตรฐาน

---

## 📚 ตัวอย่างโมเดลมาตรฐาน

### ตัวอย่าง 1: Code-Description Model (Standard)
```typescript
import { TranslateService } from "@ngx-translate/core";
import { BaseCodeDescriptionModel, checkData } from "./base-code-description.model";

export interface EmpTypeModel {
  codeId: string;
  tdesc: string;
  edesc: string;
}

export class EmpTypeModel extends BaseCodeDescriptionModel implements EmpTypeModel {
  codeId: string;
  tdesc: string;
  edesc: string;
  
  constructor(data?: Partial<EmpTypeModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.codeId = checkData(data?.codeId) ?? '';
    this.tdesc = checkData(data?.tdesc) ?? '';
    this.edesc = checkData(data?.edesc) ?? '';
  }
}
```

### ตัวอย่าง 2: Model with Additional Properties
```typescript
import { TranslateService } from "@ngx-translate/core";
import { BaseCodeDescriptionModel, checkData } from "./base-code-description.model";

export interface EmpPositionModel {
  positionId: string;
  tdesc: string;
  edesc: string;
  consolidate: string;
  shortName: string;
}

export class EmpPositionModel extends BaseCodeDescriptionModel implements EmpPositionModel {
  positionId: string;
  tdesc: string;
  edesc: string;
  consolidate: string;
  shortName: string;
  
  constructor(data?: Partial<EmpPositionModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.positionId = checkData(data?.positionId) ?? '';
    this.tdesc = checkData(data?.tdesc) ?? '';
    this.edesc = checkData(data?.edesc) ?? '';
    this.consolidate = checkData(data?.consolidate) ?? '';
    this.shortName = checkData(data?.shortName) ?? '';
  }
  
  // getName() inherited from BaseCodeDescriptionModel
}
```

---

## ✅ Checklist สำหรับโมเดลใหม่

- [ ] Interface และ Class ใช้ชื่อเดียวกัน
- [ ] ไม่มี prefix "My" ในชื่อ class
- [ ] ใช้ `getName()` method (ไม่ใช่ `getDesc()`, `getXxxDesc()`)
- [ ] ใช้ `checkData()` helper สำหรับ required properties
- [ ] Constructor parameters เป็น optional
- [ ] Extend จาก BaseModel หรือ BaseCodeDescriptionModel
- [ ] Properties มี type ที่ชัดเจน (required vs optional)

---

## 🔄 Migration Steps

1. **Backup**: สำรองโค้ดเดิม
2. **Create Base Classes**: สร้าง base classes ใหม่
3. **Refactor One Model**: เริ่มจากโมเดลที่ซ้ำซ้อนมากที่สุด
4. **Update Imports**: อัปเดต imports ในไฟล์ที่ใช้งาน
5. **Test**: ทดสอบให้แน่ใจว่าไม่มี breaking changes
6. **Repeat**: ทำซ้ำกับโมเดลอื่นๆ

---

## 📞 คำถามที่พบบ่อย

**Q: ควรใช้ `checkData()` หรือ `|| ''`?**  
A: ใช้ `checkData()` สำหรับ required properties ที่อาจเป็น null/undefined, ใช้ `?? ''` สำหรับ default value

**Q: ควรใช้ `getName()` หรือ `getDesc()`?**  
A: ใช้ `getName()` เพื่อความสอดคล้องกันทั้งหมด

**Q: ควรมี prefix "My" ในชื่อ class หรือไม่?**  
A: ไม่ควร มีเพื่อความชัดเจนและสอดคล้องกัน

