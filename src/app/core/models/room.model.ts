import { BaseModel, TranslateService } from './base.model';

/**
 * Room model
 */
export interface Room {
  roomId?: string;
  locationId?: string;
  tdesc?: string;
  edesc?: string;
  photo?: string;
  getRoomDesc(): string;
}

export class MyRoom extends BaseModel implements Room {
  tdesc: string | undefined;
  edesc: string | undefined;
  roomId?: string;
  locationId?: string;
  photo?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.roomId = data.roomId;
    this.locationId = data.locationId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.photo = data.photo;
  }

  getRoomDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

