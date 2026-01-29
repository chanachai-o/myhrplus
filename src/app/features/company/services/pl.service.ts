import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { PL } from '../models/pl.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PLService extends BaseApiService<PL> {
  protected baseUrl = 'hr/company/pls';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<PL[]> {
    this.loading.set(true);
    return this.http.get<PL[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

