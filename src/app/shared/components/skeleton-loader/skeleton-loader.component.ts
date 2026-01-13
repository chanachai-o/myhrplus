import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

export type SkeletonType = 'text' | 'card' | 'table' | 'datagrid' | 'list' | 'avatar' | 'custom';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit, OnChanges {
  @Input() type: SkeletonType = 'text';
  @Input() rows: number = 3;
  @Input() columns: number = 3;
  @Input() showAvatar: boolean = false;
  @Input() showTitle: boolean = true;
  @Input() animation: 'pulse' | 'wave' | 'shimmer' | 'none' = 'pulse';
  @Input() width: string = '100%';
  @Input() height: string = '';
  @Input() showToolbar: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() hasActions: boolean = false;

  // Cache for random widths to prevent ExpressionChangedAfterItHasBeenCheckedError
  // For single-level loops (text, card): use randomWidths[0]
  // For nested loops (list): use randomWidths[itemIndex]
  private randomWidths: string[][] = [];

  ngOnInit(): void {
    this.generateRandomWidths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Regenerate random widths when rows change
    if (changes['rows'] && !changes['rows'].firstChange) {
      this.generateRandomWidths();
    }
  }

  getRowsArray(): number[] {
    return Array(this.rows).fill(0).map((_, i) => i);
  }

  getColumnsArray(): number[] {
    return Array(this.columns).fill(0).map((_, i) => i);
  }

  private generateRandomWidths(): void {
    const widths = ['60%', '80%', '90%', '100%'];
    // Generate widths for single-level loops (text, card types)
    this.randomWidths[0] = Array(this.rows).fill(0).map(() => 
      widths[Math.floor(Math.random() * widths.length)]
    );
    // For list type, we'll generate on-demand in getRandomWidth
  }

  getRandomWidth(rowIndex: number, itemIndex?: number): string {
    const widths = ['60%', '70%', '80%', '90%', '100%'];
    
    // For nested loops (list type, datagrid type), generate widths for each item if not exists
    if (itemIndex !== undefined) {
      if (!this.randomWidths[itemIndex]) {
        this.randomWidths[itemIndex] = Array(this.rows).fill(0).map(() => 
          widths[Math.floor(Math.random() * widths.length)]
        );
      }
      return this.randomWidths[itemIndex][rowIndex] || '100%';
    }
    
    // For single-level loops (text, card types), use index 0
    return this.randomWidths[0]?.[rowIndex] || '100%';
  }
}


