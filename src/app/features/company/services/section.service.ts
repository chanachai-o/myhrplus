import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { SectionModel } from '../models/section.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionService extends BaseApiService<SectionModel> {
  protected baseUrl = 'hr/company/sections';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<SectionModel[]> {
    this.loading.set(true);
    return this.http.get<SectionModel[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

