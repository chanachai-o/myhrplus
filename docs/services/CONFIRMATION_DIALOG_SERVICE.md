# Confirmation Dialog Service

## ภาพรวม

`ConfirmationDialogService` เป็น service กลางสำหรับจัดการ confirmation dialogs ในแอปพลิเคชัน โดยใช้ Syncfusion Dialog component และ Angular signals สำหรับ reactive state management

**Location**: `src/app/core/services/confirmation-dialog.service.ts`

## Features

- ✅ Centralized dialog management
- ✅ Reactive state ด้วย Angular signals
- ✅ Observable-based API สำหรับ async handling
- ✅ Pre-configured methods สำหรับ common use cases (delete, save, cancel)
- ✅ Customizable configuration
- ✅ Translation support
- ✅ Global component (`app-confirmation-dialog`) ใน `app.component.html`

## การใช้งาน

### 1. Import Service

```typescript
import { ConfirmationDialogService } from '@core/services';
// หรือ
import { ConfirmationDialogService } from '@core/services/confirmation-dialog.service';
```

### 2. Inject Service

```typescript
export class MyComponent {
  private confirmationDialogService = inject(ConfirmationDialogService);
  
  // หรือใช้ constructor injection
  constructor(private confirmationDialogService: ConfirmationDialogService) {}
}
```

### 3. ใช้ Pre-configured Methods

#### Delete Confirmation

```typescript
onDelete(item: any): void {
  this.confirmationDialogService.confirmDelete().subscribe({
    next: (result) => {
      if (result.confirmed) {
        // Perform delete action
        this.service.delete(item.id).subscribe({
          next: () => {
            this.notificationService.showSuccess('ลบข้อมูลสำเร็จ');
            this.loadData();
          },
          error: (err) => {
            this.notificationService.showError('ลบข้อมูลไม่สำเร็จ');
          }
        });
      }
    }
  });
}
```

#### Save Confirmation

```typescript
onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const isEditMode = !!this.data;
  this.confirmationDialogService.confirmSave(isEditMode).subscribe({
    next: (result) => {
      if (result.confirmed) {
        this.saveData();
      }
    }
  });
}
```

#### Cancel Confirmation

```typescript
onCancel(): void {
  this.confirmationDialogService.confirmCancel().subscribe({
    next: (result) => {
      if (result.confirmed) {
        // Perform cancel action
        this.close();
      }
    }
  });
}
```

### 4. Custom Configuration

```typescript
this.confirmationDialogService.confirm({
  title: 'ยืนยันการดำเนินการ',
  message: 'คุณต้องการดำเนินการต่อหรือไม่?',
  confirmText: 'ดำเนินการ',
  cancelText: 'ยกเลิก',
  confirmButtonClass: 'e-primary',
  cancelButtonClass: 'e-outline',
  width: '500px',
  showCloseIcon: true,
  closeOnEscape: true
}).subscribe({
  next: (result) => {
    if (result.confirmed) {
      // Handle confirmed
    } else if (result.cancelled) {
      // Handle cancelled
    }
  }
});
```

## API Reference

### Methods

#### `confirm(config: ConfirmationDialogConfig): Observable<ConfirmationDialogResult>`

แสดง confirmation dialog ด้วย custom configuration

**Parameters:**
- `config`: `ConfirmationDialogConfig` - Dialog configuration

**Returns:**
- `Observable<ConfirmationDialogResult>` - Observable ที่ emit เมื่อ user confirm หรือ cancel

#### `confirmDelete(message?: string): Observable<ConfirmationDialogResult>`

แสดง delete confirmation dialog

**Parameters:**
- `message` (optional): Custom message

**Returns:**
- `Observable<ConfirmationDialogResult>` - Observable ที่ emit เมื่อ user confirm หรือ cancel

#### `confirmSave(isEditMode?: boolean, message?: string): Observable<ConfirmationDialogResult>`

แสดง save confirmation dialog

**Parameters:**
- `isEditMode` (optional): Whether this is an edit operation (default: `false`)
- `message` (optional): Custom message

**Returns:**
- `Observable<ConfirmationDialogResult>` - Observable ที่ emit เมื่อ user confirm หรือ cancel

#### `confirmCancel(message?: string): Observable<ConfirmationDialogResult>`

แสดง cancel confirmation dialog

**Parameters:**
- `message` (optional): Custom message

**Returns:**
- `Observable<ConfirmationDialogResult>` - Observable ที่ emit เมื่อ user confirm หรือ cancel

### Interfaces

#### `ConfirmationDialogConfig`

```typescript
interface ConfirmationDialogConfig {
  title?: string;                    // Dialog title
  message: string;                    // Dialog message (required)
  confirmText?: string;               // Confirm button text
  cancelText?: string;                // Cancel button text
  confirmButtonClass?: string;        // Confirm button CSS class
  cancelButtonClass?: string;         // Cancel button CSS class
  width?: string;                     // Dialog width (default: '400px')
  showCloseIcon?: boolean;            // Show close icon (default: true)
  closeOnEscape?: boolean;            // Close on Escape key (default: true)
}
```

#### `ConfirmationDialogResult`

```typescript
interface ConfirmationDialogResult {
  confirmed: boolean;   // true if user clicked confirm
  cancelled: boolean;  // true if user clicked cancel or closed dialog
}
```

### Signals (Read-only)

Service มี signals สำหรับ reactive state:

