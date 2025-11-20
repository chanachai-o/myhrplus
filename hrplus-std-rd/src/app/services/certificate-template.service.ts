import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KerryCertificateModel } from '../models/kerry-mix-model.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateTemplateService {
  api = "/certificate-template"
  urlApi = environment.baseUrl + this.api
  constructor(private http: HttpClient) { }
  getList(): Observable<KerryCertificateModel[]> {
    return this.http.get<KerryCertificateModel[]>(this.urlApi + "/lists")
  }
  getListShow(): Observable<KerryCertificateModel[]> {
    return this.http.get<KerryCertificateModel[]>(this.urlApi + "/workflow-show")
  }
}
