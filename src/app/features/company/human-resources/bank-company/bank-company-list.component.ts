import { Component, inject, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SyncfusionDataGridComponent, GridAction } from '@shared/components/syncfusion-data-grid/syncfusion-data-grid.component';
import { ColumnModel } from '@syncfusion/ej2-grids';

import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { BankCompanyService } from '../../services/bank-company.service';
import { BankCompany } from '../../models/bank-company.model';
import { BankCompanyFormComponent } from './bank-company-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService, ConfirmationDialogService } from '@core/services';
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
  data = signal<BankCompany[]>([]);
  showModal = false;
  selectedItem: BankCompany | null = null;
  searchControl = new FormControl('');

  headerActions: any[] = [];
  columns: ColumnModel[] = [];
  gridActions: GridAction[] = [];

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

  loadData() {
    this.service.getAll().subscribe({
      next: (res) => {
        console.log('[BankCompanyList] Data loaded:', res);
        this.data.set(res);
      },
      error: (err) => {
        console.error('[BankCompanyList] Error loading data:', err);
        this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.LOAD));
      }
    });
  }

  private updateTranslations() {
    this.headerActions = [
      {
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.ADD_NEW),
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
      { field: 'line_no', headerText: 'Line No.', width: 100, isPrimaryKey: true, visible: false },
      { field: 'bankid', headerText: 'company.bankCompany.column.bankId', width: 120 },
      { field: 'bank_client_thname', headerText: 'company.bankCompany.column.bankClientThName', width: 250, minWidth: 200 },
      { field: 'account', headerText: 'company.bankCompany.column.account', width: 150 },
      { field: 'isdefault', headerText: 'company.bankCompany.column.isDefault', width: 100, type: 'boolean', displayAsCheckBox: true }
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

    if (!row.line_no) {
      console.error('[BankCompanyList] Delete: Row line_no is missing', row);
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    console.log('[BankCompanyList] Delete action clicked for row:', row);

    // Show confirmation dialog using service
    this.confirmationDialogService.confirmDelete().subscribe({
      next: (result) => {
        if (result.confirmed) {
          this.service.delete(row.line_no).subscribe({
            next: () => {
              console.log('[BankCompanyList] Delete successful');
              this.notificationService.showSuccess(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE));
              this.loadData();
            },
            error: (err) => {
              console.error('[BankCompanyList] Delete error:', err);
              this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
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


