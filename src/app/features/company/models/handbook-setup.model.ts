export interface HandbookSetup {
  handbookId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface HandbookSetupPayload {
  handbookId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
