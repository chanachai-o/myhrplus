import { BaseModel, TranslateService } from './base.model';

/**
 * Routing history model
 */
export interface RoutingHistory {
  fullName_tdesc?: string;
  fullName_edesc?: string;
  position?: string;
  position_tdesc?: string;
  position_edesc?: string;
  startTime?: string;
  completionTime?: string;
  action?: string;
  comments?: string;
  getFullname?(): string;
  getPosition?(): string;
}

export class MyRoutingHistory extends BaseModel implements RoutingHistory {
  fullName_tdesc?: string | undefined;
  fullName_edesc?: string | undefined;
  position_tdesc?: string | undefined;
  position_edesc?: string | undefined;
  position?: string;
  startTime?: string;
  completionTime?: string;
  action?: string;
  comments?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.fullName_tdesc = data.fullName_tdesc;
    this.fullName_edesc = data.fullName_edesc;
    this.position = data.position;
    this.position_tdesc = data.position_tdesc;
    this.position_edesc = data.position_edesc;
    this.startTime = data.startTime;
    this.completionTime = data.completionTime;
    this.action = data.action;
    this.comments = data.comments;
  }

  getFullname(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.fullName_tdesc || '')
      : (this.fullName_edesc || '');
  }

  getPosition(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.position_tdesc || '')
      : (this.position_edesc || '');
  }
}

