export interface JobCodeLevel {
  jobCodeLevelId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface JobCodeLevelPayload {
  jobCodeLevelId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
