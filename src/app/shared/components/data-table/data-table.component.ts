import { Component, Input, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
export class DataTableComponent implements OnInit, AfterViewInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() showActions = false;
  @Output() actionClick = new EventEmitter<{action: string, row: any}>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }
    this.dataSource.data = this.data;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCellValue(row: any, column: TableColumn): string {
    const value = row[column.key];
    if (column.format) {
      return column.format(value);
    }
    if (column.type === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
    }
    return value;
  }

  onActionClick(action: string, row: any): void {
    this.actionClick.emit({ action, row });
  }
}

