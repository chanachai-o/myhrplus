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
- จัดการ CRUD operations (Create, Read, Update, Delete)
- จัดการ search และ filtering
- จัดการ confirmation dialogs
- จัดการ loading states

**Key Features:**
- ใช้ `SyncfusionDataGridComponent` สำหรับแสดงข้อมูล
- ใช้ `signal()` สำหรับ reactive data
- ใช้ `FormControl` สำหรับ search
- ใช้ `ConfirmationDialogService` สำหรับ confirmation dialogs
- ใช้ `NotificationService` สำหรับแสดง messages
- ใช้ `app-skeleton-loader` type="datagrid" สำหรับ loading state

**Imports:**
```typescript
import { SyncfusionDataGridComponent, GridAction } from '@shared/components/syncfusion-data-grid/syncfusion-data-grid.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ConfirmationDialogService } from '@core/services';
import { NotificationService } from '@core/services';
```

#### Form Component (`company-type-form.component.ts`)

**Responsibilities:**
- แสดง form สำหรับ Add/Edit
- จัดการ form validation
- จัดการ confirmation dialog ก่อนบันทึก
- เรียกใช้ service สำหรับ save/update

**Key Features:**
- ใช้ `ReactiveFormsModule` สำหรับ form management
- ใช้ `ModalComponent` สำหรับ modal dialog (with `useSolidBackground="true"`)
- ใช้ `GlassInputComponent` สำหรับ input fields
- ใช้ `FormValidationMessagesComponent` สำหรับ validation messages
- ใช้ `ConfirmationDialogService` สำหรับ save confirmation

**Imports:**
```typescript
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { FormValidationMessagesComponent } from '@shared/components/form-validation-messages/form-validation-messages.component';
import { ConfirmationDialogService } from '@core/services';
```

### 3. Service Pattern

**Service Location**: `src/app/features/company/human-resources/services/company-type.service.ts`

**Responsibilities:**
- จัดการ API calls (GET, POST, PUT, DELETE)
- จัดการ loading state ด้วย `signal()`
- ใช้ `ApiService` wrapper แทน `HttpClient` โดยตรง
- จัดการ error handling

**Key Features:**
- ใช้ `providedIn: 'root'` สำหรับ singleton service
- ใช้ `signal()` สำหรับ loading state
- ใช้ `ApiResponse<T>` wrapper สำหรับ API responses
- ใช้ `Observable` สำหรับ async operations

### 4. Model Pattern

**Model Location**: `src/app/features/company/human-resources/models/company-type.model.ts`

**Responsibilities:**
- กำหนด TypeScript interface สำหรับ data structure
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

**ใช้ `signal()` สำหรับ reactive data:**
```typescript
data = signal<CompanyType[]>([]);

// Update
this.data.set(res);

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

**ใช้ NotificationService:**
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

### 5. Confirmation Dialogs

**ใช้ ConfirmationDialogService (Recommended):**
```typescript
// Import service
import { ConfirmationDialogService } from '@core/services';

// Inject service
private confirmationDialogService = inject(ConfirmationDialogService);

// Delete confirmation
onDelete(row: any): void {
  this.confirmationDialogService.confirmDelete().subscribe({
    next: (result) => {
      if (result.confirmed) {
        this.service.delete(row.codeid).subscribe({
          next: () => {
            this.loadData();
            this.notificationService.showSuccess(
              this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE)
            );
          }
        });
      }
    }
  });
}

// Save confirmation
onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  
  this.confirmationDialogService.confirmSave(this.isEditMode).subscribe({
    next: (result) => {
      if (result.confirmed) {
        this.saveData();
      }
    }
  });
}
```

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
  codeid: ['', [Validators.required, Validators.maxLength(3)]],
  tdesc: ['', Validators.required],
  edesc: ['']
});
```

**ใช้ FormValidationMessagesComponent:**
```html
<app-glass-input formControlName="codeid" [useFormValidationMessages]="true">
  <app-form-validation-messages
    [control]="form.get('codeid')"
    [customMessages]="{ required: 'company.companyType.codeIdRequired' | translate }">
  </app-form-validation-messages>
</app-glass-input>
```

### 8. DataGrid Configuration

