import { BaseModel, TranslateService } from './base.model';
import { Training, MyTraining } from './training.model';
import { TrainingStat, MyTrainingStat } from './training-stat.model';

/**
 * Training content model
 */
export interface TrainingContent {
  training?: Training;
  traineeRegister?: string;
  status?: string;
  tconfirm?: string;
  resType?: string;
  resDate?: string;
  remark?: string;
  trainingStat?: TrainingStat;
}

export class MyTrainingContent extends BaseModel implements TrainingContent {
  training: Training | undefined;
  trainingStat: TrainingStat | undefined;
  traineeRegister?: string;
  status?: string;
  tconfirm?: string;
  resType?: string;
  resDate?: string;
  remark?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.training = data.training
      ? new MyTraining(data.training, this.translateService!)
      : undefined;
    this.trainingStat = data.trainingStat
      ? new MyTrainingStat(data.trainingStat, this.translateService!)
      : undefined;
    this.traineeRegister = data.traineeRegister;
    this.status = data.status;
    this.tconfirm = data.tconfirm;
    this.resType = data.resType;
    this.resDate = data.resDate;
    this.remark = data.remark;
  }
}

