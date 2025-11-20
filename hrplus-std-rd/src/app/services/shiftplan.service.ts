import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ShiftplanModel, MyShiftplanModel, ListExchangeShiftPlanningModel, MyListExchangeShiftPlanningModel } from '../models/shiftplan.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftplanService {

  constructor(private http: HttpClient,
    private translateService: TranslateService
  ) { }

  get_employee_shift_approved(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel> {
    return this.http.get<ShiftplanModel>(environment.jbossUrl + "/spapi/sp/get-employee-shift-approved/" + empId + "/" + startDate + "/" + endDate).pipe(map((x: any) => x = new MyShiftplanModel(x.model, this.translateService)))
  }

  get_subordinate_shift_approved(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel[]> {
    return this.http.get<ShiftplanModel[]>(environment.jbossUrl + "/spapi/sp/get-subordinate-shift-approved/" + empId + "/" + startDate + "/" + endDate).pipe(map((x: any) => x.items.map((y: ShiftplanModel) => y = new MyShiftplanModel(y, this.translateService))))
  }

  get_list_exchange_transition(startDate: string, endDate: string): Observable<ListExchangeShiftPlanningModel[]> {
    return this.http.get<ListExchangeShiftPlanningModel[]>(environment.jbossUrl + "/spapi/sp/get-list-exchange-transition/" + startDate + "/" + endDate).pipe(map((x: any) => x.items.map((y: ListExchangeShiftPlanningModel) => y = new MyListExchangeShiftPlanningModel(y, this.translateService))))
  }

  get_employee_shift(empId: string, startDate: string, endDate: string): Observable<ShiftplanModel> {
    return this.http.get<ShiftplanModel>(environment.jbossUrl + "/spapi/sp/get-employee-shift/" + empId + "/" + startDate + "/" + endDate).pipe(map((x: any) => x = new MyShiftplanModel(x.model, this.translateService)))
  }

  save_shift_change(body: {
    model: {
      changeId: number,
      employeeId: string,
      dateId: string,
      shiftId: string,
      shiftType: string,
      exchangeId: string,
      exEmployeeId: string,
      exDateId: string,
      exShiftType: string,
      exShiftId: string,
      exchangeType: number
    }
  }): Observable<any> {
    return this.http.post<any>(environment.jbossUrl + "/spapi/sp/save-shift-change", body)
  }

  save_shift_exchange(body: {
    model: {
      exchangeId: number,
      employeeId: string,
      dateId: string,
      shiftId: string,
      shiftType: string,
      remark: string,
      exchangeType: number
    }
  }): Observable<any> {
    return this.http.post<any>(environment.jbossUrl + "/spapi/sp/save-shift-exchange", body)
  }

}
