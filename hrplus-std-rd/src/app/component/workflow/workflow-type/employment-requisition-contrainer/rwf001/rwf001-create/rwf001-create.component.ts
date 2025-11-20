import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { SendtoModel } from "src/app/models/sendtomodel.model";
import { MyWorkingsModel, WorkingsModel } from "src/app/models/workingmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location, DatePipe } from "@angular/common";
import { workflowService } from "src/app/services/workflow.service";
import localeThai from "@angular/common/locales/th";
import { Degree, MyDegree } from "src/app/models/degree.model";
import { Major, MyMajor } from "src/app/models/major.model";
import { Branch, MyBranch } from "src/app/models/branch.model";
import { Bu1, MyBu1 } from "src/app/models/bu1.model";
import { Bu2, MyBu2 } from "src/app/models/bu2.model";
import { Bu3, MyBu3 } from "src/app/models/bu3.model";
import { Bu4, MyBu4 } from "src/app/models/bu4.model";
import { Bu5, MyBu5 } from "src/app/models/bu5.model";
import { MyPosition, Position } from "src/app/models/position.model";
import { Job, MyJob } from "src/app/models/job.model";
import { EmployeeTypeModel, MyEmployeeTypeModel } from "src/app/models/employeetype.model";
import { MySystemCodeReqtypeModel, SystemCodeReqtypeModel } from "src/app/models/systemcodereqtype.model";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { Rwf001DetailComponent } from "../rwf001-detail/rwf001-detail.component";
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'// Added import
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    DatePipe,
    Rwf001DetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent // Added
  ],
  selector: "app-rwf001-create",
  templateUrl: "./rwf001-create.component.html",
  styleUrls: ["./rwf001-create.component.scss"]
})
export class Rwf001CreateComponent implements OnInit {
  @Input() data: any;
  @ViewChild("alertModal") alertModal: undefined;
  @ViewChild("fileInput") fileInput: ElementRef | undefined;
  @ViewChild("confirmModal") confirmModal: undefined;
  timestampFile: any;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = "browse_file";
  uploadConfig: any;
  msg = "";
  remark = "";
  wfid: any;
  token: any;
  sendtoWF: SendtoModel[] | undefined
  emp: WorkingsModel | undefined;
  runno: string | undefined;
  screenObj: any;

  employeeCCId = ""

  __wf__branch = ""
  __wf__branchDesc = { tdesc: "", edesc: "" }
  __wf__bu1 = ""
  __wf__bu1Desc = { tdesc: "", edesc: "" }
  __wf__bu2 = ""
  __wf__bu2Desc = { tdesc: "", edesc: "" }
  __wf__bu3 = ""
  __wf__bu3Desc = { tdesc: "", edesc: "" }
  __wf__bu4 = ""
  __wf__bu4Desc = { tdesc: "", edesc: "" }
  __wf__bu5 = ""
  __wf__bu5Desc = { tdesc: "", edesc: "" }
  __wf__positionid = ""
  __wf__positionDesc = { tdesc: "", edesc: "" }
  __wf__jobid = ""
  __wf__jobDesc = { tdesc: "", edesc: "" }
  __wf__responsibility = ""
  __wf__qualification = ""
  __wf__emp_type = "1"
  __wf__contact_duration = "3"
  __wf__emp_num = 0
  __wf__fromage = 0
  __wf__toage = 0
  __wf__sex = "3"
  __wf__degreeid = ""
  __wf__degreedesc = { tdesc: "", edesc: "" }
  __wf__experience = ""
  __wf__other = ""
  __wf__req_type = "1"
  __wf__subrequest = "0"

  __wf__majors: any = []
  __wf__majorid$: string[] = []
  __wf__majortdesc$: string[] = []
  __wf__majoredesc$: string[] = []
  majorIsSeclect: boolean[] = []
  majorAllSeclect = false

  __wf__reason: string[] = []
  __wf__adjdate: NgbDate[] = []
  reason = [{
    id: "0",
    tdesc: "ลาออก",
    edesc: "Resign"
  },
  {
    id: "1",
    tdesc: "โอนย้าย",
    edesc: "Transfer"
  }]

  empType: EmployeeTypeModel[] | undefined
  contactDuration = [{
    id: "3",
    tdesc: "ระยะเวลาการจ้าง 3 เดือน",
    edesc: "3 Months Employment"
  },
  {
    id: "6",
    tdesc: "ระยะเวลาการจ้าง 6 เดือน",
    edesc: "6 Months Employment"
  }]
  sex = [{
    id: "1",
    tdesc: "ชาย",
    edesc: "Male"
  },
  {
    id: "2",
    tdesc: "หญิง",
    edesc: "Female"
  },
  {
    id: "3",
    tdesc: "ไม่ระบุ",
    edesc: "Not Specify"
  }]
  reqType: SystemCodeReqtypeModel[] | undefined
  nameCheck = false
  nameSearch = ""
  bu1Check = false
  bu1Search = ""
  bu1Desc = { tdesc: "", edesc: "" }
  bu2Check = false
  bu2Search = ""
  bu2Desc = { tdesc: "", edesc: "" }
  bu3Check = false
  bu3Search = ""
  bu3Desc = { tdesc: "", edesc: "" }
  bu4Check = false
  bu4Search = ""
  bu4Desc = { tdesc: "", edesc: "" }
  bu5Check = false
  bu5Search = ""
  bu5Desc = { tdesc: "", edesc: "" }
  positionCheck = false
  positionSearch = ""
  positionDesc = { tdesc: "", edesc: "" }
  pageModal = 0;
  pageSizeModal = 10;
  collectionSizeModal = 0;



  page = 0;
  pageSize = 10;
  collectionSize = 0;
  active = 1;
  activeKeep = 1;
  activeSelected = 1;







