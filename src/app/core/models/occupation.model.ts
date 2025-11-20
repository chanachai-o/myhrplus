import { BaseModel, TranslateService } from './base.model';

/**
 * Occupation model
 */
export interface Occupation {
  occId?: string;
  tdesc: string;
  edesc: string;
  getDesc?(): string;
}

export class MyOccupation extends BaseModel implements Occupation {
  tdesc: string = '';
  edesc: string = '';
  occId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.occId = data.occId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

