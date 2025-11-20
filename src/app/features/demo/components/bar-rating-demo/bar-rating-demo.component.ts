import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarRatingModule } from 'ngx-bar-rating';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';

@Component({
  selector: 'app-bar-rating-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, BarRatingModule, GlassCardComponent, CodeViewerComponent],
  templateUrl: './bar-rating-demo.component.html',
  styleUrls: ['./bar-rating-demo.component.scss']
})
export class BarRatingDemoComponent {
  rating1: number = 0;
  rating2: number = 3;
  rating3: number = 4;
  rating4: number = 2.5;

  basicExample = `<bar-rating
  [(rate)]="rating"
  [max]="5"
  (rateChange)="onRatingChange($event)">
</bar-rating>`;

  readonlyExample = `<bar-rating
  [(rate)]="rating"
  [max]="5"
  [readOnly]="true">
</bar-rating>`;

  onRatingChange(rating: number): void {
    console.log('Rating changed to:', rating);
  }
}




