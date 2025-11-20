import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEditorModule } from '@syncfusion/ej2-angular-documenteditor';
import {
  DocumentEditorComponent as SyncfusionDocumentEditorComponent,
  DocumentEditorSettingsModel,
  CollaborativeEditingSettingsModel,
  DocumentEditorContainerComponent
} from '@syncfusion/ej2-angular-documenteditor';

export interface DocumentEditorConfig {
  width?: string | number;
  height?: string | number;
  enableSpellCheck?: boolean;
  enableSuggestion?: boolean;
  enableOptimizedTextMeasuring?: boolean;
  enableSelection?: boolean;
  enableEditor?: boolean;
  enableEditorHistory?: boolean;
  enableContextMenu?: boolean;
  enableHyperlinkDialog?: boolean;
  enableImageResizer?: boolean;
  enableTableDialog?: boolean;
  enableBookmarkDialog?: boolean;
  enableTableOfContentsDialog?: boolean;
  enablePageSetupDialog?: boolean;
  enableStyleDialog?: boolean;
  enableListDialog?: boolean;
  enableParagraphDialog?: boolean;
  enableFontDialog?: boolean;
  enableTablePropertiesDialog?: boolean;
  enableBordersAndShadingDialog?: boolean;
  enableTableOptionsDialog?: boolean;
  enableCellOptionsDialog?: boolean;
  enableComments?: boolean;
  enableTrackChanges?: boolean;
  enableFormField?: boolean;
  enableOptionsPane?: boolean;
  showRuler?: boolean;
  showComments?: boolean;
  showHiddenMarks?: boolean;
  showBookmarks?: boolean;
  showRevisions?: boolean;
  zoomFactor?: number;
  isReadOnly?: boolean;
  enablePrint?: boolean;
  enableWordExport?: boolean;
  enablePdfExport?: boolean;
  enableSfdtExport?: boolean;
  enableTextExport?: boolean;
  enableDocumentTitle?: boolean;
  enableHeaderFooter?: boolean;
  enableSearch?: boolean;
  enableNavigationPane?: boolean;
  customClass?: string;
}

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [CommonModule, DocumentEditorModule],
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit, OnDestroy {
  @ViewChild('documentEditor', { static: false }) documentEditor!: SyncfusionDocumentEditorComponent;

  // Size
  @Input() width: string | number = '100%';
  @Input() height: string | number = '800px';
  
  // Features
  @Input() enableSpellCheck: boolean = true;
  @Input() enableSelection: boolean = true;
  @Input() enableEditor: boolean = true;
  @Input() enableEditorHistory: boolean = true;
  @Input() enableContextMenu: boolean = true;
  @Input() enableHyperlinkDialog: boolean = true;
  @Input() enableImageResizer: boolean = true;
  @Input() enableTableDialog: boolean = true;
  @Input() enableBookmarkDialog: boolean = true;
  @Input() enableTableOfContentsDialog: boolean = true;
  @Input() enablePageSetupDialog: boolean = true;
  @Input() enableStyleDialog: boolean = true;
  @Input() enableListDialog: boolean = true;
  @Input() enableParagraphDialog: boolean = true;
  @Input() enableFontDialog: boolean = true;
  @Input() enableTablePropertiesDialog: boolean = true;
  @Input() enableBordersAndShadingDialog: boolean = true;
  @Input() enableTableOptionsDialog: boolean = true;
  @Input() enableTrackChanges: boolean = true;
  @Input() enableFormField: boolean = true;
  @Input() enableOptionsPane: boolean = true;
  @Input() showComments: boolean = false;
  @Input() showRevisions: boolean = false;
  @Input() zoomFactor: number = 1;
  @Input() isReadOnly: boolean = false;
  @Input() enablePrint: boolean = true;
  @Input() enableWordExport: boolean = true;
  @Input() enableSfdtExport: boolean = true;
  @Input() enableTextExport: boolean = true;
  @Input() enableSearch: boolean = true;
  
  // Styling
  @Input() customClass: string = '';
  
  // Events
  @Output() created = new EventEmitter<any>();
  @Output() documentChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() contentChange = new EventEmitter<any>();
  @Output() zoomFactorChange = new EventEmitter<any>();
  @Output() requestNavigate = new EventEmitter<any>();
  @Output() beforePaneSwitch = new EventEmitter<any>();
  @Output() paneSwitch = new EventEmitter<any>();
  @Output() beforeServiceFailure = new EventEmitter<any>();
  @Output() serviceFailure = new EventEmitter<any>();
  @Output() customContextMenuBeforeOpen = new EventEmitter<any>();
  @Output() customContextMenuOpen = new EventEmitter<any>();
  @Output() beforeRestrictEditing = new EventEmitter<any>();
  @Output() restrictEditing = new EventEmitter<any>();
  @Output() documentEditorSettingsChange = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Open document from SFDT
   */
  open(document: string): void {
    if (this.documentEditor) {
      this.documentEditor.open(document);
    }
  }

  /**
   * Save document as SFDT
   */
  saveAsSfdt(): string {
    if (this.documentEditor) {
      return this.documentEditor.serialize();
    }
    return '';
  }

  /**
   * Save document as Blob
   */
  saveAsBlob(format: 'Docx' | 'Sfdt' | 'Txt'): Promise<Blob> {
    if (this.documentEditor) {
      return this.documentEditor.saveAsBlob(format as any);
    }
    return Promise.reject('Document editor not initialized');
  }

  /**
   * Print document
   */
  print(): void {
    if (this.documentEditor) {
      this.documentEditor.print();
    }
  }

  /**
   * Export document
   */
  export(format: 'Docx' | 'Sfdt' | 'Txt', fileName?: string): void {
    if (this.documentEditor) {
      const formatType = format as any;
      const file = (fileName || 'document') as any;
      this.documentEditor.save(formatType, file);
    }
  }

  /**
   * Export as PDF (requires server-side conversion)
   */
  exportAsPdf(fileName?: string): void {
    if (this.documentEditor) {
      // PDF export requires server-side conversion
      // Use saveAsBlob('Sfdt') and convert on server
      console.warn('PDF export requires server-side conversion. Use exportAsSfdt() and convert on server.');
    }
  }

  /**
   * Insert text
   */
  insertText(text: string): void {
    if (this.documentEditor) {
      this.documentEditor.editor.insertText(text);
    }
  }

  /**
   * Insert image
   */
  insertImage(base64: string): void {
    if (this.documentEditor) {
      this.documentEditor.editor.insertImage(base64);
    }
  }

  /**
   * Insert table
   */
  insertTable(rowCount: number, columnCount: number): void {
    if (this.documentEditor) {
      this.documentEditor.editor.insertTable(rowCount, columnCount);
    }
  }

  /**
   * Undo
   */
  undo(): void {
    if (this.documentEditor) {
      this.documentEditor.editorHistoryModule.undo();
    }
  }

  /**
   * Redo
   */
  redo(): void {
    if (this.documentEditor) {
      this.documentEditor.editorHistoryModule.redo();
    }
  }

  /**
   * Select all
   */
  selectAll(): void {
    if (this.documentEditor) {
      this.documentEditor.selection.selectAll();
    }
  }

  /**
   * Copy
   */
  copy(): void {
    if (this.documentEditor) {
      // Use document editor's built-in copy functionality
      const editor = (this.documentEditor as any).editor;
      if (editor && editor.copy) {
        editor.copy();
      } else {
        // Fallback: use clipboard API
        const selectedText = this.documentEditor.selection.text;
        if (selectedText) {
          navigator.clipboard.writeText(selectedText);
        }
      }
    }
  }

  /**
   * Cut
   */
  cut(): void {
    if (this.documentEditor) {
      // Use document editor's built-in cut functionality
      const editor = (this.documentEditor as any).editor;
      if (editor && editor.cut) {
        editor.cut();
      } else {
        // Fallback: copy then delete
        this.copy();
        this.documentEditor.editor.delete();
      }
    }
  }

  /**
   * Paste
   */
  paste(): void {
    if (this.documentEditor) {
      // Use document editor's built-in paste functionality
      const editor = (this.documentEditor as any).editor;
      if (editor && editor.paste) {
        editor.paste();
      } else {
        // Fallback: use clipboard API
        navigator.clipboard.readText().then(text => {
          this.insertText(text);
        });
      }
    }
  }

  /**
   * Find and replace
   */
  find(text: string): boolean {
    if (this.documentEditor) {
      try {
        this.documentEditor.searchModule.findAll(text);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Replace
   */
  replace(text: string, replaceText: string): boolean {
    if (this.documentEditor) {
      try {
        const results = this.documentEditor.searchModule.findAll(text) as any;
        if (results && Array.isArray(results) && results.length > 0) {
          // replaceAll expects TextSearchResults (array) as first parameter and string as second
          this.documentEditor.searchModule.replaceAll(results as any, replaceText as any);
          return true;
        }
      } catch (error) {
        console.warn('Replace failed:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Set zoom factor
   */
  setZoomFactor(factor: number): void {
    if (this.documentEditor) {
      this.documentEditor.zoomFactor = factor;
    }
  }

  /**
   * Focus
   */
  focus(): void {
    if (this.documentEditor) {
      this.documentEditor.focusIn();
    }
  }

  /**
   * Refresh
   */
  refresh(): void {
    if (this.documentEditor) {
      this.documentEditor.dataBind();
    }
  }

  /**
   * Get document editor instance
   */
  getDocumentEditorInstance(): SyncfusionDocumentEditorComponent | null {
    return this.documentEditor || null;
  }

  /**
   * Event handlers
   */
  onCreated(args: any): void {
    this.created.emit(args);
  }

  onDocumentChange(args: any): void {
    this.documentChange.emit(args);
  }

  onSelectionChange(args: any): void {
    this.selectionChange.emit(args);
  }

  onContentChange(args: any): void {
    this.contentChange.emit(args);
  }

  onZoomFactorChange(args: any): void {
    this.zoomFactorChange.emit(args);
  }

  onRequestNavigate(args: any): void {
    this.requestNavigate.emit(args);
  }

  onBeforePaneSwitch(args: any): void {
    this.beforePaneSwitch.emit(args);
  }

  onPaneSwitch(args: any): void {
    this.paneSwitch.emit(args);
  }

  onBeforeServiceFailure(args: any): void {
    this.beforeServiceFailure.emit(args);
  }

  onServiceFailure(args: any): void {
    this.serviceFailure.emit(args);
  }

  onCustomContextMenuBeforeOpen(args: any): void {
    this.customContextMenuBeforeOpen.emit(args);
  }

  onCustomContextMenuOpen(args: any): void {
    this.customContextMenuOpen.emit(args);
  }

  onBeforeRestrictEditing(args: any): void {
    this.beforeRestrictEditing.emit(args);
  }

  onRestrictEditing(args: any): void {
    this.restrictEditing.emit(args);
  }

  onDocumentEditorSettingsChange(args: any): void {
    this.documentEditorSettingsChange.emit(args);
  }
}

