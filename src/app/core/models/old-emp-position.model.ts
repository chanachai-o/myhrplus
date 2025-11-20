import { BaseModel, TranslateService } from './base.model';

/**
 * Old employee position model
 */
export interface OldEmpPosition {
  positionId?: string;
  tdesc: string;
  edesc: string;
  consolidate?: any;
  shortName?: any;
  sortNumber?: number;
  getDesc?(): string;
}

export class MyOldEmpPosition extends BaseModel implements OldEmpPosition {
  tdesc: string = '';
  edesc: string = '';
  positionId?: string;
  consolidate?: any;
  shortName?: any;
  sortNumber?: number;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.positionId = data.positionId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
    this.consolidate = data.consolidate;
    this.shortName = data.shortName;
    this.sortNumber = data.sortNumber;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

