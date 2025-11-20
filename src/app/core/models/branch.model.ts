import { BaseModel, TranslateService } from './base.model';

/**
 * Branch model
 */
export interface Branch {
  branchId?: string;
  tdesc?: string;
  edesc?: string;
  getBranchDesc?(): string;
}

export class MyBranch extends BaseModel implements Branch {
  branchId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.branchId = data.branchId ? data.branchId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
  }

  getBranchDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

