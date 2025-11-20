// Template for module home components
// This is a reference template - copy and modify for each module

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-module-home',
  templateUrl: './module-home.component.html',
  styleUrls: ['./module-home.component.scss']
})
export class ModuleHomeComponent implements OnInit {
  currentUser: User | null = null;
  loading = false;
  moduleName: string = 'Module';
  moduleDescription: string = 'Module Description';

  menuItems: Array<{
    title: string;
    description: string;
    icon: string;
    route: string;
    color: string;
  }> = [];

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









