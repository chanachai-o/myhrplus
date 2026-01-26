import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { WorkareaBeaconService } from '../../services/workarea-beacon.service';
import { WorkareaBeacon } from '../../models/workarea-beacon.model';
import { WorkareaBeaconFormComponent } from './workarea-beacon-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-workarea-beacon-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    WorkareaBeaconFormComponent
  ],
  templateUrl: './workarea-beacon-list.component.html'
})
export class WorkareaBeaconListComponent implements OnInit {
  public service = inject(WorkareaBeaconService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: WorkareaBeacon | null = null;

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
      { field: 'workareaid', headerText: this.translate.instant('company.workareaBeacon.column.workAreaId'), width: '120px' },
      { field: 'line_no', headerText: this.translate.instant('company.workareaBeacon.column.lineNo'), width: '80px' },
      { field: 'beacon_uuid', headerText: this.translate.instant('company.workareaBeacon.column.beaconUuid'), width: '200px' },
      { field: 'beacon_address', headerText: this.translate.instant('company.workareaBeacon.column.beaconAddress'), width: '150px' },
      { field: 'beacon_name', headerText: this.translate.instant('company.workareaBeacon.column.beaconName'), width: '150px' },
      { field: 'latitude', headerText: this.translate.instant('company.workareaBeacon.column.latitude'), width: '120px' },
      { field: 'longitude', headerText: this.translate.instant('company.workareaBeacon.column.longitude'), width: '120px' },
      { field: 'companyid', headerText: this.translate.instant('company.workareaBeacon.column.companyId'), width: '100px' },
      { field: 'edit_date', headerText: this.translate.instant('company.workareaBeacon.column.editDate'), type: 'date' as const, width: '120px' }
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

