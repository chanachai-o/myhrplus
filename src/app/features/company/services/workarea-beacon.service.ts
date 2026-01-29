import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { WorkareaBeacon } from '../models/workarea-beacon.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkareaBeaconService extends BaseApiService<WorkareaBeacon> {
  protected baseUrl = 'hr/company/workarea-beacons';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<WorkareaBeacon[]> {
    this.loading.set(true);
    return this.http.get<WorkareaBeacon[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

