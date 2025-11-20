import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { ApproveStatusModel } from '../models/approve-status.model';

@Injectable({
  providedIn: 'root'
})
export class ApproveService {

  constructor(private http: HttpClient,
    private translateService: TranslateService
  ) { }



  getApproveStatusList(period:string): Promise<ApproveStatusModel[]> {
    return this.http.get<ApproveStatusModel[]>(environment.baseUrl + '/approve/pis-win/period/'+period).toPromise()
  }

}
