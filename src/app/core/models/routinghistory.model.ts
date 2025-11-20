import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

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
  
    constructor(data: Partial<any>, translateService: TranslateService) {
      super(data, translateService);
    }

    getFullname() : string{
      return this.translateService.currentLang == 'th'
      ? this.fullName_tdesc!
      : this.fullName_edesc!;
    }

    getPosition() : string{
        return this.translateService.currentLang == 'th'
        ? this.position_tdesc!
        : this.position_edesc!;
      }
  }