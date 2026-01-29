import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { WorkareaLocation } from '../models/workarea-location.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkareaLocationService extends BaseApiService<WorkareaLocation> {
  protected baseUrl = 'hr/company/workarea-locations';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<WorkareaLocation[]> {
    this.loading.set(true);
    return this.http.get<WorkareaLocation[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

