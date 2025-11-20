import { BaseModel, TranslateService } from './base.model';

/**
 * Event group model
 */
export interface Eventgrp {
  eventgrpid?: string;
  eventgrpId?: string;
  tdesc?: string;
  edesc?: string;
  getDesc(): string;
}

export class MyEventgrp extends BaseModel implements Eventgrp {
  eventgrpid: string = '';
  eventgrpId: string = '';
  tdesc: string = '';
  edesc: string = '';

  constructor(data: Partial<Eventgrp>, tranSer: TranslateService) {
    super(data, tranSer);
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
    this.eventgrpid = data.eventgrpid || '';
    this.eventgrpId = data.eventgrpId || '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.tdesc
      : this.edesc;
  }
}

