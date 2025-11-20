import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import jwt_decode from "jwt-decode";
import { SwaplangCodeService } from "../services/swaplang-code.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EmployeeService } from "../services/employee.service";
import { TranslateService } from "@ngx-translate/core";
export interface DBModel {
  db: string;
  dbName: string;
  dbDisplay: string;
  dbcomp: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [AuthService],
  standalone: true,
  imports: [CommonModule, FormsModule , RouterModule],
})
export class LoginComponent {
  msg = "";
  dbSelected = "DB";
  userName = ""
  password = ""
  isChecked: boolean = false
  dbList: DBModel[] | undefined;
  loadingLogin = false;
  constructor(
    private authService: AuthService,
    private routes: Router,
    private http: HttpClient,
    private swapLangService: SwaplangCodeService,
    private ngbModal: NgbModal,
    private employeeService: EmployeeService,
    private translate: TranslateService
  ) {
    this.ngbModal.dismissAll()
    // this.http
    //   .get("/assets/configAppMyhr/configappmyhr.txt", {
    //     responseType: "text" as "json",
    //   })
    //   .subscribe(
    //     (data) => {
    //       let environmentConfig = data.toString().trim();
    //       console.log(environmentConfig);
    //       try {
    //         environment.baseUrl = environmentConfig + "/plus";
    //         environment.jbossUrl = environmentConfig + "/hr";
    //         environment.rootUrl = environmentConfig;
    //       } catch {
    //         alert(
    //           "Please Check Config myhrApp Url in path '/assets/configAppMyhr/configappmyhr.txt'"
    //         );
    //       }
    //     },
    //     (error: ErrorEvent) => {
    //       alert(error.message);
    //     }
    //   );

    this.authService.getDatabase().subscribe((result) => {
      this.dbList = result;
      this.dbSelected = result[0].db
    }, (error: HttpErrorResponse) => {
      this.msg = error.message;
    });
  }

  login() {
    console.log('Login attempt started.');
    this.loadingLogin = true;
    this.msg = ''
    if (sessionStorage.getItem("userName") != this.userName) {
      sessionStorage.clear();
    }
    this.authService
      .login(this.userName, this.password, this.dbSelected)
      .then((result: any) => {
        console.log('Login successful. Result:', result);
        if (result) {
          sessionStorage.setItem("userToken", result.accessToken);
          sessionStorage.setItem("currentUser", JSON.stringify(jwt_decode(result.accessToken)));
        }

        this.employeeService.getSetPass().then(manageResult => {
          if (manageResult.defaultpage === '1') {
            const userToken = result.accessToken;
            const lang = this.translate.currentLang === 'th' ? 'tha' : 'eng';
            const urlHr = environment.jbossUrl;
            window.location.href = `${urlHr}/TOKENVERFY.jsp?t=${userToken}&lang=${lang}`;
          } else {
            const decodedToken = jwt_decode(result.accessToken);
            console.log('Decoded Token:', decodedToken);
            const accountActive = decodedToken['accountactive'];
            console.log('Account Active Status:', accountActive);

            if (accountActive) { // เช็คมีฟิลด์ไหมบางไซด์ไม่ได้อัพ lib
              if (accountActive == "true") {
                this.swapLangService.getList().subscribe(swapResult => {
                  this.swapLangService.saveSwaplang(swapResult)
                  console.log('Navigating to dashboards after swapLangService.');
                  this.routes.navigate(["/company/home"]);
                })
              } else if (accountActive == "waiting") {
                this.loadingLogin = false;
                this.password = ""
                this.msg = "Please wait for a moment to log in again.";
                console.log('Account active is waiting. Not navigating.');
              } else {
                this.loadingLogin = false;
                this.password = ""
                this.msg = "Please contact Admin";
                console.log('Account active is neither true nor waiting. Not navigating.');
              }
            } else {
              this.swapLangService.getList().subscribe(swapResult => {
                this.swapLangService.saveSwaplang(swapResult)
                console.log('Navigating to dashboards (no accountactive field).');
                this.routes.navigate(["/company/company-profile"]);
              })
            }
          }
        });
      })
      .catch((reason) => {
        console.error('Login failed. Reason:', reason);
        if (reason.status == "401") {
          this.loadingLogin = false;
          this.msg = "Invalid Username or Password";
          this.password = ""
        } else {
          this.msg = reason.message;
        }
      });
  }
}
