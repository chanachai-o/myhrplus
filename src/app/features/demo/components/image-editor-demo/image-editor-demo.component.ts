import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageEditorComponent } from '../../../../shared/components/image-editor/image-editor.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-image-editor-demo',
  standalone: true,
  imports: [CommonModule, ImageEditorComponent, GlassCardComponent],
  templateUrl: './image-editor-demo.component.html',
  styleUrls: ['./image-editor-demo.component.scss']
})
export class ImageEditorDemoComponent {
  @ViewChild('editor') editor!: ImageEditorComponent;

  // Sample image URL
  sampleImageUrl = 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Sample+Image';

  // Event handlers
  onCreated(event: any): void {
    console.log('Image Editor created:', event);
  }

  onImageLoaded(event: any): void {
    console.log('Image loaded:', event);
  }

  onToolbarItemClicked(event: any): void {
    console.log('Toolbar item clicked:', event);
  }

  onImageChanged(event: any): void {
    console.log('Image changed:', event);
  }

  // Load sample image
  loadSampleImage(): void {
    if (this.editor) {
      // Open image after component is created
      setTimeout(() => {
        this.editor.open(this.sampleImageUrl);
      }, 100);
    }
  }

  // Export methods
  exportAsPng(): void {
    if (this.editor) {
      this.editor.export('PNG', 'image');
    }
  }

  exportAsJpeg(): void {
    if (this.editor) {
      this.editor.export('JPEG', 'image');
    }
  }

  exportAsSvg(): void {
    if (this.editor) {
      this.editor.export('SVG', 'image');
    }
  }

  // Image operations
  resetImage(): void {
    if (this.editor) {
      this.editor.reset();
    }
  }

  undoAction(): void {
    if (this.editor) {
      this.editor.undo();
    }
  }

  redoAction(): void {
    if (this.editor) {
      this.editor.redo();
    }
  }

  rotateLeft(): void {
    if (this.editor) {
      this.editor.transform('RotateLeft');
    }
  }

  rotateRight(): void {
    if (this.editor) {
      this.editor.transform('RotateRight');
    }
  }

  flipHorizontal(): void {
    if (this.editor) {
      this.editor.transform('FlipHorizontal');
    }
  }

  flipVertical(): void {
    if (this.editor) {
      this.editor.transform('FlipVertical');
    }
  }

  zoomIn(): void {
    if (this.editor) {
      this.editor.zoomIn();
    }
  }

  zoomOut(): void {
    if (this.editor) {
      this.editor.zoomOut();
    }
  }
}

