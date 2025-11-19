import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent, Tab } from '../../../../shared/components/tabs/tabs.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  imports: [CommonModule, TabsComponent, GlassCardComponent, CodeViewerComponent, PropsTableComponent],
  templateUrl: './tabs-demo.component.html',
  styleUrls: ['./tabs-demo.component.scss']
})
export class TabsDemoComponent {
  activeTab: string = 'tab1';
  activeTab2: string = 'tab1';

  tabs: Tab[] = [
    { id: 'tab1', label: 'Tab 1', icon: '📄' },
    { id: 'tab2', label: 'Tab 2', icon: '📊', badge: '3' },
    { id: 'tab3', label: 'Tab 3', icon: '⚙️', disabled: false }
  ];

  tabsWithBadges: Tab[] = [
    { id: 'tab1', label: 'Inbox', badge: '12' },
    { id: 'tab2', label: 'Sent', badge: '5' },
    { id: 'tab3', label: 'Drafts', badge: '2' },
    { id: 'tab4', label: 'Archived' }
  ];

  tabsWithDisabled: Tab[] = [
    { id: 'tab1', label: 'Active Tab' },
    { id: 'tab2', label: 'Disabled Tab', disabled: true },
    { id: 'tab3', label: 'Another Tab' }
  ];

  props: PropDefinition[] = [
    {
      name: 'tabs',
      type: 'Tab[]',
      default: '-',
      description: 'Array of tab objects',
      required: true
    },
    {
      name: 'activeTab',
      type: 'string',
      default: "''",
      description: 'Currently active tab ID',
      required: false
    }
  ];

  outputs: PropDefinition[] = [
    {
      name: 'activeTabChange',
      type: 'EventEmitter<string>',
      default: '-',
      description: 'Emitted when active tab changes',
      required: false
    }
  ];

  basicExample = `<app-tabs
  [tabs]="tabs"
  [activeTab]="activeTab"
  (activeTabChange)="activeTab = $event">
  <div *ngIf="activeTab === 'tab1'">Tab 1 Content</div>
  <div *ngIf="activeTab === 'tab2'">Tab 2 Content</div>
</app-tabs>`;

  withIconsExample = `<app-tabs
  [tabs]="tabs"
  [activeTab]="activeTab"
  (activeTabChange)="activeTab = $event">
  <!-- Tab content -->
</app-tabs>

// tabs array
tabs = [
  { id: 'tab1', label: 'Tab 1', icon: '📄' },
  { id: 'tab2', label: 'Tab 2', icon: '📊', badge: '3' }
];`;

  withBadgesExample = `tabs = [
  { id: 'inbox', label: 'Inbox', badge: '12' },
  { id: 'sent', label: 'Sent', badge: '5' }
];`;

  disabledExample = `tabs = [
  { id: 'tab1', label: 'Active Tab' },
  { id: 'tab2', label: 'Disabled Tab', disabled: true }
];`;

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    console.log('Tab changed to:', tabId);
  }
}
