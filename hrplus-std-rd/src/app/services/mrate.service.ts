import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MrateModel } from '../models/mrate.model';

@Injectable({
  providedIn: 'root'
})
export class MrateService {
  api = "/mrate"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<MrateModel[]> {
    return this.http.get<MrateModel[]>(this.urlApi + "/list")
  }
  post(body: MrateModel): Promise<any> {
    return this.http.post<any>(this.urlApi, { ...body, companyId: null }).toPromise()
  }
  delete(body: MrateModel): Promise<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: new MrateModel({ rateId: body.rateId, groupId: body.groupId, effDate: body.effDate })
    };
    return this.http.delete<any>(this.urlApi, options).toPromise()
  }
}
