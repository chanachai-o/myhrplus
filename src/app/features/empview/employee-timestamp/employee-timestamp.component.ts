import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../../core/services/time.service';
import { AuthService, User } from '../../../core/services/auth.service';

export interface TimeCurrent {
  dateId?: string;
  c_tm_bg?: number;
  c_tm_en?: number;
  m_tm_bg?: number;
  m_tm_en?: number;
  forget_in?: string;
  forget_out?: string;
  source_in?: string;
  source_out?: string;
  doctype?: string;
  eventgrp?: {
    eventgrpId?: string;
    tdesc?: string;
    edesc?: string;
  };
  lt?: number;
  m_lv?: number;
  warn05?: string;
  tr_type?: string;
  ac_ot?: number;
  ot1?: number;
  ot5?: number;
  ot2?: number;
  ot3?: number;
  hour_d?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-employee-timestamp',
  templateUrl: './employee-timestamp.component.html',
  styleUrls: ['./employee-timestamp.component.scss']
})
export class EmployeeTimestampComponent implements OnInit, OnDestroy {
  page = 1;
  pageSize = 10;
  pageSizeShow = this.pageSize;
  collectionSize = 0;
  loading = false;

  activeTab = 0;

  changeDate = new Date();
  selectStartDate: Date = new Date(this.changeDate.getFullYear(), this.changeDate.getMonth(), 1);
  selectEndDate: Date = new Date(this.changeDate.getFullYear(), this.changeDate.getMonth() + 1, 0);

  data: TimeCurrent[] | undefined;
  dataShow: TimeCurrent[] | undefined;
  totalData: TimeCurrent[] = [];

  wom = "";
  late = false;
  absent = false;
  leave = false;
  overtime = false;
  noData = false;

  currentUser: User | null = null;
  subscriptions: Subscription[] = [];
  screenWidth: number = window.innerWidth;

