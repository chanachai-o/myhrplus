# 🌳 Tree Grid Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-tree-grid`  
**Library**: Syncfusion TreeGrid

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

`TreeGridComponent` เป็น wrapper component สำหรับ Syncfusion TreeGrid ที่ให้ความสามารถในการแสดงข้อมูลแบบ hierarchical tree structure พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Hierarchical Data Display
- ✅ Expand/Collapse Rows
- ✅ Paging
- ✅ Sorting
- ✅ Filtering
- ✅ Searching
- ✅ Selection (Single/Multiple)
- ✅ Resizing Columns
- ✅ Reordering Columns
- ✅ Editing (Inline/Row)
- ✅ Excel Export
- ✅ PDF Export
- ✅ CSV Export
- ✅ Column Chooser
- ✅ Virtual Scrolling
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion TreeGrid ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-treegrid": "^29.2.8"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { TreeGridComponent } from '../../shared/components/tree-grid/tree-grid.component';

@Component({
  imports: [TreeGridComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-tree-grid
  [dataSource]="dataSource"
  [columns]="columns"
  [childMapping]="'subtasks'">
</app-tree-grid>
```

```typescript
import { Component } from '@angular/core';
import { TreeGridColumn } from '../../shared/components/tree-grid/tree-grid.component';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  columns: TreeGridColumn[] = [
    { field: 'taskID', headerText: 'Task ID', width: 90, isPrimaryKey: true },
    { field: 'taskName', headerText: 'Task Name', width: 200 },
    { field: 'startDate', headerText: 'Start Date', width: 120, format: 'yMd', type: 'date' }
  ];

  dataSource: any[] = [
    {
      taskID: 1,
      taskName: 'Parent Task',
      subtasks: [
        { taskID: 2, taskName: 'Child Task 1' },
        { taskID: 3, taskName: 'Child Task 2' }
      ]
    }
  ];
}
```

---

## 📋 Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dataSource` | `any[]` | `[]` | Data source array |
| `columns` | `TreeGridColumn[]` | `[]` | Column definitions |
| `childMapping` | `string` | `'subtasks'` | Child property name |
| `hasChildMapping` | `string` | `undefined` | Has child property name |
| `idMapping` | `string` | `undefined` | ID property name |
| `parentIdMapping` | `string` | `undefined` | Parent ID property name |
| `allowPaging` | `boolean` | `true` | Enable paging |
| `allowSorting` | `boolean` | `true` | Enable sorting |
| `allowFiltering` | `boolean` | `true` | Enable filtering |
| `allowSearching` | `boolean` | `true` | Enable searching |
| `allowSelection` | `boolean` | `true` | Enable selection |
| `allowResizing` | `boolean` | `true` | Enable column resizing |
| `allowReordering` | `boolean` | `true` | Enable column reordering |
| `allowEditing` | `boolean` | `false` | Enable editing |
| `allowExcelExport` | `boolean` | `true` | Enable Excel export |
| `allowPdfExport` | `boolean` | `true` | Enable PDF export |
| `showColumnChooser` | `boolean` | `true` | Show column chooser |
| `enableVirtualization` | `boolean` | `false` | Enable virtualization |
| `pageSettings` | `any` | `{...}` | Page settings |
| `selectionSettings` | `any` | `{...}` | Selection settings |
| `editSettings` | `any` | `{...}` | Edit settings |
| `toolbar` | `any[]` | `[...]` | Toolbar items |
| `height` | `string \| number` | `'400px'` | Grid height |
| `width` | `string \| number` | `'100%'` | Grid width |
| `customClass` | `string` | `''` | Custom CSS class |

---

## 🔧 Methods

### `refresh(): void`
Refresh grid

### `getSelectedRows(): any[]`
Get selected rows data

### `selectRow(index: number): void`
Select row by index

### `clearSelection(): void`
Clear selection

### `expandAll(): void`
Expand all rows

### `collapseAll(): void`
Collapse all rows

### `expandRow(index: number): void`
Expand row by index

### `collapseRow(index: number): void`
Collapse row by index

### `exportToExcel(fileName?: string): void`
Export to Excel

### `exportToPdf(fileName?: string): void`
Export to PDF

### `exportToCsv(fileName?: string): void`
Export to CSV

### `search(searchText: string): void`
Search in grid

### `clearSearch(): void`
Clear search

### `getTreeGridInstance(): TreeGridComponent | null`
Get Syncfusion TreeGrid instance

---

## 🎨 Examples

### Basic Example

```html
<app-tree-grid
  [dataSource]="dataSource"
  [columns]="columns"
  [childMapping]="'subtasks'">
</app-tree-grid>
```

### With Expand/Collapse

```typescript
import { Component, ViewChild } from '@angular/core';
import { TreeGridComponent } from '../../shared/components/tree-grid/tree-grid.component';

@Component({
  selector: 'app-example',
  template: `
    <app-tree-grid
      #treegrid
      [dataSource]="dataSource"
      [columns]="columns"
      [childMapping]="'subtasks'">
    </app-tree-grid>
    <button (click)="expandAll()">Expand All</button>
    <button (click)="collapseAll()">Collapse All</button>
  `
})
export class ExampleComponent {
  @ViewChild('treegrid') treegrid!: TreeGridComponent;

  expandAll(): void {
    this.treegrid.expandAll();
  }

  collapseAll(): void {
    this.treegrid.collapseAll();
  }
}
```

### With Export

```typescript
exportToExcel(): void {
  this.treegrid.exportToExcel('treegrid');
}

exportToPdf(): void {
  this.treegrid.exportToPdf('treegrid');
}

exportToCsv(): void {
  this.treegrid.exportToCsv('treegrid');
}
```

### With Selection

```typescript
getSelectedRows(): void {
  const selected = this.treegrid.getSelectedRows();
  console.log('Selected rows:', selected);
}
```

### With Search

```typescript
search(searchText: string): void {
  this.treegrid.search(searchText);
}

clearSearch(): void {
  this.treegrid.clearSearch();
}
```

---

## 🎨 Styling

### Glass Morphism
Component ใช้ Glass Morphism styling โดยอัตโนมัติ:
- Light mode: `@include glass-morphism('weak', 'light')`
- Dark mode: `@include glass-morphism('weak', 'dark')`
- Gemini theme: `@include glass-gemini('weak')`

### Custom Styling
```html
<app-tree-grid
  [dataSource]="dataSource"
  [columns]="columns"
  [childMapping]="'subtasks'"
  customClass="my-custom-grid">
</app-tree-grid>
```

---

## 📱 Responsive

Component รองรับ responsive design:
- Mobile: ปรับ toolbar และ column width
- Tablet: ปรับ layout
- Desktop: Full features

---

## 🔗 Related Documentation

- [TREE_GRID_COMPONENT_SUMMARY.md](./TREE_GRID_COMPONENT_SUMMARY.md) - สรุปการสร้าง
- [Syncfusion TreeGrid Documentation](https://ej2.syncfusion.com/angular/documentation/treegrid/getting-started/)
- [Data Grid Component](./data-grid/README.md)
- [Pivot Table Component](./pivot-table/README.md)

---

**Maintainer**: Development Team  
**Last Updated**: 2024-12-20  
**Version**: 1.0.0

