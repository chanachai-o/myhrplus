import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  @Input() tabs!: Tab[];
  @Input() activeTab: string = '';
  @Output() activeTabChange = new EventEmitter<string>();
  
  selectTab(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled && this.activeTab !== tabId) {
      this.activeTab = tabId;
      this.activeTabChange.emit(tabId);
    }
  }
  
  getTabClasses(tabId: string): string {
    const base = 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300';
    const active = 'border-primary-500 text-primary-600 dark:text-primary-400';
    return this.activeTab === tabId ? active : base;
  }
}



