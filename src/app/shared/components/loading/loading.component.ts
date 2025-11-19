import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCardComponent } from '../glass-card/glass-card.component';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, GlassCardComponent],
  template: `
    <div *ngIf="show" class="flex items-center justify-center" [ngClass]="containerClass">
      <app-glass-card padding="p-8" customClass="flex flex-col items-center space-y-4">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
          <div class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p *ngIf="message" class="text-slate-700 dark:text-slate-300 font-medium">
          {{ message }}
        </p>
      </app-glass-card>
    </div>
  `,
  styles: []
})
export class LoadingComponent {
  @Input() show: boolean = true;
  @Input() message: string = '';
  @Input() containerClass: string = 'min-h-[200px]';
}


