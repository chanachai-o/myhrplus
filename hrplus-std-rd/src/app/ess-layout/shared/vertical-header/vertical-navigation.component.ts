import {
  Component,
  AfterViewInit,
  EventEmitter,
  Output,
  ViewChild,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { NgbActiveModal, NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/auth.service";
import { EmployeeService } from "src/app/services/employee.service";
import { EmployeeProfileModel } from "src/app/models/employeeprofilemodel.model";
import { workflowService } from "src/app/services/workflow.service";
import { environment } from "src/environments/environment";
import {
  MysetCharacter,
  setCharacter,
} from "src/app/models/setCharacter.model";
import { PrivateMessageService } from "src/app/services/private-message.service";
import { EmployeeConsent, Pdpa } from "src/app/models/pdpa.model";
import { HttpClient, HttpErrorResponse, HttpClientModule } from "@angular/common/http";
import { ConfigModel } from "../vertical-sidebar/vertical-sidebar.component";
import { MessageModel, MyMessageModel } from "src/app/models/message.model";
import { LoginModel } from "src/app/models/auth.model";
import jwt_decode from "jwt-decode";
import { LogHistoryService } from "src/app/services/logHistory.service";
import { CdkScrollableModule } from "@angular/cdk/scrolling";
import { ShowLoadingDirective } from "src/app/component/shared-ui/image/show-loading.directive";

var sha1 = require('sha1');

declare var $: any;
export interface MenuModel {
  code: string;
  tName: string;
  eName: string;
}

@Component({
  selector: "app-vertical-navigation",
  templateUrl: "./vertical-navigation.component.html",
  standalone: true,
  imports: [CommonModule, NgbModule, RouterModule, TranslateModule, ShowLoadingDirective]
})
export class VerticalNavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() showSettingbar = new EventEmitter<number>();
  @ViewChild("alertModal") alertModal: undefined;
  activeKeep = 1;
  countNewNote = 0;
  countNewMessage = 0;
  checkPass = false;
  empProfile: EmployeeProfileModel | undefined;
  checkPassword = false;
  checkPdpa: EmployeeConsent | undefined;
  dataPdpa: Pdpa | undefined;

  isMobileDevice = false;

  public showSearch = false;

  // This is for Notifications
  notifications: Object[] = [
    {
      btn: "btn-danger",
      icon: "ti-link",
      title: "Luanch Admin",
      subject: "Just see the my new admin!",
      time: "9:30 AM",
    },
    {
      btn: "btn-success",
      icon: "ti-calendar",
      title: "Event today",
      subject: "Just a reminder that you have event",
      time: "9:10 AM",
    },
    {
      btn: "btn-info",
      icon: "ti-settings",
      title: "Settings",
      subject: "You can customize this template as you want",
      time: "9:08 AM",
    },
    {
      btn: "btn-primary",
      icon: "ti-user",
      title: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:00 AM",
    },
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: "assets/images/users/1.jpg",
      status: "online",
      from: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:30 AM",
    },
    {
      useravatar: "assets/images/users/2.jpg",
      status: "busy",
      from: "Sonu Nigam",
      subject: "I have sung a song! See you at",
      time: "9:10 AM",
    },
    {
      useravatar: "assets/images/users/2.jpg",
      status: "away",
      from: "Arijit Sinh",
      subject: "I am a singer!",
      time: "9:08 AM",
    },
    {
      useravatar: "assets/images/users/4.jpg",
      status: "offline",
      from: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:00 AM",
    },
  ];

  public selectedLanguage: string = "";
  public selectedLanguageIcon: any = "";

  public languages: any[] = [
    {
      language: "ไทย",
      code: "th",
      type: "TH",
      icon: "th",
    },
    {
      language: "English",
      code: "en",
      type: "US",
      icon: "us",
    },
    {
      language: "พม่า",
      code: "my",
      type: "MM",
      icon: "mm",
    },
    {
      language: "ลาว",
      code: "lo",
      type: "LA",
      icon: "la",
    },
    {
      language: "จีน",
      code: "zh",
      type: "CN",
      icon: "cn",
    },
    {
      language: "เวียดนาม",
      code: "vi",
      type: "VN",
      icon: "vn",
    },
  ];

  currentUser = JSON.parse(sessionStorage.getItem("currentUser")!);
  userToken = sessionStorage.getItem("userToken");

  uCode = JSON.parse(sessionStorage.getItem("currentUser")!);
  urlHr = environment.jbossUrl;
  msg = "";
  checkRole = false;
  wfMenu = false;
  @ViewChild("contentPDPA") contentPDPA: undefined;
  messageModel: MessageModel[] = [];
  constructor(
    private modalService: NgbModal,
    public translate: TranslateService,
    private routes: Router,
    private authService: AuthService,
    private empService: EmployeeService,
    private workflowService: workflowService,
    private privateService: PrivateMessageService,
    private http: HttpClient,
    private logHistory: LogHistoryService
  ) {
    let userLv = this.currentUser.user_level.toLowerCase()
    // if (userLv.indexOf('hr_') > -1) {
    //   this.checkRole = true
    // } else{
    //   this.checkRole = false
    // }
    this.checkHRMenu();
    this.getCheckPdpa();

    this.translate.addLangs(['th', 'en', 'my', 'lo', 'zh', 'vi']);
    this.translate.use("th");
    this.selectedLanguage = 'th';
    this.selectedLanguageIcon = 'th';

    this.empService
      .getSetPass()
      .then((result) => {
        this.selectedLanguage =
          sessionStorage.getItem("Lang") != null
            ? sessionStorage.getItem("Lang")!
            : result.lang == "ENG"
              ? "en"
              : "th";
        this.translate.use(this.selectedLanguage);
        const langData = this.languages.find(
          (lang) => lang.code === this.selectedLanguage
        );
        if (langData) {
          this.selectedLanguageIcon = langData.icon;
        }
      })
      .catch((reason) => {
        this.selectedLanguage =
          sessionStorage.getItem("Lang") != null
            ? sessionStorage.getItem("Lang")!
            : "th";
        this.translate.use(this.selectedLanguage);
        const langData = this.languages.find(
          (lang) => lang.code === this.selectedLanguage
        );
        if (langData) {
          this.selectedLanguageIcon = langData.icon;
        }
      });

    this.empService
      .getEmployeeProfile(this.currentUser.employeeid)
      .subscribe((result) => {
        this.empProfile = result;
      }, (error: HttpErrorResponse) => {
        this.msg = error.message
        alert(this.msg)
        this.authService.logout();
      });

    this.workflowService.getNewNote().subscribe((result) => {
      this.countNewNote = result.newNote
      sessionStorage.setItem("noteNew", result.newNote)

    });


    this.privateService.countNewPrivateMessage().subscribe((result) => {
      this.countNewMessage = result.count;
    });

    // ตรวจสอบว่าเป็นอุปกรณ์มือถือหรือแท็บเล็ตหรือไม่
    const userAgent = navigator.userAgent.toLowerCase();
    this.isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }
  ngDoCheck(): void {
    let noteOld = JSON.parse(sessionStorage.getItem("noteNew")!)
    if (this.countNewNote != noteOld) {
      this.countNewNote = noteOld
    }
  }


  checkFirstLogin() {
    if (sessionStorage.getItem("hiddenHeader") != "hidden") {
      if (this.currentUser.firstlogin == "true" && this.currentUser.ad == "false") {
        let checkActive = this.modalService.open(CheckFirstLogin, {
          centered: true,
          windowClass: "dialog-width",
          backdrop: "static",
          keyboard: false,
        });
        checkActive.componentInstance.activeKeep = 2;
        checkActive.componentInstance.btnclose = false;
      }
    }
  }

  openModal() {
    this.modalService.open(this.contentPDPA, {
      centered: true,
      windowClass: "dialog-width",
      backdrop: "static",
      keyboard: false,
    });
  }
  getCheckPdpa() {
    this.authService.getPdpa(this.uCode.employeeid).subscribe((result) => {
      this.checkPdpa = result.employeeConsent;
      this.dataPdpa = result.pdpa;
      if (this.checkPdpa?.status == 0) {
        this.openModal();
      } else {
        this.checkFirstLogin();
      }
    });
  }

  checkHRMenu() {
    this.http.get<ConfigModel[]>(environment.jbossUrl + "/capi/config/menu/global_menu").subscribe(result => {
      if (result.length > 0) {
        this.checkRole = true
      }
    })
    this.http.get<MenuModel[]>(environment.jbossUrl + "/capi/config/menu/workflow_menu").subscribe(result => {
      let menu = result.filter(e => e.code == "WFMENU")
      if (menu.length > 0) {
        this.wfMenu = true;
      }
    })

  }

  ngAfterViewInit() { }
  onSubmitPdpa() {
    let body = {
      model: {
        version: this.dataPdpa?.version,
        employeeId: this.uCode.employeeid,
      },
    };
    this.authService
      .savePdpa(body)
      .then((response) => { this.checkFirstLogin(); })
      .catch((reason) => { });
  }
  changeLanguage(lang: any) {
    sessionStorage.setItem("Lang", lang.code);
    this.translate.use(lang.code);
    this.selectedLanguage = lang.code;
    this.selectedLanguageIcon = lang.icon;
  }

  logout() {
    const currentPath = this.routes.url;
    const body = {
      currentPage: currentPath,
      action: false,
      sessionId: "",
      remoteIp: "",
      moduleName: "ESS",
      serverName: "",
    }
    this.logHistory.postActionLog(body).subscribe()
    this.authService.logout();
  }
  openModalSetting() {
    this.activeKeep = 1;
    this.modalService.open(CheckFirstLogin, { size: 'lg' })
  }
  openUrlApp() {
    window.location.href = 'zeeme://zeeserver.myhr.co.th/openapp';
  }

}
@Component({
  selector: "checkFirstLogin",
  templateUrl: "./checkFirstLogin.html",
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbModule, CdkScrollableModule, HttpClientModule]
})
export class CheckFirstLogin {
  @ViewChild("alertModal") alertModal: undefined;
  @ViewChild("confirmModal") confirmModal: undefined;
  @ViewChild("errorModal") errorModal: undefined;
  currentUser = JSON.parse(sessionStorage.getItem("currentUser")!);
  empProfile: EmployeeProfileModel | undefined;
  setCharacterPass: setCharacter | undefined;
  user_level = JSON.parse(sessionStorage.getItem("currentUser")!).user_level;
  user_role = JSON.parse(sessionStorage.getItem("currentUser")!).user_role;
  @Input() activeKeep: number = 1;
  @Input() btnclose: boolean = true;
  oldPassword = "";
  password = "";
  confirmPassword = "";
  checkPass = false;
  checkPassword = false;
  checkNumPassword = false
  checkLengthPassword = false
  checkSmallPassword = false
  passwordCharTH = "";
  passwordCharEN = "";
  validMin = 0;
  validMax = 0;
  validAZ = 0;
  validaz = 0;
  validNum = 0;
  validSpecial = 0;
  checkLang = "";
  test = "";