  constructor(
    private authService: AuthService,
    private timeService: TimeService,
    public datepipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  showWeek(): void {
    this.wom = "Week";
  }

  showMonth(): void {
    this.wom = "Month";
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  loadData(): void {
    this.loading = true;
    this.data = [];
    this.dataShow = [];
    
    const startDate = this.formatDate(this.selectStartDate);
    const endDate = this.formatDate(this.selectEndDate);

    const sub = this.timeService.getListPeriod(startDate, endDate).subscribe({
      next: (result) => {
        this.data = result;
        this.collectionSize = this.data.length;
        if (this.wom == "Week" || this.wom == "Month") {
          this.pageSize = this.data.length;
        }
        this.dataShow = this.data;
        if (!this.data || this.data.length === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
        this.page = 1;
        this.changeFilter();
        this.getTotalData();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading timestamp data:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.push(sub);
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

  convertyyyyMMddTodate(value: string): string {
    if (!value || value.length < 10) return '';
    const dd = value.substring(8, 10);
    const mm = value.substring(5, 7);
    const yy = value.substring(0, 4);
    const sd = mm + '-' + dd + '-' + yy;
    const day = new Date(sd);
    return this.datepipe.transform(day, "EEEE") || '';
  }

  getFormatWorktime(value: TimeCurrent): string {
    const xx = this.convertFormatTime(value.c_tm_bg || 0);
    const yy = this.convertFormatTime(value.c_tm_en || 0);
    return (xx + ' - ' + yy);
  }

  convertFormatTime(value: number): string {
    return value.toFixed(2).length == 4 ? "0" + value.toFixed(2) : value.toFixed(2);
  }

  getPunchtime(value: TimeCurrent): string {
    let xx = value.forget_in == "0" || value.source_in == "1" || value.source_in == "5"
      || value.source_in == "6" || value.source_in == "7" 
      ? this.convertFormatTime(value.m_tm_bg || 0) 
      : value.doctype == 'A' 
        ? (value.c_tm_bg || 0).toFixed(2) 
        : '__.__';
    
    let yy = value.forget_out == "0" || value.source_out == "1" || value.source_out == "5"
      || value.source_out == "6" || value.source_out == "7" 
      ? this.convertFormatTime(value.m_tm_en || 0) 
      : value.doctype == 'A' 
        ? (value.c_tm_en || 0).toFixed(2) 
        : '__.__';

    if (value.forget_in == "1") {
      xx = "__.__";
    }
    if (value.forget_out == "1") {
      yy = "__.__";
    }
    if (value.source_in == "A") {
      xx = "__.__";
    }
    if (value.source_out == "A") {
      yy = "__.__";
    }
    if (value.doctype == "A") {
      xx = "__.__";
      yy = "__.__";
    }
    return (xx + " - " + yy);
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

  getTotalLate(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.map(ds => ds.lt || 0).reduce(this.sumHour, 0);
    return total == 0 ? null : total;
  }

  getTotalAbsent(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.reduce((acc, value) => {
      const f = acc;
      const s = value.eventgrp?.eventgrpId == 'J' && (value.warn05 != undefined || value.warn05 != '') 
        ? (value.m_lv || 0) 
        : 0;
      const hour = (f - (f % 1)) + (s - (s % 1));
      const min = ((f % 1) + (s % 1)) > 0.59 
        ? (((f % 1) + (s % 1)) - 0.6) + 1 
        : ((f % 1) + (s % 1));
      return hour + min;
    }, 0);
    return total == 0 ? null : total;
  }

  getTotalLeave(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.reduce((acc, value) => {
      const f = acc;
      const s = (value.tr_type?.indexOf('A') == 0) ? (value.m_lv || 0) : 0;
      const hour = (f - (f % 1)) + (s - (s % 1));
      const min = ((f % 1) + (s % 1)) > 0.59 
        ? (((f % 1) + (s % 1)) - 0.6) + 1 
        : ((f % 1) + (s % 1));
      return hour + min;
    }, 0);
    return total == 0 ? null : total;
  }

  getTotalOtTotal(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.map(ds => ds.ac_ot || 0).reduce(this.sumHour, 0);
    return total == 0 ? null : total;
  }

  getTotalOt1(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.map(ds => ds.ot1 || 0).reduce(this.sumHour, 0);
    return total == 0 ? null : total;
  }

  getTotalOt1_5(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.map(ds => ds.ot5 || 0).reduce(this.sumHour, 0);
    return total == 0 ? null : total;
  }

  getTotalOt2(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.map(ds => ds.ot2 || 0).reduce(this.sumHour, 0);
    return total == 0 ? null : total;
  }

  getTotalOt3(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.map(ds => ds.ot3 || 0).reduce(this.sumHour, 0);
    return total == 0 ? null : total;
  }

  getTotalWork(): number | null {
    if (!this.totalData || this.totalData.length === 0) return null;
    const total = this.totalData.map(ds => ds.hour_d || 0).reduce(this.sumHour, 0);
    return total == 0 ? null : total;
  }

  getTotal(): string | null {
    if (this.getTotalLate() == null &&
      this.getTotalAbsent() == null &&
      this.getTotalLeave() == null &&
      this.getTotalOtTotal() == null &&
      this.getTotalOt1() == null &&
      this.getTotalOt1_5() == null &&
      this.getTotalOt2() == null &&
      this.getTotalOt3() == null &&
      this.getTotalWork() == null) {
      return null;
    } else {
      return "Total";
    }
  }

  getTotalData(): void {
    if (this.dataShow) {
      this.loading = true;
      this.totalData = this.dataShow.slice((this.page - 1) * this.pageSize, ((this.page - 1) * this.pageSize) + this.pageSize);
      this.loading = false;
    }
  }

  getEventPage(): void {
    this.getTotalData();
  }

  getTotalPages(): number {
    if (!this.dataShow || this.pageSize === 0) return 1;
    return Math.ceil(this.dataShow.length / this.pageSize);
  }

  Math = Math; // Expose Math to template

  getEventGrpId(value: TimeCurrent): string {
    if (!value.eventgrp) return '';
    if (value.eventgrp.tdesc == 'Not Punch') {
      return 'ลืมลงเวลา';
    } else {
      return value.eventgrp.tdesc || value.eventgrp.edesc || '';
    }
  }

  changeFilter(): void {
    this.page = 1;
    if (this.dataShow && this.data) {
      if (!this.late && !this.absent && !this.leave && !this.overtime) {
        this.dataShow = this.data;
        this.collectionSize = this.dataShow.length;
        if (this.dataShow.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
          this.getTotalData();
        }
      } else {
        this.dataShow = this.data.filter((x: TimeCurrent) =>
          (this.late && (x.lt || 0) > 0) || 
          (this.absent && x.eventgrp?.eventgrpId == 'J' && (x.warn05 != undefined || x.warn05 != '')) ||
          (this.leave && (x.m_lv || 0) > 0 && (x.tr_type?.indexOf('A') == 0)) || 
          (this.overtime && (x.ac_ot || 0) > 0));
        this.collectionSize = this.dataShow.length;
        if (this.dataShow.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
          this.getTotalData();
        }
      }
    }
  }
}


