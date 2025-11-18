import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'checkbox' | 'date' | 'daterange';
  options?: { value: any; label: string }[];
  value?: any;
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @Input() placeholder: string = 'ค้นหา...';
  @Input() filters: FilterOption[] = [];
  @Input() showAdvanced: boolean = false;
  @Input() debounceTime: number = 300;
  @Input() showFilterChips: boolean = true;

  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<Record<string, any>>();
  @Output() advancedToggle = new EventEmitter<boolean>();

  searchForm: FormGroup;
  filterForm: FormGroup;
  isAdvancedOpen: boolean = false;
  activeFilters: Record<string, any> = {};

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.filterForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Setup search debounce
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.search.emit(value);
      });

    // Setup filter form
    this.filters.forEach(filter => {
      this.filterForm.addControl(filter.key, this.fb.control(filter.value || ''));
    });

    // Setup filter changes
    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.activeFilters = { ...values };
        this.filterChange.emit(this.activeFilters);
      });
  }

  onClearSearch(): void {
    this.searchForm.patchValue({ search: '' });
    this.search.emit('');
  }

  onToggleAdvanced(): void {
    this.isAdvancedOpen = !this.isAdvancedOpen;
    this.advancedToggle.emit(this.isAdvancedOpen);
  }

  onRemoveFilter(key: string): void {
    this.filterForm.patchValue({ [key]: '' });
    delete this.activeFilters[key];
    this.filterChange.emit(this.activeFilters);
  }

  onClearAllFilters(): void {
    this.filters.forEach(filter => {
      this.filterForm.patchValue({ [filter.key]: '' });
    });
    this.activeFilters = {};
    this.filterChange.emit({});
  }

  getActiveFilterCount(): number {
    return Object.values(this.activeFilters).filter(v => v !== '' && v !== null && v !== undefined).length;
  }

  getFilterLabel(key: string): string {
    const filter = this.filters.find(f => f.key === key);
    return filter?.label || key;
  }

  getFilterDisplayValue(key: string): string {
    const value = this.activeFilters[key];
    if (!value) return '';
    
    const filter = this.filters.find(f => f.key === key);
    if (filter?.type === 'select' && filter.options) {
      const option = filter.options.find(o => o.value === value);
      return option?.label || value;
    }
    return value.toString();
  }

  getActiveFilterKeys(): string[] {
    return Object.keys(this.activeFilters).filter(key => {
      const value = this.activeFilters[key];
      return value !== '' && value !== null && value !== undefined;
    });
  }
}

