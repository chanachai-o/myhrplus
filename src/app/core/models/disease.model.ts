import { BaseModel, TranslateService } from './base.model';

/**
 * Disease model
 */
export interface Disease {
  disId?: string;
  tdesc?: string;
  edesc?: string;
  getDiseaseDesc?(): string;
}

export class MyDisease extends BaseModel implements Disease {
  tdesc: string = '';
  edesc: string = '';
  disId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.disId = data.disId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getDiseaseDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

