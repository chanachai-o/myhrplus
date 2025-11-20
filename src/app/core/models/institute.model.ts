import { BaseModel, TranslateService } from './base.model';

/**
 * Institute model
 */
export interface Institue {
  institueId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;
  getInstitueDesc(): string;
}

export class MyInstitue extends BaseModel implements Institue {
  institueId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.institueId = data.institueId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getInstitueDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

