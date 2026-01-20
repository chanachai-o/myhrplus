# Company Type Migration Guide - ตัวอย่างการ Migrate หน้าทะเบียน

## ภาพรวม

เอกสารนี้เป็นตัวอย่างการ migrate หน้าทะเบียนจาก JSP เป็น Angular โดยใช้ `company-type` เป็น reference implementation

**Location**: `src/app/features/company/human-resources/company-type/`

## โครงสร้างไฟล์

```
company-type/
├── company-type-list.component.ts      # List component (Smart Component)
├── company-type-list.component.html     # List template
├── company-type-form.component.ts      # Form component (Smart Component)
└── company-type-form.component.html    # Form template

../models/
└── company-type.model.ts                # TypeScript interface/model

../services/
└── company-type.service.ts              # Service สำหรับ API calls
```

## สถาปัตยกรรม

### 1. Smart Components Pattern

ทั้ง `company-type-list` และ `company-type-form` เป็น **Smart Components** ที่:
- จัดการ business logic เอง
- เรียกใช้ services โดยตรง
- จัดการ state และ data flow
- ใช้ `@Input()` และ `@Output()` สำหรับ parent-child communication

### 2. Component Structure

#### List Component (`company-type-list.component.ts`)

**Responsibilities:**
- แสดงรายการข้อมูลใน DataGrid
- **รองรับ Server-side Pagination** (รับข้อมูล `{ result: any[], count: number }`)
- จัดการ CRUD operations (Create, Read, Update, Delete)
- จัดการ search และ filtering
- จัดการ confirmation dialogs
- จัดการ loading states
- **แสดง Success/Error Dialog สำหรับ Delete operation**

**Key Features:**
- ใช้ `SyncfusionDataGridComponent` สำหรับแสดงข้อมูล
- ใช้ `signal<any>({ result: [], count: 0 })` สำหรับ reactive data ที่รองรับ pagination
- ใช้ `FormControl` สำหรับ search
- ใช้ `ConfirmationDialogService` สำหรับ confirmation dialogs และ success/error dialogs
- ใช้ `app-skeleton-loader` type="datagrid" สำหรับ loading state

**Imports:**
```typescript
import { SyncfusionDataGridComponent, GridAction } from '@shared/components/syncfusion-data-grid/syncfusion-data-grid.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { first } from 'rxjs/operators';
```

#### Form Component (`company-type-form.component.ts`)

**Responsibilities:**
- แสดง form สำหรับ Add/Edit
- จัดการ form validation
- จัดการ confirmation dialog ก่อนบันทึก
- เรียกใช้ service สำหรับ save/update
- **แสดง Success/Error Dialog สำหรับ Save operation**

**Key Features:**
- ใช้ `ReactiveFormsModule` สำหรับ form management
- ใช้ `ModalComponent` สำหรับ modal dialog (with `useSolidBackground="true"`)
- ใช้ `GlassInputComponent` สำหรับ input fields
- ใช้ `FormValidationMessagesComponent` สำหรับ validation messages
- ใช้ `ConfirmationDialogService` สำหรับ save confirmation และ success/error dialogs

**Imports:**
```typescript
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { FormValidationMessagesComponent } from '@shared/components/form-validation-messages/form-validation-messages.component';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { first } from 'rxjs/operators';
```

### 3. Service Pattern

**Service Location**: `src/app/features/company/services/company-type.service.ts`

**Responsibilities:**
- จัดการ API calls (GET, POST, DELETE)
- **ใช้ POST method สำหรับทั้ง Create และ Update** (ตามมาตรฐานใหม่)
- จัดการ loading state ด้วย `signal()`
- ใช้ `ApiService` wrapper แทน `HttpClient` โดยตรง
- จัดการ error handling
- **Map ข้อมูล API response ให้เป็น camelCase model**
- **ตรวจสอบ Logical Errors ใน Response Body** (แม้ HTTP status เป็น 200 แต่ response มี `state: 'FAIL'`)

**Key Features:**
- ใช้ `providedIn: 'root'` สำหรับ singleton service
- ใช้ `signal()` สำหรับ loading state
- ใช้ `ApiResponse<T>` wrapper สำหรับ API responses
- ใช้ `Observable` สำหรับ async operations

