import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { VShiftModel } from '../models/vshift.model';

@Injectable({
  providedIn: 'root'
})
export class VShiftService {

  constructor(private http: HttpClient,
    private translateService: TranslateService
  ) { }


  getVShift0List(): Observable<VShiftModel[]> {
    return this.http.get<VShiftModel[]>(environment.baseUrl + '/vshift0/list')
  }
  postVShift(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/vshift0', body).toPromise()
  }
  deleteVShift(body: any): Observable<any> {
    let option = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: body
    }
    return this.http.delete<any>(environment.baseUrl + '/vshift0', option)
  }
}
