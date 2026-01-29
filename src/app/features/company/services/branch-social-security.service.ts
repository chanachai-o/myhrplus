import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { BranchSocialSecurity } from '../models/branch-social-security.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchSocialSecurityService extends BaseApiService<BranchSocialSecurity> {
  protected baseUrl = 'hr/company/branch-social-security';

  loading = signal<boolean>(false);

  override getAll(params?: any): Observable<BranchSocialSecurity[]> {
    this.loading.set(true);
    return this.http.get<BranchSocialSecurity[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }
}


