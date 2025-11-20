import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Country, MyCountry } from 'src/app/models/country.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import localeThai from '@angular/common/locales/th';

import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, Location, registerLocaleData, TranslationWidth } from '@angular/common'
import { Pwf001DetailComponent } from '../pwf001-detail/pwf001-detail.component';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { MyWorkflowRemarkModel } from 'src/app/models/workflowremarkmodel.model';
import { DatepickerNgbService } from "src/app/services/datepicker-ngb.service";
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';

interface CertificateModel {
  code: string
  desc: string
  isShow?: boolean
  thaShow?: boolean
  engShow?: boolean
  visaShow?: boolean
  completed?: boolean
}

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    Pwf001DetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  selector: 'app-pwf001-create',
  templateUrl: './pwf001-create.component.html',
  styleUrls: ['./pwf001-create.component.scss']
})
export class Pwf001CreateComponent implements OnInit {
  @Input() data: any;
  employeeCCId = ""
  wfid = "2001"
  runno?: string
  employeeProfile?: WorkingsModel
  certificatesList: CertificateModel[] = [
    { code: "1", desc: "pwf001.visa.for.international.travel", visaShow: true, engShow: true, completed: true },
    { code: "6", desc: "pwf001.certificate.for.gsb", thaShow: true, completed: false },
    { code: "3", desc: "pwf001.employee.certificate.with.salary", thaShow: true, completed: false },
    { code: "4", desc: "pwf001.employee.certificate", thaShow: true, completed: false },
    // { code: "5", desc: "pwf001.certificate.for.ktb", completed: false },
    // { code: "6", desc: "pwf001.visa.for.international.seminar", completed: false },
    { code: "7", desc: "pwf001.certificate.for.ghb", thaShow: true, completed: false },
    { code: "C", desc: "pwf001.book.through", thaShow: true, engShow: true, completed: false },
  ]
  certificatesSelect = this.certificatesList[0]
  thaiCheckbox = false
  engCheckbox = false
  thaiNum = 0
  engNum = 0

  countryList: Country[] = []
  countrySelect: Country = new MyCountry({}, this.translateService)
  pageCountry = 1
  pageSizeCountry = 10
  currentDate = new Date()
  startDate: NgbDate | undefined
  endDate: NgbDate | undefined

  remark = ""
  workflowData: any
  referenceParam = ""
  screenObj: any
  inputs = {
    data: {}
  }
  dynamicComponent: any

