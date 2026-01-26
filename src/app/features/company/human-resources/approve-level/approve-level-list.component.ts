import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ApproveLevelService } from '../../services/approve-level.service';
import { ApproveLevel } from '../../models/approve-level.model';
import { ApproveLevelFormComponent } from './approve-level-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-approve-level-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    ApproveLevelFormComponent
  ],
  templateUrl: './approve-level-list.component.html'
})
export class ApproveLevelListComponent implements OnInit {
  public service = inject(ApproveLevelService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: ApproveLevel | null = null;

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
      { field: 'approvelevelid', headerText: this.translate.instant('company.approveLevel.column.approveLevelId'), width: '150px' },
      { field: 'tdesc', headerText: this.translate.instant('company.approveLevel.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.approveLevel.column.edesc'), width: '200px' },
      { field: 'companyid', headerText: this.translate.instant('company.approveLevel.column.companyId'), width: '100px' },
      { field: 'edit_date', headerText: this.translate.instant('company.approveLevel.column.editDate'), type: 'date' as const, width: '120px' }
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

