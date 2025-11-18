import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService, ThemeMode, ThemeColor } from '../../../core/services/theme.service';
import { StorageService } from '../../../core/services/storage.service';
import { NotificationService } from '../../../core/services/notification.service';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';

export type Language = 'th' | 'en';
export type DateFormat = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
export type TimeFormat = '12h' | '24h';

export interface UserPreferences {
  language: Language;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  preferencesForm: FormGroup;
  loading = false;
  saving = false;

  // Theme options
  themeModes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'auto', label: 'Auto (System)', icon: 'brightness_auto' }
  ];

  themeColors: { value: ThemeColor; label: string; color: string }[] = [
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'indigo', label: 'Indigo', color: '#6366f1' },
    { value: 'purple', label: 'Purple', color: '#a855f7' },
    { value: 'green', label: 'Green', color: '#22c55e' },
    { value: 'orange', label: 'Orange', color: '#f97316' },
    { value: 'red', label: 'Red', color: '#ef4444' },
    { value: 'teal', label: 'Teal', color: '#14b8a6' },
    { value: 'pink', label: 'Pink', color: '#ec4899' }
  ];

  // Language options
  languages: { value: Language; label: string; flag: string }[] = [
    { value: 'th', label: 'ไทย (Thai)', flag: '🇹🇭' },
    { value: 'en', label: 'English', flag: '🇬🇧' }
  ];

  // Date format options
  dateFormats: { value: DateFormat; label: string; example: string }[] = [
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY', example: '31/12/2024' },
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY', example: '12/31/2024' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD', example: '2024-12-31' }
  ];

  // Time format options
  timeFormats: { value: TimeFormat; label: string; example: string }[] = [
    { value: '12h', label: '12 Hour', example: '02:30 PM' },
    { value: '24h', label: '24 Hour', example: '14:30' }
  ];

  // Timezone options (common timezones)
  timezones: { value: string; label: string }[] = [
    { value: 'Asia/Bangkok', label: 'Asia/Bangkok (GMT+7)' },
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'America/New_York', label: 'America/New_York (GMT-5)' },
    { value: 'Europe/London', label: 'Europe/London (GMT+0)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (GMT+8)' }
  ];

  currentTheme: any;
  currentPreferences: UserPreferences | null = null;

  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService,
    private storage: StorageService,
    private notificationService: NotificationService
  ) {
    this.preferencesForm = this.fb.group({
      language: ['th'],
      dateFormat: ['dd/MM/yyyy'],
      timeFormat: ['24h'],
      timezone: ['Asia/Bangkok'],
      notifications: this.fb.group({
        email: [true],
        push: [true],
        sms: [false]
      })
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
    this.loadTheme();
    
    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  loadPreferences(): void {
    const saved = this.storage.getItem<UserPreferences>(STORAGE_KEYS.USER_DATA + '_preferences');
    if (saved) {
      this.currentPreferences = saved;
      this.preferencesForm.patchValue(saved);
    }
  }

  loadTheme(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  onThemeModeChange(mode: ThemeMode): void {
    this.themeService.setMode(mode);
    this.notificationService.showSuccess(`Theme mode changed to ${mode}`);
  }

  onThemeColorChange(color: ThemeColor): void {
    this.themeService.setColor(color);
    this.notificationService.showSuccess(`Theme color changed to ${color}`);
  }

  onLanguageChange(language: Language): void {
    // Save language preference
    this.storage.setItem(STORAGE_KEYS.LANGUAGE, language);
    // TODO: Implement i18n service to change language
    this.notificationService.showInfo('Language preference saved. Page refresh required to apply changes.');
  }

  savePreferences(): void {
    if (this.preferencesForm.valid) {
      this.saving = true;
      const preferences: UserPreferences = this.preferencesForm.value;

      // Save to storage
      this.storage.setItem(STORAGE_KEYS.USER_DATA + '_preferences', preferences);
      
      // Save language separately
      this.storage.setItem(STORAGE_KEYS.LANGUAGE, preferences.language);

      // TODO: Save to API if needed
      // this.personalService.updatePreferences(preferences).subscribe({...});

      this.currentPreferences = preferences;
      this.notificationService.showSuccess('Preferences saved successfully');
      this.saving = false;
    }
  }

  resetPreferences(): void {
    const defaultPreferences: UserPreferences = {
      language: 'th',
      dateFormat: 'dd/MM/yyyy',
      timeFormat: '24h',
      timezone: 'Asia/Bangkok',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    };

    this.preferencesForm.patchValue(defaultPreferences);
    this.savePreferences();
  }

  getCurrentThemeMode(): ThemeMode {
    return this.currentTheme?.mode || 'light';
  }

  getCurrentThemeColor(): ThemeColor {
    return this.currentTheme?.color || 'blue';
  }
}

