import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeColor = 'blue' | 'indigo' | 'purple' | 'green' | 'orange' | 'red' | 'teal' | 'pink' | 'ivap';
export type SidebarStyle = 'white' | 'dark' | 'primary' | 'primary-gradient';
export type HeaderStyle = 'white' | 'dark' | 'primary' | 'primary-gradient';
export type MainLayoutStyle = 'white' | 'dark' | 'primary' | 'primary-gradient';

export interface ThemeConfig {
  mode: ThemeMode;
  color: ThemeColor;
  primaryColor: string; // RGB format: "59, 130, 246"
  sidebarStyle?: SidebarStyle; // Optional for backward compatibility
  headerStyle?: HeaderStyle; // Optional for backward compatibility
  mainLayoutStyle?: MainLayoutStyle; // Optional for backward compatibility
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'ivap-theme-config';
  private readonly DEFAULT_THEME: ThemeConfig = {
    mode: 'light',
    color: 'ivap',
    primaryColor: '7, 57, 156', // IVAP Brand Color (based on MyHR Blue)
    sidebarStyle: 'white', // Default: primary color
    headerStyle: 'primary', // Default: primary color
    mainLayoutStyle: 'primary' // Default: primary color
  };

  private themeSubject = new BehaviorSubject<ThemeConfig>(this.DEFAULT_THEME);
  public theme$: Observable<ThemeConfig> = this.themeSubject.asObservable();

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor(private storage: StorageService) {
    this.loadTheme();
  }

  /**
   * Validate theme color
   */
  private isValidThemeColor(color: string): color is ThemeColor {
    const validColors: ThemeColor[] = ['blue', 'indigo', 'purple', 'green', 'orange', 'red', 'teal', 'pink', 'ivap'];
    return validColors.includes(color as ThemeColor);
  }

  /**
   * Validate theme mode
   */
  private isValidThemeMode(mode: string): mode is ThemeMode {
    const validModes: ThemeMode[] = ['light', 'dark', 'auto'];
    return validModes.includes(mode as ThemeMode);
  }

  /**
   * Validate sidebar style
   */
  private isValidSidebarStyle(style: string): style is SidebarStyle {
    const validStyles: SidebarStyle[] = ['white', 'dark', 'primary', 'primary-gradient'];
    return validStyles.includes(style as SidebarStyle);
  }

