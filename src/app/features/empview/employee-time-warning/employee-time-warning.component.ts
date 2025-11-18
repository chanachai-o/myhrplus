import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService, User } from '../../../core/services/auth.service';

export interface WarningByPeriod {
  dateId?: string;
  forgotswipein?: boolean;
  forgotswipeout?: boolean;
  late?: boolean;
  otbefore?: boolean;
  otafter?: boolean;
  leavebeforefinish?: boolean;
  swipecardinholiday?: boolean;
  otoverbefore?: boolean;
  otoverafter?: boolean;
  otlessbefore?: boolean;
  otlessafter?: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-employee-time-warning',
  templateUrl: './employee-time-warning.component.html',
  styleUrls: ['./employee-time-warning.component.scss']
})
export class EmployeeTimeWarningComponent implements OnInit, OnDestroy {
  page = 1;
  pageSize = 10;
  pageSizeShow = this.pageSize;
  collectionSize = 0;

  activeTab = 0;

  data: WarningByPeriod[] | undefined;
  dataShow: WarningByPeriod[] | undefined;

  forgotswipein = true;
  forgotswipeout = true;
  late = true;
  otbefore = true;
  otafter = false;
  leavebeforefinish = true;
  swipecardinholiday = true;
  otoverbefore = false;
  otoverafter = false;
  otlessbefore = false;
  otlessafter = false;
  selectall = false;
  _searchTerm = '';
  noData = false;
  wom = "";
  loading = false;

  changeDate = new Date();
  selectStartDate: Date = new Date(this.changeDate.getFullYear(), this.changeDate.getMonth(), 1);
  selectEndDate: Date = new Date(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 0);

  currentUser: User | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    public datepipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  loadData(): void {
    this.loading = true;
    const startDate = this.formatDate(this.selectStartDate);
    const endDate = this.formatDate(this.selectEndDate);

    const sub = this.employeeService.getWarningByPeriod(startDate, endDate).subscribe({
      next: (result) => {
        this.data = result;
        this.dataShow = this.data;
        if (this.data && this.data.length > 0) {
          this.collectionSize = this.data.length;
          this.pageSize = this.data.length;
          this.page = 1;
          this.noData = false;
        } else {
          this.collectionSize = 0;
          this.pageSize = 10;
          this.noData = true;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading warning data:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.push(sub);
  }

  selectAll(): void {
    this.selectall = !this.selectall;
    if (this.selectall) {
      this.forgotswipein = true;
      this.forgotswipeout = true;
      this.late = true;
      this.otbefore = true;
      this.otafter = true;
      this.leavebeforefinish = true;
      this.swipecardinholiday = true;
      this.otoverbefore = true;
      this.otoverafter = true;
      this.otlessbefore = true;
      this.otlessafter = true;
      this.dataShow = this.data;
    } else {
      this.dataShow = [];
      this.forgotswipein = false;
      this.forgotswipeout = false;
      this.late = false;
      this.otbefore = false;
      this.otafter = false;
      this.leavebeforefinish = false;
      this.swipecardinholiday = false;
      this.otoverbefore = false;
      this.otoverafter = false;
      this.otlessbefore = false;
      this.otlessafter = false;
    }
    if (this.dataShow && this.dataShow.length > 0) {
      this.noData = false;
    } else {
      this.noData = true;
    }
  }

  showWeek(): void {
    this.wom = "Week";
  }

  showMonth(): void {
    this.wom = "Month";
  }

  nextData(): void {
    if (this.wom == "Now") {
      this.selectStartDate = new Date(this.selectEndDate);
      this.selectStartDate.setDate(this.selectStartDate.getDate() + 1);
      this.selectEndDate = new Date(this.selectStartDate);
    } else if (this.wom == "Week") {
      this.selectStartDate = new Date(this.selectEndDate);
      this.selectStartDate.setDate(this.selectStartDate.getDate() + 1);
      this.selectEndDate = new Date(this.selectStartDate);
      this.selectEndDate.setDate(this.selectEndDate.getDate() + 6);
    } else if (this.wom == "Month") {
      this.selectStartDate = new Date(this.selectEndDate);
      this.selectStartDate.setDate(this.selectStartDate.getDate() + 1);
      this.selectEndDate = new Date(this.selectStartDate);
      this.selectEndDate.setMonth(this.selectEndDate.getMonth() + 1);
      this.selectEndDate.setDate(0);
    }
    this.loadData();
  }

  prevData(): void {
    if (this.wom == "Now") {
      this.selectEndDate = new Date(this.selectStartDate);
      this.selectEndDate.setDate(this.selectEndDate.getDate() - 1);
      this.selectStartDate = new Date(this.selectEndDate);
    } else if (this.wom == "Week") {
      this.selectEndDate = new Date(this.selectStartDate);
      this.selectEndDate.setDate(this.selectEndDate.getDate() - 1);
      this.selectStartDate = new Date(this.selectEndDate);
      this.selectStartDate.setDate(this.selectStartDate.getDate() - 6);
    } else if (this.wom == "Month") {
      this.selectEndDate = new Date(this.selectStartDate);
      this.selectEndDate.setDate(this.selectEndDate.getDate() - 1);
      this.selectStartDate = new Date(this.selectEndDate);
      this.selectStartDate.setMonth(this.selectStartDate.getMonth() - 1);
      this.selectStartDate.setDate(1);
    }
    this.loadData();
  }

  nowData(): void {
    this.changeDate = new Date();
    if (this.wom == "Now") {
      this.selectStartDate = new Date(this.changeDate);
      this.selectEndDate = new Date(this.changeDate);
    } else if (this.wom == "Week") {
      this.selectEndDate = new Date(this.changeDate);
      this.selectStartDate = new Date(this.changeDate);
      this.selectStartDate.setDate(this.selectStartDate.getDate() - 6);
    } else if (this.wom == "Month") {
      this.selectEndDate = new Date(this.changeDate);
      this.selectStartDate = new Date(this.changeDate);
      this.selectStartDate.setMonth(this.selectStartDate.getMonth() - 1);
      this.selectStartDate.setDate(1);
    }
    this.loadData();
  }

  getPaginatedData(): WarningByPeriod[] {
    if (!this.dataShow) return [];
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.dataShow.slice(start, end);
  }

  getTotalPages(): number {
    if (!this.dataShow || this.pageSize === 0) return 1;
    return Math.ceil(this.dataShow.length / this.pageSize);
  }

  Math = Math; // Expose Math to template
}

