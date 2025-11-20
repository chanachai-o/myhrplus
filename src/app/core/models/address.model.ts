import { BaseModel, TranslateService } from './base.model';
import { District } from './district.model';
import { Province } from './province.model';
import { Zipcode } from './zipcode.model';

/**
 * Address model
 */
export interface AddressModel {
  line_no?: string;
  addr_current?: string;
  tvillage?: string;
  evillage?: string;
  taddr?: string;
  eaddr?: string;
  troad?: string;
  eroad?: string;
  troom_no?: string;
  eroom_no?: string;
  tsoi?: string;
  esoi?: string;
  district?: District;
  zipcode?: Zipcode;
  tfloor?: string;
  efloor?: string;
  tmoo?: string;
  emoo?: string;
  tsubdistrict?: string;
  esubdistrict?: string;
}

export class MyAddressModel
  extends BaseModel
  implements AddressModel, District, Province, Zipcode
{
  tvillage?: string;
  evillage?: string;
  taddr?: string;
  eaddr?: string;
  troad?: string;
  eroad?: string;
  troom_no?: string;
  eroom_no?: string;
  tsoi?: string;
  esoi?: string;
  tfloor?: string;
  efloor?: string;
  tmoo?: string;
  emoo?: string;
  district?: District;
  longTname: string = '';
  longEname: string = '';
  zipcode?: Zipcode;
  province?: any;
  tsubdistrict?: string;
  esubdistrict?: string;
  line_no?: string;
  addr_current?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.line_no = data.line_no;
    this.addr_current = data.addr_current;
    this.tvillage = data.tvillage;
    this.evillage = data.evillage;
    this.taddr = data.taddr;
    this.eaddr = data.eaddr;
    this.troad = data.troad;
    this.eroad = data.eroad;
    this.troom_no = data.troom_no;
    this.eroom_no = data.eroom_no;
    this.tsoi = data.tsoi;
    this.esoi = data.esoi;
    this.district = data.district;
    this.zipcode = data.zipcode;
    this.tfloor = data.tfloor;
    this.efloor = data.efloor;
    this.tmoo = data.tmoo;
    this.emoo = data.emoo;
    this.province = data.province;
    this.tsubdistrict = data.tsubdistrict;
    this.esubdistrict = data.esubdistrict;
    this.longTname = data.longTname || '';
    this.longEname = data.longEname || '';
  }

  ThEnVillage(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tvillage || '')
      : (this.evillage || '');
  }

  ThEnAddr(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.taddr || '')
      : (this.eaddr || '');
  }

  ThEnRoad(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.troad || '')
      : (this.eroad || '');
  }

  ThEnRoom(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.troom_no || '')
      : (this.eroom_no || '');
  }

  ThEnSoi(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tsoi || '')
      : (this.esoi || '');
  }

  ThEnFloor(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tfloor || '')
      : (this.efloor || '');
  }

  ThEnMoo(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tmoo || '')
      : (this.emoo || '');
  }

  ThEnDesc() {
    return this.translateService?.currentLang === 'th'
      ? this.district?.tdesc
      : this.district?.edesc;
  }

  ThEnLongname() {
    return this.translateService?.currentLang === 'th'
      ? this.district?.province?.longTname
      : this.district?.province?.longEname;
  }

  ThEnSubDis() {
    return this.translateService?.currentLang === 'th'
      ? this.tsubdistrict
      : this.esubdistrict;
  }
}

