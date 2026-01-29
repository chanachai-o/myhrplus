export interface AssetModel {
  companyId: string;
  assetId: string;
  tdesc: string;
  edesc: string;
  astype: string; // Asset Type ID
  fine: string; // Double stored as string
  remarks?: string;
  owner?: string;
  status?: string; // ASSET_STATUS
  reservation?: string; // 0/1

  // Display fields
  astypeTdesc?: string;
  ownerFname?: string;
  ownerLname?: string;
}
