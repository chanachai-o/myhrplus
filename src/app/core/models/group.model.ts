import { BaseModel, TranslateService } from './base.model';

/**
 * Group model
 */
export interface Group {
  groupId?: string;
  tdesc?: string;
  edesc?: string;
  getGroupDesc?(): string;
}

export class MyGroup extends BaseModel implements Group {
  groupId: string = '';
  tdesc: string = '';
  edesc: string = '';

  constructor(data: Partial<Group>, translateService: TranslateService) {
    super(data, translateService);
    this.groupId = data.groupId ? data.groupId : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
  }

  getGroupDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

