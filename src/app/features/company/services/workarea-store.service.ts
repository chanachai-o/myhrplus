import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { WorkareaStore } from '../models/workarea-store.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkareaStoreService extends BaseApiService<WorkareaStore> {
  protected baseUrl = 'hr/company/workarea-stores';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<WorkareaStore[]> {
    this.loading.set(true);
    return this.http.get<WorkareaStore[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

