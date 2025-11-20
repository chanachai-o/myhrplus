import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Syncfusion Components
import { CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';
import { ChartModule } from '@syncfusion/ej2-angular-charts';

interface QuickAccessItem {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
}

interface ActivityItem {
  text: string;
  time: string;
  icon: string;
  type: string;
}

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CircularGaugeModule,
    ChartModule
  ],
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent implements OnInit {
  // Stats data
  totalEmployees = 1250;
  activeProjects = 8;
  upcomingEvents = 3;
  totalPolicies = 15;

  // Quick access items
  quickAccessItems: QuickAccessItem[] = [
    {
      title: 'menu.employee-list',
      description: 'company.quick.employee.description',
      route: '/company/employee-list',
      icon: 'mdi mdi-account-group',
      color: 'primary'
    },
    {
      title: 'menu.orgchart',
      description: 'company.quick.orgchart.description',
      route: '/company/orgchart',
      icon: 'mdi mdi-sitemap',
      color: 'success'
    },
    {
      title: 'menu.policy',
      description: 'company.quick.policy.description',
      route: '/company/policy',
      icon: 'mdi mdi-file-document-multiple',
      color: 'warning'
    },
    {
      title: 'menu.company-profile',
      description: 'company.quick.profile.description',
      route: '/company/company-profile',
      icon: 'mdi mdi-office-building',
      color: 'info'
    },
    {
      title: 'menu.calendar-company',
      description: 'company.quick.calendar.description',
      route: '/company/calendar-company',
      icon: 'mdi mdi-calendar',
      color: 'danger'
    },
    {
      title: 'menu.vision-mission',
      description: 'company.quick.vision.description',
      route: '/company/vision-mission',
      icon: 'mdi mdi-target',
      color: 'secondary'
    }
  ];

  // Recent activities
  recentActivities: ActivityItem[] = [
    {
      text: 'company.activity.employee.added',
      time: '2 hours ago',
      icon: 'mdi mdi-account-plus',
      type: 'success'
    },
    {
      text: 'company.activity.policy.updated',
      time: '4 hours ago',
      icon: 'mdi mdi-file-edit',
      type: 'info'
    },
    {
      text: 'company.activity.orgchart.modified',
      time: '1 day ago',
      icon: 'mdi mdi-sitemap',
      type: 'warning'
    },
    {
      text: 'company.activity.calendar.event',
      time: '2 days ago',
      icon: 'mdi mdi-calendar-plus',
      type: 'primary'
    }
  ];

  // Chart data
  chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 82 },
    { month: 'Jun', value: 78 }
  ];

  marker = {
    visible: true,
    width: 10,
    height: 10
  };

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load dashboard data from services
    // This would typically involve calling various services to get real data
    console.log('Loading dashboard data...');
  }

  refreshData(): void {
    // Refresh all dashboard data
    this.loadDashboardData();
    console.log('Dashboard data refreshed');
  }
}
