import { BaseModel, TranslateService } from './base.model';

/**
 * Send to model
 */
export interface SendTo {
  employeeId?: string;
  fullName?: string;
  thaFullName: string | undefined;
  engFullName: string | undefined;
  getFullname(): string;
}

export class MySendTo extends BaseModel implements SendTo {
  thaFullName: string | undefined;
  engFullName: string | undefined;
  employeeId?: string;
  fullName?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.thaFullName = data.thaFullName;
    this.engFullName = data.engFullName;
    this.employeeId = data.employeeId;
    this.fullName = data.fullName;
  }

  getFullname(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.thaFullName || '')
      : (this.engFullName || '');
  }
}

