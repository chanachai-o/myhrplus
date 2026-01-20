import { Component, Input, OnInit } from '@angular/core';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() src: string = '';
  @Input() name: string = '';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() status: 'online' | 'offline' | 'away' | 'busy' | '' = '';
  @Input() badge: number | string = '';
  @Input() showStatus: boolean = true;
  @Input() showBadge: boolean = true;
  @Input() shape: 'circle' | 'square' | 'rounded' = 'circle';

  initials: string = '';
  hasError: boolean = false;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.initials = this.getInitials(this.name);
  }

  onImageLoad(): void {
    this.isLoading = false;
  }

  private getInitials(name: string): string {
    if (!name) return '';
    
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  onImageError(): void {
    this.hasError = true;
  }

  get statusColor(): string {
    const colorMap: Record<string, string> = {
      online: '#22c55e',
      offline: '#94a3b8',
      away: '#f59e0b',
      busy: '#ef4444'
    };
    return colorMap[this.status] || '';
  }

  isBadgeNumber(): boolean {
    return typeof this.badge === 'number';
  }

  isBadgeDot(): boolean {
    return this.badge === 'dot';
  }

  isBadgeGreaterThanZero(): boolean {
    return this.isBadgeNumber() && typeof this.badge === 'number' && this.badge > 0;
  }

  getBadgeValue(): string {
    if (this.isBadgeGreaterThanZero()) {
      return (this.badge as number) > 99 ? '99+' : String(this.badge);
    }
    return '';
  }

  getSizeClasses(): string {
    const sizes = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20'
    };
    return sizes[this.size] || sizes.md;
  }

  getShapeClasses(): string {
    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-md'
    };
    return shapes[this.shape] || shapes.circle;
  }

  getInitialsSizeClasses(): string {
    const sizes = {
      xs: 'text-[10px]',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-xl',
      xl: 'text-2xl'
    };
    return sizes[this.size] || sizes.md;
  }

  getStatusClasses(): string {
    const sizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    };
    return sizes[this.size] || sizes.md;
  }

  getBadgeClasses(): string {
    if (this.isBadgeDot()) {
      return 'w-2 h-2 min-w-[8px] p-0 rounded-full';
    }
    const sizes = {
      xs: 'w-3 h-3 text-[8px] px-0.5',
      sm: 'w-3.5 h-3.5 text-[9px] px-1',
      md: 'w-4.5 h-4.5 text-[10px] px-1.5',
      lg: 'w-5.5 h-5.5 text-xs px-1.5',
      xl: 'w-7 h-7 text-sm px-2'
    };
    return sizes[this.size] || sizes.md;
  }

  getContainerClasses(): string {
    const baseClasses = 'ring-2 ring-white/20 dark:ring-gray-700/30 shadow-lg';
    const responsiveClasses = 'md:shadow-xl';
    return `${baseClasses} ${responsiveClasses}`;
  }

  getRingClasses(): string {
    return 'ring-primary/30 dark:ring-primary/40 group-hover:ring-primary/50 dark:group-hover:ring-primary/60 ring-offset-white dark:ring-offset-gray-800';
  }

  getInitialsClasses(): string {
    return 'bg-gradient-to-br from-primary via-primary/90 to-primary-dark dark:from-primary dark:via-primary/95 dark:to-primary-dark shadow-inner group-hover:from-primary/90 group-hover:via-primary/85 group-hover:to-primary-dark';
  }

  getStatusBorderClasses(): string {
    return 'border-white dark:border-gray-900';
  }

  getGlowClasses(): string {
    return 'from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-primary/20';
  }

  getBadgeRingClasses(): string {
    return 'ring-white dark:ring-gray-900';
  }

  getBadgeTextClasses(): string {
    const sizes = {
      xs: 'text-[8px]',
      sm: 'text-[9px]',
      md: 'text-[10px]',
      lg: 'text-xs',
      xl: 'text-sm'
    };
    return sizes[this.size] || sizes.md;
  }
}

