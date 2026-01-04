/**
 * Event List Component
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
import { IvapEventService, NotificationService } from '@core/services';
import { Event, PaginatedResponse, QueryParams } from '@core/models/ivap';

@Component({
  selector: 'app-event-list',
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
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, OnDestroy {
  private eventService = inject(IvapEventService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  data: Event[] = [];
  pagination: PaginatedResponse<Event> | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;

  columns: any[] = [
    { field: 'event_name', header: 'Event Name', sortable: true },
    { field: 'event_type', header: 'Type', sortable: true },
    { field: 'start_date', header: 'Start Date', sortable: true },
    { field: 'end_date', header: 'End Date', sortable: true },
    { field: 'location', header: 'Location', sortable: false },
    { field: 'current_attendees', header: 'Attendees', sortable: true },
    { field: 'max_attendees', header: 'Max', sortable: true },
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
        return this.loadEvents({ search: term || '', page: 1 });
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
        this.notificationService.showError('Failed to load events');
        this.loading = false;
      }
    });
  }

  private loadEvents(params?: QueryParams): Observable<PaginatedResponse<Event>> {
    const queryParams: QueryParams = {
      page: params?.page || this.currentPage,
      page_size: this.pageSize,
      ...params
    };
    return this.eventService.getAll(queryParams);
  }

  private refreshData(): void {
    this.loading = true;
    this.loadEvents().subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load events');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }
}

