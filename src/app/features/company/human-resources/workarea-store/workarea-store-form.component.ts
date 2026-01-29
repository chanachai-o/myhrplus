import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { WorkareaStore } from '../../models/workarea-store.model';
import { WorkareaStoreService } from '../../services/workarea-store.service';
import { BrandStoreService } from '../../services/brand-store.service';
import { ZoneTypeService } from '../../services/zone-type.service';
import { WorkingAreaTypeService } from '../../services/working-area-type.service';
import { ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { Observable } from 'rxjs';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-workarea-store-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalComponent,
    GlassInputComponent
  ],
  templateUrl: './workarea-store-form.component.html'
})
export class WorkareaStoreFormComponent implements OnChanges {
  // Expose TRANSLATION_KEYS to template

  readonly TRANSLATION_KEYS = TRANSLATION_KEYS;

  @Input() isOpen = false;
  @Input() data: WorkareaStore | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(WorkareaStoreService);
  private brandStoreService = inject(BrandStoreService);
  private zoneTypeService = inject(ZoneTypeService);
  private workingAreaTypeService = inject(WorkingAreaTypeService);
  private translate = inject(TranslateService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  form: FormGroup;
  isEditMode = false;
  brandStores$: Observable<any[]> = this.brandStoreService.getAll();
  zoneTypes$: Observable<any[]> = this.zoneTypeService.getAll();
  workingAreaTypes$: Observable<any[]> = this.workingAreaTypeService.getAll();

  constructor() {
    this.form = this.fb.group({
      workareaid: ['', [Validators.required, Validators.maxLength(10)]],
      companyid: ['', [Validators.required, Validators.maxLength(5)]],
      tdesc: ['', [Validators.required, Validators.maxLength(100)]],
      edesc: ['', [Validators.maxLength(100)]],
      groupid: ['', [Validators.required, Validators.maxLength(10)]],
      address: ['', [Validators.maxLength(100)]],
      provinceid: ['', [Validators.maxLength(5)]],
      telphone: ['', [Validators.maxLength(20)]],
      resporsible1: ['', [Validators.maxLength(15)]],
      resporsible2: ['', [Validators.maxLength(15)]],
      resporsible3: ['', [Validators.maxLength(15)]],
      resporsible4: ['', [Validators.maxLength(15)]],
      simplified_branch: ['', [Validators.maxLength(100)]],
      brand_support: [''],
      zonetypeid: ['', [Validators.required, Validators.maxLength(10)]],
      work_email: ['', [Validators.maxLength(50), Validators.email]],
      work_status: ['Y', [Validators.maxLength(2)]],
      worktypeid: ['', [Validators.required, Validators.maxLength(10)]],
      work_parent: ['', [Validators.maxLength(10)]],
      store: ['', [Validators.maxLength(10)]],
      consolidate: ['', [Validators.maxLength(10)]],
      updatergm_status: ['0', [Validators.maxLength(2)]],
      updateboss_status: ['0', [Validators.maxLength(2)]],
      extention: ['', [Validators.maxLength(10)]],
      datest: ['', [Validators.required]],
      dateen: ['', []],
      remarks: ['', [Validators.maxLength(4000)]],
      objective: ['', [Validators.maxLength(4000)]]
    });
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.data;
      if (this.data) {
        this.form.patchValue(this.data);
        this.form.get('workareaid')?.disable(); // PK cannot be changed
        this.form.get('companyid')?.disable(); // Company ID is readonly
      } else {
        this.form.reset();
        this.form.get('workareaid')?.enable();
        // Set default values
        this.form.get('work_status')?.setValue('Y');
        this.form.get('updatergm_status')?.setValue('0');
        this.form.get('updateboss_status')?.setValue('0');
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
      ? this.service.update(formData.workareaid, formData)
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

