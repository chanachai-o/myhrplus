import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterRoutingModule } from './roster-routing.module';

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

@NgModule({
  imports: [
    CommonModule,
    RosterRoutingModule,
    AcApprovedAllStoreComponent,
    AcApprovedByStoreComponent,
    ApproveStatusComponent,
    BackpayComponent,
    DailyTimeAttendanceKComponent,
    DailyTimeAttendanceNewComponent,
    IncomeDeductionApprovedAcComponent,
    IncomeDeductionApprovedRgmComponent,
    ListBackpayComponent,
    ListBackpayStoreComponent,
    MemployeeHolidayComponent,
    ReportBackpayRgmAcComponent,
    ResultOfWorkComponent,
    RgmApprovedByStoreComponent,
    SummaryWorkHourReportByStoreComponent,
    WageSheetAppendComponent
  ]
})
export class RosterModule { }
