import { Bu1, MyBu1 } from './bu1.model';
import { Bu2, MyBu2 } from './bu2.model';
import { Bu3, MyBu3 } from './bu3.model';
import { Bu4, MyBu4 } from './bu4.model';
import { Bu5, MyBu5 } from './bu5.model';
import { Bu6, MyBu6 } from './bu6.model';
import { Bu7, MyBu7 } from './bu7.model';
import { MyWorkArea, WorkArea } from './workarea.model';
import { MyPosition, Position } from './position.model';
import { Job, MyJob } from './job.model';
import { MyType, Type } from './type.model';
import { Group, MyGroup } from './group.model';
import { Costcenter, MyCostcenter } from './costcenter.model';
import { MyTime0, Time0 } from './time0.model';
import { Branch, MyBranch } from './branch.model';
import { MyStatus, Status } from './status.model';
import { BaseModel, TranslateService } from './base.model';
import { MyPrefix, Prefix } from './prefix.model';
import { MyPl, Pl } from './pl.model';
import { environment } from '../../../environments/environment';

/**
 * Salary type model
 */
export interface Salatype {
  codeId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;
  getDesc?(): string;
}

export class MySalatype extends BaseModel implements Salatype {
  codeId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<Salatype>, translateService: TranslateService) {
    super(data, translateService);
    this.codeId = data.codeId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

/**
 * Employee model
 */
export interface Employee {
  employeeId?: string;
  prefix?: Prefix;
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
  job?: Job;
  type?: Type;
  group?: Group;
  costcenter?: Costcenter;
  bossId?: string;
  time0?: Time0;
  branch?: Branch;
  telExt?: string;
  status?: Status;
  startDate?: string;
  picture?: string;
  firstHiredate?: string;
  approveDate?: string;
  email?: string;
  salatype?: Salatype;
  proDate?: string;
  proEvery?: string;
  alien?: string;
  effBranch?: string;
  effJob?: string;
  effPosition?: string;
  effSalatype?: string;
  subgrade?: string;
  grade?: any;
  pl?: Pl;
  getFullname?(): string;
  getPictureUrl?(): string;
}

export class MyEmployee extends BaseModel implements Employee {
  prefix: Prefix | undefined;
  fname: string = '';
  lname: string = '';
  efname: string = '';
  elname: string = '';
  bu1?: Bu1;
  bu2?: Bu2;
  bu3?: Bu3;
  bu4?: Bu4;
  bu5?: Bu5;
  bu6?: Bu6;
  bu7?: Bu7;
  workarea?: WorkArea;
  position?: Position;
  job?: Job;
  type?: Type;
  group?: Group;
  costcenter?: Costcenter;
  time0?: Time0;
  branch?: Branch;
  status?: Status;
  picture?: string;
  salatype?: Salatype;
  subgrade: string = '';
  grade?: any = null;
  pl?: Pl;
  employeeId?: string;
  bossId?: string;
  telExt?: string;
  startDate?: string;
  firstHiredate?: string;
  approveDate?: string;
  email?: string;
  proDate?: string;
  proEvery?: string;
  alien?: string;
  effBranch?: string;
  effJob?: string;
  effPosition?: string;
  effSalatype?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.bu1 = data.bu1 ? new MyBu1(data.bu1, this.translateService!) : data.bu1;
    this.bu2 = data.bu2 ? new MyBu2(data.bu2, this.translateService!) : data.bu2;
    this.bu3 = data.bu3 ? new MyBu3(data.bu3, this.translateService!) : data.bu3;
    this.bu4 = data.bu4 ? new MyBu4(data.bu4, this.translateService!) : data.bu4;
    this.bu5 = data.bu5 ? new MyBu5(data.bu5, this.translateService!) : data.bu5;
    this.bu6 = data.bu6 ? new MyBu6(data.bu6, this.translateService!) : data.bu6;
    this.bu7 = data.bu7 ? new MyBu7(data.bu7, this.translateService!) : data.bu7;
    this.workarea = data.workarea ? new MyWorkArea(data.workarea, this.translateService!) : data.workarea;
    this.position = data.position ? new MyPosition(data.position, this.translateService!) : data.position;
    this.job = data.job ? new MyJob(data.job, this.translateService!) : data.job;
    this.type = data.type ? new MyType(data.type, this.translateService!) : data.type;
    this.group = data.group ? new MyGroup(data.group, this.translateService!) : data.group;
    this.costcenter = data.costcenter ? new MyCostcenter(data.costcenter, this.translateService!) : data.costcenter;
    this.time0 = data.time0 ? new MyTime0(data.time0, this.translateService!) : data.time0;
    this.branch = data.branch ? new MyBranch(data.branch, this.translateService!) : data.branch;
    this.status = data.status ? new MyStatus(data.status, this.translateService!) : data.status;
    this.prefix = data.prefix ? new MyPrefix(data.prefix, this.translateService!) : data.prefix;
    this.salatype = data.salatype ? new MySalatype(data.salatype, this.translateService!) : data.salatype;
    this.fname = data.fname || '';
    this.lname = data.lname || '';
    this.efname = data.efname || '';
    this.elname = data.elname || '';
    this.subgrade = data.subgrade || '';
    this.grade = data.grade;
    this.pl = data.pl ? new MyPl(data.pl, this.translateService!) : data.pl;
    this.employeeId = data.employeeId;
    this.bossId = data.bossId;
    this.telExt = data.telExt;
    this.startDate = data.startDate;
    this.picture = data.picture;
    this.firstHiredate = data.firstHiredate;
    this.approveDate = data.approveDate;
    this.email = data.email;
    this.proDate = data.proDate;
    this.proEvery = data.proEvery;
    this.alien = data.alien;
    this.effBranch = data.effBranch;
    this.effJob = data.effJob;
    this.effPosition = data.effPosition;
    this.effSalatype = data.effSalatype;
  }

  getFullname(): string {
    let fullName = '';
    let efullName = '';
    if (this.fname) {
      fullName = this.fname;
      if (this.lname) {
        fullName = fullName + ' ' + this.lname;
      }
    } else if (this.lname) {
      fullName = this.lname;
    }
    if (this.efname) {
      efullName = this.efname;
      if (this.elname) {
        efullName = efullName + ' ' + this.elname;
      }
    } else if (this.elname) {
      efullName = this.elname;
    }
    return this.translateService?.currentLang === 'th' ? fullName : efullName;
  }

  getPictureUrl(): string {
    if (this.picture) {
      return `${environment.jbossUrl}/FileViewer.jsp?uploadfield=memployee.picture&filename=${this.picture}`;
    } else {
      return '';
    }
  }
}

