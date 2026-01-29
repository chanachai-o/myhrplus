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
import { BankCompanyService } from '../../services/bank-company.service';
import { BankCompanyModel } from '../../models/bank-company.model';
import { BankCompanyFormComponent } from './bank-company-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { NotificationService, ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { filterSyncfusionFields } from '@core/utils';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';

@Component({
  selector: 'app-bank-company-list',
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
    BankCompanyFormComponent,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent
  ],
  templateUrl: './bank-company-list.component.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1.5rem;
    }
  `]
})
export class BankCompanyListComponent implements OnInit {
  public service = inject(BankCompanyService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;

  // Use signal for data to avoid AsyncPipe deadlock with loading state
  // Changed type to any to support { result: any[], count: number } for server-side pagination
  data = signal<any>({ result: [], count: 0 });
  showModal = false;
  selectedItem: BankCompanyModel | null = null;
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
        console.log('[BankCompanyList] Data loaded:', response);

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
        console.error('[BankCompanyList] Error loading data:', err);
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
    // Handle pagination
    if (event.requestType === 'paging') {
      const newPage = (event.currentPage as number) - 1; // Convert from 1-based to 0-based
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
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.ADD),
        variant: 'primary',
        icon: 'add',
        onClick: () => this.onCreate()
      },
      {
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.MANUAL),
        variant: 'info',
        icon: 'article',
        class: '',
        onClick: () => this.onManual()
      }
    ];

    this.columns = [
      { field: 'lineNo', headerText: 'Line No.', width: 100, isPrimaryKey: true, visible: false },
      { field: 'bankId', headerText: 'company.bankCompany.column.bankId', width: 120 },
      { field: 'bankClientThname', headerText: 'company.bankCompany.column.bankClientThName', width: 250, minWidth: 200 },
      { field: 'account', headerText: 'company.bankCompany.column.account', width: 150 },
      { field: 'isdefault', headerText: 'company.bankCompany.column.isDefault', width: 100 }
    ];
    console.log('[BankCompanyList] Columns configured:', this.columns);

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
      console.error('[BankCompanyList] Edit: Row data is undefined');
      return;
    }

    console.log('[BankCompanyList] Edit action clicked for row:', row);
    this.selectedItem = row;
    this.showModal = true;
  }

  onDelete(row: any) {
    // Validate row data
    if (!row) {
      console.error('[BankCompanyList] Delete: Row data is undefined');
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    if (!row.lineNo) {
      console.error('[BankCompanyList] Delete: Row lineNo is missing', row);
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    console.log('[BankCompanyList] Delete action clicked for row:', row);

    // Filter out Syncfusion Grid internal fields (e.g., 'column', 'index')
    // Only include fields that are part of BankCompany model
    const modelFields: (keyof BankCompanyModel)[] = [
      'companyId', 'bankId', 'branch', 'bankBranch', 'lineNo',
      'account', 'bankClient', 'bankClientThname', 'bankClientEngname',
      'contactPerson', 'tel',
      'transAts', 'transMedia', 'transOther', 'transOtherDesc',
      'dayDisk', 'dayCheque', 'isdefault'
    ];

    const cleanRow = filterSyncfusionFields<BankCompanyModel>(row, modelFields);

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
              console.log('[BankCompanyList] Delete successful');
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
              console.error('[BankCompanyList] Delete error:', err);
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
    console.log('[BankCompanyList] Row deleted event received:', row);
    // This event is emitted when delete action is clicked
    // The actual deletion is handled in onDelete method
    // This can be used for additional logging, analytics, or other side effects
  }

  onSaveSuccess() {
    // No toast here, handled in form
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


