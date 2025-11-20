import { BaseModel, TranslateService } from './base.model';

/**
 * Company history model
 */
export interface CompanyHistoryModel {
  mcomId?: string;
  topic?: string;
  etopic?: string;
  tdesc?: string;
  edesc?: string;
  getHistory(): string;
}

export class MyCompanyHistory extends BaseModel implements CompanyHistoryModel {
  mcomId?: string;
  topic?: string;
  etopic?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.mcomId = data.mcomId;
    this.topic = data.topic;
    this.etopic = data.etopic;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getHistory(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

