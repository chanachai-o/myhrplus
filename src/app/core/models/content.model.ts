import {Bu1} from "./bu1.model";
import {Bu2} from "./bu2.model";
import {Bu3} from "./bu3.model";
import {Bu4} from "./bu4.model";
import {Bu5} from "./bu5.model";
import {WorkArea} from "./workarea.model";
import {Job} from "./job.model";
import {Type} from "./type.model";
import {Group} from "./group.model";
import {Costcenter} from "./costcenter.model";
import {Time0} from "./time0.model";
import {Branch} from "./branch.model";
import { BaseModel } from './base.model';
import { TranslateService } from '@ngx-translate/core';
import { Position } from './position.model'


export interface Content {
  employeeId?: string;
  fname?: string;
  lname?: string;
  efname?: string;
  elname?: string;
  bu1?: Bu1;
  bu2?: Bu2;
  bu3?: Bu3;
  bu4?: Bu4;
  bu5?: Bu5;
  workarea?: WorkArea;
  position?: Position;
  job?: Job;
  type?: Type;
  group?: Group;
  costcenter?: Costcenter;
  bossId?: string;
  time0?: Time0;
  branch?: Branch;
  telExt?: string;
}

export class MyContent extends BaseModel implements Content {
  fname : string = "";
  lname : string = "";
  efname : string = "";
  elname : string = "";
  workarea : WorkArea | undefined;
  position : Position | undefined;
  job : Job | undefined;
  type : Type | undefined;
  group : Group | undefined;
  costcenter : Costcenter | undefined;
  time0 : Time0 | undefined;
  branch : Branch | undefined;

  constructor (data : Partial<any> , tranSer : TranslateService) {
      super(data , tranSer)
  }
  ThEnFullname() : string{
    return this.translateService.currentLang == 'th'
    ? this.fname + '' + this.lname
    : this.efname + '' + this.elname;
  }
  ThEnWorkArea() : string{
    return this.translateService.currentLang == 'th'
    ? this.workarea?.tdesc!
    : this.workarea?.edesc!;
  }
  ThEnPosition() : string {
    return this.translateService.currentLang == 'th'
    ? this.position?.tdesc!
    : this.position?.edesc!;
  }
  ThEnJob() : string {
    return this.translateService.currentLang == 'th'
    ? this.job?.tdesc!
    : this.job?.edesc!;
  }
  ThEnGroup() : string {
    return this.translateService.currentLang == 'th'
    ? this.job?.tdesc!
    : this.job?.edesc!;
  }
  ThEnCostcenter() : string {
    return this.translateService.currentLang == 'th'
    ? this.job?.tdesc!
    : this.job?.edesc!;
  }
  ThEnTime0() : string {
    return this.translateService.currentLang == 'th'
    ? this.job?.tdesc!
    : this.job?.edesc!;
  }
  ThEnBranch() : string {
    return this.translateService.currentLang == 'th'
    ? this.job?.tdesc!
    : this.job?.edesc!;
  }
}
