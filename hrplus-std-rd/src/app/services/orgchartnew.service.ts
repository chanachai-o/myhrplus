import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bu1 } from '../models/bu1.model';

@Injectable({
  providedIn: 'root'
})
export class OrgchartnewService {
  private Data = '/assets/template/data.json';
  // private jsonUrl1 = '/assets/template/data1.json';
  // private jsonUrl2 = '/assets/template/data2.json';
  private Bu1 = '/assets/template/Bu1.json';
  private Bu2 = '/assets/template/Bu2.json';
  private Bu3 = '/assets/template/Bu3.json';
  private Bu4 = '/assets/template/Bu4.json';
  private Bu5 = '/assets/template/Bu5.json';
  private EmpWork = '/assets/template/EmpWork.json';
  private EmpWork2 = '/assets/template/EmpWork2.json';
constructor(
  private http: HttpClient,
) { }

// getData(): Observable<any> {
//   return this.http.get<any>(this.jsonUrl);
// }

// getData2(sizePage: number, page: number): Observable<any[]> {
//   return this.http.get<any[]>(this.jsonUrl2)
//   // return this.http.get<any[]>(this.jsonUrl)

// }
// getData3(sizePage: number, page: number): Observable<any[]> {
//   return this.http.get<any[]>(this.jsonUrl1)
// }

getData(): Observable<any[]>{
  return this.http.get<any[]>(this.Data)
}

getchacrlist(): Observable<any[]>{
  return this.http.get<any[]>(environment.baseUrl + "/chart/lists")
}

postcharlist(body: any){
  return this.http.post<any[]>(environment.baseUrl + "/chart/create" ,body)
}

getBu1(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu1)
}
getBu2(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu2)
}
getBu3(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu3)
}
getBu4(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu4)
}
getBu5(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu5)
}

getEmpWork(): Observable<any[]>{
  return this.http.get<any[]>(this.EmpWork)
}
getEmpWork2(): Observable<any[]>{
  return this.http.get<any[]>(this.EmpWork2)
}

private companySale = '/assets/template/CompanySale.json';

private Bu1Sale = '/assets/template/Bu1Sale.json';
private Bu2Sale = '/assets/template/Bu2Sale.json';
private Bu3Sale = '/assets/template/Bu3Sale.json';
private Bu4Sale = '/assets/template/Bu4Sale.json';
private Bu5Sale = '/assets/template/Bu5Sale.json';
private EmpWorkSale = '/assets/template/EmpWorkSale.json';

getCompanySale(): Observable<any[]>{
  return this.http.get<any[]>(this.companySale)
}
getBu1Sale(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu1Sale)
}
getBu2Sale(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu2Sale)
}
getBu3Sale(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu3Sale)
}
getBu4Sale(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu4Sale)
}
getBu5Sale(): Observable<any[]> {
  return this.http.get<any[]>(this.Bu5Sale)
}
getEmpWorkSale(): Observable<any[]>{
  return this.http.get<any[]>(this.EmpWorkSale)
}

}
