import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import {
  UploaderComponent as SyncfusionUploaderComponent,
  FileInfo
} from '@syncfusion/ej2-angular-inputs';

export interface UploaderConfig {
  asyncSettings?: any;
  allowedExtensions?: string;
  autoUpload?: boolean;
  buttons?: any;
  directoryUpload?: boolean;
  dropArea?: HTMLElement | string;
  enablePersistence?: boolean;
  enableRtl?: boolean;
  files?: FileInfo[];
  htmlAttributes?: { [key: string]: string };
  locale?: string;
  maxFileSize?: number;
  minFileSize?: number;
  multiple?: boolean;
  sequentialUpload?: boolean;
  showFileList?: boolean;
  template?: string;
  height?: string | number;
  width?: string | number;
  customClass?: string;
}

@Component({
  selector: 'app-syncfusion-uploader',
  standalone: true,
  imports: [CommonModule, UploaderModule],
  templateUrl: './syncfusion-uploader.component.html',
  styleUrls: ['./syncfusion-uploader.component.scss']
})
export class SyncfusionUploaderWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('uploader', { static: false }) uploader!: SyncfusionUploaderComponent;

  // Upload Settings
  @Input() asyncSettings: any = {
    saveUrl: '',
    removeUrl: ''
  };
  @Input() allowedExtensions: string = '';
  @Input() autoUpload: boolean = false;
  @Input() buttons: any = {};
  @Input() directoryUpload: boolean = false;
  @Input() dropArea?: HTMLElement | string;
  @Input() enablePersistence: boolean = false;
  @Input() enableRtl: boolean = false;
  @Input() files: FileInfo[] = [];
  @Input() htmlAttributes: { [key: string]: string } = {};
  @Input() locale: string = 'en';
  @Input() maxFileSize: number = 0; // 0 = unlimited
  @Input() minFileSize: number = 0;
  @Input() multiple: boolean = true;
  @Input() sequentialUpload: boolean = false;
  @Input() showFileList: boolean = true;
  @Input() template?: string;

  // Appearance
  @Input() height: string | number = 'auto';
  @Input() width: string | number = '100%';
  @Input() customClass?: string;
  @Input() config?: UploaderConfig;

  // Events
  @Output() uploading = new EventEmitter<any>();
  @Output() success = new EventEmitter<any>();
  @Output() failure = new EventEmitter<any>();
  @Output() removing = new EventEmitter<any>();
  @Output() removed = new EventEmitter<any>();
  @Output() fileSelected = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();
  @Output() beforeUpload = new EventEmitter<any>();
  @Output() beforeRemove = new EventEmitter<any>();
  @Output() progress = new EventEmitter<any>();
  @Output() canceling = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<any>();
  @Output() pausing = new EventEmitter<any>();
  @Output() paused = new EventEmitter<any>();
  @Output() resuming = new EventEmitter<any>();
  @Output() resumed = new EventEmitter<any>();
  @Output() created = new EventEmitter<any>();

  ngOnInit(): void {
    // Apply config if provided
    if (this.config) {
      this.asyncSettings = this.config.asyncSettings || this.asyncSettings;
      this.allowedExtensions = this.config.allowedExtensions ?? this.allowedExtensions;
      this.autoUpload = this.config.autoUpload ?? this.autoUpload;
      this.buttons = this.config.buttons || this.buttons;
      this.directoryUpload = this.config.directoryUpload ?? this.directoryUpload;
      this.enablePersistence = this.config.enablePersistence ?? this.enablePersistence;
      this.enableRtl = this.config.enableRtl ?? this.enableRtl;
      this.files = this.config.files || this.files;
      this.htmlAttributes = this.config.htmlAttributes || this.htmlAttributes;
      this.locale = this.config.locale || this.locale;
      this.maxFileSize = this.config.maxFileSize ?? this.maxFileSize;
      this.minFileSize = this.config.minFileSize ?? this.minFileSize;
      this.multiple = this.config.multiple ?? this.multiple;
      this.sequentialUpload = this.config.sequentialUpload ?? this.sequentialUpload;
      this.showFileList = this.config.showFileList ?? this.showFileList;
      this.template = this.config.template || this.template;
      this.height = this.config.height ?? this.height;
      this.width = this.config.width ?? this.width;
      this.customClass = this.config.customClass || this.customClass;
    }
  }

  ngAfterViewInit(): void {
    if (this.uploader) {
      this.created.emit({ uploader: this.uploader });
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get Uploader instance
   */
  getUploaderInstance(): SyncfusionUploaderComponent | null {
    return this.uploader || null;
  }

  /**
   * Upload files
   */
  upload(files?: FileInfo[]): void {
    if (this.uploader) {
      if (files) {
        this.uploader.upload(files as any);
      } else {
        this.uploader.upload();
      }
    }
  }

  /**
   * Remove files
   */
  remove(files?: FileInfo[]): void {
    if (this.uploader) {
      if (files) {
        this.uploader.remove(files as any);
      } else {
        this.uploader.remove();
      }
    }
  }

  /**
   * Clear all files
   */
  clearAll(): void {
    if (this.uploader) {
      this.uploader.clearAll();
    }
  }

  /**
   * Cancel upload
   */
  cancel(files?: FileInfo[]): void {
    if (this.uploader) {
      if (files) {
        this.uploader.cancel(files as any);
      } else {
        this.uploader.cancel();
      }
    }
  }

  /**
   * Pause upload
   */
  pause(files?: FileInfo[]): void {
    if (this.uploader) {
      if (files) {
        this.uploader.pause(files as any);
      } else {
        this.uploader.pause();
      }
    }
  }

  /**
   * Resume upload
   */
  resume(files?: FileInfo[]): void {
    if (this.uploader) {
      if (files) {
        this.uploader.resume(files as any);
      } else {
        this.uploader.resume();
      }
    }
  }

  /**
   * Get files
   */
  getFiles(): FileInfo[] {
    if (this.uploader) {
      return this.uploader.getFilesData() as FileInfo[];
    }
    return [];
  }

  /**
   * Get selected files
   */
  getSelectedFiles(): FileInfo[] {
    if (this.uploader) {
      // getSelectedFiles is private, use getFilesData and filter selected
      const allFiles = this.uploader.getFilesData() as any[];
      return allFiles.filter((file: any) => file.status === 'Selected' || file.selected) as FileInfo[];
    }
    return [];
  }

  /**
   * Refresh uploader
   */
  refresh(): void {
    if (this.uploader) {
      this.uploader.refresh();
    }
  }

  /**
   * Event handlers
   */
  onUploading(event: any): void {
    this.uploading.emit(event);
  }

  onSuccess(event: any): void {
    this.success.emit(event);
  }

  onFailure(event: any): void {
    this.failure.emit(event);
  }

  onRemoving(event: any): void {
    this.removing.emit(event);
  }

  onRemoved(event: any): void {
    this.removed.emit(event);
  }

  onFileSelected(event: any): void {
    this.fileSelected.emit(event);
  }

  onFileRemoved(event: any): void {
    this.fileRemoved.emit(event);
  }

  onBeforeUpload(event: any): void {
    this.beforeUpload.emit(event);
  }

  onBeforeRemove(event: any): void {
    this.beforeRemove.emit(event);
  }

  onProgress(event: any): void {
    this.progress.emit(event);
  }

  onCanceling(event: any): void {
    this.canceling.emit(event);
  }

  onCancelled(event: any): void {
    this.cancelled.emit(event);
  }

  onPausing(event: any): void {
    this.pausing.emit(event);
  }

  onPaused(event: any): void {
    this.paused.emit(event);
  }

  onResuming(event: any): void {
    this.resuming.emit(event);
  }

  onResumed(event: any): void {
    this.resumed.emit(event);
  }

  onCreated(event: any): void {
    this.created.emit(event);
  }
}

