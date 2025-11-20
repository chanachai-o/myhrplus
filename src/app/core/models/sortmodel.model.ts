import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface SortModel {
  sorted: string
  unsorted: string
  empty: string
}
export class MySortModel extends BaseModel implements SortModel {
  sorted: string
  unsorted: string
  empty: string
  constructor(data: Partial<SortModel>, translateService: TranslateService) {
    super(data, translateService)
    this.sorted = getDataString(data.sorted)
    this.unsorted = getDataString(data.unsorted)
    this.empty = getDataString(data.empty)
  }
}