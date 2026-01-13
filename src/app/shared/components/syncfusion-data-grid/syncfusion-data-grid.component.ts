import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef,
  OnChanges,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  GridComponent,
  GridModule,
  EditService,
  SearchService,
  ReorderService,
  SortService,
  GroupService,
  ColumnMenuService,
  PageService,
  FilterService,
  SelectionSettingsModel,
  ToolbarService,
  PdfExportService,
  ExcelExportService,
  DetailRowService,
  DetailDataBoundEventArgs,
  Grid,
  AggregateService,
  ExcelExportProperties,
  Column,
  ColumnMenuClickEventArgs,
  FilterSettingsModel,
  GroupSettingsModel,
  ColumnModel,
  PageSettingsModel,
  EditSettingsModel,
  CommandColumnService,
  ResizeService,
  ContextMenuService,
  FreezeService,
  SelectionService,
  VirtualScrollService
} from '@syncfusion/ej2-angular-grids';
import { Query } from '@syncfusion/ej2-data';
import { setCulture, L10n } from '@syncfusion/ej2-base';

export interface GridAction {
  id?: string;
  label?: string;
  icon?: string;
  class?: string; // CSS class for the button/icon
  title?: string; // Tooltip
  variant?: 'primary' | 'secondary' | 'danger' | 'info' | 'success' | 'warning';
  onClick?: (data: any) => void;
  visible?: (data: any) => boolean;
}

export interface CustomColumnModel extends ColumnModel {
  type?: string; // 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'image' | 'badge' | 'checkbox'
  isPrimaryKey?: boolean;
  showInColumnChooser?: boolean;
  // For 'badge' type
  badgeConfig?: {
    [key: string]: { class: string; label: string; icon?: string };
  };
}

import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-syncfusion-data-grid',
  standalone: true,
  imports: [CommonModule, GridModule, TranslateModule, EmptyStateComponent],
  templateUrl: './syncfusion-data-grid.component.html',
  styleUrls: ['./syncfusion-data-grid.component.scss'],
  providers: [
    AggregateService,
    SortService,
    GroupService,
    ColumnMenuService,
    PageService,
    FilterService,
    ToolbarService,
    PdfExportService,
    ExcelExportService,
    DetailRowService,
    ReorderService,
    EditService,
    SearchService,
    CommandColumnService,
    ResizeService,
    ContextMenuService,
    FreezeService,
    SelectionService,
    VirtualScrollService
  ],
  encapsulation: ViewEncapsulation.None
})
export class SyncfusionDataGridComponent implements OnInit, OnChanges {
  @ViewChild('grid') public grid?: GridComponent;

  // Data
  @Input() dataSource: any[] = [];
  @Input() columns: CustomColumnModel[] = [];

  // Features Flags
  @Input() allowPaging = true;
  @Input() allowSorting = true;
  @Input() allowFiltering = true;
  @Input() allowGrouping = true; // Enabled by default
  @Input() allowResizing = true;
  @Input() allowReordering = true;
  @Input() allowSelection = true;
  @Input() allowExcelExport = true;
  @Input() allowPdfExport = true;
  @Input() showColumnChooser = true;
  @Input() showColumnMenu = true; // Enabled by default
  @Input() showToolbar = true;

  // Settings
  @Input() pageSettings: PageSettingsModel = { pageSize: 10, pageSizes: [5, 10, 20, 50, 100], pageCount: 5 };
  @Input() filterSettings: FilterSettingsModel = { type: 'Menu' };
  @Input() groupSettings: GroupSettingsModel = { showDropArea: false, showGroupedColumn: true }; // Updated defaults
  @Input() editSettings: EditSettingsModel = { allowEditing: false, allowAdding: false, allowDeleting: false, mode: 'Normal' };
  @Input() selectionSettings: SelectionSettingsModel = { type: 'Single', mode: 'Row' };
  @Input() searchSettings: any = { fields: [], operator: 'contains', ignoreCase: true };

  // Toolbar
  @Input() toolbarItems: any[] = ['Search', 'ColumnChooser', 'ExcelExport', 'PdfExport', 'Print'];

  // Actions
  @Input() actions: GridAction[] = [];
  @Input() actionWidth = 120;
  @Input() actionHeaderText = 'Actions';

  // Detail Row
  @Input() enableDetailRow = false;
  @Input() childGridConfig: { queryString: string; dataSource?: any[]; columns: ColumnModel[] } | null = null;
  // Or custom detail template
  @ContentChild('detailTemplate') detailTemplate?: TemplateRef<any>;

  // Styling
  @Input() height: string | number = '100%';
  @Input() width: string | number = '100%';
  @Input() customClass = '';

