import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { EventSetup } from '../models/event-setup.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventSetupService extends BaseApiService<EventSetup> {
  protected baseUrl = 'hr/company/ess/events';
  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<EventSetup[]> {
    this.loading.set(true);
    return this.http.get<EventSetup[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}
