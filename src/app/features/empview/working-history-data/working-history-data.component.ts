import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-working-history-data',
  templateUrl: './working-history-data.component.html',
  styleUrls: ['./working-history-data.component.scss']
})
export class WorkingHistoryDataComponent implements OnInit, OnDestroy {
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

  constructor(
    private authService: AuthService,
    private timeService: TimeService,
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
        console.error('Error loading working history data:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.push(sub);
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

  getTotalData(): void {
    if (this.dataShow) {
      this.loading = true;
      this.totalData = this.dataShow.slice((this.page - 1) * this.pageSize, ((this.page - 1) * this.pageSize) + this.pageSize);
      this.loading = false;
    }
  }

  getTotalPages(): number {
    if (!this.dataShow || this.pageSize === 0) return 1;
    return Math.ceil(this.dataShow.length / this.pageSize);
  }

  Math = Math; // Expose Math to template

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


