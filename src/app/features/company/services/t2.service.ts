import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { T2 } from '../models/t2.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class T2Service extends BaseApiService<T2> {
  protected baseUrl = 'hr/company/t2';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<T2[]> {
    this.loading.set(true);
    return this.http.get<T2[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

