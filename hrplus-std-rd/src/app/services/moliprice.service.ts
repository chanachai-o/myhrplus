import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoliPriceService {

  constructor(private http: HttpClient,
    private translateService: TranslateService
  ) { }


  getOliPriceList(): Promise<any[]> {
    return this.http.get<any[]>(environment.baseUrl + '/moliprice/list').toPromise()
  }

  postOliprice(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/moliprice', body).toPromise()
  }
  deleteOliprice(body: any): Observable<any> {
    let option = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: body
    }
    return this.http.delete<any>(environment.baseUrl + '/moliprice', option)
  }
}
