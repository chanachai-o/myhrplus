import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { WorkingArea } from '../models/working-area.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkingAreaService extends BaseApiService<WorkingArea> {
  protected baseUrl = 'hr/company/working-areas';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<WorkingArea[]> {
    this.loading.set(true);
    return this.http.get<WorkingArea[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

