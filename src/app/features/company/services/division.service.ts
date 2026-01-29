import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { DivisionModel } from '../models/division.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { snakeToCamelKeys, camelToSnakeKeys } from '@core/utils/object.util';

@Injectable({
  providedIn: 'root'
})
export class DivisionService extends BaseApiService<DivisionModel> {
  protected baseUrl = 'hr/company/divisions';

  loading = signal<boolean>(false);

  private fromApi(item: any): DivisionModel {
    const camel = snakeToCamelKeys(item) as any;
    return {
      ...camel,
      bu1Id: item.bu1_id ?? item.bu1id ?? camel.bu1Id,
      companyId: item.company_id ?? item.companyid ?? camel.companyId,
      branchId: item.branch_id ?? item.branchid ?? camel.branchId,
      tshortName: item.tshort_name ?? camel.tshortName,
      eshortName: item.eshort_name ?? camel.eshortName,
      shortName: item.short_name ?? camel.shortName,
      buildDate: item.build_date ?? camel.buildDate,
      expireDate: item.expire_date ?? camel.expireDate,
      sortNumber: item.sort_number ?? camel.sortNumber,
      bu1Sup: item.bu1_sup ?? item.bu1sup ?? camel.bu1Sup,
      editBy: item.edit_by ?? camel.editBy,
      editDate: item.edit_date ?? camel.editDate,
      editTime: item.edit_time ?? camel.editTime
    };
  }

  private toApi(data: Partial<DivisionModel>): any {
    return camelToSnakeKeys(data);
  }

  override getAll(params?: any): Observable<DivisionModel[]> {
    this.loading.set(true);
    return this.http.get<any[]>(this.apiUrl, { params: this.createParams(params) }).pipe(
      map(list => (Array.isArray(list) ? list : []).map(item => this.fromApi(item))),
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  override create(data: Partial<DivisionModel>): Observable<DivisionModel> {
    return this.http.post<any>(this.apiUrl, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override update(id: string | number, data: Partial<DivisionModel>): Observable<DivisionModel> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override delete(data: Partial<DivisionModel>): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: this.toApi(data) });
  }
}


