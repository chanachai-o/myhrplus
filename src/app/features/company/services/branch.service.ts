import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { BranchModel } from '../models/branch.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { snakeToCamelKeys, camelToSnakeKeys } from '@core/utils/object.util';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseApiService<BranchModel> {
  protected baseUrl = 'hr/company/branches';

  loading = signal<boolean>(false);

  private fromApi(item: any): BranchModel {
    const camel = snakeToCamelKeys(item) as any;
    return {
      ...camel,
      branchId: item.branch_id ?? item.branchid ?? camel.branchId,
      companyId: item.company_id ?? item.companyid ?? camel.companyId,
      headCompany: item.head_company ?? item.headcompany ?? camel.headCompany,
      socBranchModelId: item.soc_branch_id ?? item.soc_branchid ?? camel.socBranchModelId,
      taxBranchModelId: item.tax_branch_id ?? item.tax_branchid ?? camel.taxBranchModelId,
      troomNo: item.troom_no ?? camel.troomNo,
      eroomNo: item.eroom_no ?? camel.eroomNo,
      districtId: item.district_id ?? item.districtid ?? camel.districtId,
      socialCode: item.social_code ?? camel.socialCode,
      socSignName: item.soc_sign_name ?? camel.socSignName,
      socSignPos: item.soc_sign_pos ?? camel.socSignPos,
      socSignImg: item.soc_sign_img ?? camel.socSignImg,
      taxSignName: item.tax_sign_name ?? camel.taxSignName,
      taxSignPos: item.tax_sign_pos ?? camel.taxSignPos,
      taxSignImg: item.tax_sign_img ?? camel.taxSignImg,
      branchNo: item.branch_no ?? camel.branchNo,
      taxId: item.taxid ?? camel.taxId,
      taxId2: item.taxid2 ?? camel.taxId2,
      brandTdesc: item.brand_tdesc ?? camel.brandTdesc,
      brandEdesc: item.brand_edesc ?? camel.brandEdesc,
      comType: item.com_type ?? camel.comType,
      isCompany: item.is_company ?? item.iscompany ?? camel.isCompany,
      isBranch: item.is_branch ?? item.isbranch ?? camel.isBranch,
      branchTax: item.branch_tax ?? camel.branchTax,
      editBy: item.edit_by ?? camel.editBy,
      editDate: item.edit_date ?? camel.editDate,
      editTime: item.edit_time ?? camel.editTime
    };
  }

  private toApi(data: Partial<BranchModel>): any {
    return camelToSnakeKeys(data);
  }

  override getAll(params?: any): Observable<BranchModel[]> {
    const mergedParams = { ...params, isbranch: '1' };
    this.loading.set(true);
    return this.http.get<any[]>(this.apiUrl, { params: this.createParams(mergedParams) }).pipe(
      map(list => (Array.isArray(list) ? list : []).map(item => this.fromApi(item))),
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  override create(data: Partial<BranchModel>): Observable<BranchModel> {
    return this.http.post<any>(this.apiUrl, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override update(id: string | number, data: Partial<BranchModel>): Observable<BranchModel> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override delete(data: Partial<BranchModel>): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: this.toApi(data) });
  }
}

