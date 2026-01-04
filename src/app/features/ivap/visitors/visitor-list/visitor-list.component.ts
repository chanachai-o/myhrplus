/**
 * Visitor List Component
 * Component สำหรับแสดงรายการ Visitors
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
import { IvapVisitorService } from '@core/services';
import { Visitor, PaginatedResponse, QueryParams } from '@core/models/ivap';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-visitor-list',
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
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.scss']
})
export class VisitorListComponent implements OnInit, OnDestroy {
  private visitorService = inject(IvapVisitorService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  // Search Control
  searchControl = new FormControl('');

  // Data State
  data: Visitor[] = [];
  pagination: PaginatedResponse<Visitor> | null = null;
  loading = false;

  // Table Configuration
  columns: any[] = [
    { field: 'first_name', header: 'First Name', sortable: true },
    { field: 'last_name', header: 'Last Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'phone_number', header: 'Phone', sortable: false },
    { field: 'purpose', header: 'Purpose', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'check_in_time', header: 'Check In', sortable: true },
    { field: 'check_out_time', header: 'Check Out', sortable: true }
  ];

  // Pagination
  currentPage = 1;
  pageSize = 10;

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
        return this.loadVisitors({ search: term || '', page: 1 });
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private loadVisitors(params?: QueryParams): Observable<PaginatedResponse<Visitor>> {
    const queryParams: QueryParams = {
      page: params?.page || this.currentPage,
      page_size: this.pageSize,
      ...params
    };

    return this.visitorService.getAll(queryParams);
  }

  private refreshData(): void {
    this.loading = true;
    this.loadVisitors().subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load visitors');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }

  onEdit(visitor: Visitor): void {
    // Navigate to detail or open form
    // this.router.navigate(['/ivap/visitors', visitor.visitor_id]);
  }

  onCheckIn(visitor: Visitor): void {
    this.visitorService.checkIn(visitor.visitor_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Visitor checked in successfully');
        this.refreshData();
      },
      error: (error) => {
        this.notificationService.showError('Failed to check in visitor');
      }
    });
  }

  onCheckOut(visitor: Visitor): void {
    this.visitorService.checkOut(visitor.visitor_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Visitor checked out successfully');
        this.refreshData();
      },
      error: (error) => {
        this.notificationService.showError('Failed to check out visitor');
      }
    });
  }
}

