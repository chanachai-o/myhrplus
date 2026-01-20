export interface BankCompany {
  companyId: string;
  bankId: string;
  branch: string;
  bankBranch: string;
  lineNo: string;

  // Account Info
  account: string;
  bankClient: string;
  bankClientThName: string;
  bankClientEngName: string;

  // Contact Info
  contactPerson: string;
  tel: string;

  // Options (0/1 or Boolean)
  transAts: string | boolean;
  transMedia: string;
  transOther: string;
  transOtherDesc?: string;
  dayDisk?: string;
  dayCheque?: string;
  isDefault: string | boolean;

  // Read-only fields from relations (for display)
  bankTdesc?: string;
  bankEdesc?: string;
}


