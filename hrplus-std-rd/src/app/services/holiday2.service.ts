import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryEmpModel, KerryHoliday1Model, KerryHolidayModel } from '../models/kerry-mix-model.model';
import { EncodeCyptoService } from './encode-cypto.service';

@Injectable({
  providedIn: 'root'
})
export class Holiday2Service {
  api = "/holiday2"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient,
    private cyptoService: EncodeCyptoService) { }
  getList(employeeId: string): Observable<KerryHolidayModel> {
    return this.http.get<KerryHolidayModel>(this.urlApi + "/employee/used-holiday?employeeid=" + this.cyptoService.encryptUsingAES256(employeeId))
  }
  post(body: KerryHoliday1Model[]): Promise<any> {
    console.log(body.map(x => { return { ...x, companyId: null } }));

    return this.http.post<any>(this.urlApi, body.map(x => { return { ...x, companyId: null } })).toPromise()
  }
  delete(body: KerryHoliday1Model[]): Promise<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: body.map(x => new KerryHoliday1Model({
        employee: new KerryEmpModel({ employeeId: x.employee.employeeId }),
        hdate: x.hdate
      }))
    };
    return this.http.delete<any>(this.urlApi, options).toPromise()
  }
}
