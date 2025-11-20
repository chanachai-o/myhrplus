import { BaseModel } from './base.model';
import { Position } from './position.model';
import { Job } from './job.model';
import { Bu1, MyBu1 } from './bu1.model';
import { Bu2, MyBu2 } from './bu2.model';
import { Bu3, MyBu3 } from './bu3.model';

import { OldJob } from './oldjob.model';
import { OldEmpPosition } from './oldempposition.model';


import { TranslateService } from '@ngx-translate/core';
import { AdjTypeModel } from './adjType.model';
import { AdjReasonModel } from './AdjReason.model';

export interface MovementsModel {
  employeeid?: string;
  companyid?: any;
  adj_date?: string;
  eff_date?: string;
  line_no?: string;
  // adj_type?: string;
  // adj_reason?: string;
  adj_type: AdjTypeModel
  adj_reason: AdjReasonModel
  job?: Job;
  subgrade?: any;
  emp_position?: Position;
  bu1?: Bu1;
  bu2?: Bu2;
  bu3?: Bu3;
  salary?: number;
  old_job?: OldJob;
  old_subgrade?: any;
  old_emp_position?: OldEmpPosition;
  old_bu1?: Bu1;
  old_bu2?: Bu2;
  old_bu3?: Bu3;
  old_salary?: number;
}

export class MyMovementsModel extends BaseModel
  implements MovementsModel, Job, Position{
  employeeid?: string;
  companyid?: any;
  adj_date?: string;
  eff_date?: string;
  line_no?: string;
  adj_type: AdjTypeModel;
  adj_reason: AdjReasonModel;
  job?: Job;
  subgrade?: any;
  emp_position?: Position;
  bu1?: Bu1;
  bu2?: Bu2;
  bu3?: Bu3;
  salary?: number;
  old_job?: OldJob;
  old_subgrade?: any;
  old_emp_position?: OldEmpPosition;
  old_bu1?: Bu1;
  old_bu2?: Bu2;
  old_bu3?: Bu3;
  old_salary?: number;

  positionId: string = "";
  tdesc: string = "";
  edesc: string = "";
  consolidate?: any;
  shortName?: any;
  sortNumber: number = 0;

  jobcodeId: string = "";

  bu1id: string = "";
  bu3id: string = "";
  bu2id: string = "";

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.bu1 = data.bu1 ? new MyBu1(data.bu1!, this.translateService) : data.bu1;
    this.bu2 = data.bu2 ? new MyBu2(data.bu2!, this.translateService) : data.bu2;
    this.bu3 = data.bu3 ? new MyBu3(data.bu3!, this.translateService) : data.bu3;
    this.adj_type = data?.adj_type ? new AdjTypeModel(data?.adj_type, translateService!) : new AdjTypeModel({}, translateService!)
    this.adj_reason = data?.adj_reason ? new AdjReasonModel(data?.adj_reason, translateService!) : new AdjReasonModel({}, translateService!)
    this.positionId = data.positionId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.sortNumber = data.sortNumber;
    this.jobcodeId = data.jobcodeId;
    this.bu1id = data.bu1id;
    this.bu3id = data.bu3id;
    this.bu2id = data.bu2id;


  }

  getJobMovement():string{
    return this.translateService.currentLang == 'th'
      ? this.job?.tdesc!
      : this.job?.edesc!;
  }

  getPositionMovement(): string {
    return this.translateService.currentLang == 'th'
      ? this.emp_position?.tdesc!
      : this.emp_position?.edesc!;
  }
  getBu1Movement(): string {
    return this.translateService.currentLang == 'th'
      ? this.bu1?.tdesc!
      : this.bu1?.edesc!;
  }
  getBu2Movement(): string {
    return this.translateService.currentLang == 'th'
      ? this.bu2?.tdesc!
      : this.bu2?.tdesc!;
  }
  getBu3Movement() {
    return this.translateService.currentLang == 'th'
      ? this.bu3?.tdesc!
      : this.bu3?.edesc!;
  }
}
