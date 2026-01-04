/**
 * Shift List Component
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, startWith, Observable } from 'rxjs';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { SharedModule } from '@shared/shared.module';
import { IconComponent } from '@shared/components/icon/icon.component';
import { IvapShiftService, NotificationService } from '@core/services';
import { Shift, PaginatedResponse, QueryParams } from '@core/models/ivap';

@Component({
  selector: 'app-shift-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    GlassCardComponent,
    GlassInputComponent,
    DataGridComponent,
    SharedModule,
    IconComponent
  ],
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss']
})
export class ShiftListComponent implements OnInit, OnDestroy {
  private shiftService = inject(IvapShiftService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  data: Shift[] = [];
  pagination: PaginatedResponse<Shift> | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;

  columns: any[] = [
    { field: 'shift_name', header: 'Shift Name', sortable: true },
    { field: 'start_time', header: 'Start Time', sortable: true },
    { field: 'end_time', header: 'End Time', sortable: true },
    { field: 'break_duration', header: 'Break (min)', sortable: true },
    { field: 'is_active', header: 'Active', sortable: true }
  ];

  ngOnInit(): void {
    this.setupSearch();
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        return this.loadShifts({ search: term || '', page: 1 });
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load shifts');
        this.loading = false;
      }
    });
  }

  private loadShifts(params?: QueryParams): Observable<PaginatedResponse<Shift>> {
    const queryParams: QueryParams = {
      page: params?.page || this.currentPage,
      page_size: this.pageSize,
      ...params
    };
    return this.shiftService.getAll(queryParams);
  }

  private refreshData(): void {
    this.loading = true;
    this.loadShifts().subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load shifts');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }
}

