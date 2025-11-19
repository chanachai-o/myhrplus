import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassButtonComponent } from '../glass-button/glass-button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, GlassButtonComponent],
  template: `
    <div
      *ngIf="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="onBackdropClick()">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Backdrop -->
        <div class="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"></div>

        <!-- Modal Panel -->
        <div
          class="glass-modal inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          [class]="sizeClass"
          (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {{ title }}
            </h3>
            <button
              *ngIf="closable"
              (click)="close()"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-4">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          <div *ngIf="showFooter" class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
            <app-glass-button
              *ngIf="showCancel"
              variant="secondary"
              (clicked)="onCancel()">
              {{ cancelText }}
            </app-glass-button>
            <app-glass-button
              *ngIf="showConfirm"
              [variant]="confirmVariant"
              (clicked)="onConfirm()">
              {{ confirmText }}
            </app-glass-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ModalComponent {
  @Input() show: boolean = false;
  @Input() title: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closable: boolean = true;
  @Input() showFooter: boolean = true;
  @Input() showCancel: boolean = true;
  @Input() showConfirm: boolean = true;
  @Input() cancelText: string = 'ยกเลิก';
  @Input() confirmText: string = 'ยืนยัน';
  @Input() confirmVariant: 'primary' | 'danger' = 'primary';
  @Input() closeOnBackdrop: boolean = true;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() confirmEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

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
}


