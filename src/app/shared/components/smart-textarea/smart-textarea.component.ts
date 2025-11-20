import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTextAreaModule, SmartTextAreaComponent as SyncfusionSmartTextAreaComponent } from '@syncfusion/ej2-angular-inputs';

export interface SmartTextAreaConfig {
  placeholder?: string;
  floatLabelType?: 'Auto' | 'Always' | 'Never';
  rows?: number;
  cols?: number;
  userRole?: string;
  userPhrases?: string[];
  aiSuggestionHandler?: (options: any) => void;
  value?: string;
  enabled?: boolean;
  readonly?: boolean;
  resizeMode?: 'None' | 'Both' | 'Horizontal' | 'Vertical';
  width?: string | number;
  height?: string | number;
  customClass?: string;
}

@Component({
  selector: 'app-smart-textarea',
  standalone: true,
  imports: [CommonModule, SmartTextAreaModule],
  templateUrl: './smart-textarea.component.html',
  styleUrls: ['./smart-textarea.component.scss']
})
export class SmartTextAreaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('smartTextarea', { static: false }) smartTextarea!: SyncfusionSmartTextAreaComponent;

  // Basic Properties
  @Input() placeholder: string = 'Type your message...';
  @Input() floatLabelType: 'Auto' | 'Always' | 'Never' = 'Auto';
  @Input() rows: number = 5;
  @Input() cols: number = 50;
  @Input() value: string = '';
  @Input() enabled: boolean = true;
  @Input() readonly: boolean = false;
  @Input() resizeMode: 'None' | 'Both' | 'Horizontal' | 'Vertical' = 'None';
  @Input() width: string | number = '100%';
  @Input() height: string | number = 'auto';
  @Input() customClass?: string;

  // AI Features
  @Input() userRole?: string;
  @Input() userPhrases?: string[];
  @Input() aiSuggestionHandler?: (options: any) => void;

  // Events
  @Output() change = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() created = new EventEmitter<any>();

  @Input() config?: SmartTextAreaConfig;

  ngOnInit(): void {
    // Apply config if provided
    if (this.config) {
      this.placeholder = this.config.placeholder ?? this.placeholder;
      this.floatLabelType = this.config.floatLabelType ?? this.floatLabelType;
      this.rows = this.config.rows ?? this.rows;
      this.cols = this.config.cols ?? this.cols;
      this.value = this.config.value ?? this.value;
      this.enabled = this.config.enabled ?? this.enabled;
      this.readonly = this.config.readonly ?? this.readonly;
      this.resizeMode = this.config.resizeMode ?? this.resizeMode;
      this.width = this.config.width ?? this.width;
      this.height = this.config.height ?? this.height;
      this.customClass = this.config.customClass || this.customClass;
      this.userRole = this.config.userRole ?? this.userRole;
      this.userPhrases = this.config.userPhrases ?? this.userPhrases;
      this.aiSuggestionHandler = this.config.aiSuggestionHandler ?? this.aiSuggestionHandler;
    }
  }

  ngAfterViewInit(): void {
    if (this.smartTextarea) {
      this.created.emit({ smartTextarea: this.smartTextarea });
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get Smart TextArea instance
   */
  getSmartTextAreaInstance(): SyncfusionSmartTextAreaComponent | null {
    return this.smartTextarea || null;
  }

  /**
   * Get value
   */
  getValue(): string {
    if (this.smartTextarea) {
      return this.smartTextarea.value || '';
    }
    return this.value;
  }

  /**
   * Set value
   */
  setValue(value: string): void {
    if (this.smartTextarea) {
      this.smartTextarea.value = value;
    }
    this.value = value;
  }

  /**
   * Focus
   */
  focusIn(): void {
    if (this.smartTextarea) {
      this.smartTextarea.focusIn();
    }
  }

  /**
   * Blur
   */
  focusOut(): void {
    if (this.smartTextarea) {
      this.smartTextarea.focusOut();
    }
  }

  /**
   * Clear
   */
  clear(): void {
    if (this.smartTextarea) {
      this.smartTextarea.value = '';
    }
    this.value = '';
  }

  /**
   * Refresh
   */
  refresh(): void {
    if (this.smartTextarea) {
      this.smartTextarea.dataBind();
    }
  }

  /**
   * Event handlers
   */
  onChange(event: any): void {
    if (this.smartTextarea) {
      this.value = this.smartTextarea.value || '';
    }
    this.change.emit(event);
  }

  onFocus(event: any): void {
    this.focus.emit(event);
  }

  onBlur(event: any): void {
    this.blur.emit(event);
  }

  onCreated(event: any): void {
    this.created.emit(event);
  }
}

