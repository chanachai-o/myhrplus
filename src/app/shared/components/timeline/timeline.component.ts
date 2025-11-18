import { Component, Input } from '@angular/core';

export interface TimelineItem {
  title: string;
  description?: string;
  date?: string | Date;
  icon?: string;
  color?: string;
  status?: 'success' | 'error' | 'warning' | 'info' | 'default';
  details?: any;
  expandable?: boolean;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  @Input() items: TimelineItem[] = [];
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() showDates: boolean = true;
  @Input() showIcons: boolean = true;
  @Input() alternate: boolean = false;

  expandedItems: Set<number> = new Set();

  toggleExpand(index: number): void {
    if (this.expandedItems.has(index)) {
      this.expandedItems.delete(index);
    } else {
      this.expandedItems.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedItems.has(index);
  }

  getStatusColor(status?: string): string {
    const colorMap: Record<string, string> = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      default: '#64748b'
    };
    return colorMap[status || 'default'] || colorMap['default'];
  }

  getDefaultIcon(status?: string): string {
    const iconMap: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
      default: 'circle'
    };
    return iconMap[status || 'default'] || iconMap['default'];
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}

