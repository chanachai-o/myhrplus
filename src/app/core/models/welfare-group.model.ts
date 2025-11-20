import { BaseModel, TranslateService } from './base.model';

/**
 * Welfare group model
 */
export interface WelfareGroupModel {
  welgId: string;
  tdesc: string;
  edesc: string;
  getDesc?(): string;
}

export class MyWelfareGroupModel extends BaseModel implements WelfareGroupModel {
  welgId: string;
  tdesc: string;
  edesc: string;

  constructor(data: Partial<WelfareGroupModel>, translateService: TranslateService) {
    super(data, translateService);
    this.welgId = data.welgId ? data.welgId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc ? this.tdesc : '')
      : (this.edesc ? this.edesc : '');
  }
}

