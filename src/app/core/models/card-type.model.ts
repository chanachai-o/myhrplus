import { BaseModel, TranslateService } from './base.model';

/**
 * Card type model
 */
export interface CardType {
  cardTypeId?: string;
  tdesc?: string;
  edesc?: string;
  getDesc?(): string;
}

export class MyCardType extends BaseModel implements CardType {
  tdesc?: string;
  edesc?: string;
  cardTypeId?: string;

  constructor(data: Partial<CardType>, tranSer: TranslateService) {
    super(data, tranSer);
    this.cardTypeId = data.cardTypeId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

