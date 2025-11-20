import { BaseModel, TranslateService } from './base.model';

/**
 * Training type model
 */
export interface TrainingType {
  trtyId?: string;
  trtyDesc?: string;
  trtyEdesc?: string;
  getDesc?(): string;
}

export class MyTrainingType extends BaseModel implements TrainingType {
  trtyDesc: string | undefined;
  trtyEdesc: string | undefined;
  trtyId?: string;

  constructor(data: Partial<TrainingType>, translateService: TranslateService) {
    super(data, translateService);
    this.trtyId = data.trtyId;
    this.trtyDesc = data.trtyDesc;
    this.trtyEdesc = data.trtyEdesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.trtyDesc || '')
      : (this.trtyEdesc || '');
  }
}

