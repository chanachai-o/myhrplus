import { BaseModel, TranslateService } from './base.model';

/**
 * Currency model
 */
export interface CurrencyModel {
  currencyId: string;
  tdesc: string;
  edesc: string;
  exchange: string;
  moneySign: string;
  effDate: string;
  getDesc?(): string;
}

export class MyCurrencyModel extends BaseModel implements CurrencyModel {
  currencyId: string;
  tdesc: string;
  edesc: string;
  exchange: string;
  moneySign: string;
  effDate: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.currencyId = data.currencyId ? data.currencyId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
    this.exchange = data.exchange ? data.exchange : '';
    this.moneySign = data.moneySign ? data.moneySign : '';
    this.effDate = data.effDate ? data.effDate : '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

