import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { HandbookSetup } from '../models/handbook-setup.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HandbookSetupService extends BaseApiService<HandbookSetup> {
  protected baseUrl = 'hr/company/ess/handbooks';
  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<HandbookSetup[]> {
    this.loading.set(true);
    return this.http.get<HandbookSetup[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}
