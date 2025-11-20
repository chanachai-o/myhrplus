# ✍️ Signature Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-signature`  
**Library**: Syncfusion Signature

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

`SignatureComponent` เป็น wrapper component สำหรับ Syncfusion Signature ที่ให้ความสามารถในการจับลายมือชื่อดิจิทัลพร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Digital Signature Capture
- ✅ Customizable Stroke Color & Width
- ✅ Background Color Customization
- ✅ Undo/Redo Functionality
- ✅ Clear Signature
- ✅ Save as Base64 String
- ✅ Save as Blob/Image
- ✅ Download as Image
- ✅ Read-only Mode
- ✅ Check if Signature is Empty
- ✅ Load Signature from Base64 or URL
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion Signature ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-inputs": "^29.2.5"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { SignatureComponent } from '../../shared/components/signature/signature.component';

@Component({
  imports: [SignatureComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-signature
  [height]="'300px'"
  [width]="'100%'">
</app-signature>
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

## ⚙️ Configuration

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `backgroundColor` | `string` | `'#ffffff'` | Background color |
| `strokeColor` | `string` | `'#000000'` | Stroke color |
| `minStrokeWidth` | `number` | `0.5` | Minimum stroke width |
| `maxStrokeWidth` | `number` | `2.5` | Maximum stroke width |
| `velocity` | `number` | `0.7` | Drawing velocity |
| `isReadOnly` | `boolean` | `false` | Read-only mode |
| `saveWithBackground` | `boolean` | `true` | Save with background |
| `allowClear` | `boolean` | `true` | Allow clear button |
| `height` | `string \| number` | `'300px'` | Component height |
| `width` | `string \| number` | `'100%'` | Component width |
| `customClass` | `string` | `undefined` | Custom CSS class |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `change` | `EventEmitter<any>` | Emitted when signature changes |
| `created` | `EventEmitter<any>` | Emitted when signature pad is created |

---

## 📚 API Reference

### Methods

#### `getSignatureInstance(): SyncfusionSignatureComponent | null`
Get the underlying Syncfusion Signature instance.

#### `clear(): void`
Clear the signature.

#### `undo(): void`
Undo last stroke.

#### `redo(): void`
Redo last undone stroke.

#### `isEmpty(): boolean`
Check if signature is empty.

#### `saveAsBase64(): string`
Save signature as base64 string.

#### `saveAsBlob(): Blob | null`
Save signature as blob.

#### `download(fileName?: string): void`
Download signature as image file.

#### `load(base64: string): void`
Load signature from base64 string.

#### `loadFromUrl(url: string): void`
Load signature from image URL.

---

## 💡 Examples

### Basic Signature Pad

```html
<app-signature
  #signature
  [height]="'300px'"
  [width]="'100%'">
</app-signature>
```

### Signature with Custom Colors

```html
<app-signature
  #signature
  [backgroundColor]="'#f0f0f0'"
  [strokeColor]="'#0066cc'"
  [height]="'400px'">
</app-signature>
```

### Read-only Signature

```html
<app-signature
  #signature
  [isReadOnly]="true"
  [height]="'300px'">
</app-signature>
```

### Programmatic Control

```typescript
export class ExampleComponent {
  @ViewChild('signature') signature!: SignatureComponent;

  saveSignature(): void {
    const base64 = this.signature.saveAsBase64();
    // Save to server or localStorage
  }

  downloadSignature(): void {
    this.signature.download('my-signature');
  }

  clearSignature(): void {
    this.signature.clear();
  }

  checkIfEmpty(): boolean {
    return this.signature.isEmpty();
  }
}
```

### Load Signature

```typescript
export class ExampleComponent {
  @ViewChild('signature') signature!: SignatureComponent;

  loadFromBase64(base64: string): void {
    this.signature.load(base64);
  }

  loadFromUrl(url: string): void {
    this.signature.loadFromUrl(url);
  }
}
```

---

## 🎨 Styling

### Glass Morphism

Component ใช้ Glass Morphism styling โดยอัตโนมัติ:

```scss
.signature-container {
  ::ng-deep {
    .e-signature {
      border: 2px dashed rgba(148, 163, 184, 0.3);
      border-radius: 0.5rem;
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
  .signature-container {
    ::ng-deep {
      .e-signature {
        border-color: rgba(148, 163, 184, 0.4);
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
```

### Custom Styling

คุณสามารถ override styles ได้โดยใช้ `::ng-deep`:

```scss
::ng-deep {
  .e-signature {
    // Custom styles
  }
}
```

---

## 🔧 Advanced Usage

### Event Handling

```typescript
export class ExampleComponent {
  onSignatureChange(event: any): void {
    console.log('Signature changed:', event);
    // Auto-save or validate
  }
}
```

```html
<app-signature
  (change)="onSignatureChange($event)">
</app-signature>
```

### Form Integration

```typescript
export class ExampleComponent {
  signatureForm = this.fb.group({
    signature: ['']
  });

  @ViewChild('signature') signature!: SignatureComponent;

  onSubmit(): void {
    const base64 = this.signature.saveAsBase64();
    this.signatureForm.patchValue({ signature: base64 });
    // Submit form
  }
}
```

---

## 📝 Notes

- Signature component ต้องการ Syncfusion Signature module ที่ติดตั้งแล้ว
- Base64 format: `data:image/png;base64,...`
- Download functionality ใช้ browser download API
- Load from URL ต้องมี CORS headers ที่ถูกต้อง
- Read-only mode ป้องกันการแก้ไข signature

---

## 🔗 Related Documentation

- [Syncfusion Signature Documentation](https://ej2.syncfusion.com/angular/documentation/signature/getting-started/)
- [Syncfusion Signature API Reference](https://ej2.syncfusion.com/angular/documentation/api/signature/)

---

**Last Updated**: 2024-12-20

