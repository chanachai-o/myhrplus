import { BaseModel, TranslateService } from './base.model';
import { Fundtable, MyFundTable } from './fund.model';

/**
 * PVF (Provident Fund) model
 */
export interface PVFund {
  fundtable: Fundtable;
  amount: number;
  expireDate: string;
  registerDate: string;
  recieveMethod: string;
  pvfStatus: string;
  pvfIndex: string;
  lineNo: string;
  idmember: string;
}

export class MyPVFund extends BaseModel implements PVFund {
  fundtable: Fundtable;
  amount: number;
  expireDate: string;
  registerDate: string;
  recieveMethod: string;
  pvfStatus: string;
  pvfIndex: string;
  lineNo: string;
  idmember: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.fundtable = new MyFundTable(
      data.fundtable ? data.fundtable : {},
      translateService
    );
    this.amount = data.amount ? data.amount : 0;
    this.expireDate = data.expireDate ? data.expireDate : '';
    this.registerDate = data.registerDate ? data.registerDate : '';
    this.recieveMethod = data.recieveMethod ? data.recieveMethod : '';
    this.pvfStatus = data.pvfStatus ? data.pvfStatus : '';
    this.pvfIndex = data.pvfIndex ? data.pvfIndex : '';
    this.lineNo = data.lineNo ? data.lineNo : '';
    this.idmember = data.idmember ? data.idmember : '';
  }
}

