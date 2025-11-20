import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import {
  RichTextEditorComponent as SyncfusionRichTextEditorComponent,
  ToolbarSettingsModel,
  QuickToolbarSettingsModel,
  ImageSettingsModel,
  FileManagerSettingsModel,
  TableSettingsModel,
  PasteCleanupSettingsModel,
  ToolbarService,
  LinkService,
  ImageService,
  QuickToolbarService,
  ResizeService,
  TableService,
  PasteCleanupService,
  HtmlEditorService,
  MarkdownEditorService,
  FileManagerService,
  FormatPainterService,
  CountService
} from '@syncfusion/ej2-angular-richtexteditor';

export interface RichTextEditorConfig {
  value?: string;
  placeholder?: string;
  height?: string | number;
  width?: string | number;
  toolbarSettings?: ToolbarSettingsModel;
  quickToolbarSettings?: QuickToolbarSettingsModel;
  imageSettings?: ImageSettingsModel;
  fileManagerSettings?: FileManagerSettingsModel;
  tableSettings?: TableSettingsModel;
  pasteCleanupSettings?: PasteCleanupSettingsModel;
  htmlEditorSettings?: any;
  markdownSettings?: any;
  enableRtl?: boolean;
  enableResize?: boolean;
  enableTabKey?: boolean;
  enablePersistence?: boolean;
  enableAutoUrl?: boolean;
  enableHtmlEncode?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  readonly?: boolean;
}

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, RichTextEditorModule],
  providers: [
    // Required services for Rich Text Editor
    ToolbarService,
    LinkService,
    ImageService,
    QuickToolbarService,
    ResizeService,
    TableService,
    PasteCleanupService,
    HtmlEditorService,
    MarkdownEditorService,
    FileManagerService,
    FormatPainterService,
    CountService
  ],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss']
})
export class RichTextEditorComponent implements OnInit, OnDestroy {
  @ViewChild('rte', { static: false }) rte!: SyncfusionRichTextEditorComponent;

  // Value
  @Input() value: string = '';
  
  // Placeholder
  @Input() placeholder: string = 'Enter text here...';
  
  // Size
  @Input() height: string | number = '400px';
  @Input() width: string | number = '100%';
  
