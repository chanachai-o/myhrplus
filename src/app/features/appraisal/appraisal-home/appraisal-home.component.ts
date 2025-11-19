import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-appraisal-home',
  templateUrl: './appraisal-home.component.html',
  styleUrls: ['./appraisal-home.component.scss']
})
export class AppraisalHomeComponent implements OnInit {
  currentUser: User | null = null;

  menuItems = [
    {
      title: 'การประเมินผล',
      description: 'จัดการการประเมินผลการทำงาน',
      icon: 'e-icons e-chart',
      route: '/appraisal/appraisals',
      color: 'bg-blue-500'
    },
    {
      title: 'รายงาน',
      description: 'รายงานการประเมินผล',
      icon: 'e-icons e-file',
      route: '/appraisal/reports',
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



