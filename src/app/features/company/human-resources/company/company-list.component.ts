import { Component, inject, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SyncfusionDataGridComponent, GridAction } from '@shared/components/syncfusion-data-grid/syncfusion-data-grid.component';
import { ColumnModel, PageSettingsModel } from '@syncfusion/ej2-grids';

import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { CompanyService } from '../../services/company.service';
import { CompanyModel } from '../../models/company.model';
import { CompanyModelFormComponent } from './company-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { NotificationService, ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { filterSyncfusionFields } from '@core/utils';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    SyncfusionModule,
    PageHeaderComponent,
    SyncfusionDataGridComponent,
    GlassCardComponent,
    GlassInputComponent,
    CompanyModelFormComponent,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent
  ],
  templateUrl: './company-list.component.html',
  styles: [`:host { display: flex; flex-direction: column; height: 100%; gap: 1.5rem; }`]
})
export class CompanyModelListComponent implements OnInit {
  public service = inject(CompanyService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;

  data = signal<any[]>([]);
  showModal = false;
  selectedItem: CompanyModel | null = null;
  searchControl = new FormControl('');

  headerActions: any[] = [];
  columns: ColumnModel[] = [];
  gridActions: GridAction[] = [];

  pageSettings: PageSettingsModel = {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    pageCount: 5,
    currentPage: 1
  };

  /** ส่ง sort เป็นชื่อฟิลด์:ทิศทาง เดียว (เช่น codeId:desc) */
  sort = 'codeId:desc';

  ngOnInit() {
    this.updateTranslations();
    this.translate.onLangChange.subscribe(() => this.updateTranslations());

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.grid?.search(value || '');
    });

    this.loadData();
  }

  loadData() {
    const params: { sort?: string } = {};
    if (this.sort) params.sort = this.sort;
    this.service.getAll(params).subscribe({
      next: (res) => {
        this.data.set(Array.isArray(res) ? res : []);
      },
      error: (err) => {
        console.error('[CompanyModelList] Error loading data:', err);
        this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.LOAD));
      }
    });
  }

  /** เมื่อผู้ใช้เรียงจาก grid ให้ส่ง sort=ชื่อฟิลด์:ทิศทาง แล้วโหลดใหม่ */
  onActionBegin(event: any) {
    if (event.requestType === 'sorting') {
      event.cancel = true;
      const column = event.column as { field?: string } | undefined;
      const field = event.columnName ?? column?.field ?? (event as any).sortColumnName;
      const dir = event.direction === 'Descending' ? 'desc' : 'asc';
      if (field) {
        this.sort = `${field}:${dir}`;
        this.loadData();
      }
    }
  }

  private updateTranslations() {
    const prefix = 'company.company.column.';
    this.headerActions = [
      {
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.ADD),
        variant: 'primary',
        icon: 'add',
        class: 'h-11 min-h-[44px]',
        onClick: () => this.onCreate()
      },
      {
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.MANUAL),
        variant: 'info',
        icon: 'article',
        class: 'h-11 min-h-[44px]',
        onClick: () => this.onManual()
      }
    ];

    this.columns = [
      { field: 'branchId', headerText: this.translate.instant(prefix + 'branchId'), width: '120px', isPrimaryKey: true },
      { field: 'tdesc', headerText: this.translate.instant(prefix + 'tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant(prefix + 'edesc'), width: '200px' },
      { field: 'companyId', headerText: this.translate.instant(prefix + 'companyId'), width: '100px' },
      { field: 'comType', headerText: this.translate.instant(prefix + 'comType'), width: '100px' },
      { field: 'tel', headerText: this.translate.instant(prefix + 'tel'), width: '120px' },
      { field: 'fax', headerText: this.translate.instant(prefix + 'fax'), width: '120px' },
      { field: 'editDate', headerText: this.translate.instant(prefix + 'editDate'), type: 'date' as const, width: '120px', format: 'dd/MM/yyyy' }
    ];

    this.gridActions = [
      {
        id: 'edit',
        title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.EDIT),
        icon: 'ti ti-edit',
        class: 'text-primary',
        onClick: (data) => this.onEdit(data)
      },
      {
        id: 'delete',
        title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE),
        icon: 'ti ti-trash',
        class: 'text-danger',
        onClick: (data) => this.onDelete(data)
      }
    ];
  }

  onCreate() {
    this.selectedItem = null;
    this.showModal = true;
  }

  onEdit(row: any) {
    if (!row) return;
    this.selectedItem = row;
    this.showModal = true;
  }

  onDelete(row: any) {
    if (!row) {
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }
    if (!row.branchId) {
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    const modelFields: (keyof CompanyModel)[] = [
      'branchId', 'companyId', 'tdesc', 'edesc', 'comType', 'tel', 'fax', 'editBy', 'editDate', 'editTime', 'verified'
    ];
    const cleanRow = filterSyncfusionFields<CompanyModel>(row, modelFields);

    this.confirmationDialogService.confirmDelete().pipe(first()).subscribe({
      next: async (result: ConfirmationDialogResult) => {
        if (result.confirmed) {
          await this.confirmationDialogService.waitForClose();
          this.service.delete(cleanRow).subscribe({
            next: () => {
              setTimeout(() => {
                const successMessage = this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE);
                this.confirmationDialogService.showSuccess(successMessage).pipe(first()).subscribe({
                  next: () => this.loadData()
                });
              }, 100);
            },
            error: (err) => {
              setTimeout(() => {
                const errorMessage = err?.error?.message || err?.message || this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE);
                this.confirmationDialogService.showError(errorMessage).pipe(first()).subscribe();
              }, 100);
            }
          });
        }
      }
    });
  }

  onRowDeleted(_row: any): void {}

  onSaveSuccess() {
    this.loadData();
    this.showModal = false;
  }

  onExport() {
    this.grid?.exportToExcel();
  }

  onManual() {
    console.log('Manual clicked');
  }
}
