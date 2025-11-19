import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { TaRoutingModule } from './ta-routing.module';
import { TaHomeComponent } from './ta-home/ta-home.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { OvertimeRequestComponent } from './overtime-request/overtime-request.component';
import { TimeEditRequestComponent } from './time-edit-request/time-edit-request.component';
import { ShiftChangeRequestComponent } from './shift-change-request/shift-change-request.component';
import { ExchangeShiftRequestComponent } from './exchange-shift-request/exchange-shift-request.component';
import { ManagerApprovalsComponent } from './manager-approvals/manager-approvals.component';
import { TaReportsComponent } from './reports/ta-reports.component';
// Import standalone components
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../shared/components/glass-button/glass-button.component';
import { GlassInputComponent } from '../../shared/components/glass-input/glass-input.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@NgModule({
  declarations: [
    TaHomeComponent,
    LeaveRequestComponent,
    OvertimeRequestComponent,
    TimeEditRequestComponent,
    ShiftChangeRequestComponent,
    ExchangeShiftRequestComponent,
    ManagerApprovalsComponent,
    TaReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    TaRoutingModule,
    // Standalone components
    PageLayoutComponent,
    GlassCardComponent,
    GlassButtonComponent,
    GlassInputComponent,
    LoadingComponent,
    EmptyStateComponent
  ]
})
export class TaModule { }