  listEmpWorking: WorkingsModel[] | undefined
  listEmpWorkingShow: WorkingsModel[] | undefined
  empCheck = [{
    check: false,
    num: 0
  }]
  empCheckAll = false;
  empSelectList: WorkingsModel[] = []
  pageEmpSelect = 0;
  pageSizeEmpSelect = 10;
  collectionSizeEmpSelect = 0;
  empSelectListCheck = [{ check: false, num: 0 }]
  empSelectCheckAll = false;

  re = /\//gi

  branchListSearch = ""
  branchList: Branch[] | undefined
  branchListShow: Branch[] | undefined
  bu1ListSearch = ""
  bu1List: Bu1[] | undefined
  bu1ListShow: Bu1[] | undefined

  bu2ListSearch = ""
  bu2List: Bu2[] | undefined
  bu2ListShow: Bu2[] | undefined


  bu3ListSearch = ""
  bu3List: Bu3[] | undefined
  bu3ListShow: Bu3[] | undefined

  bu4ListSearch = ""
  bu4List: Bu4[] | undefined
  bu4ListShow: Bu4[] | undefined

  bu5ListSearch = ""
  bu5List: Bu5[] | undefined
  bu5ListShow: Bu5[] | undefined


  positionListSearch = ""
  positionList: Position[] | undefined
  positionListShow: Position[] | undefined

  jobListSearch = ""
  jobList: Job[] | undefined
  jobListShow: Job[] | undefined


  degreeSearch = ""
  degree: Degree[] | undefined
  degreeShow: Degree[] | undefined


  majorSearch = ""
  major: Major[] | undefined
  majorShow: Major[] | undefined

  modalEmpCheck = false

