import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from '../../../../shared/components/tooltip/tooltip.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../../../shared/components/glass-button/glass-button.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [CommonModule, TooltipComponent, GlassCardComponent, GlassButtonComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.scss']
})
export class TooltipDemoComponent {
  props: PropDefinition[] = [
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'Tooltip text content',
      required: true
    },
    {
      name: 'position',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'bottom'",
      description: 'Tooltip position',
      required: false
    },
    {
      name: 'showOnHover',
      type: 'boolean',
      default: 'true',
      description: 'Show tooltip on hover',
      required: false
    }
  ];

  basicExample = `<app-tooltip text="This is a tooltip">
  <button>Hover me</button>
</app-tooltip>`;

  positionsExample = `<app-tooltip text="Tooltip on top" position="top">
  <button>Top</button>
</app-tooltip>

<app-tooltip text="Tooltip on bottom" position="bottom">
  <button>Bottom</button>
</app-tooltip>

<app-tooltip text="Tooltip on left" position="left">
  <button>Left</button>
</app-tooltip>

<app-tooltip text="Tooltip on right" position="right">
  <button>Right</button>
</app-tooltip>`;

  withComponentsExample = `<app-tooltip text="Click to submit">
  <app-glass-button variant="primary">
    Submit
  </app-glass-button>
</app-tooltip>`;

  customContentExample = `<app-tooltip text="This is a longer tooltip with more information">
  <span class="info-icon">ℹ️</span>
</app-tooltip>`;
}
