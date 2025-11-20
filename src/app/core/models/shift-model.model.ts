import { BaseModel, TranslateService } from './base.model';

/**
 * Shift model
 */
export interface ShiftModel {
  time0id?: string;
  tdesc: string | undefined;
  edesc: string | undefined;
  status?: string;
  getDesc?(): string;
}

export class MyShiftModel extends BaseModel implements ShiftModel {
  tdesc: string | undefined;
  edesc: string | undefined;
  time0id?: string;
  status?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.time0id = data.time0id;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.status = data.status;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

