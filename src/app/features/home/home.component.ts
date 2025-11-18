import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService, User } from '../../core/services/auth.service';
import { HomeService, MenuCategory, MenuItem } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  menuCategories: MenuCategory[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadMenuCategories();
  }

  private loadMenuCategories(): void {
    this.loading = true;

    // Load menu from API
    this.homeService.loadMenuFromAPI().subscribe({
      next: (categories) => {
        this.menuCategories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading menu categories:', error);
        this.menuCategories = [];
        this.loading = false;
      }
    });
  }

  navigateToMenuItem(item: MenuItem): void {
    if (item.route || item.path) {
      this.router.navigate([item.route || item.path]);
    }
  }

  navigateToCategory(category: MenuCategory): void {
    // Navigate to EMPVIEW module (dashboard) for all main menu items
    this.router.navigate(['/dashboard']);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  }

  getGradientForCategory(code: string): string {
    const gradientMap: { [key: string]: string } = {
      'EM00A': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'EM01A': 'linear-gradient(135deg, #434343 0%, #000000 100%)',
      'EM02A': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'EM03A': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'EM04A': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'EM05A': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'EM06A': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'EM07A': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'EM08A': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'EM09A': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    return gradientMap[code] || 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
  }
}
