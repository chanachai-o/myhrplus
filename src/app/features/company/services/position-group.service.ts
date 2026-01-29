import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { PositionGroupModel } from '../models/position-group.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { snakeToCamelKeys, camelToSnakeKeys } from '@core/utils/object.util';

@Injectable({ providedIn: 'root' })
export class PositionGroupService extends BaseApiService<PositionGroupModel> {
  protected baseUrl = 'hr/company/position-groups';
  loading = signal<boolean>(false);

  /** Map API response (snake_case or lowercase) to camelCase model */
  private fromApi(item: any): PositionGroupModel {
    const camel = snakeToCamelKeys(item) as any;
    return {
      ...camel,
      positionGroupId: item.position_group_id ?? item.positiongroupid ?? camel.positionGroupId,
      companyId: item.company_id ?? item.companyid ?? camel.companyId,
      editBy: item.edit_by ?? camel.editBy,
      editDate: item.edit_date ?? camel.editDate,
      editTime: item.edit_time ?? camel.editTime
    };
  }

  /** Map camelCase model to API payload (snake_case) */
  private toApi(data: Partial<PositionGroupModel>): any {
    return camelToSnakeKeys(data);
  }

  override getAll(params?: any): Observable<PositionGroupModel[]> {
    this.loading.set(true);
    return this.http.get<any[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      map(list => (Array.isArray(list) ? list : []).map(item => this.fromApi(item))),
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  override create(data: Partial<PositionGroupModel>): Observable<PositionGroupModel> {
    return this.http.post<any>(this.apiUrl, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override update(id: string | number, data: Partial<PositionGroupModel>): Observable<PositionGroupModel> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override delete(data: Partial<PositionGroupModel>): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: this.toApi(data) });
  }
}
