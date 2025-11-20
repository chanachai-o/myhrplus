import { BaseModel, TranslateService } from './base.model';

/**
 * Course type model
 */
export interface CrsType {
  courseTypeId?: string;
  tdesc?: string;
  edesc?: string;
  getCrsTypeDesc?(): string;
}

export class MyCrsType extends BaseModel implements CrsType {
  tdesc: string | undefined;
  edesc: string | undefined;
  courseTypeId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.courseTypeId = data.courseTypeId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getCrsTypeDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

