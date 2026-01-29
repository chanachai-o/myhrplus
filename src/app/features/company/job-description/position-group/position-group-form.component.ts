import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { FormValidationMessagesComponent } from '@shared/components/form-validation-messages/form-validation-messages.component';
import { PositionGroupModel } from '../../models/position-group.model';
import { PositionGroupService } from '../../services/position-group.service';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-position-group-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ModalComponent, GlassInputComponent, FormValidationMessagesComponent],
  templateUrl: './position-group-form.component.html'
})
export class PositionGroupFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: PositionGroupModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(PositionGroupService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;
  readonly TRANSLATION_KEYS = TRANSLATION_KEYS;

  constructor() {
    this.form = this.fb.group({
      positionGroupId: ['', [Validators.required, Validators.maxLength(20)]],
      tdesc: ['', Validators.required],
      edesc: ['']
    });
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        this.form.patchValue(this.data);
        this.form.get('positionGroupId')?.disable();
      } else {
        this.form.reset();
        this.form.get('positionGroupId')?.enable();
      }
    }
  }

  onClose() { this.close.emit(); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
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
    const req$ = this.isEditMode ? this.service.update(formData.positionGroupId, formData) : this.service.create(formData);
    req$.subscribe({
      next: () => {
        setTimeout(() => {
          this.confirmationDialogService.showSuccess(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.SAVE)).pipe(first()).subscribe({
            next: () => { this.save.emit(); this.onClose(); }
          });
        }, 100);
      },
      error: (err) => {
        setTimeout(() => {
          this.confirmationDialogService.showError(err?.error?.message || err?.message || this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.SAVE)).pipe(first()).subscribe();
        }, 100);
      }
    });
  }
}
