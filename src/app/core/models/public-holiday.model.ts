import { BaseModel, TranslateService } from './base.model';

/**
 * Public holiday model
 */
export interface PublicHoliday {
  holidayId?: string;
  dateId?: string;
  tdesc?: string;
  edesc?: string;
  getHoliday?(): string;
}

export class MyHoliday extends BaseModel implements PublicHoliday {
  holidayId?: string;
  tdesc?: string;
  edesc?: string;
  dateId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.holidayId = data.holidayId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.dateId = data.dateId;
  }

  getHoliday(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

