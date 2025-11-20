import { BaseModel, TranslateService } from './base.model';

/**
 * Course group model
 */
export interface CrsGroup {
  courseGroupId?: string;
  tdesc?: string;
  edesc?: string;
  getCrsGroupDesc?(): string;
}

export class MyCrsGroup extends BaseModel implements CrsGroup {
  tdesc: string | undefined;
  edesc: string | undefined;
  courseGroupId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.courseGroupId = data.courseGroupId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getCrsGroupDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

