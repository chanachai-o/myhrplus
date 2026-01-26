import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ZoneTypeService } from '../../services/zone-type.service';
import { ZoneType } from '../../models/zone-type.model';
import { ZoneTypeFormComponent } from './zone-type-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-zone-type-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    ZoneTypeFormComponent
  ],
  templateUrl: './zone-type-list.component.html'
})
export class ZoneTypeListComponent implements OnInit {
  public service = inject(ZoneTypeService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: ZoneType | null = null;

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
      { field: 'zonetypeid', headerText: this.translate.instant('company.zoneType.column.zoneTypeId'), width: '150px' },
      { field: 'tdesc', headerText: this.translate.instant('company.zoneType.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.zoneType.column.edesc'), width: '200px' },
      { field: 'brand_support', headerText: this.translate.instant('company.zoneType.column.brandSupport'), width: '150px' },
      { field: 'companyid', headerText: this.translate.instant('company.zoneType.column.companyId'), width: '100px' },
      { field: 'edit_date', headerText: this.translate.instant('company.zoneType.column.editDate'), type: 'date' as const, width: '120px' }
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

