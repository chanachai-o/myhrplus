import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { WorkareaStoreService } from '../../services/workarea-store.service';
import { WorkareaStore } from '../../models/workarea-store.model';
import { WorkareaStoreFormComponent } from './workarea-store-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-workarea-store-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    WorkareaStoreFormComponent
  ],
  templateUrl: './workarea-store-list.component.html'
})
export class WorkareaStoreListComponent implements OnInit {
  public service = inject(WorkareaStoreService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: WorkareaStore | null = null;

  headerActions: any[] = [];
  columns: any[] = [];

  ngOnInit() {
    this.translate.get(TRANSLATION_KEYS.COMMON.ACTIONS.ADD).subscribe(() => {
      this.initializeTranslations();
    });
  }

  private initializeTranslations() {
    this.headerActions = [
      {
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.ADD),
        variant: 'primary' as const,
        onClick: () => this.onCreate()
      }
    ];

    this.columns = [
      { field: 'workareaid', headerText: this.translate.instant('company.workareaStore.column.workareaId'), width: '150px' },
      { field: 'tdesc', headerText: this.translate.instant('company.workareaStore.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.workareaStore.column.edesc'), width: '200px' },
      { field: 'groupid', headerText: this.translate.instant('company.workareaStore.column.groupId'), width: '120px' },
      { field: 'zonetypeid', headerText: this.translate.instant('company.workareaStore.column.zoneTypeId'), width: '120px' },
      { field: 'work_status', headerText: this.translate.instant('company.workareaStore.column.workStatus'), width: '100px' },
      { field: 'companyid', headerText: this.translate.instant('company.workareaStore.column.companyId'), width: '100px' },
      { field: 'edit_date', headerText: this.translate.instant('company.workareaStore.column.editDate'), type: 'date' as const, width: '120px' }
    ];
  }

  onCreate() {
    this.selectedItem = null;
    this.showModal = true;
  }

  onEdit(args: any) {
    const row = args.data || args;
    this.selectedItem = row;
    this.showModal = true;
  }

  onSaveSuccess() {
    this.data$ = this.service.getAll();
    this.showModal = false;
  }
}

