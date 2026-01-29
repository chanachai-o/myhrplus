export interface KcKpiGroup {
  kcKpiGroupId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface KcKpiGroupPayload {
  kcKpiGroupId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
