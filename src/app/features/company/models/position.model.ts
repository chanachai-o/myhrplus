
/**
 * API Response interface for Position (PRU010)
 * Used when API returns camelCase or different field names
 */
export interface PositionModel {
  positionId: string;
  tdesc: string;
  edesc?: string;
  active?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
  companyId?: string;
}
