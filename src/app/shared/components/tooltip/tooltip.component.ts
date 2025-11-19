import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <ng-content></ng-content>
      <div
        *ngIf="show && text"
        [class]="tooltipClasses"
        class="absolute z-50 px-3 py-2 text-sm text-white rounded-lg shadow-lg pointer-events-none transition-opacity"
        [style.top.px]="position === 'bottom' ? 100 : position === 'top' ? -100 : 0"
        [style.left.px]="0"
        [style.margin-top.px]="position === 'bottom' ? 8 : position === 'top' ? -8 : 0">
        {{ text }}
        <div
          *ngIf="position === 'bottom'"
          class="absolute -top-1 left-4 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45">
        </div>
        <div
          *ngIf="position === 'top'"
          class="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45">
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() showOnHover: boolean = true;

  show: boolean = false;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.showOnHover) {
      this.show = true;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.showOnHover) {
      this.show = false;
    }
  }

  get tooltipClasses(): string {
    return 'bg-slate-800 dark:bg-slate-700';
  }
}