  /**
   * Load theme from storage or use default
   */
  private loadTheme(): void {
    const savedTheme = this.storage.getItem<ThemeConfig>(this.THEME_STORAGE_KEY);

    // Validate saved theme
    if (savedTheme) {
      const isValid =
        this.isValidThemeColor(savedTheme.color) &&
        this.isValidThemeMode(savedTheme.mode) &&
        savedTheme.primaryColor &&
        typeof savedTheme.primaryColor === 'string' &&
        (!savedTheme.sidebarStyle || this.isValidSidebarStyle(savedTheme.sidebarStyle)) &&
        (!savedTheme.headerStyle || this.isValidHeaderStyle(savedTheme.headerStyle)) &&
        (!savedTheme.mainLayoutStyle || this.isValidMainLayoutStyle(savedTheme.mainLayoutStyle));

      if (isValid) {
        this.applyTheme(savedTheme);
        return;
      }
    }

    // Use default theme if validation fails
    this.applyTheme(this.DEFAULT_THEME);
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
      // IVAP - Intelligent Visitor Access Platform (Primary)
      ivap: '7, 57, 156', // #07399C
      // Blue - สีน้ำเงินสดใส
      blue: '59, 130, 246', // #3b82f6
      // Indigo - สีครามเข้ม
      indigo: '99, 102, 241', // #6366f1
      // Purple - สีม่วงสวยงาม
      purple: '168, 85, 247', // #a855f7
      // Green - สีเขียวสดใส
      green: '34, 197, 94', // #22c55e
      // Orange - สีส้มอบอุ่น
      orange: '249, 115, 22', // #f97316
      // Red - สีแดงเข้ม
      red: '239, 68, 68', // #ef4444
      // Teal - สีเทาเขียวสวยงาม
      teal: '20, 184, 166', // #14b8a6
      // Pink - สีชมพูนุ่มนวล
      pink: '236, 72, 153' // #ec4899
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
   * Set sidebar background style
   */
  setSidebarStyle(style: SidebarStyle): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = { ...currentTheme, sidebarStyle: style };
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  /**
   * Set header background style
   */
  setHeaderStyle(style: HeaderStyle): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = { ...currentTheme, headerStyle: style };
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  /**
   * Set main layout background style
   */
  setMainLayoutStyle(style: MainLayoutStyle): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = { ...currentTheme, mainLayoutStyle: style };
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
   * Uses data-theme attribute for cleaner theme switching
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

    // Remove all theme-related classes and attributes
    html.classList.remove('dark');
    body.classList.remove('dark');
    html.removeAttribute('data-theme');
    body.removeAttribute('data-theme');

    // Remove all theme color classes
    const themeColors: ThemeColor[] = ['blue', 'indigo', 'purple', 'green', 'orange', 'red', 'teal', 'pink', 'ivap'];
    themeColors.forEach(color => {
      body.classList.remove(`theme-${color}`);
    });

    // Apply theme using data-theme attribute (preferred method)
    // Also keep class-based for backward compatibility
    if (theme.color === 'ivap') {
      html.setAttribute('data-theme', 'ivap');
      body.setAttribute('data-theme', 'ivap');
      body.classList.add('theme-ivap');
    } else {
      // For other themes, use mode-based data-theme
      html.setAttribute('data-theme', isDark ? 'dark' : 'light');
      body.setAttribute('data-theme', isDark ? 'dark' : 'light');
      body.classList.add(`theme-${theme.color}`);
    }

    // Apply dark mode class (for Tailwind dark: prefix and backward compatibility)
    if (isDark) {
      html.classList.add('dark');
      body.classList.add('dark');
    }

    // Switch Syncfusion UI Kit theme stylesheet
    this.switchSyncfusionTheme(isDark);

    // Set CSS variables
    html.style.setProperty('--primary-rgb', theme.primaryColor);
    html.style.setProperty('--theme-color', theme.color);
    html.style.setProperty('--theme-mode', theme.mode);
    html.style.setProperty('--sidebar-style', theme.sidebarStyle || 'primary');
    html.style.setProperty('--header-style', theme.headerStyle || 'primary');
    html.style.setProperty('--main-layout-style', theme.mainLayoutStyle || 'primary');

    // Apply component styles first
    this.applySidebarStyle(theme.sidebarStyle || 'primary', isDark, theme.primaryColor);
    this.applyHeaderStyle(theme.headerStyle || 'primary', isDark, theme.primaryColor);
    this.applyMainLayoutStyle(theme.mainLayoutStyle || 'primary', isDark, theme.primaryColor);

    // Apply body background based on main layout style
    // Use setTimeout to ensure CSS rules are applied first, then override with inline styles
    setTimeout(() => {
      this.applyBodyBackground(theme.color, isDark, theme.primaryColor, theme.mainLayoutStyle || 'primary');
    }, 0);

    // Update subjects
    this.themeSubject.next(theme);
    this.isDarkModeSubject.next(isDark);
  }

