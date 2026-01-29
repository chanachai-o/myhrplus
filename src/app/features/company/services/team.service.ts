import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { Team } from '../models/team.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseApiService<Team> {
  protected baseUrl = 'hr/company/teams';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<Team[]> {
    this.loading.set(true);
    return this.http.get<Team[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}