  // Outputs
  @Output() rowSelected = new EventEmitter<any>();
  @Output() rowDeselected = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: GridAction; data: any }>();
  @Output() dataBound = new EventEmitter<any>();
  @Output() actionBegin = new EventEmitter<any>();
  @Output() actionComplete = new EventEmitter<any>();
  @Output() toolbarClick = new EventEmitter<any>();

  // Internal State
  public query: Query = new Query();

  // Aggregates State
  aggregatesSum: any[] = [];
  aggregatesCount: any[] = [];
  aggregatesAvg: any[] = [];
  aggregatesMin: any[] = [];
  aggregatesMax: any[] = [];

  // Localization
  locale = 'th-TH';

  public columnMenuItems: any[] = [
    'AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
    'Group', 'Ungroup', 'ColumnChooser', 'Filter',
    { text: 'Sum', id: 'aggregate_sum' },
    { text: 'Count', id: 'aggregate_count' },
    { text: 'Average', id: 'aggregate_average' },
    { text: 'Min', id: 'aggregate_min' },
    { text: 'Max', id: 'aggregate_max' }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.locale = this.translateService.currentLang === 'th' ? 'th-TH' : 'en-US';
  }

  ngOnInit(): void {
    this.setupLocalization();
    this.translateService.onLangChange.subscribe((event) => {
      this.locale = event.lang === 'th' ? 'th-TH' : 'en-US';
      this.setupLocalization();
      if (this.grid) {
        this.grid.refresh();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] && this.grid) {
      this.grid.refresh();
    }
  }

  private setupLocalization(): void {
    const isThai = this.locale === 'th-TH';

    if (isThai) {
        setCulture('th-TH');
    } else {
        setCulture('en-US');
    }
  }

  // --- Event Handlers ---

  onActionClick(action: GridAction, data: any): void {
    if (action.onClick) {
      action.onClick(data);
    }
    this.actionClick.emit({ action, data });
  }

  onToolbarClick(args: any): void {
    this.toolbarClick.emit(args);

    if (args.item.id?.includes('excelexport')) {
      this.grid?.excelExport();
    } else if (args.item.id?.includes('pdfexport')) {
      this.grid?.pdfExport();
    } else if (args.item.id?.includes('csvexport')) {
      this.grid?.csvExport();
    } else if (args.item.id?.includes('print')) {
      this.grid?.print();
    }
  }

  onColumnMenuClick(args: ColumnMenuClickEventArgs): void {
    if (!args.item.id) return;

    if (args.item.id.startsWith('aggregate_')) {
      const colField = (args.column as any)?.field;
      if (!colField) return;

      const selectedAgg = args.item.id.split('_')[1]; // sum, count, average, min, max
      this.updateAggregate(selectedAgg, colField);
    }
  }

  private updateAggregate(type: string, field: string): void {
    const addOrRemove = (array: any[], aggType: string, template: string) => {
      const index = array.findIndex(a => a.field === field);
      if (index > -1) {
        array.splice(index, 1);
      } else {
        array.push({
          field: field,
          type: aggType,
          footerTemplate: template
        });
      }
    };

    switch (type) {
      case 'sum':
        addOrRemove(this.aggregatesSum, 'Sum', 'Sum: ${Sum}');
        break;
      case 'count':
        addOrRemove(this.aggregatesCount, 'Count', 'Count: ${Count}');
        break;
      case 'average':
        addOrRemove(this.aggregatesAvg, 'Average', 'Avg: ${Average}');
        break;
      case 'min':
        addOrRemove(this.aggregatesMin, 'Min', 'Min: ${Min}');
        break;
      case 'max':
        addOrRemove(this.aggregatesMax, 'Max', 'Max: ${Max}');
        break;
    }

    // Refresh grid to reflect aggregates
    setTimeout(() => {
        this.grid?.refresh();
    }, 100);
  }

  // --- Detail Row Handling ---

  detailDataBound(args: DetailDataBoundEventArgs): void {
    if (!this.enableDetailRow || !this.childGridConfig) return;
  }

  // --- Utility Methods ---

  /**
   * Safe method to get data from dynamic property key
   * This is used in the template to avoid "Type 'undefined' cannot be used as an index type" error
   */
  getDataValue(data: any, field: string | undefined): any {
    if (!data || !field) return '';
    return data[field];
  }

  /**
   * Safe method to get badge config
   */
  getBadgeConfig(col: CustomColumnModel, value: any): any {
    if (!col.badgeConfig || !value) return null;
    return col.badgeConfig[value];
  }

  refresh(): void {
    this.grid?.refresh();
  }

  /**
   * Search grid data
   * @param text Search text
   */
  search(text: string): void {
    if (this.grid) {
      this.grid.search(text);
    }
  }

  /**
   * Export grid data to Excel
   */
  exportToExcel(): void {
    if (this.grid) {
      this.grid.excelExport();
    }
  }
}
