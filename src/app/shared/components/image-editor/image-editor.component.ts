import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageEditorModule } from '@syncfusion/ej2-angular-image-editor';
import {
  ImageEditorComponent as SyncfusionImageEditorComponent
} from '@syncfusion/ej2-angular-image-editor';

export interface ImageEditorConfig {
  width?: string | number;
  height?: string | number;
  toolbar?: string[];
  selection?: any;
  annotationSettings?: any;
  shapeSettings?: any;
  freehandDrawSettings?: any;
  customClass?: string;
}

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [CommonModule, ImageEditorModule],
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements OnInit, OnDestroy {
  @ViewChild('imageEditor', { static: false }) imageEditor!: SyncfusionImageEditorComponent;

  // Size
  @Input() width: string | number = '100%';
  @Input() height: string | number = '600px';
  
  // Toolbar
  @Input() toolbar: string[] = [
    'Annotate', 'Crop', 'Transform', 'Finetune', 'Filter', 'ZoomIn', 'ZoomOut', 'Reset', 'Save'
  ];
  
  // Features
  @Input() allowUndoRedo: boolean = true;
  
  // Styling
  @Input() customClass: string = '';
  
  // Events
  @Output() created = new EventEmitter<any>();
  @Output() imageLoaded = new EventEmitter<any>();
  @Output() toolbarItemClicked = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<any>();
  @Output() shapeChanged = new EventEmitter<any>();
  @Output() imageChanged = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Open image from URL
   */
  open(imageUrl: string): void {
    if (this.imageEditor) {
      this.imageEditor.open(imageUrl);
    }
  }

  /**
   * Get image data URL
   */
  getImageData(): string {
    if (this.imageEditor) {
      const imageData = this.imageEditor.getImageData();
      // Convert ImageData to data URL if needed
      if (imageData && typeof imageData === 'object' && 'data' in imageData) {
        // ImageData object - convert to data URL
        const canvas = document.createElement('canvas');
        canvas.width = (imageData as any).width || 0;
        canvas.height = (imageData as any).height || 0;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(imageData as ImageData, 0, 0);
          return canvas.toDataURL();
        }
      }
      // If it's already a string, return it
      if (typeof imageData === 'string') {
        return imageData;
      }
      // Otherwise, try to get canvas data URL
      const editor = this.imageEditor as any;
      if (editor.imageCanvas) {
        return editor.imageCanvas.toDataURL();
      }
      return '';
    }
    return '';
  }

  /**
   * Get image as Blob
   */
  async getImageBlob(): Promise<Blob> {
    if (this.imageEditor) {
      const dataUrl = this.getImageData();
      if (dataUrl) {
        const response = await fetch(dataUrl);
        return await response.blob();
      }
    }
    return Promise.reject('Image editor not initialized');
  }

  /**
   * Export image
   */
  export(type: 'PNG' | 'JPEG' | 'SVG', fileName?: string): void {
    if (this.imageEditor) {
      this.imageEditor.export(type, fileName || 'image');
    }
  }

  /**
   * Save image (triggers download)
   */
  save(): void {
    if (this.imageEditor) {
      // Use export to save
      this.imageEditor.export('PNG' as any, 'image');
    }
  }

  /**
   * Reset image
   */
  reset(): void {
    if (this.imageEditor) {
      this.imageEditor.reset();
    }
  }

  /**
   * Undo
   */
  undo(): void {
    if (this.imageEditor) {
      this.imageEditor.undo();
    }
  }

  /**
   * Redo
   */
  redo(): void {
    if (this.imageEditor) {
      this.imageEditor.redo();
    }
  }

  /**
   * Crop image
   */
  crop(): void {
    if (this.imageEditor) {
      this.imageEditor.crop();
    }
  }

  /**
   * Transform image
   */
  transform(type: 'RotateLeft' | 'RotateRight' | 'FlipHorizontal' | 'FlipVertical'): void {
    if (this.imageEditor) {
      const editor = this.imageEditor as any;
      const ctx = editor.getContext ? editor.getContext('2d') : null;
      
      switch (type) {
        case 'RotateLeft':
          editor.rotateImage('rotateleft');
          break;
        case 'RotateRight':
          editor.rotateImage('rotateright');
          break;
        case 'FlipHorizontal':
          if (ctx) {
            editor.horizontalFlip(ctx);
          }
          break;
        case 'FlipVertical':
          if (ctx) {
            editor.verticalFlip(ctx);
          }
          break;
      }
    }
  }

  /**
   * Apply filter
   */
  applyFilter(filter: string): void {
    if (this.imageEditor) {
      this.imageEditor.applyImageFilter(filter as any);
    }
  }

  /**
   * Finetune image
   */
  finetune(type: string, value: number): void {
    if (this.imageEditor) {
      this.imageEditor.finetuneImage(type as any, value);
    }
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    if (this.imageEditor) {
      this.imageEditor.zoom(1.1);
    }
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    if (this.imageEditor) {
      this.imageEditor.zoom(0.9);
    }
  }

  /**
   * Set zoom
   */
  setZoom(factor: number): void {
    if (this.imageEditor) {
      this.imageEditor.zoom(factor);
    }
  }

  /**
   * Refresh
   */
  refresh(): void {
    if (this.imageEditor) {
      this.imageEditor.dataBind();
    }
  }

  /**
   * Get image editor instance
   */
  getImageEditorInstance(): SyncfusionImageEditorComponent | null {
    return this.imageEditor || null;
  }

  /**
   * Event handlers
   */
  onCreated(args: any): void {
    this.created.emit(args);
  }

  onImageLoaded(args: any): void {
    this.imageLoaded.emit(args);
  }

  onToolbarItemClicked(args: any): void {
    this.toolbarItemClicked.emit(args);
  }

  onSelectionChanged(args: any): void {
    this.selectionChanged.emit(args);
  }

  onShapeChanged(args: any): void {
    this.shapeChanged.emit(args);
  }

  onImageChanged(args: any): void {
    this.imageChanged.emit(args);
  }
}

