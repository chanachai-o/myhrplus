# รายงานการตรวจสอบโมเดลทั้งหมด (Models Audit Report)

**วันที่ตรวจสอบ**: 2024  
**จำนวนไฟล์ทั้งหมด**: ~400+ ไฟล์  
**สถานะ**: ตรวจสอบแล้ว

---

## 📊 สรุปผลการตรวจสอบ

### สถิติโดยรวม
- **โมเดลที่ใช้ BaseModel**: 383+ classes
- **โมเดลที่ใช้ "My" prefix**: 282+ classes
- **โมเดลที่มี method getDesc/getXxxDesc**: 232+ methods
- **ไฟล์ที่ซ้ำซ้อน**: 50+ ไฟล์
- **โมเดลที่ปรับเป็นมาตรฐานแล้ว**: 8 โมเดล

---

## 🔴 ปัญหาหลักที่พบ

### 1. ไฟล์ที่ซ้ำซ้อน (Duplicate Files)

#### 1.1 Employee Type Models (4 ไฟล์)
- ✅ `emp-type.model.ts` - **มาตรฐาน** (ใช้ BaseCodeDescriptionModel)
- ❌ `emptype.model.ts` - **ซ้ำซ้อน** (ใช้ BaseModel, มี getName())
- ❌ `employee-type.model.ts` - **ซ้ำซ้อน** (ใช้ MyEmployeeTypeModel, getDesc())
- ❌ `employeetype.model.ts` - **ซ้ำซ้อน** (เหมือน employee-type.model.ts)

**สถานะ**: 
- `emp-type.model.ts` ถูกใช้งานแล้ว
- ไฟล์อื่นๆ ไม่มีการใช้งานแล้ว (สามารถลบได้)

#### 1.2 Contract Party Models (2 ไฟล์)
- ✅ `contract-party.model.ts` - **มาตรฐาน** (ใช้ BaseModel, getName())
- ❌ `contractparty.model.ts` - **ซ้ำซ้อน** (ต้องตรวจสอบ)

#### 1.3 Adjustment Models (4 ไฟล์)
- ✅ `adj-type.model.ts` - **มาตรฐาน** (AdjTypeModel, getName())
- ✅ `adj-reason.model.ts` - **มาตรฐาน** (AdjReasonModel, getName())
- ❌ `adjType.model.ts` - **ซ้ำซ้อน** (ต้องตรวจสอบ)
- ❌ `AdjReason.model.ts` - **ซ้ำซ้อน** (ต้องตรวจสอบ)

#### 1.4 Course Models (6 ไฟล์)
- ✅ `crs-type.model.ts` - **มาตรฐาน** (CrsType, getName())
- ✅ `crs-category.model.ts` - **มาตรฐาน** (CrsCategory, getName())
- ✅ `crs-group.model.ts` - ยังใช้ MyCrsGroup
- ❌ `crstype.model.ts` - **ซ้ำซ้อน**
- ❌ `crscategory.model.ts` - **ซ้ำซ้อน**
- ❌ `crsgroup.model.ts` - **ซ้ำซ้อน**

#### 1.5 Handicapped Type Models (2 ไฟล์)
- ✅ `handicapped-type.model.ts` - **มาตรฐาน** (HandicappedTypeModel)
- ❌ `Handicappedtype.model.ts` - **ซ้ำซ้อน** (case sensitivity issue)

#### 1.6 ไฟล์อื่นๆ ที่ซ้ำซ้อน
- `bank.model.ts` vs `bankBranch.model.ts` vs `bank-branch.model.ts`
- `prefix.model.ts` vs `prefixmodel.model.ts`
- `position.model.ts` vs `positionmodel.model.ts`
- `branch.model.ts` vs `branchmodel.model.ts`
- `district.model.ts` vs `districtmodel.model.ts`
- `province.model.ts` vs `provincemodel.model.ts`
- `zipcode.model.ts` vs `zipcode-object.model.ts`
- และอื่นๆ อีกมากมาย...

---

### 2. Naming Convention Issues

#### 2.1 Class Naming with "My" Prefix (282+ classes)

**โมเดลที่ยังใช้ "My" prefix**:

