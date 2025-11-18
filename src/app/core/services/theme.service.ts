import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeColor = 'blue' | 'indigo' | 'purple' | 'green' | 'orange' | 'red' | 'teal' | 'pink';

export interface ThemeConfig {
  mode: ThemeMode;
  color: ThemeColor;
  primaryColor: string; // RGB format: "59, 130, 246"
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'hr-theme-config';
  private readonly DEFAULT_THEME: ThemeConfig = {
    mode: 'light',
    color: 'blue',
    primaryColor: '59, 130, 246' // Blue
  };

  private themeSubject = new BehaviorSubject<ThemeConfig>(this.DEFAULT_THEME);
  public theme$: Observable<ThemeConfig> = this.themeSubject.asObservable();

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor(private storage: StorageService) {
    this.loadTheme();
  }

  /**
   * Load theme from storage or use default
   */
  private loadTheme(): void {
    const savedTheme = this.storage.getItem<ThemeConfig>(this.THEME_STORAGE_KEY);
    const theme = savedTheme || this.DEFAULT_THEME;
    this.applyTheme(theme);
  }

  /**
   * Set theme mode (light, dark, or auto)
   */
  setMode(mode: ThemeMode): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = { ...currentTheme, mode };
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  /**
   * Set theme color
   */
  setColor(color: ThemeColor): void {
    const colorMap: Record<ThemeColor, string> = {
      blue: '59, 130, 246',
      indigo: '99, 102, 241',
      purple: '168, 85, 247',
      green: '34, 197, 94',
      orange: '249, 115, 22',
      red: '239, 68, 68',
      teal: '20, 184, 166',
      pink: '236, 72, 153'
    };

    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = {
      ...currentTheme,
      color,
      primaryColor: colorMap[color]
    };
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  /**
   * Set custom primary color (RGB format)
   */
  setPrimaryColor(rgb: string): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = { ...currentTheme, primaryColor: rgb };
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleMode(): void {
    const currentTheme = this.themeSubject.value;
    const newMode: ThemeMode = currentTheme.mode === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: ThemeConfig): void {
    const html = document.documentElement;
    const body = document.body;

    // Determine if dark mode should be active
    let isDark = false;
    if (theme.mode === 'dark') {
      isDark = true;
    } else if (theme.mode === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Apply dark mode class
    if (isDark) {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }

    // Switch Syncfusion UI Kit theme stylesheet
    this.switchSyncfusionTheme(isDark);

    // Set primary color CSS variable
    html.style.setProperty('--primary-rgb', theme.primaryColor);

    // Update subjects
    this.themeSubject.next(theme);
    this.isDarkModeSubject.next(isDark);
  }

  /**
   * Switch Syncfusion UI Kit theme stylesheet based on dark mode
   */
  private switchSyncfusionTheme(isDark: boolean): void {
    const themeLink = document.getElementById('syncfusion-theme') as HTMLLinkElement;
    if (themeLink) {
      if (isDark) {
        themeLink.href = 'https://cdn.syncfusion.com/ej2/29.2.10/tailwind-dark.css';
      } else {
        themeLink.href = 'https://cdn.syncfusion.com/ej2/29.2.10/tailwind.css';
      }
    }
  }

  /**
   * Save theme to storage
   */
  private saveTheme(theme: ThemeConfig): void {
    this.storage.setItem(this.THEME_STORAGE_KEY, theme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): ThemeConfig {
    return this.themeSubject.value;
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  /**
   * Reset to default theme
   */
  resetTheme(): void {
    this.applyTheme(this.DEFAULT_THEME);
    this.saveTheme(this.DEFAULT_THEME);
  }

  /**
   * Listen to system preference changes (for auto mode)
   */
  watchSystemPreference(): void {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentTheme = this.themeSubject.value;
        if (currentTheme.mode === 'auto') {
          this.applyTheme(currentTheme);
        }
      });
    }
  }
}


