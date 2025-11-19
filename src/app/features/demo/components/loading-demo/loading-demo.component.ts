import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../../../shared/components/glass-button/glass-button.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-loading-demo',
  standalone: true,
  imports: [CommonModule, LoadingComponent, GlassCardComponent, GlassButtonComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './loading-demo.component.html',
  styleUrls: ['./loading-demo.component.scss']
})
export class LoadingDemoComponent {
  showLoading: boolean = false;
  showLoadingWithMessage: boolean = false;
  loadingMessage: string = 'กำลังโหลดข้อมูล...';

  props: PropDefinition[] = [
    {
      name: 'show',
      type: 'boolean',
      default: 'true',
      description: 'Control loading visibility',
      required: false
    },
    {
      name: 'message',
      type: 'string',
      default: "''",
      description: 'Loading message text',
      required: false
    },
    {
      name: 'containerClass',
      type: 'string',
      default: "'min-h-[200px]'",
      description: 'Container CSS classes',
      required: false
    }
  ];

  basicExample = `<app-loading [show]="isLoading"></app-loading>`;

  withMessageExample = `<app-loading
  [show]="isLoading"
  message="กำลังโหลดข้อมูล...">
</app-loading>`;

  conditionalExample = `// In component.ts
isLoading = false;

loadData() {
  this.isLoading = true;
  this.dataService.getData().subscribe({
    next: (data) => {
      this.data = data;
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
    }
  });
}

// In template
<app-loading [show]="isLoading" message="Loading data..."></app-loading>`;

  showLoadingDemo(): void {
    this.showLoading = true;
    setTimeout(() => {
      this.showLoading = false;
    }, 3000);
  }

  showLoadingWithMessageDemo(): void {
    this.showLoadingWithMessage = true;
    setTimeout(() => {
      this.showLoadingWithMessage = false;
    }, 3000);
  }
}
