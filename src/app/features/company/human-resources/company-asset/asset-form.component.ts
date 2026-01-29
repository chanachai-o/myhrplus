import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { AssetModel } from '../../models/asset.model';
import { AssetService } from '../../services/asset.service';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalComponent,
    GlassInputComponent
  ],
  templateUrl: './asset-form.component.html'
})
export class AssetFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: AssetModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(AssetService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;

  constructor() {
    this.form = this.fb.group({
      companyid: ['C001', Validators.required], // TODO: Get actual company
      assetid: ['', Validators.required],
      tdesc: ['', Validators.required],
      edesc: [''],
      astype: ['', Validators.required],
      fine: ['0.00'],
      owner: [''],
      status: ['1'],
      remarks: [''],
      reservation: [false]
    });
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        const patchData = {
            ...this.data,
            reservation: this.data.reservation === '1'
        };
        this.form.patchValue(patchData);
        this.form.get('assetid')?.disable();
      } else {
        this.form.reset({
            companyid: 'C001',
            status: '1',
            fine: '0.00',
            reservation: false
        });
        this.form.get('assetid')?.enable();
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
    const rawData = this.form.getRawValue();
    const formData = {
      ...rawData,
      reservation: rawData.reservation ? '1' : '0'
    };

    this.service.loading.set(true);

    const request$ = this.isEditMode
      ? this.service.update(formData.assetid, formData)
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


