import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../core/services/nav.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {
  constructor(
    public navService: NavService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Close sidebar on mobile when route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.navService.isMobile()) {
          this.navService.closeSidebar();
        }
      });
  }

  clearToggle(): void {
    // Clear any toggle states
    this.navService.closeSidebar();
  }

  toggleSidebarBody(): void {
    // Toggle sidebar body
    if (this.navService.isMobile()) {
      this.navService.toggleSidebar();
    }
  }

  closeMenu(): void {
    // Close menu states
    this.navService.closeSidebar();
  }
}






