/**
 * Guest List Component
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
import { IvapGuestService, NotificationService } from '@core/services';
import { Guest, PaginatedResponse, QueryParams } from '@core/models/ivap';

@Component({
  selector: 'app-guest-list',
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
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit, OnDestroy {
  private guestService = inject(IvapGuestService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  data: Guest[] = [];
  pagination: PaginatedResponse<Guest> | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;

  columns: any[] = [
    { field: 'first_name', header: 'First Name', sortable: true },
    { field: 'last_name', header: 'Last Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'phone_number', header: 'Phone', sortable: false },
    { field: 'registration_type', header: 'Registration Type', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'check_in_time', header: 'Check In', sortable: true },
    { field: 'check_out_time', header: 'Check Out', sortable: true }
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
        return this.loadGuests({ search: term || '', page: 1 });
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
        this.notificationService.showError('Failed to load guests');
        this.loading = false;
      }
    });
  }

  private loadGuests(params?: QueryParams): Observable<PaginatedResponse<Guest>> {
    const queryParams: QueryParams = {
      page: params?.page || this.currentPage,
      page_size: this.pageSize,
      ...params
    };
    return this.guestService.getAll(queryParams);
  }

  private refreshData(): void {
    this.loading = true;
    this.loadGuests().subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load guests');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }

  onCheckIn(guest: Guest): void {
    this.guestService.checkIn(guest.guest_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Guest checked in successfully');
        this.refreshData();
      },
      error: () => {
        this.notificationService.showError('Failed to check in guest');
      }
    });
  }

  onCheckOut(guest: Guest): void {
    this.guestService.checkOut(guest.guest_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Guest checked out successfully');
        this.refreshData();
      },
      error: () => {
        this.notificationService.showError('Failed to check out guest');
      }
    });
  }
}

