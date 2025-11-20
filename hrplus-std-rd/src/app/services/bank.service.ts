import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryBankModel } from '../models/kerry-mix-model.model';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  api = "/bank"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<KerryBankModel[]> {
    return this.http.get<KerryBankModel[]>(this.urlApi + "/lists")
  }
}
