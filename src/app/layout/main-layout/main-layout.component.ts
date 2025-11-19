import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SidebarComponent as EjsSidebar } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('sidebar') sidebar!: EjsSidebar;

  isHandset$!: Observable<boolean>;
  sidebarOpen = false;
  sidebarWidth: string = '368px'; // Wider for two-layer design (88px icon bar + 280px menu)
  sidebarType: 'Over' | 'Push' | 'Slide' = 'Over';

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    // Auto-open sidebar on desktop
    this.isHandset$.subscribe(isHandset => {
      if (!isHandset) {
        this.sidebarOpen = true;
        this.sidebarType = 'Push';
        this.sidebarWidth = '368px'; // Two-layer: 88px icon bar + 280px menu
      } else {
        this.sidebarOpen = false;
        this.sidebarType = 'Over';
        this.sidebarWidth = '368px'; // Two-layer: 88px icon bar + 280px menu
      }
    });
  }

  toggleSidebar(): void {
    if (this.sidebar) {
      this.sidebar.toggle();
    } else {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }

  onSidebarClose(): void {
    this.sidebarOpen = false;
  }

  closeSidebar(): void {
    if (this.sidebar) {
      this.sidebar.hide();
    } else {
      this.sidebarOpen = false;
    }
  }
}
