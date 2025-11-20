import { BaseModel, TranslateService } from './base.model';

/**
 * Old job model
 */
export interface OldJob {
  jobcodeId?: string;
  tdesc: string;
  edesc: string;
  getDesc?(): string;
}

export class MyOldJob extends BaseModel implements OldJob {
  jobcodeId?: string;
  tdesc: string = '';
  edesc: string = '';

  constructor(data: Partial<any>, translateService?: TranslateService) {
    super(data, translateService);
    this.jobcodeId = data.jobcodeId || '';
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

