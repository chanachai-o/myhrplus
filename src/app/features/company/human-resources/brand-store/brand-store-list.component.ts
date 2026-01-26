import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { BrandStoreService } from '../../services/brand-store.service';
import { BrandStore } from '../../models/brand-store.model';
import { BrandStoreFormComponent } from './brand-store-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-brand-store-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    BrandStoreFormComponent
  ],
  templateUrl: './brand-store-list.component.html'
})
export class BrandStoreListComponent implements OnInit {
  public service = inject(BrandStoreService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: BrandStore | null = null;

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
      { field: 'brandstoreid', headerText: this.translate.instant('company.brandStore.column.brandStoreId'), width: '150px' },
      { field: 'tdesc', headerText: this.translate.instant('company.brandStore.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.brandStore.column.edesc'), width: '200px' },
      { field: 'companyid', headerText: this.translate.instant('company.brandStore.column.companyId'), width: '100px' },
      { field: 'edit_date', headerText: this.translate.instant('company.brandStore.column.editDate'), type: 'date' as const, width: '120px' }
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

