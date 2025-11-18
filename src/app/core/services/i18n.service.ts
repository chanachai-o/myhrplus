import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';

export type Language = 'th' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly DEFAULT_LANGUAGE: Language = 'th';
  private readonly SUPPORTED_LANGUAGES: Language[] = ['th', 'en'];

  private currentLanguageSubject = new BehaviorSubject<Language>(this.DEFAULT_LANGUAGE);
  public currentLanguage$: Observable<Language> = this.currentLanguageSubject.asObservable();

  constructor(private storage: StorageService) {
    this.loadLanguage();
  }

  /**
   * Load language from storage
   */
  private loadLanguage(): void {
    const saved = this.storage.getItem<Language>(STORAGE_KEYS.LANGUAGE);
    if (saved && this.isSupportedLanguage(saved)) {
      this.setLanguage(saved, false);
    } else {
      this.setLanguage(this.DEFAULT_LANGUAGE, false);
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  /**
   * Set language
   */
  setLanguage(language: Language, save: boolean = true): void {
    if (!this.isSupportedLanguage(language)) {
      console.warn(`Language ${language} is not supported. Using default.`);
      language = this.DEFAULT_LANGUAGE;
    }

    this.currentLanguageSubject.next(language);
    
    if (save) {
      this.storage.setItem(STORAGE_KEYS.LANGUAGE, language);
      // Update document language attribute
      document.documentElement.setAttribute('lang', language);
    }
  }

  /**
   * Check if language is supported
   */
  private isSupportedLanguage(language: string): language is Language {
    return this.SUPPORTED_LANGUAGES.includes(language as Language);
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): Language[] {
    return [...this.SUPPORTED_LANGUAGES];
  }

  /**
   * Translate key (placeholder for future i18n implementation)
   */
  translate(key: string, params?: Record<string, any>): string {
    // TODO: Implement actual translation using Angular i18n or ngx-translate
    // For now, return the key
    return key;
  }
}

