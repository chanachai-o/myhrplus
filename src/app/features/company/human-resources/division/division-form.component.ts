import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { DivisionModel } from '../../models/division.model';
import { DivisionService } from '../../services/division.service';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-division-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalComponent,
    GlassInputComponent
  ],
  templateUrl: './division-form.component.html'
})
export class DivisionModelFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: DivisionModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(DivisionService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;

  // Options for Active radio
  get activeOptions() {
    return [
      { value: '1', label: this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.ACTIVE) },
      { value: '0', label: this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.INACTIVE) }
    ];
  }

  constructor() {
    this.form = this.fb.group({
      bu1Id: ['', [Validators.required, Validators.maxLength(10)]],
      companyId: ['', Validators.required],
      branchId: ['', Validators.maxLength(5)],
      tdesc: ['', [Validators.required, Validators.maxLength(200)]],
      edesc: ['', [Validators.required, Validators.maxLength(200)]],
      tshortName: ['', Validators.maxLength(10)],
      eshortName: ['', Validators.maxLength(10)],
      shortName: ['', Validators.maxLength(10)],
      active: ['1', Validators.required],
      buildDate: [''],
      expireDate: [''],
      objective: ['', Validators.maxLength(4000)],
      remark: ['', Validators.maxLength(4000)],
      extention: ['', [Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      consolidate: ['', Validators.maxLength(10)],
      analcode: ['', Validators.maxLength(15)],
      sortNumber: [0],
      bu1Sup: ['', Validators.maxLength(10)],
      website: ['', Validators.maxLength(100)],
      email: ['', [Validators.maxLength(30), Validators.email]]
    });
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        // Convert active to string if needed
        const formData = {
          ...this.data,
          active: this.data.active || '1'
        };
        this.form.patchValue(formData);
        this.form.get('bu1id')?.disable(); // PK cannot be changed
        this.form.get('companyid')?.disable(); // Company ID is readonly
      } else {
        this.form.reset({
          active: '1',
          sort_number: 0,
          expire_date: '31-12-2100' // Default value
        });
        this.form.get('bu1id')?.enable();
        // TODO: Set companyid from current user context
        this.form.get('companyid')?.setValue('001'); // Default or from service
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

    this.confirmationDialogService.confirmSave(this.isEditMode).pipe(first()).subscribe({
      next: async (result: ConfirmationDialogResult) => {
        if (result.confirmed) {
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
      ? this.service.update(formData.bu1Id, formData)
      : this.service.create(formData);

    request$.subscribe({
      next: () => {
        this.service.loading.set(false);
        setTimeout(() => {
          const successMessage = this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.SAVE);
          this.confirmationDialogService.showSuccess(successMessage).pipe(first()).subscribe({
            next: () => {
              this.save.emit();
              this.onClose();
            }
          });
        }, 100);
      },
      error: (err: unknown) => {
        this.service.loading.set(false);
        setTimeout(() => {
          const errorMessage = (err as any)?.error?.message ||
                             (err as any)?.message ||
                             this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.SAVE);
          this.confirmationDialogService.showError(errorMessage).pipe(first()).subscribe();
        }, 100);
      }
    });
  }
}


