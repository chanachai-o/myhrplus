import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'currency';
  format?: (value: any) => string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() showActions = false;
  @Output() actionClick = new EventEmitter<{action: string, row: any}>();

  displayedColumns: string[] = [];
  filteredData: any[] = [];
  currentPage = 0;
  totalPages = 0;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterValue: string = '';
  showActionMenu: { [key: number]: boolean } = {};

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }
    this.applyFilter();
  }

  applyFilter(event?: Event): void {
    if (event) {
      this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    }
    
    let filtered = [...this.data];
    
    if (this.filterValue) {
      filtered = filtered.filter(row => {
        return this.columns.some(col => {
          const value = row[col.key];
          return value && value.toString().toLowerCase().includes(this.filterValue);
        });
      });
    }

    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.filteredData = filtered.slice(start, end);
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'unfold_more';
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilter();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.applyFilter();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.applyFilter();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.applyFilter();
  }

  getCellValue(row: any, column: TableColumn): string {
    const value = row[column.key];
    if (column.format) {
      return column.format(value);
    }
    if (column.type === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
    }
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('th-TH');
    }
    if (column.type === 'boolean') {
      return value ? 'ใช่' : 'ไม่';
    }
    return value?.toString() || '';
  }

  onActionClick(action: string, row: any): void {
    this.actionClick.emit({ action, row });
    this.showActionMenu = {};
  }

  toggleActionMenu(index: number): void {
    this.showActionMenu = { [index]: !this.showActionMenu[index] };
  }
}
