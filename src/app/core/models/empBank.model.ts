import { TranslateService } from '@ngx-translate/core';
import { Bank, MyBank } from './bank.model';
import { BankBranch, MyBankBranch } from './bankBranch.model';
import { BaseModel } from './base.model';

export interface EmpBank {
  employeeId: string;
  bank: Bank;
  bankBranch: BankBranch;
  accountId: string;
  lineNo: string
}
export class MyEmpBank extends BaseModel implements EmpBank {
  employeeId: string;
  bank: Bank;
  bankBranch: BankBranch;
  accountId: string;
  lineNo: string
  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.employeeId = data.employeeId?data.employeeId:'';
    this.bank = new MyBank(data.bank?data.bank:{}, this.translateService);
    this.bankBranch = new MyBankBranch(data.bankBranch?data.bankBranch:{}, this.translateService);
    this.accountId = data.accountId?data.accountId:'';
    this.lineNo = data.lineNo?data.lineNo:''
  }
}

// export class MyBankModel extends BaseModel implements EmpBank, Bank, BankBranch {

//     employeeId: string;
//     bank: Bank;
//     bankBranch: BankBranch;

//     constructor(data: Partial<any>, translateService: TranslateService) {
//         super(data, translateService);
//     }

//     getBankDesc(): string {
//         return this.translateService.currentLang == 'th'
//       ? this.bank.tdesc
//       : this.bank.edesc;
//     }

//     getBankBranchDesc(): string {
//         return this.translateService.currentLang == 'th'
//       ? this.bankBranch.tdesc
//       : this.bankBranch.edesc;
//     }

// }
