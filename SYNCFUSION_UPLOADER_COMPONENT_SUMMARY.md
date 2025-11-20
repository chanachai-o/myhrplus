# Syncfusion Uploader Component Summary

## Component Information

- **Component Name**: `SyncfusionUploaderWrapperComponent`
- **Selector**: `app-syncfusion-uploader`
- **Location**: `src/app/shared/components/syncfusion-uploader/`
- **Type**: Standalone Component
- **Dependencies**: `@syncfusion/ej2-angular-inputs` (UploaderModule)

## Quick Start

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

## Key Features

✅ **Drag & Drop**: Drag and drop files to upload  
✅ **Multiple Files**: Upload multiple files at once  
✅ **Progress Tracking**: Real-time upload progress  
✅ **Pause/Resume**: Pause and resume uploads  
✅ **File Type Restrictions**: Restrict by file extensions  
✅ **File Size Limits**: Set min/max file size  
✅ **Auto Upload**: Automatic upload on selection  
✅ **Sequential Upload**: Upload files one at a time  
✅ **Directory Upload**: Upload entire directories  
✅ **File List**: Display uploaded files with details  
✅ **Remove Files**: Remove files before/after upload  
✅ **Cancel Upload**: Cancel ongoing uploads  
✅ **Custom Templates**: Customize file item display  
✅ **Glass Morphism Styling**: Modern glass effect design  
✅ **Dark Mode Support**: Automatic dark mode styling  
✅ **Event Handling**: Upload, progress, success, failure events  
✅ **Programmatic Control**: Upload, remove, cancel via methods  

## Input Properties

### Required
- `asyncSettings` (any): Server endpoints for upload/remove

### Optional
- `allowedExtensions` (string): Allowed file extensions (default: '')
- `autoUpload` (boolean): Auto upload on selection (default: false)
- `multiple` (boolean): Multiple file selection (default: true)
- `maxFileSize` (number): Max file size in bytes (default: 0 = unlimited)
- `minFileSize` (number): Min file size in bytes (default: 0)
- `sequentialUpload` (boolean): Sequential upload (default: false)
- `directoryUpload` (boolean): Directory upload (default: false)
- `showFileList` (boolean): Show file list (default: true)
- `height` (string | number): Uploader height (default: 'auto')
- `width` (string | number): Uploader width (default: '100%')
- `config` (UploaderConfig): Configuration object

## Output Events

- `uploading`: Emitted when upload starts
- `success`: Emitted when upload succeeds
- `failure`: Emitted when upload fails
- `removing`: Emitted when removal starts
- `removed`: Emitted when file is removed
- `fileSelected`: Emitted when file is selected
- `beforeUpload`: Emitted before upload
- `beforeRemove`: Emitted before removal
- `progress`: Emitted during upload progress
- `canceling`: Emitted when cancellation starts
- `cancelled`: Emitted when upload is cancelled
- `pausing`: Emitted when pause starts
- `paused`: Emitted when upload is paused
- `resuming`: Emitted when resume starts
- `resumed`: Emitted when upload is resumed
- `created`: Emitted when uploader is created

## Methods

- `upload(files?)`: Upload files
- `remove(files?)`: Remove files
- `clearAll()`: Clear all files
- `cancel(files?)`: Cancel upload
- `pause(files?)`: Pause upload
- `resume(files?)`: Resume upload
- `getFiles()`: Get all files
- `getSelectedFiles()`: Get selected files
- `refresh()`: Refresh uploader
- `getUploaderInstance()`: Get Syncfusion instance

## AsyncSettings Structure

```typescript
interface AsyncSettings {
  saveUrl: string;        // URL for file upload
  removeUrl: string;      // URL for file removal
  chunkSize?: number;     // Chunk size for chunk upload
  retryCount?: number;    // Retry count on failure
  retryAfterDelay?: number; // Delay before retry
}
```

## Common Use Cases

1. **Document Upload**: Upload documents (PDF, DOC, etc.)
2. **Image Upload**: Upload images with preview
3. **Media Upload**: Upload audio/video files
4. **Bulk Upload**: Upload multiple files at once
5. **Resumable Upload**: Upload large files with pause/resume
6. **Form Integration**: Integrate with forms for file attachments

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Performance Considerations

- Use `sequentialUpload` for large files
- Set appropriate `maxFileSize` limits
- Implement chunk upload for very large files
- Use `pause`/`resume` for better user experience

## Server Requirements

Uploader requires backend server with endpoints for:
- File upload (saveUrl)
- File removal (removeUrl)

## Demo

See the live demo at `/demo/syncfusion-uploader` for examples and interactive controls.

**Note**: The demo uses Syncfusion's sample service. For production, configure your own upload endpoint.

## Related Documentation

- [Full Guide](./SYNCFUSION_UPLOADER_COMPONENT_GUIDE.md)
- [Syncfusion Uploader Docs](https://ej2.syncfusion.com/angular/documentation/uploader/getting-started/)

