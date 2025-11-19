import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
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




