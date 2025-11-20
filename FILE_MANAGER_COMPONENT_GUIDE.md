# File Manager Component Guide

## Overview

The `FileManagerComponent` is a wrapper around Syncfusion's File Manager component, providing a comprehensive file management interface for browsing, uploading, downloading, and managing files and folders. It supports multiple views, context menus, and various file operations.

## Installation

The File Manager component requires the `@syncfusion/ej2-angular-filemanager` package. If not already installed, run:

```bash
npm install @syncfusion/ej2-angular-filemanager --save
```

The component is included in the `SyncfusionModule`. No additional installation is required.

## Basic Usage

```typescript
import { FileManagerComponent, FileManagerAjaxSettings } from '@shared/components/file-manager/file-manager.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [FileManagerComponent],
  template: `
    <app-file-manager
      [ajaxSettings]="ajaxSettings"
      [height]="'600px'">
    </app-file-manager>
  `
})
export class ExampleComponent {
  ajaxSettings: FileManagerAjaxSettings = {
    url: 'https://your-server.com/api/FileManager/FileOperations',
    getImageUrl: 'https://your-server.com/api/FileManager/GetImage',
    uploadUrl: 'https://your-server.com/api/FileManager/Upload',
    downloadUrl: 'https://your-server.com/api/FileManager/Download'
  };
}
```

## Inputs

### Data Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ajaxSettings` | `FileManagerAjaxSettings` | `{ url: '' }` | AJAX settings for file operations |
| `config` | `FileManagerConfig` | `undefined` | Configuration object to set multiple properties at once |

### View Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `view` | `'Details' \| 'LargeIcons'` | `'Details'` | View mode (Details or Large Icons) |
| `allowMultiSelection` | `boolean` | `true` | Enable/disable multiple file selection |
| `showFileExtension` | `boolean` | `true` | Show/hide file extensions |
| `showHiddenItems` | `boolean` | `false` | Show/hide hidden files and folders |
| `showThumbnail` | `boolean` | `true` | Show/hide file thumbnails |

### Behavior Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enablePersistence` | `boolean` | `false` | Enable/disable state persistence |
| `enableRtl` | `boolean` | `false` | Enable/disable right-to-left layout |
| `locale` | `string` | `'en'` | Locale for localization |

### Settings Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `navigationPaneSettings` | `NavigationPaneSettingsModel` | `{...}` | Navigation pane settings |
| `toolbarSettings` | `ToolbarSettingsModel` | `{...}` | Toolbar settings |
| `detailsViewSettings` | `DetailsViewSettingsModel` | `{...}` | Details view column settings |
| `contextMenuSettings` | `ContextMenuSettingsModel` | `{...}` | Context menu settings |
| `uploadSettings` | `UploadSettingsModel` | `{...}` | Upload settings |

### Appearance Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `height` | `string \| number` | `'600px'` | Height of the File Manager |
| `width` | `string \| number` | `'100%'` | Width of the File Manager |
| `customClass` | `string` | `undefined` | Custom CSS class for the container |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `fileLoad` | `EventEmitter<any>` | Emitted when files are loaded |
| `fileOpen` | `EventEmitter<any>` | Emitted when a file is opened |
| `fileSelect` | `EventEmitter<any>` | Emitted when a file is selected |
| `fileDeselect` | `EventEmitter<any>` | Emitted when a file is deselected |
| `beforeFileLoad` | `EventEmitter<any>` | Emitted before files are loaded |
| `beforeFileOpen` | `EventEmitter<any>` | Emitted before a file is opened |
| `beforeDownload` | `EventEmitter<any>` | Emitted before a file is downloaded |
| `beforeUpload` | `EventEmitter<any>` | Emitted before a file is uploaded |
| `beforeImageLoad` | `EventEmitter<any>` | Emitted before an image is loaded |
| `beforeSend` | `EventEmitter<any>` | Emitted before an AJAX request is sent |
| `successFileUpload` | `EventEmitter<any>` | Emitted when file upload succeeds |
| `failureFileUpload` | `EventEmitter<any>` | Emitted when file upload fails |
| `created` | `EventEmitter<any>` | Emitted when File Manager is created |

## Methods

### Navigation Methods

```typescript
// Navigate to path
navigateTo(path: string): void

// Get current path
getCurrentPath(): string
```

### Selection Methods

```typescript
// Get selected items
getSelectedItems(): any[]

// Clear selection
clearSelection(): void
```

### Utility Methods

```typescript
// Refresh File Manager
refresh(): void

// Get File Manager instance
getFileManagerInstance(): SyncfusionFileManagerComponent | null
```

## FileManagerAjaxSettings Interface

