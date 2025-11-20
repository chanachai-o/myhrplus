import { BaseModel, TranslateService } from './base.model';

/**
 * Swipe card model
 */
export interface SwipeCard {
  employeeId: string;
  swipeDate: string;
  swipeTime: number;
  swipeType: string;
  source: string;
  machineNo: string;
  time0id: string;
  docId: string;
}

export class MySwipeCard extends BaseModel implements SwipeCard {
  employeeId: string;
  swipeDate: string;
  swipeTime: number;
  swipeType: string;
  source: string;
  machineNo: string;
  time0id: string;
  docId: string;

  constructor(data: Partial<SwipeCard>, translateService: TranslateService) {
    super(data, translateService);
    this.employeeId = data.employeeId || '';
    this.swipeDate = data.swipeDate || '';
    this.swipeTime = data.swipeTime || 0;
    this.swipeType = data.swipeType || '';
    this.source = data.source || '';
    this.machineNo = data.machineNo || '';
    this.time0id = data.time0id || '';
    this.docId = data.docId || '';
  }
}

