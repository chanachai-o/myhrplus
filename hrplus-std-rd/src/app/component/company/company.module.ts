import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';

import { AllowanceComponent } from './allowance/allowance.component';
import { CalendarCompanyComponent } from './calendar-company/calendar-company.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HighCostComponent } from './high-cost/high-cost.component';
import { OilPriceComponent } from './oil-price/oil-price.component';
import { OrgchartComponent } from './orgchart/orgchart.component';
import { OrgchartNewComponent } from './orgchartNew/orgchartNew.component';
import { OrgchartNew2Component } from './orgchartNew2/orgchartNew2.component';
import { OrgchartSaleComponent } from './orgchartSale/orgchartSale.component';
import { PolicyComponent } from './policy/policy.component';
import { ShiftComponent } from './shift/shift.component';
import { VisionMissionComponent } from './vision-mission/vision-mission.component';
import { WorkAreaGroupComponent } from './work-area-group/work-area-group.component';
import { RatePerroundComponent } from './rate-perround/rate-perround.component';
import { DashboardsComponent } from '../shared-ui/dashboards/dashboards.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyRoutingModule,
    AllowanceComponent,
    CalendarCompanyComponent,
    CompanyProfileComponent,
    EmployeeListComponent,
    HighCostComponent,
    OilPriceComponent,
    OrgchartComponent,
    OrgchartNewComponent,
    OrgchartNew2Component,
    OrgchartSaleComponent,
    PolicyComponent,
    RatePerroundComponent,
    ShiftComponent,
    VisionMissionComponent,
    WorkAreaGroupComponent,
    DashboardsComponent,
    CompanyDashboardComponent
  ]
})
export class CompanyModule { }
