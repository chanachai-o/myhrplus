import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryTransferRosterModel } from '../models/kerry-mix-model.model';
import { EncodeCyptoService } from './encode-cypto.service';

@Injectable({
  providedIn: 'root'
})
export class TransferRosterService {
  api = "/transfer-roster"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient,
    private cyptoService: EncodeCyptoService) { }

  getPresentByWorkarea(workareaId: string): Observable<KerryTransferRosterModel[]> {
    return this.http.get<KerryTransferRosterModel[]>(this.urlApi + "/work-area/present/" + workareaId)
  }
  getTransferByWorkarea(workareaId: string): Observable<any[]> {
    return this.http.get<any[]>(this.urlApi + "/work-area/transfer/" + workareaId)
  }
  getWarning(employeeId: string, datest: string): Observable<{ warning: string }> {
    return this.http.get<{ warning: string }>(this.urlApi + "/warning/employee/" + datest + "?employeeid=" + this.cyptoService.encryptUsingAES256(employeeId))
  }
  postBorrow(body: KerryTransferRosterModel[]) {
    return this.http.post<any>(this.urlApi + "/borrow", body).toPromise()
  }
}
