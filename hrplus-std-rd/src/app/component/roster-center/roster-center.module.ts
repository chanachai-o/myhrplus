import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterCenterRoutingModule } from './roster-center-routing.module';

import { DailyTimeAttendanceKCenterComponent } from './daily-time-attendance-k-center/daily-time-attendance-k-center.component';
import { MemployeeHolidayCenterComponent } from './memployee-holiday-center/memployee-holiday-center.component';
import { ResultOfWorkCenterComponent } from './result-of-work-center/result-of-work-center.component';
import { SummaryWorkHourReportStoreCenterComponent } from './summary-work-hour-report-store-center/summary-work-hour-report-store-center.component';

@NgModule({
  imports: [
    CommonModule,
    RosterCenterRoutingModule,
    DailyTimeAttendanceKCenterComponent,
    MemployeeHolidayCenterComponent,
    ResultOfWorkCenterComponent,
    SummaryWorkHourReportStoreCenterComponent
  ]
})
export class RosterCenterModule { }
