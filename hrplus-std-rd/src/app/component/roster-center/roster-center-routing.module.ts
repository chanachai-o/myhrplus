import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DailyTimeAttendanceKCenterComponent } from './daily-time-attendance-k-center/daily-time-attendance-k-center.component';
import { MemployeeHolidayCenterComponent } from './memployee-holiday-center/memployee-holiday-center.component';
import { ResultOfWorkCenterComponent } from './result-of-work-center/result-of-work-center.component';
import { SummaryWorkHourReportStoreCenterComponent } from './summary-work-hour-report-store-center/summary-work-hour-report-store-center.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'daily-time-attendance-k-center',
    component: DailyTimeAttendanceKCenterComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Daily Time Attendance',
      urls: [
        { title: 'Roster (Center)' },
        { title: 'menu.daily-time-attendance' }
      ]
    }
  },
  {
    path: 'memployee-holiday-center',
    component: MemployeeHolidayCenterComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Memployee Holiday',
      urls: [
        { title: 'Roster (Center)', url: '/memployee-holiday' },
        { title: 'Memployee Holiday' }
      ]
    }
  },
  {
    path: 'result-of-work-center',
    component: ResultOfWorkCenterComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Working Plan',
      urls: [
        { title: 'Roster (Center)', url: '/dashboard' },
        { title: 'Working Plan' }
      ]
    }
  },
  {
    path: 'summary-work-hour-report-by-store-center',
    component: SummaryWorkHourReportStoreCenterComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Summary Work Hour Report Workarea',
      urls: [
        { title: 'Roster (Center)', url: '/summary-work-hour-report-by-store' },
        { title: 'Summary Work Hour Report Workarea' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RosterCenterRoutingModule { }
