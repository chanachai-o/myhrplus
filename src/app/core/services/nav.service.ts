import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  
  // Screen width tracking
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Search Box state
  public search = false;

  // Language switcher state
  public language = false;

  // Mega Menu state
  public megaMenu = false;
  public levelMenu = false;
  public megaMenuColapse: boolean = false;

  // Collapse Sidebar state
  public collapseSidebar: boolean = false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = true;

  // Full screen state
  public fullScreen = false;

  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize(): void {
    const initialWidth = window.innerWidth;
    this.setScreenWidth(initialWidth);
    
    // Set initial states based on screen width
    this.collapseSidebar = initialWidth < 991;
    this.megaMenuColapse = initialWidth < 1199;
    this.horizontal = initialWidth >= 991;

    // Listen to window resize events
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        const width = evt.target.innerWidth;
        this.setScreenWidth(width);
        
        if (width < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        } else {
          this.collapseSidebar = false;
        }
        
        if (width < 1199) {
          this.megaMenuColapse = true;
        } else {
          this.megaMenuColapse = false;
        }

        this.horizontal = width >= 991;
      });

    // Detect route change and close sidebar on mobile
    if (window.innerWidth < 991) {
      this.router.events
        .pipe(takeUntil(this.unsubscriber))
        .subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.collapseSidebar = true;
            this.megaMenu = false;
            this.levelMenu = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber.next(null);
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  // Toggle search box
  toggleSearch(): void {
    this.search = !this.search;
  }

  // Toggle language switcher
  toggleLanguage(): void {
    this.language = !this.language;
  }

  // Toggle mega menu
  toggleMegaMenu(): void {
    this.megaMenu = !this.megaMenu;
  }

  // Toggle level menu
  toggleLevelMenu(): void {
    this.levelMenu = !this.levelMenu;
  }

  // Toggle sidebar collapse
  toggleSidebar(): void {
    this.collapseSidebar = !this.collapseSidebar;
  }

  // Close sidebar
  closeSidebar(): void {
    this.collapseSidebar = true;
  }

  // Open sidebar
  openSidebar(): void {
    this.collapseSidebar = false;
  }

  // Toggle fullscreen
  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        this.fullScreen = true;
      }).catch(() => {
        this.fullScreen = false;
      });
    } else {
      document.exitFullscreen().then(() => {
        this.fullScreen = false;
      }).catch(() => {
        this.fullScreen = false;
      });
    }
  }

  // Check if screen is mobile
  isMobile(): boolean {
    return this.screenWidth.value < 768;
  }

  // Check if screen is tablet
  isTablet(): boolean {
    const width = this.screenWidth.value;
    return width >= 768 && width < 1024;
  }

  // Check if screen is desktop
  isDesktop(): boolean {
    return this.screenWidth.value >= 1024;
  }
}





