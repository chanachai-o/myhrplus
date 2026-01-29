export interface Company {
  branchId: string; // PK - same as companyid when iscompany='1'
  companyId: string;
  socBranchId?: string;
  taxBranchId?: string;
  tdesc: string;
  edesc: string;
  taddr?: string;
  tvillage?: string;
  troomNo?: string;
  tfloor?: string;
  tsoi?: string;
  tmoo?: string;
  troad?: string;
  tsubdistrict?: string;
  eaddr?: string;
  evillage?: string;
  eroomNo?: string;
  efloor?: string;
  esoi?: string;
  emoo?: string;
  eroad?: string;
  esubdistrict?: string;
  zipcode?: string;
  districtId?: string;
  tel?: string;
  fax?: string;
  website?: string;
  socialCode?: string;
  socSignName?: string;
  socSignPos?: string;
  socSignImg?: string;
  taxSignName?: string;
  taxSignPos?: string;
  taxSignImg?: string;
  branchNo?: string;
  taxId?: string;
  taxId2?: string;
  consolidate?: string;
  brandTdesc?: string;
  brandEdesc?: string;
  logo?: string;
  comType?: string;
  isCompany: string; // '1' for company
  isBranch?: string; // '0' or empty for company
  headCompany?: string;
  branchTax?: string;
  // System fields
  editBy?: string;
  editDate?: string;
  editTime?: string;
  approve?: string;
  verified?: string;
}

/** Alias for components/services that expect CompanyModel */
export type CompanyModel = Company;

export interface CompanyPayloadModel {
  branchId: string;
  companyId: string;
  socBranchId?: string;
  taxBranchId?: string;
  tdesc: string;
  edesc: string;
  taddr?: string;
  tvillage?: string;
  troomNo?: string;
  tfloor?: string;
  tsoi?: string;
  tmoo?: string;
  troad?: string;
  tsubdistrict?: string;
  eaddr?: string;
  evillage?: string;
  eroomNo?: string;
  efloor?: string;
  esoi?: string;
  emoo?: string;
  eroad?: string;
  esubdistrict?: string;
  zipcode?: string;
  districtId?: string;
  tel?: string;
  fax?: string;
  website?: string;
  socialCode?: string;
  socSignName?: string;
  socSignPos?: string;
  socSignImg?: string;
  taxSignName?: string;
  taxSignPos?: string;
  taxSignImg?: string;
  branchNo?: string;
  taxId?: string;
  taxId2?: string;
  consolidate?: string;
  brandTdesc?: string;
  brandEdesc?: string;
  logo?: string;
  comType?: string;
  isCompany: string;
  isBranch?: string;
  headCompany?: string;
  branchTax?: string;
}

// Related tables from DBXML
export interface ZipCode {
  zipcode: string;
  tdesc?: string;
  edesc?: string;
  districtId?: string;
  provinceId?: string;
  companyId?: string;
}

export interface District {
  districtId: string;
  tdesc?: string;
  edesc?: string;
  provinceId?: string;
  companyId?: string;
}

export interface Province {
  provinceId: string;
  shortEname?: string;
  shortTname?: string;
  longTname?: string;
  longEname?: string;
  companyId?: string;
}

export interface CompanyGroup {
  companyId: string;
  tname?: string;
  ename?: string;
}

export interface CompanyType {
  codeId: string;
  tdesc?: string;
  edesc?: string;
}
