import { BaseModel, TranslateService } from './base.model';
import { Branch, MyBranch } from './branch.model';
import { Bu1, MyBu1 } from './bu1.model';
import { Bu2, MyBu2 } from './bu2.model';
import { Bu3, MyBu3 } from './bu3.model';
import { Bu4, MyBu4 } from './bu4.model';
import { Bu5, MyBu5 } from './bu5.model';
import { Bu6, MyBu6 } from './bu6.model';
import { Bu7, MyBu7 } from './bu7.model';
import { MyPosition, Position } from './position.model';

/**
 * Job model
 */
export interface Job {
  jobcodeId?: string;
  tdesc?: string;
  edesc?: string;
  jobcodeLevel?: string;
  age0?: number;
  age1?: number;
  experience?: string;
  responsibility?: string;
  qualification?: string;
  position?: Position;
  bu1?: Bu1;
  bu2?: Bu2;
  bu3?: Bu3;
  bu4?: Bu4;
  bu5?: Bu5;
  bu6?: Bu6;
  bu7?: Bu7;
  branch?: Branch;
  eexperience?: string;
  eresponsibility?: string;
  equalification?: string;
  getJobDesc?(): string;
}

export class MyJob extends BaseModel implements Job {
  jobcodeId?: string;
  tdesc?: string;
  edesc?: string;
  jobcodeLevel?: string;
  age0?: number;
  age1?: number;
  experience?: string;
  responsibility?: string;
  qualification?: string;
  position?: Position;
  bu1?: Bu1;
  bu2?: Bu2;
  bu3?: Bu3;
  bu4?: Bu4;
  bu5?: Bu5;
  bu6?: Bu6;
  bu7?: Bu7;
  branch?: Branch;
  eexperience?: string;
  eresponsibility?: string;
  equalification?: string;

  constructor(data: Partial<Job>, translateService?: TranslateService) {
    super(data, translateService);
    this.position = data.position ? new MyPosition(data.position, this.translateService!) : data.position;
    this.bu1 = data.bu1 ? new MyBu1(data.bu1, this.translateService!) : data.bu1;
    this.bu2 = data.bu2 ? new MyBu2(data.bu2, this.translateService!) : data.bu2;
    this.bu3 = data.bu3 ? new MyBu3(data.bu3, this.translateService!) : data.bu3;
    this.bu4 = data.bu4 ? new MyBu4(data.bu4, this.translateService!) : data.bu4;
    this.bu5 = data.bu5 ? new MyBu5(data.bu5, this.translateService!) : data.bu5;
    this.bu6 = data.bu6 ? new MyBu6(data.bu6, this.translateService!) : data.bu6;
    this.bu7 = data.bu7 ? new MyBu7(data.bu7, this.translateService!) : data.bu7;
    this.branch = data.branch ? new MyBranch(data.branch, this.translateService!) : data.branch;
    this.jobcodeId = data.jobcodeId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.jobcodeLevel = data.jobcodeLevel;
    this.age0 = data.age0;
    this.age1 = data.age1;
    this.experience = data.experience;
    this.responsibility = data.responsibility;
    this.qualification = data.qualification;
    this.eexperience = data.eexperience;
    this.eresponsibility = data.eresponsibility;
    this.equalification = data.equalification;
  }

  getJobDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

