import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpreadsheetModule } from '@syncfusion/ej2-angular-spreadsheet';
import {
  SpreadsheetComponent as SyncfusionSpreadsheetComponent
} from '@syncfusion/ej2-angular-spreadsheet';

export interface SpreadsheetConfig {
  sheets?: any[];
  allowOpen?: boolean;
  allowSave?: boolean;
  allowEditing?: boolean;
  allowInsert?: boolean;
  allowDelete?: boolean;
  allowFormatting?: boolean;
  allowUndoRedo?: boolean;
  allowFindAndReplace?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowResizing?: boolean;
  allowFreezing?: boolean;
  allowMerging?: boolean;
  allowHyperlink?: boolean;
  allowChart?: boolean;
  allowImage?: boolean;
  allowConditionalFormat?: boolean;
  allowDataValidation?: boolean;
  allowFormulaBar?: boolean;
  showSheetTabs?: boolean;
  showRibbon?: boolean;
  showFormulaBar?: boolean;
  showStatusBar?: boolean;
  height?: string | number;
  width?: string | number;
  customClass?: string;
}

@Component({
  selector: 'app-spreadsheet',
  standalone: true,
  imports: [CommonModule, SpreadsheetModule],
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.scss']
})
export class SpreadsheetComponent implements OnInit, OnDestroy {
  @ViewChild('spreadsheet', { static: false }) spreadsheet!: SyncfusionSpreadsheetComponent;

  // Data
  @Input() sheets: any[] = [];
  @Input() dataSource?: any;

  // Features
  @Input() allowOpen: boolean = true;
  @Input() allowSave: boolean = true;
  @Input() allowEditing: boolean = true;
  @Input() allowInsert: boolean = true;
  @Input() allowDelete: boolean = true;
  // Note: allowFormatting, allowFreezing, allowMerging, allowFormulaBar, showStatusBar
  // are controlled via ribbon UI and not direct input properties
  @Input() allowUndoRedo: boolean = true;
  @Input() allowFindAndReplace: boolean = true;
  @Input() allowSorting: boolean = true;
  @Input() allowFiltering: boolean = true;
  @Input() allowResizing: boolean = true;
  @Input() allowHyperlink: boolean = true;
  @Input() allowChart: boolean = true;
  @Input() allowImage: boolean = true;
  @Input() allowConditionalFormat: boolean = true;
  @Input() allowDataValidation: boolean = true;
  @Input() showSheetTabs: boolean = true;
  @Input() showRibbon: boolean = true;
  @Input() showFormulaBar: boolean = true;

  // Size
  @Input() height: string | number = '600px';
  @Input() width: string | number = '100%';
  @Input() customClass?: string;

