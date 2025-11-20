import { BaseModel, TranslateService } from './base.model';

/**
 * Type model
 */
export interface Type {
  codeId?: string;
  tdesc?: string;
  edesc?: string;
  getTypeDesc?(): string;
}

export class MyType extends BaseModel implements Type {
  tdesc: string | undefined;
  edesc: string | undefined;
  codeId?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.codeId = data.codeId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getTypeDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

