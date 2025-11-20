import { BaseModel, TranslateService } from './base.model';

/**
 * Province model
 */
export interface Province {
  provinceId?: string;
  longTname: string;
  longEname: string;
  getDistrictDesc?(): string;
}

export class MyProvince extends BaseModel implements Province {
  longTname: string = '';
  longEname: string = '';
  provinceId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.provinceId = data.provinceId;
    this.longTname = data.longTname || '';
    this.longEname = data.longEname || '';
  }

  getDistrictDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.longTname
      : this.longEname;
  }
}

