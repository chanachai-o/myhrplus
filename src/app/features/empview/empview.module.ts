import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { EmpviewRoutingModule } from './empview-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
// Import standalone components
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../shared/components/glass-button/glass-button.component';
import { StatisticsCardComponent } from '../../shared/components/statistics-card/statistics-card.component';
import { StatisticsGridComponent } from '../../shared/components/statistics-grid/statistics-grid.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { LeaveManagementComponent } from './leave-management/leave-management.component';
import { PayslipViewerComponent } from './payslip-viewer/payslip-viewer.component';
import { TimeAttendanceViewComponent } from './time-attendance-view/time-attendance-view.component';
import { EmployeeWorkInformationComponent } from './employee-work-information/employee-work-information.component';
import { EmployeeTimestampComponent } from './employee-timestamp/employee-timestamp.component';
import { EmployeeTimeWarningComponent } from './employee-time-warning/employee-time-warning.component';
import { EmployeeEdittimestatisticComponent } from './employee-edittimestatistic/employee-edittimestatistic.component';
import { WorkingHistoryDataComponent } from './working-history-data/working-history-data.component';
import { EmployeeOtstatisticComponent } from './employee-otstatistic/employee-otstatistic.component';
import { EmployeeTwi50Component } from './employee-twi50/employee-twi50.component';
import { EmployeePnd91Component } from './employee-pnd91/employee-pnd91.component';
import { PasswordDialogComponent } from './payslip-viewer/password-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PersonalInfoComponent,
    LeaveManagementComponent,
    PayslipViewerComponent,
    PasswordDialogComponent,
    TimeAttendanceViewComponent,
    EmployeeWorkInformationComponent,
    EmployeeTimestampComponent,
    EmployeeTimeWarningComponent,
    EmployeeEdittimestatisticComponent,
    WorkingHistoryDataComponent,
    EmployeeOtstatisticComponent,
    EmployeeTwi50Component,
    EmployeePnd91Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LayoutModule,
    EmpviewRoutingModule,
    // Standalone components
    PageLayoutComponent,
    GlassCardComponent,
    GlassButtonComponent,
    StatisticsCardComponent,
    StatisticsGridComponent,
    LoadingComponent,
    EmptyStateComponent
  ]
})
export class EmpviewModule { }

