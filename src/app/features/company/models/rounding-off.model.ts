export interface RoundingOff {
  roundingId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface RoundingOffPayload {
  roundingId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
