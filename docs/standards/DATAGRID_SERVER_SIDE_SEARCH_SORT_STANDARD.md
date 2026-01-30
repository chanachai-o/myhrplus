# มาตรฐาน: Search / เปลี่ยนหน้า / Sort ให้ Call API ทันที (Server-side)

## สรุปคำแนะนำ

**ให้ทำใน Component แม่ (List Component)** — ไม่ให้ทำใน Component DataGrid

- **การเรียก API (search, เปลี่ยนหน้า, sort)** อยู่ที่ **List Component** (เช่น `company-type-list.component.ts`) เท่านั้น
- **Syncfusion DataGrid** ทำหน้าที่เป็น **Presentational Component**: รับ `dataSource` ผ่าน `@Input` และส่งเหตุการณ์ (เช่น `actionBegin`) ผ่าน `@Output` เท่านั้น

เหตุผลหลัก: DataGrid เป็น shared component ที่ไม่รู้จัก service/endpoint แต่ละ feature; แต่ละหน้ามี service คนละตัว (CompanyTypeService, BranchService, …) และ logic โหลดข้อมูลอยู่ที่ List อยู่แล้ว — แค่ขยายให้รองรับ search และ sort แบบ server-side ให้ครบ

---

## การทำงานปัจจุบัน

### Component แม่ (List) — ตัวอย่าง `company-type-list.component.ts`

| การกระทำ | การทำงานปัจจุบัน |
|----------|-------------------|
| **โหลดข้อมูล** | `loadData(page, size)` → `service.getAllWithPagination({ page, size })` → อัปเดต `data()` เป็น `{ result, count }` |
| **เปลี่ยนหน้า (paging)** | `onActionBegin` เมื่อ `requestType === 'paging'` → อัปเดต `currentPage`, `pageSize` → เรียก `loadData(currentPage, pageSize)` (call API) |
| **Search** | `searchControl.valueChanges` → debounce → `this.grid.search(value)` → **client-side** (กรองข้อมูลใน grid ปัจจุบันเท่านั้น) |
| **Sort** | ไม่มี handler ใน List → Grid ทำ **client-side sort** บนข้อมูลหน้าปัจจุบันเท่านั้น |

### Component DataGrid (`syncfusion-data-grid.component.ts`)

- รับ `dataSource`, `pageSettings`, `columns`, … ผ่าน `@Input`
- ส่ง `actionBegin` (และ events อื่นๆ) ผ่าน `@Output`
- `search(text)` เรียก `this.grid.search(text)` ของ Syncfusion = **client-side search** บนข้อมูลที่มีใน grid
- **ไม่เรียก API** — เป็นแค่ UI layer

---

## แนวทางมาตรฐาน: Server-side Search / Page / Sort

### 1. เก็บการเรียก API ไว้ที่ Component แม่เท่านั้น

- ขยาย `loadData` ให้รับพารามิเตอร์เพิ่ม (ถ้า API รองรับ):
  - `loadData(page?, size?, search?, sort?, direction?)`
- Service ขยายจาก `PaginationParams` (ที่มี `page`, `size`, `sort`, `direction` อยู่แล้ว) ให้รองรับ `search`/`keyword` ตามที่ backend กำหนด

### 2. Search แบบ server-side

- **ไม่ใช้** `this.grid.search(value)` เมื่อต้องการให้ค้นหาทั้งชุดข้อมูลจาก server
- ใน List: จาก `searchControl.valueChanges` (หลัง debounce) เรียก  
  `loadData(0, this.pageSize, value || '', this.sortField, this.sortDirection)`  
  และอัปเดต `data()` ด้วยผลจาก API
- (ถ้าต้องการซ่อน search ใน grid เมื่อใช้ server-side search อาจตั้ง `searchSettings` ให้ไม่แสดงหรือไม่ใช้งานก็ได้)

### 3. เปลี่ยนหน้า (paging)

- ใช้แบบเดิม: ใน `onActionBegin` เมื่อ `requestType === 'paging'` ให้แม่เรียก  
  `loadData(newPage, newPageSize, searchTerm, sortField, sortDirection)`  
  เพื่อให้ API ส่งหน้าปัจจุบัน + search + sort มาพร้อมกัน

