import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEditorComponent } from '../../../../shared/components/document-editor/document-editor.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-document-editor-demo',
  standalone: true,
  imports: [CommonModule, DocumentEditorComponent, GlassCardComponent],
  templateUrl: './document-editor-demo.component.html',
  styleUrls: ['./document-editor-demo.component.scss']
})
export class DocumentEditorDemoComponent {
  @ViewChild('editor') editor!: DocumentEditorComponent;

  // Sample SFDT content
  sampleDocument = '';

  // Event handlers
  onCreated(event: any): void {
    console.log('Document Editor created:', event);
    // Load sample document
    this.loadSampleDocument();
  }

  onDocumentChange(event: any): void {
    console.log('Document changed:', event);
  }

  onSelectionChange(event: any): void {
    console.log('Selection changed:', event);
  }

  // Load sample document
  loadSampleDocument(): void {
    // Sample SFDT content (simplified)
    const sampleSfdt = JSON.stringify({
      sections: [
        {
          blocks: [
            {
              paragraphs: [
                {
                  textRuns: [
                    {
                      text: 'Welcome to Document Editor\n\n'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    
    if (this.editor) {
      this.editor.open(sampleSfdt);
    }
  }

  // Export methods
  exportAsWord(): void {
    if (this.editor) {
      this.editor.export('Docx', 'document');
    }
  }

  exportAsPdf(): void {
    if (this.editor) {
      this.editor.exportAsPdf('document');
    }
  }

  exportAsSfdt(): void {
    if (this.editor) {
      const sfdt = this.editor.saveAsSfdt();
      console.log('SFDT:', sfdt);
      // Download or save SFDT
    }
  }

  // Print
  printDocument(): void {
    if (this.editor) {
      this.editor.print();
    }
  }

  // Zoom
  zoomIn(): void {
    if (this.editor) {
      const currentZoom = this.editor.zoomFactor || 1;
      this.editor.setZoomFactor(Math.min(currentZoom + 0.1, 4));
    }
  }

  zoomOut(): void {
    if (this.editor) {
      const currentZoom = this.editor.zoomFactor || 1;
      this.editor.setZoomFactor(Math.max(currentZoom - 0.1, 0.1));
    }
  }

  resetZoom(): void {
    if (this.editor) {
      this.editor.setZoomFactor(1);
    }
  }
}

