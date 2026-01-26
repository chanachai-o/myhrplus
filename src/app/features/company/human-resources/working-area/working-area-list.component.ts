import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { WorkingAreaService } from '../../services/working-area.service';
import { WorkingArea } from '../../models/working-area.model';
import { WorkingAreaFormComponent } from './working-area-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-working-area-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    WorkingAreaFormComponent
  ],
  templateUrl: './working-area-list.component.html'
})
export class WorkingAreaListComponent implements OnInit {
  public service = inject(WorkingAreaService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: WorkingArea | null = null;

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
      { field: 'workareaid', headerText: this.translate.instant('company.workingArea.column.workAreaId'), width: '120px' },
      { field: 'tdesc', headerText: this.translate.instant('company.workingArea.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.workingArea.column.edesc'), width: '200px' },
      { field: 'companyid', headerText: this.translate.instant('company.workingArea.column.companyId'), width: '100px' },
      { field: 'DATEST', headerText: this.translate.instant('company.workingArea.column.dateStart'), type: 'date' as const, width: '120px' },
      { field: 'DATEEN', headerText: this.translate.instant('company.workingArea.column.dateEnd'), type: 'date' as const, width: '120px' },
      { field: 'BRAND_SUPPORT', headerText: this.translate.instant('company.workingArea.column.brandSupport'), width: '120px' },
      { field: 'edit_date', headerText: this.translate.instant('company.workingArea.column.editDate'), type: 'date' as const, width: '120px' }
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

