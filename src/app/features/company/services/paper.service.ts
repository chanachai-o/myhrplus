import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { Paper } from '../models/paper.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaperService extends BaseApiService<Paper> {
  protected baseUrl = 'hr/company/papers';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<Paper[]> {
    this.loading.set(true);
    return this.http.get<Paper[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}


