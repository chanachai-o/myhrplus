import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TotmdateService {
  api = "/totmdate"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }

  checkDate(employeeId: string, startDate: string, endDate: string): Observable<{ date: string, error: boolean, wfRefDoc: string[] }[]> {
    return this.http.get<{ date: string, error: boolean, wfRefDoc: string[] }[]>(this.urlApi + "/empid/start/" + startDate + "/end/" + endDate + "?employeeid=" + employeeId)
  }
}