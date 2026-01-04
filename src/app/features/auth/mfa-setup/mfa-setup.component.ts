/**
 * MFA Setup Component
 *
 * Component for setting up multi-factor authentication (MFA).
 * Supports QR code generation, secret key display, backup codes, and verification.
 * Uses centered card design consistent with login/forgot-password/reset-password components.
 *
 * @example
 * ```html
 * <app-mfa-setup></app-mfa-setup>
 * ```
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService, StorageService, AuthService, MultiFactorVerificationService } from '@core/services';
import { Member } from '@core/models';
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
import { SharedModule } from '@shared/shared.module';

/**
 * MFA setup interface
 */
interface MFASetup {
  qrCode: string;
  secretKey: string;
  backupCodes: string[];
}

@Component({
  selector: 'app-mfa-setup',
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
    ClickOutsideDirective,
    SharedModule
  ],
  templateUrl: './mfa-setup.component.html',
  styleUrls: ['./mfa-setup.component.scss']
})
export class MfaSetupComponent implements OnInit {
  mfaSetup = signal<MFASetup | null>(null);
  verificationForm: FormGroup;
  loading = signal(false);
  verifying = signal(false);
  step = signal<'setup' | 'verify' | 'complete'>('setup');
  errorMessage = signal('');

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
    private mfaService: MultiFactorVerificationService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private translate: TranslateService
  ) {
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
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

    // Load MFA setup
    this.loadMFASetup();
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

  loadMFASetup(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.mfaService.generateTOTPSecret().subscribe({
      next: (response) => {
        // Generate backup codes
        const backupCodes = this.generateBackupCodes();
        this.mfaSetup.set({
          qrCode: response.qrCode,
          secretKey: response.secret,
          backupCodes: backupCodes
        });
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading MFA setup:', error);
        this.errorMessage.set(
          this.translate.instant('features.auth.mfaSetup.error.loadFailed')
        );
        this.notificationService.showError(
          this.translate.instant('features.auth.mfaSetup.error.loadFailed')
        );
        this.loading.set(false);
      }
    });
  }

  verifyCode(): void {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      this.notificationService.showWarning(
        this.translate.instant('features.auth.mfaSetup.error.invalidCode')
      );
      return;
    }

    this.verifying.set(true);
    this.errorMessage.set('');

    const code = this.verificationForm.get('code')?.value;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.member_id) {
      this.errorMessage.set(
        this.translate.instant('features.auth.mfaSetup.error.userNotFound')
      );
      this.notificationService.showError(
        this.translate.instant('features.auth.mfaSetup.error.userNotFound')
      );
      this.verifying.set(false);
      return;
    }

    const verificationRequest = {
      member_id: currentUser.member_id,
      company_id: currentUser.user_metadata?.['company_id'] || '',
      method: 'totp',
      code: code
    };

    this.mfaService.verifyTOTPCode(verificationRequest).subscribe({
      next: (isValid) => {
        if (isValid) {
          this.step.set('complete');
          this.verifying.set(false);
          this.notificationService.showSuccess(
            this.translate.instant('features.auth.mfaSetup.successMessage')
          );
          // Redirect to dashboard after successful setup
          setTimeout(() => {
            this.router.navigate([ROUTES.IVAP.DASHBOARD]);
          }, 2000);
        } else {
          this.errorMessage.set(
            this.translate.instant('features.auth.mfaSetup.error.invalidCode')
          );
          this.notificationService.showError(
            this.translate.instant('features.auth.mfaSetup.error.invalidCode')
          );
          this.verifying.set(false);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error verifying TOTP code:', error);
        this.errorMessage.set(
          error.error?.message || 
          error.message || 
          this.translate.instant('features.auth.mfaSetup.error.verifyFailed')
        );
        this.notificationService.showError(
          error.error?.message || 
          error.message || 
          this.translate.instant('features.auth.mfaSetup.error.verifyFailed')
        );
        this.verifying.set(false);
      }
    });
  }

  skipMFA(): void {
    this.router.navigate([ROUTES.IVAP.DASHBOARD]);
  }

  /**
   * Check if image URL is Base64 encoded
   */
  isBase64Image(url: string | null | undefined): boolean {
    if (!url) return false;
    return url.startsWith('data:image/') || url.startsWith('data:image/svg+xml');
  }

  downloadBackupCodes(): void {
    const codes = this.mfaSetup()?.backupCodes || [];
    const content = codes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mfa-backup-codes.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.notificationService.showSuccess(
      this.translate.instant('features.auth.mfaSetup.backupCodesDownloaded')
    );
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate 8-character backup code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }
}

