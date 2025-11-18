import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="cardClass"
      [class.animate-fade-in]="animate === 'fade-in'"
      [class.animate-slide-up]="animate === 'slide-up'"
      [class.animate-slide-down]="animate === 'slide-down'"
      [class.animate-scale-in]="animate === 'scale-in'">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class GlassCardComponent {
  @Input() variant: 'default' | 'strong' | 'weak' = 'default';
  @Input() animate: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | null = null;
  @Input() padding: string = 'p-6';

  get cardClass(): string {
    const baseClass = this.variant === 'strong' 
      ? 'glass-card-strong' 
      : this.variant === 'weak'
      ? 'glass-card-weak'
      : 'glass-card';
    
    return `${baseClass} ${this.padding}`;
  }
}


