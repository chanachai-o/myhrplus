import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';

@Component({
  selector: 'app-back-to-top-demo',
  standalone: true,
  imports: [CommonModule, SharedModule, GlassCardComponent, CodeViewerComponent],
  templateUrl: './back-to-top-demo.component.html',
  styleUrls: ['./back-to-top-demo.component.scss']
})
export class BackToTopDemoComponent {
  basicExample = `<app-back-to-top></app-back-to-top>`;

  usageNote = `The BackToTopComponent automatically shows when the user scrolls down more than 400px.
It provides a smooth scroll-to-top functionality with glassmorphism styling.`;
}

