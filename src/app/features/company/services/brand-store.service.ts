import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { BrandStore } from '../models/brand-store.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandStoreService extends BaseApiService<BrandStore> {
  protected baseUrl = 'hr/company/brand-stores';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<BrandStore[]> {
    this.loading.set(true);
    return this.http.get<BrandStore[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

