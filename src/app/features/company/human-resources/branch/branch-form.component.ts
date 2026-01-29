import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { BranchModel } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalComponent,
    GlassInputComponent
  ],
  templateUrl: './branch-form.component.html'
})
export class BranchModelFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: BranchModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(BranchService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;

  constructor() {
    this.form = this.fb.group({
      branchId: ['', [Validators.required, Validators.maxLength(10)]],
      companyId: ['', [Validators.required, Validators.maxLength(5)]],
      headCompany: ['', [Validators.required, Validators.maxLength(10)]], // Required for branch
      tdesc: ['', [Validators.required, Validators.maxLength(200)]],
      edesc: ['', [Validators.required, Validators.maxLength(200)]],
      comType: ['', Validators.maxLength(3)],
      branchNo: ['', Validators.maxLength(10)],
      socBranchId: ['', Validators.maxLength(10)],
      taxBranchId: ['', Validators.maxLength(10)],
      taxId: ['', Validators.maxLength(13)],
      taxId2: ['', Validators.maxLength(13)],
      // Address Thai
      taddr: ['', Validators.maxLength(20)],
      tvillage: ['', Validators.maxLength(50)],
      troomNo: ['', Validators.maxLength(20)],
      tfloor: ['', Validators.maxLength(10)],
      tsoi: ['', Validators.maxLength(50)],
      tmoo: ['', Validators.maxLength(10)],
      troad: ['', Validators.maxLength(50)],
      tsubdistrict: ['', Validators.maxLength(50)],
      // Address English
      eaddr: ['', Validators.maxLength(20)],
      evillage: ['', Validators.maxLength(50)],
      eroomNo: ['', Validators.maxLength(20)],
      efloor: ['', Validators.maxLength(10)],
      esoi: ['', Validators.maxLength(50)],
      emoo: ['', Validators.maxLength(10)],
      eroad: ['', Validators.maxLength(50)],
      esubdistrict: ['', Validators.maxLength(50)],
      // Location
      zipcode: ['', Validators.maxLength(5)],
      districtId: ['', Validators.maxLength(10)],
      // Contact
      tel: ['', Validators.maxLength(30)],
      fax: ['', Validators.maxLength(30)],
      website: ['', Validators.maxLength(100)],
      // Social Security
      socialCode: ['', Validators.maxLength(20)],
      socSignName: ['', Validators.maxLength(100)],
      socSignPos: ['', Validators.maxLength(50)],
      // Tax
      taxSignName: ['', Validators.maxLength(100)],
      taxSignPos: ['', Validators.maxLength(50)],
      // Other
      brandTdesc: ['', Validators.maxLength(200)],
      brandEdesc: ['', Validators.maxLength(200)],
      consolidate: ['', Validators.maxLength(10)],
      branchTax: ['', Validators.maxLength(10)],
      // Required fields
      isCompany: [''], // Empty for branch
      isBranch: ['1', Validators.required] // '1' for branch
    });
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        const formData = {
          ...this.data,
          isCompany: this.data.isCompany || '',
          isBranch: this.data.isBranch || '1'
        };
        this.form.patchValue(formData);
        this.form.get('branchId')?.disable(); // PK cannot be changed
        this.form.get('companyId')?.disable(); // Company ID is readonly
      } else {
        this.form.reset({
          isCompany: '',
          isBranch: '1'
        });
        this.form.get('branchId')?.enable();
        // TODO: Set companyId from current user context
        this.form.get('companyId')?.setValue('001'); // Default or from service
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
      ? this.service.update(formData.branchId, formData)
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

