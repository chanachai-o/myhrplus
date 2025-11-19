import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-welfare-home',
  templateUrl: './welfare-home.component.html',
  styleUrls: ['./welfare-home.component.scss']
})
export class WelfareHomeComponent implements OnInit {
  currentUser: User | null = null;

  menuItems = [
    {
      title: 'สวัสดิการ',
      description: 'จัดการสวัสดิการพนักงาน',
      icon: 'e-icons e-favorite',
      route: '/welfare/benefits',
      color: 'bg-pink-500'
    },
    {
      title: 'ลงทะเบียนสวัสดิการ',
      description: 'ลงทะเบียนสวัสดิการ',
      icon: 'e-icons e-check',
      route: '/welfare/enrollment',
      color: 'bg-purple-500'
    },
    {
      title: 'รายงาน',
      description: 'รายงานสวัสดิการ',
      icon: 'e-icons e-chart',
      route: '/welfare/reports',
      color: 'bg-indigo-500'
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



