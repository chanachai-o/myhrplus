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
import { DepartmentService } from '../../services/department.service';
import { DepartmentModel } from '../../models/department.model';
import { DepartmentModelFormComponent } from './department-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { NotificationService, ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { filterSyncfusionFields } from '@core/utils';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';

@Component({
  selector: 'app-department-list',
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
    DepartmentModelFormComponent,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent
  ],
  templateUrl: './department-list.component.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1.5rem;
    }
  `]
})
export class DepartmentModelListComponent implements OnInit {
  public service = inject(DepartmentService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;

  data = signal<any[]>([]);
  showModal = false;
  selectedItem: DepartmentModel | null = null;
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
    this.service.getAll().subscribe({
      next: (res) => {
        this.data.set(Array.isArray(res) ? res : []);
      },
      error: (err: unknown) => {
        console.error('[DepartmentModelList] Error loading data:', err);
        this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.LOAD));
      }
    });
  }

  private updateTranslations() {
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
      { field: 'bu2Id', headerText: this.translate.instant('features.company.entities.department.column.bu2Id'), width: '120px', isPrimaryKey: true },
      { field: 'parent', headerText: this.translate.instant('features.company.entities.department.column.parent'), width: '120px' },
      { field: 'tdesc', headerText: this.translate.instant('features.company.entities.department.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('features.company.entities.department.column.edesc'), width: '200px' },
      { field: 'shortName', headerText: this.translate.instant('features.company.entities.department.column.shortName'), width: '100px' },
      { field: 'active', headerText: this.translate.instant('features.company.entities.department.column.active'), width: '100px' },
      { field: 'buildDate', headerText: this.translate.instant('features.company.entities.department.column.buildDate'), type: 'date' as const, width: '120px', format: 'dd/MM/yyyy' },
      { field: 'expireDate', headerText: this.translate.instant('features.company.entities.department.column.expireDate'), type: 'date' as const, width: '120px', format: 'dd/MM/yyyy' },
      { field: 'editDate', headerText: this.translate.instant('features.company.entities.department.column.editDate'), type: 'date' as const, width: '120px', format: 'dd/MM/yyyy' }
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
    if (!row.bu2Id) {
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    const modelFields: (keyof DepartmentModel)[] = [
      'bu2Id', 'companyId', 'parent', 'tdesc', 'edesc', 'shortName', 'active', 'buildDate', 'expireDate',
      'editBy', 'editDate', 'editTime', 'verified'
    ];
    const cleanRow = filterSyncfusionFields<DepartmentModel>(row, modelFields);

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
            error: (err: unknown) => {
              setTimeout(() => {
                const errObj = err as { error?: { message?: string }; message?: string };
                const errorMessage = errObj?.error?.message || errObj?.message || this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE);
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
