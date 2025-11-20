import { BaseModel, TranslateService } from './base.model';

/**
 * File model
 */
export interface File {
  tdesc?: string;
  fileName?: string;
}

export class MyFile extends BaseModel implements File {
  tdesc: string = '';
  fileName: string = '';

  constructor(data: Partial<File>, tranSer: TranslateService) {
    super(data, tranSer);
    this.tdesc = data.tdesc || '';
    this.fileName = data.fileName || '';
  }
}

