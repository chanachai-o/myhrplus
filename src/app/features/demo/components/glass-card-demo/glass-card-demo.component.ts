import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-glass-card-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './glass-card-demo.component.html',
  styleUrls: ['./glass-card-demo.component.scss']
})
export class GlassCardDemoComponent {
  selectedVariant: 'default' | 'strong' | 'weak' = 'default';
  selectedAnimation: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | null = null;

  props: PropDefinition[] = [
    {
      name: 'variant',
      type: "'default' | 'strong' | 'weak'",
      default: "'default'",
      description: 'Glass card variant style',
      required: false
    },
    {
      name: 'animate',
      type: "'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | null",
      default: 'null',
      description: 'Animation type on mount',
      required: false
    },
    {
      name: 'padding',
      type: 'string',
      default: "'p-6'",
      description: 'Tailwind padding classes',
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

  basicExample = `<app-glass-card padding="p-6">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</app-glass-card>`;

  variantExample = `<app-glass-card variant="default" padding="p-6">
  Default variant
</app-glass-card>

<app-glass-card variant="strong" padding="p-6">
  Strong variant
</app-glass-card>

<app-glass-card variant="weak" padding="p-6">
  Weak variant
</app-glass-card>`;

  animationExample = `<app-glass-card 
  variant="default" 
  padding="p-6"
  animate="fade-in">
  Fade in animation
</app-glass-card>

<app-glass-card 
  variant="default" 
  padding="p-6"
  animate="slide-up">
  Slide up animation
</app-glass-card>`;

  customExample = `<app-glass-card 
  variant="default" 
  padding="p-8"
  customClass="text-center">
  Custom padding and classes
</app-glass-card>`;
}