**ใช้ SyncfusionDataGridComponent:**
```typescript
columns: ColumnModel[] = [
  { field: 'codeid', headerText: 'company.companyType.column.codeId', width: 150, isPrimaryKey: true },
  { field: 'tdesc', headerText: 'company.companyType.column.tdesc', width: 300, minWidth: 200 },
  { field: 'edesc', headerText: 'company.companyType.column.edesc', width: 300, minWidth: 200 },
  { field: 'edit_date', headerText: 'company.companyType.column.editDate', type: 'date', width: 180, format: 'dd/MM/yyyy' }
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
  customClass="border-b border-gray-200 dark:border-gray-700 pb-4"
>
  <div header-actions class="w-full md:w-64">
    <app-glass-input
      [formControl]="searchControl"
      icon="search"
      [placeholder]="'common.actions.search' | translate"
      [isSearch]="true"
      [customClass]="'h-9 text-sm'"
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
>
</app-syncfusion-data-grid>
```

## Migration Checklist

เมื่อ migrate หน้าทะเบียนใหม่ ให้ทำตาม checklist นี้:

### Phase 1: Setup
- [ ] สร้าง model interface (`*.model.ts`)
- [ ] สร้าง service (`*.service.ts`)
- [ ] เพิ่ม translation keys ใน `th.json`, `en.json`, และภาษาอื่นๆ
- [ ] เพิ่ม route ใน routing module

### Phase 2: List Component
- [ ] สร้าง list component (`*-list.component.ts`)
- [ ] สร้าง list template (`*-list.component.html`)
- [ ] ใช้ `SyncfusionDataGridComponent` สำหรับแสดงข้อมูล
- [ ] ใช้ `PageHeaderComponent` สำหรับ header
- [ ] ใช้ `signal()` สำหรับ data state
- [ ] ใช้ `FormControl` สำหรับ search
- [ ] ใช้ `NotificationService` สำหรับ error/success messages
- [ ] ใช้ `ConfirmationDialogService` สำหรับ delete confirmation
- [ ] ใช้ `app-skeleton-loader` type="datagrid" สำหรับ loading state

### Phase 3: Form Component
- [ ] สร้าง form component (`*-form.component.ts`)
- [ ] สร้าง form template (`*-form.component.html`)
- [ ] ใช้ `ReactiveFormsModule` สำหรับ form management
- [ ] ใช้ `ModalComponent` สำหรับ modal dialog
- [ ] ใช้ `GlassInputComponent` สำหรับ input fields
- [ ] ใช้ `FormValidationMessagesComponent` สำหรับ validation
- [ ] ใช้ `ConfirmationDialogService` สำหรับ save confirmation
- [ ] จัดการ edit mode (disable PK field)

### Phase 4: Integration
- [ ] เชื่อมต่อ list component กับ form component
- [ ] ทดสอบ CRUD operations
- [ ] ทดสอบ validation
- [ ] ทดสอบ error handling
- [ ] ทดสอบ loading states
- [ ] ทดสอบ translation

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
export class EntityService {
  loading = signal<boolean>(false);
  
  constructor(private apiService: ApiService) {}
  
  getAll(): Observable<ApiResponse<Entity[]>> {
    return this.apiService.get<Entity[]>(`${this.baseUrl}/entities`);
  }
  
  getById(id: string): Observable<ApiResponse<Entity>> {
    return this.apiService.get<Entity>(`${this.baseUrl}/entities/${id}`);
  }
  
  create(data: Entity): Observable<ApiResponse<Entity>> {
    this.loading.set(true);
    return this.apiService.post<Entity>(`${this.baseUrl}/entities`, data);
  }
  
  update(id: string, data: Entity): Observable<ApiResponse<Entity>> {
    this.loading.set(true);
    return this.apiService.put<Entity>(`${this.baseUrl}/entities/${id}`, data);
  }
  
  delete(id: string): Observable<ApiResponse<void>> {
    this.loading.set(true);
    return this.apiService.delete<void>(`${this.baseUrl}/entities/${id}`);
  }
}
```

### 2. List Component Pattern
```typescript
export class EntityListComponent implements OnInit {
  public service = inject(EntityService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);
  
  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;
  
  private confirmationDialogService = inject(ConfirmationDialogService);
  
  data = signal<Entity[]>([]);
  showModal = false;
  selectedItem: Entity | null = null;
  searchControl = new FormControl('');
  
  columns: ColumnModel[] = [];
  gridActions: GridAction[] = [];
  
