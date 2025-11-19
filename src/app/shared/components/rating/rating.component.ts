import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() readonly: boolean = false;
  @Input() showValue: boolean = false;
  @Input() icon: 'star' | 'heart' = 'star';
  @Output() ratingChange = new EventEmitter<number>();

  hoveredRating: number = 0;
  stars: number[] = [];

  ngOnInit(): void {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i);
  }

  onStarClick(value: number): void {
    if (!this.readonly) {
      this.rating = value;
      this.ratingChange.emit(value);
    }
  }

  getStarClass(index: number): string {
    const isActive = index <= (this.hoveredRating || this.rating);
    if (this.icon === 'heart') {
      return isActive
        ? 'text-red-500 hover:text-red-600'
        : 'text-slate-300 dark:text-slate-600 hover:text-red-400';
    }
    return isActive
      ? 'text-yellow-400 hover:text-yellow-500'
      : 'text-slate-300 dark:text-slate-600 hover:text-yellow-400';
  }

  getStarIcon(index: number): string {
    if (this.icon === 'heart') {
      return index <= (this.hoveredRating || this.rating) ? '❤️' : '🤍';
    }
    return index <= (this.hoveredRating || this.rating) ? '★' : '☆';
  }
}