  /**
   * Apply sidebar background style
   */
  private applySidebarStyle(style: SidebarStyle, isDark: boolean, primaryColor: string): void {
    const html = document.documentElement;
    const body = document.body;
    const rgb = primaryColor;

    // Use setProperty with 'important' priority to override CSS rules
    const setImportant = (prop: string, value: string) => {
      html.style.setProperty(prop, value, 'important');
      // Also set on body for better compatibility
      body.style.setProperty(prop, value, 'important');
    };

    switch (style) {
      case 'white':
        // White background
        setImportant('--sidebar-bg-start', isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)');
        setImportant('--sidebar-bg-end', isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)');
        setImportant('--sidebar-icon-bg-start', isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)');
        setImportant('--sidebar-icon-bg-end', isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.05)');
        setImportant('--sidebar-active-bg', isDark ? `rgba(${rgb}, 0.2)` : `rgba(${rgb}, 0.2)`);
        setImportant('--sidebar-hover-bg', isDark ? `rgba(${rgb}, 0.12)` : `rgba(${rgb}, 0.08)`);
        setImportant('--sidebar-indicator-color', `rgb(${rgb})`);
        break;

      case 'dark':
        // Dark background
        setImportant('--sidebar-bg-start', isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.2)');
        setImportant('--sidebar-bg-end', isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.1)');
        setImportant('--sidebar-icon-bg-start', isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)');
        setImportant('--sidebar-icon-bg-end', isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.1)');
        setImportant('--sidebar-active-bg', isDark ? `rgba(${rgb}, 0.2)` : `rgba(${rgb}, 0.2)`);
        setImportant('--sidebar-hover-bg', isDark ? `rgba(${rgb}, 0.12)` : `rgba(${rgb}, 0.12)`);
        setImportant('--sidebar-indicator-color', `rgb(${rgb})`);
        break;

      case 'primary':
        // Primary color solid background
        setImportant('--sidebar-bg-start', isDark ? `rgba(${rgb}, 0.9)` : `rgba(${rgb}, 0.95)`);
        setImportant('--sidebar-bg-end', isDark ? `rgba(${rgb}, 0.85)` : `rgba(${rgb}, 0.9)`);
        setImportant('--sidebar-icon-bg-start', isDark ? `rgba(${rgb}, 0.15)` : 'rgba(255, 255, 255, 0.2)');
        setImportant('--sidebar-icon-bg-end', isDark ? `rgba(${rgb}, 0.1)` : 'rgba(255, 255, 255, 0.1)');
        setImportant('--sidebar-active-bg', isDark ? `rgba(${rgb}, 0.25)` : 'rgba(255, 255, 255, 0.3)');
        setImportant('--sidebar-hover-bg', isDark ? `rgba(${rgb}, 0.18)` : 'rgba(255, 255, 255, 0.15)');
        setImportant('--sidebar-indicator-color', isDark ? `rgb(${rgb})` : '#ffffff');
        break;

      case 'primary-gradient':
        // Primary color gradient background (more gradient difference - darker at bottom)
        // Light mode: Start bright, end darker
        // Dark mode: Start bright, end much darker
        setImportant('--sidebar-bg-start', isDark ? `rgba(${rgb}, 0.95)` : `rgba(${rgb}, 1)`);
        setImportant('--sidebar-bg-end', isDark ? `rgba(${rgb}, 0.6)` : `rgba(${rgb}, 0.75)`);
        setImportant('--sidebar-icon-bg-start', isDark ? `rgba(${rgb}, 0.2)` : 'rgba(255, 255, 255, 0.25)');
        setImportant('--sidebar-icon-bg-end', isDark ? `rgba(${rgb}, 0.12)` : 'rgba(255, 255, 255, 0.15)');
        setImportant('--sidebar-active-bg', isDark ? `rgba(${rgb}, 0.3)` : 'rgba(255, 255, 255, 0.35)');
        setImportant('--sidebar-hover-bg', isDark ? `rgba(${rgb}, 0.22)` : 'rgba(255, 255, 255, 0.2)');
        setImportant('--sidebar-indicator-color', isDark ? `rgb(${rgb})` : '#ffffff');
        break;
    }
  }

  /**
   * Apply header background style
   */
  private applyHeaderStyle(style: HeaderStyle, isDark: boolean, primaryColor: string): void {
    const html = document.documentElement;
    const body = document.body;
    const rgb = primaryColor;

    const setImportant = (prop: string, value: string) => {
      html.style.setProperty(prop, value, 'important');
      body.style.setProperty(prop, value, 'important');
    };

    switch (style) {
      case 'white':
        setImportant('--header-bg-start', isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)');
        setImportant('--header-bg-end', isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)');
        setImportant('--header-active-bg', isDark ? `rgba(${rgb}, 0.2)` : `rgba(${rgb}, 0.2)`);
        setImportant('--header-unread-bg', isDark ? `rgba(${rgb}, 0.12)` : `rgba(${rgb}, 0.08)`);
        setImportant('--header-border-color', isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)');
        break;

      case 'dark':
        setImportant('--header-bg-start', isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.2)');
        setImportant('--header-bg-end', isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.1)');
        setImportant('--header-active-bg', isDark ? `rgba(${rgb}, 0.2)` : `rgba(${rgb}, 0.2)`);
        setImportant('--header-unread-bg', isDark ? `rgba(${rgb}, 0.12)` : `rgba(${rgb}, 0.12)`);
        setImportant('--header-border-color', isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)');
        break;

      case 'primary':
        setImportant('--header-bg-start', isDark ? `rgba(${rgb}, 0.9)` : `rgba(${rgb}, 0.95)`);
        setImportant('--header-bg-end', isDark ? `rgba(${rgb}, 0.85)` : `rgba(${rgb}, 0.9)`);
        setImportant('--header-active-bg', isDark ? `rgba(${rgb}, 0.25)` : 'rgba(255, 255, 255, 0.2)');
        setImportant('--header-unread-bg', isDark ? `rgba(${rgb}, 0.18)` : 'rgba(255, 255, 255, 0.1)');
        setImportant('--header-border-color', isDark ? `rgba(${rgb}, 0.3)` : 'rgba(255, 255, 255, 0.3)');
        break;

      case 'primary-gradient':
        setImportant('--header-bg-start', isDark ? `rgba(${rgb}, 0.95)` : `rgba(${rgb}, 1)`);
        setImportant('--header-bg-end', isDark ? `rgba(${rgb}, 0.6)` : `rgba(${rgb}, 0.75)`);
        setImportant('--header-active-bg', isDark ? `rgba(${rgb}, 0.3)` : 'rgba(255, 255, 255, 0.25)');
        setImportant('--header-unread-bg', isDark ? `rgba(${rgb}, 0.22)` : 'rgba(255, 255, 255, 0.15)');
        setImportant('--header-border-color', isDark ? `rgba(${rgb}, 0.4)` : 'rgba(255, 255, 255, 0.4)');
        break;
    }
  }

