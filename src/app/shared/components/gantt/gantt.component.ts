import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttModule } from '@syncfusion/ej2-angular-gantt';
import {
  GanttComponent as SyncfusionGanttComponent,
  SelectionService,
  SortService,
  FilterService,
  ToolbarService,
  EditService,
  DayMarkersService,
  ResizeService,
  ReorderService,
  ExcelExportService,
  PdfExportService,
  CriticalPathService
} from '@syncfusion/ej2-angular-gantt';

export interface GanttTask {
  taskID: number;
  taskName: string;
  startDate?: Date | string;
  endDate?: Date | string;
  duration?: number;
  progress?: number;
  dependency?: string;
  resourceID?: number | number[];
  baselineStartDate?: Date | string;
  baselineEndDate?: Date | string;
  notes?: string;
  subtasks?: GanttTask[];
  [key: string]: any;
}

export interface GanttColumn {
  field: string;
  headerText?: string;
  width?: number | string;
  textAlign?: 'Left' | 'Right' | 'Center';
  format?: string;
  type?: 'string' | 'number' | 'date' | 'boolean';
  visible?: boolean;
  [key: string]: any;
}

export interface GanttConfig {
  dataSource?: GanttTask[];
  taskFields?: any;
  columns?: GanttColumn[];
  height?: string | number;
  width?: string | number;
  allowSelection?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowResizing?: boolean;
  allowReordering?: boolean;
  enableToolbar?: boolean;
  toolbar?: string[];
  allowExcelExport?: boolean;
  allowPdfExport?: boolean;
  enableCriticalPath?: boolean;
  timelineSettings?: any;
  labelSettings?: any;
  splitterSettings?: any;
  projectStartDate?: Date | string;
  projectEndDate?: Date | string;
  workWeek?: number[];
  holidays?: any[];
  eventMarkers?: any[];
  enableRtl?: boolean;
  locale?: string;
  customClass?: string;
}

