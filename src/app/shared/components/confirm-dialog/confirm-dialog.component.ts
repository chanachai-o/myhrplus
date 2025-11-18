import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() data!: ConfirmDialogData;
  @Output() closed = new EventEmitter<boolean>();

  constructor() {
    if (this.data) {
      this.data.confirmText = this.data.confirmText || 'Confirm';
      this.data.cancelText = this.data.cancelText || 'Cancel';
    }
  }

  onCancel(): void {
    this.closed.emit(false);
  }

  onConfirm(): void {
    this.closed.emit(true);
  }
}
