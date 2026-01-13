import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { CodeViewerComponent } from '@features/demo/shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '@features/demo/shared/props-table/props-table.component';
import { ConfirmationDialogService } from '@core/services/confirmation-dialog.service';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-confirm-dialog-demo',
  standalone: true,
  imports: [CommonModule, GlassCardComponent, GlassButtonComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './confirm-dialog-demo.component.html',
  styleUrls: ['./confirm-dialog-demo.component.scss']
})
export class ConfirmDialogDemoComponent {
  private confirmationDialogService = inject(ConfirmationDialogService);

  props: PropDefinition[] = [
    {
      name: 'confirmDelete(message?)',
      type: 'Observable<ConfirmationDialogResult>',
      default: '-',
      description: 'Show delete confirmation dialog',
      required: false
    },
    {
      name: 'confirmSave(isEditMode?, message?)',
      type: 'Observable<ConfirmationDialogResult>',
      default: '-',
      description: 'Show save confirmation dialog',
      required: false
    },
    {
      name: 'confirmCancel(message?)',
      type: 'Observable<ConfirmationDialogResult>',
      default: '-',
      description: 'Show cancel confirmation dialog',
      required: false
    },
    {
      name: 'confirm(config)',
      type: 'Observable<ConfirmationDialogResult>',
      default: '-',
      description: 'Show custom confirmation dialog',
      required: false
    }
  ];

  outputs: PropDefinition[] = [
    {
      name: 'result',
      type: 'ConfirmationDialogResult',
      default: '-',
      description: 'Dialog result with confirmed and cancelled properties',
      required: false
    }
  ];

  basicExample = `// Delete Confirmation
this.confirmationDialogService.confirmDelete().subscribe({
  next: (result) => {
    if (result.confirmed) {
      // Perform delete action
    }
  }
});

// Save Confirmation
this.confirmationDialogService.confirmSave(isEditMode).subscribe({
  next: (result) => {
    if (result.confirmed) {
      // Perform save action
    }
  }
});`;

  usageExample = `// In component.ts
import { ConfirmationDialogService } from '@core/services';

export class MyComponent {
  private confirmationDialogService = inject(ConfirmationDialogService);

  onDelete(item: any): void {
    this.confirmationDialogService.confirmDelete().subscribe({
      next: (result) => {
        if (result.confirmed) {
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
}`;

  openDeleteDialog(): void {
    this.confirmationDialogService.confirmDelete().subscribe({
      next: (result) => {
        if (result.confirmed) {
          alert('Delete confirmed!');
        } else {
          alert('Delete cancelled!');
        }
      }
    });
  }

  openSaveDialog(): void {
    this.confirmationDialogService.confirmSave(false).subscribe({
      next: (result) => {
        if (result.confirmed) {
          alert('Save confirmed!');
        } else {
          alert('Save cancelled!');
        }
      }
    });
  }

  openCustomDialog(): void {
    this.confirmationDialogService.confirm({
      title: 'ยืนยันการดำเนินการ',
      message: 'คุณต้องการดำเนินการต่อหรือไม่?',
      confirmText: 'ดำเนินการ',
      cancelText: 'ยกเลิก',
      width: '500px'
    }).subscribe({
      next: (result) => {
        if (result.confirmed) {
          alert('Custom action confirmed!');
        } else {
          alert('Custom action cancelled!');
        }
      }
    });
  }
}
