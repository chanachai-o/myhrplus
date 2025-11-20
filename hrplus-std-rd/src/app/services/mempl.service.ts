import { MySwipeCard } from './../models/swipecard.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  EmployeeProfileModel,
  MyEmployeeProfileModel,
} from '../models/employeeprofilemodel.model';

import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

import { from, Observable, of, pipe, zip } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
import { UProfile } from '../models/globals/uprofile.model';


@Injectable({
  providedIn: 'root',
})
export class MemplService {
  lang: string = "";

  private BASE_PATH: string = environment.baseUrl + '/dashboard';
  private uprofile: Observable<UProfile> | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private translateService: TranslateService,
    private datePipe: DatePipe,
  ) { }

// leader
  getAmtStore(body: any): Promise<any[]> {
    return this.http.post<any[]>(environment.baseUrl + '/amt-store/leader/search',body).toPromise()
  }
  onSaveLeader(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/amt-store',body).toPromise()
  }
  onApproveLeader(workareaId:string,body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/amt-store/leader-approve/'+workareaId,body).toPromise()
  }

  // Manager
  getAmtStoreManager(body: any): Promise<any[]> {
    return this.http.post<any[]>(environment.baseUrl + '/amt-store/manager/search',body).toPromise()
  }
  onApproveManager(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/amt-store/manager-approve/',body).toPromise()
  }
  onCancelManager(workareaId:string,body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/amt-store/manager-cancel/'+workareaId,body).toPromise()
  }

}
