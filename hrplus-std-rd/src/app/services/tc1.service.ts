import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryTc1EmployeeModel } from '../models/kerry-mix-model.model';

@Injectable({
  providedIn: 'root'
})
export class Tc1Service {
  api = "/tc1"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  search(body: any): Observable<KerryTc1EmployeeModel[]> {
    //   {
    //     "all": false,
    //     "approved": true,
    //     "borrow": true,
    //     "employeeId": "",
    //     "endDate": "2023-09-15",
    //     "startDate": "2023-08-16",
    //     "subordinate": false,
    //     "unapproved": false,
    //     "workareaId": [
    //         "0002"
    //     ]
    // }
    return this.http.post<KerryTc1EmployeeModel[]>(this.urlApi + "/search", body)
  }

  searchCenter(body: any): Observable<KerryTc1EmployeeModel[]> {
    return this.http.post<KerryTc1EmployeeModel[]>(this.urlApi + "/empcenter/search", body)
  }

  managerApprove(body: any): Observable<any> {
    // {
    //   "action": "Approved",
    //   "manageApproved": [
    //     {
    //       "dateId": "string",
    //       "employeeId": [
    //         "string"
    //       ]
    //     }
    //   ]
    // }
    return this.http.post<any>(this.urlApi + "/manager-approve1", body)
  }

}
