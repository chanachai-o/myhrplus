import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HighcostModel } from '../models/highcost.model';

@Injectable({
  providedIn: 'root'
})
export class HighcostService {
  api = "/high-cost"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<HighcostModel[]> {
    return this.http.get<HighcostModel[]>(this.urlApi + "/list")
  }
  getByID(workareaId: string): Observable<HighcostModel> {
    return this.http.get<HighcostModel>(this.urlApi + "/" + workareaId)
  }
  post(body: HighcostModel): Promise<any> {
    return this.http.post<any>(this.urlApi, { ...body, companyId: null }).toPromise()
  }
  delete(body: HighcostModel): Promise<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: new HighcostModel({ workarea: body.workarea })
    };
    return this.http.delete<any>(this.urlApi, options).toPromise()
  }
}