/**
 * Forgot Password Component
 *
 * Component for requesting password reset via email.
 * Uses split layout design consistent with login component.
 * Handles form validation and displays success/error messages.
 *
 * @example
 * ```html
 * <app-forgot-password></app-forgot-password>
 * ```
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService, StorageService } from '@core/services';
import { IvapAuthService } from '@core/services/ivap';
import { ForgotPasswordRequest } from '@core/models/ivap';
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

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

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
    private notificationService: NotificationService,
    private storageService: StorageService,
    private translate: TranslateService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
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
    this.forgotPasswordForm.markAllAsTouched();

    if (this.forgotPasswordForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const email = this.forgotPasswordForm.get('email')?.value || '';
      const request: ForgotPasswordRequest = { email };

      this.authService.forgotPassword(request).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.successMessage.set(
            this.translate.instant('features.auth.forgotPassword.successMessage')
          );
          this.notificationService.showSuccess(
            this.translate.instant('features.auth.forgotPassword.successMessage')
          );

          // Clear form after success
          this.forgotPasswordForm.reset();

          // Auto redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate([ROUTES.AUTH.LOGIN]);
          }, 3000);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Forgot password failed:', error);
          this.loading.set(false);

          // Don't reveal if email exists for security
          // Always show success message to prevent email enumeration
          const errorMessage = error.status === 404
            ? this.translate.instant('features.auth.forgotPassword.successMessage')
            : this.translate.instant('features.auth.forgotPassword.error.sendFailed');

          if (error.status === 404) {
            // Show info message (not error) to prevent email enumeration
            this.successMessage.set(errorMessage);
            this.notificationService.showInfo(errorMessage);
          } else {
            this.errorMessage.set(errorMessage);
            this.notificationService.showError(errorMessage);
          }
        }
      });
    } else {
      this.notificationService.showWarning(
        this.translate.instant('features.auth.forgotPassword.error.incompleteData')
      );
    }
  }
}

