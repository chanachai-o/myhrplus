import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { District, MyDistrict } from "./district.model";
import { MyOccupation, Occupation } from "./occupation.model";
import { Prefix } from './prefix.model';
import { MyRelation, Relation } from "./relation.model";
import { MyZipcode, Zipcode } from "./zipcode.model";

export interface FamilyLists {
  relation?: Relation;
  prefix?: Prefix;
  fname?: string;
  lname?: string;
  efname?: string;
  elname?: string;
  idcard?: string;
  birthday?: string;
  statMarry?: string;
  yearMarry?: string;
  statOther?: string;
  statStudy?: string;
  occupation?: Occupation;
  otherOccupation?: string;
  isGuarantor?: number;
  isContract?: number;
  taddr?: any;
  tvillage?: string;
  troomNo?: string;
  tfloor?: string;
  tmoo?: string;
  tsoi?: string;
  troad?: string;
  tsubdistrict?: string;
  eaddr?: string;
  evillage?: string;
  eroomNo?: string;
  efloor?: string;
  emoo?: string;
  esoi?: string;
  eroad?: string;
  esubdistrict?: string;
  tel?: string;
  fax?: string;
  guarantydate?: string;
  guarantytitle?: string;
  age?: string;
  workplace?: string;
  relations?: string;
  status?: string;
  zipcode?: Zipcode;
  district?: District;
  getDesc?(): string
}


export class MyFamilyLists extends BaseModel implements FamilyLists {
  relation?: Relation;
  prefix?: Prefix;
  fname?: string;
  lname?: string;
  efname?: string;
  elname?: string;
  idcard?: string;
  birthday?: string;
  statMarry?: string;
  yearMarry?: string;
  statOther?: string;
  statStudy?: string;
  occupation?: Occupation;
  otherOccupation?: string;
  isGuarantor?: number;
  isContract?: number;
  taddr?: any;
  tvillage?: string;
  troomNo?: string;
  tfloor?: string;
  tmoo?: string;
  tsoi?: string;
  troad?: string;
  tsubdistrict?: string;
  eaddr?: string;
  evillage?: string;
  eroomNo?: string;
  efloor?: string;
  emoo?: string;
  esoi?: string;
  eroad?: string;
  esubdistrict?: string;
  tel?: string;
  fax?: string;
  guarantydate?: string;
  guarantytitle?: string;
  age?: string;
  workplace?: string;
  relations?: string;
  status?: string;
  zipcode?: Zipcode;
  district?: District;

  constructor(data: Partial<FamilyLists>, translateService: TranslateService) {
    super(data, translateService);
    this.prefix = data.prefix ? new Prefix(data.prefix, this.translateService) : data.prefix;
    this.relation = data.relation ? new MyRelation(this.relation!, this.translateService) : data.relation;
    this.zipcode = data.zipcode ? new MyZipcode(this.zipcode!, this.translateService) : data.zipcode;
    this.district = data.district ? new MyDistrict(this.district!, this.translateService) : data.district;
    this.occupation = data.occupation ? new MyOccupation(this.occupation!, this.translateService) : data.occupation;
  }

  getFullNameDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.fname! + ' ' + this.lname!
      : this.efname! + ' ' + this.elname!;
  }
}


