import { BaseModel, TranslateService } from './base.model';

/**
 * Welfare group model
 */
export interface Welgrp {
  welgId?: string;
  tdesc?: string;
  edesc?: string;
  getWelgrp?(): string;
}

export class MyWelgrp extends BaseModel implements Welgrp {
  tdesc: string | undefined;
  edesc: string | undefined;
  welgId?: string;

  constructor(data: Partial<Welgrp>, tranSer: TranslateService) {
    super(data, tranSer);
    this.welgId = data.welgId;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }

  getWelgrp(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

