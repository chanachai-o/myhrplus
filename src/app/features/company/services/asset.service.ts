import { Injectable, inject, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { AssetModel } from '../models/asset.model';
import { AssetTypeService } from './asset-type.service';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService extends BaseApiService<AssetModel> {
  protected baseUrl = 'hr/company/asset';
  private assetTypeService = inject(AssetTypeService);

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<AssetModel[]> {
    this.loading.set(true);
    return this.http.get<AssetModel[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  // Helper for AssetModel Type Dropdown using the dedicated service
  getAssetModelTypeOptions() {
    return this.assetTypeService.getAll();
  }
}


