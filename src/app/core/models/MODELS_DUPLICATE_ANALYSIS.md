# การวิเคราะห์ไฟล์ที่ซ้ำซ้อน (Duplicate Files Analysis)

## 📋 สรุปไฟล์ที่ซ้ำซ้อน

### ✅ ไฟล์ที่ตรวจสอบแล้ว - ไม่มีการใช้งาน

#### 1. Employee Type Models
- ❌ `emptype.model.ts` - **ซ้ำซ้อน** (duplicate ของ `emp-type.model.ts`)
  - **สถานะ**: ไม่มีการใช้งานแล้ว
  - **การใช้งาน**: ถูกแทนที่ด้วย `emp-type.model.ts` ใน `employeeprocess.model.ts` และ `employeeroster.model.ts`
  - **แนะนำ**: ลบได้

- ❌ `employeetype.model.ts` - **ซ้ำซ้อน** (duplicate ของ `employee-type.model.ts`)
  - **สถานะ**: ไม่มีการใช้งานแล้ว
  - **แนะนำ**: ลบได้

- ❌ `employee-type.model.ts` - **ซ้ำซ้อน** (duplicate ของ `emp-type.model.ts`)
  - **สถานะ**: Deprecated ใน `index.ts`
  - **แนะนำ**: ลบได้

#### 2. Contract Party Models
- ✅ `contract-party.model.ts` - **มาตรฐาน** (ใช้ BaseModel, getName())
- ❌ `contractparty.model.ts` - **ซ้ำซ้อน** (เหมือนกับ contract-party.model.ts)
  - **ต้องตรวจสอบ**: ยังไม่ทราบการใช้งาน
  - **แนะนำ**: ตรวจสอบการใช้งานก่อนลบ

#### 3. Adjustment Models
- ✅ `adj-type.model.ts` - **มาตรฐาน** (AdjTypeModel, getName())
- ✅ `adj-reason.model.ts` - **มาตรฐาน** (AdjReasonModel, getName())
- ❌ `adjType.model.ts` - **ซ้ำซ้อน** (เหมือนกับ adj-type.model.ts แต่ไม่มี getName())
  - **ต้องตรวจสอบ**: ยังไม่ทราบการใช้งาน
  - **แนะนำ**: ตรวจสอบการใช้งานก่อนลบ

- ❌ `AdjReason.model.ts` - **ซ้ำซ้อน** (เหมือนกับ adj-reason.model.ts แต่ไม่มี getName())
  - **ต้องตรวจสอบ**: ยังไม่ทราบการใช้งาน
  - **แนะนำ**: ตรวจสอบการใช้งานก่อนลบ

#### 4. Course Models
- ✅ `crs-type.model.ts` - **มาตรฐาน** (CrsType, getName())
- ✅ `crs-category.model.ts` - **มาตรฐาน** (CrsCategory, getName())
- ❌ `crstype.model.ts` - **ซ้ำซ้อน**
  - **ต้องตรวจสอบ**: ยังไม่ทราบการใช้งาน
  - **แนะนำ**: ตรวจสอบการใช้งานก่อนลบ

- ❌ `crscategory.model.ts` - **ซ้ำซ้อน**
  - **ต้องตรวจสอบ**: ยังไม่ทราบการใช้งาน
  - **แนะนำ**: ตรวจสอบการใช้งานก่อนลบ

- ❌ `crsgroup.model.ts` - **ซ้ำซ้อน** (duplicate ของ `crs-group.model.ts`)
  - **ต้องตรวจสอบ**: ยังไม่ทราบการใช้งาน
  - **แนะนำ**: ตรวจสอบการใช้งานก่อนลบ

#### 5. Handicapped Type Models
- ✅ `handicapped-type.model.ts` - **มาตรฐาน** (HandicappedTypeModel)
- ❌ `Handicappedtype.model.ts` - **ซ้ำซ้อน** (case sensitivity issue)
  - **ต้องตรวจสอบ**: ยังไม่ทราบการใช้งาน
  - **แนะนำ**: ตรวจสอบการใช้งานก่อนลบ

---

## 🔍 ไฟล์ที่ต้องตรวจสอบเพิ่มเติม

### Pattern: kebab-case vs camelCase

#### 1. Location Models
- `province.model.ts` vs `provincemodel.model.ts`
- `district.model.ts` vs `districtmodel.model.ts`
- `zipcode.model.ts` vs `zipcode-object.model.ts`

#### 2. Employee Models
- `emp-position.model.ts` vs `empposition.model.ts`
- `emp-status.model.ts` vs `empstatus.model.ts`
- `emp-type.model.ts` vs `emptype.model.ts` ✅ (ตรวจสอบแล้ว)
- `emp-group.model.ts` vs `empGroup.model.ts`

