import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-training-home',
  templateUrl: './training-home.component.html',
  styleUrls: ['./training-home.component.scss']
})
export class TrainingHomeComponent implements OnInit {
  currentUser: User | null = null;

  menuItems = [
    {
      title: 'หลักสูตรการฝึกอบรม',
      description: 'จัดการหลักสูตรการฝึกอบรม',
      icon: 'e-icons e-book',
      route: '/training/catalog',
      color: 'bg-blue-500'
    },
    {
      title: 'ลงทะเบียนอบรม',
      description: 'ลงทะเบียนการฝึกอบรม',
      icon: 'e-icons e-check',
      route: '/training/registration',
      color: 'bg-green-500'
    },
    {
      title: 'ประวัติการอบรม',
      description: 'ดูประวัติการฝึกอบรม',
      icon: 'e-icons e-history',
      route: '/training/history',
      color: 'bg-purple-500'
    },
    {
      title: 'ใบรับรอง',
      description: 'จัดการใบรับรองการอบรม',
      icon: 'e-icons e-file',
      route: '/training/certificates',
      color: 'bg-yellow-500'
    },
    {
      title: 'รายงาน',
      description: 'รายงานการฝึกอบรม',
      icon: 'e-icons e-chart',
      route: '/training/reports',
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

