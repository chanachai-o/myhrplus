import { Component, OnInit } from '@angular/core';
import { EmpviewService, LeaveBalance } from '../services/empview.service';
import { Router } from '@angular/router';

export interface LeaveHistory {
  leaveId: string;
  leaveType: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason?: string;
}

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss']
})
export class LeaveManagementComponent implements OnInit {
  leaveBalances: LeaveBalance[] = [];
  leaveHistory: LeaveHistory[] = [];
  loading = false;
  activeTab = 0;
  selectedYear = new Date().getFullYear();

  constructor(
    private empviewService: EmpviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaveData();
  }

  loadLeaveData(): void {
    this.loading = true;
    
    // Load leave balance
    this.empviewService.getLeaveBalance().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.leaveBalances = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading leave balance:', error);
      }
    });

    // Load leave history
    this.loadLeaveHistory();
  }

  loadLeaveHistory(): void {
    const params = {
      year: this.selectedYear
    };
    
    this.empviewService.getLeaveHistory(params).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.leaveHistory = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leave history:', error);
        this.loading = false;
      }
    });
  }

  requestLeave(): void {
    this.router.navigate(['/ta/leave']);
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadLeaveHistory();
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'approved': 'primary',
      'pending': 'accent',
      'rejected': 'warn',
      'cancelled': ''
    };
    return statusColors[status.toLowerCase()] || '';
  }

  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  }

  historyColumns = [
    { key: 'startDate', label: 'Start Date', type: 'date' as const },
    { key: 'endDate', label: 'End Date', type: 'date' as const },
    { key: 'leaveTypeName', label: 'Leave Type' },
    { key: 'days', label: 'Days' },
    { key: 'status', label: 'Status' },
    { key: 'reason', label: 'Reason' }
  ];

  // Page actions for PageLayoutComponent
  get pageActions() {
    return [
      {
        label: 'Request Leave',
        icon: '➕',
        variant: 'primary' as const,
        onClick: () => this.requestLeave()
      }
    ];
  }
}

