import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { ZoneType } from '../models/zone-type.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneTypeService extends BaseApiService<ZoneType> {
  protected baseUrl = 'hr/company/zone-types';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<ZoneType[]> {
    this.loading.set(true);
    return this.http.get<ZoneType[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

