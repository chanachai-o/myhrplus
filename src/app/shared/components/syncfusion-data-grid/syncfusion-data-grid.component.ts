import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
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
  VirtualScrollService,
  ColumnChooserService
} from '@syncfusion/ej2-angular-grids';
import { Query } from '@syncfusion/ej2-data';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { MenuModule } from '@syncfusion/ej2-angular-navigations';

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
  allowFiltering?: boolean; // Allow filtering for this column (default: true)
  allowSorting?: boolean; // Allow sorting for this column (default: true)
  allowGrouping?: boolean; // Allow grouping for this column (default: true)
  filterTemplate?: any; // Custom filter template
  // For 'badge' type
  badgeConfig?: {
    [key: string]: { class: string; label: string; icon?: string };
  };
}

import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { SyncfusionModule } from '@shared/syncfusion/syncfusion.module';

@Component({
  selector: 'app-syncfusion-data-grid',
  standalone: true,
  imports: [CommonModule, SyncfusionModule, TranslateModule, EmptyStateComponent, DropDownButtonModule, MenuModule],
  templateUrl: './syncfusion-data-grid.component.html',
  styleUrls: ['./syncfusion-data-grid.component.scss'],
  providers: [
    AggregateService,
    SortService,
    GroupService,
    ColumnMenuService,
    ColumnChooserService,
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
  ]
})
export class SyncfusionDataGridComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('grid') public grid?: GridComponent;

  // Data
  @Input() dataSource: any[] = [];
  @Input() columns: ColumnModel[] = [];

  // Features Flags
  @Input() allowPaging = true;
  @Input() allowSorting = true;
  @Input() allowFiltering = true;
  @Input() allowGrouping = true; // Enabled by default
  @Input() allowResizing = true;
  @Input() allowReordering = true;
  @Input() allowSelection = true;
  @Input() showCheckboxColumn = false; // Show checkbox column for row selection
  @Input() allowExcelExport = true;
  @Input() allowPdfExport = true;
  @Input() showColumnChooser = true;
  @Input() showColumnMenu = true; // Enabled by default
  @Input() showToolbar = true;
  @Input() loadingIndicator: { indicatorType?: 'Spinner' | 'Shimmer'; } = { indicatorType: 'Spinner' };

  // Settings
  @Input() pageSettings: PageSettingsModel = { pageSize: 10, pageSizes: [5, 10, 20, 50, 100], pageCount: 5 };
  @Input() filterSettings: FilterSettingsModel = {
    type: 'Menu', // 'Menu' shows filter menu dropdown, 'Excel' shows Excel-style filter, 'FilterBar' shows filter bar
    showFilterBarStatus: true,
    immediateModeDelay: 0,
    mode: 'Immediate', // 'Immediate' or 'OnEnter'
    operators: {
      stringOperator: [
        { value: 'startsWith', text: 'Starts With' },
        { value: 'endsWith', text: 'Ends With' },
        { value: 'contains', text: 'Contains' },
        { value: 'equal', text: 'Equal' },
        { value: 'notEqual', text: 'Not Equal' }
      ],
      numberOperator: [
        { value: 'equal', text: 'Equal' },
        { value: 'notEqual', text: 'Not Equal' },
        { value: 'greaterThan', text: 'Greater Than' },
        { value: 'lessThan', text: 'Less Than' },
        { value: 'greaterThanOrEqual', text: 'Greater Than Or Equal' },
        { value: 'lessThanOrEqual', text: 'Less Than Or Equal' }
      ],
      dateOperator: [
        { value: 'equal', text: 'Equal' },
        { value: 'notEqual', text: 'Not Equal' },
        { value: 'greaterThan', text: 'Greater Than' },
        { value: 'lessThan', text: 'Less Than' },
        { value: 'greaterThanOrEqual', text: 'Greater Than Or Equal' },
        { value: 'lessThanOrEqual', text: 'Less Than Or Equal' }
      ]
    }
  };
  @Input() groupSettings: GroupSettingsModel = { showDropArea: true, showGroupedColumn: true }; // Enabled by default
  @Input() editSettings: EditSettingsModel = { allowEditing: false, allowAdding: false, allowDeleting: false, mode: 'Batch' };
  @Input() selectionSettings: SelectionSettingsModel = {
    type: 'Single',
    mode: 'Row',
    checkboxOnly: false,
    persistSelection: false
  };
  @Input() searchSettings: any = { fields: [], operator: 'contains', ignoreCase: true };

  // Toolbar
  @Input() toolbarItems: any[] = ['Search', 'ColumnChooser', 'ExcelExport', 'PdfExport', 'Print'];

  // Context Menu
  @Input() contextMenuItems: any[] = [
    'AutoFit',
    'AutoFitAll',
    'SortAscending',
    'SortDescending',
    'Copy',
    { text: 'ExcelExport', id: 'excelexport' },
    { text: 'PdfExport', id: 'pdfexport' },
    { text: 'CsvExport', id: 'csvexport' },
    { text: 'FirstPage', id: 'firstpage' },
    { text: 'PrevPage', id: 'prevpage' },
    { text: 'LastPage', id: 'lastpage' },
    { text: 'NextPage', id: 'nextpage' }
  ];

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
  @Output() rowSelectionChanged = new EventEmitter<any>(); // Emitted when selection changes (for checkbox)
  @Output() actionClick = new EventEmitter<{ action: GridAction; data: any }>();
  @Output() rowDeleted = new EventEmitter<any>(); // Emitted when a row is deleted
  @Output() dataBound = new EventEmitter<any>();
  @Output() actionBegin = new EventEmitter<any>();
  @Output() actionComplete = new EventEmitter<any>();
  @Output() toolbarClick = new EventEmitter<any>();
  @Output() contextMenuClick = new EventEmitter<any>();
  @Output() detailDataBound = new EventEmitter<DetailDataBoundEventArgs>();

  // Internal State
  public query: Query = new Query();
  private isLoading = false;

  // Aggregates State
  aggregatesSum: any[] = [];
  aggregatesCount: any[] = [];
  aggregatesAvg: any[] = [];
  aggregatesMin: any[] = [];
  aggregatesMax: any[] = [];

  // Localization
  locale = 'th-TH';

  public columnMenuItems: any[] = [
    'AutoFit',
    'AutoFitAll',
    'SortAscending',
    'SortDescending',
    'Group',
    'Ungroup',
    'ColumnChooser',
    'Filter',
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
    console.log('[SyncfusionDataGrid] Init', {
      dataSourceLength: this.dataSource?.length,
      columnsCount: this.columns?.length,
      columns: this.columns,
      actionsCount: this.actions?.length,
      actions: this.actions,
      showToolbar: this.showToolbar,
      showColumnMenu: this.showColumnMenu,
      showColumnChooser: this.showColumnChooser,
      toolbarItems: this.toolbarItems,
      columnMenuItems: this.columnMenuItems
    });
    this.setupLocalization();
    this.translateService.onLangChange.subscribe((event) => {
      this.locale = event.lang === 'th' ? 'th-TH' : 'en-US';
      this.setupLocalization();
      if (this.grid) {
        this.grid.refresh();
      }
    });
  }

  ngAfterViewInit(): void {
    console.log('[SyncfusionDataGrid] AfterViewInit', {
      grid: !!this.grid,
      showColumnMenu: this.showColumnMenu,
      columnMenuItems: this.columnMenuItems,
      columnMenuItemsLength: this.columnMenuItems?.length
    });

    // Column menu initialization will be handled in onDataBound event
    // This ensures grid is fully rendered before setting properties
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[SyncfusionDataGrid] Changes:', changes);
    if (changes['dataSource']) {
      console.log('[SyncfusionDataGrid] New DataSource:', this.dataSource);
      console.log('[SyncfusionDataGrid] Grid:', this.grid?.columnMenuItems);
      if (this.grid) {
        this.grid.refresh();
      }
    }
    if (changes['columns']) {
      console.log('[SyncfusionDataGrid] New Columns:', this.columns);
    }
    if (changes['actions']) {
      console.log('[SyncfusionDataGrid] Actions changed:', this.actions);
      console.log('[SyncfusionDataGrid] Actions length:', this.actions?.length);
      if (this.grid) {
        this.grid.refresh();
      }
    }
    if (changes['loadingIndicator'] && this.grid) {
      this.grid.loadingIndicator = this.loadingIndicator;
    }
  }

  private setupLocalization(): void {
    const isThai = this.locale === 'th-TH';

    if (isThai) {
      setCulture('th-TH');

      // Load Thai locale configuration for Syncfusion Grid
      L10n.load({
        'th-TH': {
          grid: {
            EmptyRecord: 'ไม่มีข้อมูลที่จะแสดง',
            GroupDropArea: 'ลากหัวข้อคอลัมน์มาที่นี่เพื่อจัดกลุ่มคอลัมน์',
            UnGroup: 'คลิกที่นี่เพื่อยกเลิกการจัดกลุ่ม',
            EmptyDataSourceError: 'DataSource ไม่ควรเป็นค่าว่างในครั้งแรกที่โหลด เนื่องจากคอลัมน์ถูกสร้างขึ้นโดยอัตโนมัติจาก DataSource',
            Item: 'รายการ',
            Items: 'รายการ',
            ConfirmDelete: 'คุณต้องการลบรายการนี้หรือไม่?',
            CancelEdit: 'คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก คุณต้องการยกเลิกหรือไม่?',
            OKButton: 'ตกลง',
            CancelButton: 'ยกเลิก',
            EditFormTitle: 'รายละเอียดของ',
            AddFormTitle: 'เพิ่มรายการใหม่',
            BatchSaveConfirm: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
            BatchSaveLostChanges: 'การเปลี่ยนแปลงที่ยังไม่ได้บันทึกจะสูญหาย คุณต้องการดำเนินการต่อหรือไม่?',
            ChooseColumns: 'เลือกคอลัมน์',
            SearchColumns: 'ค้นหาคอลัมน์',
            Matchs: 'ไม่พบผลลัพธ์',
            FilterButton: 'กรอง',
            ClearButton: 'ล้าง',
            StoredFilters: 'กรองที่บันทึกไว้',
            AutoFitAll: 'ปรับความกว้างอัตโนมัติทั้งหมด',
            AutoFit: 'ปรับความกว้างอัตโนมัติ',
            Export: 'ส่งออก',
            PdfExport: 'ส่งออก PDF',
            ExcelExport: 'ส่งออก Excel',
            FirstPage: 'หน้าแรก',
            PrevPage: 'หน้าก่อน',
            LastPage: 'หน้าสุดท้าย',
            NextPage: 'หน้าถัดไป',
            SortAscending: 'เรียงจากน้อยไปมาก',
            SortDescending: 'เรียงจากมากไปน้อย',
            EditRecord: 'แก้ไข',
            DeleteRecord: 'ลบ',
            Save: 'บันทึก',
            Cancel: 'ยกเลิก',
            Add: 'เพิ่ม',
            Edit: 'แก้ไข',
            Delete: 'ลบ',
            Update: 'อัปเดต',
            Refresh: 'รีเฟรช',
            Print: 'พิมพ์',
            Pdf: 'PDF',
            Excel: 'Excel',
            Word: 'Word',
            Csv: 'CSV',
            Search: 'ค้นหา',
            ColumnChooser: 'เลือกคอลัมน์',
            ItemsPerPage: 'รายการต่อหน้า',
            TotalItems: 'ทั้งหมด',
            SelectedItems: 'รายการที่เลือก',
            MatchCase: 'ตรงตามตัวพิมพ์ใหญ่-เล็ก',
            Between: 'ระหว่าง',
            CustomFilter: 'กรองแบบกำหนดเอง',
            CustomFilterDatePlaceholder: 'เลือกวันที่',
            CustomFilterPlaceholder: 'ป้อนค่า',
            AND: 'และ',
            OR: 'หรือ',
            ShowRowsWhere: 'แสดงแถวที่',
            CurrentPageInfo: '{0} จาก {1} หน้า',
            TotalItemsInfo: '({0} รายการ)',
            FirstPageTooltip: 'หน้าแรก',
            LastPageTooltip: 'หน้าสุดท้าย',
            NextPageTooltip: 'หน้าถัดไป',
            PreviousPageTooltip: 'หน้าก่อน',
            NextPagerTooltip: 'หน้าถัดไป',
            PreviousPagerTooltip: 'หน้าก่อน',
            PagerDropDown: 'รายการต่อหน้า',
            PagerAllDropDown: 'รายการ',
            All: 'ทั้งหมด'
          },
          pager: {
            currentPageInfo: '{0} จาก {1} หน้า',
            totalItemsInfo: '({0} รายการ)',
            firstPageTooltip: 'หน้าแรก',
            lastPageTooltip: 'หน้าสุดท้าย',
            nextPageTooltip: 'หน้าถัดไป',
            previousPageTooltip: 'หน้าก่อน',
            nextPagerTooltip: 'หน้าถัดไป',
            previousPagerTooltip: 'หน้าก่อน',
            pagerDropDown: 'รายการต่อหน้า',
            pagerAllDropDown: 'รายการ',
            All: 'ทั้งหมด'
          }
        }
      });
    } else {
      setCulture('en-US');
    }
  }

  // --- Event Handlers ---

  onActionClick(action: GridAction, data: any): void {
    // Prevent event propagation to avoid row selection
    if (!action) {
      console.warn('[SyncfusionDataGrid] Action is undefined');
      return;
    }

    console.log('[SyncfusionDataGrid] Action clicked:', {
      actionTitle: action.title,
      actionId: action.id,
      data: data
    });

    // Check if this is a delete action
    const isDeleteAction = action.id === 'delete' ||
                          action.title?.toLowerCase().includes('delete') ||
                          action.title?.toLowerCase().includes('ลบ');

    // Call the onClick callback if provided
    if (action.onClick && typeof action.onClick === 'function') {
      try {
        action.onClick(data);

        // Emit rowDeleted event if this is a delete action
        if (isDeleteAction) {
          console.log('[SyncfusionDataGrid] Emitting rowDeleted event for:', data);
          this.rowDeleted.emit(data);
        }
      } catch (error) {
        console.error('[SyncfusionDataGrid] Error in action onClick callback:', error);
        console.error('[SyncfusionDataGrid] Action details:', action);
        console.error('[SyncfusionDataGrid] Data passed:', data);
      }
    } else {
      console.warn('[SyncfusionDataGrid] Action onClick is not a function:', action);
    }

    // Always emit the actionClick event for parent components that want to listen
    this.actionClick.emit({ action, data });
  }

  onRowSelected(args: any): void {
    this.rowSelected.emit(args);
    this.emitSelectionChanged();
  }

  onRowDeselected(args: any): void {
    this.rowDeselected.emit(args);
    this.emitSelectionChanged();
  }

  onRowSelecting(args: any): void {
    // This event fires before selection happens
    // Can be used to prevent selection if needed
  }

  private emitSelectionChanged(): void {
    if (this.grid) {
      const selectedRows = this.grid.getSelectedRows();
      this.rowSelectionChanged.emit({
        selectedRows: selectedRows,
        selectedRowIndexes: this.grid.getSelectedRowIndexes(),
        selectedRecords: this.grid.getSelectedRecords()
      });
    }
  }

  /**
   * Get selected rows
   */
  getSelectedRows(): any[] {
    return this.grid?.getSelectedRows() || [];
  }

  /**
   * Get selected records
   */
  getSelectedRecords(): any[] {
    return this.grid?.getSelectedRecords() || [];
  }

  /**
   * Get selected row indexes
   */
  getSelectedRowIndexes(): number[] {
    return this.grid?.getSelectedRowIndexes() || [];
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.grid?.clearSelection();
  }

  /**
   * Select all rows
   */
  selectAll(): void {
    if (this.grid && this.showCheckboxColumn) {
      this.grid.selectRows([...Array(this.dataSource.length).keys()]);
    }
  }

  onDataBound(args: any): void {
    this.dataBound.emit(args);

    // Ensure column menu is properly initialized after data is bound
    if (this.grid && this.showColumnMenu) {
      try {
        // Set showColumnMenu property
        (this.grid as any).showColumnMenu = true;

        // Set columnMenuItems
        if (this.columnMenuItems && this.columnMenuItems.length > 0) {
          this.grid.columnMenuItems = this.columnMenuItems;
        }

        console.log('[SyncfusionDataGrid] DataBound - Column Menu initialized:', {
          showColumnMenu: (this.grid as any).showColumnMenu,
          columnMenuItems: this.grid.columnMenuItems?.length
        });
      } catch (error) {
        console.warn('[SyncfusionDataGrid] Error initializing column menu in dataBound:', error);
      }
    }
  }

  onActionBegin(args: any): void {
    this.actionBegin.emit(args);

    // Show loading indicator for pagination, sorting, filtering, etc.
    if (args.requestType === 'paging' ||
        args.requestType === 'sorting' ||
        args.requestType === 'filtering' ||
        args.requestType === 'grouping' ||
        args.requestType === 'searching') {
      this.isLoading = true;
      if (this.grid) {
        this.grid.showSpinner();
      }
    }
  }

  onActionComplete(args: any): void {
    this.actionComplete.emit(args);

    // Hide loading indicator when action completes
    if (args.requestType === 'paging' ||
        args.requestType === 'sorting' ||
        args.requestType === 'filtering' ||
        args.requestType === 'grouping' ||
        args.requestType === 'searching') {
      this.isLoading = false;
      if (this.grid) {
        this.grid.hideSpinner();
      }
    }
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
    } else if (args.item.id?.includes('columnchooser')) {
      // ColumnChooser is handled automatically by Syncfusion
      // This is just for logging/debugging
      console.log('[SyncfusionDataGrid] ColumnChooser clicked');
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

  onContextMenuClick(args: any): void {
    this.contextMenuClick.emit(args);

    if (!args.item || !args.item.id) return;

    const itemId = args.item.id.toLowerCase();

    // Handle context menu items
    if (itemId.includes('autofit')) {
      if (itemId.includes('all')) {
        this.grid?.autoFitColumns();
      } else {
        // AutoFit single column - handled by Syncfusion automatically
        console.log('[SyncfusionDataGrid] AutoFit column');
      }
    } else if (itemId.includes('sort')) {
      // Sorting is handled automatically by Syncfusion
      console.log('[SyncfusionDataGrid] Sort clicked');
    } else if (itemId.includes('copy')) {
      // Copy is handled automatically by Syncfusion
      console.log('[SyncfusionDataGrid] Copy clicked');
    } else if (itemId.includes('excelexport')) {
      this.grid?.excelExport();
    } else if (itemId.includes('pdfexport')) {
      this.grid?.pdfExport();
    } else if (itemId.includes('csvexport')) {
      this.grid?.csvExport();
    } else if (itemId.includes('firstpage')) {
      this.grid?.goToPage(1);
    } else if (itemId.includes('prevpage')) {
      // Get current page from pageSettings
      const currentPage = (this.pageSettings as any)?.currentPage || 1;
      if (currentPage > 1) {
        this.grid?.goToPage(currentPage - 1);
      }
    } else if (itemId.includes('nextpage')) {
      // Get current page from pageSettings
      const currentPage = (this.pageSettings as any)?.currentPage || 1;
      const totalPages = this.pageSettings?.pageCount || 1;
      if (currentPage < totalPages) {
        this.grid?.goToPage(currentPage + 1);
      }
    } else if (itemId.includes('lastpage')) {
      const totalPages = this.pageSettings?.pageCount || 1;
      this.grid?.goToPage(totalPages);
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

  onDetailDataBound(args: DetailDataBoundEventArgs): void {
    // Emit the event for parent components
    this.detailDataBound.emit(args);

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
