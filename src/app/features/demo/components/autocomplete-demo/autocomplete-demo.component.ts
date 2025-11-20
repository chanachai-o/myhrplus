import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent, AutocompleteItem } from '../../../../shared/components/autocomplete/autocomplete.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';

@Component({
  selector: 'app-autocomplete-demo',
  standalone: true,
  imports: [CommonModule, AutocompleteComponent, GlassCardComponent, CodeViewerComponent],
  templateUrl: './autocomplete-demo.component.html',
  styleUrls: ['./autocomplete-demo.component.scss']
})
export class AutocompleteDemoComponent {
  @ViewChild('autocomplete') autocomplete!: AutocompleteComponent;

  // Sample data
  countries: AutocompleteItem[] = [
    { value: 'th', text: 'Thailand' },
    { value: 'us', text: 'United States' },
    { value: 'uk', text: 'United Kingdom' },
    { value: 'jp', text: 'Japan' },
    { value: 'kr', text: 'South Korea' },
    { value: 'cn', text: 'China' },
    { value: 'sg', text: 'Singapore' },
    { value: 'my', text: 'Malaysia' },
    { value: 'id', text: 'Indonesia' },
    { value: 'ph', text: 'Philippines' },
    { value: 'vn', text: 'Vietnam' },
    { value: 'in', text: 'India' },
    { value: 'au', text: 'Australia' },
    { value: 'nz', text: 'New Zealand' },
    { value: 'de', text: 'Germany' },
    { value: 'fr', text: 'France' },
    { value: 'it', text: 'Italy' },
    { value: 'es', text: 'Spain' },
    { value: 'nl', text: 'Netherlands' },
    { value: 'be', text: 'Belgium' }
  ];

  products: AutocompleteItem[] = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 25000 },
    { id: 2, name: 'Smartphone', category: 'Electronics', price: 15000 },
    { id: 3, name: 'Tablet', category: 'Electronics', price: 12000 },
    { id: 4, name: 'Headphones', category: 'Electronics', price: 3000 },
    { id: 5, name: 'Keyboard', category: 'Accessories', price: 2000 },
    { id: 6, name: 'Mouse', category: 'Accessories', price: 800 },
    { id: 7, name: 'Monitor', category: 'Electronics', price: 8000 },
    { id: 8, name: 'Webcam', category: 'Accessories', price: 2500 },
    { id: 9, name: 'Speaker', category: 'Electronics', price: 5000 },
    { id: 10, name: 'Printer', category: 'Electronics', price: 6000 }
  ];

  // Current data source
  currentDataSource: AutocompleteItem[] = this.countries;
  currentFields: any = { value: 'value', text: 'text' };

  // Settings
  placeholder: string = 'Type to search...';
  allowFiltering: boolean = true;
  caseSensitive: boolean = false;
  filterType: 'Contains' | 'StartsWith' | 'EndsWith' = 'Contains';
  minLength: number = 1;
  showClearButton: boolean = true;
  highlight: boolean = true;
  sortOrder: 'None' | 'Ascending' | 'Descending' = 'None';
  enabled: boolean = true;
  readonly: boolean = false;

  // Methods
  getValue(): void {
    const value = this.autocomplete?.getValue();
    if (value) {
      alert(`Value: ${JSON.stringify(value)}`);
    } else {
      alert('No value selected');
    }
  }

  getText(): void {
    const text = this.autocomplete?.getText();
    if (text) {
      alert(`Text: ${text}`);
    } else {
      alert('No text');
    }
  }

  getDataItem(): void {
    const item = this.autocomplete?.getDataItem();
    if (item) {
      console.log('Data item:', item);
      alert(`Data item: ${JSON.stringify(item)}`);
    } else {
      alert('No data item');
    }
  }

  clear(): void {
    this.autocomplete?.clear();
  }

  showPopup(): void {
    this.autocomplete?.showPopup();
  }

  hidePopup(): void {
    this.autocomplete?.hidePopup();
  }

  focusIn(): void {
    this.autocomplete?.focusIn();
  }

  focusOut(): void {
    this.autocomplete?.focusOut();
  }

  refresh(): void {
    this.autocomplete?.refresh();
  }

  switchDataSource(type: 'countries' | 'products'): void {
    if (type === 'countries') {
      this.currentDataSource = this.countries;
      this.currentFields = { value: 'value', text: 'text' };
    } else {
      this.currentDataSource = this.products;
      this.currentFields = { value: 'id', text: 'name' };
    }
    this.refresh();
  }

  onChange(event: any): void {
    console.log('Value changed:', event);
  }

  onSelect(event: any): void {
    console.log('Item selected:', event);
  }

  onFiltering(event: any): void {
    console.log('Filtering:', event);
  }

  onOpen(event: any): void {
    console.log('Popup opened:', event);
  }

  onClose(event: any): void {
    console.log('Popup closed:', event);
  }

  toggleFilterType(type: 'Contains' | 'StartsWith' | 'EndsWith'): void {
    this.filterType = type;
  }

  toggleSortOrder(order: 'None' | 'Ascending' | 'Descending'): void {
    this.sortOrder = order;
  }

  onMinLengthChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.minLength = +target.value;
    }
  }

  // Code examples
  basicExample = `<app-autocomplete
  [dataSource]="dataSource"
  [fields]="{ value: 'id', text: 'name' }"
  [placeholder]="'Type to search...'"
  [allowFiltering]="true"
  [filterType]="'Contains'"
  [highlight]="true"
  [showClearButton]="true"
  [width]="'100%'"
  (change)="onChange($event)"
  (select)="onSelect($event)"
  (filtering)="onFiltering($event)">
</app-autocomplete>`;
}

