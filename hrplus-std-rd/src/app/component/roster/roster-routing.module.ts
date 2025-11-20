import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AcApprovedAllStoreComponent } from './ac-approved-all-store/ac-approved-all-store.component';
import { AcApprovedByStoreComponent } from './ac-approved-by-store/ac-approved-by-store.component';
import { ApproveStatusComponent } from './approve-status/approve-status.component';
import { BackpayComponent } from './backpay/backpay.component';
import { DailyTimeAttendanceKComponent } from './daily-time-attendance-k/daily-time-attendance-k.component';
import { DailyTimeAttendanceNewComponent } from './daily-time-attendance-new/daily-time-attendance-new.component';
import { IncomeDeductionApprovedAcComponent } from './income-deduction-approved-ac/income-deduction-approved-ac.component';
import { IncomeDeductionApprovedRgmComponent } from './income-deduction-approved-rgm/income-deduction-approved-rgm.component';
import { ListBackpayComponent } from './list-backpay/list-backpay.component';
import { ListBackpayStoreComponent } from './list-backpay-store/list-backpay-store.component';
import { MemployeeHolidayComponent } from './memployee-holiday/memployee-holiday.component';
import { ReportBackpayRgmAcComponent } from './report-backpay-rgm-ac/report-backpay-rgm-ac.component';
import { ResultOfWorkComponent } from './result-of-work/result-of-work.component';
import { RgmApprovedByStoreComponent } from './rgm-approved-by-store/rgm-approved-by-store.component';
import { SummaryWorkHourReportByStoreComponent } from './summary-work-hour-report-by-store/summary-work-hour-report-by-store.component';
import { WageSheetAppendComponent } from './wage-sheet-append/wage-sheet-append.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'ac-approved-all-store',
    component: AcApprovedAllStoreComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Manager Approved All Workarea',
      urls: [
        { title: 'Roster', url: '/ac-approved-all-store' },
        { title: 'Manager Approved All Workarea' }
      ]
    }
  },
  {
    path: 'ac-approved-by-store',
    component: AcApprovedByStoreComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Manager Approved Workarea',
      urls: [
        { title: 'Roster', url: '/ac-approved-by-store' },
        { title: 'Manager Approved Workarea' }
      ]
    }
  },
  {
    path: 'ac-approved-by-store/:workareaId',
    component: AcApprovedByStoreComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Manager Approved Workarea',
      urls: [
        { title: 'Roster', url: '/ac-approved-by-store' },
        { title: 'Manager Approved Workarea' }
      ]
    }
  },
  {
    path: 'approve-status',
    component: ApproveStatusComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Approve Status',
      urls: [
        { title: 'Roster', url: '/approve-status' },
        { title: 'Approve Status' }
      ]
    }
  },
  {
    path: 'backpay',
    component: BackpayComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Backpay',
      urls: [
        { title: 'Roster', url: '/backpay' },
        { title: 'Backpay' }
      ]
    }
  },
  {
    path: 'daily-time-attendance-k',
    component: DailyTimeAttendanceKComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Daily Time Attendance',
      urls: [
        { title: 'Roster' },
        { title: 'menu.daily-time-attendance' }
      ]
    }
  },
  {
    path: 'daily-time-attendance-new',
    component: DailyTimeAttendanceNewComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Daily Time Attendance New',
      urls: [
        { title: 'Roster' },
        { title: 'Daily Time Attendance New' }
      ]
    }
  },
  {
    path: 'income-deduction-approved-ac',
    component: IncomeDeductionApprovedAcComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Income and Deduction Approved by Manager',
      urls: [
        { title: 'menu.user', url: '/dashboard' },
        { title: 'Income and Deduction Approved by Manager' }
      ]
    }
  },
  {
    path: 'income-deduction-approved-rgm',
    component: IncomeDeductionApprovedRgmComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Income and Deduction Approved by Leader',
      urls: [
        { title: 'menu.user', url: '/dashboard' },
        { title: 'Income and Deduction Approved by Leader' }
      ]
    }
  },
  {
    path: 'list-backpay',
    component: ListBackpayComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'List Backpay',
      urls: [
        { title: 'Roster', url: '/list-backpay' },
        { title: 'List Backpay' }
      ]
    }
  },
  {
    path: 'list-backpay-store',
    component: ListBackpayStoreComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'List Backpay (Workarea)',
      urls: [
        { title: 'Roster', url: '/list-backpay-store' },
        { title: 'List Backpay (Workarea)' }
      ]
    }
  },
  {
    path: 'memployee-holiday',
    component: MemployeeHolidayComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Memployee Holiday',
      urls: [
        { title: 'Roster', url: '/memployee-holiday' },
        { title: 'Memployee Holiday' }
      ]
    }
  },
  {
    path: 'report-backpay-rgm-ac',
    component: ReportBackpayRgmAcComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Report Backpay For Leader & Manager',
      urls: [
        { title: 'Roster' },
        { title: 'Report Backpay For Leader & Manager' }
      ]
    }
  },
  {
    path: 'result-of-work',
    component: ResultOfWorkComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Working Plan',
      urls: [
        { title: 'menu.empview-emp-supervisor', url: '/dashboard' },
        { title: 'Working Plan' }
      ]
    }
  },
  {
    path: 'rgm-approved-by-store',
    component: RgmApprovedByStoreComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Leader Approved Workarea',
      urls: [
        { title: 'Roster', url: '/rgm-approved-by-store' },
        { title: 'Leader Approved Workarea' }
      ]
    }
  },
  {
    path: 'summary-work-hour-report-by-store',
    component: SummaryWorkHourReportByStoreComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Summary Work Hour Report Workarea',
      urls: [
        { title: 'Roster', url: '/summary-work-hour-report-by-store' },
        { title: 'Summary Work Hour Report Workarea' }
      ]
    }
  },
  {
    path: 'wage-sheet-append',
    component: WageSheetAppendComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Wage Sheet For Append',
      urls: [
        { title: 'Roster', url: '/wage-sheet-append' },
        { title: 'Wage Sheet For Append' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RosterRoutingModule { }
