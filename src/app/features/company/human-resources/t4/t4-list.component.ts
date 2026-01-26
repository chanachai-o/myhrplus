import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { T4Service } from '../../services/t4.service';
import { T4 } from '../../models/t4.model';
import { T4FormComponent } from './t4-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-t4-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    T4FormComponent
  ],
  templateUrl: './t4-list.component.html'
})
export class T4ListComponent implements OnInit {
  public service = inject(T4Service);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: T4 | null = null;

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
      { field: 'bu7id', headerText: this.translate.instant('company.t4.column.bu7Id'), width: '120px' },
      { field: 'parent', headerText: this.translate.instant('company.t4.column.parent'), width: '120px' },
      { field: 'tdesc', headerText: this.translate.instant('company.t4.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.t4.column.edesc'), width: '200px' },
      { field: 'short_name', headerText: this.translate.instant('company.t4.column.shortName'), width: '100px' },
      {
        field: 'active',
        headerText: this.translate.instant('company.t4.column.active'),
        width: '100px',
        type: 'boolean' as const,
        formatter: (value: string) => {
          return value === '1'
            ? this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.ACTIVE)
            : this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.INACTIVE);
        }
      },
      { field: 'build_date', headerText: this.translate.instant('company.t4.column.buildDate'), type: 'date' as const, width: '120px' },
      { field: 'expire_date', headerText: this.translate.instant('company.t4.column.expireDate'), type: 'date' as const, width: '120px' },
      { field: 'edit_date', headerText: this.translate.instant('company.t4.column.editDate'), type: 'date' as const, width: '120px' }
    ];
  }

  onCreate() {
    this.selectedItem = null;
    this.showModal = true;
  }

  onEdit(item: T4) {
    this.selectedItem = item;
    this.showModal = true;
  }

  onSaveSuccess() {
    this.data$ = this.service.getAll();
  }
}

