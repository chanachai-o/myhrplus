# Syncfusion Uploader Component Guide

## Overview

The `SyncfusionUploaderWrapperComponent` is a wrapper around Syncfusion's Uploader component, providing a powerful file upload interface with drag & drop, progress tracking, pause/resume functionality, and multiple file support. It supports various file types, size restrictions, and upload configurations.

## Installation

The Uploader component is part of the Syncfusion inputs package and is already included in the `SyncfusionModule`. No additional installation is required.

## Basic Usage

```typescript
import { SyncfusionUploaderWrapperComponent } from '@shared/components/syncfusion-uploader/syncfusion-uploader.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SyncfusionUploaderWrapperComponent],
  template: `
    <app-syncfusion-uploader
      [asyncSettings]="asyncSettings"
      [multiple]="true"
      [maxFileSize]="10485760">
    </app-syncfusion-uploader>
  `
})
export class ExampleComponent {
  asyncSettings: any = {
    saveUrl: 'https://your-server.com/api/upload/Save',
    removeUrl: 'https://your-server.com/api/upload/Remove'
  };
}
```

## Inputs

### Upload Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `asyncSettings` | `any` | `{ saveUrl: '', removeUrl: '' }` | AJAX settings for upload/remove operations |
| `allowedExtensions` | `string` | `''` | Comma-separated list of allowed file extensions (e.g., '.pdf,.doc,.jpg') |
| `autoUpload` | `boolean` | `false` | Enable/disable automatic upload on file selection |
| `multiple` | `boolean` | `true` | Enable/disable multiple file selection |
| `maxFileSize` | `number` | `0` | Maximum file size in bytes (0 = unlimited) |
| `minFileSize` | `number` | `0` | Minimum file size in bytes |
| `sequentialUpload` | `boolean` | `false` | Upload files sequentially (one at a time) |
| `directoryUpload` | `boolean` | `false` | Enable/disable directory upload |

### Behavior Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `buttons` | `any` | `{}` | Custom button configuration |
| `dropArea` | `HTMLElement \| string` | `undefined` | Custom drop area element or selector |
| `enablePersistence` | `boolean` | `false` | Enable/disable state persistence |
| `enableRtl` | `boolean` | `false` | Enable/disable right-to-left layout |
| `showFileList` | `boolean` | `true` | Show/hide file list |
| `template` | `string` | `undefined` | Custom template for file items |

### Appearance Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `height` | `string \| number` | `'auto'` | Height of the uploader |
| `width` | `string \| number` | `'100%'` | Width of the uploader |
| `htmlAttributes` | `{ [key: string]: string }` | `{}` | HTML attributes for the uploader |
| `locale` | `string` | `'en'` | Locale for localization |
| `customClass` | `string` | `undefined` | Custom CSS class for the container |
| `config` | `UploaderConfig` | `undefined` | Configuration object to set multiple properties at once |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `uploading` | `EventEmitter<any>` | Emitted when file upload starts |
| `success` | `EventEmitter<any>` | Emitted when file upload succeeds |
| `failure` | `EventEmitter<any>` | Emitted when file upload fails |
| `removing` | `EventEmitter<any>` | Emitted when file removal starts |
| `removed` | `EventEmitter<any>` | Emitted when file is removed |
| `fileSelected` | `EventEmitter<any>` | Emitted when file is selected |
| `beforeUpload` | `EventEmitter<any>` | Emitted before file upload |
| `beforeRemove` | `EventEmitter<any>` | Emitted before file removal |
| `progress` | `EventEmitter<any>` | Emitted during upload progress |
| `canceling` | `EventEmitter<any>` | Emitted when upload cancellation starts |
| `cancelled` | `EventEmitter<any>` | Emitted when upload is cancelled |
| `pausing` | `EventEmitter<any>` | Emitted when upload pause starts |
| `paused` | `EventEmitter<any>` | Emitted when upload is paused |
| `resuming` | `EventEmitter<any>` | Emitted when upload resume starts |
| `resumed` | `EventEmitter<any>` | Emitted when upload is resumed |
| `created` | `EventEmitter<any>` | Emitted when uploader is created |

## Methods

### Upload Methods

```typescript
// Upload files
upload(files?: FilesInfo[]): void

// Remove files
remove(files?: FilesInfo[]): void

// Clear all files
clearAll(): void

// Cancel upload
cancel(files?: FilesInfo[]): void

// Pause upload
pause(files?: FilesInfo[]): void

// Resume upload
resume(files?: FilesInfo[]): void
```

### Information Methods

```typescript
// Get all files
getFiles(): FilesInfo[]

// Get selected files
getSelectedFiles(): FilesInfo[]
```

### Utility Methods

```typescript
// Refresh uploader
refresh(): void

// Get Uploader instance
getUploaderInstance(): SyncfusionUploaderComponent | null
```

