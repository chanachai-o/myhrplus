import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerModule } from '@syncfusion/ej2-angular-filemanager';
import {
  FileManagerComponent as SyncfusionFileManagerComponent,
  NavigationPaneSettingsModel,
  ToolbarSettingsModel,
  DetailsViewSettingsModel,
  ContextMenuSettingsModel,
  UploadSettingsModel
} from '@syncfusion/ej2-angular-filemanager';

export interface FileManagerAjaxSettings {
  url: string;
  getImageUrl?: string;
  uploadUrl?: string;
  downloadUrl?: string;
  [key: string]: any;
}

export interface FileManagerConfig {
  ajaxSettings?: FileManagerAjaxSettings;
  view?: 'Details' | 'LargeIcons';
  allowMultiSelection?: boolean;
  showFileExtension?: boolean;
  showHiddenItems?: boolean;
  showThumbnail?: boolean;
  enablePersistence?: boolean;
  enableRtl?: boolean;
  locale?: string;
  navigationPaneSettings?: NavigationPaneSettingsModel;
  toolbarSettings?: ToolbarSettingsModel;
  detailsViewSettings?: DetailsViewSettingsModel;
  contextMenuSettings?: ContextMenuSettingsModel;
  uploadSettings?: UploadSettingsModel;
  height?: string | number;
  width?: string | number;
  customClass?: string;
}

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [CommonModule, FileManagerModule],
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('filemanager', { static: false }) filemanager!: SyncfusionFileManagerComponent;

  // Data Source
  @Input() ajaxSettings: FileManagerAjaxSettings = {
    url: ''
  };

  // View Settings
  @Input() view: 'Details' | 'LargeIcons' = 'Details';
  @Input() allowMultiSelection: boolean = true;
  @Input() showFileExtension: boolean = true;
  @Input() showHiddenItems: boolean = false;
  @Input() showThumbnail: boolean = true;

  // Behavior
  @Input() enablePersistence: boolean = false;
  @Input() enableRtl: boolean = false;
  @Input() locale: string = 'en';

  // Settings
  @Input() navigationPaneSettings: NavigationPaneSettingsModel = {
    visible: true,
    maxWidth: '250px',
    minWidth: '200px'
  };
  @Input() toolbarSettings: ToolbarSettingsModel = {
    visible: true,
    items: ['NewFolder', 'Upload', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Cut', 'Copy', 'Paste', 'Selection', 'View', 'Details']
  };
  @Input() detailsViewSettings: DetailsViewSettingsModel = {
    columns: [
      { field: 'name', headerText: 'Name', minWidth: 120, width: 'auto' },
      { field: 'size', headerText: 'Size', minWidth: 120, width: 'auto', template: '' },
      { field: 'dateModified', headerText: 'Date Modified', minWidth: 120, width: 'auto' },
      { field: 'type', headerText: 'Type', minWidth: 120, width: 'auto' }
    ]
  };
  @Input() contextMenuSettings: ContextMenuSettingsModel = {
    file: ['Open', '|', 'Cut', 'Copy', 'Delete', 'Rename', '|', 'Details'],
    folder: ['Open', '|', 'Cut', 'Copy', 'Paste', 'Delete', 'Rename', '|', 'Details'],
    layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', '|', 'Details', '|', 'SelectAll'],
    visible: true
  };
  @Input() uploadSettings: UploadSettingsModel = {
    autoUpload: false,
    minFileSize: 0,
    maxFileSize: 0,
    allowedExtensions: ''
  };

  // Appearance
  @Input() height: string | number = '600px';
  @Input() width: string | number = '100%';
  @Input() customClass?: string;
  @Input() config?: FileManagerConfig;

  // Events
  @Output() fileLoad = new EventEmitter<any>();
  @Output() fileOpen = new EventEmitter<any>();
  @Output() fileSelect = new EventEmitter<any>();
  @Output() fileDeselect = new EventEmitter<any>();
  @Output() beforeFileLoad = new EventEmitter<any>();
  @Output() beforeFileOpen = new EventEmitter<any>();
  @Output() beforeDownload = new EventEmitter<any>();
  @Output() beforeUpload = new EventEmitter<any>();
  @Output() beforeImageLoad = new EventEmitter<any>();
  @Output() beforeSend = new EventEmitter<any>();
  @Output() successFileUpload = new EventEmitter<any>();
  @Output() failureFileUpload = new EventEmitter<any>();
  @Output() created = new EventEmitter<any>();

  ngOnInit(): void {
    // Apply config if provided
    if (this.config) {
      this.ajaxSettings = this.config.ajaxSettings || this.ajaxSettings;
      this.view = this.config.view ?? this.view;
      this.allowMultiSelection = this.config.allowMultiSelection ?? this.allowMultiSelection;
      this.showFileExtension = this.config.showFileExtension ?? this.showFileExtension;
      this.showHiddenItems = this.config.showHiddenItems ?? this.showHiddenItems;
      this.showThumbnail = this.config.showThumbnail ?? this.showThumbnail;
      this.enablePersistence = this.config.enablePersistence ?? this.enablePersistence;
      this.enableRtl = this.config.enableRtl ?? this.enableRtl;
      this.locale = this.config.locale || this.locale;
      this.navigationPaneSettings = this.config.navigationPaneSettings || this.navigationPaneSettings;
      this.toolbarSettings = this.config.toolbarSettings || this.toolbarSettings;
      this.detailsViewSettings = this.config.detailsViewSettings || this.detailsViewSettings;
      this.contextMenuSettings = this.config.contextMenuSettings || this.contextMenuSettings;
      this.uploadSettings = this.config.uploadSettings || this.uploadSettings;
      this.height = this.config.height ?? this.height;
      this.width = this.config.width ?? this.width;
      this.customClass = this.config.customClass || this.customClass;
    }
  }

  ngAfterViewInit(): void {
    if (this.filemanager) {
      this.created.emit({ filemanager: this.filemanager });
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get File Manager instance
   */
  getFileManagerInstance(): SyncfusionFileManagerComponent | null {
    return this.filemanager || null;
  }

  /**
   * Refresh File Manager
   */
  refresh(): void {
    if (this.filemanager) {
      this.filemanager.refresh();
    }
  }

  /**
   * Navigate to path
   */
  navigateTo(path: string): void {
    if (this.filemanager) {
      this.filemanager.path = path;
      this.filemanager.refresh();
    }
  }

  /**
   * Get current path
   */
  getCurrentPath(): string {
    if (this.filemanager) {
      return this.filemanager.path || '';
    }
    return '';
  }

  /**
   * Get selected items
   */
  getSelectedItems(): any[] {
    if (this.filemanager) {
      return this.filemanager.selectedItems || [];
    }
    return [];
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    if (this.filemanager) {
      this.filemanager.selectedItems = [];
    }
  }

  /**
   * Event handlers
   */
  onFileLoad(event: any): void {
    this.fileLoad.emit(event);
  }

  onFileOpen(event: any): void {
    this.fileOpen.emit(event);
  }

  onFileSelect(event: any): void {
    this.fileSelect.emit(event);
  }

  onFileDeselect(event: any): void {
    this.fileDeselect.emit(event);
  }

  onBeforeFileLoad(event: any): void {
    this.beforeFileLoad.emit(event);
  }

  onBeforeFileOpen(event: any): void {
    this.beforeFileOpen.emit(event);
  }

  onBeforeDownload(event: any): void {
    this.beforeDownload.emit(event);
  }

  onBeforeUpload(event: any): void {
    this.beforeUpload.emit(event);
  }

  onBeforeImageLoad(event: any): void {
    this.beforeImageLoad.emit(event);
  }

  onBeforeSend(event: any): void {
    this.beforeSend.emit(event);
  }

  onSuccessFileUpload(event: any): void {
    this.successFileUpload.emit(event);
  }

  onFailureFileUpload(event: any): void {
    this.failureFileUpload.emit(event);
  }

  onCreated(event: any): void {
    this.created.emit(event);
  }
}

