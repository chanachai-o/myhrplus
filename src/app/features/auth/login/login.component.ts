/**
 * Login Component
 *
 * User authentication component for portal login.
 * Supports username/password authentication, database selection, remember me,
 * language switching, and theme toggling.
 *
 * @example
 * ```html
 * <app-login></app-login>
 * ```
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { NotificationService, MenuService, SwaplangCodeService, StorageService, ThemeService } from '@core/services';
import { IvapAuthService } from '@core/services/ivap';
import { LoginRequest, Token } from '@core/models/ivap';
import { Language, isSupportedLanguage, DEFAULT_LANGUAGE, getFlagPath } from '@core/types/language.type';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { ROUTES } from '@core/constants/routes.constant';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { GlassSelectComponent } from '@shared/components/glass-select/glass-select.component';
import { GlassCheckboxComponent } from '@shared/components/glass-checkbox/glass-checkbox.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { FormValidationMessagesComponent } from '@shared/components/form-validation-messages/form-validation-messages.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    GlassCardComponent,
    GlassButtonComponent,
    GlassInputComponent,
    GlassSelectComponent,
    GlassCheckboxComponent,
    ThemeToggleComponent,
    IconComponent,
    ClickOutsideDirective,
    AlertComponent,
    FormValidationMessagesComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  returnUrl: string = '';
  dbList: any[] = []; // DatabaseModel from legacy system - keep for backward compatibility
  dbSelected: string = '';
  rememberMe: boolean = false;

  // Language
  currentLang: Language = DEFAULT_LANGUAGE;
  showLanguageMenu = false;
  availableLanguages = [
    { code: 'th' as Language, name: 'ไทย', flagPath: getFlagPath('th') },
    { code: 'en' as Language, name: 'English', flagPath: getFlagPath('en') },
    { code: 'lo' as Language, name: 'ລາວ', flagPath: getFlagPath('lo') },
    { code: 'my' as Language, name: 'မြန်မာ', flagPath: getFlagPath('my') },
    { code: 'vi' as Language, name: 'Tiếng Việt', flagPath: getFlagPath('vi') },
    { code: 'zh' as Language, name: '中文', flagPath: getFlagPath('zh') }
  ];

  get currentLanguage() {
    return this.availableLanguages.find(lang => lang.code === this.currentLang) || this.availableLanguages[0];
  }

  get dbSelectOptions(): Array<{ value: string; label: string; disabled?: boolean }> {
    return this.dbList.map(db => ({
      value: db.dbName || db.name || '',
      label: db.dbName || db.name || '',
      disabled: false
    }));
  }

  constructor(
    private fb: FormBuilder,
    private authService: IvapAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private menuService: MenuService,
    private swapLangService: SwaplangCodeService,
    private translate: TranslateService,
    private storageService: StorageService,
    public themeService: ThemeService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      dbName: ['']
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to IVAP Dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || ROUTES.IVAP.DASHBOARD;

    // If already logged in, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }

    // Load saved credentials if Remember Me was checked
    this.loadRememberedCredentials();

    // Load database list
    this.loadDatabases();

    // Initialize language from storage
    const savedLang = this.storageService.getItem<Language>(STORAGE_KEYS.LANGUAGE);
    this.currentLang = (savedLang && isSupportedLanguage(savedLang)) ? savedLang : (this.translate.currentLang as Language) || DEFAULT_LANGUAGE;
    this.translate.use(this.currentLang);

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(event => {
      const lang = event.lang as Language;
      if (isSupportedLanguage(lang)) {
        this.currentLang = lang;
      }
    });
  }

  loadRememberedCredentials(): void {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe && savedUsername) {
      this.rememberMe = true;
      this.loginForm.patchValue({
        username: savedUsername,
        password: savedPassword || ''
      });
    }
  }

  loadDatabases(): void {
    // Note: IVAP API doesn't have getDatabase endpoint
    // This is legacy functionality - keep empty or implement if needed
    this.dbList = [];
  }

  onDbChangeSelect(value: string): void {
    if (value) {
      this.dbSelected = value;
      this.loginForm.patchValue({ dbName: value });
    }
  }

  onForgotPassword(): void {
    this.router.navigate([ROUTES.AUTH.BASE + '/forgot-password']);
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  closeLanguageMenu(): void {
    this.showLanguageMenu = false;
  }

  changeLanguage(lang: Language): void {
    if (lang === this.currentLang) {
      this.closeLanguageMenu();
      return;
    }

    this.currentLang = lang;
    this.translate.use(lang);
    this.storageService.setItem(STORAGE_KEYS.LANGUAGE, lang);
    this.closeLanguageMenu();
  }

  navigateToLanding(): void {
    this.router.navigate([ROUTES.HOME]);
  }

  navigateToRegister(): void {
    this.router.navigate([ROUTES.AUTH.REGISTER]);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.notificationService.showWarning('Please fill in all required fields');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const credentials: LoginRequest = {
      username: this.loginForm.get('username')?.value || '',
      password: this.loginForm.get('password')?.value || ''
    };

    // Clear session if username changed
    const currentUsername = sessionStorage.getItem('userName');
    if (currentUsername && currentUsername !== credentials.username) {
      sessionStorage.clear();
    }

    this.authService.login(credentials).subscribe({
      next: (token: Token) => {
        // Token is automatically saved by IvapAuthService
        // Save Member information to sessionStorage
        const member = token.user;
        if (member) {
          sessionStorage.setItem('userName', member.username || credentials.username);
          sessionStorage.setItem('memberId', member.member_id);
          sessionStorage.setItem('memberEmail', member.email);
          sessionStorage.setItem('memberName', `${member.first_name || ''} ${member.last_name || ''}`.trim());
          sessionStorage.setItem('memberType', member.member_type || '');
          sessionStorage.setItem('actorType', member.actor_type);
          sessionStorage.setItem('currentUser', JSON.stringify(member));
        } else {
          sessionStorage.setItem('userName', credentials.username);
        }

        // Save credentials if Remember Me is checked
        if (this.rememberMe) {
          localStorage.setItem('savedUsername', credentials.username);
          localStorage.setItem('savedPassword', credentials.password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('savedUsername');
          localStorage.removeItem('savedPassword');
          localStorage.removeItem('rememberMe');
        }

        // Verify token is set
        const savedToken = this.authService.getCurrentToken();
        if (!savedToken) {
          this.loading.set(false);
          this.errorMessage.set('Failed to set authentication token');
          this.notificationService.showError(this.errorMessage());
          return;
        }

        // Load swap language codes
        this.swapLangService.getList().subscribe({
          next: (swapResult) => {
            this.swapLangService.saveSwaplang(swapResult);
            this.notificationService.showSuccess('Login successful');
            this.menuService.clearCache();
            this.router.navigate([this.returnUrl]);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Error loading swap language:', error);
            // Proceed anyway
            this.notificationService.showSuccess('Login successful');
            this.menuService.clearCache();
            this.router.navigate([this.returnUrl]);
            this.loading.set(false);
          }
        });
      },
      error: (error: any) => {
        this.loading.set(false);
        const errorMsg = error?.error?.error?.message ||
                        error?.error?.message ||
                        error?.message ||
                        'Login failed. Please try again.';
        this.errorMessage.set(errorMsg);
        this.notificationService.showError(errorMsg);
        this.loginForm.patchValue({ password: '' });
      }
    });
  }
}
