import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { T4 } from '../../models/t4.model';
import { T4Service } from '../../services/t4.service';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-t4-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalComponent,
    GlassInputComponent
  ],
  templateUrl: './t4-form.component.html'
})
export class T4FormComponent implements OnChanges {
  // Expose TRANSLATION_KEYS to template

  readonly TRANSLATION_KEYS = TRANSLATION_KEYS;

  @Input() isOpen = false;
  @Input() data: T4 | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(T4Service);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;

  get activeOptions() {
    return [
      { value: '1', label: this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.ACTIVE) },
      { value: '0', label: this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.INACTIVE) }
    ];
  }

  constructor() {
    this.form = this.fb.group({
      bu7id: ['', [Validators.required, Validators.maxLength(10)]],
      companyid: ['', Validators.required],
      parent: ['', [Validators.required, Validators.maxLength(10)]],
      tdesc: ['', [Validators.required, Validators.maxLength(200)]],
      edesc: ['', [Validators.required, Validators.maxLength(200)]],
      tshort_name: ['', Validators.maxLength(10)],
      eshort_name: ['', Validators.maxLength(10)],
      short_name: ['', Validators.maxLength(10)],
      active: ['1', Validators.required],
      build_date: [''],
      expire_date: [''],
      objective: ['', Validators.maxLength(4000)],
      remark: ['', Validators.maxLength(4000)],
      extention: ['', [Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]],
      consolidate: ['', Validators.maxLength(10)],
      analcode: ['', Validators.maxLength(15)],
      sort_number: [0],
      bu7sup: ['', Validators.maxLength(10)],
      website: ['', Validators.maxLength(100)],
      email: ['', [Validators.maxLength(30), Validators.email]]
    });
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        const formData = {
          ...this.data,
          active: this.data.active || '1'
        };
        this.form.patchValue(formData);
        this.form.get('bu7id')?.disable();
        this.form.get('companyid')?.disable();
      } else {
        this.form.reset({
          active: '1',
          sort_number: 0,
          expire_date: '31-12-2100'
        });
        this.form.get('bu7id')?.enable();
        this.form.get('companyid')?.setValue('001');
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
      ? this.service.update(formData.bu7id, formData)
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

