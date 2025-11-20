import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent, FileManagerAjaxSettings } from '../../../../shared/components/file-manager/file-manager.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-file-manager-demo',
  standalone: true,
  imports: [CommonModule, FileManagerComponent, GlassCardComponent],
  templateUrl: './file-manager-demo.component.html',
  styleUrls: ['./file-manager-demo.component.scss']
})
export class FileManagerDemoComponent {
  @ViewChild('filemanager') filemanager!: FileManagerComponent;

  // File Manager settings
  ajaxSettings: FileManagerAjaxSettings = {
    url: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/FileOperations',
    getImageUrl: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/GetImage',
    uploadUrl: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/Upload',
    downloadUrl: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/Download'
  };

  view: 'Details' | 'LargeIcons' = 'Details';
  allowMultiSelection: boolean = true;
  showFileExtension: boolean = true;
  showHiddenItems: boolean = false;
  showThumbnail: boolean = true;
  enablePersistence: boolean = false;

  // Methods
  refresh(): void {
    this.filemanager?.refresh();
  }

  getCurrentPath(): void {
    const path = this.filemanager?.getCurrentPath();
    if (path) {
      alert(`Current Path: ${path}`);
    } else {
      alert('No path available');
    }
  }

  getSelectedItems(): void {
    const items = this.filemanager?.getSelectedItems();
    if (items && items.length > 0) {
      console.log('Selected items:', items);
      alert(`Selected ${items.length} item(s)`);
    } else {
      alert('No items selected');
    }
  }

  clearSelection(): void {
    this.filemanager?.clearSelection();
  }

  toggleView(): void {
    this.view = this.view === 'Details' ? 'LargeIcons' : 'Details';
  }

  onFileLoad(event: any): void {
    console.log('File loaded:', event);
  }

  onFileOpen(event: any): void {
    console.log('File opened:', event);
  }

  onFileSelect(event: any): void {
    console.log('File selected:', event);
  }

  onBeforeUpload(event: any): void {
    console.log('Before upload:', event);
  }

  onSuccessFileUpload(event: any): void {
    console.log('Upload success:', event);
    alert('File uploaded successfully!');
  }

  onFailureFileUpload(event: any): void {
    console.log('Upload failed:', event);
    alert('File upload failed!');
  }
}

