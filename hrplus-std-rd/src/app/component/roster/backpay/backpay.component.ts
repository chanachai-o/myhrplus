import { ChangeDetectorRef, Component, Injectable, OnInit } from "@angular/core";
import localeThai from '@angular/common/locales/th'
import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, CommonModule } from "@angular/common";
import { NgbDate, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { EmployeeService } from "src/app/services/employee.service";
import { KerryBackPayDetailModel, KerryBackpayModel, KerryBackpayTypeModel, KerryEmpModel, KerryEmployeeModel, KerryPrefixModel } from "src/app/models/kerry-mix-model.model";
import { map } from "rxjs/operators";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { BackpayService } from "src/app/services/backpay.service";
import { ConfirmModalComponent } from "src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component";
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { KerryEmployeeModalComponent } from "../../shared-ui/modal-mix/kerry/employee/employee.component";
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule],
  selector: 'app-backpay',
  templateUrl: './backpay.component.html',
  styleUrls: ['./backpay.component.scss']
})
export class BackpayComponent implements OnInit {
  date = new NgbDate(0, 0, 0)
  employeeList: KerryEmployeeModel[] = []
  employee: KerryEmployeeModel = new KerryEmployeeModel({}, this.translateService)
  backPayDetailListClear: KerryBackPayDetailModel[] = []
  backPayDetailListLoading = false
  backPayDetailList: KerryBackPayDetailModel[] = []
  backPayDetailListCheck: KerryBackPayDetailModel[] = []
  backpaySearch = false
  backpay: KerryBackpayModel = new KerryBackpayModel({})
  employeeListLoading = false

  constructor(private employeeService: EmployeeService,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private cdr: ChangeDetectorRef,
    public datepickerService: DatepickerNgbService,
    private backpayService: BackpayService) {

  }

  ngOnInit(): void {
    this.getBackpayTypeList()
  }

