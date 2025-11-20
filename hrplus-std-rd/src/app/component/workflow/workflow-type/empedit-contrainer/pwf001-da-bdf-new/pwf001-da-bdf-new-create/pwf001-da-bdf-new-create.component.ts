import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { MyWorkingsModel, WorkingsModel } from "src/app/models/workingmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { workflowService } from "src/app/services/workflow.service";
import { AlertModalComponent } from "../../../alert-modal/alert-modal.component";
import { WorkflowEmployeeModalComponent } from "../../../workflow-employee-modal/workflow-employee-modal.component";
import { Location } from '@angular/common'
import { CertificateTemplate, MyCertificateTemplate } from "src/app/models/certificatetemplate.model";
import { DocReferenceModalComponent } from "../../../doc-reference-modal/doc-reference-modal.component";
import { ConfirmModalComponent } from "../../../confirm-modal/confirm-modal.component";
import { Pwf001DaBdfNewDetailComponent } from "../pwf001-da-bdf-new-detail/pwf001-da-bdf-new-detail.component";
import { MyWorkflowRemarkModel } from "src/app/models/workflowremarkmodel.model";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CertificateTemplateService } from "src/app/services/certificate-template.service";
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { WorkflowEmpInformationComponent } from "../../../workflow-emp-information/workflow-emp-information.component";
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    WorkflowEmployeeModalComponent,
    DocReferenceModalComponent,
    ConfirmModalComponent,
    Pwf001DaBdfNewDetailComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowRemarkComponent,
  ],
  selector: 'app-pwf001-da-bdf-new-create',
  templateUrl: './pwf001-da-bdf-new-create.component.html',
  styleUrls: ['./pwf001-da-bdf-new-create.component.scss']
})
export class Pwf001DaBdfNewCreateComponent implements OnInit {
  @Input() data: any;
  wfid = "2003"
  runno?: string

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

  employeeList: WorkingsModel[] = []
  empInformation: MyWorkingsModel = new MyWorkingsModel({}, this.translateService)

  certificateTemplateList: CertificateTemplate[] = []
  certificateTemplateFilter: CertificateTemplate[] = []
  certificateTemplateSearch = ""
  certificateTemplateSelect: CertificateTemplate = new MyCertificateTemplate({}, this.translateService)
  page = 1
  pageSize = 10
  thaiCheckbox = false
  engCheckbox = false
  thaiNum = 0
  engNum = 0

  workflowRemark: MyWorkflowRemarkModel = new MyWorkflowRemarkModel({}, this.translateService)

