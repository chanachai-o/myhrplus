import { BaseModel, TranslateService } from './base.model';
// TODO: Import ProvinceModel when migrated
// import { MyProvinceModel, ProvinceModel } from './provincemodel.model';

/**
 * Work area model
 */
export interface WorkAreaModel {
  workareaId: string;
  tdesc: string;
  edesc: string;
  province: any; // TODO: use ProvinceModel type
  getDesc?(): string;
  getName?(): string;
}

export class WorkAreaModel extends BaseModel implements WorkAreaModel {
  workareaId: string;
  tdesc: string;
  edesc: string;
  province: any; // TODO: use ProvinceModel type

  constructor(data: Partial<WorkAreaModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.workareaId = data.workareaId ? data.workareaId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
    // TODO: this.province = new MyProvinceModel(data.province ? data.province : {}, translateService)
    this.province = data.province;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }

  getName() {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc ? this.tdesc : this.edesc ? this.edesc : '')
      : (this.edesc ? this.edesc : this.tdesc ? this.tdesc : '');
  }
}

