import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { EncodeCyptoService } from './encode-cypto.service';
import { MyjobProfileModel } from '../models/myjob.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class myjobService {
  baseUrl = environment.jbossUrl + "/mjapi"
  constructor(
    private http: HttpClient,
    private router: Router,
    private translateService: TranslateService,
  ) { }

  getMyjobCandidate(companyId : string) {
    return this.http.get<MyjobProfileModel[]>(this.baseUrl + '/myjob/candidate/'+companyId).pipe(
      map((e) => e.map((e) => new MyjobProfileModel(e, this.translateService)))
    );
  }

  chooseCandidate(body: MyjobProfileModel) {
    return this.http.post<any>(this.baseUrl + '/myjob/choose-candidate', new MyjobProfileModel(body))
  }

}
