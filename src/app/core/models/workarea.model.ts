import { BaseModel, TranslateService } from './base.model';

/**
 * Work area model
 */
export interface WorkArea {
  workareaId?: string;
  tdesc?: string;
  edesc?: string;
  getWorkAreaDesc?(): string;
}

export class MyWorkArea extends BaseModel implements WorkArea {
  tdesc: string = '';
  edesc: string = '';
  workareaId: string = '';

  constructor(data: Partial<WorkArea>, translateService: TranslateService) {
    super(data, translateService);
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
    this.workareaId = data.workareaId || '';
  }

  getWorkAreaDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

