import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { ApproveLevel } from '../models/approve-level.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApproveLevelService extends BaseApiService<ApproveLevel> {
  protected baseUrl = 'hr/company/approve-levels';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<ApproveLevel[]> {
    this.loading.set(true);
    return this.http.get<ApproveLevel[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

