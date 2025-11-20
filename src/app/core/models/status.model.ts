import { BaseModel, TranslateService } from './base.model';

/**
 * Status model
 */
export interface Status {
  statusCode?: string;
  tdesc: string;
  edesc: string;
  getStatusDesc?(): string;
}

export class MyStatus extends BaseModel implements Status {
  tdesc: string = '';
  edesc: string = '';
  statusCode?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.statusCode = data.statusCode;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getStatusDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

