import { BaseModel, TranslateService } from './base.model';
import { Bank, MyBank } from './bank.model';
import { BankBranch, MyBankBranch } from './bank-branch.model';

/**
 * Employee bank model
 */
export interface EmpBank {
  employeeId: string;
  bank: Bank;
  bankBranch: BankBranch;
  accountId: string;
  lineNo: string;
}

export class MyEmpBank extends BaseModel implements EmpBank {
  employeeId: string;
  bank: Bank;
  bankBranch: BankBranch;
  accountId: string;
  lineNo: string;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.employeeId = data.employeeId ? data.employeeId : '';
    this.bank = new MyBank(data.bank ? data.bank : {}, this.translateService!);
    this.bankBranch = new MyBankBranch(
      data.bankBranch ? data.bankBranch : {},
      this.translateService!
    );
    this.accountId = data.accountId ? data.accountId : '';
    this.lineNo = data.lineNo ? data.lineNo : '';
  }
}

