import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCardComponent } from '../glass-card/glass-card.component';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, GlassCardComponent],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() show: boolean = true;
  @Input() message: string = '';
  @Input() containerClass: string = 'min-h-[200px]';
}




