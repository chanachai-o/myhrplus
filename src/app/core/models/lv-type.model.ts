import { BaseModel, TranslateService } from './base.model';

/**
 * Leave type model
 */
export interface LvType {
  eventgrpid?: string;
  tdesc?: string;
  edesc?: string;
  getLvTypeDesc?(): string;
}

export class MyLvType extends BaseModel implements LvType {
  tdesc: string = '';
  edesc: string = '';
  eventgrpid?: string;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
    this.eventgrpid = data.eventgrpid;
  }

  getLvTypeDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

