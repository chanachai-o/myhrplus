import { BaseModel, TranslateService } from './base.model';
import { Prefix } from './prefix.model';
import { Zipcode } from './zipcode.model';
import { District } from './district.model';
import { Relation } from './relation.model';
import { Occupation } from './occupation.model';

/**
 * Family model
 */
export interface FamilyModel {
  relation: Relation | undefined;
  prefix: Prefix | undefined;
  fname: string;
  lname: string;
  efname: string;
  elname: string;
  idcard: string;
  birthday: string;
  statMarry: string;
  yearMarry: string;
  statOther: string;
  statStudy: string;
  occupation: Occupation | undefined;
  otherOccupation: string;
  isGuarantor: number;
  isContract: number;
  taddr?: any;
  tvillage: string;
  troomNo: string;
  tfloor: string;
  tmoo: string;
  tsoi: string;
  troad: string;
  tsubdistrict: string;
  eaddr: string;
  evillage: string;
  eroomNo: string;
  efloor: string;
  emoo: string;
  esoi: string;
  eroad: string;
  esubdistrict: string;
  tel: string;
  fax: string;
  guarantydate: string;
  guarantytitle: string;
  age: string;
  workplace: string;
  relations: string;
  status: string;
  zipcode: Zipcode | undefined;
  district: District | undefined;
}

export class MyFamilyModel
  extends BaseModel
  implements FamilyModel, Relation, Prefix
{
  relation: Relation | undefined;
  prefix: Prefix | undefined;
  fname: string = '';
  lname: string = '';
  efname: string = '';
  elname: string = '';
  idcard: string = '';
  birthday: string = '';
  statMarry: string = '';
  yearMarry: string = '';
  statOther: string = '';
  statStudy: string = '';
  occupation: Occupation | undefined;
  otherOccupation: string = '';
  isGuarantor: number = 0;
  isContract: number = 0;
  taddr?: any;
  tvillage: string = '';
  troomNo: string = '';
  tfloor: string = '';
  tmoo: string = '';
  tsoi: string = '';
  troad: string = '';
  tsubdistrict: string = '';
  eaddr: string = '';
  evillage: string = '';
  eroomNo: string = '';
  efloor: string = '';
  emoo: string = '';
  esoi: string = '';
  eroad: string = '';
  esubdistrict: string = '';
  tel: string = '';
  fax: string = '';
  guarantydate: string = '';
  guarantytitle: string = '';
  age: string = '';
  workplace: string = '';
  relations: string = '';
  status: string = '';
  zipcode: Zipcode | undefined;
  district: District | undefined;
  relationId: string = '';
  prefixId: string = '';
  tdesc: string = '';
  edesc: string = '';

  constructor(data: Partial<FamilyModel>, translateService: TranslateService) {
    super(data, translateService);
    this.relation = data.relation;
    this.prefix = data.prefix;
    this.fname = data.fname || '';
    this.lname = data.lname || '';
    this.efname = data.efname || '';
    this.elname = data.elname || '';
    this.idcard = data.idcard || '';
    this.birthday = data.birthday || '';
    this.statMarry = data.statMarry || '';
    this.yearMarry = data.yearMarry || '';
    this.statOther = data.statOther || '';
    this.statStudy = data.statStudy || '';
    this.occupation = data.occupation;
    this.otherOccupation = data.otherOccupation || '';
    this.isGuarantor = data.isGuarantor || 0;
    this.isContract = data.isContract || 0;
    this.taddr = data.taddr;
    this.tvillage = data.tvillage || '';
    this.troomNo = data.troomNo || '';
    this.tfloor = data.tfloor || '';
    this.tmoo = data.tmoo || '';
    this.tsoi = data.tsoi || '';
    this.troad = data.troad || '';
    this.tsubdistrict = data.tsubdistrict || '';
    this.eaddr = data.eaddr || '';
    this.evillage = data.evillage || '';
    this.eroomNo = data.eroomNo || '';
    this.efloor = data.efloor || '';
    this.emoo = data.emoo || '';
    this.esoi = data.esoi || '';
    this.eroad = data.eroad || '';
    this.esubdistrict = data.esubdistrict || '';
    this.tel = data.tel || '';
    this.fax = data.fax || '';
    this.guarantydate = data.guarantydate || '';
    this.guarantytitle = data.guarantytitle || '';
    this.age = data.age || '';
    this.workplace = data.workplace || '';
    this.relations = data.relations || '';
    this.status = data.status || '';
    this.zipcode = data.zipcode;
    this.district = data.district;
    this.relationId = data.relation?.relationId || '';
    this.prefixId = data.prefix?.prefixId || '';
    this.tdesc = data.prefix?.tdesc || '';
    this.edesc = data.prefix?.edesc || '';
  }

  getFullnamePrefix(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.prefix?.tdesc || '') + this.fname + ' ' + this.lname
      : (this.prefix?.edesc || '') + this.efname + ' ' + this.elname;
  }

  getRelation(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.relation?.tdesc || '')
      : (this.relation?.edesc || '');
  }

  getOccupation(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.occupation?.tdesc || '')
      : (this.occupation?.edesc || '');
  }
}

