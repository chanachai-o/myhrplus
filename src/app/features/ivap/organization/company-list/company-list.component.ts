/**
 * Company List Component
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
import { IvapCompanyService, NotificationService } from '@core/services';
import { Company, PaginatedResponse, QueryParams } from '@core/models/ivap';

@Component({
  selector: 'app-company-list',
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
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  private companyService = inject(IvapCompanyService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  data: Company[] = [];
  pagination: PaginatedResponse<Company> | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;

  columns: any[] = [
    { field: 'company_name', header: 'Company Name', sortable: true },
    { field: 'company_code', header: 'Code', sortable: true },
    { field: 'address', header: 'Address', sortable: false },
    { field: 'owner_name', header: 'Owner', sortable: true },
    { field: 'contact', header: 'Contact', sortable: false },
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
        return this.loadCompanies({ search: term || '', page: 1 });
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
        this.notificationService.showError('Failed to load companies');
        this.loading = false;
      }
    });
  }

  private loadCompanies(params?: QueryParams): Observable<PaginatedResponse<Company>> {
    const queryParams: QueryParams = {
      page: params?.page || this.currentPage,
      page_size: this.pageSize,
      ...params
    };
    return this.companyService.getAll(queryParams);
  }

  private refreshData(): void {
    this.loading = true;
    this.loadCompanies().subscribe({
      next: (response) => {
        this.data = response.items;
        this.pagination = response;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load companies');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }
}

