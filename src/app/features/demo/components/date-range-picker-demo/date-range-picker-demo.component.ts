import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-date-range-picker-demo',
  standalone: true,
  imports: [CommonModule, SharedModule, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  template: `<div class="demo-page"><div class="demo-header"><h1 class="demo-title">Date Range Picker Component</h1><p class="demo-description">Date range picker component.</p></div><section class="demo-section"><h2 class="section-title">Coming Soon</h2><p>Demo content will be added soon.</p></section></div>`,
  styles: [`.demo-page { padding: 2rem 0; } .demo-title { font-size: 2rem; font-weight: bold; }`]
})
export class DateRangePickerDemoComponent {
}

