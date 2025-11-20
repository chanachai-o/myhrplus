# 📄 Document Editor Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-document-editor`  
**Library**: Syncfusion DocumentEditor

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

`DocumentEditorComponent` เป็น wrapper component สำหรับ Syncfusion DocumentEditor ที่ให้ความสามารถในการแก้ไขเอกสารแบบ Word-like พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Word-like Document Editing
- ✅ Rich Text Formatting
- ✅ Tables, Images, Hyperlinks
- ✅ Headers & Footers
- ✅ Page Setup
- ✅ Spell Check
- ✅ Track Changes
- ✅ Comments
- ✅ Export (Word, PDF, SFDT, Text)
- ✅ Print
- ✅ Search & Replace
- ✅ Navigation Pane
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion DocumentEditor ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-documenteditor": "^29.2.x"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { DocumentEditorComponent } from '../../shared/components/document-editor/document-editor.component';

@Component({
  imports: [DocumentEditorComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-document-editor
  [width]="'100%'"
  [height]="'600px'"
  [enableEditor]="true"
  [showRuler]="true">
</app-document-editor>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  // Component ready to use
}
```

---

## 📋 Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | `string \| number` | `'100%'` | Component width |
| `height` | `string \| number` | `'800px'` | Component height |
| `enableSpellCheck` | `boolean` | `true` | Enable spell check |
| `enableSuggestion` | `boolean` | `true` | Enable suggestions |
| `enableEditor` | `boolean` | `true` | Enable editor |
| `enableEditorHistory` | `boolean` | `true` | Enable undo/redo |
| `enableContextMenu` | `boolean` | `true` | Enable context menu |
| `showRuler` | `boolean` | `true` | Show ruler |
| `zoomFactor` | `number` | `1` | Zoom factor |
| `isReadOnly` | `boolean` | `false` | Read-only mode |
| `enablePrint` | `boolean` | `true` | Enable print |
| `enableWordExport` | `boolean` | `true` | Enable Word export |
| `enablePdfExport` | `boolean` | `true` | Enable PDF export |
| `enableSfdtExport` | `boolean` | `true` | Enable SFDT export |
| `customClass` | `string` | `''` | Custom CSS class |

---

## 🔧 Methods

### `open(document: string): void`
Open document from SFDT format

### `saveAsSfdt(): string`
Save document as SFDT format

### `saveAsBlob(format: 'Docx' | 'Sfdt' | 'Txt' | 'Pdf'): Promise<Blob>`
Save document as Blob

### `export(format: 'Docx' | 'Sfdt' | 'Txt' | 'Pdf', fileName?: string): void`
Export document

### `print(): void`
Print document

### `insertText(text: string): void`
Insert text at cursor

### `insertImage(base64: string): void`
Insert image

### `insertTable(rowCount: number, columnCount: number): void`
Insert table

### `undo(): void`
Undo last action

### `redo(): void`
Redo last action

### `selectAll(): void`
Select all content

### `copy(): void`
Copy selected content

### `cut(): void`
Cut selected content

### `paste(): void`
Paste content

### `find(text: string): boolean`
Find text

### `replace(text: string, replaceText: string): boolean`
Replace text

### `setZoomFactor(factor: number): void`
Set zoom factor

### `focus(): void`
Focus editor

### `refresh(): void`
Refresh editor

### `getDocumentEditorInstance(): SyncfusionDocumentEditorComponent | null`
Get Syncfusion DocumentEditor instance

---

## 🎨 Examples

### Basic Example

```html
<app-document-editor
  [width]="'100%'"
  [height]="'600px'"
  [enableEditor]="true"
  [showRuler]="true">
</app-document-editor>
```

### With Export Functions

```typescript
import { Component, ViewChild } from '@angular/core';
import { DocumentEditorComponent } from '../../shared/components/document-editor/document-editor.component';

@Component({
  selector: 'app-example',
  template: `
    <app-document-editor
      #editor
      [width]="'100%'"
      [height]="'600px'"
      (created)="onCreated($event)">
    </app-document-editor>
    <button (click)="exportAsWord()">Export Word</button>
    <button (click)="exportAsPdf()">Export PDF</button>
  `
})
export class ExampleComponent {
  @ViewChild('editor') editor!: DocumentEditorComponent;

  onCreated(event: any): void {
    // Load sample document
    const sampleSfdt = '...';
    this.editor.open(sampleSfdt);
  }

  exportAsWord(): void {
    this.editor.export('Docx', 'document');
  }

  exportAsPdf(): void {
    this.editor.export('Pdf', 'document');
  }
}
```

### With Zoom Control

```typescript
zoomIn(): void {
  const currentZoom = this.editor.zoomFactor || 1;
  this.editor.setZoomFactor(Math.min(currentZoom + 0.1, 4));
}

zoomOut(): void {
  const currentZoom = this.editor.zoomFactor || 1;
  this.editor.setZoomFactor(Math.max(currentZoom - 0.1, 0.1));
}

resetZoom(): void {
  this.editor.setZoomFactor(1);
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
<app-document-editor
  [width]="'100%'"
  [height]="'600px'"
  customClass="my-custom-editor">
</app-document-editor>
```

---

## 📱 Responsive

Component รองรับ responsive design:
- Mobile: ปรับ toolbar และ spacing
- Tablet: ปรับขนาด
- Desktop: Full features

---

## 🔗 Related Documentation

- [DOCUMENT_EDITOR_COMPONENT_SUMMARY.md](./DOCUMENT_EDITOR_COMPONENT_SUMMARY.md) - สรุปการสร้าง
- [Syncfusion DocumentEditor Documentation](https://ej2.syncfusion.com/angular/documentation/document-editor/getting-started/)
- [Rich Text Editor Component](./rich-text-editor/README.md)
- [Data Grid Component](./data-grid/README.md)

---

**Maintainer**: Development Team  
**Last Updated**: 2024-12-20  
**Version**: 1.0.0

