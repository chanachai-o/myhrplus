import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { DepartmentModel } from '../models/department.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { snakeToCamelKeys, camelToSnakeKeys } from '@core/utils/object.util';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseApiService<DepartmentModel> {
  protected baseUrl = 'hr/company/departments';

  loading = signal<boolean>(false);

  private fromApi(item: any): DepartmentModel {
    const camel = snakeToCamelKeys(item) as any;
    return {
      ...camel,
      bu2Id: item.bu2_id ?? item.bu2id ?? camel.bu2Id,
      companyId: item.company_id ?? item.companyid ?? camel.companyId,
      tshortName: item.tshort_name ?? camel.tshortName,
      eshortName: item.eshort_name ?? camel.eshortName,
      shortName: item.short_name ?? camel.shortName,
      buildDate: item.build_date ?? camel.buildDate,
      expireDate: item.expire_date ?? camel.expireDate,
      sortNumber: item.sort_number ?? camel.sortNumber,
      bu2Sup: item.bu2_sup ?? item.bu2sup ?? camel.bu2Sup,
      editBy: item.edit_by ?? camel.editBy,
      editDate: item.edit_date ?? camel.editDate,
      editTime: item.edit_time ?? camel.editTime
    };
  }

  private toApi(data: Partial<DepartmentModel>): any {
    return camelToSnakeKeys(data);
  }

  override getAll(params?: any): Observable<DepartmentModel[]> {
    this.loading.set(true);
    return this.http.get<any[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      map(list => (Array.isArray(list) ? list : []).map(item => this.fromApi(item))),
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  override create(data: Partial<DepartmentModel>): Observable<DepartmentModel> {
    return this.http.post<any>(this.apiUrl, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override update(id: string | number, data: Partial<DepartmentModel>): Observable<DepartmentModel> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override delete(data: Partial<DepartmentModel>): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: this.toApi(data) });
  }
}

