import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { environment } from "src/environments/environment";

export interface BannerModel {
  bannerId: string;
  branchId: string;
  topic_tdesc: string;
  topic_edesc: string;
  message_tdesc: string;
  message_edesc: string;
  bgPic: string;
  logoPic: string;
  link: string;
  status: string;
  preseq: string;
}
export class BannerModel extends BaseModel implements BannerModel {
  bannerId!: string;
  branchId!: string;
  topic_tdesc!: string;
  topic_edesc!: string;
  message_tdesc!: string;
  message_edesc!: string;
  bgPic!: string;
  logoPic!: string;
  link!: string;
  status!: string;
  preseq!: string;

  constructor(data: Partial<BannerModel>, translateService: TranslateService) {
        super(data, translateService);

  }

  getPictureUrl(): string {
    if (this.bgPic) {
      return (
        environment.jbossUrl +
        '/FileViewer.jsp?uploadfield=tbanner.bgpic&filename=' +
        this.bgPic
      );
    } else {
      return '';
    }
  }

  getTopicDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.topic_tdesc
      : this.topic_edesc;
  }

  getDetailDesc(): string {
    return this.translateService.currentLang == 'th'
    ? this.message_tdesc
    : this.message_edesc;
  }
}
