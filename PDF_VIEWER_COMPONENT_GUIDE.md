# 📄 PDF Viewer Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-pdf-viewer`  
**Library**: Syncfusion PdfViewer

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

`PdfViewerComponent` เป็น wrapper component สำหรับ Syncfusion PdfViewer ที่ให้ความสามารถในการดูและจัดการไฟล์ PDF พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ PDF Document Viewing
- ✅ Text Search & Selection
- ✅ Zoom In/Out & Fit to Page/Width
- ✅ Print & Download
- ✅ Annotations (Sticky Notes, Text Markup, Shapes, Stamps)
- ✅ Form Field Filling
- ✅ Digital Signatures
- ✅ Measurement Tools
- ✅ Thumbnail Navigation
- ✅ Bookmark Navigation
- ✅ Hyperlink Support
- ✅ Hand Tool for Panning
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion PdfViewer ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-pdfviewer": "^29.2.11"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { PdfViewerComponent } from '../../shared/components/pdf-viewer/pdf-viewer.component';

@Component({
  imports: [PdfViewerComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-pdf-viewer
  [documentPath]="documentPath"
  [height]="'800px'"
  [width]="'100%'">
</app-pdf-viewer>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  documentPath: string = 'https://example.com/document.pdf';
  serviceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
}
```

---

## ⚙️ Configuration

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `documentPath` | `string` | `''` | Path to PDF document |
| `serviceUrl` | `string` | `undefined` | Service URL for PDF processing |
| `enableToolbar` | `boolean` | `true` | Enable toolbar |
| `enableNavigation` | `boolean` | `true` | Enable navigation controls |
| `enableThumbnail` | `boolean` | `true` | Enable thumbnail panel |
| `enableBookmark` | `boolean` | `true` | Enable bookmark panel |
| `enableTextSelection` | `boolean` | `true` | Enable text selection |
| `enableTextSearch` | `boolean` | `true` | Enable text search |
| `enablePrint` | `boolean` | `true` | Enable print functionality |
| `enableDownload` | `boolean` | `true` | Enable download functionality |
| `enableFormFields` | `boolean` | `true` | Enable form field interaction |
| `enableAnnotations` | `boolean` | `true` | Enable annotations |
| `enableHyperlinks` | `boolean` | `true` | Enable hyperlinks |
| `enableMagnification` | `boolean` | `true` | Enable zoom controls |
| `enableStickyNotes` | `boolean` | `true` | Enable sticky notes |
| `enableHandTool` | `boolean` | `true` | Enable hand tool for panning |
| `enableTextMarkup` | `boolean` | `true` | Enable text markup annotations |
| `enableShapeAnnotation` | `boolean` | `true` | Enable shape annotations |
| `enableStampAnnotation` | `boolean` | `true` | Enable stamp annotations |
| `enableSignature` | `boolean` | `true` | Enable digital signatures |
| `enableMeasurement` | `boolean` | `true` | Enable measurement tools |
| `isReadOnly` | `boolean` | `false` | Read-only mode |
| `zoomFactor` | `number` | `1` | Initial zoom factor |
| `height` | `string \| number` | `'800px'` | Component height |
| `width` | `string \| number` | `'100%'` | Component width |
| `customClass` | `string` | `undefined` | Custom CSS class |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `documentLoad` | `EventEmitter<any>` | Emitted when document is loaded |
| `pageChange` | `EventEmitter<any>` | Emitted when page changes |
| `zoomChange` | `EventEmitter<any>` | Emitted when zoom changes |
| `annotationAdd` | `EventEmitter<any>` | Emitted when annotation is added |
| `annotationRemove` | `EventEmitter<any>` | Emitted when annotation is removed |
| `annotationSelect` | `EventEmitter<any>` | Emitted when annotation is selected |
| `hyperlinkClick` | `EventEmitter<any>` | Emitted when hyperlink is clicked |
| `textSelection` | `EventEmitter<any>` | Emitted when text is selected |
| `formFieldFocus` | `EventEmitter<any>` | Emitted when form field gets focus |
| `formFieldBlur` | `EventEmitter<any>` | Emitted when form field loses focus |

---

## 📚 API Reference

### Methods

#### `getPdfViewerInstance(): SyncfusionPdfViewerComponent | null`
Get the underlying Syncfusion PdfViewer instance.

#### `loadDocument(documentPath: string): void`
Load a PDF document.

#### `print(): void`
Print the PDF document.

#### `download(): void`
Download the PDF document.

#### `goToPage(pageNumber: number): void`
Navigate to specified page number.

#### `firstPage(): void`
Navigate to first page.

#### `lastPage(): void`
Navigate to last page.

#### `previousPage(): void`
Navigate to previous page.

#### `nextPage(): void`
Navigate to next page.

#### `zoomIn(): void`
Zoom in.

#### `zoomOut(): void`
Zoom out.

#### `fitToPage(): void`
Fit document to page.

#### `fitToWidth(): void`
Fit document to width.

#### `setZoomFactor(zoomFactor: number): void`
Set zoom factor.

#### `searchText(text: string): void`
Search for text in PDF.

#### `clearSearch(): void`
Clear search results.

#### `getCurrentPage(): number`
Get current page number.

#### `getTotalPages(): number`
Get total number of pages.

#### `refresh(): void`
Refresh PDF viewer.

---

## 💡 Examples

### Basic PDF Viewer

```html
<app-pdf-viewer
  #pdfviewer
  [documentPath]="documentPath"
  [height]="'800px'">
</app-pdf-viewer>
```

```typescript
export class ExampleComponent {
  documentPath: string = 'https://example.com/document.pdf';
}
```

### PDF Viewer with Service URL

```html
<app-pdf-viewer
  #pdfviewer
  [documentPath]="documentPath"
  [serviceUrl]="serviceUrl"
  [height]="'800px'">
</app-pdf-viewer>
```

```typescript
export class ExampleComponent {
  documentPath: string = 'document.pdf';
  serviceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
}
```

### PDF Viewer with Navigation Controls

```html
<app-pdf-viewer
  #pdfviewer
  [documentPath]="documentPath"
  [enableNavigation]="true"
  [enableThumbnail]="true"
  [enableBookmark]="true">
</app-pdf-viewer>
```

### PDF Viewer with Annotations

```html
<app-pdf-viewer
  #pdfviewer
  [documentPath]="documentPath"
  [enableAnnotations]="true"
  [enableStickyNotes]="true"
  [enableTextMarkup]="true"
  [enableShapeAnnotation]="true">
</app-pdf-viewer>
```

### PDF Viewer Read-Only Mode

```html
<app-pdf-viewer
  #pdfviewer
  [documentPath]="documentPath"
  [isReadOnly]="true">
</app-pdf-viewer>
```

### Programmatic Control

```typescript
export class ExampleComponent {
  @ViewChild('pdfviewer') pdfviewer!: PdfViewerComponent;

  navigateToPage(page: number): void {
    this.pdfviewer.goToPage(page);
  }

  zoomIn(): void {
    this.pdfviewer.zoomIn();
  }

  search(text: string): void {
    this.pdfviewer.searchText(text);
  }

  printPdf(): void {
    this.pdfviewer.print();
  }
}
```

---

## 🎨 Styling

### Glass Morphism

Component ใช้ Glass Morphism styling โดยอัตโนมัติ:

```scss
.pdf-viewer-container {
  ::ng-deep {
    .e-pdfviewer {
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 0.5rem;
    }

    .e-pdfviewer-toolbar {
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
  .pdf-viewer-container {
    ::ng-deep {
      .e-pdfviewer {
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
  .e-pdfviewer {
    // Custom styles
  }
}
```

---

## 🔧 Advanced Usage

### Event Handling

```typescript
export class ExampleComponent {
  onDocumentLoad(event: any): void {
    console.log('Document loaded:', event);
  }

  onPageChange(event: any): void {
    console.log('Page changed:', event);
  }

  onAnnotationAdd(event: any): void {
    console.log('Annotation added:', event);
  }
}
```

```html
<app-pdf-viewer
  (documentLoad)="onDocumentLoad($event)"
  (pageChange)="onPageChange($event)"
  (annotationAdd)="onAnnotationAdd($event)">
</app-pdf-viewer>
```

### Service URL Configuration

PDF Viewer ต้องการ service URL สำหรับการประมวลผล PDF บาง features:

```typescript
export class ExampleComponent {
  serviceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
  
  // หรือใช้ custom service
  // serviceUrl: string = 'https://your-api.com/pdfviewer';
}
```

---

## 📝 Notes

- PDF Viewer component ต้องการ Syncfusion PdfViewer module ที่ติดตั้งแล้ว
- Service URL จำเป็นสำหรับ features บางอย่าง เช่น annotations, form fields
- สำหรับ production ควรใช้ custom service URL แทน public service
- PDF documents ควรอยู่บน same origin หรือมี CORS headers ที่ถูกต้อง
- Annotations และ form fields ต้องใช้ service URL

---

## 🔗 Related Documentation

- [Syncfusion PdfViewer Documentation](https://ej2.syncfusion.com/angular/documentation/pdfviewer/getting-started/)
- [Syncfusion PdfViewer API Reference](https://ej2.syncfusion.com/angular/documentation/api/pdfviewer/)

---

**Last Updated**: 2024-12-20

