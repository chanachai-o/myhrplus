import { BaseModel, TranslateService } from './base.model';
import { Academy, MyAcademy } from './academy.model';
import { Locations, MyLocations } from './locations.model';
import { Room, MyRoom } from './room.model';
import { Course, MyCourse } from './course.model';
import { Responsible } from './responsible.model';
import { TrainTrner } from './train-trner.model';
import { TrainingType, MyTrainingType } from './training-type.model';
import { TrainCost } from './train-cost.model';

/**
 * Training time model
 */
export interface TrainingTime {
  trainingId: string;
  lineNo: string;
  startDate: string;
  endDate: string;
  startTime: number;
  endTime: number;
  hour: number;
  timeBreak: number;
  status: string;
}

/**
 * Training model
 */
export interface Training {
  trainingId?: string;
  title?: string;
  status?: string;
  resDateFrm?: string;
  resDateTo?: string;
  classDateFrm?: string;
  classDateTo?: string;
  academy?: Academy;
  location?: Locations;
  room?: Room;
  course?: Course;
  responsible?: Responsible[];
  timeStart?: number;
  timeStop?: number;
  classHour?: number;
  recurrentStartdate?: string;
  trainingTimes?: TrainingTime[];
  traintrner?: TrainTrner[];
  trainingType?: TrainingType;
  trainType?: string;
  memo?: string;
  budPlaned?: number;
  budUsed?: number;
  traineeEmployee?: any[]; // TODO: use EmployeeModel type
  trainExp?: TrainCost[];
}

export class MyTraining extends BaseModel implements Training {
  academy: Academy | undefined;
  location: Locations | undefined;
  room: Room | undefined;
  course: Course | undefined;
  responsible: Responsible[] | undefined;
  traintrner: TrainTrner[] | undefined;
  trainingType: TrainingType | undefined;
  traineeEmployee?: any[] | undefined;
  trainExp?: TrainCost[] | undefined;
  trainingId?: string;
  title?: string;
  status?: string;
  resDateFrm?: string;
  resDateTo?: string;
  classDateFrm?: string;
  classDateTo?: string;
  timeStart?: number;
  timeStop?: number;
  classHour?: number;
  recurrentStartdate?: string;
  trainingTimes?: TrainingTime[];
  trainType?: string;
  memo?: string;
  budPlaned?: number;
  budUsed?: number;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.academy = data.academy
      ? new MyAcademy(data.academy, this.translateService!)
      : undefined;
    this.location = data.location
      ? new MyLocations(data.location, this.translateService!)
      : undefined;
    this.room = data.room
      ? new MyRoom(data.room, this.translateService!)
      : undefined;
    this.course = data.course
      ? new MyCourse(data.course, this.translateService!)
      : undefined;
    this.trainingType = data.trainingType
      ? new MyTrainingType(data.trainingType, this.translateService!)
      : undefined;
    this.responsible = data.responsible;
    this.traintrner = data.traintrner;
    this.traineeEmployee = data.traineeEmployee;
    this.trainExp = data.trainExp;
    this.trainingId = data.trainingId;
    this.title = data.title;
    this.status = data.status;
    this.resDateFrm = data.resDateFrm;
    this.resDateTo = data.resDateTo;
    this.classDateFrm = data.classDateFrm;
    this.classDateTo = data.classDateTo;
    this.timeStart = data.timeStart;
    this.timeStop = data.timeStop;
    this.classHour = data.classHour;
    this.recurrentStartdate = data.recurrentStartdate;
    this.trainingTimes = data.trainingTimes;
    this.trainType = data.trainType;
    this.memo = data.memo;
    this.budPlaned = data.budPlaned;
    this.budUsed = data.budUsed;
  }
}

