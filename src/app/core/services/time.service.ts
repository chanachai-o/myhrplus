import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  // Get List Period (for Timestamp)
  getListPeriod(startdate: string, enddate: string, empId?: string): Observable<any[]> {
    const endpoint = `${environment.apiEndpoints.timeAttendance}/tc1/period/${startdate}/${enddate}/list`;
    const params = empId ? { employeeid: empId } : undefined;
    return this.apiService.get<any[]>(endpoint, params, true).pipe(
      map(response => response.data || (Array.isArray(response) ? response : []))
    );
  }
}











