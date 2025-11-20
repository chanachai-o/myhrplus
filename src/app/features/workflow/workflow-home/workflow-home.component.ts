import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-workflow-home',
  templateUrl: './workflow-home.component.html',
  styleUrls: ['./workflow-home.component.scss']
})
export class WorkflowHomeComponent implements OnInit {
  currentUser: User | null = null;
  loading = false;

  menuItems = [
    {
      title: 'การขอเอกสาร',
      description: 'ยื่นคำขอเอกสารต่างๆ',
      icon: 'e-icons e-file',
      route: '/workflow/requests',
      color: 'bg-blue-500'
    },
    {
      title: 'เอกสารรออนุมัติ',
      description: 'เอกสารที่รอการอนุมัติ',
      icon: 'e-icons e-check',
      route: '/workflow/pending',
      color: 'bg-yellow-500'
    },
    {
      title: 'ประวัติการขอ',
      description: 'ดูประวัติการขอเอกสาร',
      icon: 'e-icons e-history',
      route: '/workflow/history',
      color: 'bg-green-500'
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







