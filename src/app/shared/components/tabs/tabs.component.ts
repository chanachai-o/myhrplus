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
  template: `
    <div class="border-b border-slate-200 dark:border-slate-700">
      <nav class="-mb-px flex space-x-8 overflow-x-auto">
        <button
          *ngFor="let tab of tabs"
          (click)="selectTab(tab.id)"
          [disabled]="tab.disabled"
          [class]="getTabClasses(tab.id)"
          class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <span *ngIf="tab.icon" class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
          <span *ngIf="tab.badge" class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            {{ tab.badge }}
          </span>
        </button>
      </nav>
    </div>
    
    <!-- Tab Content -->
    <div class="mt-6">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
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