@Component({
  selector: 'app-gantt',
  standalone: true,
  imports: [CommonModule, GanttModule],
  providers: [
    SelectionService,
    SortService,
    FilterService,
    ToolbarService,
    EditService,
    DayMarkersService,
    ResizeService,
    ReorderService,
    ExcelExportService,
    PdfExportService,
    CriticalPathService
  ],
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gantt', { static: false }) gantt!: SyncfusionGanttComponent;

  // Data Source
  @Input() dataSource: GanttTask[] = [];
  @Input() taskFields: any = {
    id: 'taskID',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    dependency: 'dependency',
    child: 'subtasks'
  };

  // Columns
  @Input() columns: GanttColumn[] = [];

  // Behavior
  @Input() allowSelection: boolean = true;
  @Input() allowSorting: boolean = true;
  @Input() allowFiltering: boolean = true;
  @Input() allowResizing: boolean = true;
  @Input() allowReordering: boolean = true;
  @Input() allowEditing: boolean = true;
  @Input() allowTaskbarDragDrop: boolean = true;
  @Input() allowTaskbarResize: boolean = true;

  // Toolbar
  @Input() enableToolbar: boolean = false;
  @Input() toolbar: string[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport', 'Indent', 'Outdent'];

  // Export
  @Input() allowExcelExport: boolean = false;
  @Input() allowPdfExport: boolean = false;

  // Advanced
  @Input() enableCriticalPath: boolean = false;
  @Input() timelineSettings: any = {};
  @Input() labelSettings: any = {};
  @Input() splitterSettings: any = { position: '50%' };
  @Input() projectStartDate?: Date | string;
  @Input() projectEndDate?: Date | string;
  @Input() workWeek: number[] = [0, 1, 2, 3, 4];
  @Input() holidays: any[] = [];
  @Input() eventMarkers: any[] = [];

  // Appearance
  @Input() height: string | number = '450px';
  @Input() width: string | number = '100%';
  @Input() enableRtl: boolean = false;
  @Input() locale: string = 'en';
  @Input() customClass?: string;
  @Input() config?: GanttConfig;

  // Events
  @Output() actionBegin = new EventEmitter<any>();
  @Output() actionComplete = new EventEmitter<any>();
  @Output() cellEdit = new EventEmitter<any>();
  @Output() taskbarEdited = new EventEmitter<any>();
  @Output() rowSelected = new EventEmitter<any>();
  @Output() rowDeselected = new EventEmitter<any>();
  @Output() dataBound = new EventEmitter<any>();
  @Output() created = new EventEmitter<any>();

  ngOnInit(): void {
    // Apply config if provided
    if (this.config) {
      this.dataSource = this.config.dataSource || this.dataSource;
      this.taskFields = this.config.taskFields || this.taskFields;
      this.columns = this.config.columns || this.columns;
      this.height = this.config.height ?? this.height;
      this.width = this.config.width ?? this.width;
      this.allowSelection = this.config.allowSelection ?? this.allowSelection;
      this.allowSorting = this.config.allowSorting ?? this.allowSorting;
      this.allowFiltering = this.config.allowFiltering ?? this.allowFiltering;
      this.allowResizing = this.config.allowResizing ?? this.allowResizing;
      this.allowReordering = this.config.allowReordering ?? this.allowReordering;
      this.enableToolbar = this.config.enableToolbar ?? this.enableToolbar;
      this.toolbar = this.config.toolbar || this.toolbar;
      this.allowExcelExport = this.config.allowExcelExport ?? this.allowExcelExport;
      this.allowPdfExport = this.config.allowPdfExport ?? this.allowPdfExport;
      this.enableCriticalPath = this.config.enableCriticalPath ?? this.enableCriticalPath;
      this.timelineSettings = this.config.timelineSettings || this.timelineSettings;
      this.labelSettings = this.config.labelSettings || this.labelSettings;
      this.splitterSettings = this.config.splitterSettings || this.splitterSettings;
      this.projectStartDate = this.config.projectStartDate || this.projectStartDate;
      this.projectEndDate = this.config.projectEndDate || this.projectEndDate;
      this.workWeek = this.config.workWeek || this.workWeek;
      this.holidays = this.config.holidays || this.holidays;
      this.eventMarkers = this.config.eventMarkers || this.eventMarkers;
      this.enableRtl = this.config.enableRtl ?? this.enableRtl;
      this.locale = this.config.locale || this.locale;
      this.customClass = this.config.customClass || this.customClass;
    }
  }

  ngAfterViewInit(): void {
    if (this.gantt) {
      this.created.emit({ gantt: this.gantt });
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get Gantt instance
   */
  getGanttInstance(): SyncfusionGanttComponent | null {
    return this.gantt || null;
  }

  /**
   * Refresh Gantt
   */
  refresh(): void {
    if (this.gantt) {
      this.gantt.refresh();
    }
  }

  /**
   * Export to Excel
   */
  exportToExcel(fileName?: string): void {
    if (this.gantt) {
      const exportProperties = {
        fileName: fileName || 'GanttChart'
      };
      this.gantt.excelExport(exportProperties);
    }
  }

  /**
   * Export to PDF
   */
  exportToPdf(fileName?: string): void {
    if (this.gantt) {
      const exportProperties = {
        fileName: fileName || 'GanttChart'
      };
      this.gantt.pdfExport(exportProperties);
    }
  }

  /**
   * Export to CSV
   */
  exportToCsv(fileName?: string): void {
    if (this.gantt) {
      const exportProperties = {
        fileName: fileName || 'GanttChart'
      };
      this.gantt.csvExport(exportProperties);
    }
  }

  /**
   * Expand all tasks
   */
  expandAll(): void {
    if (this.gantt) {
      this.gantt.expandAll();
    }
  }

  /**
   * Collapse all tasks
   */
  collapseAll(): void {
    if (this.gantt) {
      this.gantt.collapseAll();
    }
  }

  /**
   * Expand row by index
   */
  expandByIndex(index: number): void {
    if (this.gantt) {
      this.gantt.expandByIndex(index);
    }
  }

  /**
   * Collapse row by index
   */
  collapseByIndex(index: number): void {
    if (this.gantt) {
      this.gantt.collapseByIndex(index);
    }
  }

  /**
   * Get selected rows
   */
  getSelectedRows(): any[] {
    if (this.gantt) {
      // Get selected row indexes
      const selectedIndexes = this.gantt.selectionModule?.selectedRowIndexes || [];
      // Get row data from selected indexes
      const selectedRows: any[] = [];
      selectedIndexes.forEach((index: number) => {
        const row = this.gantt.getRowByIndex(index);
        if (row) {
          selectedRows.push(row);
        }
      });
      return selectedRows;
    }
    return [];
  }

  /**
   * Select row by index
   */
  selectRow(index: number): void {
    if (this.gantt) {
      this.gantt.selectRows([index]);
    }
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    if (this.gantt && this.gantt.selectionModule) {
      this.gantt.selectionModule.clearSelection();
    }
  }

  /**
   * Search tasks
   */
  search(searchText: string): void {
    if (this.gantt) {
      // Use filterByColumn for search functionality
      this.gantt.filterByColumn('taskName', 'contains', searchText);
    }
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    if (this.gantt) {
      this.gantt.clearFiltering();
    }
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    if (this.gantt) {
      this.gantt.zoomIn();
    }
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    if (this.gantt) {
      this.gantt.zoomOut();
    }
  }

  /**
   * Zoom to fit
   */
  zoomToFit(): void {
    if (this.gantt) {
      this.gantt.fitToProject();
    }
  }

  /**
   * Navigate to previous time span
   */
  previousTimeSpan(): void {
    if (this.gantt) {
      this.gantt.previousTimeSpan();
    }
  }

  /**
   * Navigate to next time span
   */
  nextTimeSpan(): void {
    if (this.gantt) {
      this.gantt.nextTimeSpan();
    }
  }

  /**
   * Add new task
   */
  addRecord(data?: GanttTask, rowIndex?: number): void {
    if (this.gantt && this.gantt.editModule) {
      const position = rowIndex !== undefined ? { index: rowIndex } : undefined;
      this.gantt.editModule.addRecord(data as any, position as any);
    }
  }

  /**
   * Update task
   */
  updateRecord(field: string, data: GanttTask, rowIndex: number): void {
    if (this.gantt && this.gantt.editModule) {
      // Update record using edit module
      const rowData = this.gantt.getRowByIndex(rowIndex);
      if (rowData) {
        const updatedData = { ...rowData, ...data };
        // Use updateRecordByID with task ID
        const taskId = (updatedData as any).taskID || (updatedData as any).ganttProperties?.taskId;
        if (taskId) {
          this.gantt.editModule.updateRecordByID(updatedData as any);
        }
      }
    }
  }

  /**
   * Delete task
   */
  deleteRecord(rowIndex: number): void {
    if (this.gantt && this.gantt.editModule) {
      const rowData = this.gantt.getRowByIndex(rowIndex);
      if (rowData) {
        this.gantt.editModule.deleteRecord(rowData as any);
      }
    }
  }

  /**
   * Event handlers
   */
  onActionBegin(event: any): void {
    this.actionBegin.emit(event);
  }

  onActionComplete(event: any): void {
    this.actionComplete.emit(event);
  }

  onCellEdit(event: any): void {
    this.cellEdit.emit(event);
  }

  onTaskbarEdited(event: any): void {
    this.taskbarEdited.emit(event);
  }

  onRowSelected(event: any): void {
    this.rowSelected.emit(event);
  }

  onRowDeselected(event: any): void {
    this.rowDeselected.emit(event);
  }

  onDataBound(event: any): void {
    this.dataBound.emit(event);
  }

  onCreated(event: any): void {
    this.created.emit(event);
  }
}

