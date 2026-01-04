import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { StorageService } from './core/services/storage.service';
import { SyncfusionThemeService } from './shared/syncfusion/syncfusion-theme.service';
import { NotificationService } from './core/services/notification.service';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, isSupportedLanguage, Language } from '@core/types/language.type';

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
    private storageService: StorageService,
    private syncfusionThemeService: SyncfusionThemeService,
    private notificationService: NotificationService,
    private translateService: TranslateService
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

    // Initialize language from storage
    const savedLang = this.storageService.getItem<Language>(STORAGE_KEYS.LANGUAGE);
    const currentLang = (savedLang && isSupportedLanguage(savedLang)) ? savedLang : DEFAULT_LANGUAGE;

    // Set default language for TranslateService
    this.translateService.setDefaultLang(DEFAULT_LANGUAGE);
    // Add all supported languages
    this.translateService.addLangs(SUPPORTED_LANGUAGES);
    this.translateService.use(currentLang);

    // Update document language attribute
    document.documentElement.setAttribute('lang', currentLang);

    // Subscribe to language changes
    this.translateService.onLangChange.subscribe(event => {
      const lang = event.lang as Language;
      if (isSupportedLanguage(lang)) {
        // Save to storage
        this.storageService.setItem(STORAGE_KEYS.LANGUAGE, lang);
        // Update document language attribute
        document.documentElement.setAttribute('lang', lang);
      }
    });

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
