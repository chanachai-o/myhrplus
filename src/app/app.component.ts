import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { SyncfusionThemeService } from './shared/syncfusion/syncfusion-theme.service';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'HR System';

  @ViewChild('notificationContainer', { read: ViewContainerRef }) notificationContainer!: ViewContainerRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private i18nService: I18nService,
    private syncfusionThemeService: SyncfusionThemeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Initialize theme service
    this.themeService.watchSystemPreference();

    // Apply theme class to body
    this.themeService.theme$.subscribe(theme => {
      const body = document.body;
      // Remove all theme classes
      body.classList.remove('theme-blue', 'theme-indigo', 'theme-purple', 'theme-green', 'theme-orange', 'theme-red', 'theme-teal', 'theme-pink', 'theme-gemini');
      // Add current theme class
      body.classList.add(`theme-${theme.color}`);
    });

    // Initialize i18n service (language is loaded automatically)
    const currentLang = this.i18nService.getCurrentLanguage();
    document.documentElement.setAttribute('lang', currentLang);

    // Initialize Syncfusion theme service
    this.syncfusionThemeService.initialize();

    // Sync dark mode between ThemeService and SyncfusionThemeService
    this.themeService.theme$.subscribe(theme => {
      const isDark = theme.mode === 'dark';
      this.syncfusionThemeService.setDarkMode(isDark, false);
    });

    // Don't redirect if user is already on a route
    // Let the router handle navigation based on current route
  }

  ngAfterViewInit(): void {
    // Initialize notification container after view is initialized
    if (this.notificationContainer) {
      this.notificationService.setContainer(this.notificationContainer);
    }
  }
}
