import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService, WorkPlan } from '../../../core/services/employee.service';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-time-attendance-view',
  templateUrl: './time-attendance-view.component.html',
  styleUrls: ['./time-attendance-view.component.scss']
})
export class TimeAttendanceViewComponent implements OnInit, OnDestroy {
  // Pagination
  page = 1;
  pageSize = 10;
  pageSizeShow = this.pageSize;
  collectionSize = 0;

  // Data
  data: WorkPlan[] | undefined;
  dataShow: WorkPlan[] | undefined;
  
  // Time calculations
  wTime = 0;  // Working time
  lTime = 0;  // Leave time
  oTime = 0;  // OT time
  aTime = "0.00";  // Total time
  aTimeD = 0;
  aTimeH = 0;
  aTimeM = 0;
  
  // Date selection
  changeDate = new Date();
  selectStartDate: Date = new Date(this.changeDate.getFullYear(), this.changeDate.getMonth(), 1);
  selectEndDate: Date = new Date(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 0);
  
  // Search
  _searchTerm = '';
  noData = false;
  loading = false;
  wom = "";  // Week or Month
  
  currentUser: User | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router,
    public datepipe: DatePipe,
    public cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.wTime = 0;
    this.oTime = 0;
    this.lTime = 0;
    this.aTime = "0.00";
    this.loading = true;
    
    // Unsubscribe previous subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    const startDate = this.formatDate(this.selectStartDate);
    const endDate = this.formatDate(this.selectEndDate);

    const sub = this.employeeService.getWorkData(startDate, endDate).subscribe({
      next: (result) => {
        this.data = result;
        this.dataShow = this.data.filter((x: any) => (x.dateId?.indexOf(this._searchTerm) !== -1));
        this.collectionSize = this.data.length;
        this.pageSize = this.collectionSize;
        this.page = 1;
        
        if (this.dataShow!.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }

        this.sumTime();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading work data:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.push(sub);
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  sumHour = (accumulator: any, currentValue: any) => {
    const totalTime = accumulator.toFixed(2).split('.').map(Number);
    const time = currentValue.toFixed(2).split('.').map(Number);
    let timeHour = time[0];
    let timeMin = time[1];
    let totalTimeHour = totalTime[0];
    let totalTimeMin = totalTime[1];
    let hour = totalTimeHour + timeHour;
    let min = totalTimeMin + timeMin;
    if (min >= 60) {
      min = min - 60;
      hour = hour + 1;
    }
    return parseFloat(hour + '.' + (min < 10 ? '0' + min : min));
  }

  sumTime(): void {
    if (this.dataShow?.length != 0 && this.dataShow) {
      this.wTime = 0;
      this.lTime = 0;
      this.oTime = 0;
      this.aTime = "0.00";
      this.aTimeD = 0;
      this.aTimeH = 0;
      this.aTimeM = 0;

      // Working time (eventgrp = "T")
      const workingData = this.dataShow.filter(xx => xx['eventgrp']?.eventgrpId == "T");
      if (workingData.length > 0) {
        this.wTime = workingData.map(xx => xx['hourD'] || 0).reduce(this.sumHour, 0);
      }

      // OT time (eventgrp = "O")
      const otData = this.dataShow.filter(xx => xx['eventgrp']?.eventgrpId == "O");
      if (otData.length > 0) {
        this.oTime = otData.map(xx => xx['apot'] || 0).reduce(this.sumHour, 0);
      }

      // Leave time (not T, O, H, I, J)
      const leaveData = this.dataShow.filter(xx => 
        xx['eventgrp']?.eventgrpId != "T" && 
        xx['eventgrp']?.eventgrpId != "O" &&
        xx['eventgrp']?.eventgrpId != "H" && 
        xx['eventgrp']?.eventgrpId != "I" && 
        xx['eventgrp']?.eventgrpId != "J"
      );
      if (leaveData.length > 0) {
        this.lTime = leaveData.map(xx => xx['hourD'] || 0).reduce(this.sumHour, 0);
      }

      // Calculate total time
      let wH = 0;
      let wM = 0;
      let oH = 0;
      let oM = 0;

      if (this.wTime.toString().indexOf(".") > -1) {
        wH = parseInt(this.wTime.toString().split(".")[0]);
        wM = parseInt(this.wTime.toString().split(".")[1]);
      } else {
        wH = this.wTime;
      }

      if (this.oTime.toString().indexOf(".") > -1) {
        oH = parseInt(this.oTime.toString().split(".")[0]);
        oM = parseInt(this.oTime.toString().split(".")[1]);
      } else {
        oH = this.oTime;
      }

      this.aTimeH = wH + oH;
      this.aTimeM = wM + oM;
      while (this.aTimeM >= 60) {
        this.aTimeM = this.aTimeM - 60;
        this.aTimeH = this.aTimeH + 1;
      }
      this.aTime = this.aTimeH + "." + (this.aTimeM.toString().length == 2 ? this.aTimeM : (this.aTimeM + "0"));
    }
  }

  convertToEEEE(value: string): string {
    if (!value || value.length < 10) return '';
    const dd = value.substring(0, 2);
    const mm = value.substring(3, 5);
    const yy = value.substring(6, 10);
    const sd = mm + '-' + dd + '-' + yy;
    const day = new Date(sd);
    return this.datepipe.transform(day, "EEEE") || '';
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
      this.selectEndDate.setDate(0); // Last day of month
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

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(val: string) {
    this._searchTerm = val;
    if (this.dataShow && this.data) {
      this.dataShow = this.filterName(val);
      if (this.dataShow.length == 0) {
        this.noData = true;
        this.wTime = 0;
        this.lTime = 0;
        this.oTime = 0;
        this.aTime = "0.00";
      } else {
        this.sumTime();
        this.noData = false;
      }
      this.page = 1;
      this.collectionSize = this.dataShow.length;
    }
  }

  filterName(v: string): WorkPlan[] {
    if (!this.data) return [];
    return this.data.filter((x: any) => (x.dateId?.indexOf(v) !== -1));
  }

  requestTimeEdit(): void {
    this.router.navigate(['/ta/time-edit']);
  }

  getPaginatedData(): WorkPlan[] {
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

  // Page actions for PageLayoutComponent
  get pageActions() {
    return [
      {
        label: 'Request Time Edit',
        icon: '✏️',
        variant: 'primary' as const,
        onClick: () => this.requestTimeEdit()
      }
    ];
  }
}

