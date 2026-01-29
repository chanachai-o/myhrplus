export interface DivisionModel {
  bu1Id: string;
  companyId: string;
  branchId?: string;
  tdesc: string;
  edesc: string;
  tshortName?: string;
  eshortName?: string;
  shortName?: string;
  active: string; // '0' or '1'
  buildDate?: string;
  expireDate?: string;
  objective?: string;
  remark?: string;
  extention?: string;
  consolidate?: string;
  analcode?: string;
  sortNumber?: number;
  bu1Sup?: string; // Position ID (relation to mposition)
  website?: string;
  email?: string;
  // System fields
  editBy?: string;
  editDate?: string;
  editTime?: string;
  approve?: string;
  verified?: string;
}

export interface DivisionPayloadModel {
  bu1Id: string;
  companyId: string;
  branchId?: string;
  tdesc: string;
  edesc: string;
  tshortName?: string;
  eshortName?: string;
  shortName?: string;
  active: string;
  buildDate?: string;
  expireDate?: string;
  objective?: string;
  remark?: string;
  extention?: string;
  consolidate?: string;
  analcode?: string;
  sortNumber?: number;
  bu1Sup?: string;
  website?: string;
  email?: string;
}

// Related tables from DBXML
export interface Branch {
  branchId: string;
  tdesc?: string;
  edesc?: string;
  companyId?: string;
}

export interface Position {
  positionId: string;
  tdesc?: string;
  edesc?: string;
  companyId?: string;
}
