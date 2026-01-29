/**
 * Matches API payload shape.
 * API fields: bankClientThname, bankClientEngname, isdefault (lowercase).
 * transAts, transMedia, transOther, dayDisk, dayCheque are number (0/1).
 */
export interface BankCompanyModel {
  bankId: string;
  companyId: string;
  bankBranch: string;
  branch: string;
  bankClient: string;
  lineNo: string;

  bankClientThname: string;
  bankClientEngname: string;
  account: string;

  contactPerson: string;
  tel: string;

  transAts: number;
  transMedia: number;
  transOther: number;
  transOtherDesc: string;
  dayDisk: number;
  dayCheque: number;
  isdefault: string;

  // Read-only from relations (display)
  bankTdesc?: string;
  bankEdesc?: string;
}
