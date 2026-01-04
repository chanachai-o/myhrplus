import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, throwError, timer, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface VerificationMethod {
  id: string;
  type: 'sms' | 'email' | 'totp' | 'push' | 'biometric' | 'hardware_token';
  name: string;
  enabled: boolean;
  priority: number;
  icon: string;
  description: string;
  requiresSetup: boolean;
  isSetup: boolean;
}

export interface VerificationCode {
  id: string;
  method: string;
  code: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  used: boolean;
  createdAt: Date;
}

export interface VerificationSession {
  id: string;
  userId: string;
  sessionId: string;
  methods: VerificationMethod[];
  completedMethods: string[];
  requiredMethods: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  metadata: Record<string, any>;
}

export interface BiometricData {
  id: string;
  userId: string;
  type: 'fingerprint' | 'face' | 'voice' | 'iris' | 'palm';
  template: string;
  quality: number;
  enrolledAt: Date;
  lastUsed: Date;
  isActive: boolean;
}

export interface HardwareToken {
  id: string;
  userId: string;
  serialNumber: string;
  type: 'yubikey' | 'fido2' | 'u2f' | 'totp_hardware';
  name: string;
  registeredAt: Date;
  lastUsed: Date;
  isActive: boolean;
  publicKey?: string;
  attestation?: string;
}

export interface PushNotification {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  platform: 'ios' | 'android' | 'web';
  token: string;
  registeredAt: Date;
  lastUsed: Date;
  isActive: boolean;
}

/**
 * Multi-Factor Verification Service
 * 
 * Service for managing multi-factor authentication (MFA) including TOTP, SMS, Email, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class MultiFactorVerificationService {
  private api = inject(ApiService);

  // ✅ Signals for reactive state
  private _verificationMethods = signal<VerificationMethod[]>([]);
  private _activeSession = signal<VerificationSession | null>(null);
  private _biometricData = signal<BiometricData[]>([]);
  private _hardwareTokens = signal<HardwareToken[]>([]);
  private _pushNotifications = signal<PushNotification[]>([]);

  // ✅ Readonly signals for public access
  public readonly verificationMethods = this._verificationMethods.asReadonly();
  public readonly activeSession = this._activeSession.asReadonly();
  public readonly biometricData = this._biometricData.asReadonly();
  public readonly hardwareTokens = this._hardwareTokens.asReadonly();
  public readonly pushNotifications = this._pushNotifications.asReadonly();

  // ✅ Computed signals for derived state
  public readonly verificationMethodsCount = computed(() => this._verificationMethods().length);
  public readonly enabledMethodsCount = computed(() =>
    this._verificationMethods().filter(m => m.enabled).length
  );
  public readonly biometricDataCount = computed(() => this._biometricData().length);
  public readonly activeBiometricDataCount = computed(() =>
    this._biometricData().filter(b => b.isActive).length
  );
  public readonly hardwareTokensCount = computed(() => this._hardwareTokens().length);
  public readonly activeHardwareTokensCount = computed(() =>
    this._hardwareTokens().filter(t => t.isActive).length
  );
  public readonly pushNotificationsCount = computed(() => this._pushNotifications().length);
  public readonly activePushNotificationsCount = computed(() =>
    this._pushNotifications().filter(p => p.isActive).length
  );
  public readonly hasActiveSession = computed(() => this._activeSession() !== null);
  public readonly isSessionCompleted = computed(() =>
    this._activeSession()?.status === 'completed'
  );

  constructor() {
    this.initializeVerificationMethods();
  }

  private initializeVerificationMethods(): void {
    const methods: VerificationMethod[] = [
      {
        id: 'sms',
        type: 'sms',
        name: 'SMS Code',
        enabled: true,
        priority: 1,
        icon: '📱',
        description: 'Receive verification code via SMS',
        requiresSetup: true,
        isSetup: true
      },
      {
        id: 'email',
        type: 'email',
        name: 'Email Code',
        enabled: true,
        priority: 2,
        icon: '📧',
        description: 'Receive verification code via email',
        requiresSetup: true,
        isSetup: true
      },
      {
        id: 'totp',
        type: 'totp',
        name: 'Authenticator App',
        enabled: true,
        priority: 3,
        icon: '🔐',
        description: 'Use authenticator app for time-based codes',
        requiresSetup: true,
        isSetup: false
      },
      {
        id: 'push',
        type: 'push',
        name: 'Push Notification',
        enabled: true,
        priority: 4,
        icon: '🔔',
        description: 'Approve via push notification',
        requiresSetup: true,
        isSetup: false
      },
      {
        id: 'biometric',
        type: 'biometric',
        name: 'Biometric',
        enabled: true,
        priority: 5,
        icon: '👆',
        description: 'Use fingerprint or face recognition',
        requiresSetup: true,
        isSetup: false
      },
      {
        id: 'hardware_token',
        type: 'hardware_token',
        name: 'Hardware Token',
        enabled: true,
        priority: 6,
        icon: '🔑',
        description: 'Use hardware security key',
        requiresSetup: true,
        isSetup: false
      }
    ];

    this._verificationMethods.set(methods);
  }

  // TOTP (Time-based One-Time Password)
  /**
   * Generate TOTP secret and QR code
   */
  generateTOTPSecret(setupData?: any): Observable<{ secret: string; qrCode: string }> {
    // Backend: POST /api/v1/mfa/setup/totp
    return this.api.post<{ secret: string; qrCode: string; qr_code?: string }>('/mfa/setup/totp', setupData || {}).pipe(
      map((response: any) => ({
        secret: response.secret || response.data?.secret || '',
        qrCode: response.qrCode || response.qr_code || response.data?.qr_code || ''
      })),
      catchError((error) => {
        console.error('Error generating TOTP secret:', error);
        throw error;
      })
    );
  }

  /**
   * Verify TOTP code
   */
  verifyTOTPCode(verificationRequest: any): Observable<boolean> {
    // Backend: POST /api/v1/mfa/verify
    return this.api.post<{ valid: boolean; verified?: boolean }>('/mfa/verify', verificationRequest).pipe(
      map((response: any) => {
        const isValid = response.valid || response.verified || false;
        if (isValid) {
          this.completeVerificationMethod('totp');
        }
        return isValid;
      }),
      catchError((error) => {
        console.error('Error verifying TOTP code:', error);
        throw error;
      })
    );
  }

  // Session Management
  private completeVerificationMethod(methodId: string): void {
    const session = this._activeSession();
    if (session && !session.completedMethods.includes(methodId)) {
      session.completedMethods.push(methodId);
      session.lastActivity = new Date();

      // Check if all required methods are completed
      const allRequiredCompleted = session.requiredMethods.every(method =>
        session.completedMethods.includes(method)
      );

      if (allRequiredCompleted) {
        session.status = 'completed';
      } else {
        session.status = 'in_progress';
      }

      this._activeSession.set({ ...session });
    }
  }

  // Backup Codes
  /**
   * Generate backup codes
   */
  generateBackupCodes(request: any): Observable<any> {
    // Backend: POST /api/v1/mfa/backup-codes/generate
    return this.api.post<any>('/mfa/backup-codes/generate', request);
  }
}

