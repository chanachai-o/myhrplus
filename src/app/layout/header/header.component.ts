import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { I18nService, Language } from '../../core/services/i18n.service';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  currentLanguage: Language = 'th';
  showLanguageMenu = false;
  showUserMenu = false;
  languages: { value: Language; label: string; flag: string }[] = [
    { value: 'th', label: 'ไทย', flag: '🇹🇭' },
    { value: 'en', label: 'English', flag: '🇬🇧' }
  ];

  languageMenuItems: MenuItemModel[] = [];
  userMenuItems: MenuItemModel[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    public i18nService: I18nService
  ) {
    // Subscribe to language changes
    this.i18nService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
      this.updateLanguageMenu();
    });

    // Subscribe to user changes
    this.authService.currentUser$.subscribe(() => {
      this.updateUserMenu();
    });

    this.updateLanguageMenu();
    this.updateUserMenu();
  }

  updateLanguageMenu(): void {
    this.languageMenuItems = this.languages.map(lang => ({
      text: `${lang.flag} ${lang.label}`,
      iconCss: this.currentLanguage === lang.value ? 'e-icons e-check' : '',
      id: lang.value
    }));
  }

  updateUserMenu(): void {
    this.userMenuItems = [
      {
        text: 'โปรไฟล์',
        iconCss: 'e-icons e-user',
        id: 'profile'
      },
      {
        text: 'การตั้งค่า',
        iconCss: 'e-icons e-settings',
        id: 'preferences'
      },
      {
        separator: true
      },
      {
        text: 'ออกจากระบบ',
        iconCss: 'e-icons e-logout',
        id: 'logout'
      }
    ];
  }

  onLanguageSelect(args: any): void {
    if (args.item.id) {
      this.changeLanguage(args.item.id as Language);
      this.showLanguageMenu = false;
    }
  }

  onUserMenuSelect(args: any): void {
    switch (args.item.id) {
      case 'profile':
        this.onProfile();
        break;
      case 'preferences':
        this.onPreferences();
        break;
      case 'logout':
        this.onLogout();
        break;
    }
    this.showUserMenu = false;
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

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showLanguageMenu = false;
  }
}