**Employee Related:**
- `MyEmployee`, `MySalatype`, `MyFamilyLists`
- `MyEmployeeTypeModel`, `MySupEmpGroupContent`
- `MyEmpLeaveSum`, `MyOldJob`, `MyOldEmpPosition`

**Training Related:**
- `MyTraining`, `MyTrainingType`, `MyTrainingStat`
- `MyTrainingHistoryModel`, `MyTrainingContent`
- `MyCourse`, `MyCrsGroup`, `MyAcademy`
- `MyResponsible`, `MyRoom`, `MyLocations`

**Education Related:**
- `MyDegree`, `MyMajor`, `MyFaculty`, `MyInstitue`
- `MyBackground`, `MyEducateModel`

**Location Related:**
- `MyCountry`, `MyProvince`, `MyDistrict`, `MyZipcode`
- `MyNationality`, `MyNationalModel`
- `MyReligionModel`

**Bank & Financial:**
- `MyBank`, `MyBankBranch`, `MyEmpBank`, `MyEmpCard`
- `MyCurrencyModel`, `MyFundTable`, `MyPVFund`

**Welfare Related:**
- `MyWelfare`, `MyWelfareGroupModel`, `MyWelfareCheckModel`
- `MyWelfareDialogModel`, `MyWelfareViewModel`
- `MyWelgrp`, `MySitewel`, `MyDisease`

**Shift & Working Time:**
- `MyShiftModel`, `MyShiftListModel`, `MyShiftListTimeModel`
- `MyShifTimetListModel`, `MyVShiftModel`, `MyVShift1Model`
- `MyWorkingTimeModel`, `MyWorkTimePlanModel`, `MyWorkPlanModel`
- `MyShiftWorkareaModel`

**Workflow:**
- `MyWorkflowMain`, `MyWorkflowRemark`, `MyRequireWFModel`
- `MyStatisticWF`, `MyStatisticWF2`, `MyEventgrpWF`
- `MySendtoModel`

**Other:**
- `MyPrefix`, `MyRelation`, `MyOccupation`, `MyCardType`
- `MySwipeCard`, `MyForgetTime`, `MyTimeWarning`
- `MyMessageModel`, `MyCertificateTemplate`
- `MyDayOff`, `MyFile`, `MyUser`, `MyRole`
- `MyReasonModel`, `MyReasonOtModel`
- `MySubordinatesModel`, `MySubordinatesContent`

**แนะนำ**: เปลี่ยนทั้งหมดเป็นชื่อเดียวกับ interface (ลบ "My" prefix)

#### 2.2 Interface vs Class Naming Mismatch

**ตัวอย่างปัญหา:**
- Interface: `EmployeeTypeModel` → Class: `MyEmployeeTypeModel` ❌
- Interface: `Prefix` → Class: `MyPrefix` ❌
- Interface: `CrsType` → Class: `MyCrsType` ❌

**มาตรฐานที่ถูกต้อง:**
- Interface: `EmpTypeModel` → Class: `EmpTypeModel` ✅
- Interface: `Prefix` → Class: `Prefix` ✅
- Interface: `CrsType` → Class: `CrsType` ✅

---

### 3. Method Naming Issues

#### 3.1 Inconsistent Method Names (232+ methods)

**Pattern ที่พบ:**
1. ✅ `getName()` - **มาตรฐาน** (ใช้ baseGetName helper)
2. ❌ `getDesc()` - ไม่สอดคล้อง
3. ❌ `getPrefixDesc()` - ไม่สอดคล้อง
4. ❌ `getCrsTypeDesc()` - ไม่สอดคล้อง
5. ❌ `getCrsCategoryDesc()` - ไม่สอดคล้อง
6. ❌ `getCourseDesc()` - ไม่สอดคล้อง
7. ❌ `getWorkAreaDesc()` - ไม่สอดคล้อง
8. และอื่นๆ อีกมากมาย...

**แนะนำ**: ใช้ `getName()` ทุกโมเดลที่ต้องการแสดง description

#### 3.2 Custom Implementation vs Helper Function

