import { BaseModel, TranslateService } from './base.model';

/**
 * Role model
 */
export interface Role {
  roleId: string;
  passwordSpecial: number;
  passwordNumber: number;
  passwordStr: number;
  passwordMin: number;
  passwordMax: number;
  passwordStrsm: number;
  tdesc: string;
  edesc: string;
}

export class MyRole extends BaseModel implements Role {
  roleId: string = '';
  passwordSpecial: number = 0;
  passwordNumber: number = 0;
  passwordStr: number = 0;
  passwordMin: number = 0;
  passwordMax: number = 0;
  passwordStrsm: number = 0;
  tdesc: string = '';
  edesc: string = '';

  constructor(data: Partial<Role>, translateService: TranslateService) {
    super(data, translateService);
    this.roleId = data.roleId || '';
    this.passwordSpecial = data.passwordSpecial || 0;
    this.passwordNumber = data.passwordNumber || 0;
    this.passwordStr = data.passwordStr || 0;
    this.passwordMin = data.passwordMin || 0;
    this.passwordMax = data.passwordMax || 0;
    this.passwordStrsm = data.passwordStrsm || 0;
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }
}