  workflowData: any
  inputs = {
    data: {}
  }
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('cancelModal') cancelModal: undefined
  dynamicComponent: any
  referenceParam = ""
  constructor(private modalService: NgbModal,
    public modal: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    public translateService: TranslateService,
    private local: Location,
    private datePipe: DatePipe,
    private parserFormat: NgbDateParserFormatter) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid")
      this.runno = result.get("runno")!;
    });
    this.token = JSON.parse(sessionStorage.getItem("currentUser")!)
    this.getuploadWFApi()
    this.getDegree()
    this.getMajor()
    this.getBranchList()
    this.getBu1List()
    this.getBu2List()
    this.getBu3List()
    this.getBu4List()
    this.getBu5List()
    this.getPositionList()
    this.getJobcodeList()
    this.getEmployeeTypeList()
    this.getSystemCodeReqtype()
    this.getListEmpWorking2()
    if (this.runno) {
      this.setScreenValue()
    }
  }
  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result;
    });
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
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.'
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        } else {
          await this.delay(100);
          this.onUploadPicture()
        }
      }
    }
    this.fileInput!.nativeElement.value = ''
  }
  async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  onUploadPicture() {
    if (this.newFile) {
      let date = new Date();
      this.timestampFile = date.getTime();
      let body = {
        uploadfield: "attached_file_temp.file_name",
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      };
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.timestampFile = "";
          this.nameFile = "browse_file";
          this.msg = this.translateService.currentLang == "th" ? "ไม่สามารถอัพโหลดไฟล์ได้" : "Can not upload files.";
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: "static"
          });
        } else {
          this.nameFile = body.fileName;
        }

      })
    }
    this.closeBtnClick();
  }
  resetIMG() {
    this.timestampFile = "";
    this.nameFile = "browse_file";
  }
  openOnSubmit() {
    this.msg = this.translateService.currentLang == "th" ? "คุณต้องการยืนยันข้อมูลหรือไม่?" : "Do you want to confirm?";
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: "static"
    });
  }
  onSubmit() {
    let screenObj: any = {}
    screenObj["timestampFile"] = this.timestampFile
    screenObj["attach_time"] = this.timestampFile

    screenObj["__wf__limitot"] = false
    screenObj["__wf__doc_date"] = this.parserFormat.format(new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())).replace(this.re, '-')
    screenObj["__wf__lastdate"] = this.parserFormat.format(new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())).replace(this.re, '-')
    screenObj["__wf__major_row"] = ""
    this.__wf__majorid$.forEach((x, i) => {
      screenObj["__wf__major_row"] = screenObj["__wf__major_row"] + (i + 1) + ","
    })
    screenObj["__wf__major_max_line"] = this.__wf__majorid$.length
    screenObj["__wf__major_last_line"] = this.__wf__majorid$.length
    screenObj["__wf__employeeid"] = this.token.employeeid
    let majors = ""
    this.__wf__majors.forEach((x: any, i: any) => {
      majors = majors + '{"id":"' + x.id + '","name":{"tha":"' + x.name.tha + '","eng":"' + x.name.eng + '"},"need_description":""},'
    });
    majors = majors.substring(0, majors.length - 1)
    screenObj["__wf__majors"] = "[" + majors + "]"
    screenObj["__wf__branch"] = this.__wf__branch
    screenObj["__wf__branchDesc"] = this.__wf__branchDesc.tdesc
    screenObj["__wf__bu1"] = this.__wf__bu1
    screenObj["__wf__bu1Desc"] = this.__wf__bu1Desc.tdesc
    screenObj["__wf__bu2"] = this.__wf__bu2
    screenObj["__wf__bu2Desc"] = this.__wf__bu2Desc.tdesc
    screenObj["__wf__bu3"] = this.__wf__bu3
    screenObj["__wf__bu3Desc"] = this.__wf__bu3Desc.tdesc
    screenObj["__wf__bu4"] = this.__wf__bu4
    screenObj["__wf__bu4Desc"] = this.__wf__bu4Desc.tdesc
    screenObj["__wf__bu5"] = this.__wf__bu5
    screenObj["__wf__bu5Desc"] = this.__wf__bu5Desc.tdesc
    screenObj["__wf__positionid"] = this.__wf__positionid
    screenObj["__wf__positionDesc"] = this.__wf__positionDesc.tdesc
    screenObj["__wf__jobid"] = this.__wf__jobid
    screenObj["__wf__jobDesc"] = this.__wf__jobDesc.tdesc
    screenObj["__wf__responsibility"] = this.__wf__responsibility
    screenObj["__wf__qualification"] = this.__wf__qualification
    screenObj["__wf__emp_type"] = this.__wf__emp_type
    screenObj["__wf__contact_duration"] = this.__wf__contact_duration
    screenObj["__wf__emp_num"] = this.__wf__emp_num + ""
    screenObj["__wf__fromage"] = this.__wf__fromage + ""
    screenObj["__wf__toage"] = this.__wf__toage + ""
    screenObj["__wf__sex"] = this.__wf__sex
    screenObj["__wf__degreeid"] = this.__wf__degreeid
    screenObj["__wf__degreedesc"] = this.__wf__degreedesc.tdesc
    screenObj["__wf__experience"] = this.__wf__experience
    screenObj["__wf__other"] = this.__wf__other
    screenObj["__wf__req_type"] = this.__wf__req_type
    screenObj["__wf__subrequest"] = this.__wf__subrequest
    this.__wf__majorid$.forEach((x, i) => {
      screenObj["__wf__majorid$line_no$" + (i + 1)] = ""
      screenObj["__wf__majorid$" + (i + 1)] = this.__wf__majorid$[i]
      screenObj["__wf__majortdesc$" + (i + 1)] = this.__wf__majortdesc$[i]
      screenObj["__wf__majoredesc$" + (i + 1)] = this.__wf__majoredesc$[i]
    })
    this.__wf__reason.forEach((x, i) => {
      screenObj["__wf__reason" + (i + 1)] = x
      screenObj["__wf__adjdate" + (i + 1)] = this.parserFormat.format(this.__wf__adjdate[i]).replace(this.re, '-') == "00-00-0" ? "" : this.parserFormat.format(this.__wf__adjdate[i]).replace(this.re, '-')
    })


    screenObj["__wf__list"] = ""
    screenObj["__wf__slist"] = ""
    this.empSelectList.forEach((x, i) => {
      screenObj["__wf__slist"] = screenObj["__wf__slist"] + x.employeeId + ","
    })
    screenObj["__wf__slist"] = screenObj["__wf__slist"].substring(0, screenObj["__wf__slist"].length - 1)
    screenObj["__wf__branchid"] = "0001"
    screenObj["__wf__docno"] = "0"

    let body = {
      companyId: this.token.companyid,
      wf_ver: "1",
      wf_id: this.wfid,
      doc_no: "0",
      initiator: this.token.employeeid,
      position_code: this.token.emp_position,
      screen_value: screenObj,
      remark: this.remark,
      cc: this.employeeCCId,
      referenceParam: this.referenceParam
    }
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
        if (this.runno) {
          this.cancelWF()
        }
        this.local.back()
      } else {
        this.msg = this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    })
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit()
  }

  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.screenObj = result.workflowData.screen_value;
      this.getJobcodeList()
      this.__wf__responsibility = this.screenObj["__wf__responsibility"]
      this.__wf__qualification = this.screenObj["__wf__qualification"]
      this.__wf__emp_type = this.screenObj["__wf__emp_type"]
      this.__wf__contact_duration = this.screenObj["__wf__contact_duration"]
      this.__wf__emp_num = this.screenObj["__wf__emp_num"]
      this.__wf__fromage = this.screenObj["__wf__fromage"]
      this.__wf__toage = this.screenObj["__wf__toage"]
      this.__wf__sex = this.screenObj["__wf__sex"]
      this.getDegree()
      this.getMajor()
      this.__wf__experience = this.screenObj["__wf__experience"]
      this.__wf__other = this.screenObj["__wf__other"]
      this.__wf__req_type = this.screenObj["__wf__req_type"]
      this.__wf__subrequest = this.screenObj["__wf__subrequest"]
      this.getListEmpWorking2()

      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screenObj.timestampFile
      }
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.inputs.data = result
      this.dynamicComponent = Rwf001DetailComponent
      this.cdr.markForCheck();
    });
  }






  __wf__emp_typeChange() {
    if (this.__wf__emp_type == "2") {
      this.__wf__contact_duration = "3"
    }
  }
  getContactDurationDesc(i: number) {
    return this.translateService.currentLang == "th" ?
      this.contactDuration[i].tdesc :
      this.contactDuration[i].edesc
  }
  getSexDesc(i: number) {
    return this.translateService.currentLang == "th" ?
      this.sex[i].tdesc :
      this.sex[i].edesc
  }


  getListEmpWorking2() {
    this.empService.getListEmpWorking2().then((result: any) => {
      this.empService.getListEmpWorking2(result["totalElements"]).then((result: any) => {
        this.listEmpWorking = result["content"].map((e: any) => new MyWorkingsModel(e, this.translateService)).sort((a: WorkingsModel, b: WorkingsModel) => (a.employeeId! > b.employeeId!) ? 1 : -1)
        if (this.runno && this.screenObj) {
          this.empSelectRunno()
        }
      })
    })
  }

  checkSearchSeclect(item: boolean) {
    item = !item
  }


  searchEmp() {
    let list = this.listEmpWorking
    let check = false
    if (this.empSelectList.length != 0) {
      this.empSelectList.forEach(x => {
        list = list!.filter((y) => (y.employeeId != x.employeeId))
      })
    }
    if (this.nameCheck && this.nameSearch.split(" ").join("") != "") {
      check = true
      list = list!.filter(x => ((x.fname + " " + x.lname).toLowerCase().indexOf(this.nameSearch) !== -1 ||
        (x.efname + " " + x.elname).toLowerCase().indexOf(this.nameSearch) !== -1))
    }
    if (this.bu1Check) {
      check = true
      list = list!.filter(x => (x.bu1?.bu1id == this.bu1Search))
    }
    if (this.bu2Check) {
      check = true
      list = list!.filter(x => (x.bu2?.bu2id == this.bu2Search))
    }
    if (this.bu3Check) {
      check = true
      list = list!.filter(x => (x.bu3?.bu3id == this.bu3Search))
    }
    if (this.bu4Check) {
      check = true
      list = list!.filter(x => (x.bu4?.bu4id == this.bu4Search))
    }
    if (this.bu5Check) {
      check = true
      list = list!.filter(x => (x.bu5?.bu5id == this.bu5Search))
    }
    if (this.positionCheck) {
      check = true
      list = list!.filter(x => (x.position?.positionId == this.positionSearch))
    }
    check ? "" : list = []
    list!.forEach((x, i) => {
      this.empCheck.push({ check: false, num: (i + 1) })
    })
    this.pageModal = 1;
    this.listEmpWorkingShow = list
    this.collectionSizeModal = this.listEmpWorkingShow!.length

    // if (!check) {
    //   this.msg = this.translateService.currentLang == 'th' ? 'กรุณาคลิกเลือกอย่างน้อย 1 รายการ' : 'Please choose at least 1 filter'
    //   this.modalService.open(this.alertModal, {
    //     centered: true,
    //     backdrop: 'static'
    //   })
    // }

    // if (list!.length == 0) {
    //   this.msg = this.translateService.currentLang == 'th' ? 'ไม่พบข้อมูล' : 'No Data Found. '
    //   this.modalService.open(this.alertModal, {
    //     centered: true,
    //     backdrop: 'static'
    //   })
    // }

    if (check == true && list!.length == 0) {
      this.msg = this.translateService.currentLang == 'th' ? 'ไม่พบข้อมูล' : 'No Data Found. '
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
    } else if (list!.length == 0) {
      this.msg = this.translateService.currentLang == 'th' ? 'กรุณาคลิกเลือกอย่างน้อย 1 รายการ' : 'Please choose at least 1 filter'
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
    } else {
    }

  }

  empCheckAllChange() {
    this.empCheckAll = !this.empCheckAll
    this.empCheck.forEach((x, i: number) => {
      this.empCheck[i].check = this.empCheckAll
    })
  }

  empSelect() {
    let num = this.empCheck!.filter(x => (x.check))
    num.forEach((x, i) => {
      this.empSelectList.push(this.listEmpWorkingShow![x.num - 1])
      this.empSelectListCheck.push({ check: false, num: i })
      this.__wf__reason.push("0")
      this.__wf__adjdate.push(new NgbDate(0, 0, 0))
    })
  }
  empSelectRunno() {
    this.empSelectList = []
    this.__wf__reason = []
    this.__wf__adjdate = []
    if (this.screenObj["__wf__slist"].indexOf(",") > -1) {
      this.screenObj["__wf__slist"].split(",").forEach((x: string, i: number) => {
        this.empSelectList.push(this.listEmpWorking!.filter(y => y.employeeId == x)[0])
        this.empSelectListCheck.push({ check: false, num: i })
        this.__wf__reason.push(this.screenObj["__wf__reason" + (i + 1)])
        if (this.screenObj["__wf__adjdate" + (i + 1)]) {
          this.__wf__adjdate.push(new NgbDate(parseInt(this.screenObj["__wf__adjdate" + (i + 1)].split("-")[2]), parseInt(this.screenObj["__wf__adjdate" + (i + 1)].split("-")[1]), parseInt(this.screenObj["__wf__adjdate" + (i + 1)].split("-")[0])))
        } else {
          this.__wf__adjdate.push(new NgbDate(0, 0, 0))
        }

      })
    }

  }

  empSelectCheckAllChange() {
    this.empSelectCheckAll = !this.empSelectCheckAll
    this.empSelectListCheck.forEach((x, i: number) => {
      this.empSelectListCheck[i].check = this.empSelectCheckAll
    })
  }
  removeEmpSelect() {
    this.empSelectListCheck.forEach((x, i) => {
      if (x.check) {
        this.__wf__reason.splice(i, 1)
        this.__wf__adjdate.splice(i, 1)
        this.empSelectListCheck.splice(i, 1)
        this.empSelectList.splice(i, 1)
        this.removeEmpSelect()
      }
    });
    this.pageEmpSelect = 1
    this.collectionSizeEmpSelect = this.empSelectList.length
  }

  reasonDesc(i: number) {
    return this.translateService.currentLang == "th" ?
      this.reason[i].tdesc :
      this.reason[i].edesc
  }


  getBranchList() {
    this.workflowService.getBranchList().then(result => {
      this.branchList = result.map(e => new MyBranch(e, this.translateService)).sort((a: Branch, b: Branch) => (a.branchId! > b.branchId!) ? 1 : -1);
      this.branchListShow = this.branchList
      if (this.runno && this.screenObj) {
        if (this.branchList!.filter((x: Branch) => (x.branchId! == this.screenObj["__wf__branch"])).length == 1) {
          this.selectBranchList(this.branchList!.filter((x: Branch) => (x.branchId !== this.screenObj["__wf__branch"]))[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchBranchList() {
    this.branchListShow = this.branchList!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.branchListSearch) !== -1 || x.edesc.toLowerCase().indexOf(this.branchListSearch) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.branchListShow.length
  }
  selectBranchList(item: Branch) {
    this.__wf__branch = item.branchId!
    this.__wf__branchDesc.tdesc = item.tdesc!
    this.__wf__branchDesc.edesc = item.edesc!
  }
  change__wf__branch() {
    if (this.branchList!.filter((x: Branch) => (x.branchId!.toLowerCase() == this.__wf__branch)).length == 1) {
      this.selectBranchList(this.branchList!.filter((x: Branch) => (x.branchId!.toLowerCase() == this.__wf__branch))[0])
    } else {
      this.__wf__branchDesc = { tdesc: "", edesc: "" }
    }
  }


  getBu1List() {
    this.workflowService.getBu1List().then(result => {
      this.bu1List = result.map(e => new MyBu1(e, this.translateService)).sort((a: Bu1, b: Bu1) => (a.bu1id! > b.bu1id!) ? 1 : -1);
      this.bu1ListShow = this.bu1List
      if (this.runno && this.screenObj) {
        if (this.bu1List!.filter((x: Bu1) => (x.bu1id! == this.screenObj["__wf__bu1"])).length == 1) {
          this.selectBu1List(this.bu1List!.filter((x: Bu1) => (x.bu1id! == this.screenObj["__wf__bu1"]))[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchBu1List() {
    this.bu1ListShow = this.bu1List!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.bu1ListSearch.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.bu1ListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.bu1ListShow.length
  }
  selectBu1List(item: Bu1) {
    if (this.modalEmpCheck) {
      this.bu1Search = item.bu1id!
      this.bu1Desc.tdesc = item.tdesc!
      this.bu1Desc.tdesc = item.edesc!
    } else {
      this.__wf__bu1 = item.bu1id!
      this.__wf__bu1Desc.tdesc = item.tdesc!
      this.__wf__bu1Desc.edesc = item.edesc!
    }

  }
  change__wf__bu1() {
    if (this.bu1List!.filter((x: Bu1) => (x.bu1id!.toLowerCase() == this.__wf__bu1)).length == 1) {
      this.selectBu1List(this.bu1List!.filter((x: Bu1) => (x.bu1id!.toLowerCase() == this.__wf__bu1))[0])
    } else {
      this.__wf__bu1Desc = { tdesc: "", edesc: "" }
    }
  }
  changebu1Search() {
    if (this.bu1List!.filter((x: Bu1) => (x.bu1id!.toLowerCase() == this.bu1Search)).length == 1) {
      this.selectBu1List(this.bu1List!.filter((x: Bu1) => (x.bu1id!.toLowerCase() == this.bu1Search))[0])
    } else {
      this.bu1Desc = { tdesc: "", edesc: "" }
    }
  }

  getBu2List() {
    this.workflowService.getBu2List().then(result => {
      this.bu2List = result.map(e => new MyBu2(e, this.translateService)).sort((a: Bu2, b: Bu2) => (a.bu2id! > b.bu2id!) ? 1 : -1);
      this.bu2ListShow = this.bu2List
      if (this.runno && this.screenObj) {
        if (this.bu2List!.filter((x: Bu2) => (x.bu2id! == this.screenObj["__wf__bu2"])).length == 1) {
          this.selectBu2List(this.bu2List!.filter((x: Bu2) => (x.bu2id! == this.screenObj["__wf__bu2"]))[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchBu2List() {
    this.bu2ListShow = this.bu2List!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.bu2ListSearch.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.bu2ListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.bu2ListShow.length
  }
  selectBu2List(item: Bu2) {
    if (this.modalEmpCheck) {
      this.bu2Search = item.bu2id!
      this.bu2Desc.tdesc = item.tdesc!
      this.bu2Desc.tdesc = item.edesc!
    } else {
      this.__wf__bu2 = item.bu2id!
      this.__wf__bu2Desc.tdesc = item.tdesc!
      this.__wf__bu2Desc.edesc = item.edesc!
    }
  }
  change__wf__bu2() {
    if (this.bu2List!.filter((x: Bu2) => (x.bu2id!.toLowerCase() == this.__wf__bu2)).length == 1) {
      this.selectBu2List(this.bu2List!.filter((x: Bu2) => (x.bu2id!.toLowerCase() == this.__wf__bu2))[0])
    } else {
      this.__wf__bu2Desc = { tdesc: "", edesc: "" }
    }
  }
  changebu2Search() {
    if (this.bu2List!.filter((x: Bu2) => (x.bu2id!.toLowerCase() == this.bu2Search)).length == 1) {
      this.selectBu2List(this.bu2List!.filter((x: Bu2) => (x.bu2id!.toLowerCase() == this.bu2Search))[0])
    } else {
      this.bu2Desc = { tdesc: "", edesc: "" }
    }
  }

  getBu3List() {
    this.workflowService.getBu3List().then(result => {
      this.bu3List = result.map(e => new MyBu3(e, this.translateService)).sort((a: Bu3, b: Bu3) => (a.bu3id! > b.bu3id!) ? 1 : -1);
      this.bu3ListShow = this.bu3List
      if (this.runno && this.screenObj) {
        if (this.bu3List!.filter((x: Bu3) => (x.bu3id! == this.screenObj["__wf__bu3"])).length == 1) {
          this.selectBu3List(this.bu3List!.filter((x: Bu3) => (x.bu3id! == this.screenObj["__wf__bu3"]))[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchBu3List() {
    this.bu3ListShow = this.bu3List!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.bu3ListSearch.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.bu3ListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.bu3ListShow.length
  }
  selectBu3List(item: Bu3) {
    if (this.modalEmpCheck) {
      this.bu3Search = item.bu3id!
      this.bu3Desc.tdesc = item.tdesc!
      this.bu3Desc.tdesc = item.edesc!
    } else {
      this.__wf__bu3 = item.bu3id!
      this.__wf__bu3Desc.tdesc = item.tdesc!
      this.__wf__bu3Desc.edesc = item.edesc!
    }
  }
  change__wf__bu3() {
    if (this.bu3List!.filter((x: Bu3) => (x.bu3id!.toLowerCase() == this.__wf__bu3)).length == 1) {
      this.selectBu3List(this.bu3List!.filter((x: Bu3) => (x.bu3id!.toLowerCase() == this.__wf__bu3))[0])
    } else {
      this.__wf__bu3Desc = { tdesc: "", edesc: "" }
    }
  }
  changebu3Search() {
    if (this.bu3List!.filter((x: Bu3) => (x.bu3id!.toLowerCase() == this.bu3Search)).length == 1) {
      this.selectBu3List(this.bu3List!.filter((x: Bu3) => (x.bu3id!.toLowerCase() == this.bu3Search))[0])
    } else {
      this.bu3Desc = { tdesc: "", edesc: "" }
    }
  }

  getBu4List() {
    this.workflowService.getBu4List().then(result => {
      this.bu4List = result.map(e => new MyBu4(e, this.translateService)).sort((a: Bu4, b: Bu4) => (a.bu4id! > b.bu4id!) ? 1 : -1);
      this.bu4ListShow = this.bu4List
      if (this.runno && this.screenObj) {
        if (this.bu4List!.filter((x: Bu4) => (x.bu4id! == this.screenObj["__wf__bu4"])).length == 1) {
          this.selectBu4List(this.bu4List!.filter((x: Bu4) => (x.bu4id! == this.screenObj["__wf__bu4"]))[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchBu4List() {
    this.bu4ListShow = this.bu4List!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.bu4ListSearch.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.bu4ListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.bu4ListShow.length
  }
  selectBu4List(item: Bu4) {
    if (this.modalEmpCheck) {
      this.bu4Search = item.bu4id!
      this.bu4Desc.tdesc = item.tdesc!
      this.bu4Desc.tdesc = item.edesc!
    } else {
      this.__wf__bu4 = item.bu4id!
      this.__wf__bu4Desc.tdesc = item.tdesc!
      this.__wf__bu4Desc.edesc = item.edesc!
    }
  }
  change__wf__bu4() {
    if (this.bu4List!.filter((x: Bu4) => (x.bu4id!.toLowerCase() == this.__wf__bu4)).length == 1) {
      this.selectBu4List(this.bu4List!.filter((x: Bu4) => (x.bu4id!.toLowerCase() == this.__wf__bu4))[0])
    } else {
      this.__wf__bu4Desc = { tdesc: "", edesc: "" }
    }
  }
  changebu4Search() {
    if (this.bu4List!.filter((x: Bu4) => (x.bu4id!.toLowerCase() == this.bu4Search)).length == 1) {
      this.selectBu4List(this.bu4List!.filter((x: Bu4) => (x.bu4id!.toLowerCase() == this.bu4Search))[0])
    } else {
      this.bu4Desc = { tdesc: "", edesc: "" }
    }
  }

  getBu5List() {
    this.workflowService.getBu5List().then(result => {
      this.bu5List = result.map(e => new MyBu5(e, this.translateService)).sort((a: Bu5, b: Bu5) => (a.bu5id! > b.bu5id!) ? 1 : -1);
      this.bu5ListShow = this.bu5List
      if (this.runno && this.screenObj) {
        if (this.bu5List!.filter((x: Bu5) => (x.bu5id! == this.screenObj["__wf__bu5"])).length == 1) {
          this.selectBu5List(this.bu5List!.filter((x: Bu5) => (x.bu5id! == this.screenObj["__wf__bu5"]))[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchBu5List() {
    this.bu5ListShow = this.bu5List!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.bu5ListSearch.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.bu5ListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.bu5ListShow.length
  }
  selectBu5List(item: Bu5) {
    if (this.modalEmpCheck) {
      this.bu5Search = item.bu5id!
      this.bu5Desc.tdesc = item.tdesc!
      this.bu5Desc.tdesc = item.edesc!
    } else {
      this.__wf__bu5 = item.bu5id!
      this.__wf__bu5Desc.tdesc = item.tdesc!
      this.__wf__bu5Desc.edesc = item.edesc!
    }
  }
  change__wf__bu5() {
    if (this.bu5List!.filter((x: Bu5) => (x.bu5id!.toLowerCase() == this.__wf__bu5)).length == 1) {
      this.selectBu5List(this.bu5List!.filter((x: Bu5) => (x.bu5id!.toLowerCase() == this.__wf__bu5))[0])
    } else {
      this.__wf__bu5Desc = { tdesc: "", edesc: "" }
    }
  }
  changebu5Search() {
    if (this.bu5List!.filter((x: Bu5) => (x.bu5id!.toLowerCase() == this.bu5Search)).length == 1) {
      this.selectBu5List(this.bu5List!.filter((x: Bu5) => (x.bu5id!.toLowerCase() == this.bu5Search))[0])
    } else {
      this.bu5Desc = { tdesc: "", edesc: "" }
    }
  }

  getPositionList() {
    this.workflowService.getPositionList().then(result => {
      this.positionList = result.map(e => new MyPosition(e, this.translateService)).sort((a: Position, b: Position) => (a.positionId! > b.positionId!) ? 1 : -1);
      this.positionListShow = this.positionList
      if (this.runno && this.screenObj) {
        if (this.positionList!.filter((x: Position) => (x.positionId! == this.screenObj["__wf__positionid"])).length == 1) {
          this.selectPositionList(this.positionList!.filter((x: Position) => (x.positionId! == this.screenObj["__wf__positionid"]))[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchPositionList() {
    this.positionListShow = this.positionList!.filter((x: any) => ((x.tdesc + "").toLowerCase().indexOf(this.positionListSearch.toLowerCase()) !== -1 || (x.edesc + "").toLowerCase().indexOf(this.positionListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.positionListShow.length
  }
  selectPositionList(item: Position) {
    if (this.modalEmpCheck) {
      this.positionSearch = item.positionId!
      this.positionDesc.tdesc = item.tdesc!
      this.positionDesc.tdesc = item.edesc!
    } else {
      this.__wf__positionid = item.positionId!
      this.__wf__positionDesc.tdesc = item.tdesc!
      this.__wf__positionDesc.edesc = item.edesc!
    }
  }
  change__wf__positionid() {
    if (this.positionList!.filter((x: Position) => (x.positionId!.toLowerCase() == this.__wf__positionid)).length == 1) {
      this.selectPositionList(this.positionList!.filter((x: Position) => (x.positionId!.toLowerCase() == this.__wf__positionid))[0])
    } else {
      this.__wf__positionDesc = { tdesc: "", edesc: "" }
    }
  }
  changepositionSearch() {
    if (this.positionList!.filter((x: Position) => (x.positionId!.toLowerCase() == this.positionSearch)).length == 1) {
      this.selectPositionList(this.positionList!.filter((x: Position) => (x.positionId!.toLowerCase() == this.positionSearch))[0])
    } else {
      this.positionDesc = { tdesc: "", edesc: "" }
    }
  }


  getJobcodeList() {
    this.workflowService.getJobcodeList().then(result => {
      this.jobList = result.map(e => new MyJob(e, this.translateService)).sort((a: Job, b: Job) => (a.jobcodeId! > b.jobcodeId!) ? 1 : -1);
      this.jobListShow = this.jobList
      if (this.runno && this.screenObj) {
        if (this.jobList!.filter((x: Job) => (x.jobcodeId! == this.screenObj["__wf__jobid"])).length == 1) {
          this.selectJobList(this.jobList!.filter((x: Job) => (x.jobcodeId! == this.screenObj["__wf__jobid"]))[0])
          this.getBranchList()
          this.getBu1List()
          this.getBu2List()
          this.getBu3List()
          this.getBu4List()
          this.getBu5List()
          this.getPositionList()
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchJobList() {
    this.jobListShow = this.jobList!.filter(x => ((x.tdesc! + "").toLowerCase().indexOf(this.jobListSearch.toLowerCase()) !== -1 || (x.edesc! + "").toLowerCase().indexOf(this.jobListSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.jobListShow.length
  }
  selectJobList(item: Job) {
    this.__wf__jobid = item.jobcodeId!
    this.__wf__jobDesc.tdesc = item.tdesc!
    this.__wf__jobDesc.edesc = item.edesc!
    this.selectBranchList(item.branch!)
    this.selectBu1List(item.bu1!)
    this.selectBu2List(item.bu2!)
    this.selectBu3List(item.bu3!)
    this.selectBu4List(item.bu4!)
    this.selectBu5List(item.bu5!)
    this.selectPositionList(item.position!)
    this.__wf__responsibility = item.responsibility!
    this.__wf__qualification = item.qualification!
    this.__wf__fromage = item.age0!
    this.__wf__toage = item.age1!

  }
  change__wf__jobid() {
    if (this.jobList!.filter((x: Job) => (x.jobcodeId!.toLowerCase() == this.__wf__jobid)).length == 1) {
      this.selectJobList(this.jobList!.filter((x: Job) => (x.jobcodeId!.toLowerCase() == this.__wf__jobid))[0])
    } else {
      this.__wf__jobDesc = { tdesc: "", edesc: "" }
    }
  }

  getDegree() {
    this.workflowService.getDegree().then(result => {
      this.degree = result.map(e => new MyDegree(e, this.translateService)).sort((a: Degree, b: Degree) => (a.degreeId! > b.degreeId!) ? 1 : -1);
      this.degreeShow = this.degree
      if (this.runno && this.screenObj) {
        if (this.degree!.filter((x: Degree) => (x.degreeId! == this.screenObj["__wf__degreeid"])).length == 1) {
          this.selectDegree(this.degree!.filter((x: Degree) => (x.degreeId! == this.screenObj["__wf__degreeid"]))[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchDegree() {
    this.degreeShow = this.degree!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.degreeSearch.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.degreeSearch.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.degreeShow.length
  }
  selectDegree(item: Degree) {
    this.__wf__degreeid = item.degreeId!
    this.__wf__degreedesc.tdesc = item.tdesc!
    this.__wf__degreedesc.edesc = item.edesc!
  }
  change__wf__degreeid() {
    if (this.degree!.filter((x: Degree) => (x.degreeId!.toLowerCase() == this.__wf__degreeid)).length == 1) {
      this.selectDegree(this.degree!.filter((x: Degree) => (x.degreeId!.toLowerCase() == this.__wf__degreeid))[0])
    } else {
      this.__wf__degreedesc = { tdesc: "", edesc: "" }
    }
  }

  getMajor() {
    this.workflowService.getMajor().then(result => {
      this.major = result.map(e => new MyMajor(e, this.translateService)).sort((a, b) => (a.majorId! > b.majorId!) ? 1 : -1);
      this.majorShow = this.major;
      if (this.runno && this.screenObj) {
        for (let i = 1; this.screenObj["__wf__majorid$" + i]; i++) {
          if (this.major!.filter((x: Major) => (
            x.majorId!.indexOf(this.screenObj["__wf__majorid$" + i]) > -1 &&
            x.tdesc!.indexOf(this.screenObj["__wf__majortdesc$" + i]) > -1 &&
            x.edesc!.indexOf(this.screenObj["__wf__majoredesc$" + i]) > -1)).length > 0) {
            this.selectMajor(this.major!.filter((x: Major) => (
              x.majorId!.indexOf(this.screenObj["__wf__majorid$" + i]) > -1 &&
              x.tdesc!.indexOf(this.screenObj["__wf__majortdesc$" + i]) > -1 &&
              x.edesc!.indexOf(this.screenObj["__wf__majoredesc$" + i]) > -1))[0])
          }

        }
      }
      this.cdr.markForCheck();
    })
  }
  searchMajor() {
    this.majorShow = this.major!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.majorSearch) !== -1 || x.edesc.toLowerCase().indexOf(this.majorSearch) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.majorShow.length
  }
  selectMajor(item: Major) {
    this.majorIsSeclect.push(false)
    this.__wf__majorid$.push(item.majorId!)
    this.__wf__majortdesc$.push(item.tdesc!)
    this.__wf__majoredesc$.push(item.edesc!)
    this.__wf__majors.push({
      id: item.majorId,
      name: {
        tha: item.tdesc,
        eng: item.edesc
      },
      need_description: ""
    })
  }
  checkMajorAllSeclect() {
    this.majorAllSeclect = !this.majorAllSeclect
    this.majorIsSeclect.forEach((x, i: number) => {
      this.majorIsSeclect[i] = this.majorAllSeclect
    })

  }
  removeMajor() {
    this.majorIsSeclect.forEach((x: any, i: number) => {
      if (this.majorIsSeclect[parseInt(i + "")]) {
        this.__wf__majorid$.splice(i, 1)
        this.__wf__majortdesc$.splice(i, 1)
        this.__wf__majoredesc$.splice(i, 1)
        this.majorIsSeclect.splice(i, 1)
        this.removeMajor()
      }
    });
  }


  getEmployeeTypeList() {
    this.workflowService.getEmployeeTypeList().then(result => {
      this.empType = result.map(e => new MyEmployeeTypeModel(e, this.translateService))
      this.cdr.markForCheck()
    })
  }

  getSystemCodeReqtype() {
    this.workflowService.getSystemCodeReqtype().then(result => {
      this.reqType = result.map(e => new MySystemCodeReqtypeModel(e, this.translateService))
      this.cdr.markForCheck()
    })
  }

  ageCheck() {
    if (this.__wf__toage < this.__wf__fromage) {
      this.__wf__toage = this.__wf__fromage
    }
  }


  openModal(modal: string, name: string) {
    this.pageModal = 1;
    this.pageSizeModal = 10;
    this.collectionSizeModal = 0;
    if (name == "modalCompany") {
      this.branchListSearch = ""
      this.branchListShow = this.branchList
      this.collectionSizeModal = this.branchListShow!.length
    }
    if (name == "modalBu1") {
      this.bu1ListSearch = ""
      this.bu1ListShow = this.bu1List
      this.collectionSizeModal = this.bu1ListShow!.length
    }
    if (name == "modalBu2") {
      this.bu2ListSearch = ""
      this.bu2ListShow = this.bu2List
      this.collectionSizeModal = this.bu2ListShow!.length
    }
    if (name == "modalBu3") {
      this.bu3ListSearch = ""
      this.bu3ListShow = this.bu3List
      this.collectionSizeModal = this.bu3ListShow!.length
    }
    if (name == "modalBu4") {
      this.bu4ListSearch = ""
      this.bu4ListShow = this.bu4List
      this.collectionSizeModal = this.bu4ListShow!.length
    }
    if (name == "modalBu5") {
      this.bu5ListSearch = ""
      this.bu5ListShow = this.bu5List
      this.collectionSizeModal = this.bu5ListShow!.length
    }
    if (name == "modalPosition") {
      this.positionListSearch = ""
      this.positionListShow = this.positionList
      this.collectionSizeModal = this.positionListShow!.length
    }
    if (name == "modalJob") {
      this.jobListSearch = ""
      this.jobListShow = this.jobList
      this.collectionSizeModal = this.jobListShow!.length
    }
    if (name == "modalDegree") {
      this.degreeSearch = ""
      this.degreeShow = this.degree
      this.collectionSizeModal = this.degreeShow!.length
    }
    if (name == "modalMajor") {
      this.majorSearch = ""
      this.majorShow = this.major
      this.collectionSizeModal = this.majorShow!.length
    }
    if (name == "modalEmp") {
      this.modalEmpCheck = true
      this.nameCheck = false
      this.nameSearch = ""
      this.bu1Check = false
      this.bu1Search = ""
      this.bu1Desc = { tdesc: "", edesc: "" }
      this.bu2Check = false
      this.bu2Search = ""
      this.bu2Desc = { tdesc: "", edesc: "" }
      this.bu3Check = false
      this.bu3Search = ""
      this.bu3Desc = { tdesc: "", edesc: "" }
      this.bu4Check = false
      this.bu4Search = ""
      this.bu4Desc = { tdesc: "", edesc: "" }
      this.bu5Check = false
      this.bu5Search = ""
      this.bu5Desc = { tdesc: "", edesc: "" }
      this.positionCheck = false
      this.positionSearch = ""
      this.positionDesc = { tdesc: "", edesc: "" }
      this.listEmpWorkingShow = []
      this.empCheck = []
      this.empCheckAll = false
      this.collectionSizeModal = this.listEmpWorkingShow!.length
      this.modalService.open(modal, { centered: true, windowClass: "dialog-width", backdrop: "static", size: "lg" });
    } else {
      this.modalService.open(modal, { centered: true, size: "lg" });
    }

  }


  ngOnInit(): void {
  }

  cancelWF() {
    this.workflowService.cancelWF(this.workflowData).subscribe(
      (result: any) => {
        this.runno = undefined
        this.closeBtnClick()
      }
    )
  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width',
      size: 'lg'
    })
  }
  onCancel() {
    this.msg = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?'
    this.modalService.open(this.cancelModal, {
      centered: true,
      backdrop: 'static'
    })
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
}
