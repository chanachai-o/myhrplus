import { BaseModel, TranslateService } from './base.model';

/**
 * Time0 model (working time configuration)
 */
export interface Time0 {
  time0id?: string;
  tdesc: string | undefined;
  edesc: string | undefined;
  stickTm?: string;
  getTime0Desc?(): string;
}

export class MyTime0 extends BaseModel implements Time0 {
  time0id?: string;
  tdesc: string | undefined;
  edesc: string | undefined;
  stickTm?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.time0id = data.time0id ? data.time0id : '';
    this.tdesc = data.tdesc ? data.tdesc : '';
    this.edesc = data.edesc ? data.edesc : '';
    this.stickTm = data.stickTm ? data.stickTm : '';
  }

  getTime0Desc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc ? this.tdesc : '')
      : (this.edesc ? this.edesc : '');
  }
}