  ngOnInit() {
    this.updateTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslations();
    });
    
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.grid.search(value || '');
    });
    
    this.loadData();
  }
  
  loadData() {
    this.service.getAll().subscribe({
      next: (res) => this.data.set(res),
      error: (err) => {
        this.notificationService.showError(
          this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.LOAD)
        );
      }
    });
  }
}
```

### 3. Form Component Pattern
```typescript
export class EntityFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: Entity | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  
  private fb = inject(FormBuilder);
  private service = inject(EntityService);
  private notificationService = inject(NotificationService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);
  
  form: FormGroup;
  isEditMode = false;
  
  readonly TRANSLATION_KEYS = TRANSLATION_KEYS;
  
  constructor() {
    this.form = this.fb.group({
      // Form controls
    });
  }
  
  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        this.form.patchValue(this.data);
        // Disable PK field in edit mode
      } else {
        this.form.reset();
      }
    }
  }
  
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.confirmationDialogService.confirmSave(this.isEditMode).subscribe({
      next: (result) => {
        if (result.confirmed) {
          this.saveData();
        }
      }
    });
  }
  
  private saveData() {
    const formData = this.form.getRawValue();
    this.service.loading.set(true);
    
    const request$ = this.isEditMode
      ? this.service.update(formData.id, formData)
      : this.service.create(formData);
    
    request$.subscribe({
      next: () => {
        this.service.loading.set(false);
        this.save.emit();
        this.onClose();
      },
      error: (err: unknown) => {
        this.service.loading.set(false);
        this.notificationService.showError(
          this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.SAVE)
        );
      }
    });
  }
}
```

## Key Differences from JSP

### 1. No Direct DOM Manipulation
- ❌ JSP: `document.getElementById()`, jQuery
- ✅ Angular: `@ViewChild`, `FormControl`, Reactive Forms

### 2. Type Safety
- ❌ JSP: No type checking
- ✅ Angular: TypeScript interfaces, strict typing

### 3. State Management
- ❌ JSP: Global variables, form state
- ✅ Angular: `signal()`, `FormControl`, reactive state

### 4. Component Communication
- ❌ JSP: Direct function calls, global scope
- ✅ Angular: `@Input()`, `@Output()`, EventEmitters

### 5. Error Handling
- ❌ JSP: Alert boxes, page reloads
- ✅ Angular: `NotificationService`, error interceptors

### 6. Loading States
- ❌ JSP: Manual show/hide, page reloads
- ✅ Angular: `signal()`, `app-skeleton-loader`, reactive loading

### 7. Validation
- ❌ JSP: Manual validation, server-side only
- ✅ Angular: Reactive Forms, client-side validation, `FormValidationMessagesComponent`

### 8. Dialogs
- ❌ JSP: Alert/Confirm, custom modals
- ✅ Angular: `ConfirmationDialogService` (centralized), `ModalComponent`

## Testing Checklist

- [ ] Load data successfully
- [ ] Search functionality works
- [ ] Add new record
- [ ] Edit existing record
- [ ] Delete record with confirmation
- [ ] Form validation works
- [ ] Error handling works
- [ ] Loading states display correctly
- [ ] Translation works (all languages)
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] Accessibility (keyboard navigation, ARIA labels)

## References

- **Component Location**: `src/app/features/company/human-resources/company-type/`
- **Service Location**: `src/app/features/company/human-resources/services/company-type.service.ts`
- **Model Location**: `src/app/features/company/human-resources/models/company-type.model.ts`
- **Shared Components**: `src/app/shared/components/`
- **Syncfusion Module**: `src/app/shared/syncfusion/syncfusion.module.ts`
- **Translation Keys**: `src/app/core/constants/translation-keys.constant.ts`

---

**Last Updated**: 2025-01-08
**Status**: ✅ Complete Reference Implementation

## Recent Updates (2025-01-08)

### 1. Confirmation Dialog Service Integration
- ✅ เปลี่ยนจาก Syncfusion Dialog โดยตรงเป็น `ConfirmationDialogService`
- ✅ ใช้ `app-glass-button` ใน confirmation dialog แทน `ejs-button`
- ✅ ลบ dialog template จาก component (ใช้ global component แทน)

### 2. Skeleton Loader Enhancement
- ✅ เพิ่ม `type="datagrid"` สำหรับ skeleton loader
- ✅ รองรับ `showToolbar`, `showPagination`, `hasActions` properties
- ✅ Skeleton structure ตรงกับ Syncfusion DataGrid

### 3. Page Header Improvements
- ✅ ลด top spacing (`pt-2` แทน `pt-6`)
- ✅ เพิ่ม border-bottom (`border-b border-gray-200 dark:border-gray-700`)
- ✅ รองรับ search input ใน header actions

### 4. Glass Input Icon Fix
- ✅ แก้ไข icon search ไม่แสดง (เพิ่ม `z-10` และ `flex items-center justify-center`)
- ✅ Icon color ถูกส่งไปที่ `app-icon` component โดยตรง