  /**
   * Apply body background gradient based on theme color and main layout style
   */
  private applyBodyBackground(color: ThemeColor, isDark: boolean, primaryColor: string, mainLayoutStyle: MainLayoutStyle = 'primary'): void {
    const body = document.body;
    const rgb = primaryColor.split(',').map(v => parseInt(v.trim()));
    const [r, g, b] = rgb;

    // Helper to convert RGB to hex
    const rgbToHex = (r: number, g: number, b: number): string => {
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    // Generate lighter shades for light mode
    const lighten = (amount: number): string => {
      const factor = 1 - amount;
      const newR = Math.min(255, Math.round(r + (255 - r) * amount));
      const newG = Math.min(255, Math.round(g + (255 - g) * amount));
      const newB = Math.min(255, Math.round(b + (255 - b) * amount));
      return rgbToHex(newR, newG, newB);
    };

    // Generate darker shades for dark mode
    const darken = (amount: number): string => {
      const newR = Math.max(0, Math.round(r * (1 - amount)));
      const newG = Math.max(0, Math.round(g * (1 - amount)));
      const newB = Math.max(0, Math.round(b * (1 - amount)));
      return rgbToHex(newR, newG, newB);
    };

    let gradient: string;

    // Use main layout style to determine body background
    if (mainLayoutStyle === 'white') {
      // White background
      if (isDark) {
        gradient = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)';
      } else {
        gradient = 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)';
      }
    } else if (mainLayoutStyle === 'dark') {
      // Dark background
      if (isDark) {
        gradient = 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)';
      } else {
        gradient = 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)';
      }
    } else if (mainLayoutStyle === 'primary' || mainLayoutStyle === 'primary-gradient') {
      // Primary color background - use theme color gradient
      if (color === 'ivap') {
        // IVAP theme uses similar gradients
        if (isDark) {
          gradient = 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 30%, #2563eb 70%, #07399C 100%)';
        } else {
          gradient = 'linear-gradient(135deg, #f3f7fb 0%, #e9f2f8 50%, #dbeafe 100%)';
        }
      } else {
        // Generate gradient from primary color
        if (isDark) {
          // Dark mode: darker shades of primary color
          const dark1 = darken(0.4); // Darkest
          const dark2 = darken(0.25); // Medium dark
          const dark3 = darken(0.1); // Slightly dark
          const primary = rgbToHex(r, g, b); // Primary color
          gradient = `linear-gradient(135deg, ${dark1} 0%, ${dark2} 30%, ${dark3} 70%, ${primary} 100%)`;
        } else {
          // Light mode: lighter shades of primary color
          const light1 = lighten(0.95); // Lightest
          const light2 = lighten(0.85); // Medium light
          const light3 = lighten(0.75); // Slightly light
          const light4 = lighten(0.65); // Base light
          gradient = `linear-gradient(135deg, ${light1} 0%, ${light2} 30%, ${light3} 70%, ${light4} 100%)`;
        }
      }
    } else {
      // Fallback to primary color gradient
      if (color === 'ivap') {
        // IVAP theme uses similar gradients
        if (isDark) {
          gradient = 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 30%, #2563eb 70%, #07399C 100%)';
        } else {
          gradient = 'linear-gradient(135deg, #f3f7fb 0%, #e9f2f8 50%, #dbeafe 100%)';
        }
      } else {
        if (isDark) {
          const dark1 = darken(0.4);
          const dark2 = darken(0.25);
          const dark3 = darken(0.1);
          const primary = rgbToHex(r, g, b);
          gradient = `linear-gradient(135deg, ${dark1} 0%, ${dark2} 30%, ${dark3} 70%, ${primary} 100%)`;
        } else {
          const light1 = lighten(0.95);
          const light2 = lighten(0.85);
          const light3 = lighten(0.75);
          const light4 = lighten(0.65);
          gradient = `linear-gradient(135deg, ${light1} 0%, ${light2} 30%, ${light3} 70%, ${light4} 100%)`;
        }
      }
    }

    // Set with !important to override CSS rules
    // Set CSS variable first
    body.style.setProperty('--theme-bg-gradient', gradient, 'important');

    // Remove any existing background-image to avoid conflicts
    body.style.removeProperty('background-image');

    // Set background directly (not using var() to avoid CSS specificity issues)
    // Use background-image instead of background to override CSS rules more effectively
    body.style.setProperty('background-image', gradient, 'important');
    body.style.setProperty('background', gradient, 'important');

    // Set background-attachment for mobile performance
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    body.style.setProperty('background-attachment', isMobile ? 'scroll' : 'fixed', 'important');

    // Ensure background-size and background-position
    body.style.setProperty('background-size', 'cover', 'important');
    body.style.setProperty('background-position', 'center', 'important');
    body.style.setProperty('background-repeat', 'no-repeat', 'important');

    // Force reflow to ensure styles are applied
    void body.offsetHeight;
  }

  /**
   * Apply main layout background style
   */
  private applyMainLayoutStyle(style: MainLayoutStyle, isDark: boolean, primaryColor: string): void {
    const html = document.documentElement;
    const body = document.body;
    const rgb = primaryColor;

    const setImportant = (prop: string, value: string) => {
      html.style.setProperty(prop, value, 'important');
      body.style.setProperty(prop, value, 'important');
    };

    switch (style) {
      case 'white':
        setImportant('--main-layout-bg-start', isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.98)');
        setImportant('--main-layout-bg-end', isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.95)');
        break;

      case 'dark':
        setImportant('--main-layout-bg-start', isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.1)');
        setImportant('--main-layout-bg-end', isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.05)');
        break;

      case 'primary':
        setImportant('--main-layout-bg-start', isDark ? `rgba(${rgb}, 0.15)` : `rgba(${rgb}, 0.1)`);
        setImportant('--main-layout-bg-end', isDark ? `rgba(${rgb}, 0.1)` : `rgba(${rgb}, 0.05)`);
        break;

      case 'primary-gradient':
        setImportant('--main-layout-bg-start', isDark ? `rgba(${rgb}, 0.2)` : `rgba(${rgb}, 0.15)`);
        setImportant('--main-layout-bg-end', isDark ? `rgba(${rgb}, 0.05)` : `rgba(${rgb}, 0.02)`);
        break;
    }
  }

  /**
   * Validate header style
   */
  private isValidHeaderStyle(style: string): style is HeaderStyle {
    const validStyles: HeaderStyle[] = ['white', 'dark', 'primary', 'primary-gradient'];
    return validStyles.includes(style as HeaderStyle);
  }

  /**
   * Validate main layout style
   */
  private isValidMainLayoutStyle(style: string): style is MainLayoutStyle {
    const validStyles: MainLayoutStyle[] = ['white', 'dark', 'primary', 'primary-gradient'];
    return validStyles.includes(style as MainLayoutStyle);
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
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Initial check for auto mode
      const currentTheme = this.themeSubject.value;
      if (currentTheme.mode === 'auto') {
        this.applyTheme(currentTheme);
      }

      // Listen for system preference changes
      const handleChange = (e: MediaQueryListEvent | MediaQueryList): void => {
        const currentTheme = this.themeSubject.value;
        if (currentTheme.mode === 'auto') {
          this.applyTheme(currentTheme);
        }
      };

      // Modern browsers support addEventListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }
    }
  }
}


