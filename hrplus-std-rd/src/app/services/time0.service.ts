import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryTime0Model } from '../models/kerry-mix-model.model';

@Injectable({
  providedIn: 'root'
})
export class Time0Service {
  api = "/time0"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<KerryTime0Model[]> {
    return this.http.get<KerryTime0Model[]>(this.urlApi + "/lists?status=0")
  }
}
