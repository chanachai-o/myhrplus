import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { Event, NavigationEnd, NavigationError, NavigationStart, Router, RouterModule } from "@angular/router";
import {
  EmployeeProfileModel,
  MyEmployeeProfileModel,
} from "src/app/models/employeeprofilemodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { environment } from "src/environments/environment";
import { RouteInfo } from "./vertical-sidebar.metadata";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ShowLoadingDirective } from "src/app/component/shared-ui/image/show-loading.directive";
import { FeatherModule } from 'angular-feather';


export interface ConfigModel {
  code: string;
  tName: string;
  eName: string;
}
@Component({
  selector: "app-vertical-sidebar",
  templateUrl: "./vertical-sidebar.component.html",
  styleUrls: ['./vertical-sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ShowLoadingDirective, FeatherModule]
})
export class VerticalSidebarComponent {
  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  showMenu = "";
  showSubMenu = "";
  public sidebarnavItems: RouteInfo[] = [];
  path = "";
  empProfile: EmployeeProfileModel | undefined;
  currentUser = JSON.parse(sessionStorage.getItem("currentUser")!);
  tokenUser = sessionStorage.getItem("userToken")!;
  configMenuList: ConfigModel[] | undefined;
  currentRoute = "";
  MENUITEMS: RouteInfo[] = [
    {
      path: "/company/home",
      title: "menu.home",
      icon: "home",
      class: "",
      extralink: false,
      submenu: [],
      code: "EM00A",
      show: true,
    },
    {
      path: "",
      title: "menu.company",
      icon: "domain",
      class: "has-arrow",
      extralink: false,
      code: "EM01A",
      show: true,
      submenu: [
        {
          path: "/company/company-profile",
          title: "menu.company-profile",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM01A01",
          show: true,
        },
        {
          path: "/company/vision-mission",
          title: "menu.vision-mission",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM01A02",
          show: true,
        },
        {
          path: "/company/orgchart",
          title: "menu.orgchart",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM01A20",
          show: true,
        },
        // {
        //   path: "/company/orgchartNew",
        //   title: "menu.orgchart (new)",
        //   icon: "",
        //   class: "",
        //   extralink: false,
        //   submenu: [],
        //   code: "EM01A201",
        //   show: true,
        // },
        // {
        //   path: "/company/orgchartNew2",
        //   title: "menu.orgchart (new)",
        //   icon: "",
        //   class: "",
        //   extralink: false,
        //   submenu: [],
        //   code: "EM01A201",
        //   show: true,
        // },
        // {
        //   path: "/company/orgchartSale",
        //   title: "OrgchartSale",
        //   icon: "",
        //   class: "",
        //   extralink: false,
        //   submenu: [],
        //   code: "EM01A20",
        //   show: true,
        // },
        {
          path: "/company/policy",
          title: "menu.policy",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM01A05",
          show: true,
        },
        {
          path: "/company/calendar-company",
          title: "menu.calendar-company",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM01A08",
          show: true,
        },
        {
          path: "/company/employee-list",
          title: "menu.employee-list",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM01A21",
          show: true,
        },
        // {
        //   path: "https://zeeserver-dev.myhr.co.th/#/auth/login-myhr/"+this.tokenUser,
        //   title: "ZeeMe Interface",
        //   icon: "",
        //   class: "",
        //   extralink: false,
        //   submenu: [],
        //   code: "EM01A15",
        //   show: true,
        // },
        {
          path: "/company/oil-price",
          title: "Oil Price",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM01A16",
          show: true,
        },
        {
          path: "/company/rate-perround",
          title: "Rate Perround",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EM01A17",
          show: true,
        },
        {
          path: "/company/allowance",
          title: "Allowance",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EM01A18",
          show: true,
        },
        {
          path: "/company/high-cost",
          title: "High cost",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EM01A19",
          show: true,
        },
        {
          path: "/company/shift",
          title: "Shift Allowance",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EM01A22",
          show: true,
        },
        {
          path: "/company/work-area-group",
          title: "Work Area Group",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EM01A23",
          show: true,
        },
      ],
    },
    {
      path: "",
      title: "menu.employee",
      icon: "person",
      class: "has-arrow",
      extralink: false,
      code: "EM02A",
      show: true,
      submenu: [
        {
          path: "/employee/employee-profile",
          title: "menu.employee-profile",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A01",
          show: true,
        },
        {
          path: "/employee/employee-work-information",
          title: "menu.employee-work-information",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A03",
          show: true,
        },
        {
          path: "/employee/employee-timestamp",
          title: "menu.employee-timestamp",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A08",
          show: true,
        },
        {
          path: "/employee/employee-time-warning",
          title: "menu.employee-time-warning",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A07",
          show: true,
        },
        {
          path: "/employee/employee-attendance",
          title: "menu.employee-attendance",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A04",
          show: true,
        },
        {
          path: "/employee/employee-leaverole",
          title: "menu.employee-leaverole",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A05",
          show: true,
        },
        {
          path: "/employee/employee-otstatistic",
          title: "menu.employee-otstatistic",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A221",
          show: true,
        },
        {
          path: "/employee/employee-leavestatistic",
          title: "menu.employee-leavestatistic",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A222",
          show: true,
        },
        {
          path: "/employee/employee-edittimestatistic",
          title: "menu.employee-edittimestatistic",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A223",
          show: true,
        },
        {
          path: "/employee/working-history-data",
          title: "menu.working-history-data",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A09",
          show: true,
        },
        {
          path: "/employee/employee-payslip",
          title: "menu.employee-payslip",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A21",
          show: true,
        },
        {
          path: "/employee/employee-twi50",
          title: "menu.employee-twi50",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A29",
          show: true,
        },
        {
          path: "/employee/employee-pnd91",
          title: "menu.employee-pnd91",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A30",
          show: true,
        },
        {
          path: "/employee/pi-shiftplan",
          title: "Shift Plan",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A10",
          show: true,
        },
      ],
    },
    {
      path: "",
      title: "menu.empview-welfare",
      icon: "mood",
      class: "has-arrow",
      extralink: false,
      code: "EMP03A06",
      show: true,
      submenu: [
        {
          path: "/welfare/welfare-check",
          title: "History of welfare",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A23",
          show: true,
        },
        {
          path: "/welfare/welfare-history",
          title: "History of Welfare Using",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A18",
          show: true,
        },
      ],
    },
    // forsale ///////////////////////
    {
      path: "",
      title: "menu.appraisal",
      icon: "stacked_line_chart",
      class: "has-arrow",
      extralink: false,
      code: "EM02ADEMO",
      show: true,
      submenu: [{
        path: "/appraisal/aps-ability-list-tkc",
        title: "menu.ability.evaluation.tkc",
        icon: "",
        class: "",
        extralink: false,
        submenu: [],
        code: "EM02ADEMO",
        show: true,
      },
      ]
    },
    {
      path: "",
      title: "menu.empview-traning",
      icon: "local_library",
      class: "has-arrow",
      extralink: false,
      code: "EMP03A09",
      show: true,
      submenu: [
        {
          path: "/training/traning-plan",
          title: "menu.traning-plan",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A091",
          show: true,
        },
        {
          path: "/training/traning-history",
          title: "menu.traning-history",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A091",
          show: true,
        },
        {
          path: "/training/traning-recommend",
          title: "menu.traning-recommend",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A091",
          show: true,
        },
      ],
    },
    {
      path: "",
      title: "menu.empview-emp-supervisor",
      icon: "supervisor_account",
      class: "has-arrow",
      extralink: false,
      code: "EM05A",
      show: true,
      submenu: [
        {
          path: "/supervisor/sup-emp-list",
          title: "menu.sup-emp-list",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A05",
          show: true,
        },
        {
          path: "/supervisor/summary-data",
          title: "Summary Data",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A0307",
          show: true,
        },
        {
          path: "/supervisor/import-summary-data",
          title: "Import Summary Data",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A0308",
          show: true,
        },
        {
          path: "/supervisor/process-emp",
          title: "Disclaimed Processing",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EM05A0311",
          show: true,
        },
        {
          path: "/supervisor/sup-timestamp",
          title: "menu.sup-timestamp",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A09",
          show: true,
        },
        {
          path: "/supervisor/working-time-detail-device",
          title: "menu.working-time-detail-device",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A59",
          show: true,
        },
        {
          path: "/supervisor/sup-time-warning",
          title: "menu.sup-time-warning",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A08",
          show: true,
        },
        {
          path: "/supervisor/sup-timeattendance",
          title: "menu.sup-timeattendance",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A06",
          show: true,
        },
        {
          path: "/supervisor/set-dayoff",
          title: "menu.set-dayoff",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A18",
          show: true,
        },
        {
          path: "/supervisor/working-time-detail-history",
          title: "menu.working-time-detail-history",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A10",
          show: true,
        },
        {
          path: "/supervisor/sup-leavestatistic",
          title: "menu.sup-leavestatistic2",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A17",
          show: true,
        },
        {
          path: "/supervisor/setup-shift-employees",
          title: "menu.setup-shift-employees",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP05A0301",
          show: true,
        },
        {
          path: "/supervisor/daily-time-attendance",
          title: "menu.daily-time-attendance",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A0901",
          show: true,
        },
        {
          path: "/supervisor/sup-training-history",
          title: "menu.sup-training-history",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A11",
          show: true,
        },
        // ทะเบียน
        {
          path: "/supervisor/subordinate-group",
          title: "menu.subordinate-group",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP05A061",
          show: true,
        },
        {
          path: "/supervisor/workingtime-pattern",
          title: "menu.workingtime-pattern",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP05A062",
          show: true,
        },
        {
          path: "/supervisor/import-mtime2",
          title: "menu.import-mtime2",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A011",
          show: true,
        },
        {
          path: "/supervisor/pi-shiftplan-sub",
          title: "Work Schedule",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A0306",
          show: true,
        },
        {
          path: "/supervisor/transfer-temporary",
          title: "Transfer Temporary",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EM05A0309",
          show: true,
        },
        {
          path: "/supervisor/transfer-manager",
          title: "Transfer Manager",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EM05A0310",
          show: true,
        },
      ],
    },
    // แบบประเมิน (ยังไม่มีรหัสเมนู)
    {
      path: "",
      title: "Appraisal",
      icon: "stacked_line_chart",
      class: "has-arrow",
      extralink: false,
      code: "EM04",
      show: true,
      submenu: [
        {
          path: "/appraisal/probationary-evaluation-form",
          title: "Probationary Evaluation Form",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM0467",
          show: true,
        },
        {
          path: "/appraisal/acting-appraisal-form",
          title: "Acting Appraisal Form",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM0468",
          show: true,
        },
        {
          path: "/appraisal/annual-performance-evaluation-form",
          title: "Annual performance evaluation form",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM0469",
          show: true,
        },
      ],
    },
    {
      path: "",
      title: "menu.recruitment",
      icon: "person_add",
      class: "has-arrow",
      extralink: false,
      code: "EMP05A05",
      show: true,
      submenu: [
        // {
        //   path: "/myjob-recruit",
        //   title: "menu.rec-applicant (Myjob)",
        //   icon: "",
        //   class: "",
        //   extralink: false,
        //   submenu: [],
        //   code: "EMP05A05",
        //   show: true,
        // },
        {
          path: "/recruitment/rec-applicant",
          title: "menu.rec-applicant",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A01",
          show: true,
        },
        {
          path: "/recruitment/rec-candidate",
          title: "menu.rec-candidate",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A02",
          show: true,
        },
        {
          path: "/recruitment/table-candidate",
          title: "menu.table-candidate",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM05A03",
          show: true,
        },
      ],
    },
    // บัญชีผู้ใช้
    {
      path: "",
      title: "menu.user",
      icon: "local_police",
      class: "has-arrow",
      extralink: false,
      code: "EMP03A10",
      show: true,
      submenu: [
        {
          path: "/user/emp-login",
          title: "menu.emp-login",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A19",
          show: true,
        },
        {
          path: "/user/emp-online",
          title: "menu.emp-online",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM02A20",
          show: true,
        },
      ],
    },
    {
      path: "",
      title: "Roster",
      icon: "group_work",
      class: "has-arrow",
      extralink: false,
      code: "EMP03A11",
      show: true,
      submenu: [
        // จัดการข้อมูลการทำงาน
        {
          path: "/roster/daily-time-attendance-k",
          title: "Daily Time Attendance",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EMP03A1111",
          show: true,
        },
        // ข้อมูลแผนการทำงาน
        {
          path: "/roster/result-of-work",
          title: "Working Plan",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: ยังไม่มีผูกไว้กับ รายงานสรุปชั่วโมงการทำงาน Workarea
          code: "EMP03A1116",
          show: true,
        },
        // รายงานสรุปชั่วโมงการทำงาน Workarea
        {
          path: "/roster/summary-work-hour-report-by-store",
          title: "Summary Work Hour Report Workarea",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A1110",
          show: true,
        },
        // ตารางวันหยุดพนักงาน
        {
          path: "/roster/memployee-holiday",
          title: "Memployee Holiday",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A111",
          show: true,
        },
        // Leader Approved Workarea
        {
          path: "/roster/rgm-approved-by-store",
          title: "Leader Approved Workarea",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EMP03A1113",
          show: true,
        },
        // Manager Approved Workarea
        {
          path: "/roster/ac-approved-by-store",
          title: "Manager Approved Workarea",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A112",
          show: true,
        },
        // Manager Approved All Workarea
        {
          path: "/roster/ac-approved-all-store",
          title: "Manager Approved all Workarea",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A113",
          show: true,
        },
        // ตกเบิก
        {
          path: "/roster/backpay",
          title: "Backpay",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A115",
          show: true,
        },
        // สรุปรายการตกเบิกสำหรับ Leader & Manager
        {
          path: "/roster/report-backpay-rgm-ac",
          title: "Report Backpay For Leader & Manager",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A118",
          show: true,
        },
        // อนุมัติรายได้ – รายหักอื่นๆ โดย Leader
        {
          path: "/roster/income-deduction-approved-rgm",
          title: "Income and Deduction Approved by Leader",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EMP03A1114",
          show: true,
        },
        // อนุมัติรายได้ – รายหักอื่นๆ โดย Manager
        {
          path: "/roster/income-deduction-approved-ac",
          title: "Income and Deduction Approved by Manager",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EMP03A1115",
          show: true,
        },
        // สรุปรายการตกเบิก (Workarea)
        {
          path: "/roster/list-backpay-store",
          title: "List Backpay (Workarea)",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A116",
          show: true,
        },
        // list-backpay
        {
          path: "/roster/list-backpay",
          title: "List Backpay",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A117",
          show: true,
        },
        // Approve Status
        {
          path: "/roster/approve-status",
          title: "Approve Status",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A114",
          show: true,
        },
        // Wage Sheet For Append
        {
          path: "/roster/wage-sheet-append",
          title: "Wage Sheet For Append",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A119",
          show: true,
        },

        // จัดการข้อมูลการทำงาน (ใหม่)
        {
          path: "/roster/daily-time-attendance-new",
          title: "Daily Time Attendance New",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EMP03A1112",
          show: true,
        },

      ],
    },
    {
      path: "",
      title: "Roster (Center)",
      icon: "group_work",
      class: "has-arrow",
      extralink: false,
      code: "EMP03A12",
      show: true,
      submenu: [
        // จัดการข้อมูลการทำงาน
        {
          path: "/roster-center/daily-time-attendance-k-center",
          title: "Daily Time Attendance",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: "???????", Mock
          code: "EMP03A1211",
          show: true,
        },
        // ข้อมูลแผนการทำงาน
        {
          path: "/roster-center/result-of-work-center",
          title: "Working Plan",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          // code: ยังไม่มีผูกไว้กับ รายงานสรุปชั่วโมงการทำงาน Workarea
          code: "EMP03A1216",
          show: true,
        },
        // รายงานสรุปชั่วโมงการทำงาน Workarea
        {
          path: "/roster-center/summary-work-hour-report-by-store-center",
          title: "Summary Work Hour Report Workarea",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A1210",
          show: true,
        },
        // ตารางวันหยุดพนักงาน
        {
          path: "/roster-center/memployee-holiday-center",
          title: "Memployee Holiday",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EMP03A121",
          show: true,
        }
      ],
    },
    {
      path: "",
      title: "menu.empview-workflow",
      icon: "flowsheet",
      class: "has-arrow",
      extralink: false,
      code: "EM03A",
      show: true,
      submenu: [
        {
          path: "/workflow/myhr-in-box",
          title: "menu.myhr-in-box",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM03A",
          show: true,
        },
        {
          path: "/workflow/myhr-center-box",
          title: "menu.myhr-center-box",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM03A",
          show: true,
        },
        {
          path: "/workflow/myhr-out-box",
          title: "menu.myhr-out-box",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "EM03A",
          show: true,
        },
      ],
    },
    {
      path: "",
      title: "Private Message",
      icon: "chat_bubble_outline",
      class: "has-arrow",
      extralink: false,
      code: "",
      show: true,
      submenu: [
        {
          path: "/private-message/private-message-inbox",
          title: "Inbox",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "",
          show: true,
        },
        {
          path: "/private-message/private-message-outbox",
          title: "Sentbox",
          icon: "",
          class: "",
          extralink: false,
          submenu: [],
          code: "",
          show: true,
        },
      ],
    },

  ];

  constructor(
    private router: Router,
    private empService: EmployeeService,
    public cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {

    this.empService
      .getEmployeeProfile(this.currentUser.employeeid)
      .subscribe((result) => {
        this.empProfile = result;
        this.cdr.markForCheck();
      });



    this.http
      .get<ConfigModel[]>(environment.jbossUrl + "/capi/config/menu/emv_menu")
      .subscribe((result) => {
        this.configMenuList = result;
        this.configMenuList?.forEach((items) => {
          for (let i = 0; i < this.MENUITEMS.length; i++) {
            if (this.MENUITEMS[i].code == "EM02ADEMO" && window.location.origin.includes("demo")) { //FORSALE
              this.MENUITEMS[i].show = true;
            }
            if (items.code == this.MENUITEMS[i].code) {
              this.MENUITEMS[i].show = true;
            }
            for (let j = 0; j < this.MENUITEMS[i].submenu.length; j++) {
              if (items.code == this.MENUITEMS[i].submenu[j].code) {
                this.MENUITEMS[i].submenu[j].show = true;
              }
              if (this.MENUITEMS[i].code == "EM02ADEMO" && window.location.origin.includes("demo")) { //FORSALE
                this.MENUITEMS[i].submenu[j].show = true;
              }
            }
          }
        });
        this.sidebarnavItems = this.MENUITEMS;
        this.sidebarnavItems.filter((m) =>
          m.submenu.filter((s) => {
            if (s.path === this.router.url) {
              this.path = m.title;
            }
          })
        );
        this.addExpandClass(this.path);
        this.cdr.markForCheck();
      });

    // this.menuServise.items.subscribe((menuItems) => {

    //   // Active menu
    // });

    // เช็คเมนู URL
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.currentRoute = event.url;
        // console.log("this.sidebarnavItems",this.currentRoute)
        this.sidebarnavItems.filter((m) =>
          m.submenu.filter((s) => {
            if (s.path === this.currentRoute) {
              if (s.show == false) {
                this.router.navigate(['/dashboards']);
              }
              // console.log('Route change detected');
            }
          })
        );
      }
    });


  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = "0";
    } else {
      this.showSubMenu = element;
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  handleNotify() {
    this.notify.emit(!this.showClass);
  }
}
