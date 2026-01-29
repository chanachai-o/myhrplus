import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { T4 } from '../models/t4.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class T4Service extends BaseApiService<T4> {
  protected baseUrl = 'hr/company/t4';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<T4[]> {
    this.loading.set(true);
    return this.http.get<T4[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

