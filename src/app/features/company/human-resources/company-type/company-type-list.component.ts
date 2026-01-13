import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { CompanyTypeService } from '../../services/company-type.service';
import { CompanyType } from '../../models/company-type.model';
import { CompanyTypeFormComponent } from './company-type-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-company-type-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    GlassCardComponent,
    CompanyTypeFormComponent
  ],
  templateUrl: './company-type-list.component.html'
})
export class CompanyTypeListComponent implements OnInit {
  public service = inject(CompanyTypeService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: CompanyType | null = null;

  headerActions: any[] = [];
  columns: any[] = [];

  ngOnInit() {
    this.updateTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslations();
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
      { field: 'codeid', headerText: this.translate.instant('company.companyType.column.codeId'), width: '100px' },
      { field: 'tdesc', headerText: this.translate.instant('company.companyType.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.companyType.column.edesc'), width: '200px' },
      { field: 'edit_date', headerText: this.translate.instant('company.companyType.column.editDate'), type: 'date' as const, width: '120px' }
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
    // Refresh data
    this.data$ = this.service.getAll();
    this.showModal = false;
  }

  onExport() {
    // TODO: Implement export functionality
    console.log('Export clicked');
  }

  onManual() {
    // TODO: Implement manual/guide functionality
    console.log('Manual clicked');
  }
}


