import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { KcKpiGroup } from '../models/kc-kpi-group.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { snakeToCamelKeys, camelToSnakeKeys } from '@core/utils/object.util';

@Injectable({ providedIn: 'root' })
export class KcKpiGroupService extends BaseApiService<KcKpiGroup> {
  protected baseUrl = 'hr/company/kc-kpi-groups';
  loading = signal<boolean>(false);

  private fromApi(item: any): KcKpiGroup {
    const camel = snakeToCamelKeys(item) as any;
    return {
      ...camel,
      kcKpiGroupId: item.kc_kpi_group_id ?? item.kckpigroupid ?? camel.kcKpiGroupId,
      companyId: item.company_id ?? item.companyid ?? camel.companyId,
      editBy: item.edit_by ?? camel.editBy,
      editDate: item.edit_date ?? camel.editDate,
      editTime: item.edit_time ?? camel.editTime
    };
  }

  private toApi(data: Partial<KcKpiGroup>): any {
    return camelToSnakeKeys(data);
  }

  override getAll(params?: any): Observable<KcKpiGroup[]> {
    this.loading.set(true);
    return this.http.get<any[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      map(list => (Array.isArray(list) ? list : []).map(item => this.fromApi(item))),
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  override create(data: Partial<KcKpiGroup>): Observable<KcKpiGroup> {
    return this.http.post<any>(this.apiUrl, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override update(id: string | number, data: Partial<KcKpiGroup>): Observable<KcKpiGroup> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override delete(data: Partial<KcKpiGroup>): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: this.toApi(data) });
  }
}
