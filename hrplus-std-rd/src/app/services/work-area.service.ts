import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkArea0Model } from '../models/workarea0.model';
import { WorkAreaModel } from '../models/workareamodel.model';

@Injectable({
  providedIn: 'root'
})
export class WorkAreaService {
  api = "/work-area"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }

  getUserAccessibleList(): Observable<WorkAreaModel[]> {
    return this.http.get<WorkAreaModel[]>(this.urlApi + "/user-accessible")
  }

  getUserAccessibleCenterList(): Observable<WorkAreaModel[]> {
    return this.http.get<WorkAreaModel[]>(this.urlApi + "/user-accessible?empcenter=true")
  }

  getList(): Observable<WorkAreaModel[]> {
    return this.http.get<WorkAreaModel[]>(this.urlApi + "/lists")
  }
  getRoleWorakarea(): Promise<any> {
    return this.http.get<any>(environment.baseUrl + '/work-area/user-accessible/level').toPromise()
  }
  getRoleWorakareaCenter(): Promise<any> {
    return this.http.get<any>(environment.baseUrl + '/work-area/user-accessible/level?empcenter=true').toPromise()
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
