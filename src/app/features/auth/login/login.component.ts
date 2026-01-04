import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationService, MenuService, SwaplangCodeService } from '@core/services';
import { StorageService } from '@core/services';
import { ThemeService } from '@core/services';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import jwt_decode from 'jwt-decode';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { Language, isSupportedLanguage, DEFAULT_LANGUAGE, getFlagPath } from '@core/types/language.type';
// IVAP Services
import { IvapAuthService } from '@core/services/ivap';
import { LoginRequest, Token } from '@core/models/ivap';
// Shared Components
import { IconComponent } from '@shared/components/icon/icon.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { GlassSelectComponent } from '@shared/components/glass-select/glass-select.component';
import { GlassCheckboxComponent } from '@shared/components/glass-checkbox/glass-checkbox.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
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
    IconComponent,
    GlassInputComponent,
    GlassSelectComponent,
    GlassCheckboxComponent,
    GlassButtonComponent,
    GlassCardComponent,
    AlertComponent,
    ThemeToggleComponent,
    FormValidationMessagesComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string = '';
  dbList: any[] = []; // DatabaseModel from legacy system - keep for backward compatibility
  dbSelected: string = '';
  errorMessage: string = '';
  rememberMe: boolean = false;

  // For reusable components
  username: string = '';
  password: string = '';
  dbSelectOptions: Array<{ value: string; label: string; disabled?: boolean }> = [];

  // Language
  currentLang: Language = 'th';
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
    private themeService: ThemeService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      dbName: ['']
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/ivap/dashboard' (IVAP Dashboard)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/ivap/dashboard';

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
      this.username = savedUsername;
      this.password = savedPassword || '';
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
    // For now, we'll skip database selection for IVAP API
    this.dbList = [];
    this.dbSelectOptions = [];
  }

  onDbChangeSelect(value: string): void {
    if (value) {
      this.dbSelected = value;
      this.loginForm.patchValue({ dbName: value });
    }
  }

  onForgotPassword(): void {
    // Navigate to forgot password page
    this.router.navigate(['/auth/forgot-password']);
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  closeLanguageMenu(): void {
    this.showLanguageMenu = false;
  }

  changeLanguage(language: Language): void {
    // Validate language
    if (!isSupportedLanguage(language)) {
      console.warn(`Language ${language} is not supported.`);
      return;
    }

    // Change language
    this.translate.use(language);

    // Save to storage
    this.storageService.setItem(STORAGE_KEYS.LANGUAGE, language);

    // Update document language attribute
    document.documentElement.setAttribute('lang', language);

    this.currentLang = language;
    this.showLanguageMenu = false;
  }

  onUsernameChange(value: string): void {
    this.username = value;
    this.loginForm.patchValue({ username: value });
  }

  onPasswordChange(value: string): void {
    this.password = value;
    this.loginForm.patchValue({ password: value });
  }

  onPasswordKeyUp(event: KeyboardEvent): void {
    const username = this.loginForm.get('username')?.value || '';
    const password = this.loginForm.get('password')?.value || '';
    if (event.key === 'Enter' && username && password) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    // Get values from form controls
    const username = this.loginForm.get('username')?.value || '';
    const password = this.loginForm.get('password')?.value || '';
    const dbName = this.loginForm.get('dbName')?.value || this.dbSelected;

    // Update component properties for consistency
    this.username = username;
    this.password = password;

    // Update form values
    this.loginForm.patchValue({
      username: username,
      password: password,
      dbName: dbName
    });

    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Clear session if username changed
      const currentUsername = sessionStorage.getItem('userName');
      if (currentUsername && currentUsername !== username) {
        sessionStorage.clear();
      }

      const credentials: LoginRequest = {
        username: username,
        password: password
      };

      this.authService.login(credentials).subscribe({
        next: (token: Token) => {
          console.log('Login successful. Token:', token);
          console.log('User (Member):', token.user);

          // Token is automatically saved by IvapAuthService
          // Save Member information to sessionStorage
          const member = token.user;
          if (member) {
            sessionStorage.setItem('userName', member.username || username);
            sessionStorage.setItem('memberId', member.member_id);
            sessionStorage.setItem('memberEmail', member.email);
            sessionStorage.setItem('memberName', `${member.first_name || ''} ${member.last_name || ''}`.trim());
            sessionStorage.setItem('memberType', member.member_type || '');
            sessionStorage.setItem('actorType', member.actor_type);
            sessionStorage.setItem('currentUser', JSON.stringify(member));
          } else {
            // Fallback to username if member is not available
            sessionStorage.setItem('userName', username);
          }

          // Save credentials if Remember Me is checked
          if (this.rememberMe) {
            localStorage.setItem('savedUsername', username);
            localStorage.setItem('savedPassword', password);
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('savedUsername');
            localStorage.removeItem('savedPassword');
            localStorage.removeItem('rememberMe');
          }

          // Verify token is set
          const savedToken = this.authService.getCurrentToken();
          if (!savedToken) {
            console.error('Token not set after login');
            this.loading = false;
            this.errorMessage = 'Failed to set authentication token';
            this.notificationService.showError(this.errorMessage);
            return;
          }

          // For IVAP API, we can directly navigate after successful login
          // Use Member information from token.user
          this.swapLangService.getList().subscribe({
            next: (swapResult) => {
              this.swapLangService.saveSwaplang(swapResult);
              this.notificationService.showSuccess('Login successful');
              this.menuService.clearCache();
              this.router.navigate([this.returnUrl]);
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading swap language:', error);
              // Proceed anyway
              this.notificationService.showSuccess('Login successful');
              this.menuService.clearCache();
              this.router.navigate([this.returnUrl]);
              this.loading = false;
            }
          });
        },
        error: (error: any) => {
          console.error('Login failed. Reason:', error);
          this.loading = false;

          if (error.status === 401) {
            this.errorMessage = 'Invalid Username or Password';
            this.notificationService.showError(this.errorMessage);
          } else {
            this.errorMessage = error.message || error.error?.message || 'Login failed. Please try again.';
            this.notificationService.showError(this.errorMessage);
          }

          this.loginForm.patchValue({ password: '' });
        }
      });
    } else {
      this.notificationService.showWarning('Please fill in all required fields');
    }
  }

  /**
   * Call getSetPass API after token is verified
   * Note: This method is kept for backward compatibility but may not be needed for IVAP API
   * Legacy logic for JSP redirect and accountactive check
   */
  private callGetSetPass(result: any): void {
    // For IVAP API, this method is not needed as we handle navigation directly in login success
    // Keeping this method for potential legacy system integration
    console.warn('callGetSetPass called but not needed for IVAP API');
  }
}
