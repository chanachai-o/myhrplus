import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService, User } from '../../../core/services/auth.service';

export interface ForgetCard {
  dateId?: string;
  forget_in?: string;
  forget_out?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-employee-edittimestatistic',
  templateUrl: './employee-edittimestatistic.component.html',
  styleUrls: ['./employee-edittimestatistic.component.scss']
})
export class EmployeeEdittimestatisticComponent implements OnInit, OnDestroy {

  page = 1;
  showAlertModal = false;
  pageSize = 10;
  pageSizeShow = this.pageSize;
  collectionSize = 0;

  activeTab = 0;

  data: ForgetCard[] = [];
  lastPage = false;
  msg = "";
  loop = 0;
  noData = false;
  loading = false;

  wom = "";
  npPage = 0;
  npM = 0;

  changeDate = new Date();
  selectStartDate: Date = new Date(this.changeDate.getFullYear(), this.changeDate.getMonth(), 1);
  selectEndDate: Date = new Date(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 0);

  currentUser: User | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    public datepipe: DatePipe,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  public async loadData(): Promise<void> {
    this.data = [];
    this.loop = 0;
    this.page = 0;
    this.lastPage = false;
    this.noData = false;
    this.loading = true;
    do {
      this.loop++;
      await this.getData();
    } while (!this.lastPage && this.loop <= 50);
    this.page = 1;
    this.loading = false;
  }

  async getData(): Promise<void> {
    const startDate = this.formatDate(this.selectStartDate);
    const endDate = this.formatDate(this.selectEndDate);

    const sub = this.employeeService.getForgetcard(startDate, endDate, this.page, this.pageSize).subscribe({
      next: (result: any) => {
        this.page = result['number'] + 1;
        if (result['content'].length == 0) {
          this.noData = true;
        }
        this.data = this.data.concat(result['content']);
        this.collectionSize = this.data.length;
        this.lastPage = result['last'];
        this.cdr.markForCheck();
      },
      error: (reason: any) => {
        this.lastPage = true;
        this.msg = reason.message || 'Error loading data';
        this.showAlertModal = true;
      }
    });
    this.subscriptions.push(sub);
  }

  loadDatawom(): void {
    this.loading = true;
    this.data = [];
    this.noData = false;
    const startDate = this.formatDate(this.selectStartDate);
    const endDate = this.formatDate(this.selectEndDate);

    const sub = this.employeeService.getForgetcard(startDate, endDate, 0, 100).subscribe({
      next: (result: any) => {
        if (result['content'].length == 0) {
          this.noData = true;
        }
        this.data = this.data.concat(result['content']);
        this.collectionSize = this.data.length;
        this.pageSize = this.data.length;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (reason: any) => {
        this.msg = reason.message || 'Error loading data';
        this.loading = false;
        this.showAlertModal = true;
      }
    });
    this.subscriptions.push(sub);
  }

  showWeek(): void {
    this.wom = "Week";
    this.loadDatawom();
  }

  showMonth(): void {
    this.wom = "Month";
    this.loadDatawom();
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

  closeBtnClick(): void {
    this.showAlertModal = false;
    this.ngOnInit();
  }

  getPaginatedData(): ForgetCard[] {
    if (!this.data) return [];
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  getTotalPages(): number {
    if (!this.data || this.pageSize === 0) return 1;
    return Math.ceil(this.data.length / this.pageSize);
  }

  Math = Math; // Expose Math to template
}

