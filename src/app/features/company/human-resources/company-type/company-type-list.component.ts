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
import { CompanyType } from '../../models/company-type.model';
import { CompanyTypeFormComponent } from './company-type-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService, ConfirmationDialogService } from '@core/services';
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
  data = signal<CompanyType[]>([]);
  showModal = false;
  selectedItem: CompanyType | null = null;
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

  ngOnInit() {
    this.updateTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslations();
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.grid.search(value || '');
    });

    // Load data
    this.loadData();
  }

  loadData(page: number = this.currentPage, size: number = this.pageSize) {
    this.service.getAllWithPagination({ page, size }).subscribe({
      next: (response) => {
        console.log('[CompanyTypeList] Data loaded:', response);
        this.data.set(response.data);

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
      pageCount: this.totalPages || 5
    };
  }

  onActionBegin(event: any) {
    // Handle pagination
    if (event.requestType === 'paging') {
      const newPage = event.currentPage - 1; // Convert from 1-based to 0-based
      const newPageSize = event.pageSize || this.pageSize;

      if (newPage !== this.currentPage || newPageSize !== this.pageSize) {
        this.currentPage = newPage;
        this.pageSize = newPageSize;
        this.loadData(this.currentPage, this.pageSize);
      }
    }
  }

  private updateTranslations() {
    this.headerActions = [
      {
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.ADD_NEW),
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

    // Show confirmation dialog using service
    this.confirmationDialogService.confirmDelete().subscribe({
      next: (result) => {
        if (result.confirmed) {
          this.service.delete(row.codeId).subscribe({
            next: () => {
              console.log('[CompanyTypeList] Delete successful');
              this.notificationService.showSuccess(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE));
              this.loadData();
            },
            error: (err) => {
              console.error('[CompanyTypeList] Delete error:', err);
              this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
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
    this.notificationService.showSuccess(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.SAVE));
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
