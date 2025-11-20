import { BaseModel, TranslateService } from './base.model';
import { Province } from './province.model';

/**
 * District model
 */
export interface District {
  districtId?: string;
  tdesc?: string;
  edesc?: string;
  province?: Province;
  zipcode?: any;
  getDistrictDesc?(): string;
}

export class MyDistrict extends BaseModel implements District {
  tdesc: string = '';
  edesc: string = '';
  districtId?: string;
  province?: Province;
  zipcode?: any;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.districtId = data.districtId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
    this.province = data.province;
    this.zipcode = data.zipcode;
  }

  getDistrictDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

