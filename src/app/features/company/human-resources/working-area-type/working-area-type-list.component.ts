import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { WorkingAreaTypeService } from '../../services/working-area-type.service';
import { WorkingAreaType } from '../../models/working-area-type.model';
import { WorkingAreaTypeFormComponent } from './working-area-type-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-working-area-type-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    WorkingAreaTypeFormComponent
  ],
  templateUrl: './working-area-type-list.component.html'
})
export class WorkingAreaTypeListComponent implements OnInit {
  public service = inject(WorkingAreaTypeService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: WorkingAreaType | null = null;

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
      { field: 'worktypeid', headerText: this.translate.instant('company.workingAreaType.column.workTypeId'), width: '120px' },
      { field: 'tdesc', headerText: this.translate.instant('company.workingAreaType.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.workingAreaType.column.edesc'), width: '200px' },
      { field: 'companyid', headerText: this.translate.instant('company.workingAreaType.column.companyId'), width: '100px' },
      {
        field: 'work_status',
        headerText: this.translate.instant('company.workingAreaType.column.workStatus'),
        width: '100px',
        type: 'boolean' as const,
        formatter: (value: string) => {
          return value === '1'
            ? this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.ACTIVE)
            : this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.INACTIVE);
        }
      },
      { field: 'edit_date', headerText: this.translate.instant('company.workingAreaType.column.editDate'), type: 'date' as const, width: '120px' }
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

