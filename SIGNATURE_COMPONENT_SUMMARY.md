# ✍️ Signature Component Summary

**Component**: `app-signature`  
**Library**: Syncfusion Signature  
**Type**: Standalone Component

---

## 🎯 Overview

`SignatureComponent` เป็น wrapper component สำหรับ Syncfusion Signature ที่ให้ความสามารถในการจับลายมือชื่อดิจิทัลพร้อม features ครบถ้วน

---

## ✨ Key Features

- ✅ Digital signature capture
- ✅ Customizable stroke color and width
- ✅ Background color customization
- ✅ Undo/Redo functionality
- ✅ Clear signature
- ✅ Save as base64 string
- ✅ Save as blob/image
- ✅ Download as image
- ✅ Read-only mode
- ✅ Check if signature is empty
- ✅ Load signature from base64 or URL
- ✅ Glass Morphism styling
- ✅ Dark Mode support

---

## 🚀 Quick Start

### Installation

Component ใช้ Syncfusion Signature ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-inputs": "^29.2.5"
```

### Basic Usage

```html
<app-signature
  [height]="'300px'"
  [width]="'100%'">
</app-signature>
```

```typescript
import { SignatureComponent } from '../../shared/components/signature/signature.component';

export class ExampleComponent {
  @ViewChild('signature') signature!: SignatureComponent;
}
```

---

## 📋 Main Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `backgroundColor` | `string` | `'#ffffff'` | Background color |
| `strokeColor` | `string` | `'#000000'` | Stroke color |
| `minStrokeWidth` | `number` | `0.5` | Minimum stroke width |
| `maxStrokeWidth` | `number` | `2.5` | Maximum stroke width |
| `velocity` | `number` | `0.7` | Drawing velocity |
| `isReadOnly` | `boolean` | `false` | Read-only mode |
| `saveWithBackground` | `boolean` | `true` | Save with background |
| `height` | `string \| number` | `'300px'` | Component height |
| `width` | `string \| number` | `'100%'` | Component width |

---

## 🔧 Main Methods

| Method | Description |
|--------|-------------|
| `clear()` | Clear signature |
| `undo()` | Undo last stroke |
| `redo()` | Redo last undone stroke |
| `isEmpty()` | Check if signature is empty |
| `saveAsBase64()` | Save as base64 string |
| `saveAsBlob()` | Save as blob |
| `download(fileName?)` | Download as image |
| `load(base64)` | Load from base64 |
| `loadFromUrl(url)` | Load from image URL |

---

## 📤 Main Events

| Event | Description |
|-------|-------------|
| `change` | Emitted when signature changes |
| `created` | Emitted when signature pad is created |

---

## 💡 Common Use Cases

### 1. Basic Signature Pad

```html
<app-signature
  #signature
  [height]="'300px'">
</app-signature>
```

### 2. Save Signature

```typescript
@ViewChild('signature') signature!: SignatureComponent;

saveSignature(): void {
  const base64 = this.signature.saveAsBase64();
  // Save to server or localStorage
}
```

### 3. Download Signature

```typescript
downloadSignature(): void {
  this.signature.download('my-signature');
}
```

### 4. Clear Signature

```typescript
clearSignature(): void {
  this.signature.clear();
}
```

### 5. Load Signature

```typescript
loadSignature(base64: string): void {
  this.signature.load(base64);
}
```

### 6. Check if Empty

```typescript
validateSignature(): boolean {
  return !this.signature.isEmpty();
}
```

---

## 🎨 Styling

Component ใช้ Glass Morphism styling โดยอัตโนมัติและรองรับ Dark Mode

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

---

## 📝 Notes

- Signature component ต้องการ Syncfusion Signature module
- Base64 format: `data:image/png;base64,...`
- Download functionality ใช้ browser download API
- Load from URL ต้องมี CORS headers ที่ถูกต้อง
- Read-only mode ป้องกันการแก้ไข signature

---

## 🔗 Related Components

- `SpeechToTextComponent` - สำหรับแปลงเสียงเป็นข้อความ
- `ImageUploadComponent` - สำหรับอัปโหลดรูปภาพ

---

**Last Updated**: 2024-12-20