  getBackpayTypeList() {
    this.backpayService.getTypeList().subscribe(response => {
      this.backPayDetailListClear = response.map(y => new KerryBackPayDetailModel({ backPayType: y }, this.translateService))
      this.clearBackpay()
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }

  openEmployeeModal() {
    if (!this.employeeList || this.employeeList.length === 0) {
      this.employeeService.getEmpSubordinates().subscribe(response => {
        this.employeeList = response.map(x => new KerryEmployeeModel(x, this.translateService));
        this.openEmployeeModal(); // เรียกใหม่หลังจากโหลดเสร็จ
      });
      return;
    }

    const modalRef = this.ngbModal.open(KerryEmployeeModalComponent, {
      centered: true,
      backdrop: "static",
      windowClass: 'dialog-width',
      size: 'lg'
    });
    modalRef.componentInstance.employeeList = this.employeeList;
    modalRef.componentInstance.empFilter = this.employeeList;
    modalRef.componentInstance.employeeListLoading = this.employeeListLoading;

    modalRef.result.then(result => {
      this.employee = new KerryEmployeeModel(result, this.translateService);
    });
  }


  clearBackpay() {
    this.backpaySearch = false
    this.date = new NgbDate(0, 0, 0)
    this.employeeList = []
    this.employee = new KerryEmployeeModel({}, this.translateService)
    this.backpay = new KerryBackpayModel({})
    this.backPayDetailList = this.backPayDetailListClear.map(x => new KerryBackPayDetailModel(x, this.translateService))
  }

  searchBackpay() {
    if (this.employee.getName() != "") {
      this.backPayDetailListLoading = true
      this.backpaySearch = true
      const date = this.formatYYYY_MM_DD(new Date(this.date.year + '-' + this.date.month + '-' + this.date.day))
      this.backpayService.get(this.employee.employeeId, date).pipe(map(x => new KerryBackpayModel({ ...x, dateId: date, employee: this.newKerryEmployeeModelToKerryEmpModel(this.employee) }))).subscribe(response => {
        this.backpay = response
        this.backpay.backPayDetailList.forEach(x => {
          const index = this.backPayDetailList.findIndex(y => y.backPayType.typeId == x.backPayType.typeId)
          if (index >= 0) {
            x.inputData = x.inputData.replace(/[^\d\.]/g, '').replace(/^\./g, '0.').replace(/(.*)\.(.*\..{0,2}).*/g, '$1$2').replace(/(.*)(\..{0,2}).*/g, '$1$2').replace(/^0+/g, '0').replace(/^0+(\d+)/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^,(.*)/g, '$1')
            this.backPayDetailList[index] = new KerryBackPayDetailModel(x, this.translateService)
          }
        })
        this.backPayDetailListCheck = this.backPayDetailList.map(x => new KerryBackPayDetailModel(x, this.translateService))
        this.backPayDetailListLoading = false
        this.cdr.markForCheck()
      }, error => {
        this.backPayDetailListLoading = false
        this.openAlertModal(error.message)
      })
    } else {
      this.openAlertModal(this.translateService.currentLang == "th" ? "กรุณาเลือกพนักงาน" : "Please select an employee.")
    }
  }

  saveBackpay() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.instant('Do you want to save data ?');
    modalRef.result.then(result => {
      this.backPayDetailList.map(x => new KerryBackPayDetailModel(x)).forEach((x, i) => {
        if (x.backPayType.tranType == this.backPayDetailListCheck[i].backPayType.tranType) {
          if (x.inputData != this.backPayDetailListCheck[i].inputData ||
            x.remark != this.backPayDetailListCheck[i].remark) {
            const index = this.backpay.backPayDetailList.findIndex(y => y.backPayType.typeId == x.backPayType.typeId)
            if (index >= 0) {
              this.backpay.backPayDetailList[index] = x
            } else {
              this.backpay.backPayDetailList.push(x)
            }
          }
        }
      })
      this.backpay.backPayDetailList = this.backpay.backPayDetailList.filter(x => {
        if (x.remark != "" || x.inputData != "") {
          x.period = this.formatYYYY_MM_DD(new Date(this.date.year + '-' + this.date.month + '-' + this.date.day))
          x.inputData = x.inputData.replace(/^(\d{1,2})$/g, '$1.00').replace(/(\d{3})$/g, '$1.00').replace(/(.*\.\d)$/g, '$10').replace(/(.*\.)$/g, '$100').split(',').join('')
          return x
        }
      })
      this.backpayService.post(this.backpay).then(response => {
        this.openAlertModal(response.message)
        this.cdr.markForCheck()
      }, error => {
        this.openAlertModal(error.message)
        this.cdr.markForCheck()
      })
    }, reason => {
    })

  }

  stringToMoney(text?: string) {
    return text ? text.replace(/[^\d\.]/g, '').replace(/^\./g, '0.').replace(/(.*)\.(.*\..{0,2}).*/g, '$1$2').replace(/(.*)(\..{0,2}).*/g, '$1$2').replace(/^0+/g, '0').replace(/^0+(\d+)/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^,(.*)/g, '$1').replace(/^(\d{1,2})$/g, '$1.00').replace(/(\d{3})$/g, '$1.00').replace(/(.*\.\d)$/g, '$10').replace(/(.*\.)$/g, '$100') : "0.00"
  }

  newKerryEmployeeModelToKerryEmpModel(data: KerryEmployeeModel) {
    return new KerryEmpModel({
      efname: data.efname,
      elname: data.elname,
      employeeId: data.employeeId,
      engFullName: data.getNameENG(),
      fname: data.fname,
      lname: data.lname,
      prefix: new KerryPrefixModel(data.prefix),
      thFullName: data.getNameTH(),
    }, this.translateService)
  }

  modelChange(fieldName: string, value?: string) {
    if (fieldName == 'employeeId') {
      this.backpaySearch = false
      this.backpay = new KerryBackpayModel({})
      this.backPayDetailList = this.backPayDetailListClear.map(x => new KerryBackPayDetailModel(x, this.translateService))
      const employee = this.employeeList.find(x => x.employeeId == value)
      if (employee) {
        this.employee = new KerryEmployeeModel(employee, this.translateService)
      } else {
        this.employee = new KerryEmployeeModel({ employeeId: value })
      }
      this.cdr.markForCheck()
    }
  }

  getKerryEmpWorkAreaByDate(value: any) {
    this.date = value
    this.backpaySearch = false
    this.employeeList = []
    this.employee = new KerryEmployeeModel({}, this.translateService)
    this.backpay = new KerryBackpayModel({})
    this.backPayDetailList = this.backPayDetailListClear.map(x => new KerryBackPayDetailModel(x, this.translateService))
    this.cdr.markForCheck()
    if (typeof this.date == "object") {
      const date = this.formatYYYY_MM_DD(new Date(this.date.year + '-' + this.date.month + '-' + this.date.day))
      this.employeeService.getKerryEmpWorkAreaByDate(date).pipe(map(x => x.map(y => new KerryEmployeeModel(y, this.translateService)))).subscribe(response => {
        this.employeeList = response
        this.employee = new KerryEmployeeModel({}, this.translateService)
        this.cdr.markForCheck()
      }, error => {
        this.openAlertModal(error.message)
      })
    }
  }

  formatYYYY_MM_DD(date: Date) {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
      this.ngbModal.dismissAll()
    }, reason => {
    })
  }

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == "th" ? (th ? th : (eng ? eng : '')) : (eng ? eng : (th ? th : ''))
  }

}
