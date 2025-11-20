import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllowanceComponent } from './allowance/allowance.component';

import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HighCostComponent } from './high-cost/high-cost.component';
import { OilPriceComponent } from './oil-price/oil-price.component';
import { OrgchartComponent } from './orgchart/orgchart.component';
import { OrgchartNewComponent } from './orgchartNew/orgchartNew.component';
import { OrgchartNew2Component } from './orgchartNew2/orgchartNew2.component';
import { OrgchartSaleComponent } from './orgchartSale/orgchartSale.component';
import { PolicyComponent } from './policy/policy.component';
import { RatePerroundComponent } from './rate-perround/rate-perround.component';
import { ShiftComponent } from './shift/shift.component';
import { VisionMissionComponent } from './vision-mission/vision-mission.component';
import { WorkAreaGroupComponent } from './work-area-group/work-area-group.component';
import { CalendarCompanyComponent } from './calendar-company/calendar-company.component';
import { DashboardsComponent } from '../shared-ui/dashboards/dashboards.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: CompanyDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Company Dashboard',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'Company Dashboard' }
      ]
    }
  },
  {
    path: 'home',
    component: DashboardsComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Homepage',
      urls: [
        { title: 'Homepage', url: '/dashboard' },
        { title: 'Homepage' }
      ]
    }
  },
  {
    path: 'allowance',
    component: AllowanceComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Allowance',
      urls: [
        { title: 'menu.company' },
        { title: 'Allowance' }
      ]
    }
  },
  {
    path: 'calendar-company',
    component: CalendarCompanyComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Yearly Calendar',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.calendar-company' }
      ]
    }
  },
  {
    path: 'company-profile',
    component: CompanyProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Company Profile',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.company-profile' }
      ]
    }
  },
  {
    path: 'employee-list',
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'List of Employee',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.employee-list' }
      ]
    }
  },
  {
    path: 'high-cost',
    component: HighCostComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'High cost',
      urls: [
        { title: 'menu.company' },
        { title: 'High cost' }
      ]
    }
  },
  {
    path: 'oil-price',
    component: OilPriceComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Oil Price',
      urls: [
        { title: 'menu.company' },
        { title: 'Oil Price' }
      ]
    }
  },
  {
    path: 'orgchart',
    component: OrgchartComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Organization Chart',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.orgchart' }
      ]
    }
  },
  {
    path: 'orgchartNew',
    component: OrgchartNewComponent,
    data: {
      title: 'Organization Chart',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.orgchart (new)' }
      ]
    }
  },
  {
    path: 'orgchartNew2',
    component: OrgchartNew2Component,
    data: {
      title: 'Organization Chart',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.orgchart (new)' }
      ]
    }
  },
  {
    path: 'orgchartSale',
    component: OrgchartSaleComponent,
    data: {
      title: 'Organization Chart',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.orgchart (new)' }
      ]
    }
  },
  {
    path: 'policy',
    component: PolicyComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Policy/Regulation/Rules',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.policy' }
      ]
    }
  },
  {
    path: 'rate-perround',
    component: RatePerroundComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Rate Perround',
      urls: [
        { title: 'menu.company' },
        { title: 'Rate Perround' }
      ]
    }
  },
  {
    path: 'shift',
    component: ShiftComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Shift Allowance',
      urls: [
        { title: 'menu.company' },
        { title: 'Shift' }
      ]
    }
  },
  {
    path: 'vision-mission',
    component: VisionMissionComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Vision/Mission',
      urls: [
        { title: 'menu.company', url: '/dashboard' },
        { title: 'menu.vision-mission' }
      ]
    }
  },
  {
    path: 'work-area-group',
    component: WorkAreaGroupComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Work Area Group',
      urls: [
        { title: 'menu.company' },
        { title: 'Work Area Group' }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
