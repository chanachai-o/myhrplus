import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { I18nService, Language } from '../../core/services/i18n.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  currentLanguage: Language = 'th';
  languages: { value: Language; label: string; flag: string }[] = [
    { value: 'th', label: 'ไทย', flag: '🇹🇭' },
    { value: 'en', label: 'English', flag: '🇬🇧' }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    public i18nService: I18nService
  ) {
    // Subscribe to language changes
    this.i18nService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  onProfile(): void {
    this.router.navigate(['/personal/profile']);
  }

  onPreferences(): void {
    this.router.navigate(['/personal/preferences']);
  }

  changeLanguage(language: Language): void {
    this.i18nService.setLanguage(language);
  }
}
