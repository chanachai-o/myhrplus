import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { snakeToCamelKeys, camelToSnakeKeys } from '@core/utils/object.util';

@Injectable({ providedIn: 'root' })
export class ProjectService extends BaseApiService<Project> {
  protected baseUrl = 'hr/company/project-table';
  loading = signal<boolean>(false);

  private fromApi(item: any): Project {
    const camel = snakeToCamelKeys(item) as any;
    return {
      ...camel,
      projectId: item.project_id ?? item.projectid ?? camel.projectId,
      companyId: item.company_id ?? item.companyid ?? camel.companyId,
      editBy: item.edit_by ?? camel.editBy,
      editDate: item.edit_date ?? camel.editDate,
      editTime: item.edit_time ?? camel.editTime
    };
  }

  private toApi(data: Partial<Project>): any {
    return camelToSnakeKeys(data);
  }

  override getAll(params?: Record<string, unknown>): Observable<Project[]> {
    this.loading.set(true);
    return this.http.get<any[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      map(list => (Array.isArray(list) ? list : []).map(item => this.fromApi(item))),
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  override create(data: Partial<Project>): Observable<Project> {
    return this.http.post<any>(this.apiUrl, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override update(id: string | number, data: Partial<Project>): Observable<Project> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override delete(data: Partial<Project>): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: this.toApi(data) });
  }
}
