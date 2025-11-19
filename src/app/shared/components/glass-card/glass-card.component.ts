import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glass-card.component.html',
  styleUrls: ['./glass-card.component.scss']
})
export class GlassCardComponent {
  @Input() variant: 'default' | 'strong' | 'weak' = 'default';
  @Input() animate: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | null = null;
  @Input() padding: string = 'p-6';
  @Input() customClass: string = '';

  get cardClass(): string {
    const baseClass = this.variant === 'strong'
      ? 'glass-card-strong'
      : this.variant === 'weak'
      ? 'glass-card-weak'
      : 'glass-card';

    return `${baseClass} ${this.padding} ${this.customClass}`.trim();
  }
}


