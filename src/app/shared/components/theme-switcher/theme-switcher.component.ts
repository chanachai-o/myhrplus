import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService, ThemeMode, ThemeColor } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit, OnDestroy {
  currentMode: ThemeMode = 'light';
  currentColor: ThemeColor = 'blue';
  isDarkMode = false;
  
  // Available theme colors
  themeColors: ThemeColor[] = ['blue', 'indigo', 'purple', 'green', 'orange', 'red', 'teal', 'pink'];

  private themeSubscription?: Subscription;
  private darkModeSubscription?: Subscription;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentMode = theme.mode;
      this.currentColor = theme.color;
    });

    // Subscribe to dark mode changes
    this.darkModeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Get initial values
    const currentTheme = this.themeService.getCurrentTheme();
    this.currentMode = currentTheme.mode;
    this.currentColor = currentTheme.color;
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.darkModeSubscription?.unsubscribe();
  }

  toggleMode(): void {
    this.themeService.toggleMode();
  }

  setMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);
  }

  setColor(color: string): void {
    // Validate and cast to ThemeColor
    if (this.isValidThemeColor(color)) {
      this.themeService.setColor(color as ThemeColor);
    }
  }

  private isValidThemeColor(color: string): color is ThemeColor {
    return this.themeColors.includes(color as ThemeColor);
  }

  resetTheme(): void {
    this.themeService.resetTheme();
  }
}