### 4. Sort แบบ server-side

- ใน List: ใน `onActionBegin` เมื่อ `requestType === 'sorting'` อ่าน `event.sortColumnName` (หรือชื่อ field ที่ backend ใช้) และทิศทาง (asc/desc)
- เรียก `loadData(this.currentPage, this.pageSize, searchTerm, sortField, sortDirection)`  
  แล้วอัปเดต `data()` และ `pageSettings` ตามผลจาก API
- (ถ้า backend รองรับ multi-column sort ค่อยขยายเป็น array ของ `{ field, direction }` ในขั้นหลัง)

### 5. DataGrid ไม่ต้องเรียก API

- DataGrid แค่:
  - รับ `dataSource` และ `pageSettings` จากแม่
  - ส่ง `actionBegin` (และ events อื่นๆ) ให้แม่
  - แม่เป็นคนตัดสินใจว่าจะเรียก API หรือไม่ (เช่น แม่จะเรียกเมื่อ `requestType === 'paging' | 'sorting'` และเมื่อ search เปลี่ยน)

---

## โครงสร้างที่แนะนำ

```
┌─────────────────────────────────────────────────────────────────┐
│  List Component (Smart)                                          │
│  - loadData(page, size, search?, sort?, direction?)              │
│  - onActionBegin(event) → ถ้า paging/sorting → loadData(...)      │
│  - searchControl.valueChanges → loadData(0, pageSize, search...) │
│  - เรียก Service (CompanyTypeService, BranchService, ...)         │
└───────────────────────────────┬─────────────────────────────────┘
                                │ dataSource, pageSettings
                                │ (actionBegin)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Syncfusion DataGrid (Presentational)                            │
│  - แสดงข้อมูลจาก dataSource                                      │
│  - emit actionBegin (paging, sorting, …)                          │
│  - ไม่เรียก API                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## สรุป

| หัวข้อ | แนะนำ |
|--------|--------|
| **ที่ที่ควร call API (search / เปลี่ยนหน้า / sort)** | **Component แม่ (List Component)** |
| **บทบาทของ DataGrid** | รับข้อมูล + emit events เท่านั้น (ไม่ call API) |
| **มาตรฐาน** | ให้เป็นมาตรฐานเดียวกันทุกหน้า: List ดูแลการโหลดข้อมูลและเรียก API, DataGrid เป็นแค่ UI ที่ส่งเหตุการณ์กลับมา |

เมื่อต้องการให้ “เมื่อ search เปลี่ยนเพจ sort ให้ call API ทันที” ให้ทำที่ **component แม่** โดยขยาย `loadData` และ `onActionBegin` ตามด้านบน และใช้ DataGrid เป็นตัวแสดงผลและส่ง event เท่านั้น

---

## ตัวอย่างการ implement

- **List**: `src/app/features/company/human-resources/company-type/company-type-list.component.ts`
- **Service**: `src/app/features/company/services/company-type.service.ts`
- **Model**: `PaginationParams` ใน `src/app/core/models/pagination.model.ts` (มี `page`, `size`, `sort`, `direction`, `search`)

**Query param ที่ส่งไป API**: ค้นหาใช้ `keyword`, เรียงใช้ `sort` (ชื่อฟิลด์) และ `direction` (asc/desc)

ใน List component:
- เก็บ state: `searchTerm`, `sortField`, `sortDirection`
- `loadData(page?, size?, search?, sort?, direction?)` ส่งพารามิเตอร์ทั้งหมดไปที่ service
- `searchControl.valueChanges` (หลัง debounce + skip(1)) → เรียก `loadData(0, pageSize, searchTerm, ...)`
- `onActionBegin`: ถ้า `requestType === 'paging'` เรียก `loadData` ด้วย search/sort ปัจจุบัน; ถ้า `requestType === 'sorting'` ตั้ง `event.cancel = true` แล้วอัปเดต sort state และเรียก `loadData`
