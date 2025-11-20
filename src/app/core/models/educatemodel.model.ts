import { Background } from './background.model';
import { Degree } from './degree.model';
import { Faculty } from './faculty.model';
import { Country } from './country.model';
import { Major } from './major.model';
import { Institue } from './institue.model';
import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';

export interface EducateModel {
  educIndex?: number;
  degree: Degree | undefined;
  country: Country | undefined;
  faculty: Faculty | undefined;
  major: Major | undefined;
  gpa?: string;
  institue: Institue | undefined;
  background: Background | undefined;
  honourably?: string;
  otherInstitue?: string;
  otherFaculty?: string;
  otherMajorid?: string;
  yearStart?: string;
  yearEnd?: string;
}

export class MyEducateModel extends BaseModel implements EducateModel, Degree {
  degree: Degree | undefined;
  country: Country | undefined;
  faculty: Faculty | undefined;
  major: Major | undefined;
  gpa: string = "";
  institue: Institue | undefined;
  background: Background | undefined;
  yearStart: string = "";
  yearEnd: string = "";
 

  //----degree
  tdesc: string = "";
  edesc: string = "";

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.yearStart = data.yearStart;
    this.yearEnd = data.yearEnd;
    this.gpa = data.gpa;
  }
  ThEnDegree(): string {
    return this.translateService.currentLang == 'th'
      ? this.degree?.tdesc!
      : this.degree?.edesc!;
  }
  ThEnCountry(): string {
    return this.translateService.currentLang == 'th'
    ? this.country?.tdesc!
    : this.country?.edesc!;
  }
  ThEnFaculty(): string {
    return this.translateService.currentLang == 'th'
    ? this.faculty?.tdesc!
    : this.faculty?.edesc!;
  }
  ThEnMajor(): string {
    return this.translateService.currentLang == 'th'
    ? this.major?.tdesc!
    : this.major?.edesc!;
  }
  ThEnInstitue(): string {
    return this.translateService.currentLang == 'th'
    ? this.institue?.tdesc!
    : this.institue?.edesc!;
  }
  ThEnBackground(): string {
    return this.translateService.currentLang == 'th'
    ? this.background?.tdesc!
    : this.background?.edesc!;
  }
}
