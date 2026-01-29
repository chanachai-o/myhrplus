import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { CostCenter } from '../models/cost-center.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostCenterService extends BaseApiService<CostCenter> {
  protected baseUrl = 'hr/company/cost-centers';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<CostCenter[]> {
    this.loading.set(true);
    return this.http.get<CostCenter[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

