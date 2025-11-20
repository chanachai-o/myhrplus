import { BaseModel, TranslateService } from './base.model';

// TODO: Import File model when migrated
// import { File, MyFile } from './file.model';

/**
 * Policy model
 */
export interface Policy {
  procgrpid?: string;
  proceduretypeid?: string;
  profileid?: string;
  group_tdesc?: string;
  group_edesc?: string;
  type_tdesc?: string;
  type_edesc?: string;
  topictdesc?: string;
  topicedesc?: string;
  isdisplay?: string;
  announcer?: string;
  announcename?: string;
  announcedate?: string;
  companyid?: any;
  group_sort?: any;
  type_sort?: any;
  fileName?: any;
  fileDesc?: any;
  file?: any[]; // TODO: use File[] type
  getGroupDesc?(): string;
  getTypeDesc?(): string;
  getTopicDesc?(): string;
}

export class MyPolicy extends BaseModel implements Policy {
  procgrpid: string = '';
  proceduretypeid: string = '';
  profileid: string = '';
  group_tdesc: string = '';
  group_edesc: string = '';
  type_tdesc: string = '';
  type_edesc: string = '';
  topictdesc: string = '';
  topicedesc: string = '';
  isdisplay: string = '';
  announcer: string = '';
  announcename: string = '';
  announcedate: string = '';
  companyid?: any;
  group_sort?: any;
  type_sort?: any;
  fileName?: any;
  fileDesc?: any;
  file: any[] | undefined; // TODO: use File[] type

  constructor(data: Partial<Policy>, translateService: TranslateService) {
    super(data, translateService);
    // TODO: this.file = data.file?.map(e => new MyFile(e, this.translateService));
    this.file = data.file;
    this.procgrpid = data.procgrpid || '';
    this.proceduretypeid = data.proceduretypeid || '';
    this.profileid = data.profileid || '';
    this.group_tdesc = data.group_tdesc || '';
    this.group_edesc = data.group_edesc || '';
    this.type_tdesc = data.type_tdesc || '';
    this.type_edesc = data.type_edesc || '';
    this.topictdesc = data.topictdesc || '';
    this.topicedesc = data.topicedesc || '';
    this.isdisplay = data.isdisplay || '';
    this.announcer = data.announcer || '';
    this.announcename = data.announcename || '';
    this.announcedate = data.announcedate || '';
    this.companyid = data.companyid;
    this.group_sort = data.group_sort;
    this.type_sort = data.type_sort;
    this.fileName = data.fileName;
    this.fileDesc = data.fileDesc;
  }

  getGroupDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.group_tdesc
      : this.group_edesc;
  }

  getTypeDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.type_tdesc
      : this.type_edesc;
  }

  getTopicDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? this.topictdesc
      : this.topicedesc;
  }
}

