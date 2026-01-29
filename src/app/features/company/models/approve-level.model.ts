export interface ApproveLevel {
  approveLevelId: string;
  companyId: string;
  tdesc: string;
  edesc: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  approve?: string;
  verified?: string;
}

export interface ApproveLevelPayload {
  approveLevelId: string;
  companyId: string;
  tdesc: string;
  edesc: string;
}
