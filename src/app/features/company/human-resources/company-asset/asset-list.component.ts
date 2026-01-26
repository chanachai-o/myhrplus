import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset.model';
import { AssetFormComponent } from './asset-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    AssetFormComponent
  ],
  templateUrl: './asset-list.component.html'
})
export class AssetListComponent implements OnInit {
  public service = inject(AssetService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: Asset | null = null;

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
      { field: 'assetid', headerText: this.translate.instant('company.companyAsset.column.assetId'), width: '100px' },
      { field: 'tdesc', headerText: this.translate.instant('company.companyAsset.column.tdesc'), width: '200px' },
      { field: 'astype', headerText: this.translate.instant('company.companyAsset.column.astype'), width: '100px' },
      { field: 'status', headerText: this.translate.instant('company.companyAsset.column.status'), width: '80px' },
      { field: 'owner', headerText: this.translate.instant('company.companyAsset.column.owner'), width: '120px' }
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


