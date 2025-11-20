import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryPositionGroupModel } from '../models/kerry-mix-model.model';

@Injectable({
  providedIn: 'root'
})
export class PositionGroupService {
  api = "/position-group"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<KerryPositionGroupModel[]> {
    return this.http.get<KerryPositionGroupModel[]>(this.urlApi + "/list")
  }
  getById(positionGroupId: string): Observable<KerryPositionGroupModel> {
    return this.http.get<KerryPositionGroupModel>(this.urlApi + "/" + positionGroupId)
  }
}