**Error Handling Pattern:**
```typescript
override delete(id: string | number): Observable<void> {
  return this.http.delete<any>(url).pipe(
    tap((response) => {
      // Check for logical error in response (even if HTTP status is 200)
      if (response && (response.state === 'FAIL' || response.success === false || response.statusCode === 500)) {
        throw new Error(response.message || 'Delete failed');
      }
    })
  );
}
```

### 4. Model Pattern

**Model Location**: `src/app/features/company/models/company-type.model.ts`

**Responsibilities:**
- กำหนด TypeScript interface สำหรับ data structure
- **ใช้ camelCase naming convention** (e.g., `codeId`, `editDate`)
- ใช้ strict typing (no `any`)
- ตรงกับ database schema

## Best Practices

### 1. Component Communication

**Parent → Child (List → Form):**
```typescript
// List Component
<app-company-type-form
  [isOpen]="showModal"
  [data]="selectedItem"
  (close)="showModal = false"
  (save)="onSaveSuccess()"
>
</app-company-type-form>
```

**Child → Parent (Form → List):**
```typescript
// Form Component
@Output() close = new EventEmitter<void>();
@Output() save = new EventEmitter<void>();

// Emit events
this.close.emit();
this.save.emit();
```

### 2. State Management

**ใช้ `signal()` สำหรับ reactive data (Server-side Pagination):**
```typescript
// Initial state with empty result and count 0
data = signal<any>({ result: [], count: 0 });

// Update in loadData
this.data.set({
  result: res.data,
  count: res.totalElements
});

// Access in template
[dataSource]="data()"
```

**ใช้ `FormControl` สำหรับ search:**
```typescript
searchControl = new FormControl('');

this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe(value => {
  this.grid.search(value || '');
});
```

### 3. Loading States

**ใช้ service loading signal:**
```typescript
// Service
loading = signal<boolean>(false);

// Component
@if (service.loading()) {
  <app-skeleton-loader 
    type="datagrid" 
    [rows]="10" 
    [columns]="columns.length"
    [showToolbar]="true"
    [showPagination]="true"
    [hasActions]="gridActions.length > 0">
  </app-skeleton-loader>
} @else {
  <app-syncfusion-data-grid [dataSource]="data()"></app-syncfusion-data-grid>
}
```

### 4. Error Handling

**ใช้ NotificationService สำหรับ Load Errors:**
```typescript
this.service.getAll().subscribe({
  next: (res) => {
    this.data.set(res);
  },
  error: (err) => {
    this.notificationService.showError(
      this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.LOAD)
    );
  }
});
```

### 5. Confirmation Dialogs & Success/Error Dialogs

**ใช้ ConfirmationDialogService (Recommended):**

**Delete with Success/Error Dialog:**
```typescript
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { first } from 'rxjs/operators';

onDelete(row: any): void {
  this.confirmationDialogService.confirmDelete().pipe(
    first() // Prevent duplicate subscriptions
  ).subscribe({
    next: async (result: ConfirmationDialogResult) => {
      if (result.confirmed) {
        // Wait for confirmation dialog to fully close
        await this.confirmationDialogService.waitForClose();
        
        this.service.delete(row.codeId).subscribe({
          next: () => {
            // Wait a bit to ensure confirmation dialog is fully closed
            setTimeout(() => {
              const successMessage = this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE);
              this.confirmationDialogService.showSuccess(successMessage).pipe(
                first() // Prevent duplicate subscriptions
              ).subscribe({
                next: () => {
                  this.loadData();
                }
              });
            }, 100);
          },
          error: (err) => {
            // Wait a bit to ensure confirmation dialog is fully closed
            setTimeout(() => {
              const errorMessage = err?.error?.message ||
                                 err?.message ||
                                 this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE);
              this.confirmationDialogService.showError(errorMessage).pipe(
                first() // Prevent duplicate subscriptions
              ).subscribe();
            }, 100);
          }
        });
      }
    }
  });
}
```

