import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { VideoSetup } from '../models/video-setup.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoSetupService extends BaseApiService<VideoSetup> {
  protected baseUrl = 'hr/company/ess/videos';
  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<VideoSetup[]> {
    this.loading.set(true);
    return this.http.get<VideoSetup[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}
