import { BaseModel, TranslateService } from './base.model';

/**
 * Position model
 */
export interface Position {
  positionId?: string;
  tdesc?: string;
  edesc?: string;
  consolidate?: any;
  shortName?: any;
  sortNumber?: number;
  getPositionDesc?(): string;
}

export class MyPosition extends BaseModel implements Position {
  tdesc: string | undefined;
  edesc: string | undefined;
  positionId?: string;
  consolidate?: any;
  shortName?: any;
  sortNumber?: number;

  constructor(data: Partial<Position>, translateService: TranslateService) {
    super(data, translateService);
    this.positionId = data.positionId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.consolidate = data.consolidate;
    this.shortName = data.shortName;
    this.sortNumber = data.sortNumber;
  }

  getPositionDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

