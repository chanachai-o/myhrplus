import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SyncfusionDataGridComponent, CustomColumnModel, GridAction } from '@shared/components/syncfusion-data-grid/syncfusion-data-grid.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { CompanyTypeService } from '../../services/company-type.service';
import { CompanyType } from '../../models/company-type.model';
import { CompanyTypeFormComponent } from './company-type-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-company-type-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    SyncfusionDataGridComponent,
    GlassCardComponent,
    GlassInputComponent,
    CompanyTypeFormComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './company-type-list.component.html'
})
export class CompanyTypeListComponent implements OnInit {
  public service = inject(CompanyTypeService);
  private translate = inject(TranslateService);

  @ViewChild(SyncfusionDataGridComponent) grid!: SyncfusionDataGridComponent;

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: CompanyType | null = null;
  searchControl = new FormControl('');

  headerActions: any[] = [];
  columns: CustomColumnModel[] = [];
  gridActions: GridAction[] = [];

  ngOnInit() {
    this.updateTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslations();
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.grid.search(value || '');
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
      { field: 'codeid', headerText: 'company.companyType.column.codeId', width: 120, isPrimaryKey: true },
      { field: 'tdesc', headerText: 'company.companyType.column.tdesc', width: 250 },
      { field: 'edesc', headerText: 'company.companyType.column.edesc', width: 250 },
      { field: 'edit_date', headerText: 'company.companyType.column.editDate', type: 'date', width: 150, format: 'dd/MM/yyyy' }
    ];

    this.gridActions = [
      {
        title: this.translate.instant('Edit'),
        icon: 'ti ti-edit',
        class: 'text-primary',
        onClick: (data) => this.onEdit(data)
      },
      {
        title: this.translate.instant('Delete'),
        icon: 'ti ti-trash',
        class: 'text-danger',
        onClick: (data) => this.onDelete(data)
      }
    ];
  }

  onCreate() {
    this.selectedItem = null;
    this.showModal = true;
  }

  onEdit(row: any) {
    this.selectedItem = row;
    this.showModal = true;
  }

  onDelete(row: any) {
    // TODO: Implement delete functionality
    console.log('Delete clicked', row);
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
