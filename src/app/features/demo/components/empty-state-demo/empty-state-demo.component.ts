import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent, EmptyStateAction } from '../../../../shared/components/empty-state/empty-state.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-empty-state-demo',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './empty-state-demo.component.html',
  styleUrls: ['./empty-state-demo.component.scss']
})
export class EmptyStateDemoComponent {
  emptyStateAction1: EmptyStateAction = {
    label: 'เพิ่มข้อมูล',
    variant: 'primary',
    onClick: () => {
      alert('Add clicked');
    }
  };

  emptyStateAction2: EmptyStateAction = {
    label: 'ค้นหาใหม่',
    variant: 'secondary',
    onClick: () => {
      alert('Search clicked');
    }
  };

  emptyStateAction3: EmptyStateAction = {
    label: 'ลบข้อมูล',
    variant: 'danger',
    icon: '🗑️',
    onClick: () => {
      alert('Delete clicked');
    }
  };

  props: PropDefinition[] = [
    {
      name: 'icon',
      type: 'string',
      default: 'undefined',
      description: 'Icon (emoji or text)',
      required: false
    },
    {
      name: 'title',
      type: 'string',
      default: "'ไม่มีข้อมูล'",
      description: 'Empty state title',
      required: false
    },
    {
      name: 'description',
      type: 'string',
      default: "'ยังไม่มีข้อมูลในส่วนนี้'",
      description: 'Empty state description',
      required: false
    },
    {
      name: 'action',
      type: 'EmptyStateAction',
      default: 'undefined',
      description: 'Action button configuration',
      required: false
    },
    {
      name: 'iconSize',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Icon size',
      required: false
    }
  ];

  basicExample = `<app-empty-state
  icon="📭"
  title="ไม่มีข้อมูล"
  description="ยังไม่มีข้อมูลในส่วนนี้">
</app-empty-state>`;

  withActionExample = `<app-empty-state
  icon="📭"
  title="ไม่มีข้อมูล"
  description="ยังไม่มีข้อมูลในส่วนนี้"
  [action]="emptyStateAction">
</app-empty-state>

// In component.ts
emptyStateAction = {
  label: 'เพิ่มข้อมูล',
  variant: 'primary',
  onClick: () => {
    // Handle action
  }
};`;

  differentIconsExample = `<app-empty-state
  icon="🔍"
  title="ไม่พบผลลัพธ์"
  description="ลองค้นหาด้วยคำอื่น">
</app-empty-state>

<app-empty-state
  icon="📦"
  title="ไม่มีสินค้า"
  description="ยังไม่มีสินค้าในหมวดหมู่นี้">
</app-empty-state>`;

  iconSizesExample = `<app-empty-state
  icon="📭"
  iconSize="sm"
  title="Small Icon">
</app-empty-state>

<app-empty-state
  icon="📭"
  iconSize="lg"
  title="Large Icon">
</app-empty-state>`;
}