  // Events
  @Output() created = new EventEmitter<any>();
  @Output() cellEdit = new EventEmitter<any>();
  @Output() cellSave = new EventEmitter<any>();
  @Output() beforeOpen = new EventEmitter<any>();
  @Output() openComplete = new EventEmitter<any>();
  @Output() beforeSave = new EventEmitter<any>();
  @Output() saveComplete = new EventEmitter<any>();
  @Output() actionBegin = new EventEmitter<any>();
  @Output() actionComplete = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize default sheet if no sheets provided
    if (!this.sheets || this.sheets.length === 0) {
      this.sheets = [{
        name: 'Sheet1',
        ranges: [{ dataSource: this.dataSource || [] }]
      }];
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get spreadsheet instance
   */
  getSpreadsheetInstance(): SyncfusionSpreadsheetComponent | null {
    return this.spreadsheet || null;
  }

  /**
   * Open file
   */
  open(file: File | Blob | string): void {
    if (this.spreadsheet) {
      if (typeof file === 'string') {
        // If string, treat as file path or URL
        (this.spreadsheet as any).open({ file: file });
      } else {
        // If File or Blob, use directly
        (this.spreadsheet as any).open({ file: file });
      }
    }
  }

  /**
   * Save as Excel
   */
  saveAsExcel(fileName?: string): void {
    if (this.spreadsheet) {
      const saveOptions: any = {
        fileName: fileName || 'Spreadsheet',
        saveType: 'Xlsx' as any
      };
      this.spreadsheet.save(saveOptions);
    }
  }

  /**
   * Save as CSV
   */
  saveAsCsv(fileName?: string): void {
    if (this.spreadsheet) {
      const saveOptions: any = {
        fileName: fileName || 'Spreadsheet',
        saveType: 'Csv' as any
      };
      this.spreadsheet.save(saveOptions);
    }
  }

  /**
   * Save as PDF
   */
  saveAsPdf(fileName?: string): void {
    if (this.spreadsheet) {
      const saveOptions: any = {
        fileName: fileName || 'Spreadsheet',
        saveType: 'Pdf' as any
      };
      this.spreadsheet.save(saveOptions);
    }
  }

  /**
   * Insert row
   */
  insertRow(index: number, count: number = 1): void {
    if (this.spreadsheet) {
      this.spreadsheet.insertRow(index, count);
    }
  }

  /**
   * Insert column
   */
  insertColumn(index: number, count: number = 1): void {
    if (this.spreadsheet) {
      this.spreadsheet.insertColumn(index, count);
    }
  }

  /**
   * Delete row
   */
  deleteRow(index: number, count: number = 1): void {
    if (this.spreadsheet) {
      // Use delete method with row model
      (this.spreadsheet as any).delete(index, index + count - 1, 'Row');
    }
  }

  /**
   * Delete column
   */
  deleteColumn(index: number, count: number = 1): void {
    if (this.spreadsheet) {
      // Use delete method with column model
      (this.spreadsheet as any).delete(index, index + count - 1, 'Column');
    }
  }

  /**
   * Undo
   */
  undo(): void {
    if (this.spreadsheet) {
      this.spreadsheet.undo();
    }
  }

  /**
   * Redo
   */
  redo(): void {
    if (this.spreadsheet) {
      this.spreadsheet.redo();
    }
  }

  /**
   * Cut
   */
  cut(): void {
    if (this.spreadsheet) {
      this.spreadsheet.cut();
    }
  }

  /**
   * Copy
   */
  copy(): void {
    if (this.spreadsheet) {
      this.spreadsheet.copy();
    }
  }

  /**
   * Paste
   */
  paste(): void {
    if (this.spreadsheet) {
      this.spreadsheet.paste();
    }
  }

  /**
   * Find
   */
  find(text: string): void {
    if (this.spreadsheet) {
      (this.spreadsheet as any).find(text);
    }
  }

  /**
   * Replace
   */
  replace(text: string, replaceText: string): void {
    if (this.spreadsheet) {
      (this.spreadsheet as any).replace(text, replaceText);
    }
  }

  /**
   * Sort
   */
  sort(range: string, sortOptions: any): void {
    if (this.spreadsheet) {
      // Use sort method with proper options
      (this.spreadsheet as any).sort(sortOptions || {}, range);
    }
  }

  /**
   * Filter
   */
  applyFilter(range: string): void {
    if (this.spreadsheet) {
      // Apply filter using range
      (this.spreadsheet as any).applyFilter([], range);
    }
  }

  /**
   * Clear filter
   */
  clearFilter(): void {
    if (this.spreadsheet) {
      this.spreadsheet.clearFilter();
    }
  }

  /**
   * Merge cells
   */
  merge(range: string): void {
    if (this.spreadsheet) {
      this.spreadsheet.merge(range);
    }
  }

  /**
   * Unmerge cells
   */
  unmerge(range: string): void {
    if (this.spreadsheet) {
      this.spreadsheet.unMerge(range);
    }
  }

  /**
   * Freeze panes
   */
  freeze(row: number, col: number): void {
    if (this.spreadsheet) {
      // Use public method or type assertion
      (this.spreadsheet as any).freezePanes(row, col);
    }
  }

  /**
   * Unfreeze panes
   */
  unfreeze(): void {
    if (this.spreadsheet) {
      this.spreadsheet.Unfreeze();
    }
  }

  /**
   * Add sheet
   */
  addSheet(sheetName?: string): void {
    if (this.spreadsheet) {
      this.spreadsheet.insertSheet([{ name: sheetName || `Sheet${this.sheets.length + 1}` }]);
    }
  }

  /**
   * Delete sheet
   */
  deleteSheet(sheetIndex: number): void {
    if (this.spreadsheet) {
      // Use removeSheet method
      (this.spreadsheet as any).removeSheet([sheetIndex]);
    }
  }

  /**
   * Go to cell
   */
  goToCell(address: string): void {
    if (this.spreadsheet) {
      this.spreadsheet.goTo(address);
    }
  }

  /**
   * Select range
   */
  selectRange(range: string): void {
    if (this.spreadsheet) {
      this.spreadsheet.selectRange(range);
    }
  }

  /**
   * Get cell value
   */
  getCellValue(address: string): any {
    if (this.spreadsheet) {
      // Parse address to row and column indices
      const match = address.match(/([A-Z]+)(\d+)/);
      if (match) {
        const colStr = match[1];
        const rowIndex = parseInt(match[2], 10) - 1;
        let colIndex = 0;
        for (let i = 0; i < colStr.length; i++) {
          colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 64);
        }
        colIndex -= 1;
        const cell = this.spreadsheet.getCell(rowIndex, colIndex);
        if (cell) {
          // Get value from cell element or use type assertion
          return (cell as any).value || (cell as HTMLElement).textContent || null;
        }
      }
    }
    return null;
  }

  /**
   * Set cell value
   */
  setCellValue(address: string, value: any): void {
    if (this.spreadsheet) {
      this.spreadsheet.updateCell({ value: value }, address);
    }
  }

  /**
   * Get used range
   */
  getUsedRange(): any {
    if (this.spreadsheet) {
      // Get used range from active sheet
      const activeSheet = (this.spreadsheet as any).activeSheetIndex || 0;
      const sheet = (this.spreadsheet as any).sheets[activeSheet];
      if (sheet) {
        return {
          rowIndex: sheet.usedRange?.rowIndex || 0,
          colIndex: sheet.usedRange?.colIndex || 0,
          rowCount: sheet.usedRange?.rowCount || 0,
          colCount: sheet.usedRange?.colCount || 0
        };
      }
    }
    return null;
  }

  /**
   * Refresh
   */
  refresh(): void {
    if (this.spreadsheet) {
      this.spreadsheet.dataBind();
    }
  }

  /**
   * Event handlers
   */
  onCreated(event: any): void {
    this.created.emit(event);
  }

  onCellEdit(event: any): void {
    this.cellEdit.emit(event);
  }

  onCellSave(event: any): void {
    this.cellSave.emit(event);
  }

  onBeforeOpen(event: any): void {
    this.beforeOpen.emit(event);
  }

  onOpenComplete(event: any): void {
    this.openComplete.emit(event);
  }

  onBeforeSave(event: any): void {
    this.beforeSave.emit(event);
  }

  onSaveComplete(event: any): void {
    this.saveComplete.emit(event);
  }

  onActionBegin(event: any): void {
    this.actionBegin.emit(event);
  }

  onActionComplete(event: any): void {
    this.actionComplete.emit(event);
  }
}

