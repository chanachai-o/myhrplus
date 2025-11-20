import { BaseModel, TranslateService } from './base.model';

/**
 * Religion model
 */
export interface ReligionModel {
  religionId?: string;
  tdesc: string | undefined;
  edesc: string | undefined;
  getDesc?(): string;
}

export class MyReligionModel extends BaseModel implements ReligionModel {
  tdesc: string | undefined;
  edesc: string | undefined;
  religionId?: string;

  constructor(data: Partial<ReligionModel>, translateService: TranslateService) {
    super(data, translateService);
    this.religionId = data.religionId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

