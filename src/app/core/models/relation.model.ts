import { BaseModel, TranslateService } from './base.model';

/**
 * Relation model
 */
export interface Relation {
  relationId?: string;
  tdesc?: string;
  edesc?: string;
  getDesc?(): string;
}

export class MyRelation extends BaseModel implements Relation {
  relationId?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data: Partial<Relation>, translateService: TranslateService) {
    super(data, translateService);
    this.relationId = data.relationId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

