export interface DepartmentModel {
  bu2Id: string;
  companyId: string;
  parent?: string; // Reference to MBU1 (Division)
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
  bu2Sup?: string; // Position ID (relation to mposition)
  website?: string;
  email?: string;
  // System fields
  editBy?: string;
  editDate?: string;
  editTime?: string;
  approve?: string;
  verified?: string;
}

export interface DepartmentPayloadModel {
  bu2Id: string;
  companyId: string;
  parent?: string;
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
  bu2Sup?: string;
  website?: string;
  email?: string;
}

// Related tables from DBXML
export interface DivisionModel {
  bu1Id: string;
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
