# 🖼️ Image Editor Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-image-editor`  
**Library**: Syncfusion ImageEditor

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

`ImageEditorComponent` เป็น wrapper component สำหรับ Syncfusion ImageEditor ที่ให้ความสามารถในการแก้ไขรูปภาพแบบ comprehensive พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Image Editing (Crop, Resize, Rotate)
- ✅ Image Transform (Rotate, Flip)
- ✅ Image Filters
- ✅ Image Finetune (Brightness, Contrast, Saturation, etc.)
- ✅ Image Annotation (Shapes, Text, Freehand Draw)
- ✅ Undo/Redo
- ✅ Zoom In/Out
- ✅ Export (PNG, JPEG, SVG)
- ✅ Save Image
- ✅ Reset Image
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion ImageEditor ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-image-editor": "^29.2.x"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { ImageEditorComponent } from '../../shared/components/image-editor/image-editor.component';

@Component({
  imports: [ImageEditorComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-image-editor
  [width]="'100%'"
  [height]="'600px'"
  [src]="imageUrl">
</app-image-editor>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  imageUrl: string = 'https://example.com/image.jpg';
}
```

---

## 📋 Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | `string \| number` | `'100%'` | Component width |
| `height` | `string \| number` | `'600px'` | Component height |
| `src` | `string` | `''` | Image source URL |
| `toolbar` | `string[]` | `[...]` | Toolbar items |
| `selection` | `any` | `{}` | Selection settings |
| `annotationSettings` | `any` | `{...}` | Annotation settings |
| `shapeSettings` | `any` | `{...}` | Shape settings |
| `freehandDrawSettings` | `any` | `{...}` | Freehand draw settings |
| `allowUndoRedo` | `boolean` | `true` | Enable undo/redo |
| `allowImageUpload` | `boolean` | `true` | Enable image upload |
| `allowImageDownload` | `boolean` | `true` | Enable image download |
| `allowImageSave` | `boolean` | `true` | Enable image save |
| `allowImageReset` | `boolean` | `true` | Enable image reset |
| `allowImageCrop` | `boolean` | `true` | Enable crop |
| `allowImageTransform` | `boolean` | `true` | Enable transform |
| `allowImageFilter` | `boolean` | `true` | Enable filters |
| `allowImageAnnotation` | `boolean` | `true` | Enable annotation |
| `allowImageFinetune` | `boolean` | `true` | Enable finetune |
| `customClass` | `string` | `''` | Custom CSS class |

---

## 🔧 Methods

### `open(imageUrl: string): void`
Open image from URL

### `getImageData(): string`
Get image as data URL

### `getImageBlob(): Promise<Blob>`
Get image as Blob

### `export(type: 'PNG' | 'JPEG' | 'SVG', fileName?: string): void`
Export image

### `save(): void`
Save image

### `reset(): void`
Reset image to original

### `undo(): void`
Undo last action

### `redo(): void`
Redo last action

### `crop(): void`
Crop image

### `transform(type: 'RotateLeft' | 'RotateRight' | 'FlipHorizontal' | 'FlipVertical'): void`
Transform image

### `applyFilter(filter: string): void`
Apply filter

### `finetune(type: string, value: number): void`
Finetune image

### `zoomIn(): void`
Zoom in

### `zoomOut(): void`
Zoom out

### `setZoom(factor: number): void`
Set zoom factor

### `refresh(): void`
Refresh editor

### `getImageEditorInstance(): SyncfusionImageEditorComponent | null`
Get Syncfusion ImageEditor instance

---

## 🎨 Examples

### Basic Example

```html
<app-image-editor
  [width]="'100%'"
  [height]="'600px'"
  [src]="imageUrl">
</app-image-editor>
```

### With Export Functions

```typescript
import { Component, ViewChild } from '@angular/core';
import { ImageEditorComponent } from '../../shared/components/image-editor/image-editor.component';

@Component({
  selector: 'app-example',
  template: `
    <app-image-editor
      #editor
      [width]="'100%'"
      [height]="'600px'"
      [src]="imageUrl">
    </app-image-editor>
    <button (click)="exportAsPng()">Export PNG</button>
    <button (click)="exportAsJpeg()">Export JPEG</button>
  `
})
export class ExampleComponent {
  @ViewChild('editor') editor!: ImageEditorComponent;
  imageUrl: string = 'https://example.com/image.jpg';

  exportAsPng(): void {
    this.editor.export('PNG', 'image');
  }

  exportAsJpeg(): void {
    this.editor.export('JPEG', 'image');
  }
}
```

### With Transform

```typescript
rotateLeft(): void {
  this.editor.transform('RotateLeft');
}

rotateRight(): void {
  this.editor.transform('RotateRight');
}

flipHorizontal(): void {
  this.editor.transform('FlipHorizontal');
}

flipVertical(): void {
  this.editor.transform('FlipVertical');
}
```

### With Filters

```typescript
applySepiaFilter(): void {
  this.editor.applyFilter('Sepia');
}

applyGrayscaleFilter(): void {
  this.editor.applyFilter('Grayscale');
}
```

### With Finetune

```typescript
adjustBrightness(value: number): void {
  this.editor.finetune('Brightness', value);
}

adjustContrast(value: number): void {
  this.editor.finetune('Contrast', value);
}

adjustSaturation(value: number): void {
  this.editor.finetune('Saturation', value);
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
<app-image-editor
  [width]="'100%'"
  [height]="'600px'"
  [src]="imageUrl"
  customClass="my-custom-editor">
</app-image-editor>
```

---

## 📱 Responsive

Component รองรับ responsive design:
- Mobile: ปรับ toolbar และ canvas size
- Tablet: ปรับ layout
- Desktop: Full features

---

## 🔗 Related Documentation

- [IMAGE_EDITOR_COMPONENT_SUMMARY.md](./IMAGE_EDITOR_COMPONENT_SUMMARY.md) - สรุปการสร้าง
- [Syncfusion ImageEditor Documentation](https://ej2.syncfusion.com/angular/documentation/image-editor/getting-started/)
- [Document Editor Component](./document-editor/README.md)
- [Rich Text Editor Component](./rich-text-editor/README.md)

---

**Maintainer**: Development Team  
**Last Updated**: 2024-12-20  
**Version**: 1.0.0