  timestampFile: any
  newFile: any
  uploadFilename: any
  uploadFileSize: any
  nameFile = "browse_file"
  uploadConfig: any
  @ViewChild("fileInput") fileInput?: ElementRef
  constructor(private local: Location,
    private wfs: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public translateService: TranslateService,
    private ngbModal: NgbModal,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private empService: EmployeeService,
    public datepickerService: DatepickerNgbService,
    public SwaplangCodeService: SwaplangCodeService) {
    this.getuploadWFApi()
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid")!
      this.runno = result.get("runno")!
    })
    this.empService.getWorkInformation().subscribe(result => {
      this.employeeProfile = new MyWorkingsModel(result, this.translateService)
      this.cdr.markForCheck();
    }, error => {
      this.openAlertModal(error.message)
    })
    this.wfs.getCountry().subscribe(result => {
      this.countryList = result.map(x => new MyCountry(x, this.translateService))
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck();
    }, error => {
      this.openAlertModal(error.message)
    })
    this.getSwaplangCode()
  }

  getuploadWFApi() {
    this.wfs.getuploadWF().subscribe((result) => {
      this.uploadConfig = result
    })
  }
  async onFileSelected(event: any) {
    var files = event.target.files
    if (files.length > 0) {
      if (files[0].name != this.nameFile) {
        var reader: any = new FileReader()
        reader = new FileReader()
        reader.onload = () => {
          const json = btoa(reader.result)
          this.newFile = json
        }
        reader.readAsBinaryString(files[0])
        this.uploadFilename = files[0].name
        this.uploadFileSize = files[0].size
        if (this.uploadFileSize > this.uploadConfig.maxSize) {
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        }
        else {
          await this.delay(100);
          this.onUploadPicture()
        }
      }
    }
    this.fileInput!.nativeElement.value = ""
  }
  async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  onUploadPicture() {
    if (this.newFile) {
      let date = new Date()
      this.timestampFile = date.getTime()
      let body = {
        uploadfield: "attached_file_temp.file_name",
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      }
      this.wfs.postuploadWF(body).subscribe(result => {
        if (!result.success) {
          this.timestampFile = ""
          this.nameFile = "browse_file"
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.")
        } else {
          this.nameFile = body.fileName
        }

      })
    }
    this.ngbModal.dismissAll()
  }
  resetIMG() {
    this.timestampFile = ""
    this.nameFile = "browse_file"
  }

  onSubmit() {
    let startDate = this.ngbDateParserFormatter.format(this.startDate!).replace(/\//gi, "-").split("-").reverse().join("-")
    let endDate = this.ngbDateParserFormatter.format(this.endDate!).replace(/\//gi, "-").split("-").reverse().join("-")
    if (parseInt(startDate.split("-").join("")) > parseInt(endDate.split("-").join(""))) {
      let newEndDate = startDate
      startDate = endDate
      endDate = newEndDate
      this.startDate = new NgbDate(parseInt(startDate.split("-")[0]), parseInt(startDate.split("-")[1]), parseInt(startDate.split("-")[2]))
      this.endDate = new NgbDate(parseInt(endDate.split("-")[0]), parseInt(endDate.split("-")[1]), parseInt(endDate.split("-")[2]))
    }
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
    modalRef.result.then((result) => {
      let token = JSON.parse(sessionStorage.getItem('currentUser')!)
      let screenObj: any = {};
      screenObj["__wf__reqdate"] = this.currentDate.getFullYear() + "-" + ("0" + (this.currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + this.currentDate.getDate()).slice(-2);
      screenObj["__wf__employeeid"] = this.employeeProfile!.employeeId;
      screenObj["__wf__fullname"] = this.employeeProfile!.getFullname();
      screenObj["__wf__position"] = this.employeeProfile!.position!.tdesc;
      screenObj["__wf__bu1"] = this.employeeProfile!.bu1!.tdesc;
      screenObj["__wf__bu2"] = this.employeeProfile!.bu2!.tdesc;
      screenObj["__wf__bu3"] = this.employeeProfile!.bu3!.tdesc;
      screenObj["__wf__bu4"] = this.employeeProfile!.bu4!.tdesc;
      screenObj["__wf__bu5"] = this.employeeProfile!.bu5!.tdesc;
      screenObj["__wf__ext"] = this.employeeProfile!.telExt;
      screenObj["__wf__certificate"] = this.certificatesSelect?.code;
      screenObj["__wf__chkT"] = this.thaiCheckbox ? 'on' : '';
      screenObj["__wf__chkTnum"] = this.thaiCheckbox ? this.thaiNum + '' : '';
      screenObj["__wf__chkE"] = this.engCheckbox ? 'on' : '';
      screenObj["__wf__chkEnum"] = this.engCheckbox ? this.engNum + '' : '';
      screenObj["__wf__country"] = this.certificatesSelect?.code == '1' ? this.countrySelect.countryId : '';
      screenObj["__wf__countrydesc"] = this.certificatesSelect?.code == '1' ? this.countrySelect.tdesc : '';
      screenObj["__wf__datefrom"] = this.certificatesSelect?.code == '1' ? this.ngbDateParserFormatter.format(this.startDate!).replace(/\//gi, '-').split("-").reverse().join("-") : '';
      screenObj["__wf__dateto"] = this.certificatesSelect?.code == '1' ? this.ngbDateParserFormatter.format(this.endDate!).replace(/\//gi, '-').split("-").reverse().join("-") : '';
      screenObj["__wf__title"] = '';
      screenObj["__wf__institute"] = '';
      screenObj["__wf__doc"] = '5';
      screenObj["__wf__description"] = '-';
      screenObj["timestampFile"] = this.timestampFile;
      screenObj["attach_time"] = this.timestampFile;

      let body = {
        companyId: token.companyid,
        wf_ver: "1",
        wf_id: this.wfid,
        doc_no: "0",
        initiator: token.employeeid,
        position_code: token.emp_position,
        screen_value: screenObj,
        remark: this.remark,
        cc: this.employeeCCId,
        referenceParam: this.referenceParam
      };
      this.wfs.createWF(body).subscribe(result => {
        if (result) {
          if (this.runno) {
            this.onCancel()
          }
          this.local.back();
        } else {
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow.")
        }
      })
    }, reject => { })
  }

  onCancel() {
    this.wfs.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }

  openDocReference() {
    const modalRef = this.ngbModal.open(DocReferenceModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.inputs = this.inputs
    modalRef.componentInstance.dynamicComponent = this.dynamicComponent
    modalRef.componentInstance.onCancel = true
    modalRef.result.then(result => {
      this.onCancel()
    }, reason => {
    })
  }

  setScreenValue() {
    this.wfs.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      const certificatesFind = this.certificatesList.find(x => x.code == result.workflowData.screen_value["__wf__certificate"])
      this.certificatesSelect = certificatesFind ? certificatesFind : this.certificatesList[0]
      this.changeCertificatesSelect(this.certificatesSelect?.code)
      this.thaiCheckbox = result.workflowData.screen_value["__wf__chkT"] == "on" ? true : false
      this.thaiNum = parseInt(result.workflowData.screen_value["__wf__chkTnum"] ? result.workflowData.screen_value["__wf__chkTnum"] : "0")
      this.engCheckbox = result.workflowData.screen_value["__wf__chkE"] == "on" ? true : false
      this.engNum = parseInt(result.workflowData.screen_value["__wf__chkEnum"] ? result.workflowData.screen_value["__wf__chkEnum"] : "0")
      this.countrySelect = new MyCountry(this.countryList.find(x => x.countryId == result.workflowData.screen_value["__wf__country"]) ? this.countryList.find(x => x.countryId == result.workflowData.screen_value["__wf__country"])! : {}, this.translateService)
      this.startDate = new NgbDate(parseInt(result.workflowData.screen_value["__wf__datefrom"].split("-")[0]),
        parseInt(result.workflowData.screen_value["__wf__datefrom"].split("-")[1]),
        parseInt(result.workflowData.screen_value["__wf__datefrom"].split("-")[2]))
      this.endDate = new NgbDate(parseInt(result.workflowData.screen_value["__wf__dateto"].split("-")[0]),
        parseInt(result.workflowData.screen_value["__wf__dateto"].split("-")[1]),
        parseInt(result.workflowData.screen_value["__wf__dateto"].split("-")[2]))

      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = Pwf001DetailComponent
      this.cdr.markForCheck()
    })
  }

  changeCertificatesSelect(code: string) {
    this.thaiCheckbox = false
    this.engCheckbox = false
    this.thaiNum = 0
    this.engNum = 0
    if (code == "1") {
      this.startDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
      this.endDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
    }
    this.certificatesList.map(x => {
      if (x.code == code) {
        x.completed = true
        this.certificatesSelect = x
      } else {
        x.completed = false
      }
      return x
    })
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
      this.ngbModal.dismissAll()
    }, (reason) => {
      this.ngbModal.dismissAll()
    })
  }

  openReasonModal(modalName: any) {
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      size: 'lg'
    })
    modalRef.result.then(result => {
      this.countrySelect = new MyCountry(result, this.translateService)
    }, reason => {
    })
  }

  checkDateFormat(date: NgbDate): boolean {
    let parseDate = this.ngbDateParserFormatter.format(date)
    let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
    if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
      return true
    }
    return false
  }

  disabledChack() {
    if (this.certificatesSelect?.code == '1') {
      if (!this.checkDateFormat(this.startDate!) || !this.checkDateFormat(this.endDate!)) {
        return true;
      }
      if (this.countrySelect.countryId == undefined) {
        return true;
      }
      if (!this.engCheckbox) {
        return true;
      } else if (this.engNum <= 0 || this.engNum.toString() == '') {
        return true;
      }
    } else if (this.certificatesSelect?.code == 'C') {
      if (!this.engCheckbox && !this.thaiCheckbox) {
        return true;
      } else {
        if (this.engCheckbox && this.thaiCheckbox && ((this.engNum <= 0 || this.engNum.toString() == '') || (this.thaiNum <= 0 || this.thaiNum.toString() == ''))) {
          return true;
        } else if(this.engCheckbox && (this.engNum <= 0 || this.engNum.toString() == '')) {
          return true;
        } else if(this.thaiCheckbox && (this.thaiNum <= 0 || this.thaiNum.toString() == '')) {
          return true;
        }
      }

    } else {
      if (!this.thaiCheckbox) {
        return true;
      } else if (this.thaiNum <= 0 || this.thaiNum.toString() == '') {
        return true;
      }

    }

  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.ngbModal.dismissAll()
  }

  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }

  checkBetweenDate() {
    const chkDate = this.datepickerService.checkMaxDate(this.startDate!, this.endDate!);
    this.endDate = new NgbDate(chkDate.year, chkDate.month, chkDate.day);
  }
}
