import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
import { CardType, MyCardType } from './cardType.model';

export interface EmpCard {
  employeeId?: string;
  cardType?: CardType;
  activeDate?: string;
  expireDate?: string;
  cardNo?: string;
  cardDesc?: string;
  atFile?: string;
  createBy?: string;
}
export class MyEmpCard extends BaseModel implements EmpCard {
  cardType: CardType | undefined;
  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.cardType = new MyCardType(this.cardType!, this.translateService);
  }
}
