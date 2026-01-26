import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { CostCenterService } from '../../services/cost-center.service';
import { CostCenter } from '../../models/cost-center.model';
import { CostCenterFormComponent } from './cost-center-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-cost-center-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    CostCenterFormComponent
  ],
  templateUrl: './cost-center-list.component.html'
})
export class CostCenterListComponent implements OnInit {
  public service = inject(CostCenterService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: CostCenter | null = null;

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
      { field: 'costcenterid', headerText: this.translate.instant('company.costCenter.column.costCenterId'), width: '150px' },
      { field: 'tdesc', headerText: this.translate.instant('company.costCenter.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.costCenter.column.edesc'), width: '200px' },
      { field: 'companyid', headerText: this.translate.instant('company.costCenter.column.companyId'), width: '100px' },
      { field: 'edit_date', headerText: this.translate.instant('company.costCenter.column.editDate'), type: 'date' as const, width: '120px' }
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

