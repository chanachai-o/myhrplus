/**
 * Parking List Component
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, startWith, Observable } from 'rxjs';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { SharedModule } from '@shared/shared.module';
import { IconComponent } from '@shared/components/icon/icon.component';
import { IvapParkingService, NotificationService } from '@core/services';
import { ParkingRecord, PaginatedResponse, QueryParams } from '@core/models/ivap';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    GlassCardComponent,
    GlassInputComponent,
    GlassButtonComponent,
    DataGridComponent,
    SharedModule,
    IconComponent
  ],
  templateUrl: './parking-list.component.html',
  styleUrls: ['./parking-list.component.scss']
})
export class ParkingListComponent implements OnInit, OnDestroy {
  private parkingService = inject(IvapParkingService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  data: ParkingRecord[] = [];
  pagination: PaginatedResponse<ParkingRecord> | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;

  columns: any[] = [
    { field: 'vehicle_id', header: 'Vehicle ID', sortable: true },
    { field: 'parking_slot', header: 'Slot', sortable: true },
    { field: 'entry_time', header: 'Entry Time', sortable: true },
    { field: 'exit_time', header: 'Exit Time', sortable: true },
    { field: 'duration_minutes', header: 'Duration (min)', sortable: true },
    { field: 'fee', header: 'Fee', sortable: true },
    { field: 'status', header: 'Status', sortable: true }
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
        return this.loadParkingRecords({ search: term || '', page: 1 });
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
        this.notificationService.showError('Failed to load parking records');
        this.loading = false;
      }
    });
  }

  private loadParkingRecords(params?: QueryParams): Observable<PaginatedResponse<ParkingRecord>> {
    const queryParams: QueryParams = {
      page: params?.page || this.currentPage,
      page_size: this.pageSize,
      ...params
    };
    return this.parkingService.getAll(queryParams);
  }

  private refreshData(): void {
    this.loading = true;
    this.loadParkingRecords().subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load parking records');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }

  onExit(parking: ParkingRecord): void {
    this.parkingService.exit(parking.parking_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Vehicle exited successfully');
        this.refreshData();
      },
      error: () => {
        this.notificationService.showError('Failed to exit vehicle');
      }
    });
  }
}

