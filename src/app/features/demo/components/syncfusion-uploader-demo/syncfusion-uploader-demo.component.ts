import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncfusionUploaderWrapperComponent } from '../../../../shared/components/syncfusion-uploader/syncfusion-uploader.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-syncfusion-uploader-demo',
  standalone: true,
  imports: [CommonModule, SyncfusionUploaderWrapperComponent, GlassCardComponent],
  templateUrl: './syncfusion-uploader-demo.component.html',
  styleUrls: ['./syncfusion-uploader-demo.component.scss']
})
export class SyncfusionUploaderDemoComponent {
  @ViewChild('uploader') uploader!: SyncfusionUploaderWrapperComponent;

  // Upload settings
  asyncSettings: any = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove'
  };

  allowedExtensions: string = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif';
  autoUpload: boolean = false;
  multiple: boolean = true;
  maxFileSize: number = 10 * 1024 * 1024; // 10MB
  minFileSize: number = 0;
  showFileList: boolean = true;
  sequentialUpload: boolean = false;
  directoryUpload: boolean = false;

  // Methods
  upload(): void {
    this.uploader?.upload();
  }

  remove(): void {
    this.uploader?.remove();
  }

  clearAll(): void {
    this.uploader?.clearAll();
  }

  cancel(): void {
    this.uploader?.cancel();
  }

  pause(): void {
    this.uploader?.pause();
  }

  resume(): void {
    this.uploader?.resume();
  }

  getFiles(): void {
    const files = this.uploader?.getFiles();
    if (files && files.length > 0) {
      console.log('Files:', files);
      alert(`Total files: ${files.length}`);
    } else {
      alert('No files');
    }
  }

  getSelectedFiles(): void {
    const files = this.uploader?.getSelectedFiles();
    if (files && files.length > 0) {
      console.log('Selected files:', files);
      alert(`Selected ${files.length} file(s)`);
    } else {
      alert('No files selected');
    }
  }

  refresh(): void {
    this.uploader?.refresh();
  }

  onUploading(event: any): void {
    console.log('Uploading:', event);
  }

  onSuccess(event: any): void {
    console.log('Upload success:', event);
    alert('File uploaded successfully!');
  }

  onFailure(event: any): void {
    console.log('Upload failed:', event);
    alert('File upload failed!');
  }

  onFileSelected(event: any): void {
    console.log('File selected:', event);
  }

  onProgress(event: any): void {
    console.log('Upload progress:', event);
  }

  toggleAutoUpload(): void {
    this.autoUpload = !this.autoUpload;
  }

  toggleMultiple(): void {
    this.multiple = !this.multiple;
  }

  changeMaxFileSize(size: number): void {
    this.maxFileSize = size;
  }

  onMaxFileSizeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const sizeInMB = +target.value;
      this.maxFileSize = sizeInMB * 1024 * 1024;
    }
  }

  onAllowedExtensionsChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.allowedExtensions = target.value;
    }
  }
}