  employeeCCId = ""
  constructor(private local: Location,
    private wfs: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public translateService: TranslateService,
    private ngbModal: NgbModal,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private empService: EmployeeService,
    private certificateTemplateService: CertificateTemplateService) {
    this.getuploadWFApi()
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid")!
      this.runno = result.get("runno")!
    })
    this.wfs.getEmpCenter().subscribe(result => {
      this.employeeList = result.map(x => new MyWorkingsModel(x, this.translateService))
      if (this.employeeList.length) {
        this.empInformation = new MyWorkingsModel(this.employeeList[0], this.translateService)
      }
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
    this.certificateTemplateService.getListShow().subscribe(result => {
      this.certificateTemplateList = result.map(x => new MyCertificateTemplate(x, this.translateService))
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }

  setScreenValue() {
    this.wfs.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.screenObj = result.workflowData.screen_value;
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.certificateTemplateSelect = new MyCertificateTemplate(this.certificateTemplateList.find(x => x.certType == this.screenObj["__wf__certificate"]) ? this.certificateTemplateList.find(x => x.certType == this.screenObj["__wf__certificate"])! : {}, this.translateService)
      this.thaiNum = parseInt(this.screenObj["__wf__chkTnum"] ? this.screenObj["__wf__chkTnum"] : "0")
      this.engNum = parseInt(this.screenObj["__wf__chkEnum"] ? this.screenObj["__wf__chkEnum"] : "0")
      this.thaiCheckbox = this.screenObj["__wf__chkT"] == "true" ? true : false
      this.engCheckbox = this.screenObj["__wf__chkE"] == "true" ? true : false
      this.empInformation = new MyWorkingsModel(this.employeeList.find(x => x.employeeId == this.screenObj["__wf__employeeid"]) ? this.employeeList.find(x => x.employeeId == this.screenObj["__wf__employeeid"])! : {}, this.translateService)
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = Pwf001DaBdfNewDetailComponent
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
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

  searchData() {
    this.certificateTemplateFilter = this.certificateTemplateSearch ? this.certificateTemplateList.filter(x => {
      if (x.tdesc!.toLowerCase().includes(this.certificateTemplateSearch.toLowerCase()) ||
        x.edesc!.toLowerCase().includes(this.certificateTemplateSearch.toLowerCase()) ||
        x.certType!.toLowerCase().includes(this.certificateTemplateSearch.toLowerCase())) {
        return x
      }
    }) : this.certificateTemplateList
    this.page = 1
  }

  openEmployeeModal() {
    const modalRef = this.ngbModal.open(WorkflowEmployeeModalComponent, {
      centered: true,
      windowClass: 'dialog-width'
    })
    modalRef.componentInstance.employeeList = this.employeeList
    modalRef.result.then(result => {
      this.empInformation = new MyWorkingsModel(result, this.translateService)
    }, reason => {
      this.ngbModal.dismissAll()
    })
  }

  openCertificateModal(modalName: any) {
    this.certificateTemplateSearch = ""
    this.searchData()
    const modalRef = this.ngbModal.open(modalName, { centered: true, size: 'lg' })
    modalRef.result.then(result => {
      this.certificateTemplateSelect = new MyCertificateTemplate(result, this.translateService)
    }, reason => { })
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

  onCancel() {
    this.wfs.cancelWF(this.workflowData).subscribe(result => {
      this.runno = undefined
      this.ngbModal.dismissAll()
    })
    this.local.back()
  }

  onSubmit() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
    modalRef.result.then(result => {
      let token = JSON.parse(sessionStorage.getItem('currentUser')!)
      let screenObj: any = {}
      screenObj["timestampFile"] = this.timestampFile
      screenObj["attach_time"] = this.timestampFile

      screenObj["__wf__reqdate"] = ("0" + new Date().getDate()).slice(-2) + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + new Date().getFullYear();
      screenObj["__wf__emp_request"] = token.employeeid;
      screenObj["__wf__employeeid"] = this.empInformation!.employeeId
      screenObj["MEMPLOYEE@FULLNAME"] = this.empInformation!.fname + ' ' + this.empInformation!.lname
      screenObj["__position"] = this.empInformation!.position!.tdesc
      screenObj["__bu1"] = this.empInformation!.bu1!.tdesc
      screenObj["__bu2"] = this.empInformation!.bu2!.tdesc
      screenObj["__bu3"] = this.empInformation!.bu3!.tdesc
      screenObj["__bu4"] = this.empInformation!.bu4!.tdesc
      screenObj["__bu5"] = this.empInformation!.bu5!.tdesc
      screenObj["__bu6"] = this.empInformation!.bu6!.tdesc
      screenObj["__bu7"] = this.empInformation!.bu7!.tdesc
      screenObj["__ext"] = this.empInformation!.telExt
      screenObj["__wf__certificatedesc"] = this.certificateTemplateSelect.tdesc
      screenObj["__wf__certificate"] = this.certificateTemplateSelect.certType
      screenObj["__wf__chkT"] = this.thaiCheckbox
      screenObj["__wf__chkTnum"] = this.thaiCheckbox ? this.thaiNum.toString() : ""
      screenObj["__wf__chkE"] = this.engCheckbox
      screenObj["__wf__chkEnum"] = this.engCheckbox ? this.engNum.toString() + "" : ""
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
      }
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
    }, reason => {

    })
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.ngbModal.dismissAll()
  }
}
