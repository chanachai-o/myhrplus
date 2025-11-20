import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryBackPayExcelModel, KerryBackPayTotalModel, KerryBackpayModel, KerryBackpayTypeModel } from '../models/kerry-mix-model.model';
import { EncodeCyptoService } from './encode-cypto.service';

@Injectable({
  providedIn: 'root'
})
export class BackpayService {
  apiType = "/backpay-type"
  urlApiType = environment.baseUrl + this.apiType
  apiDetail = "/backpay-detail"
  urlApiDetail = environment.baseUrl + this.apiDetail
  constructor(private http: HttpClient,
    private cyptoService: EncodeCyptoService) { }
  getTypeList(): Observable<KerryBackpayTypeModel[]> {
    return this.http.get<KerryBackpayTypeModel[]>(this.urlApiType + "/list")
  }
  get(employeeId: string, dateId: string): Observable<KerryBackpayModel> {
    return this.http.get<KerryBackpayModel>(this.urlApiDetail + "/employee/" + dateId + "?employeeid=" + this.cyptoService.encryptUsingAES256(employeeId))
  }
  post(body: KerryBackpayModel): Promise<any> {
    return this.http.post<any>(this.urlApiDetail, { ...body, backPayDetailList: body.backPayDetailList.map(x => { return { ...x, companyId: null, value: null, period: null } }) }).toPromise()
  }
  searchBackpayDetail(body: any) {
    // body = {
    //   workareaId: "",
    //   startDate: yyyy-mm-dd,
    //   endDate: yyyy-mm-dd,
    //   employeeId: ""
    // }
    return this.http.post<KerryBackPayTotalModel>(this.urlApiDetail + '/search', body).toPromise()
  }

  getPeriod(): Observable<{ period: string }[]> {
    return this.http.get<{ period: string }[]>(this.urlApiDetail + "/period")
  }


  postExcel(body: any) {
    // body = {
    //   period: "string",
    //   workAreaId: "string"[],
    //   type: "string"[],
    //   employeeId: "string"
    // }
    return this.http.post<KerryBackPayExcelModel>(this.urlApiDetail + "/excel", body).toPromise()
  }

}
