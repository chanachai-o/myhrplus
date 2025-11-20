import { BaseModel, TranslateService } from './base.model';

/**
 * PL (Pay Level) model
 */
export interface Pl {
  plId?: string;
  tdesc: string;
  edesc: string;
  getDesc?(): string;
}

export class MyPl extends BaseModel implements Pl {
  tdesc: string = '';
  edesc: string = '';
  plId?: string;

  constructor(data: Partial<Pl>, translateService: TranslateService) {
    super(data, translateService);
    this.plId = data.plId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

