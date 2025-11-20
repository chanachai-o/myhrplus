import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel, MyEmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { MyPrefix, Prefix } from 'src/app/models/prefix.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { MyWorkflowRemarkModel } from 'src/app/models/workflowremarkmodel.model';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
import { WorkflowEmpInformationComponent } from 'src/app/component/workflow/workflow-type/workflow-emp-information/workflow-emp-information.component'; // Added
import { WorkflowDetailFooterComponent } from 'src/app/component/workflow/workflow-type/workflow-detail/workflow-detail-footer/workflow-detail-footer.component'; // Added
declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-pwf014-sup-detail',
  templateUrl: './pwf014-sup-detail.component.html',
  styleUrls: ['./pwf014-sup-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    WorkflowEmpInformationComponent, // Added
    WorkflowDetailFooterComponent // Added
  ]
})
export class Pwf014SupDetailComponent implements OnInit {
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  active = 1;
  activeKeep = 1;
  activeSelected = 1;
  url = environment.jbossUrl;
  @Input() data: any;
  empWork: WorkingsModel | undefined;
  empWorkProfile: EmployeeProfileModel | undefined
  working: WorkingsModel | undefined
  prefix: Prefix[] | undefined
  prefixEmp = {
    tdesc: '',
    edesc: ''
  }
  prefixSpouse = {
    tdesc: '',
    edesc: ''
  }
  prefixFather = {
    tdesc: '',
    edesc: ''
  }
  statusFather = {
    tdesc: '',
    edesc: ''
  }
  prefixMother = {
    tdesc: '',
    edesc: ''
  }
  statusMother = {
    tdesc: '',
    edesc: ''
  }
  educateArray: any
  degreeid: any = []
  degreedesc: any = []
  institue: any = []
  instituedesc: any = []
  faculty: any = []
  facultydesc: any = []
  majorid: any = []
  majordesc: any = []
  gpa: any = []
  year_start: any = []
  year_end: any = []
  load = false;
  empFamilyStatus = [
    { statusId: '0', tdesc: 'ถึงแก่กรรม', edesc: 'Died' },
    { statusId: '1', tdesc: 'มีชีวิต', edesc: 'Alive' },
    { statusId: '2', tdesc: 'สูญหาย', edesc: 'Lost' },
    { statusId: '3', tdesc: 'ทุพพลภาพ', edesc: 'Disabled' }
  ]
  empFamilyEducation = [
    { educationId: '0', tdesc: 'ไม่ได้ศึกษา', edesc: 'Non Study' },
    { educationId: '1', tdesc: 'ศึกษาในประเทศ', edesc: 'Study in the country' },
    { educationId: '2', tdesc: 'ศึกษาต่างประเทศ', edesc: 'Study abroad' },
    { educationId: '3', tdesc: 'ไม่ระบุ', edesc: 'Not specified' }
  ]
  empFamilyChild: [{
    prefixId?: string | undefined,
    prefixName?: string | undefined,
    fName?: string | undefined,
    lName?: string | undefined,
    birthday?: string | undefined,
    idCard?: string | undefined,
    occupationId?: string | undefined,
    occupationName?: string | undefined,
    otherOccupation?: string | undefined,
    status?: string | undefined,
    statusName?: string | undefined,
    statusStudy?: string | undefined,
    statusStudyName?: string | undefined
  }] = [{}]
  pageChild = 1;
  pageSizeChild = 10;
  collectionSizeChild = 0;

  config = ["PY3011", "PY9906", "PY7001", "PY3019S", "PY3033", "PY3034", "PY3028", "PY3013", "PY3030", "PY3029", "PY3030S",
    "PY3029S", "PY3060", "PY3060S", "PY3045", "PY3046", "PY3018", "PY3063", "PY3042", "PY3038", "PY9907", "PY9908", "PY3037", "PY9905",
    "PY3051", "PY9903", "PY3064", "PY3053", "PY3054", "PY3065"]
  configShow = {
    PY3011: "",
    PY9906: "",
    PY7001: "",
    PY3019S: "",
    PY3033: "",
    PY3034: "",
    PY3028: "",
    PY3013: "",
    PY3030: "",
    PY3029: "",
    PY3030S: "",
    PY3029S: "",
    PY3060: "",
    PY3060S: "",
    PY3045: "",
    PY3046: "",
    PY3018: "",
    PY3063: "",
    PY3042: "",
    PY3038: "",
    PY9907: "",
    PY9908: "",
    PY3037: "",
    PY9905: "",
    PY3051: "",
    PY9903: "",
    PY3064: "",
    PY3053: "",
    PY3054: "",
    PY3065: ""
  }
  inputs = {
    data: {},
  }
  dynamicComponent: any
  workflowData: any
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('editModal') editModal: undefined
  msg = ''

