import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SetCharacter {
  usernameId: string;
  empId: string;
  userRole: string;
  lang: string;
  defaultpage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getSetPass(): Promise<SetCharacter> {
    return new Promise((resolve, reject) => {
      // Use baseUrl from environment (matching hrplus-std-rd pattern)
      // In hrplus-std-rd, it uses environment.baseUrl + "/user/manage"
      // We need to construct the correct URL
      // Use baseUrl for /plus endpoints (same as hrplus-std-rd)
      const url = `${environment.baseUrl}/user/manage`;

      this.http.get<SetCharacter>(url)
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }
}