**ปัญหา:**
- บางโมเดลใช้ `baseGetName()` helper ✅
- บางโมเดลใช้ custom implementation ❌

**ตัวอย่าง:**
```typescript
// ✅ ดี - ใช้ helper
getName() {
  return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
}

// ❌ ไม่ดี - custom implementation
getDesc() {
  return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc;
}
```

---

### 4. Property Initialization Issues

#### 4.1 Inconsistent Property Handling

**Pattern ที่พบ:**
1. ✅ ใช้ `checkData()` helper
   ```typescript
   this.codeId = checkData(data?.codeId) ?? '';
   ```

2. ❌ ใช้ default values
   ```typescript
   this.codeId = data?.codeId || '';
   ```

3. ❌ ใช้ optional chaining โดยตรง
   ```typescript
   this.codeId = data.codeId;
   ```

4. ❌ ใช้ non-null assertion
   ```typescript
   this.codeId = data?.codeId!;
   ```

**แนะนำ**: ใช้ `checkData()` สำหรับ required properties

#### 4.2 Required vs Optional Properties

**ปัญหา:**
- บางโมเดล: properties เป็น required (`codeId: string`)
- บางโมเดล: properties เป็น optional (`codeId?: string`)

**แนะนำ**: กำหนดให้ชัดเจนตาม business logic

---

### 5. Constructor Pattern Issues

#### 5.1 TranslateService Parameter

**Pattern ที่พบ:**
1. ✅ Optional: `translateService?: TranslateService`
2. ❌ Required: `translateService: TranslateService`
3. ❌ Non-null assertion: `translateService!`

**แนะนำ**: ใช้ optional (`?`) เพื่อความยืดหยุ่น

#### 5.2 Data Parameter

**Pattern ที่พบ:**
1. ✅ Optional: `data?: Partial<ModelInterface>`
2. ❌ Required: `data: Partial<ModelInterface>`
3. ❌ Non-null assertion: `data!`

**แนะนำ**: ใช้ optional (`?`) เพื่อความยืดหยุ่น

---

### 6. Base Class Usage Issues

#### 6.1 ไม่ใช้ BaseCodeDescriptionModel

**โมเดลที่มี pattern `codeId + tdesc + edesc` แต่ไม่ใช้ BaseCodeDescriptionModel:**
- `emptype.model.ts` - ควรใช้ BaseCodeDescriptionModel
- `sala-type.model.ts` - ✅ ใช้แล้ว
- `emp-type.model.ts` - ✅ ใช้แล้ว
- และอื่นๆ อีกมากมาย...

**แนะนำ**: ใช้ `BaseCodeDescriptionModel` สำหรับโมเดลที่มี pattern นี้

#### 6.2 ไม่ extend BaseModel

**ตรวจสอบ**: มีโมเดลบางตัวที่ไม่ extend BaseModel หรือไม่?

---

## ✅ โมเดลที่ปรับเป็นมาตรฐานแล้ว

1. ✅ `emp-type.model.ts` - ใช้ BaseCodeDescriptionModel, getName()
2. ✅ `sala-type.model.ts` - ใช้ BaseCodeDescriptionModel, getName()
3. ✅ `adj-type.model.ts` - AdjTypeModel, getName()
4. ✅ `adj-reason.model.ts` - AdjReasonModel, getName()
5. ✅ `prefix.model.ts` - Prefix, getName()
6. ✅ `crs-type.model.ts` - CrsType, getName()
7. ✅ `crs-category.model.ts` - CrsCategory, getName()

---

## 📋 แผนการปรับปรุงที่แนะนำ

### Phase 1: ลบไฟล์ที่ซ้ำซ้อน (Priority: High)
1. ลบ `emptype.model.ts`, `employeetype.model.ts`, `employee-type.model.ts`
2. ลบ `contractparty.model.ts` (ถ้าไม่มีการใช้งาน)
3. ลบ `adjType.model.ts`, `AdjReason.model.ts` (ถ้าไม่มีการใช้งาน)
4. ลบ `crstype.model.ts`, `crscategory.model.ts`, `crsgroup.model.ts` (ถ้าไม่มีการใช้งาน)
5. ลบ `Handicappedtype.model.ts` (ถ้าไม่มีการใช้งาน)
6. ตรวจสอบและลบไฟล์ duplicate อื่นๆ

