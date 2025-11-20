import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryEventgrpModel } from '../models/kerry-mix-model.model';

@Injectable({
  providedIn: 'root'
})
export class EventgrpService {
  api = "/eventgrp"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(employeeId?: string): Observable<KerryEventgrpModel[]> {
    return this.http.get<KerryEventgrpModel[]>(this.urlApi + "/leave" + (employeeId ? '?employeeId=' + employeeId : ''))
  }
}
