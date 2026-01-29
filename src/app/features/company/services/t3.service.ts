import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { T3 } from '../models/t3.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class T3Service extends BaseApiService<T3> {
  protected baseUrl = 'hr/company/t3';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<T3[]> {
    this.loading.set(true);
    return this.http.get<T3[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

