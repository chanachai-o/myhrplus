import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogService } from '@core/services/confirmation-dialog.service';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SyncfusionModule,
    GlassButtonComponent
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  dialogService = inject(ConfirmationDialogService);

  // Expose TRANSLATION_KEYS to template
  readonly TRANSLATION_KEYS = TRANSLATION_KEYS;

  // Expose service signals and computed values as computed signals
  visible = computed(() => this.dialogService.visible());
  title = computed(() => this.dialogService.title());
  message = computed(() => this.dialogService.message());
  confirmText = computed(() => this.dialogService.confirmText());
  cancelText = computed(() => this.dialogService.cancelText());
  confirmButtonClass = computed(() => this.dialogService.confirmButtonClass());
  cancelButtonClass = computed(() => this.dialogService.cancelButtonClass());
  confirmVariant = computed(() => this.dialogService.confirmVariant());
  cancelVariant = computed(() => this.dialogService.cancelVariant());
  width = computed(() => this.dialogService.width());
  showCloseIcon = computed(() => this.dialogService.showCloseIcon());
  closeOnEscape = computed(() => this.dialogService.closeOnEscape());

  // Getter for two-way binding (Syncfusion Dialog requires property, not function call)
  get visibleValue(): boolean {
    return this.visible();
  }

  // Setter for two-way binding
  set visibleValue(value: boolean) {
    if (!value) {
      this.dialogService.close();
    }
  }

  onConfirm(): void {
    this.dialogService.onConfirm();
  }

  onCancel(): void {
    this.dialogService.onCancel();
  }

  onClose(): void {
    this.dialogService.onCancel();
  }
}

