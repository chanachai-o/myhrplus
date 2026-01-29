import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services';
import { AssetTypeModel } from '../models/asset-type.model';

@Injectable({
  providedIn: 'root'
})
export class AssetTypeService extends BaseApiService<AssetTypeModel> {
  protected baseUrl = 'hr/master/asset-type';
}


