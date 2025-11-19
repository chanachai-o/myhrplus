import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payroll-home',
  templateUrl: './payroll-home.component.html',
  styleUrls: ['./payroll-home.component.scss']
})
export class PayrollHomeComponent implements OnInit {
  currentUser: User | null = null;

  menuItems = [
    {
      title: 'จัดการเงินเดือน',
      description: 'จัดการข้อมูลเงินเดือนพนักงาน',
      icon: 'e-icons e-money',
      route: '/payroll/salary',
      color: 'bg-green-500'
    },
    {
      title: 'สลิปเงินเดือน',
      description: 'ดูและจัดการสลิปเงินเดือน',
      icon: 'e-icons e-receipt',
      route: '/payroll/payslip',
      color: 'bg-blue-500'
    },
    {
      title: 'รายงาน',
      description: 'รายงานเงินเดือน',
      icon: 'e-icons e-chart',
      route: '/payroll/reports',
      color: 'bg-purple-500'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}




