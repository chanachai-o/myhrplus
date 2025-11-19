import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, RouterModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Component Demo Showcase" 
      description="ตัวอย่างการใช้งาน Components พร้อมโค้ดตัวอย่างและ API Documentation">
      <div class="demo-container">
        <router-outlet></router-outlet>
      </div>
    </app-page-layout>
  `,
  styles: [`
    .demo-container {
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class DemoComponent {
}
