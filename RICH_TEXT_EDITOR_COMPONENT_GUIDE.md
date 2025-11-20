# ✏️ Rich Text Editor Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-rich-text-editor`  
**Library**: Syncfusion Rich Text Editor

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

`RichTextEditorComponent` เป็น wrapper component สำหรับ Syncfusion Rich Text Editor ที่ให้ความสามารถในการแก้ไขข้อความแบบ Rich Text พร้อม features ครบถ้วน พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Rich Text Formatting (Bold, Italic, Underline, etc.)
- ✅ Font Management (Font Name, Size, Color)
- ✅ Text Alignment
- ✅ Lists (Ordered, Unordered)
- ✅ Links & Images
- ✅ Tables
- ✅ Source Code Editor
- ✅ Full Screen Mode
- ✅ Undo/Redo
- ✅ Character Count
- ✅ XSS Protection
- ✅ Paste Cleanup
- ✅ Image Upload
- ✅ File Manager Integration
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion Rich Text Editor ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-richtexteditor": "^29.2.11"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { RichTextEditorComponent } from '../../shared/components/rich-text-editor/rich-text-editor.component';

@Component({
  imports: [RichTextEditorComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-rich-text-editor
  [value]="editorValue"
  [height]="'400px'"
  [width]="'100%'">
</app-rich-text-editor>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    <app-rich-text-editor
      [value]="editorValue"
      [height]="'400px'"
      [width]="'100%'">
    </app-rich-text-editor>
  `
})
export class ExampleComponent {
  editorValue: string = '<p>Hello World</p>';
}
```

---

## ⚙️ Configuration

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `''` | Editor value (HTML) |
| `placeholder` | `string` | `'Enter text here...'` | Placeholder text |
| `height` | `string \| number` | `'400px'` | Editor height |
| `width` | `string \| number` | `'100%'` | Editor width |
| `toolbarSettings` | `ToolbarSettingsModel` | `{...}` | Toolbar settings |
| `quickToolbarSettings` | `QuickToolbarSettingsModel` | `{...}` | Quick toolbar settings |
| `imageSettings` | `ImageSettingsModel` | `{...}` | Image settings |
| `fileManagerSettings` | `FileManagerSettingsModel` | `{}` | File manager settings |
| `tableSettings` | `TableSettingsModel` | `{...}` | Table settings |
| `pasteCleanupSettings` | `PasteCleanupSettingsModel` | `{...}` | Paste cleanup settings |
| `htmlEditorSettings` | `HtmlEditorSettingsModel` | `{}` | HTML editor settings |
| `markdownSettings` | `MarkdownSettingsModel` | `{}` | Markdown settings |
| `enableRtl` | `boolean` | `false` | Enable RTL |
| `enableResize` | `boolean` | `true` | Enable resize |
| `enableTabKey` | `boolean` | `true` | Enable tab key |
| `enablePersistence` | `boolean` | `false` | Enable persistence |
| `enableXssProtection` | `boolean` | `true` | Enable XSS protection |
| `enableAutoUrl` | `boolean` | `true` | Enable auto URL |
| `enableHtmlEncode` | `boolean` | `false` | Enable HTML encode |
| `enableMarkdownResize` | `boolean` | `true` | Enable markdown resize |
| `showCharCount` | `boolean` | `false` | Show character count |
| `maxLength` | `number` | `0` | Maximum length |
| `readonly` | `boolean` | `false` | Readonly mode |
| `disabled` | `boolean` | `false` | Disabled mode |
| `customClass` | `string` | `''` | Custom CSS class |

### Toolbar Items

Available toolbar items:
- `Bold`, `Italic`, `Underline`, `StrikeThrough`
- `FontName`, `FontSize`, `FontColor`, `BackgroundColor`
- `LowerCase`, `UpperCase`
- `Formats`, `Alignments`
- `OrderedList`, `UnorderedList`
- `Outdent`, `Indent`
- `CreateLink`, `Image`, `Table`
- `ClearFormat`, `Print`
- `SourceCode`, `FullScreen`
- `Undo`, `Redo`

---

## 📚 API Reference

### Methods

#### `getValue(): string`
Get editor value

```typescript
const value = richTextEditorComponent.getValue();
```

#### `setValue(value: string): void`
Set editor value

```typescript
richTextEditorComponent.setValue('<p>New content</p>');
```

#### `getHtml(): string`
Get HTML content

```typescript
const html = richTextEditorComponent.getHtml();
```

#### `getText(): string`
Get text content (without HTML tags)

```typescript
const text = richTextEditorComponent.getText();
```

#### `getSelectedText(): string`
Get selected text

```typescript
const selected = richTextEditorComponent.getSelectedText();
```

#### `insertText(text: string): void`
Insert text at cursor position

```typescript
richTextEditorComponent.insertText('Hello');
```

#### `insertHtml(html: string): void`
Insert HTML at cursor position

```typescript
richTextEditorComponent.insertHtml('<strong>Bold</strong>');
```

#### `formatText(format: string, value?: string): void`
Format selected text

```typescript
richTextEditorComponent.formatText('bold');
richTextEditorComponent.formatText('fontSize', '14px');
```

#### `undo(): void`
Undo last action

```typescript
richTextEditorComponent.undo();
```

#### `redo(): void`
Redo last action

```typescript
richTextEditorComponent.redo();
```

#### `clearFormat(): void`
Clear formatting

```typescript
richTextEditorComponent.clearFormat();
```

#### `refresh(): void`
Refresh editor

```typescript
richTextEditorComponent.refresh();
```

#### `getEditorInstance(): RichTextEditorComponent | null`
Get Syncfusion Rich Text Editor instance

```typescript
const editor = richTextEditorComponent.getEditorInstance();
```

### Events

| Event | Type | Description |
|-------|------|-------------|
| `created` | `EventEmitter<any>` | Emitted when editor is created |
| `change` | `EventEmitter<any>` | Emitted when value changes |
| `actionBegin` | `EventEmitter<any>` | Emitted when action begins |
| `actionComplete` | `EventEmitter<any>` | Emitted when action completes |
| `focus` | `EventEmitter<any>` | Emitted when editor is focused |
| `blur` | `EventEmitter<any>` | Emitted when editor is blurred |
| `toolbarClick` | `EventEmitter<any>` | Emitted when toolbar item is clicked |
| `imageUploading` | `EventEmitter<any>` | Emitted when image is uploading |
| `imageUploadSuccess` | `EventEmitter<any>` | Emitted when image upload succeeds |
| `imageUploadFailed` | `EventEmitter<any>` | Emitted when image upload fails |
| `imageRemoving` | `EventEmitter<any>` | Emitted when image is removed |
| `fileUploading` | `EventEmitter<any>` | Emitted when file is uploading |
| `fileUploadSuccess` | `EventEmitter<any>` | Emitted when file upload succeeds |
| `fileUploadFailed` | `EventEmitter<any>` | Emitted when file upload fails |
| `beforeDialogOpen` | `EventEmitter<any>` | Emitted before dialog opens |
| `dialogOpen` | `EventEmitter<any>` | Emitted when dialog opens |
| `dialogClose` | `EventEmitter<any>` | Emitted when dialog closes |
| `beforeImageUpload` | `EventEmitter<any>` | Emitted before image upload |
| `beforeFileUpload` | `EventEmitter<any>` | Emitted before file upload |
| `beforePaste` | `EventEmitter<any>` | Emitted before paste |
| `beforeDrop` | `EventEmitter<any>` | Emitted before drop |
| `beforeSanitizeHtml` | `EventEmitter<any>` | Emitted before HTML sanitization |

---

## 💡 Examples

### Example 1: Basic Editor

```typescript
editorValue: string = '<p>Hello World</p>';
```

```html
<app-rich-text-editor
  [value]="editorValue"
  [height]="'400px'">
</app-rich-text-editor>
```

### Example 2: Custom Toolbar

```typescript
toolbarSettings = {
  items: [
    'Bold', 'Italic', 'Underline', '|',
    'FontName', 'FontSize', 'FontColor', '|',
    'Formats', 'Alignments', '|',
    'CreateLink', 'Image', '|',
    'SourceCode', 'FullScreen'
  ]
};
```

```html
<app-rich-text-editor
  [value]="editorValue"
  [toolbarSettings]="toolbarSettings"
  [height]="'400px'">
</app-rich-text-editor>
```

### Example 3: With Character Count

```html
<app-rich-text-editor
  [value]="editorValue"
  [showCharCount]="true"
  [maxLength]="1000"
  [height]="'400px'">
</app-rich-text-editor>
```

### Example 4: Image Upload

```typescript
imageSettings = {
  allowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
  maxFileSize: 1000000, // 1MB
  saveUrl: '/api/upload',
  path: '/uploads'
};
```

```html
<app-rich-text-editor
  [value]="editorValue"
  [imageSettings]="imageSettings"
  (imageUploadSuccess)="onImageUploadSuccess($event)">
</app-rich-text-editor>
```

### Example 5: Using ViewChild

```typescript
import { Component, ViewChild } from '@angular/core';
import { RichTextEditorComponent } from '../../shared/components/rich-text-editor/rich-text-editor.component';

@Component({
  template: `
    <app-rich-text-editor
      #editor
      [value]="editorValue">
    </app-rich-text-editor>
    <button (click)="getContent()">Get Content</button>
  `
})
export class ExampleComponent {
  @ViewChild('editor') editor!: RichTextEditorComponent;
  editorValue: string = '';

  getContent(): void {
    const html = this.editor.getHtml();
    console.log('HTML:', html);
  }
}
```

---

## 🎨 Styling

### Glass Morphism
Component ใช้ Glass Morphism styling โดยอัตโนมัติ

### Dark Mode
รองรับ Dark Mode โดยอัตโนมัติ

### Gemini Theme
รองรับ Gemini Theme โดยอัตโนมัติ

### Custom Styling
```html
<app-rich-text-editor
  [value]="editorValue"
  customClass="my-custom-editor">
</app-rich-text-editor>
```

```scss
.my-custom-editor {
  // Custom styles
}
```

---

## 📱 Responsive

Component รองรับ responsive design โดยอัตโนมัติ:
- Mobile: ปรับ toolbar และ font sizes
- Tablet: ปรับขนาดและ spacing
- Desktop: Full features

---

## 🔗 Related Documentation

- [Syncfusion Rich Text Editor Documentation](https://ej2.syncfusion.com/angular/documentation/rich-text-editor/getting-started/)
- [Data Grid Component](./data-grid/README.md)
- [Pivot Table Component](./pivot-table/README.md)
- [Scheduler Component](./scheduler/README.md)
- [Chart Component](./chart/README.md)
- [UI Kit Guide](../UI_KIT_GUIDE.md)

---

**Last Updated**: 2024-12-20  
**Version**: 1.0.0

