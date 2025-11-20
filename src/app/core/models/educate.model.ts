import { BaseModel, TranslateService } from './base.model';
import { Background, MyBackground } from './background.model';
import { Degree, MyDegree } from './degree.model';
import { Faculty, MyFaculty } from './faculty.model';
import { Country, MyCountry } from './country.model';
import { Major, MyMajor } from './major.model';
import { Institue, MyInstitue } from './institute.model';

/**
 * Educate model
 */
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
  ThEnDegree?(): string;
  ThEnCountry?(): string;
  ThEnFaculty?(): string;
  ThEnMajor?(): string;
  ThEnInstitue?(): string;
  ThEnBackground?(): string;
}

export class MyEducateModel extends BaseModel implements EducateModel, Degree {
  degree: Degree | undefined;
  country: Country | undefined;
  faculty: Faculty | undefined;
  major: Major | undefined;
  gpa: string = '';
  institue: Institue | undefined;
  background: Background | undefined;
  yearStart: string = '';
  yearEnd: string = '';
  educIndex?: number;
  honourably?: string;
  otherInstitue?: string;
  otherFaculty?: string;
  otherMajorid?: string;
  tdesc: string = '';
  edesc: string = '';

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.educIndex = data.educIndex;
    this.degree = data.degree;
    this.country = data.country;
    this.faculty = data.faculty;
    this.major = data.major;
    this.institue = data.institue;
    this.background = data.background;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
    this.yearStart = data.yearStart || '';
    this.yearEnd = data.yearEnd || '';
    this.gpa = data.gpa || '';
    this.honourably = data.honourably;
    this.otherInstitue = data.otherInstitue;
    this.otherFaculty = data.otherFaculty;
    this.otherMajorid = data.otherMajorid;
  }

  ThEnDegree(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.degree?.tdesc || '')
      : (this.degree?.edesc || '');
  }

  ThEnCountry(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.country?.tdesc || '')
      : (this.country?.edesc || '');
  }

  ThEnFaculty(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.faculty?.tdesc || '')
      : (this.faculty?.edesc || '');
  }

  ThEnMajor(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.major?.tdesc || '')
      : (this.major?.edesc || '');
  }

  ThEnInstitue(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.institue?.tdesc || '')
      : (this.institue?.edesc || '');
  }

  ThEnBackground(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.background?.tdesc || '')
      : (this.background?.edesc || '');
  }
}

