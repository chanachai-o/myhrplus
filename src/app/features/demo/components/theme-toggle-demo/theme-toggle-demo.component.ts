import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-theme-toggle-demo',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  template: `<div class="demo-page"><div class="demo-header"><h1 class="demo-title">Theme Toggle Component</h1><p class="demo-description">Theme mode and color toggle.</p></div><section class="demo-section"><h2 class="section-title">Coming Soon</h2><p>Demo content will be added soon.</p></section></div>`,
  styles: [`.demo-page { padding: 2rem 0; } .demo-title { font-size: 2rem; font-weight: bold; }`]
})
export class ThemeToggleDemoComponent {
}

