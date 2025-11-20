import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkingTimeModel } from '../models/workingTime.model';

@Injectable({
  providedIn: 'root'
})
export class WorkingTimeService {
  api = "/taapi/working-time/working-timestamp"
  urlApi = environment.baseUrl + this.api
  urlApiHr = environment.jbossUrl + this.api
  constructor(private http: HttpClient) { }

  get(startDate: string, endDate: string, employeeId: string): Observable<WorkingTimeModel[]> {
    return this.http.get<WorkingTimeModel[]>(this.urlApiHr + "/start/" + startDate + "/end/" + endDate + "?employeeid=" + employeeId)
  }
}
