export interface CompanyType {
  codeId: string;
  tdesc: string;
  edesc: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
  companyId?: string; // from comment but might be needed
}

export interface CompanyTypePayload {
  codeId: string;
  tdesc: string;
  edesc: string;
}

/**
 * API Response interface for CompanyType
 * Used when API returns camelCase field names
 */
export interface CompanyTypeApiResponse {
  codeId: string;
  tdesc: string;
  edesc: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
}
