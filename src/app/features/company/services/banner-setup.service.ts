import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { BannerSetup } from '../models/banner-setup.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BannerSetupService extends BaseApiService<BannerSetup> {
  protected baseUrl = 'hr/company/ess/banners';
  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<BannerSetup[]> {
    this.loading.set(true);
    return this.http.get<BannerSetup[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}
