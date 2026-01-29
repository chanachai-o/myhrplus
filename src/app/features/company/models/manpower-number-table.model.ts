export interface ManpowerNumberTable {
  manpowerNumberTableId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface ManpowerNumberTablePayload {
  manpowerNumberTableId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
