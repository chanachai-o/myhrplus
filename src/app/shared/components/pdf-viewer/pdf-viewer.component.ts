import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from '@syncfusion/ej2-angular-pdfviewer';
import {
  PdfViewerComponent as SyncfusionPdfViewerComponent
} from '@syncfusion/ej2-angular-pdfviewer';

export interface PdfViewerConfig {
  documentPath?: string;
  serviceUrl?: string;
  enableToolbar?: boolean;
  enableNavigation?: boolean;
  enableThumbnail?: boolean;
  enableBookmark?: boolean;
  enableTextSelection?: boolean;
  enableTextSearch?: boolean;
  enablePrint?: boolean;
  enableDownload?: boolean;
  enableFormFields?: boolean;
  enableAnnotations?: boolean;
  enableHyperlinks?: boolean;
  enableMagnification?: boolean;
  enableStickyNotes?: boolean;
  enableHandTool?: boolean;
  enableTextMarkup?: boolean;
  enableShapeAnnotation?: boolean;
  enableStampAnnotation?: boolean;
  enableSignature?: boolean;
  enableMeasurement?: boolean;
  isReadOnly?: boolean;
  zoomFactor?: number;
  height?: string | number;
  width?: string | number;
  customClass?: string;
}

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  @ViewChild('pdfviewer', { static: false }) pdfviewer!: SyncfusionPdfViewerComponent;

  // Document
  @Input() documentPath: string = '';
  @Input() serviceUrl?: string;

  // Features
  @Input() enableToolbar: boolean = true;
  @Input() enableNavigation: boolean = true;
  @Input() enableThumbnail: boolean = true;
  @Input() enableBookmark: boolean = true;
  @Input() enableTextSelection: boolean = true;
  @Input() enableTextSearch: boolean = true;
  @Input() enablePrint: boolean = true;
  @Input() enableDownload: boolean = true;
  @Input() enableFormFields: boolean = true;
  // Note: enableAnnotations, enableHyperlinks, enableStickyNotes, enableHandTool,
  // enableTextMarkup, enableShapeAnnotation, enableStampAnnotation, enableSignature,
  // enableMeasurement are controlled via toolbar and not direct input properties
  @Input() enableMagnification: boolean = true;
  // Note: isReadOnly and zoomFactor are not direct input properties

  // Size
  @Input() height: string | number = '800px';
  @Input() width: string | number = '100%';
  @Input() customClass?: string;

  // Events
  @Output() documentLoad = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() zoomChange = new EventEmitter<any>();
  @Output() annotationAdd = new EventEmitter<any>();
  @Output() annotationRemove = new EventEmitter<any>();
  @Output() annotationSelect = new EventEmitter<any>();
  @Output() hyperlinkClick = new EventEmitter<any>();
  @Output() textSelection = new EventEmitter<any>();
  @Output() formFieldFocus = new EventEmitter<any>();
  @Output() formFieldBlur = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get PDF viewer instance
   */
  getPdfViewerInstance(): SyncfusionPdfViewerComponent | null {
    return this.pdfviewer || null;
  }

  /**
   * Load document
   */
  loadDocument(documentPath: string): void {
    if (this.pdfviewer) {
      this.pdfviewer.documentPath = documentPath;
      // Load method requires documentPath and password (optional)
      (this.pdfviewer as any).load(documentPath, '');
    }
  }

  /**
   * Print PDF
   */
  print(): void {
    if (this.pdfviewer) {
      // Use print method from toolbar
      (this.pdfviewer as any).toolbarModule.print();
    }
  }

  /**
   * Download PDF
   */
  download(): void {
    if (this.pdfviewer) {
      // Use download method from toolbar
      (this.pdfviewer as any).toolbarModule?.download();
    }
  }

  /**
   * Navigate to page
   */
  goToPage(pageNumber: number): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).navigationModule?.goToPage(pageNumber);
    }
  }

  /**
   * Go to first page
   */
  firstPage(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).navigationModule?.goToFirstPage();
    }
  }

  /**
   * Go to last page
   */
  lastPage(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).navigationModule?.goToLastPage();
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).navigationModule?.goToPreviousPage();
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).navigationModule?.goToNextPage();
    }
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).magnificationModule?.zoomIn();
    }
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).magnificationModule?.zoomOut();
    }
  }

  /**
   * Fit to page
   */
  fitToPage(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).magnificationModule?.fitToPage();
    }
  }

  /**
   * Fit to width
   */
  fitToWidth(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).magnificationModule?.fitToWidth();
    }
  }

  /**
   * Set zoom factor
   */
  setZoomFactor(zoomFactor: number): void {
    if (this.pdfviewer) {
      // Use zoom method with factor
      (this.pdfviewer as any).magnificationModule.zoom(zoomFactor);
    }
  }

  /**
   * Search text
   */
  searchText(text: string): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).textSearch.searchText(text);
    }
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    if (this.pdfviewer) {
      (this.pdfviewer as any).textSearch.cancel();
    }
  }

  /**
   * Get current page number
   */
  getCurrentPage(): number {
    if (this.pdfviewer) {
      // Get current page from navigation module
      return (this.pdfviewer as any).navigationModule?.currentPageNumber || 1;
    }
    return 0;
  }

  /**
   * Get total pages
   */
  getTotalPages(): number {
    if (this.pdfviewer) {
      return this.pdfviewer.pageCount || 0;
    }
    return 0;
  }

  /**
   * Refresh
   */
  refresh(): void {
    if (this.pdfviewer) {
      this.pdfviewer.refresh();
    }
  }

  /**
   * Event handlers
   */
  onDocumentLoad(event: any): void {
    this.documentLoad.emit(event);
  }

  onPageChange(event: any): void {
    this.pageChange.emit(event);
  }

  onZoomChange(event: any): void {
    this.zoomChange.emit(event);
  }

  onAnnotationAdd(event: any): void {
    this.annotationAdd.emit(event);
  }

  onAnnotationRemove(event: any): void {
    this.annotationRemove.emit(event);
  }

  onAnnotationSelect(event: any): void {
    this.annotationSelect.emit(event);
  }

  onHyperlinkClick(event: any): void {
    this.hyperlinkClick.emit(event);
  }

  onTextSelection(event: any): void {
    this.textSelection.emit(event);
  }

  onFormFieldFocus(event: any): void {
    this.formFieldFocus.emit(event);
  }

  onFormFieldBlur(event: any): void {
    this.formFieldBlur.emit(event);
  }
}

