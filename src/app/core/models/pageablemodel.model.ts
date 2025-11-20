import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
import { MySortModel, SortModel } from './sortmodel.model';

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

function getDataModel(data: any): any {
  return data ? data : {}
}

export interface PageableModel {
  offset: string
  pageNumber: string
  pageSize: string
  paged: string
  unpaged: string
  sort: SortModel
}
export class MyPageableModel extends BaseModel implements PageableModel {
  offset: string
  pageNumber: string
  pageSize: string
  paged: string
  unpaged: string
  sort: SortModel
  constructor(data: Partial<PageableModel>, translateService: TranslateService) {
    super(data, translateService)
    this.offset = getDataString(data.offset)
    this.pageNumber = getDataString(data.pageNumber)
    this.pageSize = getDataString(data.pageSize)
    this.paged = getDataString(data.paged)
    this.unpaged = getDataString(data.unpaged)
    this.sort = new MySortModel(getDataModel(data.sort), translateService)
  }
}