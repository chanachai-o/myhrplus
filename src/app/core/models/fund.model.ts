import { BaseModel, TranslateService } from './base.model';

/**
 * Fund table model
 */
export interface Fundtable {
  fundtableId: string;
  tdesc: string;
  edesc: string;
  getFundDesc(): string;
}

export class MyFundTable extends BaseModel implements Fundtable {
  fundtableId: string;
  tdesc: string = '';
  edesc: string = '';

  constructor(data: Partial<Fundtable>, translateService: TranslateService) {
    super(data, translateService);
    this.fundtableId = data.fundtableId ? data.fundtableId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
  }

  getFundDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc ? this.tdesc : '')
      : (this.edesc ? this.edesc : '');
  }
}

