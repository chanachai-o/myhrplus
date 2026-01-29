import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { BranchSocialSecurity } from '../../models/branch-social-security.model';
import { BranchSocialSecurityService } from '../../services/branch-social-security.service';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-branch-social-security-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalComponent,
    GlassInputComponent
  ],
  templateUrl: './branch-social-security-form.component.html'
})
export class BranchSocialSecurityFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: BranchSocialSecurity | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(BranchSocialSecurityService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;

  constructor() {
    this.form = this.fb.group({
      branch_no: ['', [Validators.required, Validators.maxLength(10)]],
      companyid: ['', Validators.required],
      tdesc: ['', [Validators.required, Validators.maxLength(100)]],
      edesc: ['', [Validators.required, Validators.maxLength(100)]],
      // Thai Address
      tvillage: ['', Validators.maxLength(50)],
      troom_no: ['', Validators.maxLength(20)],
      tfloor: ['', Validators.maxLength(10)],
      taddr: ['', Validators.maxLength(20)],
      tsoi: ['', Validators.maxLength(50)],
      tmoo: ['', Validators.maxLength(10)],
      troad: ['', Validators.maxLength(50)],
      tsubdistrict: ['', Validators.maxLength(50)],
      // English Address
      evillage: ['', Validators.maxLength(50)],
      eroom_no: ['', Validators.maxLength(20)],
      efloor: ['', Validators.maxLength(10)],
      eaddr: ['', Validators.maxLength(20)],
      esoi: ['', Validators.maxLength(50)],
      emoo: ['', Validators.maxLength(10)],
      eroad: ['', Validators.maxLength(50)],
      esubdistrict: ['', Validators.maxLength(50)],
      // Location
      zipcode: ['', Validators.maxLength(5)],
      districtid: ['', Validators.maxLength(10)],
      // Contact
      tel: ['', [Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      fax: ['', [Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      // Social Security
      social_code: ['', [Validators.maxLength(13), Validators.pattern(/^[0-9]*$/)]],
      social_sub_code: ['', [Validators.maxLength(6), Validators.pattern(/^[0-9]*$/)]],
      soc_sign_name: ['', Validators.maxLength(100)],
      soc_sign_pos: ['', Validators.maxLength(50)]
    });
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        this.form.patchValue(this.data);
        this.form.get('branch_no')?.disable(); // PK cannot be changed
        this.form.get('companyid')?.disable(); // Company ID is readonly
      } else {
        this.form.reset();
        this.form.get('branch_no')?.enable();
        // TODO: Set companyid from current user context
        this.form.get('companyid')?.setValue('001'); // Default or from service
        this.form.get('social_sub_code')?.setValue('000000'); // Default value
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
      ? this.service.update(formData.branch_no, formData)
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


