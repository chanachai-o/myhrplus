import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-page-layout-demo',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  template: `<div class="demo-page"><div class="demo-header"><h1 class="demo-title">Page Layout Component</h1><p class="demo-description">Standard page layout with header, breadcrumb, and actions.</p></div><section class="demo-section"><h2 class="section-title">Coming Soon</h2><p>Demo content will be added soon.</p></section></div>`,
  styles: [`.demo-page { padding: 2rem 0; } .demo-title { font-size: 2rem; font-weight: bold; }`]
})
export class PageLayoutDemoComponent {
}

