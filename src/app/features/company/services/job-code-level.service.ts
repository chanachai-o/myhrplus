import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { JobCodeLevel } from '../models/job-code-level.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { snakeToCamelKeys, camelToSnakeKeys } from '@core/utils/object.util';

@Injectable({ providedIn: 'root' })
export class JobCodeLevelService extends BaseApiService<JobCodeLevel> {
  protected baseUrl = 'hr/company/job-code-levels';
  loading = signal<boolean>(false);

  private fromApi(item: any): JobCodeLevel {
    const camel = snakeToCamelKeys(item) as any;
    return {
      ...camel,
      jobCodeLevelId: item.job_code_level_id ?? item.jobcodelevelid ?? camel.jobCodeLevelId,
      companyId: item.company_id ?? item.companyid ?? camel.companyId,
      editBy: item.edit_by ?? camel.editBy,
      editDate: item.edit_date ?? camel.editDate,
      editTime: item.edit_time ?? camel.editTime
    };
  }

  private toApi(data: Partial<JobCodeLevel>): any {
    return camelToSnakeKeys(data);
  }

  override getAll(params?: any): Observable<JobCodeLevel[]> {
    this.loading.set(true);
    return this.http.get<any[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      map(list => (Array.isArray(list) ? list : []).map(item => this.fromApi(item))),
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  override create(data: Partial<JobCodeLevel>): Observable<JobCodeLevel> {
    return this.http.post<any>(this.apiUrl, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override update(id: string | number, data: Partial<JobCodeLevel>): Observable<JobCodeLevel> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override delete(data: Partial<JobCodeLevel>): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: this.toApi(data) });
  }
}
