import { Country } from "./country.model";
import { Degree } from "./degree.model";
import { Major } from "./major.model";
import { Faculty } from "./faculty.model";
import { Institue } from "./institue.model";
import { Background } from "./background.model";
import { BaseModel } from './base.model';
import { TranslateService } from '@ngx-translate/core';



export interface experienceModel {
  educIndex?: number;
  degree?: Degree;
  country?: Country;
  faculty?: Faculty;
  major?: Major;
  gpa?: string;
  institue?: Institue;
  background?: Background;
  honourably?: string;
  otherInstitue?: string;
  otherFaculty?: string;
  otherMajorid?: string;
}




