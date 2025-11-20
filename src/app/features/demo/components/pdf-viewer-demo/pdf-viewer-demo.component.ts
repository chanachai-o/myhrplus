import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerComponent } from '../../../../shared/components/pdf-viewer/pdf-viewer.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-pdf-viewer-demo',
  standalone: true,
  imports: [CommonModule, PdfViewerComponent, GlassCardComponent],
  templateUrl: './pdf-viewer-demo.component.html',
  styleUrls: ['./pdf-viewer-demo.component.scss']
})
export class PdfViewerDemoComponent {
  @ViewChild('pdfviewer') pdfviewer!: PdfViewerComponent;

  // Sample PDF document path
  // Note: In production, use actual PDF file path or service URL
  documentPath: string = 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf';
  serviceUrl: string = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';

  // Methods
  loadSamplePdf(): void {
    this.documentPath = 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf';
    this.pdfviewer?.loadDocument(this.documentPath);
  }

  goToFirstPage(): void {
    this.pdfviewer?.firstPage();
  }

  goToLastPage(): void {
    this.pdfviewer?.lastPage();
  }

  goToPreviousPage(): void {
    this.pdfviewer?.previousPage();
  }

  goToNextPage(): void {
    this.pdfviewer?.nextPage();
  }

  goToPage(pageNumber: number): void {
    this.pdfviewer?.goToPage(pageNumber);
  }

  zoomIn(): void {
    this.pdfviewer?.zoomIn();
  }

  zoomOut(): void {
    this.pdfviewer?.zoomOut();
  }

  fitToPage(): void {
    this.pdfviewer?.fitToPage();
  }

  fitToWidth(): void {
    this.pdfviewer?.fitToWidth();
  }

  setZoom(zoom: number): void {
    this.pdfviewer?.setZoomFactor(zoom);
  }

  print(): void {
    this.pdfviewer?.print();
  }

  download(): void {
    this.pdfviewer?.download();
  }

  search(text: string): void {
    if (text) {
      this.pdfviewer?.searchText(text);
    }
  }

  clearSearch(): void {
    this.pdfviewer?.clearSearch();
  }

  getCurrentPageInfo(): string {
    const current = this.pdfviewer?.getCurrentPage() || 0;
    const total = this.pdfviewer?.getTotalPages() || 0;
    return `${current} / ${total}`;
  }
}

