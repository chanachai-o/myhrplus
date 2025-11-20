import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import {
  TreeGridComponent as SyncfusionTreeGridComponent,
  PageService,
  SortService,
  FilterService,
  ToolbarService,
  ExcelExportService,
  PdfExportService,
  ColumnChooserService,
  ResizeService,
  ReorderService,
  EditService,
  CommandColumnService,
  ContextMenuService,
  SelectionService,
  VirtualScrollService
} from '@syncfusion/ej2-angular-treegrid';

export interface TreeGridColumn {
  field: string;
  headerText?: string;
  width?: string | number;
  textAlign?: 'Left' | 'Center' | 'Right';
  format?: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'datetime';
  template?: any;
  visible?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowEditing?: boolean;
  isPrimaryKey?: boolean;
  editType?: 'defaultedit' | 'dropdownedit' | 'booleanedit' | 'datepickeredit' | 'numericedit';
  edit?: any;
  commands?: any[];
}

export interface TreeGridConfig {
  dataSource?: any[];
  columns?: TreeGridColumn[];
  childMapping?: string;
  hasChildMapping?: string;
  allowPaging?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowSearching?: boolean;
  allowSelection?: boolean;
  allowResizing?: boolean;
  allowReordering?: boolean;
  allowEditing?: boolean;
  allowExcelExport?: boolean;
  allowPdfExport?: boolean;
  showColumnChooser?: boolean;
  enableVirtualization?: boolean;
  pageSettings?: any;
  selectionSettings?: any;
  editSettings?: any;
  toolbar?: any[];
  customClass?: string;
}

@Component({
  selector: 'app-tree-grid',
  standalone: true,
  imports: [CommonModule, TreeGridModule],
  providers: [
    PageService,
    SortService,
    FilterService,
    ToolbarService,
    ExcelExportService,
    PdfExportService,
    ColumnChooserService,
    ResizeService,
    ReorderService,
    EditService,
    CommandColumnService,
    ContextMenuService,
    SelectionService,
    VirtualScrollService
  ],
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.scss']
})
export class TreeGridComponent implements OnInit, OnDestroy {
  @ViewChild('treegrid', { static: false }) treegrid!: SyncfusionTreeGridComponent;

  // Data
  @Input() dataSource: any[] = [];
  @Input() columns: TreeGridColumn[] = [];
  
  // Tree Settings
  @Input() childMapping: string = 'subtasks';
  @Input() hasChildMapping?: string;
  @Input() idMapping?: string;
  @Input() parentIdMapping?: string;
  
  // Features
  @Input() allowPaging: boolean = true;
  @Input() allowSorting: boolean = true;
  @Input() allowFiltering: boolean = true;
  // Note: allowSearching is handled via toolbar search functionality
  @Input() allowSelection: boolean = true;
  @Input() allowResizing: boolean = true;
  @Input() allowReordering: boolean = true;
  // Note: allowEditing is controlled via editSettings
  @Input() allowExcelExport: boolean = true;
  @Input() allowPdfExport: boolean = true;
  @Input() showColumnChooser: boolean = true;
  @Input() enableVirtualization: boolean = false;
  
