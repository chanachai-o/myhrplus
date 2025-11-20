import { BaseModel, TranslateService } from './base.model';

/**
 * Status working time model
 */
export interface StatsuWorkingTimeModel {
  statusCode: string;
  tdesc: string;
  edesc: string;
}

export class StatsuWorkingTimeModel
  extends BaseModel
  implements StatsuWorkingTimeModel
{
  statusCode: string;
  tdesc: string;
  edesc: string;

  constructor(
    data: Partial<StatsuWorkingTimeModel>,
    translateService?: TranslateService
  ) {
    super(data!, translateService!);
    this.statusCode = data.statusCode || '';
    this.tdesc = data.tdesc || '';
    this.edesc = data.edesc || '';
  }
}

