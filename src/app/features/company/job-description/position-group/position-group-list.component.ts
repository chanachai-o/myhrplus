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
import { PositionGroupService } from '../../services/position-group.service';
import { PositionGroupModel } from '../../models/position-group.model';
import { PositionGroupFormComponent } from './position-group-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { NotificationService, ConfirmationDialogService, ConfirmationDialogResult } from '@core/services';
import { filterSyncfusionFields } from '@core/utils';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';

@Component({
  selector: 'app-position-group-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, TranslateModule, SharedModule, SyncfusionModule,
    PageHeaderComponent, SyncfusionDataGridComponent, GlassCardComponent, GlassInputComponent,
    PositionGroupFormComponent, FormsModule, ReactiveFormsModule, EmptyStateComponent
  ],
  templateUrl: './position-group-list.component.html',
  styles: [`:host { display: flex; flex-direction: column; height: 100%; gap: 1.5rem; }`]
})
export class PositionGroupListComponent implements OnInit {
  public service = inject(PositionGroupService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);
  private confirmationDialogService = inject(ConfirmationDialogService);
  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;

  data = signal<any[]>([]);
  showModal = false;
  selectedItem: PositionGroupModel | null = null;
  searchControl = new FormControl('');
  headerActions: any[] = [];
  columns: ColumnModel[] = [];
  gridActions: GridAction[] = [];
  pageSettings: PageSettingsModel = { pageSize: 10, pageSizes: [10, 20, 50, 100], pageCount: 5, currentPage: 1 };

  ngOnInit() {
    this.updateTranslations();
    this.translate.onLangChange.subscribe(() => this.updateTranslations());
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => { this.grid?.search(value || ''); });
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe({
      next: (res) => { this.data.set(Array.isArray(res) ? res : []); },
      error: (err) => {
        console.error('[PositionGroupModelList]', err);
        this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.LOAD));
      }
    });
  }

  private updateTranslations() {
    const p = 'company.positionGroup.column.';
    this.headerActions = [
      { label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.ADD), variant: 'primary', icon: 'add', class: 'h-11 min-h-[44px]', onClick: () => this.onCreate() },
      { label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.MANUAL), variant: 'info', icon: 'article', class: 'h-11 min-h-[44px]', onClick: () => this.onManual() }
    ];
    this.columns = [
      { field: 'positionGroupId', headerText: this.translate.instant(p + 'id'), width: '140px', isPrimaryKey: true },
      { field: 'tdesc', headerText: this.translate.instant(p + 'tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant(p + 'edesc'), width: '200px' },
      { field: 'companyId', headerText: this.translate.instant(p + 'companyId'), width: '100px' },
      { field: 'editDate', headerText: this.translate.instant(p + 'editDate'), type: 'date' as const, width: '120px', format: 'dd/MM/yyyy' }
    ];
    this.gridActions = [
      { id: 'edit', title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.EDIT), icon: 'ti ti-edit', class: 'text-primary', onClick: (d) => this.onEdit(d) },
      { id: 'delete', title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE), icon: 'ti ti-trash', class: 'text-danger', onClick: (d) => this.onDelete(d) }
    ];
  }

  onCreate() { this.selectedItem = null; this.showModal = true; }
  onEdit(row: any) { if (!row) return; this.selectedItem = row; this.showModal = true; }

  onDelete(row: any) {
    if (!row?.positionGroupId) { this.notificationService.showError(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE)); return; }
    const modelFields: (keyof PositionGroupModel)[] = ['positionGroupId', 'companyId', 'tdesc', 'edesc', 'editBy', 'editDate', 'editTime', 'verified'];
    const cleanRow = filterSyncfusionFields<PositionGroupModel>(row, modelFields);
    this.confirmationDialogService.confirmDelete().pipe(first()).subscribe({
      next: async (result: ConfirmationDialogResult) => {
        if (result.confirmed) {
          await this.confirmationDialogService.waitForClose();
          this.service.delete(cleanRow).subscribe({
            next: () => { setTimeout(() => { this.confirmationDialogService.showSuccess(this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.SUCCESS.DELETE)).pipe(first()).subscribe({ next: () => this.loadData() }); }, 100); },
            error: (err) => { setTimeout(() => { this.confirmationDialogService.showError(err?.error?.message || err?.message || this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.ERROR.DELETE)).pipe(first()).subscribe(); }, 100); }
          });
        }
      }
    });
  }

  onRowDeleted(_: any) {}
  onSaveSuccess() { this.loadData(); this.showModal = false; }
  onExport() { this.grid?.exportToExcel(); }
  onManual() { console.log('Manual'); }
}
