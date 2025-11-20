import { BaseModel, TranslateService } from './base.model';

/**
 * Degree model
 */
export interface Degree {
  degreeId?: string | undefined;
  tdesc?: string | undefined;
  edesc?: string | undefined;
  getDegreeDesc?(): string;
}

export class MyDegree extends BaseModel implements Degree {
  tdesc: string | undefined;
  edesc: string | undefined;
  degreeId?: string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.degreeId = data.degreeId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDegreeDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

