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
import { CompanyTypeService } from '../../services/company-type.service';
import { CompanyType } from '../../models/company-type.model';
import { CompanyTypeFormComponent } from './company-type-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from '@core/services/notification.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-type-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
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

  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;

  // Use signal for data to avoid AsyncPipe deadlock with loading state
  data = signal<CompanyType[]>([]);
  showModal = false;
  selectedItem: CompanyType | null = null;
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
        console.log('[CompanyTypeList] Data loaded:', res);
        this.data.set(res);
      },
      error: (err) => {
        console.error('[CompanyTypeList] Error loading data:', err);
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
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.EXPORT),
        variant: 'success',
        icon: 'download',
        class: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700',
        onClick: () => this.onExport()
      },
      {
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.MANUAL),
        variant: 'info',
        icon: 'article',
        class: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700',
        onClick: () => this.onManual()
      }
    ];

    this.columns = [
      { field: 'codeid', headerText: 'company.companyType.column.codeId', width: 150, isPrimaryKey: true },
      { field: 'tdesc', headerText: 'company.companyType.column.tdesc', width: 300, minWidth: 200 },
      { field: 'edesc', headerText: 'company.companyType.column.edesc', width: 300, minWidth: 200 },
      { field: 'edit_date', headerText: 'company.companyType.column.editDate', type: 'date', width: 180, format: 'dd/MM/yyyy' }
    ];
    console.log('[CompanyTypeList] Columns configured:', this.columns);

    this.gridActions = [
      {
        title: this.translate.instant('Edit'),
        icon: 'ti ti-edit',
        class: 'text-primary',
        onClick: (data) => this.onEdit(data)
      },
      {
        title: this.translate.instant('Delete'),
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
    this.selectedItem = row;
    this.showModal = true;
  }

  onDelete(row: any) {
    Swal.fire({
      title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE),
      text: this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.CONFIRM.DELETE),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE),
      cancelButtonText: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL)
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(row.codeid).subscribe({
          next: () => {
            this.notificationService.showSuccess(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE));
            this.loadData();
          },
          error: (err) => {
            console.error(err);
            this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
          }
        });
      }
    });
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
