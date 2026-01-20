import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { FormValidationMessagesComponent } from '@shared/components/form-validation-messages/form-validation-messages.component';
import { CompanyType } from '../../models/company-type.model';
import { CompanyTypeService } from '../../services/company-type.service';
import { NotificationService, ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-company-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalComponent,
    GlassInputComponent,
    FormValidationMessagesComponent
  ],
  templateUrl: './company-type-form.component.html'
})
export class CompanyTypeFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: CompanyType | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(CompanyTypeService);
  private notificationService = inject(NotificationService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;

  // Expose TRANSLATION_KEYS to template
  readonly TRANSLATION_KEYS = TRANSLATION_KEYS;

  constructor() {
    this.form = this.fb.group({
      codeId: ['', [Validators.required, Validators.maxLength(3)]],
      tdesc: ['', Validators.required],
      edesc: ['']
    });
  }

  // Detect input changes to patch form
  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        this.form.patchValue(this.data);
        this.form.get('codeId')?.disable(); // PK cannot be changed
      } else {
        this.form.reset();
        this.form.get('codeId')?.enable();
      }
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Show confirmation dialog before saving using service
    this.confirmationDialogService.confirmSave(this.isEditMode).pipe(
      first() // Only take first emission to prevent duplicate subscriptions
    ).subscribe({
      next: async (result: ConfirmationDialogResult) => {
        if (result.confirmed) {
          // Wait for confirmation dialog to fully close before proceeding
          await this.confirmationDialogService.waitForClose();
          this.saveData();
        }
      }
    });
  }

  private saveData() {
    const formData = this.form.getRawValue();
    this.service.loading.set(true);

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
            first() // Only take first emission
          ).subscribe({
            next: () => {
              this.save.emit(); // Notify parent to refresh list
              this.onClose();
            }
          });
        }, 100);
      },
      error: (err: unknown) => {
        console.error(err);
        this.service.loading.set(false);
        // Wait a bit to ensure confirmation dialog is fully closed
        setTimeout(() => {
          // Get error message from error object
          const errorMessage = (err as any)?.error?.message ||
                             (err as any)?.message ||
                             this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.SAVE);
          // Show error dialog
          this.confirmationDialogService.showError(errorMessage).pipe(
            first() // Only take first emission
          ).subscribe();
        }, 100);
      }
    });
  }
}