#### 3. Bank Models
- `bank.model.ts` vs `bankBranch.model.ts` vs `bank-branch.model.ts`
- `emp-bank.model.ts` vs `empBank.model.ts`
- `emp-card.model.ts` vs `empCard.model.ts`

#### 4. Shift Models
- `shift-list.model.ts` vs `shiftlist.model.ts`
- `shift-list-time.model.ts` vs `shiftlisttime.model.ts`
- `shift-model.model.ts` vs `shiftmodel.model.ts`
- `shift-workarea.model.ts` vs `shiftworkarea.model.ts`
- `shift-time-list.model.ts` vs `shiftimelist.model.ts`

#### 5. Training Models
- `training.model.ts` vs (ไม่มี duplicate)
- `training-type.model.ts` vs (ไม่มี duplicate)
- `training-content.model.ts` vs (ไม่มี duplicate)

#### 6. Welfare Models
- `welfare.model.ts` vs (ไม่มี duplicate)
- `welfare-group.model.ts` vs (ไม่มี duplicate)
- `welfare-check.model.ts` vs (ไม่มี duplicate)

#### 7. Workflow Models
- `workflow.model.ts` vs (ไม่มี duplicate)
- `workflow-main.model.ts` vs (ไม่มี duplicate)
- `workflow-definition.model.ts` vs (ไม่มี duplicate)

#### 8. Other Models
- `prefix.model.ts` vs `prefixmodel.model.ts`
- `position.model.ts` vs `positionmodel.model.ts`
- `branch.model.ts` vs `branchmodel.model.ts`
- `group.model.ts` vs `groupmodel.model.ts`
- `type.model.ts` vs (ไม่มี duplicate)
- `status.model.ts` vs `statusmodel.model.ts`
- `pl.model.ts` vs `plmodel.model.ts`
- `costcenter.model.ts` vs `costcentermodel.model.ts`

---

## 📊 สรุปสถิติ

### ไฟล์ที่ซ้ำซ้อนที่พบ
- **Employee Type**: 3 ไฟล์ (emptype, employeetype, employee-type)
- **Contract Party**: 1 ไฟล์ (contractparty)
- **Adjustment**: 2 ไฟล์ (adjType, AdjReason)
- **Course**: 3 ไฟล์ (crstype, crscategory, crsgroup)
- **Handicapped**: 1 ไฟล์ (Handicappedtype)
- **Other patterns**: ~40+ ไฟล์ (ต้องตรวจสอบเพิ่มเติม)

### ไฟล์ที่สามารถลบได้ทันที
- `emptype.model.ts` ✅
- `employeetype.model.ts` ✅
- `employee-type.model.ts` ✅ (deprecated)

### ไฟล์ที่ต้องตรวจสอบก่อนลบ
- `contractparty.model.ts`
- `adjType.model.ts`
- `AdjReason.model.ts`
- `crstype.model.ts`
- `crscategory.model.ts`
- `crsgroup.model.ts`
- `Handicappedtype.model.ts`
- และไฟล์อื่นๆ ที่มี pattern kebab-case vs camelCase

---

## 🎯 แผนการดำเนินการ

### Phase 1: ลบไฟล์ที่แน่ใจว่าไม่มีการใช้งาน
1. ✅ ลบ `emptype.model.ts`
2. ✅ ลบ `employeetype.model.ts`
3. ✅ ลบ `employee-type.model.ts`

### Phase 2: ตรวจสอบไฟล์ที่ต้องยืนยัน
1. ตรวจสอบการใช้งาน `contractparty.model.ts`
2. ตรวจสอบการใช้งาน `adjType.model.ts`
3. ตรวจสอบการใช้งาน `AdjReason.model.ts`
4. ตรวจสอบการใช้งาน `crstype.model.ts`
5. ตรวจสอบการใช้งาน `crscategory.model.ts`
6. ตรวจสอบการใช้งาน `crsgroup.model.ts`
7. ตรวจสอบการใช้งาน `Handicappedtype.model.ts`

### Phase 3: ตรวจสอบไฟล์ที่มี pattern kebab-case vs camelCase
1. ตรวจสอบไฟล์ location models
2. ตรวจสอบไฟล์ employee models
3. ตรวจสอบไฟล์ bank models
4. ตรวจสอบไฟล์ shift models
5. ตรวจสอบไฟล์อื่นๆ

---

## ⚠️ คำเตือน

- **อย่าลบไฟล์ทันที** โดยไม่ตรวจสอบการใช้งาน
- **ใช้ git** เพื่อ track การเปลี่ยนแปลง
- **ทดสอบ** หลังจากลบไฟล์แต่ละไฟล์
- **ตรวจสอบ imports** ในไฟล์ทั้งหมดก่อนลบ

---

**อัปเดตล่าสุด**: 2024  
**สถานะ**: กำลังตรวจสอบ

