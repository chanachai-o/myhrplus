export interface JobGroup {
  jobGroupId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface JobGroupPayload {
  jobGroupId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
