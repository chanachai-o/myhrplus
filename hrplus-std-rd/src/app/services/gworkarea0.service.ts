import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkArea0Model } from '../models/workarea0.model';

@Injectable({
  providedIn: 'root'
})
export class Gworkarea0Service {
  api = "/gworkarea0"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<WorkArea0Model[]> {
    return this.http.get<WorkArea0Model[]>(this.urlApi + "/list")
  }
  post(body: WorkArea0Model): Promise<any> {
    return this.http.post<any>(this.urlApi, { ...body, companyId: null }).toPromise()
  }
  delete(body: WorkArea0Model): Promise<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: { ...new WorkArea0Model(body), companyId: null }
    };
    return this.http.delete<any>(this.urlApi, options).toPromise()
  }
}
