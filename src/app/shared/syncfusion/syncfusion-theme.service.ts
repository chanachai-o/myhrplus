import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SyncfusionTheme = 'material' | 'bootstrap' | 'fabric' | 'highcontrast' | 'tailwind';

@Injectable({
  providedIn: 'root'
})
export class SyncfusionThemeService {
  private readonly THEME_STORAGE_KEY = 'syncfusion-theme';
  private readonly DEFAULT_THEME: SyncfusionTheme = 'material';
  
  private currentThemeSubject = new BehaviorSubject<SyncfusionTheme>(this.DEFAULT_THEME);
  public currentTheme$: Observable<SyncfusionTheme> = this.currentThemeSubject.asObservable();
  
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor() {
    this.loadTheme();
    this.loadDarkMode();
  }

  /**
   * Load theme from storage or use default
   */
  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as SyncfusionTheme;
    const theme = savedTheme || this.DEFAULT_THEME;
    this.setTheme(theme, false); // Don't save again
  }

  /**
   * Load dark mode from storage or detect from system
   */
  private loadDarkMode(): void {
    const savedDarkMode = localStorage.getItem('hr-dark-mode');
    const isDark = savedDarkMode === 'true' || 
                   (!savedDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.setDarkMode(isDark, false);
  }

  /**
   * Set Syncfusion theme
   */
  setTheme(theme: SyncfusionTheme, save: boolean = true): void {
    if (this.currentThemeSubject.value !== theme) {
      // Remove old theme
      this.removeTheme(this.currentThemeSubject.value);
      
      // Add new theme
      this.loadThemeCSS(theme);
      
      // Update subject
      this.currentThemeSubject.next(theme);
      
      // Save to storage
      if (save) {
        localStorage.setItem(this.THEME_STORAGE_KEY, theme);
      }
      
      // Update CSS variables
      this.updateCSSVariables(theme);
    }
  }

  /**
   * Toggle dark mode
   */
  setDarkMode(isDark: boolean, save: boolean = true): void {
    if (this.isDarkModeSubject.value !== isDark) {
      this.isDarkModeSubject.next(isDark);
      
      // Update document class
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Save to storage
      if (save) {
        localStorage.setItem('hr-dark-mode', isDark.toString());
      }
      
      // Update Syncfusion dark mode
      this.updateSyncfusionDarkMode(isDark);
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): SyncfusionTheme {
    return this.currentThemeSubject.value;
  }

  /**
   * Get current dark mode state
   */
  getCurrentDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  /**
   * Load theme CSS file
   */
  private loadThemeCSS(theme: SyncfusionTheme): void {
    const themeId = `syncfusion-theme-${theme}`;
    
    // Check if already loaded
    if (document.getElementById(themeId)) {
      return;
    }

    // Create link element
    const link = document.createElement('link');
    link.id = themeId;
    link.rel = 'stylesheet';
    link.href = `https://cdn.syncfusion.com/ej2/${this.getThemeVersion()}/material.css`;
    
    // For now, we'll use Material theme and override with CSS
    // In production, you might want to load different theme files
    document.head.appendChild(link);
  }

  /**
   * Remove theme CSS file
   */
  private removeTheme(theme: SyncfusionTheme): void {
    const themeId = `syncfusion-theme-${theme}`;
    const link = document.getElementById(themeId);
    if (link) {
      link.remove();
    }
  }

  /**
   * Get Syncfusion version (adjust based on your package version)
   */
  private getThemeVersion(): string {
    return '29.2.10'; // Match your package.json version
  }

  /**
   * Update CSS variables for theme customization
   */
  private updateCSSVariables(theme: SyncfusionTheme): void {
    const root = document.documentElement;
    const isDark = this.isDarkModeSubject.value;
    
    // Base colors (Tailwind compatible)
    const colors = {
      primary: isDark ? '59, 130, 246' : '59, 130, 246', // blue-500
      secondary: isDark ? '99, 102, 241' : '99, 102, 241', // indigo-500
      success: isDark ? '34, 197, 94' : '34, 197, 94', // green-500
      danger: isDark ? '239, 68, 68' : '239, 68, 68', // red-500
      warning: isDark ? '245, 158, 11' : '245, 158, 11', // amber-500
      info: isDark ? '59, 130, 246' : '59, 130, 246', // blue-500
    };

    // Set CSS variables
    root.style.setProperty('--sf-primary', colors.primary);
    root.style.setProperty('--sf-secondary', colors.secondary);
    root.style.setProperty('--sf-success', colors.success);
    root.style.setProperty('--sf-danger', colors.danger);
    root.style.setProperty('--sf-warning', colors.warning);
    root.style.setProperty('--sf-info', colors.info);
    
    // Glassmorphism background
    if (isDark) {
      root.style.setProperty('--sf-background', 'rgba(15, 23, 42, 0.25)');
      root.style.setProperty('--sf-border', 'rgba(51, 65, 85, 0.3)');
      root.style.setProperty('--sf-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.5)');
    } else {
      root.style.setProperty('--sf-background', 'rgba(255, 255, 255, 0.25)');
      root.style.setProperty('--sf-border', 'rgba(255, 255, 255, 0.3)');
      root.style.setProperty('--sf-shadow', '0 8px 32px 0 rgba(31, 38, 135, 0.37)');
    }
  }

  /**
   * Update Syncfusion dark mode
   */
  private updateSyncfusionDarkMode(isDark: boolean): void {
    // Add/remove dark class for Syncfusion components
    const body = document.body;
    if (isDark) {
      body.classList.add('e-dark');
    } else {
      body.classList.remove('e-dark');
    }
    
    // Update CSS variables
    this.updateCSSVariables(this.currentThemeSubject.value);
  }

  /**
   * Initialize theme on app start
   */
  initialize(): void {
    // Listen to system dark mode changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const savedDarkMode = localStorage.getItem('hr-dark-mode');
      if (!savedDarkMode) {
        this.setDarkMode(e.matches);
      }
    });
  }
}

