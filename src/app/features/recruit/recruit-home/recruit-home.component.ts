import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recruit-home',
  templateUrl: './recruit-home.component.html',
  styleUrls: ['./recruit-home.component.scss']
})
export class RecruitHomeComponent implements OnInit {
  currentUser: User | null = null;

  menuItems = [
    {
      title: 'ประกาศรับสมัคร',
      description: 'จัดการประกาศรับสมัครงาน',
      icon: 'e-icons e-file',
      route: '/recruit/job-postings',
      color: 'bg-blue-500'
    },
    {
      title: 'จัดการผู้สมัคร',
      description: 'จัดการข้อมูลผู้สมัครงาน',
      icon: 'e-icons e-people',
      route: '/recruit/candidates',
      color: 'bg-green-500'
    },
    {
      title: 'นัดสัมภาษณ์',
      description: 'จัดการนัดสัมภาษณ์',
      icon: 'e-icons e-calendar',
      route: '/recruit/interviews',
      color: 'bg-purple-500'
    },
    {
      title: 'รายงาน',
      description: 'รายงานการรับสมัคร',
      icon: 'e-icons e-chart',
      route: '/recruit/reports',
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




