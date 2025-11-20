import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import {
  AutoCompleteComponent as SyncfusionAutoCompleteComponent,
  FilteringEventArgs,
  PopupEventArgs
} from '@syncfusion/ej2-angular-dropdowns';

export interface AutocompleteItem {
  [key: string]: any;
}

export interface AutocompleteConfig {
  dataSource?: AutocompleteItem[];
  fields?: any;
  placeholder?: string;
  allowFiltering?: boolean;
  caseSensitive?: boolean;
  filterType?: 'Contains' | 'StartsWith' | 'EndsWith';
  minLength?: number;
  showClearButton?: boolean;
  enableVirtualization?: boolean;
  allowCustom?: boolean;
  autofill?: boolean;
  highlight?: boolean;
  ignoreAccent?: boolean;
  sortOrder?: 'None' | 'Ascending' | 'Descending';
  suggestionCount?: number;
  width?: string | number;
  height?: string | number;
  enabled?: boolean;
  readonly?: boolean;
  enableRtl?: boolean;
  locale?: string;
  value?: string | number | AutocompleteItem;
  customClass?: string;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('autocomplete', { static: false }) autocomplete!: SyncfusionAutoCompleteComponent;

  // Data Source
  @Input() dataSource: AutocompleteItem[] = [];
  @Input() fields: any = {
    value: 'value',
    text: 'text'
  };

  // Appearance
  @Input() placeholder: string = 'Type to search...';
  @Input() width: string | number = '100%';
  @Input() height: string | number = 'auto';
  @Input() customClass?: string;

  // Behavior
  @Input() allowFiltering: boolean = true;
  @Input() caseSensitive: boolean = false;
  @Input() filterType: 'Contains' | 'StartsWith' | 'EndsWith' = 'Contains';
  @Input() minLength: number = 1;
  @Input() showClearButton: boolean = true;
  @Input() enableVirtualization: boolean = false;
  @Input() allowCustom: boolean = false;
  @Input() autofill: boolean = true;
  @Input() highlight: boolean = true;
  @Input() ignoreAccent: boolean = false;
  @Input() sortOrder: 'None' | 'Ascending' | 'Descending' = 'None';
  @Input() suggestionCount: number = 20;
  @Input() enabled: boolean = true;
  @Input() readonly: boolean = false;
  @Input() enableRtl: boolean = false;
  @Input() locale: string = 'en';
  @Input() value?: string | number | AutocompleteItem;

  // Events
  @Output() change = new EventEmitter<any>();
  @Output() select = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() filtering = new EventEmitter<any>();
  @Output() open = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Output() created = new EventEmitter<any>();

  @Input() config?: AutocompleteConfig;

  ngOnInit(): void {
    // Apply config if provided
    if (this.config) {
      this.dataSource = this.config.dataSource || this.dataSource;
      this.fields = this.config.fields || this.fields;
      this.placeholder = this.config.placeholder ?? this.placeholder;
      this.allowFiltering = this.config.allowFiltering ?? this.allowFiltering;
      this.caseSensitive = this.config.caseSensitive ?? this.caseSensitive;
      this.filterType = this.config.filterType ?? this.filterType;
      this.minLength = this.config.minLength ?? this.minLength;
      this.showClearButton = this.config.showClearButton ?? this.showClearButton;
      this.enableVirtualization = this.config.enableVirtualization ?? this.enableVirtualization;
      this.allowCustom = this.config.allowCustom ?? this.allowCustom;
      this.autofill = this.config.autofill ?? this.autofill;
      this.highlight = this.config.highlight ?? this.highlight;
      this.ignoreAccent = this.config.ignoreAccent ?? this.ignoreAccent;
      this.sortOrder = this.config.sortOrder ?? this.sortOrder;
      this.suggestionCount = this.config.suggestionCount ?? this.suggestionCount;
      this.enabled = this.config.enabled ?? this.enabled;
      this.readonly = this.config.readonly ?? this.readonly;
      this.enableRtl = this.config.enableRtl ?? this.enableRtl;
      this.locale = this.config.locale || this.locale;
      this.value = this.config.value ?? this.value;
      this.width = this.config.width ?? this.width;
      this.height = this.config.height ?? this.height;
      this.customClass = this.config.customClass || this.customClass;
    }
  }

  ngAfterViewInit(): void {
    if (this.autocomplete) {
      this.created.emit({ autocomplete: this.autocomplete });
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get Autocomplete instance
   */
  getAutocompleteInstance(): SyncfusionAutoCompleteComponent | null {
    return this.autocomplete || null;
  }

  /**
   * Get value
   */
  getValue(): string | number | AutocompleteItem | undefined {
    if (this.autocomplete) {
      const value = this.autocomplete.value;
      if (value === null || value === undefined) {
        return undefined;
      }
      // Filter out boolean values and handle object types
      if (typeof value === 'boolean') {
        return undefined;
      }
      if (typeof value === 'object') {
        return value as AutocompleteItem;
      }
      // string or number
      return value as string | number;
    }
    return this.value;
  }

  /**
   * Set value
   */
  setValue(value: string | number | AutocompleteItem): void {
    if (this.autocomplete) {
      this.autocomplete.value = value;
    }
  }

  /**
   * Get text
   */
  getText(): string {
    if (this.autocomplete) {
      return this.autocomplete.text || '';
    }
    return '';
  }

  /**
   * Get data item
   */
  getDataItem(): AutocompleteItem | null {
    if (this.autocomplete && this.autocomplete.value !== null && this.autocomplete.value !== undefined) {
      const value = this.autocomplete.value;
      if (typeof value === 'string' || typeof value === 'number') {
        return this.autocomplete.getDataByValue(value) as AutocompleteItem;
      }
    }
    return null;
  }

  /**
   * Show popup
   */
  showPopup(): void {
    if (this.autocomplete) {
      this.autocomplete.showPopup();
    }
  }

  /**
   * Hide popup
   */
  hidePopup(): void {
    if (this.autocomplete) {
      this.autocomplete.hidePopup();
    }
  }

  /**
   * Focus
   */
  focusIn(): void {
    if (this.autocomplete) {
      this.autocomplete.focusIn();
    }
  }

  /**
   * Blur
   */
  focusOut(): void {
    if (this.autocomplete) {
      this.autocomplete.focusOut();
    }
  }

  /**
   * Clear
   */
  clear(): void {
    if (this.autocomplete) {
      this.autocomplete.value = null;
    }
  }

  /**
   * Refresh
   */
  refresh(): void {
    if (this.autocomplete) {
      this.autocomplete.dataBind();
    }
  }

  /**
   * Event handlers
   */
  onChange(event: any): void {
    this.change.emit(event);
  }

  onSelect(event: any): void {
    this.select.emit(event);
  }

  onFocus(event: any): void {
    this.focus.emit(event);
  }

  onBlur(event: any): void {
    this.blur.emit(event);
  }

  onFiltering(event: FilteringEventArgs): void {
    this.filtering.emit(event);
  }

  onOpen(event: PopupEventArgs): void {
    this.open.emit(event);
  }

  onClose(event: PopupEventArgs): void {
    this.close.emit(event);
  }

  onCreated(event: any): void {
    this.created.emit(event);
  }
}

