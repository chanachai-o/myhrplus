import { Degree } from "./degree.model";
import { Country } from "./country.model";
import { Faculty } from "./faculty.model";
import { Major } from "./major.model";
import { Institue } from "./institue.model";
import { Background } from "./background.model";

export interface ProvidentModel {
  educIndex: number;
  degree: Degree;
  country: Country;
  faculty: Faculty;
  major: Major;
  gpa: string;
  institue: Institue;
  background: Background;
  honourably: string;
  otherInstitue: string;
  otherFaculty: string;
  otherMajorid: string;
}
