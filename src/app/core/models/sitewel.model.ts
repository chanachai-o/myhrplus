import { BaseModel, TranslateService } from './base.model';

/**
 * Site welfare model
 */
export interface Sitewel {
  sitewelId?: string;
  tdesc?: string;
  edesc?: string;
  getSitewelDesc?(): string;
}

export class MySitewel extends BaseModel implements Sitewel {
  tdesc: string | undefined;
  edesc: string | undefined;
  sitewelId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.sitewelId = data.sitewelId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getSitewelDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

