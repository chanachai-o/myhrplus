import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { TRANSLATION_KEYS } from '../constants/translation-keys.constant';

export interface ConfirmationDialogConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string; // Deprecated: Use confirmVariant instead
  cancelButtonClass?: string; // Deprecated: Use cancelVariant instead
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'info' | 'success' | 'warning';
  cancelVariant?: 'primary' | 'secondary' | 'danger' | 'info' | 'success' | 'warning';
  width?: string;
  showCloseIcon?: boolean;
  closeOnEscape?: boolean;
  showCancelButton?: boolean; // Show/hide cancel button (default: true)
}

export interface ConfirmationDialogResult {
  confirmed: boolean;
  cancelled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private translate = inject(TranslateService);

  // Dialog state
  private _visible = signal<boolean>(false);
  private _config = signal<ConfirmationDialogConfig | null>(null);
  private _resultSubject = new Subject<ConfirmationDialogResult>();

  // Public signals
  visible = this._visible.asReadonly();
  config = this._config.asReadonly();

  // Computed values for template
  title = computed(() => {
    const config = this._config();
    if (!config) return '';
    return config.title || '';
  });

  message = computed(() => {
    const config = this._config();
    if (!config) return '';
    return config.message || '';
  });

  confirmText = computed(() => {
    const config = this._config();
    if (!config) return this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CONFIRM);
    return config.confirmText || this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CONFIRM);
  });

  cancelText = computed(() => {
    const config = this._config();
    if (!config) return this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL);
    return config.cancelText || this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL);
  });

  confirmButtonClass = computed(() => {
    const config = this._config();
    if (!config) return 'e-primary';
    return config.confirmButtonClass || 'e-primary';
  });

  cancelButtonClass = computed(() => {
    const config = this._config();
    if (!config) return 'e-outline';
    return config.cancelButtonClass || 'e-outline';
  });

  confirmVariant = computed(() => {
    const config = this._config();
    if (!config) return 'primary';
    if (config.confirmVariant) return config.confirmVariant;
    // Fallback: Map from old confirmButtonClass
    const classStr = config.confirmButtonClass || '';
    if (classStr.includes('danger')) return 'danger';
    if (classStr.includes('primary')) return 'primary';
    if (classStr.includes('success')) return 'success';
    if (classStr.includes('warning')) return 'warning';
    if (classStr.includes('info')) return 'info';
    return 'primary';
  });

  cancelVariant = computed(() => {
    const config = this._config();
    if (!config) return 'secondary';
    if (config.cancelVariant) return config.cancelVariant;
    // Fallback: Map from old cancelButtonClass
    const classStr = config.cancelButtonClass || '';
    if (classStr.includes('outline')) return 'secondary';
    return 'secondary';
  });

  width = computed(() => {
    const config = this._config();
    if (!config) return '400px';
    return config.width || '400px';
  });

  showCloseIcon = computed(() => {
    const config = this._config();
    if (!config) return true;
    return config.showCloseIcon !== false;
  });

  closeOnEscape = computed(() => {
    const config = this._config();
    if (!config) return true;
    return config.closeOnEscape !== false;
  });

  showCancelButton = computed(() => {
    const config = this._config();
    if (!config) return true;
    return config.showCancelButton !== false;
  });

  /**
   * Show confirmation dialog
   * @param config Dialog configuration
   * @returns Observable that emits when user confirms or cancels
   */
  confirm(config: ConfirmationDialogConfig): Observable<ConfirmationDialogResult> {
    // If dialog is already open, close it first
    if (this._visible()) {
      this.close();
    }
    
    // Wait a bit to ensure previous dialog is closed
    setTimeout(() => {
      this._config.set(config);
      this._visible.set(true);
    }, 50);

    return this._resultSubject.asObservable().pipe(take(1));
  }

  /**
   * Show delete confirmation dialog
   * @param message Custom message (optional)
   * @returns Observable that emits when user confirms or cancels
   */
  confirmDelete(message?: string): Observable<ConfirmationDialogResult> {
    return this.confirm({
      title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE),
      message: message || this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.CONFIRM.DELETE),
      confirmButtonClass: 'e-primary e-danger',
      cancelButtonClass: 'e-outline'
    });
  }

  /**
   * Show save confirmation dialog
   * @param isEditMode Whether this is an edit operation
   * @param message Custom message (optional)
   * @returns Observable that emits when user confirms or cancels
   */
  confirmSave(isEditMode: boolean = false, message?: string): Observable<ConfirmationDialogResult> {
    const title = isEditMode
      ? this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.EDIT)
      : this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE);

    const defaultMessage = isEditMode
      ? 'คุณต้องการบันทึกการแก้ไขข้อมูลหรือไม่?'
      : 'คุณต้องการบันทึกข้อมูลหรือไม่?';

    return this.confirm({
      title,
      message: message || defaultMessage,
      confirmVariant: 'primary',
      cancelVariant: 'secondary'
    });
  }

  /**
   * Show cancel confirmation dialog
   * @param message Custom message (optional)
   * @returns Observable that emits when user confirms or cancels
   */
  confirmCancel(message?: string): Observable<ConfirmationDialogResult> {
    return this.confirm({
      title: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL),
      message: message || this.translate.instant(TRANSLATION_KEYS.COMMON.MESSAGES.CONFIRM.CANCEL),
      confirmVariant: 'primary',
      cancelVariant: 'secondary'
    });
  }

  /**
   * Show error dialog (single OK button)
   * @param message Error message
   * @param title Dialog title (optional, defaults to "Error")
   * @returns Observable that emits when user clicks OK
   */
  showError(message: string, title?: string): Observable<ConfirmationDialogResult> {
    return this.confirm({
      title: title || this.translate.instant('common.status.error'),
      message: message,
      confirmText: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.OK),
      confirmVariant: 'primary',
      showCancelButton: false
    });
  }

  /**
   * Show success dialog (single OK button)
   * @param message Success message
   * @param title Dialog title (optional, defaults to "Success")
   * @returns Observable that emits when user clicks OK
   */
  showSuccess(message: string, title?: string): Observable<ConfirmationDialogResult> {
    return this.confirm({
      title: title || this.translate.instant('common.status.success'),
      message: message,
      confirmText: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.OK),
      confirmVariant: 'success',
      showCancelButton: false
    });
  }

  /**
   * Handle confirm button click
   */
  onConfirm(): void {
    this._resultSubject.next({ confirmed: true, cancelled: false });
    this.close();
  }

  /**
   * Handle cancel button click
   */
  onCancel(): void {
    this._resultSubject.next({ confirmed: false, cancelled: true });
    this.close();
  }

  /**
   * Close dialog
   */
  close(): void {
    if (!this._visible()) {
      return; // Already closed
    }
    
    this._visible.set(false);
    // Complete and reset subject immediately
    if (!this._resultSubject.closed) {
      this._resultSubject.complete();
    }
    this._resultSubject = new Subject<ConfirmationDialogResult>();
    
    // Delay clearing config to allow animation to complete
    setTimeout(() => {
      this._config.set(null);
    }, 450); // Match animation duration (400ms) + buffer
  }

  /**
   * Check if dialog is fully closed (after animation)
   * @returns Promise that resolves when dialog is fully closed
   */
  waitForClose(): Promise<void> {
    return new Promise((resolve) => {
      if (!this._visible()) {
        // Already closed, wait for animation to complete
        setTimeout(resolve, 450);
      } else {
        // Wait for close + animation
        const checkInterval = setInterval(() => {
          if (!this._visible()) {
            clearInterval(checkInterval);
            setTimeout(resolve, 450); // Wait for animation to complete
          }
        }, 50);
        
        // Safety timeout - resolve after max wait time
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 1000);
      }
    });
  }
}

