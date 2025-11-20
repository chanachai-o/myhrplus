import { TranslateService } from '@ngx-translate/core';
import { Academy } from './academyplan.model';
import { BaseModel } from './base.model';
import { Course } from './course.model';
import { CrsCategory } from './crscategory.model';
import { CrsGroup } from './crsgroup.model';
import { CrsType } from './crstype.model';
import { Locations } from './locations.model';
import { PageAble } from './pageable.model';
import { Room } from './room.model';
import { Sort2 } from './sort2.model';
import { Training } from './trainingplan.model';

export interface TraineeplanContent {
  training: Training | undefined;
  traineeRegister: string;
  status: string;
  tconfirm: string;
  resType: string;
  resDate: string;
  remark: string;
  trainingStat?: any;

  getCourseDesc(): string;
}

export class MyTraineeplanContent extends BaseModel
  implements TraineeplanContent{
  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
  }

  content: TraineeplanContent[] | undefined;
  pageable: PageAble | undefined;
  last: boolean = false;
  totalPages: number = 0;
  totalElements: number = 0;
  number: number = 0;
  sort: Sort2 | undefined;
  size: number = 0;
  first: boolean = false;
  numberOfElements: number = 0;
  empty: boolean = false;

  training: Training | undefined;
  traineeRegister: string = "";
  status: string = "";
  tconfirm: string = "";
  resType: string = "";
  resDate: string = "";
  remark: string = "";
  trainingStat?: any;

  trainingId: string = "";
  title: string = "";
  resDateFrm: string = "";
  resDateTo: string = "";
  classDateFrm: string = "";
  classDateTo: string = "";
  academy: Academy | undefined;
  location: Locations | undefined;
  room: Room | undefined;
  course: Course | undefined;
  timeStart: number = 0;
  timeStop: number = 0;
  classHour: number = 0;
  trainType: string = "";

  academyId?: string;
  tdesc?: string;
  edesc?: string;
  photo?: string;

  courseId?: string;
  detail?: string;
  objective?: string;
  editorial?: string;
  crsKind?: string;
  preCrs?: string;
  every?: string;
  frequencyEvery?: string;
  crsCategory?: CrsCategory;
  crsGroup?: CrsGroup;
  crsType?: CrsType;

  getCourseDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.training?.course.tdesc!
      : this.training?.course.edesc!;
  }

  getCrsTypeDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.training?.course.crsType?.tdesc!
      : this.training?.course.crsType?.edesc!;
  }

  getCourseGroupId(): string {
    return this.translateService.currentLang == 'th'
      ? this.training?.course.crsGroup?.tdesc!
      : this.training?.course.crsGroup?.edesc!;
  }

  getCategoryDesc(): string {
    return this.translateService.currentLang == 'th'
    ? this.training?.course.crsGroup?.tdesc!
    : this.training?.course.crsGroup?.edesc!;
  }
}
