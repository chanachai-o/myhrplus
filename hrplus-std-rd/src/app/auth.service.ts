import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginModel } from "./models/auth.model";
import jwt_decode from "jwt-decode";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
var sha1 = require('sha1');

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private routes: Router) {}

  checkusernameandpassword(uname: string, pwd: string) {
    if (uname === "admin" && pwd === "admin123") {
      sessionStorage.setItem("username", "admin");
      return true;
    } else {
      return false;
    }
  }

  login(uname: string, pwd: string , databaseName : string): Promise<any> {
    return new Promise((resolve, reject) => {
      let body: LoginModel = {
        username: uname,
        password: pwd,
        dbName: databaseName,
        dbcomp: "100",
        lang: "th",
      };
      this.http
        .post<any>(environment.jbossUrl + "/usapi/authen", body)
        .subscribe(
          (response) => {
            resolve(response);
            sessionStorage.setItem("dbName", databaseName);
            sessionStorage.setItem("userToken", response.accessToken);
            sessionStorage.setItem(
              "currentUser",
              JSON.stringify(jwt_decode(response.accessToken))
            );
          },
          (error: ErrorEvent) => {
            reject(error);
          }
        );
    });
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.clear();
    sessionStorage.clear();
    this.routes.navigate(["/login"]);
  }

  setMailForgetPassword(uname: string, email: string , dbName : string): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = {
        userName: uname,
        email: email,
        dbName: dbName,
      };
      this.http
        .post<any>(environment.jbossUrl + "/usapi/authen/forgot-password", body)
        .subscribe(
          (response) => {
            console.log(response);
            resolve(response);
          },
          (error: ErrorEvent) => {
            reject(error);
          }
        );
    });
  }

  savePassword(oldPass: string, newPass: string, lang: string, ciw: string, cliw: string, niw: string,siw: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = {
        password: oldPass,
        newPassword: sha1(newPass),
        lang : lang,
        niw : niw,
        ciw : ciw,
        cliw : cliw,
        siw : siw,
      };
      console.log("testModel",body);
      this.http
        .post<any>(environment.jbossUrl + "/emvapi/user/change-password", body)
        .subscribe(
          (response) => {
            console.log(response);
            resolve(response);
          },
          (error: ErrorEvent) => {
            reject(error);
          }
        );
    });
  }
  savePdpa(body:any){
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.jbossUrl + "/emvapi/pdpa/employee-consent", body)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error: ErrorEvent) => {
            reject(error);
          }
        );
    });
  }
  getDatabase(): Observable<any>{
    return this.http.get(environment.jbossUrl + '/usapi/system/get-db-list');
  }
  getPdpa(employeeId : string):Observable<any>{
    return this.http.get(environment.jbossUrl + `/emvapi/pdpa/employee-consent/${employeeId}`);
  }
}
