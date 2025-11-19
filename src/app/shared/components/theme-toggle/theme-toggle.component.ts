import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeMode, ThemeColor } from '../../../core/services/theme.service';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
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
