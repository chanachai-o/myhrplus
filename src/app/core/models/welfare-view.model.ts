import { BaseModel, TranslateService } from './base.model';
import { Disease, MyDisease } from './disease.model';
import { Sitewel, MySitewel } from './sitewel.model';
import { Welfare, MyWelfare } from './welfare.model';

/**
 * Welfare view model
 */
export interface WelfareViewModel {
  complainId?: string;
  caseId?: string;
  welfare?: Welfare;
  startDate?: string;
  endDate?: string;
  sitewel?: Sitewel;
  disease?: Disease;
  occurDate?: string;
  refNo?: string;
  reqCost?: number;
  cost?: number;
  status?: string;
  approveStatus?: string;
  approveDate?: string;
  remark?: string;
}

export class MyWelfareViewModel extends BaseModel implements WelfareViewModel {
  complainId: string | undefined;
  caseId?: string | undefined;
  welfare?: Welfare | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  sitewel?: Sitewel | undefined;
  disease?: Disease | undefined;
  occurDate?: string | undefined;
  refNo?: string | undefined;
  reqCost?: number | undefined;
  cost?: number | undefined;
  status?: string | undefined;
  approveStatus?: string | undefined;
  approveDate?: string | undefined;
  remark?: string | undefined;

  constructor(data: Partial<WelfareViewModel>, translateService: TranslateService) {
    super(data, translateService);
    this.complainId = data.complainId;
    this.caseId = data.caseId;
    this.welfare = data.welfare
      ? new MyWelfare(data.welfare, this.translateService!)
      : data.welfare;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.sitewel = data.sitewel
      ? new MySitewel(data.sitewel, this.translateService!)
      : data.sitewel;
    this.disease = data.disease
      ? new MyDisease(data.disease, this.translateService!)
      : data.disease;
    this.occurDate = data.occurDate;
    this.refNo = data.refNo;
    this.reqCost = data.reqCost;
    this.cost = data.cost;
    this.status = data.status;
    this.approveStatus = data.approveStatus;
    this.approveDate = data.approveDate;
    this.remark = data.remark;
  }
}

