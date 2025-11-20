import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryResignReasonModel } from '../models/kerry-mix-model.model';

@Injectable({
  providedIn: 'root'
})
export class ResignReasonService {
  api = "/resignreason"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<KerryResignReasonModel[]> {
    return this.http.get<KerryResignReasonModel[]>(this.urlApi + "/list")
  }
}
