import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbDatepickerModule,
  NgbModal,
  NgbPaginationModule,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { EmployeeProcessModel } from "src/app/models/employeeprocess.model";
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbPaginationModule],
  selector: "app-process-emp",
  templateUrl: "./process-emp.component.html",
  styleUrls: ["./process-emp.component.scss"],
})
export class ProcessEmpComponent implements OnInit {
  @ViewChild("alertModal") alertModal: undefined;
  @ViewChild("confirmModal") confirmModal: undefined;
  currentDate = new Date();
  re = /\//gi;
  startDate = new NgbDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  );
  endDate = new NgbDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  loading = false;
  submitLoading = false; // Added submitLoading property

  modelEmp: EmployeeProcessModel[] = [];
  modelEmpSubmit: EmployeeProcessModel[] = [];
  msg = "";
  nameModal = "";
  selectModelEmp: any;
  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    public translateService: TranslateService,
    private employeeService: EmployeeService,
    public datepickerService: DatepickerNgbService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getProcessEmp();
  }

  getProcessEmp() {
    this.modelEmp = [];
    this.modelEmpSubmit = [];
    this.loading = true;
    let datestart = this.ngbDateParserFormatter
      .format(this.startDate)
      .replace(this.re, "-")
      .split("-");
    let dateend = this.ngbDateParserFormatter
      .format(this.endDate)
      .replace(this.re, "-")
      .split("-");
    let fristdate = datestart[2] + "-" + datestart[1] + "-" + datestart[0];
    let lastdate = dateend[2] + "-" + dateend[1] + "-" + dateend[0];
    this.employeeService.getProcessEmp(fristdate, lastdate).then((reuslt) => {
      this.modelEmp = reuslt.map(
        (e: any) => new EmployeeProcessModel(e, this.translateService)
      );
      this.modelEmp.forEach((x) => {
        x["check"] = false;
      });
      this.loading = false;
    });
  }
  selectAllEmp(event: boolean) {
    this.modelEmp.map((x) => (x["check"] = event));
  }
  unSelectAll() {
    this.modelEmp.map((x) => (x["check"] = false));
  }
  onSubmit() {
    this.submitLoading = true; // Set submitLoading to true
    this.modelEmpSubmit = this.modelEmp.filter((x) => x["check"] == true);
    this.modelEmpSubmit.forEach((i) => {
      delete i["check"];
    });
    this.modelEmpSubmit = this.modelEmpSubmit.map(
      (e: any) => new EmployeeProcessModel({ ...e })
    );
    this.postWaiver();
  }
  postWaiver() {
    this.employeeService
      .postEmployeeWaiver(this.modelEmpSubmit)
      .then((result) => {
        this.msg =
          this.translateService.currentLang == "th"
            ? "บันทึกข้อมูลเรียบร้อย"
            : result.message;
        this.modalService
          .open(this.alertModal, {
            centered: true,
            backdrop: "static",
          })
          .result.then(
            (result) => {},
            (reason) => {
              if (reason == "Close") {
                setTimeout(() => {
                  this.ngOnInit();
                }, 500);
              }
            }
          );
        this.submitLoading = false; // Reset submitLoading on success
      })
      .catch((error) => {
        this.msg = error.error.error;
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static",
        });
        this.submitLoading = false; // Reset submitLoading on error
      });
  }
  onTransformData(date: string) {
    let coverDate = date.split("-");
    return coverDate[2] + "-" + coverDate[1] + "-" + coverDate[0];
  }

  onSubmitWaiver() {
    this.submitLoading = true; // Set submitLoading to true
    delete this.selectModelEmp["check"];
    this.modelEmpSubmit.push(new EmployeeProcessModel(this.selectModelEmp));
    this.modelEmpSubmit = this.modelEmpSubmit.map(
      (e: any) => new EmployeeProcessModel({ ...e })
    );
    this.postWaiver();
  }

  checkDateFormat(date: NgbDate): boolean {
    let parseDate = this.ngbDateParserFormatter.format(date);
    let dateCheck = parseDate !== "00/00/0" ? parseDate.split("/") : [];
    if (
      dateCheck.length == 3 &&
      dateCheck[0].length > 0 &&
      dateCheck[0].length <= 2 &&
      dateCheck[1].length > 0 &&
      dateCheck[1].length <= 2 &&
      dateCheck[2].length > 0
    ) {
      return true;
    }
    return false;
  }
  onCheckSubmit() {
    if (this.modelEmp.find((x) => x["check"] == true)) {
      this.openOnSubmit("saveall", "");
    } else {
      this.msg =
        this.translateService.currentLang == "th"
          ? "กรุณาเลือกพนักงานที่ต้องการสละสิทธิ์เริ่มงาน"
          : "Please select Employee";
      this.modalService.open(this.confirmModal, {
        centered: true,
        backdrop: "static",
      });
    }
  }

  openOnSubmit(name: string, item: any) {
    this.nameModal = name;
    if (name == "save") {
      this.msg = this.translateService.instant("Do you want to save data ?");
      this.selectModelEmp = item;
    }
    if (name == "saveall") {
      this.msg = this.translateService.instant("Do you want to save data ?");
    }
    this.modalService
      .open(this.confirmModal, {
        centered: true,
        backdrop: "static",
      })
      .result.then(
        (result) => {},
        (reason) => {
          if (reason == "Close") {
            this.nameModal = "";
          }
        }
      );
  }
}
