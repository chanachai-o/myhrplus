import { BaseModel, TranslateService, baseGetName, checkData } from './base.model';
import { CrsCategory } from './crs-category.model';
import { CrsGroup } from './crs-group.model';
import { CrsType } from './crs-type.model';

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
}

export class Course extends BaseModel implements Course {
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

  constructor(data?: Partial<Course>, translateService?: TranslateService) {
    super(data, translateService);
    this.courseId = checkData(data?.courseId) ?? undefined;
    this.tdesc = checkData(data?.tdesc) ?? undefined;
    this.edesc = checkData(data?.edesc) ?? undefined;
    this.detail = checkData(data?.detail) ?? undefined;
    this.objective = checkData(data?.objective) ?? undefined;
    this.editorial = checkData(data?.editorial) ?? undefined;
    this.crsKind = checkData(data?.crsKind) ?? undefined;
    this.preCrs = checkData(data?.preCrs) ?? undefined;
    this.every = checkData(data?.every) ?? undefined;
    this.frequencyEvery = checkData(data?.frequencyEvery) ?? undefined;
    this.crsCategory = data?.crsCategory
      ? new CrsCategory(data.crsCategory, this.translateService!)
      : undefined;
    this.crsGroup = data?.crsGroup
      ? new CrsGroup(data.crsGroup, this.translateService!)
      : undefined;
    this.crsType = data?.crsType
      ? new CrsType(data.crsType, this.translateService!)
      : undefined;
  }

  /**
   * Get name/description based on current language
   */
  getName(): string | null {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }

  /**
   * @deprecated Use getName() instead for consistency
   */
  getCourseDesc(): string {
    return this.getName() ?? '';
  }
}