```typescript
interface FileManagerAjaxSettings {
  url: string;                    // Base URL for file operations
  getImageUrl?: string;           // URL for getting images
  uploadUrl?: string;             // URL for file upload
  downloadUrl?: string;           // URL for file download
  [key: string]: any;             // Additional properties
}
```

## Examples

### Basic File Manager

```typescript
export class MyComponent {
  ajaxSettings: FileManagerAjaxSettings = {
    url: 'https://your-server.com/api/FileManager/FileOperations',
    getImageUrl: 'https://your-server.com/api/FileManager/GetImage',
    uploadUrl: 'https://your-server.com/api/FileManager/Upload',
    downloadUrl: 'https://your-server.com/api/FileManager/Download'
  };
}
```

```html
<app-file-manager
  [ajaxSettings]="ajaxSettings"
  [height]="'600px'">
</app-file-manager>
```

### File Manager with Custom View

```html
<app-file-manager
  [ajaxSettings]="ajaxSettings"
  [view]="'LargeIcons'"
  [showThumbnail]="true"
  [height]="'600px'">
</app-file-manager>
```

### File Manager with Custom Toolbar

```typescript
export class MyComponent {
  toolbarSettings: ToolbarSettingsModel = {
    visible: true,
    items: ['NewFolder', 'Upload', 'Delete', 'Download', 'Rename', 'Refresh']
  };
}
```

```html
<app-file-manager
  [ajaxSettings]="ajaxSettings"
  [toolbarSettings]="toolbarSettings"
  [height]="'600px'">
</app-file-manager>
```

### Programmatic Control

```typescript
export class MyComponent {
  @ViewChild('filemanager') filemanager!: FileManagerComponent;

  navigateToFolder(path: string): void {
    this.filemanager.navigateTo(path);
  }

  getSelectedFiles(): void {
    const files = this.filemanager.getSelectedItems();
    console.log('Selected files:', files);
  }

  onFileUpload(event: any): void {
    console.log('File uploaded:', event);
  }
}
```

```html
<app-file-manager
  #filemanager
  [ajaxSettings]="ajaxSettings"
  (successFileUpload)="onFileUpload($event)">
</app-file-manager>

<button (click)="navigateToFolder('/documents')">Go to Documents</button>
<button (click)="getSelectedFiles()">Get Selected Files</button>
```

## Server Configuration

File Manager requires a backend server to handle file operations. You need to implement endpoints for:

1. **File Operations** (`url`): Read, create, delete, rename, copy, move files/folders
2. **Get Image** (`getImageUrl`): Get image thumbnails
3. **Upload** (`uploadUrl`): Handle file uploads
4. **Download** (`downloadUrl`): Handle file downloads

### Example Server Endpoints

```typescript
// File Operations
POST /api/FileManager/FileOperations
Body: { action: 'read', path: '/folder' }

// Get Image
GET /api/FileManager/GetImage?path=/image.jpg

// Upload
POST /api/FileManager/Upload
Body: FormData with file

// Download
GET /api/FileManager/Download?path=/file.pdf
```

## Styling

The component uses Glass Morphism styling by default and supports dark mode. You can customize the appearance using:

1. **Custom CSS Classes**: Use `customClass` for container styling
2. **SCSS Variables**: Override design tokens in `src/styles/_design-tokens.scss`

### Custom Styling Example

```scss
// component.scss
.my-file-manager {
  ::ng-deep {
    .e-filemanager {
      .e-toolbar {
        background: rgba(79, 70, 229, 0.1);
      }
    }
  }
}
```

```html
<app-file-manager
  [ajaxSettings]="ajaxSettings"
  customClass="my-file-manager">
</app-file-manager>
```

## Best Practices

1. **Server Security**: Implement proper authentication and authorization
2. **File Size Limits**: Set appropriate `maxFileSize` in upload settings
3. **File Type Restrictions**: Use `allowedExtensions` to restrict file types
4. **Error Handling**: Handle upload/download errors gracefully
5. **Performance**: Optimize for large file directories
6. **Accessibility**: Ensure keyboard navigation and screen reader support

## Troubleshooting

### File Manager Not Loading

- Ensure `ajaxSettings.url` is correctly configured
- Check that server endpoints are accessible
- Verify CORS settings on the server

### Upload Not Working

- Check `uploadUrl` in `ajaxSettings`
- Verify server accepts file uploads
- Check `uploadSettings` configuration

### Images Not Displaying

- Verify `getImageUrl` is configured
- Check image path format
- Ensure server returns images correctly

## Related Components

- **File Upload**: For simple file upload
- **Image Upload**: For image-specific uploads
- **Data Grid**: For tabular file listings

## API Reference

For complete API reference, see [Syncfusion File Manager Documentation](https://ej2.syncfusion.com/angular/documentation/file-manager/getting-started/).

