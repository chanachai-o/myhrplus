import { BaseModel, TranslateService } from './base.model';

/**
 * Faculty model
 */
export interface Faculty {
  facultyId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;
  getFacultyDesc?(): string;
}

export class MyFaculty extends BaseModel implements Faculty {
  facultyId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.facultyId = data.facultyId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getFacultyDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