  // Toolbar Settings
  @Input() toolbarSettings: ToolbarSettingsModel = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|',
      'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
      'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
    ]
  };
  
  // Quick Toolbar Settings
  @Input() quickToolbarSettings: QuickToolbarSettingsModel = {
    image: [
      'Replace', 'Align', 'Caption', 'Remove', 'InsertLink',
      '-', 'Display', 'AltText', 'Dimension'
    ],
    text: [
      'Cut', 'Copy', 'Paste', 'Delete', '|',
      'FormatPainter', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|',
      'SuperScript', 'SubScript', '|',
      'ClearFormat', '|',
      'CreateLink', 'UnLink', '|',
      'SourceCode'
    ],
    table: [
      'TableHeader', 'TableRows', 'TableColumns', 'TableCell',
      '-', 'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign',
      'TableProperties'
    ]
  };
  
  // Image Settings
  @Input() imageSettings: ImageSettingsModel = {
    allowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
    minWidth: 16,
    maxWidth: 1000,
    minHeight: 16,
    maxHeight: 1000,
    saveUrl: '',
    path: '',
    resize: true
  };
  
  // File Manager Settings
  @Input() fileManagerSettings: FileManagerSettingsModel = {};
  
  // Table Settings
  @Input() tableSettings: TableSettingsModel = {
    width: '100%'
  };
  
  // Paste Cleanup Settings
  @Input() pasteCleanupSettings: PasteCleanupSettingsModel = {
    prompt: true,
    plainText: false,
    keepFormat: false,
    deniedTags: [],
    deniedAttrs: [],
    allowedStyleProps: []
  };
  
  // HTML Editor Settings
  @Input() htmlEditorSettings: any = {};
  
  // Markdown Settings
  @Input() markdownSettings: any = {};
  
  // Features
  @Input() enableRtl: boolean = false;
  @Input() enableResize: boolean = true;
  @Input() enableTabKey: boolean = true;
  @Input() enablePersistence: boolean = false;
  @Input() enableAutoUrl: boolean = true;
  @Input() enableHtmlEncode: boolean = false;
  @Input() showCharCount: boolean = false;
  @Input() maxLength: number = 0;
  @Input() readonly: boolean = false;
  
  // Styling
  @Input() customClass: string = '';
  
  // Events
  @Output() created = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();
  @Output() actionBegin = new EventEmitter<any>();
  @Output() actionComplete = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() toolbarClick = new EventEmitter<any>();
  @Output() imageUploading = new EventEmitter<any>();
  @Output() imageUploadSuccess = new EventEmitter<any>();
  @Output() imageUploadFailed = new EventEmitter<any>();
  @Output() imageRemoving = new EventEmitter<any>();
  @Output() fileUploading = new EventEmitter<any>();
  @Output() fileUploadSuccess = new EventEmitter<any>();
  @Output() fileUploadFailed = new EventEmitter<any>();
  @Output() beforeDialogOpen = new EventEmitter<any>();
  @Output() dialogOpen = new EventEmitter<any>();
  @Output() dialogClose = new EventEmitter<any>();
  @Output() beforeImageUpload = new EventEmitter<any>();
  @Output() beforeFileUpload = new EventEmitter<any>();
  @Output() beforePaste = new EventEmitter<any>();
  @Output() beforeDrop = new EventEmitter<any>();
  @Output() beforeSanitizeHtml = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get value
   */
  getValue(): string {
    if (this.rte) {
      return this.rte.value;
    }
    return this.value;
  }

  /**
   * Set value
   */
  setValue(value: string): void {
    this.value = value;
    if (this.rte) {
      this.rte.value = value;
      this.rte.dataBind();
    }
  }

  /**
   * Get HTML content
   */
  getHtml(): string {
    if (this.rte) {
      return this.rte.getHtml();
    }
    return this.value;
  }

  /**
   * Get text content
   */
  getText(): string {
    if (this.rte) {
      return this.rte.getText();
    }
    return '';
  }

  /**
   * Get selected text
   */
  getSelectedText(): string {
    if (this.rte) {
      return this.rte.getSelectedHtml();
    }
    return '';
  }

  /**
   * Insert text
   */
  insertText(text: string): void {
    if (this.rte) {
      this.rte.executeCommand('insertText', text);
    }
  }

  /**
   * Insert HTML
   */
  insertHtml(html: string): void {
    if (this.rte) {
      this.rte.executeCommand('insertHTML', html);
    }
  }

  /**
   * Format text
   */
  formatText(format: string, value?: string): void {
    if (this.rte) {
      this.rte.executeCommand(format as any, value);
    }
  }

  /**
   * Undo
   */
  undo(): void {
    if (this.rte) {
      this.rte.executeCommand('undo');
    }
  }

  /**
   * Redo
   */
  redo(): void {
    if (this.rte) {
      this.rte.executeCommand('redo');
    }
  }

  /**
   * Clear format
   */
  clearFormat(): void {
    if (this.rte) {
      this.rte.executeCommand('removeFormat');
    }
  }

  /**
   * Refresh
   */
  refresh(): void {
    if (this.rte) {
      this.rte.dataBind();
    }
  }

  /**
   * Get editor instance
   */
  getEditorInstance(): SyncfusionRichTextEditorComponent | null {
    return this.rte || null;
  }

  /**
   * Event handlers
   */
  onCreated(args: any): void {
    this.created.emit(args);
  }

  onChange(args: any): void {
    this.value = args.value;
    this.change.emit(args);
  }

  onActionBegin(args: any): void {
    this.actionBegin.emit(args);
  }

  onActionComplete(args: any): void {
    this.actionComplete.emit(args);
  }

  onFocus(args: any): void {
    this.focus.emit(args);
  }

  onBlur(args: any): void {
    this.blur.emit(args);
  }

  onToolbarClick(args: any): void {
    this.toolbarClick.emit(args);
  }

  onImageUploading(args: any): void {
    this.imageUploading.emit(args);
  }

  onImageUploadSuccess(args: any): void {
    this.imageUploadSuccess.emit(args);
  }

  onImageUploadFailed(args: any): void {
    this.imageUploadFailed.emit(args);
  }

  onImageRemoving(args: any): void {
    this.imageRemoving.emit(args);
  }

  onFileUploading(args: any): void {
    this.fileUploading.emit(args);
  }

  onFileUploadSuccess(args: any): void {
    this.fileUploadSuccess.emit(args);
  }

  onFileUploadFailed(args: any): void {
    this.fileUploadFailed.emit(args);
  }

  onBeforeDialogOpen(args: any): void {
    this.beforeDialogOpen.emit(args);
  }

  onDialogOpen(args: any): void {
    this.dialogOpen.emit(args);
  }

  onDialogClose(args: any): void {
    this.dialogClose.emit(args);
  }

  onBeforeImageUpload(args: any): void {
    this.beforeImageUpload.emit(args);
  }

  onBeforeFileUpload(args: any): void {
    this.beforeFileUpload.emit(args);
  }

  onBeforePaste(args: any): void {
    this.beforePaste.emit(args);
  }

  onBeforeDrop(args: any): void {
    this.beforeDrop.emit(args);
  }

  onBeforeSanitizeHtml(args: any): void {
    this.beforeSanitizeHtml.emit(args);
  }
}

