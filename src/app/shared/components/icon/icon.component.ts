import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <span 
      class="material-icons inline-flex items-center justify-center"
      [class]="sizeClass"
      [ngClass]="color"
      [attr.aria-label]="ariaLabel || name">
      {{ name }}
    </span>
  `,
  styles: [`
    .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
  `]
})
export class IconComponent {
  @Input() name!: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color?: string;
  @Input() ariaLabel?: string;

  get sizeClass(): string {
    const sizeMap = {
      xs: 'text-xs w-3 h-3',
      sm: 'text-base w-4 h-4',
      md: 'text-xl w-5 h-5',
      lg: 'text-2xl w-6 h-6',
      xl: 'text-4xl w-10 h-10'
    };
    return sizeMap[this.size];
  }
}

