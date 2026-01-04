/**
 * Reset Password Component
 *
 * Component for resetting user password using a reset token.
 * Validates password match and handles password reset submission.
 * Uses centered card design consistent with login/forgot-password components.
 *
 * @example
 * ```html
 * <app-reset-password></app-reset-password>
 * ```
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService, StorageService } from '@core/services';
import { IvapAuthService } from '@core/services/ivap';
import { ResetPasswordRequest } from '@core/models/ivap';
import { Language, isSupportedLanguage, DEFAULT_LANGUAGE, getFlagPath } from '@core/types/language.type';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { ROUTES } from '@core/constants/routes.constant';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { FormValidationMessagesComponent } from '@shared/components/form-validation-messages/form-validation-messages.component';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';

/**
 * Custom validator to check that two password fields match (form-level validator)
 */
function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');
  
  if (!password || !confirmPassword) return null;
  
  return password.value === confirmPassword.value ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    GlassInputComponent,
    GlassButtonComponent,
    GlassCardComponent,
    AlertComponent,
    IconComponent,
    ThemeToggleComponent,
    FormValidationMessagesComponent,
    ClickOutsideDirective
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  token: string | null = null;

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

  constructor(
    private fb: FormBuilder,
    private authService: IvapAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private translate: TranslateService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    // Initialize language from storage
    const savedLang = this.storageService.getItem<Language>(STORAGE_KEYS.LANGUAGE);
    this.currentLang = (savedLang && isSupportedLanguage(savedLang)) 
      ? savedLang 
      : (this.translate.currentLang as Language) || DEFAULT_LANGUAGE;

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(event => {
      const lang = event.lang as Language;
      if (isSupportedLanguage(lang)) {
        this.currentLang = lang;
      }
    });

    // Get token from route (support both URL parameter and query parameter)
    this.token = this.route.snapshot.paramMap.get('token') || 
                 this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.errorMessage.set(
        this.translate.instant('features.auth.resetPassword.error.invalidToken')
      );
      this.notificationService.showError(
        this.translate.instant('features.auth.resetPassword.error.invalidToken')
      );
      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate([ROUTES.AUTH.LOGIN]);
      }, 2000);
    }
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

  onBackToLogin(): void {
    this.router.navigate([ROUTES.AUTH.LOGIN]);
  }

  formatErrorMessage(message: string): string {
    if (!message) return '';
    return message.replace(/\n/g, '<br>');
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.resetPasswordForm.markAllAsTouched();

    if (this.resetPasswordForm.invalid || !this.token) {
      if (!this.token) {
        this.errorMessage.set(
          this.translate.instant('features.auth.resetPassword.error.invalidToken')
        );
        this.notificationService.showError(
          this.translate.instant('features.auth.resetPassword.error.invalidToken')
        );
      } else {
        this.notificationService.showWarning(
          this.translate.instant('features.auth.resetPassword.error.incompleteData')
        );
      }
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const newPassword = this.resetPasswordForm.get('password')?.value || '';
    const request: ResetPasswordRequest = {
      token: this.token,
      new_password: newPassword
    };

    this.authService.resetPassword(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(
          this.translate.instant('features.auth.resetPassword.successMessage')
        );
        this.notificationService.showSuccess(
          this.translate.instant('features.auth.resetPassword.successMessage')
        );
        
        // Clear form after success
        this.resetPasswordForm.reset();

        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate([ROUTES.AUTH.LOGIN]);
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Reset password failed:', error);
        this.loading.set(false);

        const errorMessage = error.error?.message || 
                           error.message || 
                           this.translate.instant('features.auth.resetPassword.error.resetFailed');
        
        this.errorMessage.set(errorMessage);
        this.notificationService.showError(errorMessage);
      }
    });
  }
}