**Save with Success/Error Dialog:**
```typescript
onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  
  this.confirmationDialogService.confirmSave(this.isEditMode).pipe(
    first() // Prevent duplicate subscriptions
  ).subscribe({
    next: async (result: ConfirmationDialogResult) => {
      if (result.confirmed) {
        // Wait for confirmation dialog to fully close
        await this.confirmationDialogService.waitForClose();
        this.saveData();
      }
    }
  });
}

private saveData() {
  const request$ = this.isEditMode
    ? this.service.update(formData.codeId, formData)
    : this.service.create(formData);

  request$.subscribe({
    next: () => {
      this.service.loading.set(false);
      // Wait a bit to ensure confirmation dialog is fully closed
      setTimeout(() => {
        const successMessage = this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.SAVE);
        this.confirmationDialogService.showSuccess(successMessage).pipe(
          first() // Prevent duplicate subscriptions
        ).subscribe({
          next: () => {
            this.save.emit();
            this.onClose();
          }
        });
      }, 100);
    },
    error: (err: unknown) => {
      this.service.loading.set(false);
      // Wait a bit to ensure confirmation dialog is fully closed
      setTimeout(() => {
        const errorMessage = (err as any)?.error?.message ||
                           (err as any)?.message ||
                           this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.SAVE);
        this.confirmationDialogService.showError(errorMessage).pipe(
          first() // Prevent duplicate subscriptions
        ).subscribe();
      }, 100);
    }
  });
}
```

**Key Points:**
- **ใช้ `first()` operator** กับทุก dialog subscription เพื่อป้องกัน duplicate subscriptions
- **ใช้ `waitForClose()`** ก่อนเรียก API เพื่อรอให้ confirmation dialog ปิดสนิท
- **ใช้ `setTimeout(100ms)`** ก่อนแสดง Success/Error Dialog เพื่อให้แน่ใจว่า confirmation dialog ปิดสนิทแล้ว
- **ใช้ Dialog แทน Toast** สำหรับ Success/Error messages เพื่อความชัดเจนและไม่ถูกปิดไปพร้อมกับ confirmation dialog

**Note**: `ConfirmationDialogComponent` ถูกเพิ่มใน `app.component.html` เป็น global component แล้ว ไม่ต้องเพิ่ม template ใน component เอง

### 6. Translation

**ใช้ TRANSLATION_KEYS constant:**
```typescript
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

// In component
this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE)

// In template
{{ TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL | translate }}
```

**Expose to template:**
```typescript
readonly TRANSLATION_KEYS = TRANSLATION_KEYS;
```

### 7. Form Validation

**ใช้ Reactive Forms:**
```typescript
this.form = this.fb.group({
  codeId: ['', [Validators.required, Validators.maxLength(3)]],
  tdesc: ['', Validators.required],
  edesc: ['']
});
```

**ใช้ FormValidationMessagesComponent:**
```html
<app-glass-input formControlName="codeId" [useFormValidationMessages]="true">
  <app-form-validation-messages
    [control]="form.get('codeId')"
    [customMessages]="{ required: 'company.companyType.codeIdRequired' | translate }">
  </app-form-validation-messages>
</app-glass-input>
```

### 8. DataGrid Configuration

**ใช้ SyncfusionDataGridComponent:**
```typescript
columns: ColumnModel[] = [
  { field: 'codeId', headerText: 'company.companyType.column.codeId', width: 150, isPrimaryKey: true },
  { field: 'tdesc', headerText: 'company.companyType.column.tdesc', width: 300, minWidth: 200 },
  { field: 'edesc', headerText: 'company.companyType.column.edesc', width: 300, minWidth: 200 },
  { field: 'editDate', headerText: 'company.companyType.column.editDate', type: 'date', width: 180, format: 'dd/MM/yyyy' }
];

gridActions: GridAction[] = [
  {
    id: 'edit',
    title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.EDIT),
    icon: 'ti ti-edit',
    class: 'text-primary',
    onClick: (data) => this.onEdit(data)
  },
  {
    id: 'delete',
    title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE),
    icon: 'ti ti-trash',
    class: 'text-danger',
    onClick: (data) => this.onDelete(data)
  }
];
```