  // Settings
  @Input() pageSettings: any = {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100]
  };
  @Input() selectionSettings: any = {
    mode: 'Row',
    type: 'Single'
  };
  @Input() editSettings: any = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    mode: 'Row'
  };
  @Input() toolbar: any[] = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'ExcelExport', 'PdfExport', 'CsvExport', 'ColumnChooser'];
  
  // Styling
  @Input() customClass: string = '';
  @Input() height: string | number = '400px';
  @Input() width: string | number = '100%';
  
  // Events
  @Output() created = new EventEmitter<any>();
  @Output() dataBound = new EventEmitter<any>();
  @Output() rowSelected = new EventEmitter<any>();
  @Output() rowDeselected = new EventEmitter<any>();
  @Output() cellSelected = new EventEmitter<any>();
  @Output() cellDeselected = new EventEmitter<any>();
  @Output() recordClick = new EventEmitter<any>();
  @Output() recordDoubleClick = new EventEmitter<any>();
  @Output() rowDragStart = new EventEmitter<any>();
  @Output() rowDrop = new EventEmitter<any>();
  @Output() actionBegin = new EventEmitter<any>();
  @Output() actionComplete = new EventEmitter<any>();
  @Output() dataStateChange = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Refresh grid
   */
  refresh(): void {
    if (this.treegrid) {
      this.treegrid.refresh();
    }
  }

  /**
   * Get selected rows
   */
  getSelectedRows(): any[] {
    if (this.treegrid) {
      const selectedRows = this.treegrid.getSelectedRows();
      const selectedData: any[] = [];
      selectedRows.forEach((row: any) => {
        const rowInfo = this.treegrid.getRowInfo(row);
        if (rowInfo) {
          // Get data from rowInfo or row element
          const rowData = (rowInfo as any).rowData || (row as any).data || row;
          if (rowData) {
            selectedData.push(rowData);
          }
        }
      });
      return selectedData;
    }
    return [];
  }

  /**
   * Select row by index
   */
  selectRow(index: number): void {
    if (this.treegrid) {
      this.treegrid.selectRow(index);
    }
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    if (this.treegrid) {
      this.treegrid.clearSelection();
    }
  }

  /**
   * Expand all rows
   */
  expandAll(): void {
    if (this.treegrid) {
      this.treegrid.expandAll();
    }
  }

  /**
   * Collapse all rows
   */
  collapseAll(): void {
    if (this.treegrid) {
      this.treegrid.collapseAll();
    }
  }

  /**
   * Expand row by index
   */
  expandRow(index: number): void {
    if (this.treegrid) {
      // Get row element by index
      const rows = this.treegrid.getRows();
      if (rows && rows[index]) {
        this.treegrid.expandRow(rows[index]);
      }
    }
  }

  /**
   * Collapse row by index
   */
  collapseRow(index: number): void {
    if (this.treegrid) {
      // Get row element by index
      const rows = this.treegrid.getRows();
      if (rows && rows[index]) {
        this.treegrid.collapseRow(rows[index]);
      }
    }
  }

  /**
   * Export to Excel
   */
  exportToExcel(fileName?: string): void {
    if (this.treegrid) {
      const excelExportProperties = {
        fileName: fileName || 'TreeGrid'
      };
      this.treegrid.excelExport(excelExportProperties);
    }
  }

  /**
   * Export to PDF
   */
  exportToPdf(fileName?: string): void {
    if (this.treegrid) {
      const pdfExportProperties = {
        fileName: fileName || 'TreeGrid'
      };
      this.treegrid.pdfExport(pdfExportProperties);
    }
  }

  /**
   * Export to CSV
   */
  exportToCsv(fileName?: string): void {
    if (this.treegrid) {
      const csvExportProperties = {
        fileName: fileName || 'TreeGrid'
      };
      this.treegrid.csvExport(csvExportProperties);
    }
  }

  /**
   * Search
   */
  search(searchText: string): void {
    if (this.treegrid && searchText) {
      // Use filter method for searching
      (this.treegrid as any).filterByColumn('', 'contains', searchText);
    }
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    if (this.treegrid) {
      this.treegrid.clearFiltering();
    }
  }

  /**
   * Get tree grid instance
   */
  getTreeGridInstance(): SyncfusionTreeGridComponent | null {
    return this.treegrid || null;
  }

  /**
   * Event handlers
   */
  onCreated(args: any): void {
    this.created.emit(args);
  }

  onDataBound(args: any): void {
    this.dataBound.emit(args);
  }

  onRowSelected(args: any): void {
    this.rowSelected.emit(args);
  }

  onRowDeselected(args: any): void {
    this.rowDeselected.emit(args);
  }

  onCellSelected(args: any): void {
    this.cellSelected.emit(args);
  }

  onCellDeselected(args: any): void {
    this.cellDeselected.emit(args);
  }

  onRecordClick(args: any): void {
    this.recordClick.emit(args);
  }

  onRecordDoubleClick(args: any): void {
    this.recordDoubleClick.emit(args);
  }

  onRowDragStart(args: any): void {
    this.rowDragStart.emit(args);
  }

  onRowDrop(args: any): void {
    this.rowDrop.emit(args);
  }

  onActionBegin(args: any): void {
    this.actionBegin.emit(args);
  }

  onActionComplete(args: any): void {
    this.actionComplete.emit(args);
  }

  onDataStateChange(args: any): void {
    this.dataStateChange.emit(args);
  }
}

