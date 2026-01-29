export interface ManpowerType {
  manpowerTypeId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface ManpowerTypePayload {
  manpowerTypeId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
