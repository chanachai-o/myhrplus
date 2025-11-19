import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlassButtonComponent } from '../../../../shared/components/glass-button/glass-button.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-glass-button-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassButtonComponent, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './glass-button-demo.component.html',
  styleUrls: ['./glass-button-demo.component.scss']
})
export class GlassButtonDemoComponent {
  selectedVariant: 'primary' | 'secondary' | 'danger' = 'primary';
  selectedSize: 'sm' | 'md' | 'lg' = 'md';
  buttonLoading: boolean = false;
  buttonDisabled: boolean = false;
  fullWidth: boolean = false;

  props: PropDefinition[] = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'danger'",
      default: "'secondary'",
      description: 'Button variant style',
      required: false
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Button size',
      required: false
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable button interaction',
      required: false
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Show loading spinner',
      required: false
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      default: 'false',
      description: 'Make button full width',
      required: false
    },
    {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      default: "'button'",
      description: 'Button HTML type',
      required: false
    },
    {
      name: 'customClass',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes',
      required: false
    }
  ];

  outputs: PropDefinition[] = [
    {
      name: 'clicked',
      type: 'EventEmitter<MouseEvent>',
      default: '-',
      description: 'Emitted when button is clicked',
      required: false
    }
  ];

  basicExample = `<app-glass-button variant="primary">
  Click Me
</app-glass-button>`;

  variantsExample = `<app-glass-button variant="primary">Primary</app-glass-button>
<app-glass-button variant="secondary">Secondary</app-glass-button>
<app-glass-button variant="danger">Danger</app-glass-button>`;

  sizesExample = `<app-glass-button variant="primary" size="sm">Small</app-glass-button>
<app-glass-button variant="primary" size="md">Medium</app-glass-button>
<app-glass-button variant="primary" size="lg">Large</app-glass-button>`;

  statesExample = `<app-glass-button variant="primary">Normal</app-glass-button>
<app-glass-button variant="primary" [disabled]="true">Disabled</app-glass-button>
<app-glass-button variant="primary" [loading]="true">Loading</app-glass-button>`;

  eventExample = `<app-glass-button 
  variant="primary" 
  (clicked)="handleClick($event)">
  Click Me
</app-glass-button>`;

  onButtonClick(): void {
    console.log('Button clicked!');
    this.buttonLoading = true;
    setTimeout(() => {
      this.buttonLoading = false;
    }, 2000);
  }
}