**Template:**
```html
<app-page-header
  [title]="'company.companyType.titleFull' | translate"
  [showBreadcrumbs]="true"
  [actions]="headerActions"
  [useGlassCard]="false"
  icon="domain"
  iconGradient="from-primary to-primary"
  titleGradient="from-primary to-primary"
  customClass="border-b border-primary/30 dark:border-primary/50 pb-4"
>
  <div header-actions class="w-full md:w-64">
    <app-glass-input
      [formControl]="searchControl"
      icon="search"
      [placeholder]="'common.actions.search' | translate"
      [isSearch]="true"
      [customClass]="'h-11 min-h-[44px] text-sm'"
    >
    </app-glass-input>
  </div>
</app-page-header>

<app-syncfusion-data-grid
  [dataSource]="data()"
  [columns]="columns"
  [actions]="gridActions"
  [showToolbar]="true"
  [showColumnMenu]="true"
  [showColumnChooser]="true"
  [pageSettings]="{ pageSize: 10, pageSizes: [10, 20, 50, 100], pageCount: 5 }"
  (rowSelected)="onEdit($event.data)"
  (rowDeleted)="onRowDeleted($event)"
  (actionBegin)="onActionBegin($event)"
>
</app-syncfusion-data-grid>
```

## Migration Checklist

เมื่อ migrate หน้าทะเบียนใหม่ ให้ทำตาม checklist นี้:

### Phase 1: Setup
- [ ] สร้าง model interface (`*.model.ts`) ใช้ **camelCase**
- [ ] สร้าง service (`*.service.ts`) ใช้ **POST for Update**
- [ ] **ตรวจสอบ Logical Errors ใน Response Body** (แม้ HTTP status เป็น 200)
- [ ] เพิ่ม translation keys ใน `th.json`, `en.json`, และภาษาอื่นๆ
- [ ] เพิ่ม route ใน routing module

### Phase 2: List Component
- [ ] สร้าง list component (`*-list.component.ts`)
- [ ] สร้าง list template (`*-list.component.html`)
- [ ] ใช้ `SyncfusionDataGridComponent` สำหรับแสดงข้อมูล
- [ ] **ใช้ `signal<any>({ result: [], count: 0 })` รองรับ Server-side Pagination**
- [ ] ใช้ `PageHeaderComponent` สำหรับ header
- [ ] ใช้ `FormControl` สำหรับ search
- [ ] ใช้ `ConfirmationDialogService` สำหรับ confirmation และ success/error dialogs
- [ ] **ใช้ `first()` operator กับทุก dialog subscription**
- [ ] **ใช้ `waitForClose()` ก่อนเรียก API**
- [ ] **ใช้ `setTimeout(100ms)` ก่อนแสดง Success/Error Dialog**
- [ ] ใช้ `app-skeleton-loader` type="datagrid" สำหรับ loading state

### Phase 3: Form Component
- [ ] สร้าง form component (`*-form.component.ts`)
- [ ] สร้าง form template (`*-form.component.html`)
- [ ] ใช้ `ReactiveFormsModule` สำหรับ form management
- [ ] ใช้ `ModalComponent` สำหรับ modal dialog
- [ ] ใช้ `GlassInputComponent` สำหรับ input fields
- [ ] ใช้ `FormValidationMessagesComponent` สำหรับ validation
- [ ] ใช้ `ConfirmationDialogService` สำหรับ save confirmation และ success/error dialogs
- [ ] **ใช้ `first()` operator กับทุก dialog subscription**
- [ ] **ใช้ `waitForClose()` ก่อนเรียก API**
- [ ] **ใช้ `setTimeout(100ms)` ก่อนแสดง Success/Error Dialog**
- [ ] จัดการ edit mode (disable PK field)

### Phase 4: Integration
- [ ] เชื่อมต่อ list component กับ form component
- [ ] ทดสอบ CRUD operations
- [ ] ทดสอบ validation
- [ ] ทดสอบ error handling (รวมถึง logical errors)
- [ ] ทดสอบ loading states
- [ ] ทดสอบ translation
- [ ] **ทดสอบ Server-side Pagination (เปลี่ยนหน้าแล้วข้อมูลโหลดใหม่)**
- [ ] **ทดสอบ Dialog sequence (Confirmation → Success/Error) ไม่ซ้ำซ้อน**

### Phase 5: Polish
- [ ] เพิ่ม accessibility attributes
- [ ] เพิ่ม keyboard navigation
- [ ] ทดสอบ responsive design
- [ ] ทดสอบ dark mode
- [ ] Code review
- [ ] Documentation

## Common Patterns