  workflowRemark: MyWorkflowRemarkModel = new MyWorkflowRemarkModel({}, this.translate)
  constructor(private empService: EmployeeService,
    public translate: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {

  }
  openDocReference() {
    this.modalService.open(this.DocReferenceModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'dialog-width'
    })
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit()
  }
  chackDeduction(item: string, i: number) {
    let now = new Date().toLocaleDateString().split(" ")[0].split("/")
    let birth = new Date(item).toLocaleDateString().split(" ")[0].split("/")
    let age = parseInt(now[2]) - parseInt(birth[2])
    if (parseInt(now[0]) < parseInt(birth[0])) {
      age = age - 1
    }
    if (parseInt(now[0]) == parseInt(birth[0]) && parseInt(now[1]) < parseInt(birth[1])) {
      age = age - 1
    }
    if (age >= 20) {
      return "-"
    } else {
      if (i == 0) {
        return "30000"
      } else {
        if (parseInt(item.split("-")[0]) >= 2018) {
          return "60000"
        } else {
          return "30000"
        }
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.data.workflowData.reference.length > 0) {
        this.workflowService.getDetailByDocNo(this.data.workflowData.reference[0].docNo!).then(result => {
          this.workflowData = result.workflowData
          this.inputs.data = result
          this.dynamicComponent = Pwf014SupDetailComponent
          this.cdr.markForCheck();
        })
      }
      this.workflowService.getWorkflowRemark(this.data.workflowData.wf_id).subscribe(result => {
        this.workflowRemark = new MyWorkflowRemarkModel(result, this.translate)
        this.cdr.markForCheck()
      })
      this.config.forEach(x => {
        this.workflowService.config(x).then(result => {
          if (result.configId == "PY3011") {
            this.configShow.PY3011 = result.configValue
          }
          if (result.configId == "PY9906") {
            this.configShow.PY9906 = result.configValue
          }
          if (result.configId == "PY7001") {
            this.configShow.PY7001 = result.configValue
          }
          if (result.configId == "PY3019S") {
            this.configShow.PY3019S = result.configValue
          }
          if (result.configId == "PY3033") {
            this.configShow.PY3033 = result.configValue
          }
          if (result.configId == "PY3034") {
            this.configShow.PY3034 = result.configValue
          }
          if (result.configId == "PY3028") {
            this.configShow.PY3028 = result.configValue
          }
          if (result.configId == "PY3013") {
            this.configShow.PY3013 = result.configValue
          }
          if (result.configId == "PY3030") {
            this.configShow.PY3030 = result.configValue
          }
          if (result.configId == "PY3029") {
            this.configShow.PY3029 = result.configValue
          }
          if (result.configId == "PY3030S") {
            this.configShow.PY3030S = result.configValue
          }
          if (result.configId == "PY3029S") {
            this.configShow.PY3029S = result.configValue
          }
          if (result.configId == "PY3060") {
            this.configShow.PY3060 = result.configValue
          }
          if (result.configId == "PY3060S") {
            this.configShow.PY3060S = result.configValue
          }
          if (result.configId == "PY3045") {
            this.configShow.PY3045 = result.configValue
          }
          if (result.configId == "PY3046") {
            this.configShow.PY3046 = result.configValue
          }
          if (result.configId == "PY3018") {
            this.configShow.PY3018 = result.configValue
          }
          if (result.configId == "PY3063") {
            this.configShow.PY3063 = result.configValue
          }
          if (result.configId == "PY3042") {
            this.configShow.PY3042 = result.configValue
          }
          if (result.configId == "PY3038") {
            this.configShow.PY3038 = result.configValue
          }
          if (result.configId == "PY9907") {
            this.configShow.PY9907 = result.configValue
          }
          if (result.configId == "PY9908") {
            this.configShow.PY9908 = result.configValue
          }
          if (result.configId == "PY3037") {
            this.configShow.PY3037 = result.configValue
          }
          if (result.configId == "PY9905") {
            this.configShow.PY9905 = result.configValue
          }
          if (result.configId == "PY3051") {
            this.configShow.PY3051 = result.configValue
          }
          if (result.configId == "PY9903") {
            this.configShow.PY9903 = result.configValue
          }
          if (result.configId == "PY3064") {
            this.configShow.PY3064 = result.configValue
          }
          if (result.configId == "PY3053") {
            this.configShow.PY3053 = result.configValue
          }
          if (result.configId == "PY3054") {
            this.configShow.PY3054 = result.configValue
          }
          if (result.configId == "PY3065") {
            this.configShow.PY3065 = result.configValue
          }
          this.cdr.markForCheck()
        })
      })
      if (!changes.data.firstChange) {
        if (this.data.workflowData.screen_value['__wf__tabEdit']) {
          if (this.data.workflowData.screen_value['__wf__tabEdit'].split('|').length > 0) {
            this.msg = ''
            if (this.translate.currentLang == 'th') {
              this.msg = this.data.workflowData.screen_value['__wf__tabEdit'].split('|').filter((x: any) => x == 'tab-1').length > 0 ? (this.msg + '<br>- ข้อมูลทั่วไป') : this.msg
              this.msg = this.data.workflowData.screen_value['__wf__tabEdit'].split('|').filter((x: any) => x == 'tab-2').length > 0 ? (this.msg + '<br>- ข้อมูลที่อยู่') : this.msg
              this.msg = this.data.workflowData.screen_value['__wf__tabEdit'].split('|').filter((x: any) => x == 'tab-3').length > 0 ? (this.msg + '<br>- ครอบครัว') : this.msg
              this.msg = this.data.workflowData.screen_value['__wf__tabEdit'].split('|').filter((x: any) => x == 'tab-4').length > 0 ? (this.msg + '<br>- ภาษี') : this.msg
              if (this.msg != '') {
                this.msg = this.msg.slice(4)
                this.modalService.open(this.editModal, {
                  centered: true,
                  backdrop: 'static'
                })
              }
            } else {
              this.msg = this.data.workflowData.screen_value['__wf__tabEdit'].split('|').filter((x: any) => x == 'tab-1').length > 0 ? this.msg + '<br>- General Information' : this.msg
              this.msg = this.data.workflowData.screen_value['__wf__tabEdit'].split('|').filter((x: any) => x == 'tab-2').length > 0 ? this.msg + '<br>- Address' : this.msg
              this.msg = this.data.workflowData.screen_value['__wf__tabEdit'].split('|').filter((x: any) => x == 'tab-3').length > 0 ? this.msg + '<br>- Family' : this.msg
              this.msg = this.data.workflowData.screen_value['__wf__tabEdit'].split('|').filter((x: any) => x == 'tab-4').length > 0 ? this.msg + '<br>- Tax' : this.msg
              if (this.msg != '') {
                this.msg = this.msg.slice(4)
                this.modalService.open(this.editModal, {
                  centered: true,
                  backdrop: 'static'
                })
              }
            }
          }
        }
      }
      this.load = true
      let educateSize = parseInt(this.data.workflowData.screen_value['__wf__educate_max_line'])
      this.educateArray = Array(educateSize).fill((x: any) => { }).map((x, i) => i);
      this.degreeid = []
      this.educateArray.forEach((x: any, i: number) => {
        this.degreeid[i] = this.data.workflowData.screen_value['__wf__mempl_educate$degreeid$' + (i + 1)];
        this.degreedesc[i] = this.data.workflowData.screen_value['__wf__mempl_educate$degreedesc$' + (i + 1)];
        this.institue[i] = this.data.workflowData.screen_value['__wf__mempl_educate$institue$' + (i + 1)];
        this.instituedesc[i] = this.data.workflowData.screen_value['__wf__mempl_educate$instituedesc$' + (i + 1)];
        this.faculty[i] = this.data.workflowData.screen_value['__wf__mempl_educate$faculty$' + (i + 1)];
        this.facultydesc[i] = this.data.workflowData.screen_value['__wf__mempl_educate$facultydesc$' + (i + 1)];
        this.majorid[i] = this.data.workflowData.screen_value['__wf__mempl_educate$majorid$' + (i + 1)];
        this.majordesc[i] = this.data.workflowData.screen_value['__wf__mempl_educate$majordesc$' + (i + 1)];
        this.gpa[i] = this.data.workflowData.screen_value['__wf__mempl_educate$gpa$' + (i + 1)];
        this.year_start[i] = this.data.workflowData.screen_value['__wf__mempl_educate$year_start$' + (i + 1)];
        this.year_end[i] = this.data.workflowData.screen_value['__wf__mempl_educate$year_end$' + (i + 1)];
      })
      this.empFamilyChild = [{}]
      this.empFamilyChild.pop()
      for (let i = 0; this.data.workflowData.screen_value["__wf__mempl_family$line_no$" + (i + 4)] != undefined; i++) {
        this.empFamilyChild.push({
          prefixId: this.data.workflowData.screen_value["__wf__mempl_family$prefix$" + (i + 4)],
          fName: this.data.workflowData.screen_value["__wf__mempl_family$fnameid$" + (i + 4)],
          lName: this.data.workflowData.screen_value["__wf__mempl_family$lname$" + (i + 4)],
          birthday: this.data.workflowData.screen_value["__wf__mempl_family$birthday$" + (i + 4)],
          statusStudy: this.data.workflowData.screen_value["__wf__mempl_family$stat_study$" + (i + 4)],
          status: this.data.workflowData.screen_value["__wf__mempl_family$status$" + (i + 4)],
          occupationId: this.data.workflowData.screen_value["__wf__mempl_family$occupation$" + (i + 4)],
          idCard: this.data.workflowData.screen_value["__wf__mempl_family$idcard$" + (i + 4)]
        })
      }
      this.collectionSizeChild = this.empFamilyChild.length
      this.empService.getWorkInformation(this.data.workflowData.screen_value.__wf__employeeid).subscribe(result => {
        this.empWork = new MyEmployeeProfileModel(result, this.translate);
        this.empService.getWorkInformation(this.empWork.employeeId).subscribe((result: any) => {
          this.working = result;
          this.cdr.markForCheck();
        })
        this.empService.getEmployeeProfile(this.empWork.employeeId).subscribe((result: any) => {
          this.empWorkProfile = result;
          this.cdr.markForCheck();
        })
        this.cdr.markForCheck();
      });
      this.workflowService.getPrefix().then(result => {
        this.prefix = result.map(x => new MyPrefix(x, this.translate)).sort((a, b) => (a.prefixId! > b.prefixId!) ? 1 : -1);
        this.prefix.forEach(x => {
          if (this.data.workflowData.screen_value['__wf__emp_prefix'] == x.prefixId) {
            this.prefixEmp.tdesc = x.tdesc!
            this.prefixEmp.edesc = x.edesc!
          }
          if (this.data.workflowData.screen_value['__wf__mempl_family$prefix$1'] == x.prefixId) {
            this.prefixSpouse.tdesc = x.tdesc!
            this.prefixSpouse.edesc = x.edesc!

          }
          if (this.data.workflowData.screen_value['__wf__mempl_family$prefix$2'] == x.prefixId) {
            this.prefixFather.tdesc = x.tdesc!
            this.prefixFather.edesc = x.edesc!
          }
          if (this.data.workflowData.screen_value['__wf__mempl_family$prefix$3'] == x.prefixId) {
            this.prefixMother.tdesc = x.tdesc!
            this.prefixMother.edesc = x.edesc!
          }
        })
        this.empFamilyStatus.forEach(x => {
          if (this.data.workflowData.screen_value['__wf__mempl_family$status$2'] == x.statusId) {
            this.statusFather.tdesc = x.tdesc!
            this.statusFather.edesc = x.edesc!
          }
          if (this.data.workflowData.screen_value['__wf__mempl_family$status$3'] == x.statusId) {
            this.statusMother.tdesc = x.tdesc!
            this.statusMother.edesc = x.edesc!
          }
        })

        this.load = false
        this.cdr.markForCheck();
      })

    }
  }
  statusDesc(id: string) {
    if (this.empFamilyStatus!.filter(x => x.statusId == id).length == 1) {
      return this.translate.currentLang == "th" ?
        this.empFamilyStatus!.filter(x => x.statusId == id)[0].tdesc :
        this.empFamilyStatus!.filter(x => x.statusId == id)[0].edesc
    }
  }
  educationDesc(id: string) {
    if (this.empFamilyEducation!.filter(x => x.educationId == id).length == 1) {
      return this.translate.currentLang == "th" ?
        this.empFamilyEducation!.filter(x => x.educationId == id)[0].tdesc :
        this.empFamilyEducation!.filter(x => x.educationId == id)[0].edesc
    }
  }
  prefixDesc(id: string) {
    if (this.prefix!.filter(x => x.prefixId == id).length == 1) {
      return this.translate.currentLang == "th" ?
        this.prefix!.filter(x => x.prefixId == id)[0].tdesc :
        this.prefix!.filter(x => x.prefixId == id)[0].edesc
    }
  }

