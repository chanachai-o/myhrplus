import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { PaperService } from '../../services/paper.service';
import { Paper } from '../../models/paper.model';
import { PaperFormComponent } from './paper-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-paper-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    PaperFormComponent
  ],
  templateUrl: './paper-list.component.html'
})
export class PaperListComponent implements OnInit {
  public service = inject(PaperService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: Paper | null = null;

  headerActions: any[] = [];
  columns: any[] = [];

  ngOnInit() {
    // Wait for translations to load, then initialize
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
      { field: 'paperid', headerText: this.translate.instant('company.companyPaper.column.paperId'), width: '150px' },
      { field: 'tdesc', headerText: this.translate.instant('company.companyPaper.column.tdesc'), width: '250px' },
      { field: 'edesc', headerText: this.translate.instant('company.companyPaper.column.edesc'), width: '250px' },
      {
        field: 'jb_active',
        headerText: this.translate.instant('company.companyPaper.column.jbActive'),
        width: '150px',
        type: 'boolean' as const,
        formatter: (value: string) => {
          return value === '1'
            ? this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.ACTIVE)
            : this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.INACTIVE);
        }
      },
      {
        field: 'attachfile_active',
        headerText: this.translate.instant('company.companyPaper.column.attachfileActive'),
        width: '150px',
        type: 'boolean' as const,
        formatter: (value: string) => {
          return value === '1'
            ? this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.ACTIVE)
            : this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.INACTIVE);
        }
      },
      { field: 'edit_date', headerText: this.translate.instant('company.companyPaper.column.editDate'), type: 'date' as const, width: '120px' }
    ];
  }

  onCreate() {
    this.selectedItem = null;
    this.showModal = true;
  }

  onEdit(item: Paper) {
    this.selectedItem = item;
    this.showModal = true;
  }

  onSaveSuccess() {
    this.data$ = this.service.getAll(); // Refresh data
  }
}


