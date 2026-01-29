export interface ManpowerNumberData {
  manpowerNumberDataId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface ManpowerNumberDataPayload {
  manpowerNumberDataId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
