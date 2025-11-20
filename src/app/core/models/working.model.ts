import { BaseModel, TranslateService } from './base.model';
import { Bu1, MyBu1 } from './bu1.model';
import { Bu2, MyBu2 } from './bu2.model';
import { Bu3, MyBu3 } from './bu3.model';
import { Bu4, MyBu4 } from './bu4.model';
import { Bu5, MyBu5 } from './bu5.model';
import { Bu6, MyBu6 } from './bu6.model';
import { Bu7, MyBu7 } from './bu7.model';
import { WorkArea, MyWorkArea } from './workarea.model';
import { Job, MyJob } from './job.model';
import { Type, MyType } from './type.model';
import { Group, MyGroup } from './group.model';
import { Costcenter } from './costcenter.model';
import { Time0, MyTime0 } from './time0.model';
import { Branch, MyBranch } from './branch.model';
import { Position, MyPosition } from './position.model';
import { Pl, MyPl } from './pl.model';
import { Grade } from './grade.model';

/**
 * Workings model
 */
export interface WorkingsModel {
  empName?: string;
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
  bu6?: Bu6;
  bu7?: Bu7;
  workarea?: WorkArea;
  position?: Position;
  pl?: Pl;
  job?: Job;
  type?: Type;
  group?: Group;
  grade?: Grade;
  costcenter?: Costcenter;
  bossId?: string;
  time0?: Time0;
  branch?: Branch;
  telExt?: string;
  picture?: string;
  startdate?: string;
  firstHiredate?: string;
  approveDate?: string;
  busNo?: string;
  nickname?: string;
  getFullnameTh?(): string;
  getFullnameEn?(): string;
  getFullname(): string;
  getPictureUrl(): string;
}

export class MyWorkingsModel
  extends BaseModel
  implements WorkingsModel, WorkArea, Position, Time0, Branch, Type, Group
{
  employeeId: string;
  fname: string = '';
  lname: string = '';
  efname: string = '';
  elname: string = '';
  bu1: Bu1 | undefined;
  bu2: Bu2 | undefined;
  bu3: Bu3 | undefined;
  bu4: Bu4 | undefined;
  bu5: Bu5 | undefined;
  bu6: Bu6 | undefined;
  bu7: Bu7 | undefined;
  workarea: WorkArea | undefined;
  position: Position | undefined;
  pl: Pl | undefined;
  job: Job | undefined;
  type: Type | undefined;
  group: Group | undefined;
  grade: Grade | undefined;
  costcenter: Costcenter | undefined;
  bossId: string = '';
  time0: Time0 | undefined;
  branch?: Branch | undefined;
  telExt: string = '';
  picture: string = '';
  positionId: string = '';
  tdesc: string = '';
  edesc: string = '';
  consolidate?: any;
  shortName?: any;
  sortNumber: number = 0;
  workareaId: string = '';
  time0id: string = '';
  branchId?: string = '';
  codeId: string = '';
  groupId: string = '';
  firstHiredate?: string;
  busNo?: string;
  nickname?: string;
  empName?: string;
  startdate?: string;
  approveDate?: string;

  constructor(data: Partial<WorkingsModel>, translateService: TranslateService) {
    super(data, translateService);
    this.position = data.position
      ? new MyPosition(data.position, this.translateService!)
      : undefined;
    this.bu1 = data.bu1
      ? new MyBu1(data.bu1, this.translateService!)
      : data.bu1;
    this.bu2 = data.bu2
      ? new MyBu2(data.bu2, this.translateService!)
      : data.bu2;
    this.bu3 = data.bu3
      ? new MyBu3(data.bu3, this.translateService!)
      : data.bu3;
    this.bu4 = data.bu4
      ? new MyBu4(data.bu4, this.translateService!)
      : data.bu4;
    this.bu5 = data.bu5
      ? new MyBu5(data.bu5, this.translateService!)
      : data.bu5;
    this.bu6 = data.bu6
      ? new MyBu6(data.bu6, this.translateService!)
      : data.bu6;
    this.bu7 = data.bu7
      ? new MyBu7(data.bu7, this.translateService!)
      : data.bu7;
    this.job = data.job
      ? new MyJob(data.job, this.translateService!)
      : data.job;
    this.group = data.group
      ? new MyGroup(data.group, this.translateService!)
      : data.group;
    this.grade = data.grade;
    this.branch = data.branch
      ? new MyBranch(data.branch, this.translateService!)
      : data.branch;
    this.workarea = data.workarea
      ? new MyWorkArea(data.workarea, this.translateService!)
      : data.workarea;
    this.type = data.type
      ? new MyType(data.type, this.translateService!)
      : undefined;
    this.time0 = data.time0
      ? new MyTime0(data.time0, this.translateService!)
      : data.time0;
    this.pl = data.pl ? new MyPl(data.pl, this.translateService!) : data.pl;
    this.employeeId = data.employeeId || '';
    this.fname = data.fname ? data.fname : '';
    this.lname = data.lname ? data.lname : '';
    this.efname = data.efname ? data.efname : '';
    this.elname = data.elname ? data.elname : '';
    this.bossId = data.bossId || '';
    this.telExt = data.telExt || '';
    this.picture = data.picture || '';
    this.firstHiredate = data.firstHiredate ? data.firstHiredate : '';
    this.busNo = data.busNo ? data.busNo : '';
    this.nickname = data?.nickname || '';
    this.empName = data.empName;
    this.startdate = data.startdate;
    this.approveDate = data.approveDate;
    this.costcenter = data.costcenter;
  }

  getFullnameTh(): string {
    if (this.fname) {
      if (this.lname) {
        return this.fname + ' ' + this.lname;
      } else {
        return this.fname;
      }
    } else if (this.lname) {
      return this.lname;
    }
    return '';
  }

  getFullnameEn(): string {
    if (this.efname) {
      if (this.elname) {
        return this.efname + ' ' + this.elname;
      } else {
        return this.efname;
      }
    } else if (this.elname) {
      return this.elname;
    }
    return '';
  }

  getFullname(): string {
    if (this.translateService?.currentLang === 'th') {
      if (this.fname) {
        if (this.lname) {
          return this.fname + ' ' + this.lname;
        } else {
          return this.fname;
        }
      } else if (this.lname) {
        return this.lname;
      }
      return '';
    } else {
      if (this.efname) {
        if (this.elname) {
          return this.efname + ' ' + this.elname;
        } else {
          return this.efname;
        }
      } else if (this.elname) {
        return this.elname;
      }
      return '';
    }
  }

  getPictureUrl(): string {
    // TODO: Use environment when available
    if (this.picture) {
      return '/FileViewer.jsp?uploadfield=memployee.picture&filename=' + this.picture;
    } else {
      return '/FileViewer.jsp?uploadfield=memployee.picture&filename=';
    }
  }
}

