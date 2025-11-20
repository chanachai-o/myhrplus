import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { Employee, MyEmployee } from "./employee.model";
import { MyRole, Role } from "./role.model";

export interface setCharacter {
  usernameId: string;
  empId: string;
  userRole: string;
  lang: string;
  role?: Role;
  employee?: Employee;
  defaultpage?: string;
}
export class MysetCharacter extends BaseModel implements setCharacter {
  usernameId: string = "";
  empId: string = "";
  userRole: string = "";
  lang: string = "";
  role?: Role;
  employee?: Employee;
  defaultpage?: string;

  constructor(data: Partial<setCharacter>, translateService: TranslateService) {
    super(data , translateService);
    this.usernameId  = data.usernameId!;
    this.empId  = data.empId! ;
    this.userRole  = data.userRole!;
    this.lang  = data.lang!;
    this.role = data.role ? new MyRole(data.role!, this.translateService) : data.role;
    this.employee = data.employee ? new MyEmployee(data.employee!, this.translateService) : data.employee;
    this.defaultpage = data.defaultpage;

  }

}
