/**
 * IVAP Dashboard Component
 * Dashboard หลักสำหรับ IVAP system
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { StatisticsCardComponent } from '@shared/components/statistics-card/statistics-card.component';
import { StatisticsGridComponent } from '@shared/components/statistics-grid/statistics-grid.component';
import { SharedModule } from '@shared/shared.module';
import { IconComponent } from '@shared/components/icon/icon.component';
import { StaggerDirective } from '@shared/directives/stagger.directive';
import { IvapCompanyService } from '@core/services';
import { DashboardStatistics } from '@core/models/ivap';

@Component({
  selector: 'app-ivap-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    GlassCardComponent,
    PageHeaderComponent,
    StatisticsCardComponent,
    StatisticsGridComponent,
    SharedModule,
    IconComponent,
    StaggerDirective
  ],
  templateUrl: './ivap-dashboard.component.html',
  styleUrls: ['./ivap-dashboard.component.scss']
})
export class IvapDashboardComponent implements OnInit {
  loading = true;
  statistics: DashboardStatistics | null = null;

  statisticsCards = [
    {
      title: 'Total Employees',
      value: 0,
      icon: 'people',
      color: 'primary',
      trend: null
    },
    {
      title: 'Total Visitors',
      value: 0,
      icon: 'person',
      color: 'info',
      trend: null
    },
    {
      title: 'Total Devices',
      value: 0,
      icon: 'devices',
      color: 'success',
      trend: null
    },
    {
      title: 'Active Verifications',
      value: 0,
      icon: 'verified',
      color: 'warning',
      trend: null
    }
  ];

  constructor(private companyService: IvapCompanyService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.loading = true;
    // TODO: Implement dashboard statistics API call
    // For now, use placeholder data
    setTimeout(() => {
      this.statistics = {
        total_employees: 150,
        total_visitors: 45,
        total_devices: 12,
        active_verifications: 8
      };
      this.updateStatisticsCards();
      this.loading = false;
    }, 1000);
  }

  private updateStatisticsCards(): void {
    if (this.statistics) {
      this.statisticsCards[0].value = this.statistics.total_employees;
      this.statisticsCards[1].value = this.statistics.total_visitors;
      this.statisticsCards[2].value = this.statistics.total_devices;
      this.statisticsCards[3].value = this.statistics.active_verifications;
    }
  }

  getIconBgClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'primary': 'bg-primary/10 dark:bg-primary/20',
      'info': 'bg-blue-100 dark:bg-blue-900/30',
      'success': 'bg-green-100 dark:bg-green-900/30',
      'warning': 'bg-yellow-100 dark:bg-yellow-900/30',
      'danger': 'bg-red-100 dark:bg-red-900/30'
    };
    return colorMap[color] || 'bg-primary/10 dark:bg-primary/20';
  }
}

