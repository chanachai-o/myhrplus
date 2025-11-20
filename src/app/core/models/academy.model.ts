import { BaseModel, TranslateService } from './base.model';

/**
 * Academy model
 */
export interface Academy {
  academyId?: string;
  tdesc?: string;
  edesc?: string;
  photo?: string;
  getAcademyDesc?(): string;
}

export class MyAcademy extends BaseModel implements Academy {
  tdesc: string | undefined;
  edesc: string | undefined;
  academyId?: string;
  photo?: string;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.academyId = data.academyId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.photo = data.photo;
  }

  getAcademyDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

