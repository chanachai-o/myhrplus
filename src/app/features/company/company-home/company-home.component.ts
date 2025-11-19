import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.scss']
})
export class CompanyHomeComponent implements OnInit {
  currentUser: User | null = null;

  menuItems = [
    {
      title: 'ข้อมูลบริษัท',
      description: 'จัดการข้อมูลบริษัท',
      icon: 'e-icons e-briefcase',
      route: '/company/profile',
      color: 'bg-blue-500'
    },
    {
      title: 'โครงสร้างองค์กร',
      description: 'จัดการโครงสร้างองค์กร',
      icon: 'e-icons e-organization',
      route: '/company/organization',
      color: 'bg-green-500'
    },
    {
      title: 'แผนก',
      description: 'จัดการแผนก',
      icon: 'e-icons e-folder',
      route: '/company/departments',
      color: 'bg-purple-500'
    },
    {
      title: 'ตำแหน่งงาน',
      description: 'จัดการตำแหน่งงาน',
      icon: 'e-icons e-user',
      route: '/company/positions',
      color: 'bg-yellow-500'
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




