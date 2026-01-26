import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { WorkareaLocationService } from '../../services/workarea-location.service';
import { WorkareaLocation } from '../../models/workarea-location.model';
import { WorkareaLocationFormComponent } from './workarea-location-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-workarea-location-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    WorkareaLocationFormComponent
  ],
  templateUrl: './workarea-location-list.component.html'
})
export class WorkareaLocationListComponent implements OnInit {
  public service = inject(WorkareaLocationService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: WorkareaLocation | null = null;

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
      { field: 'workareaid', headerText: this.translate.instant('company.workareaLocation.column.workAreaId'), width: '120px' },
      { field: 'line_no', headerText: this.translate.instant('company.workareaLocation.column.lineNo'), width: '80px' },
      { field: 'tdesc', headerText: this.translate.instant('company.workareaLocation.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.workareaLocation.column.edesc'), width: '200px' },
      { field: 'latitude', headerText: this.translate.instant('company.workareaLocation.column.latitude'), width: '120px' },
      { field: 'longitude', headerText: this.translate.instant('company.workareaLocation.column.longitude'), width: '120px' },
      { field: 'radius', headerText: this.translate.instant('company.workareaLocation.column.radius'), width: '100px' },
      { field: 'companyid', headerText: this.translate.instant('company.workareaLocation.column.companyId'), width: '100px' },
      { field: 'edit_date', headerText: this.translate.instant('company.workareaLocation.column.editDate'), type: 'date' as const, width: '120px' }
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

