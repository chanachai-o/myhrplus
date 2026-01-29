export interface EventSetup {
  eventId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface EventSetupPayload {
  eventId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
