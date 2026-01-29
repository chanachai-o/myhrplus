export interface SectionModel {
  bu3Id: string;
  companyId: string;
  parent?: string; // Reference to MBU2 (Department)
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
  bu3Sup?: string; // Position ID (relation to mposition)
  website?: string;
  email?: string;
  // System fields
  editBy?: string;
  editDate?: string;
  editTime?: string;
  approve?: string;
  verified?: string;
}

/** @deprecated Use SectionModel */
export type Section = SectionModel;

export interface SectionPayloadModel {
  bu3Id: string;
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
  bu3Sup?: string;
  website?: string;
  email?: string;
}

// Related tables from DBXML
export interface Department {
  bu2Id: string;
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
