export interface EPayslipSignature {
  signatureId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface EPayslipSignaturePayload {
  signatureId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
