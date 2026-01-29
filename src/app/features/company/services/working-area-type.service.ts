import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { WorkingAreaType } from '../models/working-area-type.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkingAreaTypeService extends BaseApiService<WorkingAreaType> {
  protected baseUrl = 'hr/company/working-area-types';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<WorkingAreaType[]> {
    this.loading.set(true);
    return this.http.get<WorkingAreaType[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

