import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { MyUser, User } from "./user.model";

export interface OnlineUser {
  logid: string;
  userCode: string;
  sessionId: string;
  remoteIp: string;
  loginDate: string;
  loginTime: string;
  logoutDate: string;
  logoutTime: string;
  loginStatus: string;
  logoutStatus: string;
  wrongpwd?: any;
  serverName: string;
  moduleName: string;
  currentPage: string;
  user?: User;
}
export class MyOnlineUser extends BaseModel implements OnlineUser {
  logid: string = "";
  userCode: string = "";
  sessionId: string = "";
  remoteIp: string = "";
  loginDate: string = "";
  loginTime: string = "";
  logoutDate: string = "";
  logoutTime: string = "";
  loginStatus: string = "";
  logoutStatus: string = "";
  wrongpwd?: any = "";
  serverName: string = "";
  moduleName: string = "";
  currentPage: string = "";
  user?: User;

  constructor(data: Partial<OnlineUser>, translateService: TranslateService) {
    super(data , translateService);
    this.logid  = data.logid!;
    this.userCode  = data.userCode! ;
    this.sessionId  = data.sessionId!;
    this.remoteIp  = data.remoteIp!;
    this.loginDate  = data.loginDate!;
    this.loginTime  = data.loginTime!;
    this.loginStatus  = data.loginStatus!;
    this.logoutStatus  = data.logoutStatus!;
    this.wrongpwd  = data.wrongpwd!;
    this.serverName  = data.serverName!;
    this.moduleName  = data.moduleName!;
    this.currentPage  = data.currentPage!;
    this.user = data.user ? new MyUser(data.user!, this.translateService) : data.user;
  }

}

