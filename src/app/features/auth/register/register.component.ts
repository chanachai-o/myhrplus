/**
 * Register Component
 *
 * User registration component with multi-step form (info, verification, success).
 * Supports password strength validation, email verification, and theme/language switching.
 *
 * @example
 * ```html
 * <app-register></app-register>
 * ```
 */

import { Component, OnInit, signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/base/base.component';
import { ThemeService, StorageService, SwaplangCodeService, NotificationService } from '@core/services';
import { IvapAuthService } from '@core/services/ivap';
import { RegisterRequest } from '@core/models/ivap';
import { Language, isSupportedLanguage, DEFAULT_LANGUAGE, getFlagPath } from '@core/types/language.type';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { ROUTES } from '@core/constants/routes.constant';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';

/**
 * Registration form interface
 */
export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ThemeToggleComponent,
    IconComponent,
    GlassButtonComponent,
    GlassCardComponent,
    GlassInputComponent,
    ClickOutsideDirective
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit {
  loading = signal(false);
  currentStep = signal<'info' | 'verification' | 'success'>('info');
  passwordStrength = signal(0);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  formData: RegisterForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  // Verification
  verificationCode = '';
  resendCountdown = signal(0);
  canResend = signal(false);

  // Password requirements
  passwordRequirements = signal({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

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
    private router: Router,
    private authService: IvapAuthService,
    public themeService: ThemeService,
    private translate: TranslateService,
    private swapLangService: SwaplangCodeService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    // Initialize language from storage
    const storedLang = this.storageService.getItem(STORAGE_KEYS.LANGUAGE);
    if (storedLang && isSupportedLanguage(storedLang)) {
      this.currentLang = storedLang;
      this.translate.use(storedLang);
    }

    // Watch language changes
    this.subscribe(
      this.translate.onLangChange,
      (event) => {
        this.currentLang = event.lang as Language;
        this.storageService.setItem(STORAGE_KEYS.LANGUAGE, event.lang);
      }
    );

    // Watch theme changes
    effect(() => {
      const isDark = this.themeService.isDarkMode();
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    // Initialize countdown
    this.startResendCountdown();
  }

  startResendCountdown(): void {
    this.resendCountdown.set(60);
    this.canResend.set(false);

    const countdown = setInterval(() => {
      if (this.resendCountdown() > 0) {
        this.resendCountdown.set(this.resendCountdown() - 1);
      } else {
        clearInterval(countdown);
        this.canResend.set(true);
      }
    }, 1000);
  }

  checkPasswordStrength(password: string): void {
    let strength = 0;
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password)
    };

    this.passwordRequirements.set(requirements);

    if (requirements.minLength) strength += 20;
    if (requirements.hasUppercase) strength += 20;
    if (requirements.hasLowercase) strength += 20;
    if (requirements.hasNumber) strength += 20;
    if (requirements.hasSpecial) strength += 20;

    this.passwordStrength.set(strength);
  }

  getPasswordStrengthColor(): string {
    const strength = this.passwordStrength();
    if (strength < 40) return 'weak';
    if (strength < 80) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.passwordStrength();
    if (strength < 40) return this.translate.instant('features.auth.register.passwordStrength.weak');
    if (strength < 80) return this.translate.instant('features.auth.register.passwordStrength.medium');
    return this.translate.instant('features.auth.register.passwordStrength.strong');
  }

  validateForm(): boolean {
    if (!this.formData.firstName || !this.formData.lastName) {
      this.notificationService.showError(
        this.translate.instant('features.auth.register.errors.nameRequired')
      );
      return false;
    }

    if (!this.formData.email || !this.isValidEmail(this.formData.email)) {
      this.notificationService.showError(
        this.translate.instant('features.auth.register.errors.emailInvalid')
      );
      return false;
    }

    if (!this.formData.password || this.passwordStrength() < 50) {
      this.notificationService.showError(
        this.translate.instant('features.auth.register.errors.passwordWeak')
      );
      return false;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.notificationService.showError(
        this.translate.instant('features.auth.register.errors.passwordMismatch')
      );
      return false;
    }

    if (!this.formData.acceptTerms) {
      this.notificationService.showError(
        this.translate.instant('features.auth.register.errors.termsRequired')
      );
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading.set(true);

    const registerData: RegisterRequest = {
      username: this.formData.email, // Use email as username
      password: this.formData.password,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      actorType: 'member', // Default to member
      memberType: 'employee', // Default to employee
      phoneNumber: '' // Optional
    };

    // Auto-unsubscribe on component destroy
    this.subscribe(
      this.authService.register(registerData),
      (user) => {
        this.loading.set(false);
        this.currentStep.set('verification');
        this.startResendCountdown();
        this.notificationService.showSuccess(
          this.translate.instant('features.auth.register.success.verificationSent')
        );
      },
      (error) => {
        this.loading.set(false);
        const errorMsg = error?.error?.error?.message ||
                        error?.error?.message ||
                        error?.message ||
                        this.translate.instant('features.auth.register.errors.registrationFailed');
        this.notificationService.showError(errorMsg);
      }
    );
  }

  onVerificationSubmit(): void {
    if (!this.verificationCode || this.verificationCode.length < 6) {
      this.notificationService.showError(
        this.translate.instant('features.auth.register.errors.codeInvalid')
      );
      return;
    }

    this.loading.set(true);

    // TODO: Implement email verification API call
    // For now, simulate API call
    setTimeout(() => {
      this.loading.set(false);
      this.currentStep.set('success');
      this.notificationService.showSuccess(
        this.translate.instant('features.auth.register.success.accountCreated')
      );
    }, 1000);
  }

  resendCode(): void {
    if (!this.canResend()) {
      return;
    }

    this.loading.set(true);

    // TODO: Implement resend verification code API call
    // For now, simulate API call
    setTimeout(() => {
      this.loading.set(false);
      this.startResendCountdown();
      this.notificationService.showSuccess(
        this.translate.instant('features.auth.register.success.codeResent')
      );
    }, 500);
  }

  goToLogin(): void {
    this.router.navigate([ROUTES.AUTH.LOGIN]);
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  goBack(): void {
    if (this.currentStep() === 'verification') {
      this.currentStep.set('info');
    }
  }

  navigateToLanding(): void {
    this.router.navigate([ROUTES.HOME]);
  }

  // Language switching methods
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
}

