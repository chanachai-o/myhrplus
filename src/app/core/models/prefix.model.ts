import { BaseModel, TranslateService } from './base.model';

/**
 * Prefix model (title prefix like Mr., Mrs., etc.)
 */
export interface Prefix {
  prefixId?: string | undefined;
  tdesc?: string | undefined;
  edesc?: string | undefined;
  getPrefixDesc?(): string;
}

export class MyPrefix extends BaseModel implements Prefix {
  prefixId?: string | undefined;
  tdesc?: string | undefined;
  edesc?: string | undefined;

  constructor(data: Partial<Prefix>, translateService?: TranslateService) {
    super(data, translateService);
    this.prefixId = data.prefixId ? data.prefixId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
  }

  getPrefixDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

