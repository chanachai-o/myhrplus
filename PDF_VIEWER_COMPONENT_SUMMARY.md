# 📄 PDF Viewer Component Summary

**Component**: `app-pdf-viewer`  
**Library**: Syncfusion PdfViewer  
**Type**: Standalone Component

---

## 🎯 Overview

`PdfViewerComponent` เป็น wrapper component สำหรับ Syncfusion PdfViewer ที่ให้ความสามารถในการดูและจัดการไฟล์ PDF พร้อม features ครบถ้วน

---

## ✨ Key Features

- ✅ PDF document viewing and navigation
- ✅ Text search and selection
- ✅ Zoom in/out and fit to page/width
- ✅ Print and download
- ✅ Annotations (sticky notes, text markup, shapes, stamps)
- ✅ Form field filling
- ✅ Digital signatures
- ✅ Measurement tools
- ✅ Thumbnail and bookmark navigation
- ✅ Hyperlink support
- ✅ Hand tool for panning
- ✅ Glass Morphism styling
- ✅ Dark Mode support

---

## 🚀 Quick Start

### Installation

Component ใช้ Syncfusion PdfViewer ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-pdfviewer": "^29.2.11"
```

### Basic Usage

```html
<app-pdf-viewer
  [documentPath]="documentPath"
  [height]="'800px'"
  [width]="'100%'">
</app-pdf-viewer>
```

```typescript
import { PdfViewerComponent } from '../../shared/components/pdf-viewer/pdf-viewer.component';

export class ExampleComponent {
  documentPath: string = 'https://example.com/document.pdf';
  serviceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
}
```

---

## 📋 Main Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `documentPath` | `string` | `''` | Path to PDF document |
| `serviceUrl` | `string` | `undefined` | Service URL for PDF processing |
| `enableToolbar` | `boolean` | `true` | Enable toolbar |
| `enableNavigation` | `boolean` | `true` | Enable navigation |
| `enableTextSearch` | `boolean` | `true` | Enable text search |
| `enablePrint` | `boolean` | `true` | Enable print |
| `enableDownload` | `boolean` | `true` | Enable download |
| `enableAnnotations` | `boolean` | `true` | Enable annotations |
| `isReadOnly` | `boolean` | `false` | Read-only mode |
| `height` | `string \| number` | `'800px'` | Component height |
| `width` | `string \| number` | `'100%'` | Component width |

---

## 🔧 Main Methods

| Method | Description |
|--------|-------------|
| `loadDocument(path)` | Load PDF document |
| `print()` | Print PDF |
| `download()` | Download PDF |
| `goToPage(number)` | Navigate to page |
| `firstPage()` | Go to first page |
| `lastPage()` | Go to last page |
| `previousPage()` | Go to previous page |
| `nextPage()` | Go to next page |
| `zoomIn()` | Zoom in |
| `zoomOut()` | Zoom out |
| `fitToPage()` | Fit to page |
| `fitToWidth()` | Fit to width |
| `setZoomFactor(factor)` | Set zoom factor |
| `searchText(text)` | Search text |
| `clearSearch()` | Clear search |
| `getCurrentPage()` | Get current page number |
| `getTotalPages()` | Get total pages |

---

## 📤 Main Events

| Event | Description |
|-------|-------------|
| `documentLoad` | Emitted when document is loaded |
| `pageChange` | Emitted when page changes |
| `zoomChange` | Emitted when zoom changes |
| `annotationAdd` | Emitted when annotation is added |
| `annotationRemove` | Emitted when annotation is removed |
| `hyperlinkClick` | Emitted when hyperlink is clicked |
| `textSelection` | Emitted when text is selected |

---

## 💡 Common Use Cases

### 1. Basic PDF Viewer

```html
<app-pdf-viewer
  #pdfviewer
  [documentPath]="documentPath">
</app-pdf-viewer>
```

### 2. Print PDF

```typescript
@ViewChild('pdfviewer') pdfviewer!: PdfViewerComponent;

printPdf(): void {
  this.pdfviewer.print();
}
```

### 3. Navigate Pages

```typescript
goToPage(page: number): void {
  this.pdfviewer.goToPage(page);
}

nextPage(): void {
  this.pdfviewer.nextPage();
}
```

### 4. Search Text

```typescript
search(text: string): void {
  this.pdfviewer.searchText(text);
}
```

### 5. Zoom Control

```typescript
zoomIn(): void {
  this.pdfviewer.zoomIn();
}

fitToPage(): void {
  this.pdfviewer.fitToPage();
}
```

---

## 🎨 Styling

Component ใช้ Glass Morphism styling โดยอัตโนมัติและรองรับ Dark Mode

```scss
.pdf-viewer-container {
  ::ng-deep {
    .e-pdfviewer {
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 0.5rem;
    }
  }
}
```

---

## 📝 Notes

- PDF Viewer component ต้องการ Syncfusion PdfViewer module
- Service URL จำเป็นสำหรับ features บางอย่าง เช่น annotations, form fields
- สำหรับ production ควรใช้ custom service URL
- PDF documents ควรอยู่บน same origin หรือมี CORS headers ที่ถูกต้อง

---

## 🔗 Related Components

- `DocumentEditorComponent` - สำหรับแก้ไขเอกสารแบบ Word-like
- `SpreadsheetComponent` - สำหรับจัดการข้อมูลแบบ Excel-like

---

**Last Updated**: 2024-12-20

