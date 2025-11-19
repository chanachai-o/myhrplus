import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';

@Component({
  selector: 'app-fullscreen-demo',
  standalone: true,
  imports: [CommonModule, SharedModule, GlassCardComponent, CodeViewerComponent],
  templateUrl: './fullscreen-demo.component.html',
  styleUrls: ['./fullscreen-demo.component.scss']
})
export class FullscreenDemoComponent {
  basicExample = `<button appFullscreen>
  Toggle Fullscreen
</button>`;

  withIconExample = `<button appFullscreen class="btn btn-primary">
  <i class="ri-fullscreen-line"></i> Fullscreen
</button>`;

  usageNote = `The FullscreenDirective toggles fullscreen mode when clicked.
It supports multiple browsers: Chrome, Firefox, Safari, and IE/Edge.`;
}

