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
import { CompanyTypeService } from '../../services/company-type.service';
import { CompanyTypeModel } from '../../models/company-type.model';
import { CompanyTypeFormComponent } from './company-type-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, first, skip } from 'rxjs/operators';
import { NotificationService, ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { filterSyncfusionFields } from '@core/utils';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';

@Component({
  selector: 'app-company-type-list',
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
    CompanyTypeFormComponent,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent
  ],
  templateUrl: './company-type-list.component.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1.5rem;
    }
  `]
})
export class CompanyTypeListComponent implements OnInit {
  public service = inject(CompanyTypeService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;

  // Use signal for data to avoid AsyncPipe deadlock with loading state
  // Changed type to any to support { result: any[], count: number } for server-side pagination
  data = signal<any>({ result: [], count: 0 });
  showModal = false;
  selectedItem: CompanyTypeModel | null = null;
  searchControl = new FormControl('');

  headerActions: any[] = [];
  columns: ColumnModel[] = [];
  gridActions: GridAction[] = [];

  // Pagination state
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  pageSettings: PageSettingsModel = {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    pageCount: 5,
    currentPage: 1
  };

  // Server-side search and sort state
  searchTerm = '';
  sortField: string | undefined;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.updateTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslations();
    });

    // Server-side search: call API on search change (reset to page 0); skip(1) avoids double load on init
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      skip(1)
    ).subscribe(value => {
      this.searchTerm = value ?? '';
      this.loadData(0, this.pageSize, this.searchTerm, this.sortField, this.sortDirection);
    });

    // Initial load
    this.loadData();
  }

  /**
   * Load data with server-side pagination, search and sort.
   * When params are omitted, uses current component state.
   */
  loadData(
    page: number = this.currentPage,
    size: number = this.pageSize,
    search: string = this.searchTerm,
    sort: string | undefined = this.sortField,
    direction: 'asc' | 'desc' = this.sortDirection
  ) {
    this.service.getAllWithPagination({ page, size, search: search || undefined, sort, direction }).subscribe({
      next: (response) => {
        console.log('[CompanyTypeList] Data loaded:', response);

        // Update data signal with { result, count } structure for server-side pagination
        this.data.set({
          result: response.data,
          count: response.totalElements
        });

        // Update pagination info from service response
        this.currentPage = response.currentPage;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.updatePageSettings();
      },
      error: (err) => {
        console.error('[CompanyTypeList] Error loading data:', err);
        this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.LOAD));
      }
    });
  }

  private updatePageSettings() {
    this.pageSettings = {
      ...this.pageSettings,
      pageSize: this.pageSize,
      currentPage: this.currentPage + 1, // Syncfusion uses 1-based page index
      pageCount: 5
    };
  }

  onActionBegin(event: any) {
    // Handle pagination: call API with current search/sort
    if (event.requestType === 'paging') {
      const newPage = (event.currentPage as number) - 1; // Convert from 1-based to 0-based
      const newPageSize = event.pageSize || this.pageSize;

      if (newPage !== this.currentPage || newPageSize !== this.pageSize) {
        this.currentPage = newPage;
        this.pageSize = newPageSize;
        this.loadData(this.currentPage, this.pageSize, this.searchTerm, this.sortField, this.sortDirection);
      }
    }

    // Handle sorting: cancel client-side sort, call API with sort params
    if (event.requestType === 'sorting') {
      event.cancel = true;
      const column = event.column as { field?: string } | undefined;
      const field = column?.field ?? event.sortColumnName;
      const dir = event.direction === 'Descending' ? 'desc' : 'asc';
      if (field) {
        this.sortField = field;
        this.sortDirection = dir;
        this.loadData(this.currentPage, this.pageSize, this.searchTerm, this.sortField, this.sortDirection);
      }
    }
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
      { field: 'codeId', headerText: 'company.companyType.column.codeId', width: 150, isPrimaryKey: true },
      { field: 'tdesc', headerText: 'company.companyType.column.tdesc', width: 300, minWidth: 200 },
      { field: 'edesc', headerText: 'company.companyType.column.edesc', width: 300, minWidth: 200 },
      { field: 'editDate', headerText: 'company.companyType.column.editDate', type: 'date', width: 180, format: 'dd/MM/yyyy' }
    ];
    console.log('[CompanyTypeList] Columns configured:', this.columns);

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
    // Validate row data
    if (!row) {
      console.error('[CompanyTypeList] Edit: Row data is undefined');
      return;
    }

    console.log('[CompanyTypeList] Edit action clicked for row:', row);
    this.selectedItem = row;
    this.showModal = true;
  }

  onDelete(row: any) {
    // Validate row data
    if (!row) {
      console.error('[CompanyTypeList] Delete: Row data is undefined');
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    if (!row.codeId) {
      console.error('[CompanyTypeList] Delete: Row codeId is missing', row);
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    console.log('[CompanyTypeList] Delete action clicked for row:', row);

    // Filter out Syncfusion Grid internal fields (e.g., 'column', 'index')
    // Only include fields that are part of CompanyType model
    const modelFields: (keyof CompanyTypeModel)[] = [
      'codeId', 'tdesc', 'edesc', 'editBy', 'editDate', 'editTime', 'verified', 'companyId'
    ];

    const cleanRow = filterSyncfusionFields<CompanyTypeModel>(row, modelFields);

    // Show confirmation dialog using service
    this.confirmationDialogService.confirmDelete().pipe(
      first() // Only take first emission to prevent duplicate subscriptions
    ).subscribe({
      next: async (result: ConfirmationDialogResult) => {
        if (result.confirmed) {
          // Wait for confirmation dialog to fully close before proceeding
          await this.confirmationDialogService.waitForClose();
          this.service.delete(cleanRow).subscribe({
            next: () => {
              console.log('[CompanyTypeList] Delete successful');
              // Wait a bit to ensure confirmation dialog is fully closed
              setTimeout(() => {
                const successMessage = this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE);
                this.confirmationDialogService.showSuccess(successMessage).pipe(
                  first() // Only take first emission
                ).subscribe({
                  next: () => {
                    this.loadData();
                  }
                });
              }, 100);
            },
            error: (err) => {
              console.error('[CompanyTypeList] Delete error:', err);
              // Wait a bit to ensure confirmation dialog is fully closed
              setTimeout(() => {
                // Get error message from error object
                const errorMessage = err?.error?.message ||
                                   err?.message ||
                                   this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE);
                // Show error dialog instead of toast
                this.confirmationDialogService.showError(errorMessage).pipe(
                  first() // Only take first emission
                ).subscribe();
              }, 100);
            }
          });
        }
      }
    });
  }

  onRowDeleted(row: any): void {
    console.log('[CompanyTypeList] Row deleted event received:', row);
    // This event is emitted when delete action is clicked
    // The actual deletion is handled in onDelete method
    // This can be used for additional logging, analytics, or other side effects
  }

  onSaveSuccess() {
    this.loadData();
    this.showModal = false;
  }

  onExport() {
    if (this.grid) {
      this.grid.exportToExcel();
    }
  }

  onManual() {
    // TODO: Implement manual/guide functionality
    console.log('Manual clicked');
  }
}
