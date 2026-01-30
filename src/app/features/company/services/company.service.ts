import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { CompanyModel } from '../models/company.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { snakeToCamelKeys, camelToSnakeKeys } from '@core/utils/object.util';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseApiService<CompanyModel> {
  protected baseUrl = 'hr/company/companies';

  loading = signal<boolean>(false);

  private fromApi(item: any): CompanyModel {
    const camel = snakeToCamelKeys(item) as any;
    return {
      ...camel,
      branchId: item.branch_id ?? item.branchid ?? camel.branchId,
      companyId: item.company_id ?? item.companyid ?? camel.companyId,
      socBranchId: item.soc_branch_id ?? item.soc_branchid ?? camel.socBranchId,
      taxBranchId: item.tax_branch_id ?? item.tax_branchid ?? camel.taxBranchId,
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
      isCompanyModel: item.is_company ?? item.iscompany ?? camel.isCompanyModel,
      isBranch: item.is_branch ?? item.isbranch ?? camel.isBranch,
      headCompanyModel: item.head_company ?? item.headcompany ?? camel.headCompanyModel,
      branchTax: item.branch_tax ?? camel.branchTax,
      editBy: item.edit_by ?? camel.editBy,
      editDate: item.edit_date ?? camel.editDate,
      editTime: item.edit_time ?? camel.editTime
    };
  }

  private toApi(data: Partial<CompanyModel>): any {
    return camelToSnakeKeys(data);
  }

  override getAll(params?: { sort?: string; [key: string]: any }): Observable<CompanyModel[]> {
    const mergedParams: any = { ...params, iscompany: '1' };
    // ใช้ฟิลด์เดียว sort=ชื่อฟิลด์:ทิศทาง (เช่น sort=codeId:desc)
    this.loading.set(true);
    return this.http.get<any[]>(this.apiUrl, { params: this.createParams(mergedParams) }).pipe(
      map(list => (Array.isArray(list) ? list : []).map(item => this.fromApi(item))),
      tap(() => this.loading.set(false)),
      catchError(err => { this.loading.set(false); return throwError(() => err); })
    );
  }

  override create(data: Partial<CompanyModel>): Observable<CompanyModel> {
    return this.http.post<any>(this.apiUrl, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override update(id: string | number, data: Partial<CompanyModel>): Observable<CompanyModel> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toApi(data)).pipe(
      map(res => this.fromApi(res))
    );
  }

  override delete(data: Partial<CompanyModel>): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: this.toApi(data) });
  }
}

