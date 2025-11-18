import { Component, Input } from '@angular/core';

export type SkeletonType = 'text' | 'card' | 'table' | 'list' | 'avatar' | 'custom';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'text';
  @Input() rows: number = 3;
  @Input() columns: number = 3;
  @Input() showAvatar: boolean = false;
  @Input() showTitle: boolean = true;
  @Input() animation: 'pulse' | 'wave' | 'none' = 'pulse';
  @Input() width: string = '100%';
  @Input() height: string = '';

  getRowsArray(): number[] {
    return Array(this.rows).fill(0).map((_, i) => i);
  }

  getColumnsArray(): number[] {
    return Array(this.columns).fill(0).map((_, i) => i);
  }

  getRandomWidth(): string {
    const widths = ['60%', '80%', '90%', '100%'];
    return widths[Math.floor(Math.random() * widths.length)];
  }
}


