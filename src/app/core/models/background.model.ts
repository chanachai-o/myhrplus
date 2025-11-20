import { BaseModel, TranslateService } from './base.model';

/**
 * Background model
 */
export interface Background {
  backgroundId?: string;
  tdesc?: string;
  edesc?: string;
  getBackgroundDesc?(): string;
}

export class MyBackground extends BaseModel implements Background {
  tdesc: string = '';
  edesc: string = '';
  backgroundId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.backgroundId = data.backgroundId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getBackgroundDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

