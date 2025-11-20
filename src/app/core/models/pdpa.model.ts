/**
 * PDPA model
 */
export interface Pdpa {
  version: number;
  startDate: string;
  endDate: string;
  requestConsent: string;
  requestConsentEng: string;
  requestConsentLang: string;
  status: number;
}

/**
 * Employee consent model
 */
export interface EmployeeConsent {
  version: number;
  employeeId: string;
  status: number;
}

