import { Component, Input, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    this.initials = this.getInitials(this.name);
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
}

