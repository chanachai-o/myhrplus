# 📊 Spreadsheet Component Summary

**Component**: `app-spreadsheet`  
**Library**: Syncfusion Spreadsheet  
**Type**: Standalone Component

---

## 🎯 Overview

`SpreadsheetComponent` เป็น wrapper component สำหรับ Syncfusion Spreadsheet ที่ให้ความสามารถในการจัดการข้อมูลแบบ Excel-like พร้อม features ครบถ้วน

---

## ✨ Key Features

- ✅ Excel-like editing and formatting
- ✅ Formula support (SUM, AVERAGE, COUNT, etc.)
- ✅ Charts and graphs
- ✅ Conditional formatting
- ✅ Data validation
- ✅ Cell merging and freezing
- ✅ Sorting and filtering
- ✅ Find and replace
- ✅ Undo/Redo functionality
- ✅ Multiple sheets support
- ✅ Hyperlinks and images
- ✅ Import/Export (Excel, CSV, PDF)
- ✅ Ribbon UI with formula bar
- ✅ Glass Morphism styling
- ✅ Dark Mode support

---

## 🚀 Quick Start

### Installation

Component ใช้ Syncfusion Spreadsheet ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-spreadsheet": "^29.2.x"
```

### Basic Usage

```html
<app-spreadsheet
  [sheets]="sheets"
  [height]="'600px'"
  [width]="'100%'">
</app-spreadsheet>
```

```typescript
import { SpreadsheetComponent } from '../../shared/components/spreadsheet/spreadsheet.component';

export class ExampleComponent {
  sheets: any[] = [
    {
      name: 'Sheet1',
      ranges: [{
        dataSource: [
          { 'Item': 'Product A', 'Qty': 10, 'Price': 20 },
          { 'Item': 'Product B', 'Qty': 15, 'Price': 30 }
        ]
      }]
    }
  ];
}
```

---

## 📋 Main Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `sheets` | `any[]` | `[]` | Sheet configurations |
| `allowOpen` | `boolean` | `true` | Enable file open |
| `allowSave` | `boolean` | `true` | Enable file save |
| `allowEditing` | `boolean` | `true` | Enable editing |
| `allowFormulaBar` | `boolean` | `true` | Show formula bar |
| `showRibbon` | `boolean` | `true` | Show ribbon UI |
| `height` | `string \| number` | `'600px'` | Component height |
| `width` | `string \| number` | `'100%'` | Component width |

---

## 🔧 Main Methods

| Method | Description |
|--------|-------------|
| `open(file)` | Open spreadsheet file |
| `saveAsExcel(fileName?)` | Save as Excel |
| `saveAsCsv(fileName?)` | Save as CSV |
| `saveAsPdf(fileName?)` | Save as PDF |
| `insertRow(index, count?)` | Insert row(s) |
| `insertColumn(index, count?)` | Insert column(s) |
| `undo()` | Undo last action |
| `redo()` | Redo last undone action |
| `cut()` | Cut selected cells |
| `copy()` | Copy selected cells |
| `paste()` | Paste from clipboard |
| `find(text)` | Find text |
| `replace(text, replaceText)` | Replace text |
| `sort(range, options)` | Sort data |
| `applyFilter(range)` | Apply filter |
| `merge(range)` | Merge cells |
| `freeze(row, col)` | Freeze panes |
| `addSheet(name?)` | Add new sheet |
| `goToCell(address)` | Navigate to cell |
| `getCellValue(address)` | Get cell value |
| `setCellValue(address, value)` | Set cell value |

---

## 📤 Main Events

| Event | Description |
|-------|-------------|
| `created` | Emitted when spreadsheet is created |
| `cellEdit` | Emitted when cell is edited |
| `cellSave` | Emitted when cell is saved |
| `beforeOpen` | Emitted before file is opened |
| `openComplete` | Emitted when file open is complete |
| `beforeSave` | Emitted before file is saved |
| `saveComplete` | Emitted when file save is complete |
| `actionBegin` | Emitted when action begins |
| `actionComplete` | Emitted when action completes |

---

## 💡 Common Use Cases

### 1. Basic Spreadsheet with Data

```html
<app-spreadsheet
  #spreadsheet
  [sheets]="sheets">
</app-spreadsheet>
```

### 2. Export to Excel

```typescript
@ViewChild('spreadsheet') spreadsheet!: SpreadsheetComponent;

exportToExcel(): void {
  this.spreadsheet.saveAsExcel('MySpreadsheet');
}
```

### 3. Import File

```typescript
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.spreadsheet.open(file);
  }
}
```

### 4. Multiple Sheets

```typescript
sheets: any[] = [
  { name: 'Sheet1', ranges: [{ dataSource: data1 }] },
  { name: 'Sheet2', ranges: [{ dataSource: data2 }] }
];
```

### 5. Programmatic Control

```typescript
insertData(): void {
  this.spreadsheet.insertRow(1);
  this.spreadsheet.setCellValue('A1', 'New Data');
}

formatCells(): void {
  this.spreadsheet.merge('A1:B1');
  this.spreadsheet.freeze(1, 0);
}
```

---

## 🎨 Styling

Component ใช้ Glass Morphism styling โดยอัตโนมัติและรองรับ Dark Mode

```scss
.spreadsheet-container {
  ::ng-deep {
    .e-spreadsheet {
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 0.5rem;
    }
  }
}
```

---

## 📝 Notes

- Spreadsheet component ต้องการ Syncfusion Spreadsheet module
- PDF export อาจต้องใช้ server-side conversion
- Formula support ขึ้นอยู่กับ Syncfusion Spreadsheet engine
- Charts และ conditional formatting ต้อง enable features ที่เกี่ยวข้อง

---

## 🔗 Related Components

- `DataGridComponent` - สำหรับแสดงข้อมูลแบบตาราง
- `TreeGridComponent` - สำหรับแสดงข้อมูลแบบ hierarchical
- `PivotTableComponent` - สำหรับวิเคราะห์ข้อมูลแบบ pivot

---

**Last Updated**: 2024-12-20

