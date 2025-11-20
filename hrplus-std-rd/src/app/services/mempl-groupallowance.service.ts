import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MemplGroupAllowanceModel } from '../models/mempl-groupallowance.model';

@Injectable({
  providedIn: 'root'
})
export class MemplGroupallowanceService {
  api = "/mempl-groupallowance"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<MemplGroupAllowanceModel[]> {
    return this.http.get<MemplGroupAllowanceModel[]>(this.urlApi + "/list")
  }
  post(body: MemplGroupAllowanceModel): Promise<any> {
    return this.http.post<any>(this.urlApi, { ...body, companyId: null }).toPromise()
  }
  delete(body: MemplGroupAllowanceModel): Promise<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: new MemplGroupAllowanceModel({ groupallowanceId: body.groupallowanceId })
    };
    return this.http.delete<any>(this.urlApi, options).toPromise()
  }
}