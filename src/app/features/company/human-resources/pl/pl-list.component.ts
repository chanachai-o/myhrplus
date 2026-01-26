import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { PLService } from '../../services/pl.service';
import { PL } from '../../models/pl.model';
import { PLFormComponent } from './pl-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-pl-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    PLFormComponent
  ],
  templateUrl: './pl-list.component.html'
})
export class PLListComponent implements OnInit {
  public service = inject(PLService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: PL | null = null;

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
      { field: 'plid', headerText: this.translate.instant('company.pl.column.plId'), width: '120px' },
      { field: 'tdesc', headerText: this.translate.instant('company.pl.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.pl.column.edesc'), width: '200px' },
      { field: 'companyid', headerText: this.translate.instant('company.pl.column.companyId'), width: '100px' },
      { field: 'jobgradeid', headerText: this.translate.instant('company.pl.column.jobGradeId'), width: '120px' },
      { field: 'band', headerText: this.translate.instant('company.pl.column.band'), width: '100px' },
      { field: 'order_no', headerText: this.translate.instant('company.pl.column.orderNo'), width: '100px' },
      { field: 'edit_date', headerText: this.translate.instant('company.pl.column.editDate'), type: 'date' as const, width: '120px' }
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

