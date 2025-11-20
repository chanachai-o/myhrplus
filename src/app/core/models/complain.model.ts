import { Disease } from './disease.model';
import { Sitewel } from './sitewel.model';
import { Welfare } from './welfare.model';

/**
 * Complain model
 */
export interface Complain {
  complainId?: string;
  caseId?: string;
  welfare?: Welfare;
  startDate?: string;
  endDate?: string;
  sitewel?: Sitewel;
  disease?: Disease;
  occurDate?: string;
  reqCost?: number;
  cost?: number;
  status?: string;
  approveStatus?: string;
  approveDate?: string;
  remark?: string;
}

