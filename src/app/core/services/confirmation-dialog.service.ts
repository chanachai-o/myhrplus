import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { TRANSLATION_KEYS } from '../constants/translation-keys.constant';

export interface ConfirmationDialogConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  width?: string;
  showCloseIcon?: boolean;
  closeOnEscape?: boolean;
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

  /**
   * Show confirmation dialog
   * @param config Dialog configuration
   * @returns Observable that emits when user confirms or cancels
   */
  confirm(config: ConfirmationDialogConfig): Observable<ConfirmationDialogResult> {
    this._config.set(config);
    this._visible.set(true);

    return this._resultSubject.asObservable();
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
      confirmButtonClass: 'e-primary',
      cancelButtonClass: 'e-outline'
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
      confirmButtonClass: 'e-primary',
      cancelButtonClass: 'e-outline'
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
    this._visible.set(false);
    this._config.set(null);
    this._resultSubject.complete();
    this._resultSubject = new Subject<ConfirmationDialogResult>();
  }
}

