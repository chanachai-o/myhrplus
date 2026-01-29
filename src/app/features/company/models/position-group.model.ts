export interface PositionGroupModel {
  positionGroupId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
  editBy?: string;
  editDate?: string;
  editTime?: string;
  verified?: string;
}

export interface PositionGroupPayloadModel {
  positionGroupId: string;
  companyId?: string;
  tdesc: string;
  edesc?: string;
}
