export interface VideoSetup {
  videoId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface VideoSetupPayload {
  videoId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
