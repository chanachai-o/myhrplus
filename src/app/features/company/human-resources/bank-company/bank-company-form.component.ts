import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { FormValidationMessagesComponent } from '@shared/components/form-validation-messages/form-validation-messages.component';
import { BankCompany } from '../../models/bank-company.model';
import { BankCompanyService } from '../../services/bank-company.service';
import { NotificationService, ConfirmationDialogService } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-bank-company-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalComponent,
    GlassInputComponent,
    FormValidationMessagesComponent
  ],
  templateUrl: './bank-company-form.component.html'
})
export class BankCompanyFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: BankCompany | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(BankCompanyService);
  private notificationService = inject(NotificationService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;

  // Expose TRANSLATION_KEYS to template
  readonly TRANSLATION_KEYS = TRANSLATION_KEYS;

  constructor() {
    this.form = this.fb.group({
      line_no: [''], // Hidden Key
      companyid: ['', Validators.required],
      bankid: ['', Validators.required],
      branch: [''],
      bank_branch: [''],
      account: ['', Validators.required],
      bank_client_thname: [''],
      bank_client_engname: [''],
      contact_person: [''],
      tel: [''],
      trans_ats: [false],
      isdefault: [false]
    });
  }

  // Detect input changes to patch form
  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        // Convert '1'/'0' string to boolean for checkboxes if needed
        // Handle both string ('1'/'0') and boolean types
        const transAtsValue = this.data.trans_ats;
        const isDefaultValue = this.data.isdefault;
        
        const patchData = {
          ...this.data,
          trans_ats: typeof transAtsValue === 'string' 
            ? transAtsValue === '1' 
            : Boolean(transAtsValue),
          isdefault: typeof isDefaultValue === 'string'
            ? isDefaultValue === '1'
            : Boolean(isDefaultValue)
        };
        this.form.patchValue(patchData);
        this.form.get('line_no')?.disable(); // PK cannot be changed
      } else {
        this.form.reset({
          companyid: 'C001', // TODO: Get current company ID
          isdefault: false,
          trans_ats: false
        });
        this.form.get('line_no')?.enable();
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
    this.confirmationDialogService.confirmSave(this.isEditMode).subscribe({
      next: (result) => {
        if (result.confirmed) {
          this.saveData();
        }
      }
    });
  }

  private saveData() {
    const rawData = this.form.getRawValue();
    // Convert boolean back to '1'/'0'
    const formData = {
      ...rawData,
      trans_ats: rawData.trans_ats ? '1' : '0',
      isdefault: rawData.isdefault ? '1' : '0'
    };

    this.service.loading.set(true);

    const request$ = this.isEditMode
      ? this.service.update(formData.line_no, formData) // Use line_no as key
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


