export interface CompanyType {
  codeid: string;
  tdesc: string;
  edesc: string;
  edit_by?: string;
  edit_date?: string;
  edit_time?: string;
  verified?: string;
  companyId?: string; // from comment but might be needed
}

export interface CompanyTypePayload {
  codeid: string;
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
}


