/**
 * Translate Service interface (compatible with @ngx-translate/core)
 * Used when @ngx-translate/core is not available
 */
export interface TranslateService {
  currentLang?: string;
}

/**
 * Base model class for all models
 * Provides common functionality and translation support
 */
export class BaseModel {
  translateService?: TranslateService;

  constructor(data?: Partial<any>, translateService?: TranslateService) {
    Object.assign(this, data);
    this.translateService = translateService;
  }
}

/**
 * Convert data to array, return empty array if data is null/undefined
 */
export function dataToArray<T>(data?: T[]): T[] {
  return data ? data : [];
}

/**
 * Check if data exists (including 0), return null if not
 */
export function checkData<T>(data?: T | null): T | null {
  return (data || data === 0) ? data : null;
}

/**
 * Get name based on current language (Thai or English)
 * @param thName - Thai name
 * @param engName - English name
 * @param currentLang - Current language ('th' or 'en')
 * @returns Name in appropriate language
 */
export function baseGetName(
  thName?: string | null,
  engName?: string | null,
  currentLang?: string
): string | null {
  let name: string | null = null;

  if (currentLang === 'th') {
    if (thName) {
      name = thName;
    } else if (engName) {
      name = engName;
    }
  } else {
    if (engName) {
      name = engName;
    } else if (thName) {
      name = thName;
    }
  }

  return name;
}

