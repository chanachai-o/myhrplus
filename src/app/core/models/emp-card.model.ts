import { BaseModel, TranslateService } from './base.model';
import { CardType, MyCardType } from './card-type.model';

/**
 * Employee card model
 */
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
  employeeId?: string;
  activeDate?: string;
  expireDate?: string;
  cardNo?: string;
  cardDesc?: string;
  atFile?: string;
  createBy?: string;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.employeeId = data.employeeId;
    this.cardType = data.cardType
      ? new MyCardType(data.cardType, this.translateService!)
      : undefined;
    this.activeDate = data.activeDate;
    this.expireDate = data.expireDate;
    this.cardNo = data.cardNo;
    this.cardDesc = data.cardDesc;
    this.atFile = data.atFile;
    this.createBy = data.createBy;
  }
}

