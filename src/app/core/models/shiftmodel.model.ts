import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface ShiftModel {
  time0id?: string;
  tdesc: string | undefined;
  edesc: string | undefined;
  status?: string;
  getDesc?(): string;
}

export class MyShiftModel extends BaseModel implements ShiftModel {
  tdesc: string | undefined;
  edesc: string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
      super(data, translateService);
  }

  getDesc(): string {
      return this.translateService.currentLang == 'th'
          ? this.tdesc!
          : this.edesc!;
  }
}
