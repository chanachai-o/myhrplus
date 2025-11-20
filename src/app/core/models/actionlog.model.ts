export interface ActionLogModel {
  logid?: string;
  userCode?: string;
  sessionId?: string;
  remoteIp?: string;
  loginDate?: string;
  loginTime?: string;
  logoutDate?: string;
  logoutTime?: string;
  loginStatus?: string;
  logoutStatus?: string;
  wrongpwd?: string;
  serverName?: string;
  moduleName?: string;
  currentPage?: string;
}
