import { BaseModel, TranslateService } from './base.model';
import { District } from './district.model';

/**
 * Zipcode model
 */
export interface Zipcode {
  zipcodeId?: string;
  tdesc?: string;
  edesc?: string;
  province?: any;
  district?: District;
  getDesc?(): string;
}

export class MyZipcode extends BaseModel implements Zipcode {
  tdesc: string = '';
  edesc: string = '';
  zipcodeId?: string;
  province?: any;
  district?: District;

  constructor(data: Partial<Zipcode>, translateService: TranslateService) {
    super(data, translateService);
    this.zipcodeId = data.zipcodeId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
    this.province = data.province;
    this.district = data.district;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

