import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface OldEmpPosition {
  positionId?: string;
  tdesc: string;
  edesc: string;
  consolidate?: any;
  shortName?: any;
  sortNumber?: number;
  getDesc?(): string;
}

export class MyOldEmpPosition extends BaseModel implements OldEmpPosition {
  tdesc: string = "";
  edesc: string = "";

  constructor(data: Partial<any>, translateService: TranslateService) {
      super(data, translateService);
  }

  getDesc(): string {
      return this.translateService.currentLang == 'th'
          ? this.tdesc
          : this.edesc;
  }
}
