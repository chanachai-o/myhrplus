import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../../../shared/components/glass-button/glass-button.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-progress-bar-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressBarComponent, GlassCardComponent, GlassButtonComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './progress-bar-demo.component.html',
  styleUrls: ['./progress-bar-demo.component.scss']
})
export class ProgressBarDemoComponent {
  progressValue: number = 65;
  animatedValue: number = 0;
  isAnimating: boolean = false;

  props: PropDefinition[] = [
    {
      name: 'value',
      type: 'number',
      default: '0',
      description: 'Progress value (0-100)',
      required: true
    },
    {
      name: 'label',
      type: 'string',
      default: 'undefined',
      description: 'Progress label text',
      required: false
    },
    {
      name: 'description',
      type: 'string',
      default: 'undefined',
      description: 'Description text below progress bar',
      required: false
    },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'true',
      description: 'Show percentage value',
      required: false
    },
    {
      name: 'variant',
      type: "'primary' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Progress bar color variant',
      required: false
    }
  ];

  basicExample = `<app-progress-bar
  [value]="65"
  label="Progress">
</app-progress-bar>`;

  variantsExample = `<app-progress-bar
  [value]="85"
  label="Success"
  variant="success">
</app-progress-bar>

<app-progress-bar
  [value]="45"
  label="Warning"
  variant="warning">
</app-progress-bar>

<app-progress-bar
  [value]="20"
  label="Danger"
  variant="danger">
</app-progress-bar>`;

  withDescriptionExample = `<app-progress-bar
  [value]="75"
  label="Upload Progress"
  description="Uploading files... 75% complete">
</app-progress-bar>`;

  animatedExample = `// In component.ts
progressValue = 0;

startAnimation() {
  const interval = setInterval(() => {
    this.progressValue += 1;
    if (this.progressValue >= 100) {
      clearInterval(interval);
    }
  }, 50);
}

// In template
<app-progress-bar
  [value]="progressValue"
  label="Loading">
</app-progress-bar>`;

  startAnimation(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animatedValue = 0;
    const interval = setInterval(() => {
      this.animatedValue += 2;
      if (this.animatedValue >= 100) {
        clearInterval(interval);
        this.isAnimating = false;
      }
    }, 50);
  }
}