  ngOnInit(): void {
  }
  dowloadFile() {
    this.workflowService.downloadFile(
      this.data.manageDocument.attachFile[0].subFolder,
      this.data.manageDocument.attachFile[0].name
    ).then(result => {
      let myBlob;
      if (result) {
        myBlob = new Blob([result]);
      } else {
        myBlob = new Blob([""]);
      }
      FileSaver.saveAs(myBlob, this.data.manageDocument.attachFile[0].name);
    });
  }
  dowloadFile2() {
    // this.workflowService.downloadFile(
    //   this.data.manageDocument.attachFile[0].subFolder,
    //   this.data.workflowData.screen_value['__wf__mempl_card$atfile$1']
    // ).then(result => {
    //   let myBlob;
    //   if (result) {
    //     myBlob = new Blob([result]);
    //   } else {
    //     myBlob = new Blob([""]);
    //   }
    //   FileSaver.saveAs(myBlob, this.data.manageDocument.attachFile[0].name);
    // });
  }

  checkEdit(name: string) {
    if (this.data.workflowData.screen_value['__wf__fieldFocus']) {
      return this.data.workflowData.screen_value['__wf__fieldFocus'].split('|').filter((x: string) => x.startsWith(name)).length != 0 ? true : false
    }
    return false
  }
}
