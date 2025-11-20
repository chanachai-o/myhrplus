import { BaseModel, TranslateService } from './base.model';
import { CrsCategory, MyCrsCategory } from './crs-category.model';
import { CrsGroup, MyCrsGroup } from './crs-group.model';
import { CrsType, MyCrsType } from './crs-type.model';

/**
 * Course model
 */
export interface Course {
  courseId?: string;
  tdesc?: string;
  edesc?: string;
  detail?: string;
  objective?: string;
  editorial?: string;
  crsKind?: string;
  preCrs?: string;
  every?: string;
  frequencyEvery?: string;
  crsCategory?: CrsCategory;
  crsGroup?: CrsGroup;
  crsType?: CrsType;
  getCourseDesc(): string;
}

export class MyCourse extends BaseModel implements Course {
  tdesc: string | undefined;
  edesc: string | undefined;
  courseId?: string;
  detail?: string;
  objective?: string;
  editorial?: string;
  crsKind?: string;
  preCrs?: string;
  every?: string;
  frequencyEvery?: string;
  crsCategory?: CrsCategory;
  crsGroup?: CrsGroup;
  crsType?: CrsType;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.courseId = data.courseId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.detail = data.detail;
    this.objective = data.objective;
    this.editorial = data.editorial;
    this.crsKind = data.crsKind;
    this.preCrs = data.preCrs;
    this.every = data.every;
    this.frequencyEvery = data.frequencyEvery;
    this.crsCategory = data.crsCategory
      ? new MyCrsCategory(data.crsCategory, this.translateService!)
      : undefined;
    this.crsGroup = data.crsGroup
      ? new MyCrsGroup(data.crsGroup, this.translateService!)
      : undefined;
    this.crsType = data.crsType
      ? new MyCrsType(data.crsType, this.translateService!)
      : undefined;
  }

  getCourseDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

