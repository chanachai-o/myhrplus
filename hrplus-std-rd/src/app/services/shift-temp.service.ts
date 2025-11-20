import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShiftTempModel } from '../models/shift-temp.model';
import { EncodeCyptoService } from './encode-cypto.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftTempService {
  api = "/shift-temp"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient,
    private cyptoService: EncodeCyptoService) { }
  getShiftTemp(startDate: string, endDate: string, employeeId?: string): Observable<ShiftTempModel> {
    return this.http.get<ShiftTempModel>(this.urlApi + "/ot-leave-adj/start/" + startDate + "/end/" + endDate + (employeeId ? "?employeeid=" + this.cyptoService.encryptUsingAES256(employeeId) : ''))
  }
}
