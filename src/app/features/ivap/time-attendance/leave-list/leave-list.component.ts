/**
 * Leave List Component
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, startWith, Observable } from 'rxjs';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { SharedModule } from '@shared/shared.module';
import { IconComponent } from '@shared/components/icon/icon.component';
import { IvapLeaveService, NotificationService } from '@core/services';
import { LeaveRequest, PaginatedResponse, QueryParams } from '@core/models/ivap';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    GlassCardComponent,
    GlassInputComponent,
    GlassButtonComponent,
    DataGridComponent,
    SharedModule,
    IconComponent
  ],
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit, OnDestroy {
  private leaveService = inject(IvapLeaveService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  data: LeaveRequest[] = [];
  pagination: PaginatedResponse<LeaveRequest> | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;

  columns: any[] = [
    { field: 'company_employee_id', header: 'Employee ID', sortable: true },
    { field: 'leave_type', header: 'Leave Type', sortable: true },
    { field: 'start_date', header: 'Start Date', sortable: true },
    { field: 'end_date', header: 'End Date', sortable: true },
    { field: 'days', header: 'Days', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'approved_by', header: 'Approved By', sortable: false }
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
        return this.loadLeaves({ search: term || '', page: 1 });
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
        this.notificationService.showError('Failed to load leave requests');
        this.loading = false;
      }
    });
  }

  private loadLeaves(params?: QueryParams): Observable<PaginatedResponse<LeaveRequest>> {
    const queryParams: QueryParams = {
      page: params?.page || this.currentPage,
      page_size: this.pageSize,
      ...params
    };
    return this.leaveService.getAll(queryParams);
  }

  private refreshData(): void {
    this.loading = true;
    this.loadLeaves().subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load leave requests');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }

  onApprove(leave: LeaveRequest): void {
    this.leaveService.approve(leave.leave_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Leave request approved');
        this.refreshData();
      },
      error: () => {
        this.notificationService.showError('Failed to approve leave request');
      }
    });
  }

  onReject(leave: LeaveRequest): void {
    this.leaveService.reject(leave.leave_id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Leave request rejected');
        this.refreshData();
      },
      error: () => {
        this.notificationService.showError('Failed to reject leave request');
      }
    });
  }
}

