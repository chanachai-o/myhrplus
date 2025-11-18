import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeMode, ThemeColor } from '../../../core/services/theme.service';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
    <div class="flex items-center gap-2">
      <!-- Theme Mode Toggle -->
      <div class="relative">
        <button
          (click)="toggleModeMenu()"
          class="p-2 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-lg transition-all duration-200"
          [attr.aria-label]="'เปลี่ยนธีม'">
          <app-icon [name]="currentModeIcon" size="md" color="text-slate-700 dark:text-slate-200"></app-icon>
        </button>
        <div 
          *ngIf="showModeMenu"
          class="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <button
            (click)="setMode('light')"
            [class.active]="currentMode === 'light'"
            class="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40 flex items-center gap-2 thai-text">
            <app-icon name="light_mode" size="sm" color="text-slate-600 dark:text-slate-400"></app-icon>
            <span>โหมดสว่าง</span>
          </button>
          <button
            (click)="setMode('dark')"
            [class.active]="currentMode === 'dark'"
            class="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40 flex items-center gap-2 thai-text">
            <app-icon name="dark_mode" size="sm" color="text-slate-600 dark:text-slate-400"></app-icon>
            <span>โหมดมืด</span>
          </button>
          <button
            (click)="setMode('auto')"
            [class.active]="currentMode === 'auto'"
            class="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40 flex items-center gap-2 thai-text">
            <app-icon name="brightness_auto" size="sm" color="text-slate-600 dark:text-slate-400"></app-icon>
            <span>อัตโนมัติ</span>
          </button>
        </div>
      </div>

      <!-- Theme Color Picker -->
      <div class="relative">
        <button
          (click)="toggleColorMenu()"
          class="p-2 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-lg transition-all duration-200"
          [attr.aria-label]="'เปลี่ยนสีธีม'">
          <app-icon name="palette" size="md" color="text-slate-700 dark:text-slate-200"></app-icon>
        </button>
        <div 
          *ngIf="showColorMenu"
          class="absolute right-0 mt-2 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50">
          <div class="grid grid-cols-4 gap-2">
            <button
              *ngFor="let color of themeColors"
              (click)="setColor(color.value)"
              [class.active]="currentColor === color.value"
              class="w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg"
              [style.background]="color.gradient"
              [class.border-indigo-500]="currentColor === color.value"
              [class.border-slate-300]="currentColor !== color.value"
              [class.dark:border-slate-600]="currentColor !== color.value"
              [attr.aria-label]="color.name">
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .active {
      background: rgba(59, 130, 246, 0.1) !important;
      color: rgb(59, 130, 246) !important;
    }

    .dark .active {
      background: rgba(59, 130, 246, 0.2) !important;
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  currentMode: ThemeMode = 'light';
  currentColor: ThemeColor = 'blue';
  currentModeIcon = 'light_mode';
  showModeMenu = false;
  showColorMenu = false;

  themeColors = [
    { value: 'blue' as ThemeColor, name: 'น้ำเงิน', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { value: 'indigo' as ThemeColor, name: 'คราม', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    { value: 'purple' as ThemeColor, name: 'ม่วง', gradient: 'linear-gradient(135deg, #a855f7, #9333ea)' },
    { value: 'green' as ThemeColor, name: 'เขียว', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
    { value: 'orange' as ThemeColor, name: 'ส้ม', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { value: 'red' as ThemeColor, name: 'แดง', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { value: 'teal' as ThemeColor, name: 'เทาเขียว', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    { value: 'pink' as ThemeColor, name: 'ชมพู', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' }
  ];

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.currentMode = theme.mode;
      this.currentColor = theme.color;
      this.updateModeIcon();
    });
  }

  toggleModeMenu(): void {
    this.showModeMenu = !this.showModeMenu;
    this.showColorMenu = false;
  }

  toggleColorMenu(): void {
    this.showColorMenu = !this.showColorMenu;
    this.showModeMenu = false;
  }

  setMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);
    this.updateModeIcon();
    this.showModeMenu = false;
  }

  setColor(color: ThemeColor): void {
    this.themeService.setColor(color);
    this.showColorMenu = false;
  }

  private updateModeIcon(): void {
    switch (this.currentMode) {
      case 'light':
        this.currentModeIcon = 'light_mode';
        break;
      case 'dark':
        this.currentModeIcon = 'dark_mode';
        break;
      case 'auto':
        this.currentModeIcon = 'brightness_auto';
        break;
    }
  }
}
