import { BaseModel, TranslateService } from './base.model';

/**
 * Zipcode object model
 */
export interface ZipcodeObject {
  districtId: string | undefined;
  districtName: string | undefined;
  districtNameEng: string | undefined;
  provinceId: string | undefined;
  provinceLongName: string | undefined;
  provinceLongNameEng: string | undefined;
  zipcodeId: string | undefined;
  zipcodeName: string | undefined;
  zipcodeNameEng: string | undefined;
}

export class MyZipcodeObject extends BaseModel implements ZipcodeObject {
  districtId: string | undefined;
  districtName: string | undefined;
  districtNameEng: string | undefined;
  provinceId: string | undefined;
  provinceLongName: string | undefined;
  provinceLongNameEng: string | undefined;
  zipcodeId: string | undefined;
  zipcodeName: string | undefined;
  zipcodeNameEng: string | undefined;

  constructor(data: Partial<ZipcodeObject>, translateService: TranslateService) {
    super(data, translateService);
    this.districtId = data.districtId;
    this.districtName = data.districtName;
    this.districtNameEng = data.districtNameEng;
    this.provinceId = data.provinceId;
    this.provinceLongName = data.provinceLongName;
    this.provinceLongNameEng = data.provinceLongNameEng;
    this.zipcodeId = data.zipcodeId;
    this.zipcodeName = data.zipcodeName;
    this.zipcodeNameEng = data.zipcodeNameEng;
  }
}