## Examples

### Basic Uploader

```typescript
export class MyComponent {
  asyncSettings: any = {
    saveUrl: 'https://your-server.com/api/upload/Save',
    removeUrl: 'https://your-server.com/api/upload/Remove'
  };
}
```

```html
<app-syncfusion-uploader
  [asyncSettings]="asyncSettings"
  [multiple]="true"
  [maxFileSize]="10485760">
</app-syncfusion-uploader>
```

### Uploader with File Type Restrictions

```html
<app-syncfusion-uploader
  [asyncSettings]="asyncSettings"
  [allowedExtensions]="'.pdf,.doc,.docx,.jpg,.png'"
  [maxFileSize]="5242880">
</app-syncfusion-uploader>
```

### Auto Upload

```html
<app-syncfusion-uploader
  [asyncSettings]="asyncSettings"
  [autoUpload]="true"
  [multiple]="true">
</app-syncfusion-uploader>
```

### Sequential Upload

```html
<app-syncfusion-uploader
  [asyncSettings]="asyncSettings"
  [sequentialUpload]="true"
  [multiple]="true">
</app-syncfusion-uploader>
```

### Programmatic Control

```typescript
export class MyComponent {
  @ViewChild('uploader') uploader!: SyncfusionUploaderWrapperComponent;

  uploadFiles(): void {
    this.uploader.upload();
  }

  onUploadSuccess(event: any): void {
    console.log('Upload successful:', event);
  }

  onUploadProgress(event: any): void {
    console.log('Progress:', event.percentage);
  }
}
```

```html
<app-syncfusion-uploader
  #uploader
  [asyncSettings]="asyncSettings"
  (success)="onUploadSuccess($event)"
  (progress)="onUploadProgress($event)">
</app-syncfusion-uploader>

<button (click)="uploadFiles()">Upload Files</button>
```

### Using Configuration Object

```typescript
export class MyComponent {
  uploaderConfig: UploaderConfig = {
    asyncSettings: {
      saveUrl: 'https://your-server.com/api/upload/Save',
      removeUrl: 'https://your-server.com/api/upload/Remove'
    },
    allowedExtensions: '.pdf,.doc,.jpg,.png',
    autoUpload: false,
    multiple: true,
    maxFileSize: 10485760,
    showFileList: true,
    width: '100%'
  };
}
```

```html
<app-syncfusion-uploader [config]="uploaderConfig"></app-syncfusion-uploader>
```

## Server Configuration

Uploader requires backend server endpoints for:

1. **Save** (`saveUrl`): Handle file upload
2. **Remove** (`removeUrl`): Handle file removal

### Example Server Endpoints

```typescript
// Save (Upload)
POST /api/upload/Save
Body: FormData with file

// Remove
POST /api/upload/Remove
Body: { files: ['file1.jpg', 'file2.pdf'] }
```

## Styling

The component uses Glass Morphism styling by default and supports dark mode. You can customize the appearance using:

1. **Custom CSS Classes**: Use `customClass` for container styling
2. **SCSS Variables**: Override design tokens in `src/styles/_design-tokens.scss`

### Custom Styling Example

```scss
// component.scss
.my-uploader {
  ::ng-deep {
    .e-upload {
      .e-upload-files {
        border-color: rgba(79, 70, 229, 0.5);
      }
    }
  }
}
```

```html
<app-syncfusion-uploader
  [asyncSettings]="asyncSettings"
  customClass="my-uploader">
</app-syncfusion-uploader>
```

## Best Practices

1. **File Size Limits**: Set appropriate `maxFileSize` to prevent large uploads
2. **File Type Restrictions**: Use `allowedExtensions` to restrict file types
3. **Error Handling**: Handle `failure` event for upload errors
4. **Progress Tracking**: Use `progress` event to show upload progress
5. **Server Validation**: Validate files on server side as well
6. **Security**: Implement proper authentication and authorization
7. **Performance**: Use `sequentialUpload` for large files or slow connections

## Troubleshooting

### Upload Not Working

- Ensure `asyncSettings.saveUrl` is correctly configured
- Check that server endpoint accepts file uploads
- Verify CORS settings on the server
- Check browser console for errors

### Files Not Showing

- Verify `showFileList` is `true`
- Check that files are within `maxFileSize` limit
- Ensure `allowedExtensions` includes the file type

### Progress Not Updating

- Verify `progress` event is handled
- Check that server sends proper progress updates
- Ensure upload is not paused

## Related Components

- **File Upload**: Custom file upload component
- **Image Upload**: For image-specific uploads
- **File Manager**: For comprehensive file management

## API Reference

For complete API reference, see [Syncfusion Uploader Documentation](https://ej2.syncfusion.com/angular/documentation/uploader/getting-started/).

