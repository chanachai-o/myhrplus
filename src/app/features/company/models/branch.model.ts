export interface BranchModel {
  branchId: string; // PK
  companyId: string;
  headCompany?: string; // Reference to Company (branchid where iscompany='1')
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
  isCompany?: string; // '0' or empty for branch
  isBranch: string; // '1' for branch
  branchTax?: string;
  // System fields
  editBy?: string;
  editDate?: string;
  editTime?: string;
  approve?: string;
  verified?: string;
}

/** @deprecated Use BranchModel */
export type Branch = BranchModel;

export interface BranchPayloadModel {
  branchId: string;
  companyId: string;
  headCompany?: string;
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
  isCompany?: string;
  isBranch: string;
  branchTax?: string;
}

// Related tables from DBXML (same as Company)
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

export interface Company {
  branchId: string;
  tdesc?: string;
  edesc?: string;
  companyId?: string;
}
