import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, AfterViewInit, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GlassButtonComponent } from '../glass-button/glass-button.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, GlassButtonComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private translate = inject(TranslateService);
  
  @Input() show: boolean = false;
  @Input() title: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closable: boolean = true;
  @Input() showFooter: boolean = true;
  @Input() showCancel: boolean = true;
  @Input() showConfirm: boolean = true;
  @Input() cancelText?: string;
  @Input() confirmText?: string;
  @Input() confirmVariant: 'primary' | 'danger' = 'primary';
  @Input() closeOnBackdrop: boolean = true;
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;

  @ViewChild('modalPanel', { static: false }) modalPanel?: ElementRef<HTMLElement>;
  @ViewChild('closeButton', { static: false }) closeButton?: ElementRef<HTMLButtonElement>;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() confirmEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  private previousActiveElement: HTMLElement | null = null;
  private modalId: string = `modal-${Math.random().toString(36).substr(2, 9)}`;
  private titleId: string = `${this.modalId}-title`;
  private descriptionId: string = `${this.modalId}-description`;

  get sizeClass(): string {
    const sizes = {
      sm: 'sm:max-w-md',
      md: 'sm:max-w-lg',
      lg: 'sm:max-w-2xl',
      xl: 'sm:max-w-4xl'
    };
    return sizes[this.size] || sizes.md;
  }

  close(): void {
    this.show = false;
    this.closeEvent.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  onConfirm(): void {
    this.confirmEvent.emit();
  }

  onCancel(): void {
    this.cancelEvent.emit();
    this.close();
  }

  ngOnInit(): void {
    if (!this.ariaLabelledBy) {
      this.ariaLabelledBy = this.titleId;
    }
    if (!this.ariaDescribedBy) {
      this.ariaDescribedBy = this.descriptionId;
    }
  }

  ngOnDestroy(): void {
    this.restoreFocus();
  }

  ngAfterViewInit(): void {
    if (this.show) {
      this.trapFocus();
    }
  }

  ngOnChanges(): void {
    if (this.show) {
      this.saveActiveElement();
      setTimeout(() => {
        this.trapFocus();
      }, 0);
    } else {
      this.restoreFocus();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.show) return;

    // Close on Escape
    if (event.key === 'Escape' && this.closable) {
      event.preventDefault();
      this.close();
      return;
    }

    // Tab trap
    if (event.key === 'Tab') {
      this.handleTabKey(event);
    }
  }

  private handleTabKey(event: KeyboardEvent): void {
    if (!this.modalPanel) return;

    const focusableElements = this.modalPanel.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement || document.activeElement === this.modalPanel.nativeElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  private saveActiveElement(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
  }

  private restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
  }

  private trapFocus(): void {
    if (this.closeButton) {
      this.closeButton.nativeElement.focus();
    } else if (this.modalPanel) {
      const focusableElements = this.modalPanel.nativeElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      focusableElements[0]?.focus();
    }
  }

  get modalTitleId(): string {
    return this.ariaLabelledBy || this.titleId;
  }

  get modalDescriptionId(): string {
    return this.ariaDescribedBy || this.descriptionId;
  }

  get displayCancelText(): string {
    return this.cancelText || this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL);
  }

  get displayConfirmText(): string {
    return this.confirmText || this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CONFIRM);
  }

  get closeAriaLabel(): string {
    return this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.CLOSE);
  }
}



