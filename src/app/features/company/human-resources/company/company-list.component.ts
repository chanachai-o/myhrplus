import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { CompanyFormComponent } from './company-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    CompanyFormComponent
  ],
  templateUrl: './company-list.component.html'
})
export class CompanyListComponent implements OnInit {
  public service = inject(CompanyService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: Company | null = null;

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
      { field: 'branchid', headerText: this.translate.instant('company.company.column.branchId'), width: '120px' },
      { field: 'tdesc', headerText: this.translate.instant('company.company.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.company.column.edesc'), width: '200px' },
      { field: 'companyid', headerText: this.translate.instant('company.company.column.companyId'), width: '100px' },
      { field: 'com_type', headerText: this.translate.instant('company.company.column.comType'), width: '100px' },
      { field: 'tel', headerText: this.translate.instant('company.company.column.tel'), width: '120px' },
      { field: 'fax', headerText: this.translate.instant('company.company.column.fax'), width: '120px' },
      { field: 'edit_date', headerText: this.translate.instant('company.company.column.editDate'), type: 'date' as const, width: '120px' }
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