### 1. Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class EntityService extends BaseApiService<Entity> {
  loading = signal<boolean>(false);
  
  // Override for custom mapping if needed
  override getAll(params?: PaginationParams): Observable<Entity[]> {
    // ... implementation with mapping to camelCase
  }
  
  // Create and Update use POST
  override update(id: string | number, data: Partial<Entity>): Observable<Entity> {
    this.loading.set(true);
    // Use POST for update
    return this.http.post<Entity>(this.apiUrl, data).pipe(
      // ...
    );
  }

  // Delete with logical error checking
  override delete(id: string | number): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap((response) => {
        // Check for logical error in response (even if HTTP status is 200)
        if (response && (response.state === 'FAIL' || response.success === false || response.statusCode === 500)) {
          throw new Error(response.message || 'Delete failed');
        }
      })
    );
  }
}
```

### 2. List Component Pattern (With Server-side Pagination & Dialogs)
```typescript
import { first } from 'rxjs/operators';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';

export class EntityListComponent implements OnInit {
  // Use signal for data with count support
  data = signal<any>({ result: [], count: 0 });

  loadData(page: number = this.currentPage, size: number = this.pageSize) {
    this.service.getAllWithPagination({ page, size }).subscribe({
      next: (res) => {
        // Update data with { result, count } structure
        this.data.set({
          result: res.data,
          count: res.totalElements
        });
        
        // Update pagination info
        this.currentPage = res.currentPage;
        this.pageSize = res.pageSize;
        // ...
      }
    });
  }

  onDelete(row: any) {
    this.confirmationDialogService.confirmDelete().pipe(
      first() // Prevent duplicate subscriptions
    ).subscribe({
      next: async (result: ConfirmationDialogResult) => {
        if (result.confirmed) {
          // Wait for confirmation dialog to fully close
          await this.confirmationDialogService.waitForClose();
          
          this.service.delete(row.codeId).subscribe({
            next: () => {
              // Wait a bit before showing success dialog
              setTimeout(() => {
                const successMessage = this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE);
                this.confirmationDialogService.showSuccess(successMessage).pipe(
                  first() // Prevent duplicate subscriptions
                ).subscribe({
                  next: () => {
                    this.loadData();
                  }
                });
              }, 100);
            },
            error: (err) => {
              // Wait a bit before showing error dialog
              setTimeout(() => {
                const errorMessage = err?.error?.message ||
                                   err?.message ||
                                   this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE);
                this.confirmationDialogService.showError(errorMessage).pipe(
                  first() // Prevent duplicate subscriptions
                ).subscribe();
              }, 100);
            }
          });
        }
      }
    });
  }
  
  onSaveSuccess() {
    // No dialog here, handled in form
    this.loadData();
    this.showModal = false;
  }
}
```

### 3. Form Component Pattern (With Dialogs)
```typescript
import { first } from 'rxjs/operators';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';

