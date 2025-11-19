import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-rating-demo',
  standalone: true,
  imports: [CommonModule, RatingComponent, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './rating-demo.component.html',
  styleUrls: ['./rating-demo.component.scss']
})
export class RatingDemoComponent {
  starRating: number = 0;
  heartRating: number = 0;
  readonlyRating: number = 4;
  maxRating: number = 5;

  props: PropDefinition[] = [
    {
      name: 'rating',
      type: 'number',
      default: '0',
      description: 'Current rating value',
      required: false
    },
    {
      name: 'maxRating',
      type: 'number',
      default: '5',
      description: 'Maximum rating value',
      required: false
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Make rating readonly',
      required: false
    },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Show rating value',
      required: false
    },
    {
      name: 'icon',
      type: "'star' | 'heart'",
      default: "'star'",
      description: 'Icon type (star or heart)',
      required: false
    }
  ];

  outputs: PropDefinition[] = [
    {
      name: 'ratingChange',
      type: 'EventEmitter<number>',
      default: '-',
      description: 'Emitted when rating changes',
      required: false
    }
  ];

  basicExample = `<app-rating
  [rating]="rating"
  (ratingChange)="rating = $event">
</app-rating>`;

  readonlyExample = `<app-rating
  [rating]="4"
  [readonly]="true"
  [showValue]="true">
</app-rating>`;

  heartExample = `<app-rating
  [rating]="rating"
  icon="heart"
  (ratingChange)="rating = $event">
</app-rating>`;

  withValueExample = `<app-rating
  [rating]="rating"
  [showValue]="true"
  (ratingChange)="rating = $event">
</app-rating>`;

  customMaxExample = `<app-rating
  [rating]="rating"
  [maxRating]="10"
  (ratingChange)="rating = $event">
</app-rating>`;

  onStarRatingChange(rating: number): void {
    this.starRating = rating;
    console.log('Star rating changed to:', rating);
  }

  onHeartRatingChange(rating: number): void {
    this.heartRating = rating;
    console.log('Heart rating changed to:', rating);
  }
}
