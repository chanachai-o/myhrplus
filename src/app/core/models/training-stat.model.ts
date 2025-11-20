import { BaseModel, TranslateService } from './base.model';

/**
 * Training stat model
 */
export interface TrainingStat {
  statId?: string;
  tdesc?: string;
  edesc?: string;
  success?: string;
  getTrainingStatDesc?(): string;
}

export class MyTrainingStat extends BaseModel implements TrainingStat {
  tdesc: string | undefined;
  edesc: string | undefined;
  statId?: string;
  success?: string;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.statId = data.statId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.success = data.success;
  }

  getTrainingStatDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

