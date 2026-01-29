export interface BannerSetup {
  bannerId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface BannerSetupPayload {
  bannerId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
