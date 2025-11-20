import { BaseModel, TranslateService } from './base.model';
import { Prefix } from './prefix.model';

/**
 * Trainer model
 */
export interface Trainer {
  trainerId: string;
  prefix: Prefix;
  trfname: string;
  trefname: string;
  trlname: string;
  trelname: string;
}

/**
 * Training trainer model
 */
export interface TrainTrner {
  trainingId: string;
  mainTrner: string;
  trainer: Trainer | undefined;
}

export class MyTrainTrner extends BaseModel implements TrainTrner {
  trainingId: string = '';
  mainTrner: string = '';
  trainer: Trainer | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.trainingId = data.trainingId || '';
    this.mainTrner = data.mainTrner || '';
    this.trainer = data.trainer;
  }
}