- `visible()`: `ReadonlySignal<boolean>` - Dialog visibility state
- `title()`: `ReadonlySignal<string>` - Dialog title
- `message()`: `ReadonlySignal<string>` - Dialog message
- `confirmText()`: `ReadonlySignal<string>` - Confirm button text
- `cancelText()`: `ReadonlySignal<string>` - Cancel button text
- `confirmButtonClass()`: `ReadonlySignal<string>` - Confirm button CSS class
- `cancelButtonClass()`: `ReadonlySignal<string>` - Cancel button CSS class
- `width()`: `ReadonlySignal<string>` - Dialog width
- `showCloseIcon()`: `ReadonlySignal<boolean>` - Show close icon
- `closeOnEscape()`: `ReadonlySignal<boolean>` - Close on Escape

## Global Component

`ConfirmationDialogComponent` ถูกเพิ่มใน `app.component.html` เป็น global component:

```html
<!-- Global Confirmation Dialog -->
<app-confirmation-dialog></app-confirmation-dialog>
```

Component นี้จะ:
- รับ state จาก `ConfirmationDialogService` ผ่าน signals
- แสดง Syncfusion Dialog เมื่อ `visible()` เป็น `true`
- จัดการ user interactions (confirm, cancel, close)

## Migration Example

### Before (Manual Dialog Management)

```typescript
export class CompanyTypeListComponent {
  confirmDialogVisible = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  rowToDelete: CompanyType | null = null;

  onDelete(row: any): void {
    this.rowToDelete = row;
    this.confirmDialogTitle = 'ลบ';
    this.confirmDialogMessage = 'คุณต้องการลบข้อมูลหรือไม่?';
    this.confirmDialogVisible = true;
  }

  onConfirmDelete(): void {
    if (this.rowToDelete) {
      this.service.delete(this.rowToDelete.codeid).subscribe({
        next: () => {
          this.confirmDialogVisible = false;
          this.rowToDelete = null;
          this.loadData();
        }
      });
    }
  }

  onCancelDelete(): void {
    this.confirmDialogVisible = false;
    this.rowToDelete = null;
  }
}
```

```html
<ejs-dialog
  [(visible)]="confirmDialogVisible"
  [header]="confirmDialogTitle"
  [width]="'400px'"
  [isModal]="true">
  <!-- Content and Footer templates -->
</ejs-dialog>
```

### After (Using Service)

```typescript
export class CompanyTypeListComponent {
  private confirmationDialogService = inject(ConfirmationDialogService);

  onDelete(row: any): void {
    this.confirmationDialogService.confirmDelete().subscribe({
      next: (result) => {
        if (result.confirmed) {
          this.service.delete(row.codeid).subscribe({
            next: () => {
              this.loadData();
            }
          });
        }
      }
    });
  }
}
```

```html
<!-- No dialog template needed - handled by global component -->
```

## Best Practices

1. **ใช้ Pre-configured Methods**: ใช้ `confirmDelete()`, `confirmSave()`, `confirmCancel()` แทน `confirm()` เมื่อเป็นไปได้
2. **Handle Observable**: ใช้ `subscribe()` เพื่อรับผลลัพธ์จาก dialog
3. **Check Result**: ตรวจสอบ `result.confirmed` ก่อนดำเนินการ
4. **Error Handling**: จัดการ errors ใน subscribe callback
5. **Cleanup**: Service จะจัดการ cleanup อัตโนมัติ ไม่ต้องจัดการ state manually

## Examples

### Complete Delete Example

```typescript
onDelete(row: any): void {
  // Validate
  if (!row || !row.id) {
    this.notificationService.showError('ไม่สามารถลบข้อมูลได้');
    return;
  }

  // Show confirmation
  this.confirmationDialogService.confirmDelete().subscribe({
    next: (result) => {
      if (result.confirmed) {
        this.service.delete(row.id).subscribe({
          next: () => {
            this.notificationService.showSuccess('ลบข้อมูลสำเร็จ');
            this.loadData();
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.notificationService.showError('ลบข้อมูลไม่สำเร็จ');
          }
        });
      }
    }
  });
}
```

### Complete Save Example

```typescript
onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const isEditMode = !!this.data;
  this.confirmationDialogService.confirmSave(isEditMode).subscribe({
    next: (result) => {
      if (result.confirmed) {
        const formData = this.form.getRawValue();
        const request$ = isEditMode
          ? this.service.update(formData.id, formData)
          : this.service.create(formData);

        request$.subscribe({
          next: () => {
            this.notificationService.showSuccess('บันทึกข้อมูลสำเร็จ');
            this.save.emit();
            this.onClose();
          },
          error: (err) => {
            console.error('Save error:', err);
            this.notificationService.showError('บันทึกข้อมูลไม่สำเร็จ');
          }
        });
      }
    }
  });
}
```

## Benefits

1. **ลด Code Duplication**: ไม่ต้องสร้าง dialog template ในทุก component
2. **Centralized Management**: จัดการ dialog state ที่เดียว
3. **Consistent UI**: ใช้ dialog style เดียวกันทั้งแอป
4. **Reactive**: ใช้ Angular signals สำหรับ reactive updates
5. **Type Safe**: TypeScript interfaces สำหรับ type safety
6. **Easy to Use**: Simple API สำหรับ common use cases

## Migration Checklist

เมื่อ migrate component ให้ใช้ `ConfirmationDialogService`:

- [ ] Import `ConfirmationDialogService` จาก `@core/services`
- [ ] Inject service ใน component
- [ ] แทนที่ manual dialog state ด้วย service methods
- [ ] ลบ dialog template จาก component HTML
- [ ] ลบ dialog-related properties (`confirmDialogVisible`, `confirmDialogTitle`, etc.)
- [ ] ลบ `@ViewChild` สำหรับ dialog (ถ้ามี)
- [ ] ลบ `SyncfusionModule` import (ถ้าใช้แค่ dialog)
- [ ] ทดสอบ confirmation flow

---

**Last Updated**: 2025-01-07
**Status**: ✅ Complete

