/**
 * Door List Component
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, startWith, Observable } from 'rxjs';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { SharedModule } from '@shared/shared.module';
import { IconComponent } from '@shared/components/icon/icon.component';
import { IvapDoorService, NotificationService } from '@core/services';
import { Door, PaginatedResponse, QueryParams } from '@core/models/ivap';

@Component({
  selector: 'app-door-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    GlassCardComponent,
    GlassInputComponent,
    DataGridComponent,
    SharedModule,
    IconComponent
  ],
  templateUrl: './door-list.component.html',
  styleUrls: ['./door-list.component.scss']
})
export class DoorListComponent implements OnInit, OnDestroy {
  private doorService = inject(IvapDoorService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  data: Door[] = [];
  pagination: PaginatedResponse<Door> | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;

  columns: any[] = [
    { field: 'door_name', header: 'Door Name', sortable: true },
    { field: 'door_code', header: 'Door Code', sortable: true },
    { field: 'location', header: 'Location', sortable: true },
    { field: 'device_id', header: 'Device ID', sortable: false },
    { field: 'access_level', header: 'Access Level', sortable: true },
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
        return this.loadDoors({ search: term || '', page: 1 });
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
        this.notificationService.showError('Failed to load doors');
        this.loading = false;
      }
    });
  }

  private loadDoors(params?: QueryParams): Observable<PaginatedResponse<Door>> {
    const queryParams: QueryParams = {
      page: params?.page || this.currentPage,
      page_size: this.pageSize,
      ...params
    };
    return this.doorService.getAll(queryParams);
  }

  private refreshData(): void {
    this.loading = true;
    this.loadDoors().subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load doors');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }
}

