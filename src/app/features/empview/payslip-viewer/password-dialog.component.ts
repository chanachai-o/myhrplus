import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-dialog',
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[400px] max-w-[500px]">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 thai-text">Enter Password</h2>
      <div class="mb-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 thai-text">Password</label>
          <input 
            type="password" 
            [(ngModel)]="data.password" 
            (keyup.enter)="onSubmit()"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>
        <div *ngIf="data.msg" class="text-red-600 dark:text-red-400 text-sm mt-2">
          <p>{{ data.msg }}</p>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <button 
          (click)="onCancel()"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors thai-text">
          Cancel
        </button>
        <button 
          (click)="onSubmit()"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors thai-text">
          Login
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class PasswordDialogComponent {
  @Input() data: { password: string; msg: string } = { password: '', msg: '' };
  @Output() closed = new EventEmitter<{ password: string; msg: string } | undefined>();

  onSubmit(): void {
    if (this.data.password) {
      this.closed.emit(this.data);
    }
  }

  onCancel(): void {
    this.closed.emit(undefined);
  }
}
