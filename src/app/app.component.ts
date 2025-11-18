import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { SyncfusionThemeService } from './shared/syncfusion/syncfusion-theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HR System';

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private i18nService: I18nService,
    private syncfusionThemeService: SyncfusionThemeService
  ) {}

  ngOnInit(): void {
    // Initialize theme service
    this.themeService.watchSystemPreference();
    
    // Apply theme class to body
    this.themeService.theme$.subscribe(theme => {
      const body = document.body;
      // Remove all theme classes
      body.classList.remove('theme-blue', 'theme-indigo', 'theme-purple', 'theme-green', 'theme-orange', 'theme-red', 'theme-teal', 'theme-pink');
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

    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }
}