  msg = "";

  constructor(
    private modalService: NgbModal,
    public translate: TranslateService,
    private routes: Router,
    private authService: AuthService,
    private empService: EmployeeService,
    private workflowService: workflowService,
    private http: HttpClient
  ) {
    this.empService
      .getSetPass()
      .then((result) => {
        this.setCharacterPass = result;
        this.validMax = this.setCharacterPass.role!.passwordMax;
        this.validMin = this.setCharacterPass.role!.passwordMin;
        this.validAZ = this.setCharacterPass.role!.passwordStr;
        this.validaz = this.setCharacterPass.role!.passwordStrsm;
        this.validNum = this.setCharacterPass.role!.passwordNumber;
        this.validSpecial = this.setCharacterPass.role!.passwordSpecial;
      })
      .catch((reason) => {
        this.msg = reason.message;
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static",
        });
      });

    this.empService
      .getEmployeeProfile(this.currentUser.employeeid)
      .subscribe((result) => {
        this.empProfile = result;
      });
  }

  openModalSetting() {
    this.activeKeep = 1;
    this.modalService.open(CheckFirstLogin);
  }

  savePassword() {
    const M = this.password.match(/([A-Z])/g)
      ? this.password.match(/([A-Z])/g)!.length
      : 0;
    const m = this.password.match(/([a-z])/g)
      ? this.password.match(/([a-z])/g)!.length
      : 0;
    const num = this.password.match(/([0-9])/g)
      ? this.password.match(/([0-9])/g)!.length
      : 0;
    const special = this.password.match(/([@#+$%])/g)
      ? this.password.match(/([@#+$%])/g)!.length
      : 0;
    const checkoldPassword = this.currentUser.firstlogin == "true" ? this.oldPassword : sha1(this.oldPassword)
    this.authService
      .savePassword(
        checkoldPassword,
        this.password,
        this.checkLang,
        M.toString(),
        m.toString(),
        num.toString(),
        special.toString()
      )
      .then((response) => {
        if (response["success"]) {
          this.msg =
            this.translate.currentLang == "th"
              ? "การเปลี่ยนรหัสผ่านสำเร็จ"
              : "Change to Password Success ?";
          this.modalService.open(this.confirmModal, {
            centered: true,
            backdrop: "static",
          });
          this.loginAfterChangePass();
        } else {
          if (this.currentUser.firstlogin == "true") {
            this.currentUser.firstlogin = "false"
            this.savePassword()
          } else {
            this.msg = this.checkConfirm(response.message);
          }
        }
      })
      .catch((reason) => { });
  }

  loginAfterChangePass() {
    let body: LoginModel = {
      username: this.currentUser.username,
      password: this.password,
      dbName: sessionStorage.getItem('dbName')!,
      dbcomp: "100",
      lang: "th",
    };
    this.http
      .post<any>(environment.jbossUrl + "/usapi/authen", body)
      .subscribe(
        (response: any) => {
          sessionStorage.setItem("userToken", response.accessToken);
          sessionStorage.setItem(
            "currentUser",
            JSON.stringify(jwt_decode(response.accessToken))
          );
        }
      );
  }

  checkConfirm(status: string) {
    let th = "";
    let en = "";
    this.msg = status.split(":")[1];

    //alert(MyCode[200]);
    if (this.msg == "-6") {
      th = "รหัสผ่านนี้ถูกใช้ไปแล้ว";
      en = "password is used";
    }
    //alert(MyCode[202]);
    else if (this.msg == "-11") {
      th = "รหัสผ่านไม่ถูกต้อง";
      en = "password invalid";
    } else if (
      this.msg == "-7" ||
      this.msg == "-8" ||
      this.msg == "-9" ||
      this.msg == "-10"
    ) {
      th = "รหัสผ่านมีตัวเลขหรือตัวอักษรน้อยกว่าที่กำหนด";
      en = "Not enough number or charactor";
    }
    // ThaiCode[19] = "ลบข้อมูลเรียบร้อย";
    // EngCode[19] = "Delete data sucessfull";
    else if (this.msg == "4") {
      th = "ลบข้อมูลเรียบร้อย";
      en = "Delete data sucessfull";
    }
    // ThaiCode[18] = "แก้ใขข้อมูลเรียบร้อย";
    // EngCode[18] = "Update data sucessfull";
    else if (this.msg == "1" || this.msg == "2") {
      th = "แก้ใขข้อมูลเรียบร้อย";
      en = "Update data sucessfull";
    }
    // ThaiCode[17] = "เพิ่มข้อมูลไม่ได้";
    // EngCode[17] = "Can't save data";
    else if (this.msg == "-1" || this.msg == "-2" || this.msg == "-6") {
      th = "เพิ่มข้อมูลไม่ได้";
      en = "Can't save data";
    }
    this.msg = this.translate.currentLang == "th" ? th : en;
    this.modalService.open(this.errorModal, {
      centered: true,
      backdrop: "static",
    });
    return this.msg;
  }

  changePass() {
    const M = this.password.match(/([A-Z])/g);
    const m = this.password.match(/([a-z])/g);
    const num = this.password.match(/([0-9])/g);
    const special = this.password.match(/([@#+$%])/g);


    if (this.password.length < this.validMin || this.password.length > this.validMax) {
      this.passwordCharTH =
        "รหัสผ่านควรมีความยาว " +
        this.validMin +
        " - " +
        this.validMax +
        " ตัวอักษร ประกอบด้วย";
      this.passwordCharEN =
        "Password should have " +
        this.validMin +
        " - " +
        this.validMax +
        " character, Include";
      this.checkLengthPassword = true;
    } else {
      this.checkLengthPassword = false
      if ((M ? M.length : 0) < this.validAZ) {
        this.passwordCharTH = " ตัวอักษร [A-Z] อย่างน้อย " + this.validAZ;
        this.passwordCharEN = " characters [A-Z] least " + this.validAZ;
        this.checkPassword = true;
      } else {
        this.checkPassword = false;
        if ((m ? m.length : 0) < this.validaz) {
          this.passwordCharTH = " ตัวอักษร [a-z] อย่างน้อย " + this.validaz;
          this.passwordCharEN = " characters [a-z] least " + this.validaz;
          this.checkSmallPassword = true;
        } else {
          this.checkSmallPassword = false
          this.checkPassword = false;
          if ((num ? num.length : 0) < this.validNum) {
            this.passwordCharTH = " ตัวเลข [0-9] อย่างน้อย " + this.validNum;
            this.passwordCharEN = " Number [0-9] least  " + this.validNum;
            this.checkNumPassword = true;
          } else {
            this.checkNumPassword = false;
            if ((special ? special.length : 0) < this.validSpecial) {
              this.passwordCharTH =
                " อักขระพิเศษ [@#+$%] อย่างน้อย  " + this.validSpecial;
              this.passwordCharEN =
                " Special characters [@#+$%] least  " + this.validSpecial;
              this.checkPassword = true;
            } else {
              this.checkPassword = false;
            }
          }
        }
      }
    }
    if (this.confirmPassword.length > 0) {
      if (this.password === this.confirmPassword) {
        this.checkPass = false;
      } else {
        this.checkPass = true;
      }
    }

  }

  closeBtnClick() {
    this.modalService.dismissAll();
  }

  getDesc(status: string) {
    let statusDesc = "";
    if (status == "0") {
      statusDesc =
        this.translate.currentLang == "th"
          ? "รหัสผ่านถูกตั้งใหม่"
          : "Password has been reset";
    } else if (status == "1") {
      statusDesc =
        this.translate.currentLang == "th"
          ? "รหัสผ่านยังไม่หมดอายุ"
          : "Never Expired";
    } else if (status == "2") {
      statusDesc =
        this.translate.currentLang == "th"
          ? "รหัสผ่านหมดอายุตามวันที่"
          : "Password expire date";
    } else if (status == "3") {
      statusDesc =
        this.translate.currentLang == "th"
          ? "รหัสผ่านหมดอายุทันที"
          : "Immediately Expired";
    }
    return statusDesc;
  }
}
