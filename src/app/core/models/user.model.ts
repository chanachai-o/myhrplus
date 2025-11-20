import { BaseModel, TranslateService } from './base.model';
import { Employee, MyEmployee } from './employee.model';
import { MyRole, Role } from './role.model';

/**
 * User model
 */
export interface User {
  usernameId: string;
  empId: string;
  userRole: string;
  lang: string;
  role?: Role;
  employee?: Employee;
}

export class MyUser extends BaseModel implements User {
  usernameId: string = '';
  empId: string = '';
  userRole: string = '';
  lang: string = '';
  role?: Role;
  employee?: Employee;

  constructor(data: Partial<User>, translateService: TranslateService) {
    super(data, translateService);
    this.usernameId = data.usernameId || '';
    this.userRole = data.userRole || '';
    this.lang = data.lang || '';
    this.role = data.role
      ? new MyRole(data.role, this.translateService!)
      : data.role;
    this.employee = data.employee
      ? new MyEmployee(data.employee, this.translateService!)
      : data.employee;
  }
}