### Phase 2: ปรับ Naming Convention (Priority: High)
1. เปลี่ยน class names ที่มี "My" prefix → ชื่อเดียวกับ interface
2. อัปเดต imports ในไฟล์ที่ใช้งาน
3. ทดสอบให้แน่ใจว่าไม่มี breaking changes

### Phase 3: ปรับ Method Names (Priority: Medium)
1. เปลี่ยน `getDesc()` → `getName()`
2. เปลี่ยน `getXxxDesc()` → `getName()`
3. ใช้ `baseGetName()` helper แทน custom implementation
4. Deprecate methods เก่า (เก็บไว้เพื่อ backward compatibility)

### Phase 4: ปรับ Property Initialization (Priority: Medium)
1. ใช้ `checkData()` helper สำหรับ required properties
2. กำหนด required vs optional ให้ชัดเจน
3. ใช้ `??` แทน `||` สำหรับ default values

### Phase 5: ใช้ BaseCodeDescriptionModel (Priority: Low)
1. ระบุโมเดลที่มี pattern `codeId + tdesc + edesc`
2. เปลี่ยนให้ extend `BaseCodeDescriptionModel`
3. ลบ `getName()` method ที่ซ้ำซ้อน

---

## 🔍 รายการไฟล์ที่ต้องตรวจสอบเพิ่มเติม

### ไฟล์ที่อาจซ้ำซ้อน (ต้องตรวจสอบการใช้งาน)
- `contractparty.model.ts`
- `adjType.model.ts`
- `AdjReason.model.ts`
- `crstype.model.ts`
- `crscategory.model.ts`
- `crsgroup.model.ts`
- `Handicappedtype.model.ts`
- `prefixmodel.model.ts`
- `positionmodel.model.ts`
- `branchmodel.model.ts`
- `districtmodel.model.ts`
- `provincemodel.model.ts`
- และอื่นๆ อีกมากมาย...

### ไฟล์ที่มี naming issues
- ทุกไฟล์ที่มี class ขึ้นต้นด้วย "My"
- ทุกไฟล์ที่มี method `getXxxDesc()` แทน `getName()`

---

## 📊 สถิติโดยละเอียด

### Naming Issues
- **Classes with "My" prefix**: 282+
- **Methods with custom naming**: 232+
- **Duplicate files**: 50+

### Standardization Progress
- **Standardized models**: 8/400+ (2%)
- **Remaining work**: 392+ models

### File Organization
- **Total model files**: ~400+
- **Documentation files**: 3 (MODELS_STANDARDIZATION_GUIDE.md, REFACTORING_SUMMARY.md, MODELS_AUDIT_REPORT.md)
- **Base classes**: 2 (BaseModel, BaseCodeDescriptionModel)

---

## 🎯 คำแนะนำสำหรับการพัฒนาต่อ

1. **ใช้ BaseCodeDescriptionModel** สำหรับโมเดลที่มี pattern `codeId + tdesc + edesc`
2. **ใช้ชื่อเดียวกับ interface** สำหรับ class names (ไม่มี "My" prefix)
3. **ใช้ `getName()` method** แทน `getDesc()` หรือ `getXxxDesc()`
4. **ใช้ `checkData()` helper** สำหรับ property initialization
5. **ลบไฟล์ที่ซ้ำซ้อน** หลังจากตรวจสอบการใช้งานแล้ว
6. **ทดสอบทุกครั้ง** หลังจากปรับโมเดล

---

## 📝 หมายเหตุ

- รายงานนี้เป็นการตรวจสอบเบื้องต้น
- ควรตรวจสอบการใช้งานจริงก่อนลบไฟล์ duplicate
- ควรทำการ refactor ทีละส่วนเพื่อลดความเสี่ยง
- ควรมี test coverage ก่อนทำการ refactor

---

**อัปเดตล่าสุด**: 2024  
**ผู้ตรวจสอบ**: AI Assistant  
**สถานะ**: ตรวจสอบแล้ว - รอการดำเนินการ