export class EntityFormComponent implements OnChanges {
  // ...
  
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.confirmationDialogService.confirmSave(this.isEditMode).pipe(
      first() // Prevent duplicate subscriptions
    ).subscribe({
      next: async (result: ConfirmationDialogResult) => {
        if (result.confirmed) {
          // Wait for confirmation dialog to fully close
          await this.confirmationDialogService.waitForClose();
          this.saveData();
        }
      }
    });
  }
  
  private saveData() {
    // ...
    request$.subscribe({
      next: () => {
        this.service.loading.set(false);
        // Wait a bit before showing success dialog
        setTimeout(() => {
          const successMessage = this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.SAVE);
          this.confirmationDialogService.showSuccess(successMessage).pipe(
            first() // Prevent duplicate subscriptions
          ).subscribe({
            next: () => {
              this.save.emit();
              this.onClose();
            }
          });
        }, 100);
      },
      error: (err: unknown) => {
        this.service.loading.set(false);
        // Wait a bit before showing error dialog
        setTimeout(() => {
          const errorMessage = (err as any)?.error?.message ||
                             (err as any)?.message ||
                             this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.SAVE);
          this.confirmationDialogService.showError(errorMessage).pipe(
            first() // Prevent duplicate subscriptions
          ).subscribe();
        }, 100);
      }
    });
  }
}
```

## Key Differences from JSP

### 1. Naming Convention
- ❌ JSP: `snake_case` (e.g., `code_id`, `edit_date`)
- ✅ Angular: `camelCase` (e.g., `codeId`, `editDate`)

### 2. HTTP Methods
- ❌ JSP: Various patterns
- ✅ Angular: POST for Create/Update, DELETE for Delete, GET for Read

### 3. Success/Error Feedback
- ❌ JSP: Alert boxes, page reloads
- ✅ Angular: **Dialog-based feedback** (Success/Error Dialogs) แทน Toast notifications
  - **Success Dialog**: แสดงเมื่อ Create/Update/Delete สำเร็จ (มีแค่ปุ่ม OK)
  - **Error Dialog**: แสดงเมื่อ Create/Update/Delete ไม่สำเร็จ (มีแค่ปุ่ม OK)
  - **ใช้ `waitForClose()` และ `setTimeout(100ms)`** เพื่อป้องกัน dialog ซ้ำซ้อน

### 4. Error Handling
- ❌ JSP: Server-side validation only
- ✅ Angular: **ตรวจสอบ Logical Errors ใน Response Body** (แม้ HTTP status เป็น 200 แต่ response มี `state: 'FAIL'`)

### 5. Pagination
- ❌ JSP: Server-side rendering pagination HTML
- ✅ Angular: **Server-side pagination** via API, client-side rendering with `{ result, count }` structure

## References

- **Component Location**: `src/app/features/company/human-resources/company-type/`
- **Service Location**: `src/app/features/company/services/company-type.service.ts`
- **Model Location**: `src/app/features/company/models/company-type.model.ts`
- **Shared Components**: `src/app/shared/components/`
- **Syncfusion Module**: `src/app/shared/syncfusion/syncfusion.module.ts`
- **Translation Keys**: `src/app/core/constants/translation-keys.constant.ts`

---

**Last Updated**: 2026-01-20
**Status**: ✅ Complete Reference Implementation

## Recent Updates (2026-01-20)

### 1. Naming Convention Standardization
- ✅ เปลี่ยน Model properties เป็น `camelCase` ทั้งหมด (e.g., `codeId`, `editDate`)
- ✅ Service ทำหน้าที่ map ข้อมูลจาก API (ถ้ายังส่งมาเป็น format อื่น) ให้เป็น camelCase model

### 2. Service Method Standardization
- ✅ ใช้ `POST` method สำหรับ Update operation (เหมือนกับ Create)
- ✅ `update()` method ใน service เรียกไปที่ `apiUrl` เดียวกันกับ `create()`

### 3. Success/Error Feedback Standardization
- ✅ **เปลี่ยนจาก Toast เป็น Dialog** สำหรับ Success/Error messages
- ✅ **Success Dialog**: ใช้ `confirmationDialogService.showSuccess()` (มีแค่ปุ่ม OK, variant: 'success')
- ✅ **Error Dialog**: ใช้ `confirmationDialogService.showError()` (มีแค่ปุ่ม OK, variant: 'primary')
- ✅ **ใช้ `waitForClose()`** เพื่อรอให้ confirmation dialog ปิดสนิทก่อนเรียก API
- ✅ **ใช้ `setTimeout(100ms)`** ก่อนแสดง Success/Error Dialog เพื่อป้องกัน dialog ซ้ำซ้อน
- ✅ **ใช้ `first()` operator** กับทุก dialog subscription เพื่อป้องกัน duplicate subscriptions

### 4. Server-side Pagination Support
- ✅ **SyncfusionDataGrid**: รองรับ datasource format `{ result: any[], count: number }`
- ✅ **ListComponent**: ส่งข้อมูลพร้อม count ไปยัง grid เพื่อแสดง pager ได้ถูกต้อง
- ✅ **Paging Logic**: เปลี่ยนหน้าแล้วโหลดข้อมูลใหม่จาก API (ไม่โหลดทั้งหมดครั้งเดียว)

### 5. Error Handling Enhancement
- ✅ **ตรวจสอบ Logical Errors**: Service ตรวจสอบ response body สำหรับ `state: 'FAIL'`, `success: false`, หรือ `statusCode: 500` แม้ HTTP status เป็น 200
- ✅ **Throw Error**: เมื่อพบ logical error จะ throw Error เพื่อให้ไปตกที่ error callback ของ component
