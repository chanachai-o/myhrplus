import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
import { NationalModel, MyNationalModel } from './national.model';
import { Nationality, MyNationality } from './nationality.model';
import { Prefix } from './prefix.model';
import { environment } from '../../environments/environment';
import { MyPosition, Position } from './position.model';
import { MyReligionModel, ReligionModel } from './religion.model';

export interface EmployeeProfileModel {
  employeeId?: string;
  prefix?: Prefix;
  fname?: string;
  lname?: string;
  efname?: string;
  elname?: string;
  birthDate?: string;
  idPeople?: string;
  height?: string;
  weight?: string;
  blood?: string;
  national?: NationalModel;
  nationality?: Nationality;
  religion?: ReligionModel;
  sex?: string;
  email?: string;
  picture?: string;
  idexpdate?: string;
  passport_no?: string;
  passport_expire_date?: string;
  position?: Position;
  mobile?: string;
  waistSize?: string;
  shirtSize?: string;
  hairColor?: string;
  eyeColor?: string;
  nickname?: string;
  firstHiredate?: string;
  age?: { year: number, month: number, day: number };
  telNo?: string;
  status?: {
    edesc: string,
    statusCode: string,
    tdesc: string,
  }
  getFullname?(): string;
  getFullnameEN?(): string;
  getFullnameTH?(): string;
  getPictureUrl?(): string;
  getAge?(): string;
  getStatus?(): string;
}
export class MyEmployeeProfileModel extends BaseModel
  implements EmployeeProfileModel, NationalModel, Nationality {
  employeeId?: string;
  prefix?: Prefix;
  fname?: string;
  lname?: string;
  efname?: string;
  elname?: string;
  birthDate?: string;
  idPeople?: string;
  height?: string;
  weight?: string;
  blood?: string;
  national?: NationalModel;
  nationality?: Nationality;
  religion?: ReligionModel | undefined;
  sex?: string;
  email?: string;

  nationalId: string = "";
  nationalityId: string = "";
  tdesc: string = "";
  edesc: string = "";
  passport_no?: string;
  passport_expire_date?: string;
  picture?: string;
  position?: Position;
  waistSize?: string;
  firstHiredate?: string;
  age?: { year: number, month: number, day: number };
  status?: {
    edesc: string,
    statusCode: string,
    tdesc: string,
  }

  constructor(data: Partial<EmployeeProfileModel>, translateService: TranslateService) {
    super(data, translateService);
    this.position = new MyPosition(this.position!, this.translateService);
    this.national = new MyNationalModel(this.national!, this.translateService);
    this.nationality = new MyNationality(this.nationality!, this.translateService);
    this.religion = new MyReligionModel(this.religion!, this.translateService);
    this.firstHiredate = data.firstHiredate?data.firstHiredate : ''
  }

  getFullname(): string {
    return this.translateService.currentLang == 'th'
      ? this.fname + ' ' + this.lname
      : this.efname + ' ' + this.elname;
  }
  getFullnameEN(): string {
    return this.prefix?.edesc! + this.efname + ' ' + this.elname;
  }
  getFullnameTH(): string {
    return this.prefix?.tdesc! + this.fname + ' ' + this.lname;
  }
  getPictureUrl(): string {
    if (this.picture) {
      return environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.picture&filename=" + this.picture;
    } else {
      return "";
    }
  }
  getAge(): string {
    return this.translateService.currentLang == 'th'
      ? this.age?.year + ' ปี ' + this.age?.month + ' เดือน ' + this.age?.day + ' วัน'
      : this.age?.year + ' years ' + this.age?.month + ' months and ' + this.age?.day + ' days';
  }
  getStatus(): string {
    return this.translateService.currentLang == 'th'
      ? this.status?.tdesc!
      : this.status?.edesc!
  }
}
