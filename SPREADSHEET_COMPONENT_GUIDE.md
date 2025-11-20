# 📊 Spreadsheet Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-spreadsheet`  
**Library**: Syncfusion Spreadsheet

---

## 📋 สารบัญ

1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Styling](#styling)

---

## 🎯 Overview

`SpreadsheetComponent` เป็น wrapper component สำหรับ Syncfusion Spreadsheet ที่ให้ความสามารถในการจัดการข้อมูลแบบ Excel-like พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Excel-like Editing
- ✅ Formula Support (SUM, AVERAGE, COUNT, etc.)
- ✅ Charts and Graphs
- ✅ Conditional Formatting
- ✅ Data Validation
- ✅ Cell Merging
- ✅ Freeze Panes
- ✅ Sorting & Filtering
- ✅ Find & Replace
- ✅ Undo/Redo
- ✅ Multiple Sheets
- ✅ Hyperlinks & Images
- ✅ Import/Export (Excel, CSV, PDF)
- ✅ Ribbon UI
- ✅ Formula Bar
- ✅ Status Bar
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion Spreadsheet ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-spreadsheet": "^29.2.x"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { SpreadsheetComponent } from '../../shared/components/spreadsheet/spreadsheet.component';

@Component({
  imports: [SpreadsheetComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-spreadsheet
  [sheets]="sheets"
  [height]="'600px'"
  [width]="'100%'">
</app-spreadsheet>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  sheets: any[] = [
    {
      name: 'Sheet1',
      ranges: [{
        dataSource: [
          { 'Item Name': 'Casual Shoes', 'Quantity': 10, 'Price': 20, 'Amount': 200 },
          { 'Item Name': 'Sports Shoes', 'Quantity': 20, 'Price': 30, 'Amount': 600 }
        ]
      }]
    }
  ];
}
```

---

## ⚙️ Configuration

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sheets` | `any[]` | `[]` | Array of sheet configurations |
| `dataSource` | `any` | `undefined` | Default data source for sheets |
| `allowOpen` | `boolean` | `true` | Enable file open functionality |
| `allowSave` | `boolean` | `true` | Enable file save functionality |
| `allowEditing` | `boolean` | `true` | Enable cell editing |
| `allowInsert` | `boolean` | `true` | Enable row/column insertion |
| `allowDelete` | `boolean` | `true` | Enable row/column deletion |
| `allowFormatting` | `boolean` | `true` | Enable cell formatting |
| `allowUndoRedo` | `boolean` | `true` | Enable undo/redo functionality |
| `allowFindAndReplace` | `boolean` | `true` | Enable find and replace |
| `allowSorting` | `boolean` | `true` | Enable sorting |
| `allowFiltering` | `boolean` | `true` | Enable filtering |
| `allowResizing` | `boolean` | `true` | Enable column/row resizing |
| `allowFreezing` | `boolean` | `true` | Enable freeze panes |
| `allowMerging` | `boolean` | `true` | Enable cell merging |
| `allowHyperlink` | `boolean` | `true` | Enable hyperlinks |
| `allowChart` | `boolean` | `true` | Enable charts |
| `allowImage` | `boolean` | `true` | Enable images |
| `allowConditionalFormat` | `boolean` | `true` | Enable conditional formatting |
| `allowDataValidation` | `boolean` | `true` | Enable data validation |
| `allowFormulaBar` | `boolean` | `true` | Show formula bar |
| `showSheetTabs` | `boolean` | `true` | Show sheet tabs |
| `showRibbon` | `boolean` | `true` | Show ribbon UI |
| `showFormulaBar` | `boolean` | `true` | Show formula bar |
| `showStatusBar` | `boolean` | `true` | Show status bar |
| `height` | `string \| number` | `'600px'` | Component height |
| `width` | `string \| number` | `'100%'` | Component width |
| `customClass` | `string` | `undefined` | Custom CSS class |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `created` | `EventEmitter<any>` | Emitted when spreadsheet is created |
| `cellEdit` | `EventEmitter<any>` | Emitted when cell is edited |
| `cellSave` | `EventEmitter<any>` | Emitted when cell is saved |
| `beforeOpen` | `EventEmitter<any>` | Emitted before file is opened |
| `openComplete` | `EventEmitter<any>` | Emitted when file open is complete |
| `beforeSave` | `EventEmitter<any>` | Emitted before file is saved |
| `saveComplete` | `EventEmitter<any>` | Emitted when file save is complete |
| `actionBegin` | `EventEmitter<any>` | Emitted when action begins |
| `actionComplete` | `EventEmitter<any>` | Emitted when action completes |

---

## 📚 API Reference

### Methods

#### `getSpreadsheetInstance(): SyncfusionSpreadsheetComponent | null`
Get the underlying Syncfusion Spreadsheet instance.

#### `open(file: File | Blob | string): void`
Open a spreadsheet file.

#### `saveAsExcel(fileName?: string): void`
Save spreadsheet as Excel file (.xlsx).

#### `saveAsCsv(fileName?: string): void`
Save spreadsheet as CSV file (.csv).

#### `saveAsPdf(fileName?: string): void`
Save spreadsheet as PDF file (.pdf).

#### `insertRow(index: number, count?: number): void`
Insert row(s) at specified index.

#### `insertColumn(index: number, count?: number): void`
Insert column(s) at specified index.

#### `deleteRow(index: number, count?: number): void`
Delete row(s) at specified index.

#### `deleteColumn(index: number, count?: number): void`
Delete column(s) at specified index.

#### `undo(): void`
Undo last action.

#### `redo(): void`
Redo last undone action.

#### `cut(): void`
Cut selected cells.

#### `copy(): void`
Copy selected cells.

#### `paste(): void`
Paste from clipboard.

#### `find(text: string): void`
Find text in spreadsheet.

#### `replace(text: string, replaceText: string): void`
Replace text in spreadsheet.

#### `sort(range: string, sortOptions: any): void`
Sort data in specified range.

#### `applyFilter(range: string): void`
Apply filter to specified range.

#### `clearFilter(): void`
Clear all filters.

#### `merge(range: string): void`
Merge cells in specified range.

#### `unmerge(range: string): void`
Unmerge cells in specified range.

#### `freeze(row: number, col: number): void`
Freeze panes at specified row and column.

#### `unfreeze(): void`
Unfreeze all panes.

#### `addSheet(sheetName?: string): void`
Add new sheet.

#### `deleteSheet(sheetIndex: number): void`
Delete sheet at specified index.

#### `goToCell(address: string): void`
Navigate to specified cell address.

#### `selectRange(range: string): void`
Select specified range.

#### `getCellValue(address: string): any`
Get cell value at specified address.

#### `setCellValue(address: string, value: any): void`
Set cell value at specified address.

#### `getUsedRange(): any`
Get used range of current sheet.

#### `refresh(): void`
Refresh spreadsheet.

---

## 💡 Examples

### Basic Spreadsheet with Data

```html
<app-spreadsheet
  #spreadsheet
  [sheets]="sheets"
  [height]="'500px'">
</app-spreadsheet>
```

```typescript
export class ExampleComponent {
  sheets: any[] = [
    {
      name: 'Sales Data',
      ranges: [{
        dataSource: [
          { 'Item': 'Product A', 'Qty': 10, 'Price': 20, 'Total': 200 },
          { 'Item': 'Product B', 'Qty': 15, 'Price': 30, 'Total': 450 }
        ]
      }]
    }
  ];
}
```

### Spreadsheet with Formulas

```html
<app-spreadsheet
  #spreadsheet
  [sheets]="sheets"
  [allowFormulaBar]="true"
  [showFormulaBar]="true">
</app-spreadsheet>
```

```typescript
export class ExampleComponent {
  sheets: any[] = [
    {
      name: 'Calculations',
      rows: [
        { cells: [{ value: '10' }, { value: '20' }, { value: '=A1*B1' }] }
      ]
    }
  ];
}
```

### Spreadsheet with Charts

```html
<app-spreadsheet
  #spreadsheet
  [sheets]="sheets"
  [allowChart]="true">
</app-spreadsheet>
```

### Spreadsheet with Conditional Formatting

```html
<app-spreadsheet
  #spreadsheet
  [sheets]="sheets"
  [allowConditionalFormat]="true">
</app-spreadsheet>
```

### Spreadsheet with Multiple Sheets

```html
<app-spreadsheet
  #spreadsheet
  [sheets]="sheets"
  [showSheetTabs]="true">
</app-spreadsheet>
```

```typescript
export class ExampleComponent {
  sheets: any[] = [
    { name: 'Sheet1', ranges: [{ dataSource: data1 }] },
    { name: 'Sheet2', ranges: [{ dataSource: data2 }] },
    { name: 'Sheet3', ranges: [{ dataSource: data3 }] }
  ];
}
```

### Export to Excel

```typescript
export class ExampleComponent {
  @ViewChild('spreadsheet') spreadsheet!: SpreadsheetComponent;

  exportToExcel(): void {
    this.spreadsheet.saveAsExcel('MySpreadsheet');
  }
}
```

### Import File

```typescript
export class ExampleComponent {
  @ViewChild('spreadsheet') spreadsheet!: SpreadsheetComponent;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.spreadsheet.open(file);
    }
  }
}
```

---

## 🎨 Styling

### Glass Morphism

Component ใช้ Glass Morphism styling โดยอัตโนมัติ:

```scss
.spreadsheet-container {
  ::ng-deep {
    .e-spreadsheet {
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 0.5rem;
    }

    .e-spreadsheet-ribbon {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
  }
}
```

### Dark Mode

Component รองรับ Dark Mode โดยอัตโนมัติ:

```scss
:host-context(.dark) {
  .spreadsheet-container {
    ::ng-deep {
      .e-spreadsheet {
        border-color: rgba(148, 163, 184, 0.3);
      }
    }
  }
}
```

### Custom Styling

คุณสามารถ override styles ได้โดยใช้ `::ng-deep`:

```scss
::ng-deep {
  .e-spreadsheet {
    // Custom styles
  }
}
```

---

## 🔧 Advanced Usage

### Event Handling

```typescript
export class ExampleComponent {
  onCellEdit(event: any): void {
    console.log('Cell edited:', event);
  }

  onSaveComplete(event: any): void {
    console.log('Save complete:', event);
  }
}
```

```html
<app-spreadsheet
  (cellEdit)="onCellEdit($event)"
  (saveComplete)="onSaveComplete($event)">
</app-spreadsheet>
```

### Programmatic Control

```typescript
export class ExampleComponent {
  @ViewChild('spreadsheet') spreadsheet!: SpreadsheetComponent;

  insertData(): void {
    this.spreadsheet.insertRow(1);
    this.spreadsheet.setCellValue('A1', 'New Data');
  }

  formatCells(): void {
    this.spreadsheet.merge('A1:B1');
    this.spreadsheet.freeze(1, 0);
  }
}
```

---

## 📝 Notes

- Spreadsheet component ต้องการ Syncfusion Spreadsheet module ที่ติดตั้งแล้ว
- PDF export อาจต้องใช้ server-side conversion สำหรับบางกรณี
- Formula support ขึ้นอยู่กับ Syncfusion Spreadsheet engine
- Charts และ conditional formatting ต้อง enable features ที่เกี่ยวข้อง

---

## 🔗 Related Documentation

- [Syncfusion Spreadsheet Documentation](https://ej2.syncfusion.com/angular/documentation/spreadsheet/getting-started/)
- [Syncfusion Spreadsheet API Reference](https://ej2.syncfusion.com/angular/documentation/api/spreadsheet/)

---

**Last Updated**: 2024-12-20

