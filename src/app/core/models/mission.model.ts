import { BaseModel, TranslateService } from './base.model';

/**
 * Mission model
 */
export interface MissionModel {
  missionId?: string;
  tdesc?: string;
  edesc?: string;
  years?: string;
  getMission(): string;
}

export class MyMission extends BaseModel implements MissionModel {
  missionId?: string;
  tdesc?: string;
  edesc?: string;
  years?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.missionId = data.missionId;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.years = data.years;
  }

  getMission(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

