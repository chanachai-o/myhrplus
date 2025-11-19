import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassButtonComponent } from '../glass-button/glass-button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, GlassButtonComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
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



