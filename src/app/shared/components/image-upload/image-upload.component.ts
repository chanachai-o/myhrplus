import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ImageUploadConfig {
  maxSize?: number; // in MB
  maxFiles?: number;
  allowedTypes?: string[];
  aspectRatio?: number; // width/height
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  enableCrop?: boolean;
  enablePreview?: boolean;
}

export interface UploadedImage {
  file: File;
  preview?: string;
  url?: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImageUploadComponent,
      multi: true
    }
  ]
})
export class ImageUploadComponent implements OnInit, ControlValueAccessor {
  @Input() label = 'อัปโหลดรูปภาพ';
  @Input() placeholder = 'ลากไฟล์มาวางที่นี่หรือคลิกเพื่อเลือก';
  @Input() accept = 'image/*';
  @Input() multiple = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() config: ImageUploadConfig = {
    maxSize: 5, // 5MB
    maxFiles: 1,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    enablePreview: true
  };

  @Output() fileSelect = new EventEmitter<UploadedImage[]>();
  @Output() fileRemove = new EventEmitter<UploadedImage>();
  @Output() error = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploadedImages: UploadedImage[] = [];
  isDragging = false;
  errors: string[] = [];

  private onChange = (value: UploadedImage[]) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    if (!this.config.maxSize) this.config.maxSize = 5;
    if (!this.config.maxFiles) this.config.maxFiles = this.multiple ? 5 : 1;
    if (!this.config.allowedTypes) {
      this.config.allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    }
    if (this.config.enablePreview === undefined) {
      this.config.enablePreview = true;
    }
  }

  writeValue(value: UploadedImage[]): void {
    if (value) {
      this.uploadedImages = value;
    }
  }

  registerOnChange(fn: (value: UploadedImage[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private async handleFiles(files: File[]): Promise<void> {
    this.errors = [];

    // Check max files
    const totalFiles = this.uploadedImages.length + files.length;
    if (totalFiles > this.config.maxFiles!) {
      const error = `สามารถอัปโหลดได้สูงสุด ${this.config.maxFiles} ไฟล์`;
      this.errors.push(error);
      this.error.emit(error);
      return;
    }

    for (const file of files) {
      // Check file type
      if (!this.config.allowedTypes!.includes(file.type)) {
        const error = `ไฟล์ ${file.name} ไม่ใช่ประเภทที่รองรับ (${this.config.allowedTypes!.join(', ')})`;
        this.errors.push(error);
        this.error.emit(error);
        continue;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > this.config.maxSize!) {
        const error = `ไฟล์ ${file.name} ใหญ่เกินไป (สูงสุด ${this.config.maxSize}MB)`;
        this.errors.push(error);
        this.error.emit(error);
        continue;
      }

      // Create preview
      const preview = await this.createPreview(file);

      // Get image dimensions
      const dimensions = await this.getImageDimensions(file);

      const uploadedImage: UploadedImage = {
        file,
        preview,
        name: file.name,
        size: file.size,
        type: file.type,
        width: dimensions.width,
        height: dimensions.height
      };

      this.uploadedImages.push(uploadedImage);
    }

    this.onChange(this.uploadedImages);
    this.onTouched();
    this.fileSelect.emit(this.uploadedImages);
  }

  private createPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  removeImage(index: number): void {
    if (this.disabled) return;

    const removed = this.uploadedImages.splice(index, 1)[0];
    this.onChange(this.uploadedImages);
    this.onTouched();
    this.fileRemove.emit(removed);
  }

  openFileDialog(): void {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  get canAddMore(): boolean {
    return this.uploadedImages.length < this.config.maxFiles!;
  }
}

