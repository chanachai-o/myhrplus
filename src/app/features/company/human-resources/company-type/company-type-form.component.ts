import { Component, EventEmitter, Input, Output, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { FormValidationMessagesComponent } from '@shared/components/form-validation-messages/form-validation-messages.component';
import { CompanyType } from '../../models/company-type.model';
import { CompanyTypeService } from '../../services/company-type.service';
import { NotificationService } from '@core/services/notification.service';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';

@Component({
  selector: 'app-company-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SyncfusionModule,
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

  @ViewChild('confirmDialog') confirmDialog!: DialogComponent;

  private fb = inject(FormBuilder);
  private service = inject(CompanyTypeService);
  private notificationService = inject(NotificationService);
  private translate = inject(TranslateService);

  form: FormGroup;
  isEditMode = false;

  // Confirmation dialog properties
  confirmDialogVisible = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';

  // Expose TRANSLATION_KEYS to template
  readonly TRANSLATION_KEYS = TRANSLATION_KEYS;

  constructor() {
    this.form = this.fb.group({
      codeid: ['', [Validators.required, Validators.maxLength(3)]],
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
        this.form.get('codeid')?.disable(); // PK cannot be changed
      } else {
        this.form.reset();
        this.form.get('codeid')?.enable();
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

    // Show confirmation dialog before saving
    this.confirmDialogTitle = this.isEditMode
      ? this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.EDIT)
      : this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE);

    // Use appropriate confirmation message
    this.confirmDialogMessage = this.isEditMode
      ? 'คุณต้องการบันทึกการแก้ไขข้อมูลหรือไม่?'
      : 'คุณต้องการบันทึกข้อมูลหรือไม่?';

    this.confirmDialogVisible = true;
  }

  onConfirmSave(): void {
    this.confirmDialogVisible = false;
    this.saveData();
  }

  onCancelSave(): void {
    this.confirmDialogVisible = false;
  }

  private saveData() {
    const formData = this.form.getRawValue();
    this.service.loading.set(true);

    const request$ = this.isEditMode
      ? this.service.update(formData.codeid, formData)
      : this.service.create(formData);

    request$.subscribe({
      next: () => {
        this.service.loading.set(false);
        this.save.emit(); // Notify parent to refresh list
        this.onClose();
      },
      error: (err: unknown) => {
        console.error(err);
        this.service.loading.set(false);
        this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.SAVE));
      }
    });
  }
}


