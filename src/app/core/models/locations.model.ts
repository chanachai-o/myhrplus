import { BaseModel, TranslateService } from './base.model';

/**
 * Locations model
 */
export interface Locations {
  locationId?: string;
  tdesc?: string;
  edesc?: string;
  photo?: string;
  getLocationDesc(): string;
}

export class MyLocations extends BaseModel implements Locations {
  tdesc: string | undefined;
  edesc: string | undefined;
  locationId?: string;
  photo?: string;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.locationId = data.locationId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.photo = data.photo;
  }

  getLocationDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

