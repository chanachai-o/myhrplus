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
import { CompanyGroupService } from '../../services/company-group.service';
import { CompanyGroup } from '../../models/company-group.model';
import { CompanyGroupFormComponent } from './company-group-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService, ConfirmationDialogService } from '@core/services';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';

@Component({
  selector: 'app-company-group-list',
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
    CompanyGroupFormComponent,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent
  ],
  templateUrl: './company-group-list.component.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1.5rem;
    }
  `]
})
export class CompanyGroupListComponent implements OnInit {
  public service = inject(CompanyGroupService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;

  // Use signal for data to avoid AsyncPipe deadlock with loading state
  data = signal<CompanyGroup[]>([]);
  showModal = false;
  selectedItem: CompanyGroup | null = null;
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
        console.log('[CompanyGroupList] Data loaded:', res);
        this.data.set(res);
      },
      error: (err) => {
        console.error('[CompanyGroupList] Error loading data:', err);
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
      { field: 'codeid', headerText: 'company.companyGroup.column.codeId', width: 150, isPrimaryKey: true },
      { field: 'tdesc', headerText: 'company.companyGroup.column.tdesc', width: 300, minWidth: 200 },
      { field: 'edesc', headerText: 'company.companyGroup.column.edesc', width: 300, minWidth: 200 },
      { field: 'edit_date', headerText: 'company.companyGroup.column.editDate', type: 'date', width: 180, format: 'dd/MM/yyyy' }
    ];
    console.log('[CompanyGroupList] Columns configured:', this.columns);

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
      console.error('[CompanyGroupList] Edit: Row data is undefined');
      return;
    }

    console.log('[CompanyGroupList] Edit action clicked for row:', row);
    this.selectedItem = row;
    this.showModal = true;
  }

  onDelete(row: any) {
    // Validate row data
    if (!row) {
      console.error('[CompanyGroupList] Delete: Row data is undefined');
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    if (!row.codeid) {
      console.error('[CompanyGroupList] Delete: Row codeid is missing', row);
      this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
      return;
    }

    console.log('[CompanyGroupList] Delete action clicked for row:', row);

    // Show confirmation dialog using service
    this.confirmationDialogService.confirmDelete().subscribe({
      next: (result) => {
        if (result.confirmed) {
          this.service.delete(row.codeid).subscribe({
            next: () => {
              console.log('[CompanyGroupList] Delete successful');
              this.notificationService.showSuccess(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE));
              this.loadData();
            },
            error: (err) => {
              console.error('[CompanyGroupList] Delete error:', err);
              this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE));
            }
          });
        }
      }
    });
  }

  onRowDeleted(row: any): void {
    console.log('[CompanyGroupList] Row deleted event received:', row);
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


