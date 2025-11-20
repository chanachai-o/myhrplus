import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CompanyHistoryModel, MyCompanyHistory } from '../models/companyhistory.model';
import { MyVission, VissionModel } from '../models/vission.model';
import { MissionModel, MyMission } from '../models/mission.model';
import { map, tap } from 'rxjs/operators';
import { PublicHoliday, MyHoliday } from '../models/publicHoliday.model';
import { Holiday } from '../models/holiday.model';
import { environment } from '../../environments/environment';
import { MyPolicy, Policy } from '../models/policy.model';
import { Job } from '../models/job.model';
import { ContractPartyModel } from '../models/contractparty.model';
import { PaperModel } from '../models/paper.model';
import { WorkArea0Model } from '../models/workarea0.model';

@Injectable({
  providedIn: 'root'
})
export class WorkAreaService {

  constructor(private http: HttpClient,
    private translateService: TranslateService
  ) { }


  getJobcode(): Promise<Job[]> {
    return this.http.get<Job[]>(environment.baseUrl + '/jobcode/lists').toPromise()
  }
  getJobcodeById(jobcodeId:string): Promise<Job> {
    return this.http.get<Job>(environment.baseUrl + '/jobcode/'+jobcodeId).toPromise()
  }

  getWorkarea(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + '/gworkarea0')
  }
  getWorkareaList(): Observable<WorkArea0Model[]> {
    return this.http.get<WorkArea0Model[]>(environment.baseUrl + '/gworkarea0/list')
  }
  getWorkareargm1(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + '/work-area/rgm1')
  }
  getAllWorkarea(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + '/work-area/lists')
  }
  getContractparty(): Promise<ContractPartyModel[]> {
    return this.http.get<ContractPartyModel[]>(environment.baseUrl + '/contractparty/list').toPromise()
  }
  getPaperList(): Promise<PaperModel[]> {
    return this.http.get<PaperModel[]>(environment.baseUrl + '/paper-list/attachfile').toPromise()
  }

}
