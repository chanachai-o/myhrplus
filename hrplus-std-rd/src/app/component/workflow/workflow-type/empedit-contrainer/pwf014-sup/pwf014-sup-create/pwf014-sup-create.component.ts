import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core'
import { NgbDate, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { EmployeeService } from 'src/app/services/employee.service'
import { workflowService } from 'src/app/services/workflow.service'
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model'


import localeThai from '@angular/common/locales/th'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location, DecimalPipe } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { SendtoModel, MySendtoModel } from 'src/app/models/sendtomodel.model'
import { TranslateService } from '@ngx-translate/core'
import { MyPrefix, Prefix } from 'src/app/models/prefix.model'
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model'
import { Degree, MyDegree } from 'src/app/models/degree.model'
import { Institue, MyInstitue } from 'src/app/models/institue.model'
import { Major, MyMajor } from 'src/app/models/major.model'
import { Faculty, MyFaculty } from 'src/app/models/faculty.model'
import { MyZipcodeObject, ZipcodeObject } from 'src/app/models/zipcodeObject.model'
import { Tax } from 'src/app/models/tax.model'
import { MyWorkModel, WorkModel } from 'src/app/models/work.model'
import { EmployeeProfileAllAddress, EmployeeProfileAllModel, MyEmployeeProfileAllAddress, ProfileFamilyChildren } from 'src/app/models/employeeprofileall.model'
import { Pwf014SupDetailComponent } from '../pwf014-sup-detail/pwf014-sup-detail.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormControl, Validators } from '@angular/forms'
import { SendTo } from 'src/app/models/sendto.model'
import { MyWorkflowRemarkModel } from 'src/app/models/workflowremarkmodel.model'
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component'
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'



@Component({
  selector: 'app-pwf014-sup-create',
  templateUrl: './pwf014-sup-create.component.html',
  styleUrls: ['./pwf014-sup-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent // Added
  ],
  providers: [DecimalPipe],
})
export class Pwf014SupCreateComponent implements OnInit {
  @Input() data: any;
  __wf__deduct_childs = 0

  nameFileTimestampFile: any
  nameFile = "browse_file"
  map1Name = "browse_file"
  map0Name = "browse_file"
  spouseName = "browse_file"
  nameFilecheck = false
  map1Namecheck = false
  map0Namecheck = false
  spouseNamecheck = false


  tab4checkNo4FormControl1 = new UntypedFormControl("", [Validators.required])
  tab4checkNo4FormControl2 = new UntypedFormControl("", [Validators.required])
  tab4checkNo4FormControl3 = new UntypedFormControl("", [Validators.required])
  tab4checkNo4FormControl4 = new UntypedFormControl("", [Validators.required])
  tab4checkNo5FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo6FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo7FormControl = new UntypedFormControl("", [Validators.required])
  empTaxInsurancePensions = ""
  tab4checkNo9FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo10FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo11FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo12FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo14FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo15FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo16FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo17FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo18FormControl = new UntypedFormControl("", [Validators.required])
  empTaxDonationSpecial = ""
  tab4checkNo19FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo20FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo22FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo23FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo24FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo25FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo26FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo27FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo28FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo29FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo30FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo31FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo32FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo33FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo34FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo35FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo36FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo37FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo38FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo39FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo40FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo41FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo42FormControl = new UntypedFormControl("", [Validators.required])
  tab4checkNo43FormControl = new UntypedFormControl("", [Validators.required])

  familyChildrenIdCardFormControl = new UntypedFormControl("", [Validators.required])

  __wf__ofname = ""
  __wf__olname = ""
  deductibleAllowance: string[] = []

  familyChildren: ProfileFamilyChildren = {
    prefixId: "",
    prefixName: "",
    fName: "",
    lName: "",
    birthday: "",
    idCard: "",
    occupationId: "",
    occupationName: "",
    otherOccupation: "",
    status: "",
    statusName: "",
    statusStudy: "",
    statusStudyName: ""
  }
  familyChildBirthday: NgbDate[] = []
  familyChildBirthdayEdit = new NgbDate(0, 0, 0)
  familyChildSelect: boolean[] = []

  wfid: any
  token: any
  tax: Tax | undefined
  working: WorkingsModel | undefined
  profile: EmployeeProfileModel | undefined
  re = /\//gi
  date = new Date()
  nowDate = new NgbDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
  nowDateParser = this.parserFormat.format(this.nowDate).replace(this.re, '-')
  marryDate = new NgbDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
  marryDateParser = this.parserFormat.format(this.marryDate).replace(this.re, '-')

  sendtoWF: SendtoModel | undefined
  sendTo: SendTo | undefined

  @ViewChild('alertModal') alertModal: undefined
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  @ViewChild('confirmModal') confirmModal: undefined
  timestampFile: any
  newFile: any
  uploadFilename: any
  uploadFileSize: any
  uploadConfig: any
  msg = ''
  selectStartEmpDate = new NgbDate(0, 0, 0)
  selectStartEmpDateParser = this.parserFormat.format(this.selectStartEmpDate).replace(this.re, '-')

  emp: EmployeeProfileAllModel | undefined
  empAddrCurrent1: EmployeeProfileAllAddress | undefined
  empAddrCurrent0: EmployeeProfileAllAddress | undefined


  empFamilySpouseBirthday = new NgbDate(0, 0, 0)
  empFamilySpouseBirthdayParser = this.parserFormat.format(this.empFamilySpouseBirthday).replace(this.re, '-')

  empFamilySpouse = {
    id: '',
    prefix: {
      prefixId: '',
      tdesc: '',
      edesc: ''
    },
    fname: '',
    lname: '',
    birthday: this.empFamilySpouseBirthdayParser,
    fileTimestamp: 0,
    fileName: 'browse_file',
    fileUpload: false,
    work: {
      workId: '',
      tdesc: '',
      edesc: ''
    }
  }
  empFamilyFatherBirthday = new NgbDate(0, 0, 0)
  empFamilyFatherBirthdayParser = this.parserFormat.format(this.empFamilyFatherBirthday).replace(this.re, '-')
  empFamilyFather = {
    id: '',
    prefix: {
      prefixId: '',
      tdesc: '',
      edesc: ''
    },
    fname: '',
    lname: '',
    birthday: this.empFamilyFatherBirthdayParser,
    work: {
      workId: '',
      tdesc: '',
      edesc: ''
    },
    status: {
      statusId: '',
      tdesc: '',
      edesc: ''
    }
  }
  empFamilyMotherBirthday = new NgbDate(0, 0, 0)
  empFamilyMotherBirthdayParser = this.parserFormat.format(this.empFamilyMotherBirthday).replace(this.re, '-')
  empFamilyMother = {
    id: '',
    prefix: {
      prefixId: '',
      tdesc: '',
      edesc: ''
    },
    fname: '',
    lname: '',
    birthday: this.empFamilyMotherBirthdayParser,
    work: {
      workId: '',
      tdesc: '',
      edesc: ''
    },
    status: {
      statusId: '',
      tdesc: '',
      edesc: ''
    }

  }

  empFamilyChildBirthday = new NgbDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
  empFamilyChildBirthdayParser = this.parserFormat.format(this.empFamilyChildBirthday).replace(this.re, '-')

  empFamilyChild = {
    id: '',
    prefix: {
      prefixId: '',
      tdesc: '',
      edesc: ''
    },
    fname: '',
    lname: '',
    birthday: this.empFamilyChildBirthdayParser,
    education: {
      educationId: '',
      tdesc: '',
      edesc: ''
    },
    status: {
      statusId: '',
      tdesc: '',
      edesc: ''
    },
    isSelect: false
  }
  fatherIdCheck3 = false
  fatherId3 = ''
  motherIdCheck3 = false
  motherId3 = ''
  fatherSpouseIdCheck3 = false
  fatherSpouseId3 = ''
  motherSpouseIdCheck3 = false
  motherSpouseId3 = ''

  fatherIdCheck4 = false
  fatherId4 = ''
  fatherInsurance4 = '0.00'
  motherIdCheck4 = false
  motherId4 = ''
  motherInsurance4 = '0.00'
  fatherSpouseIdCheck4 = false
  fatherSpouseId4 = ''
  fatherSpouseInsurance4 = '0.00'
  motherSpouseIdCheck4 = false
  motherSpouseId4 = ''
  motherSpouseInsurance4 = '0.00'

  prefix: Prefix[] | undefined

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

  isSelect = false

  degree: Degree[] | undefined
  degreeShow: Degree[] | undefined
  searchDegree = ''

  institue: Institue[] | undefined
  institueShow: Institue[] | undefined
  searchInstitue = ''

  faculty: Faculty[] | undefined
  facultyShow: Faculty[] | undefined
  searchFaculty = ''

  major: Major[] | undefined
  majorShow: Major[] | undefined
  searchMajor = ''

  educationNew = {
    degreeId: "",
    degreeName: "",
    endYear: 0,
    facultyId: "",
    facultyName: "",
    gpa: 0,
    instituteId: "",
    instituteName: "",
    majorId: "",
    majorName: "",
    startYear: 0,
  }

  zipcode: ZipcodeObject[] | undefined
  zipcodeShow: ZipcodeObject[] | undefined
  searchZipcode = ''

  work: WorkModel[] | undefined
  workShow: WorkModel[] | undefined
  searchWork = ''

  bS = true
  bM0 = false
  bM1 = false
  b0 = false
  b1 = false
  bW1 = false
  bW2 = false
  bD1 = false
  bD2 = false

  pageModal = 1
  pageSizeModal = 10
  collectionSizeModal = 0
  indexEdit = -1

  remark = ''

  page = 0
  pageSize = 10
  collectionSize = 0
  active = 1
  activeKeep = 1
  activeSelected = 1
  isDisableMarryStatus: boolean = true
  isDisableMarryStatus2: boolean = true

  firstHome = "0.00"
  firstHome2 = "0.00"
  travelInCountry = '0.00'
  travelInCountry2 = '0.00'
  buyEbook = '0.00'
  buyEbook2 = '0.00'

  __wf__employeeid = ""

  empListSearch = ""
  empList: WorkingsModel[] | undefined
  empListShow: WorkingsModel[] | undefined
  empListSelect: WorkingsModel | undefined

  //set date Max/Min
  changeDate = new Date();
  maxDate = { year: this.changeDate.getFullYear(), month: this.changeDate.getMonth() + 1, day: this.changeDate.getDate() }
  maxDate2 = { year: this.changeDate.getFullYear() + 5, month: 12, day: 31 }
  minDate = { year: this.changeDate.getFullYear() - 100, month: 1, day: 1 }



  runno: any
  screen_value: any
  workflowData: any

  inputs = {
    data: {}
  }
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('cancelModal') cancelModal: undefined
  dynamicComponent: any

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
  firstIn = false
  referenceParam = ""

  __wf__fieldFocusArray: string[] = []
  __wf__tabEditArray: string[] = []
  empOld: EmployeeProfileAllModel | undefined
  empAddrCurrent1Old: EmployeeProfileAllAddress | undefined
  empAddrCurrent0Old: EmployeeProfileAllAddress | undefined
  empFamilyFatherBirthdayOld = new NgbDate(0, 0, 0)
  empFamilyMotherBirthdayOld = new NgbDate(0, 0, 0)
  firstHomeOld = "0.00"
  firstHome2Old = "0.00"
  empFamilySpouseBirthdayOld = new NgbDate(0, 0, 0)
  taxOld: Tax | undefined
  travelInCountryOld = '0.00'
  travelInCountry2Old = '0.00'
  buyEbook2Old = '0.00'
  workflowRemark: MyWorkflowRemarkModel = new MyWorkflowRemarkModel({}, this.translateService)

  employeeCCId = ""
  constructor(private modalService: NgbModal,
    private workflowService: workflowService,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    public translateService: TranslateService,
    private parserFormat: NgbDateParserFormatter,
    private _decimalPipe: DecimalPipe,
    private local: Location) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })
    if (this.runno) {
      this.firstIn = true
    }
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
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
      this.workflowService.getWorkflowRemark(this.wfid).subscribe(result => {
        this.workflowRemark = new MyWorkflowRemarkModel(result, this.translateService)
        this.cdr.markForCheck()
      })
    })
    this.getPrefix()
    this.sendtoWFApi()
    this.getuploadWFApi()
    this.getEmpHr()
  }
  getEmpHr() {
    this.workflowService.getEmpHr2().then(result => {
      this.empList = result.map(e => new MyWorkingsModel(e, this.translateService)).sort((a, b) => (a.employeeId! > b.employeeId!) ? 1 : -1)
      this.empListSelect = this.empList[0]
      this.empListShow = this.empList
      this.__wf__employeeid = this.empListSelect.employeeId!
      this.getEmpService(this.__wf__employeeid)
      this.getEmployeeAllProfile(this.__wf__employeeid)
      this.cdr.markForCheck()
    })
  }
  searchEmpHr() {
    this.empListShow = this.empList!.filter((x: any) => ((x.fname + ' ' + x.lname).toLowerCase().indexOf(this.empListSearch.toLowerCase()) !== -1 || (x.efname + ' ' + x.elname).toLowerCase().indexOf(this.empListSearch.toLowerCase()) !== -1))
    this.pageModal = 1
    this.collectionSizeModal = this.empListShow.length
  }
  selectEmpHr(item: WorkingsModel) {
    this.empListSelect = item
    this.__wf__employeeid = this.empListSelect.employeeId!
    this.getEmpService(this.__wf__employeeid)
    this.getEmployeeAllProfile(this.__wf__employeeid)
  }
  marryDateParserChange() {
    this.marryDateParser = this.parserFormat.format(this.marryDate).replace(this.re, '-')
  }

  async getEmpService(empId: string) {
    await this.empService.getTax(empId).then(result => {
      this.__wf__fieldFocusArray = []
      this.__wf__tabEditArray = []
      this.tax = result;
      this.taxOld = JSON.parse(JSON.stringify(this.tax))
      // tab 4 N0 5
      this.tax.insurance = this.tab4ToMoney(this.tax.insurance)
      // tab 4 N0 6
      this.tax.insurance_spouse = this.tab4ToMoney(this.tax.insurance_spouse)
      // tab 4 N0 9
      this.tax.rmf = this.tab4ToMoney(this.tax.rmf)
      // tab 4 N0 10
      this.tax.ssf = this.tab4ToMoney(this.tax.ssf)
      // tab 4 N0 11
      this.tax.ltf = this.tab4ToMoney(this.tax.ltf)
      // tab 4 N0 12
      this.tax.interest = this.tab4ToMoney(this.tax.interest)
      // tab 4 N0 15
      this.tax.edudonation = this.tab4ToMoney(this.tax.edudonation)
      // tab 4 N0 16
      this.tax.sportdonation = this.tab4ToMoney(this.tax.sportdonation)
      // tab 4 N0 17
      this.tax.hospitalDonation = this.tab4ToMoney(this.tax.hospitalDonation)
      // tab 4 N0 19
      this.tax.donation = this.tab4ToMoney(this.tax.donation)
      // tab 4 N0 20
      this.tax.politicalDonation = this.tab4ToMoney(this.tax.politicalDonation)
      // tab 4 N0 24
      this.tax.homeRepair2 = this.tab4ToMoney(this.tax.homeRepair2)
      // tab 4 N0 25
      this.tax.carRepair2 = this.tab4ToMoney(this.tax.carRepair2)
      // tab 4 N0 26
      this.travelInCountry = this.tax.travel_in_country
      this.travelInCountry = this.tab4ToMoney(this.travelInCountry)
      this.travelInCountryOld = this.tax.travel_in_country
      this.travelInCountryOld = this.tab4ToMoney(this.travelInCountryOld)
      // tab 4 N0 27
      this.travelInCountry2 = this.tax.travel_in_country
      this.travelInCountry2 = this.tab4ToMoney(this.travelInCountry2)
      this.travelInCountry2Old = this.tax.travel_in_country
      this.travelInCountry2Old = this.tab4ToMoney(this.travelInCountry2Old)
      // tab 4 N0 28
      this.tax.childbirth = this.tab4ToMoney(this.tax.childbirth)
      // tab 4 N0 29
      this.tax.otop = this.tab4ToMoney(this.tax.otop)
      // tab 4 N0 30
      this.tax.buyEducationSport = this.tab4ToMoney(this.tax.buyEducationSport)
      // tab 4 N0 31
      this.tax.buyEbook = this.tab4ToMoney(this.tax.buyEbook)
      // tab 4 N0 32
      this.tax.savings = this.tab4ToMoney(this.tax.savings)
      // tab 4 N0 33
      this.tax.healthInsurance = this.tab4ToMoney(this.tax.healthInsurance)
      // tab 4 N0 34
      this.tax.buyCctv = this.tab4ToMoney(this.tax.buyCctv)
      // tab 4 N0 35
      this.tax.debitCardFee = this.tab4ToMoney(this.tax.debitCardFee)
      // tab 4 N0 36
      this.tax.investStartup = this.tab4ToMoney(this.tax.investStartup)
      // tab 4 N0 37
      this.tax.songkranFestival = this.tab4ToMoney(this.tax.songkranFestival)
      // tab 4 N0 38
      this.tax.buyRubber = this.tab4ToMoney(this.tax.buyRubber)
      // tab 4 N0 39
      this.buyEbook2 = this.tax.bookEbook
      this.buyEbook2 = this.tab4ToMoney(this.buyEbook2)
      this.buyEbook2Old = this.tax.bookEbook
      this.buyEbook2Old = this.tab4ToMoney(this.buyEbook2Old)
      // tab 4 N0 40
      this.tax.buyInCountry = this.tab4ToMoney(this.tax.buyInCountry)
      // tab 4 N0 41
      this.tax.homeRepair2 = this.tab4ToMoney(this.tax.homeRepair2)
      // tab 4 N0 42
      this.tax.carRepair2 = this.tab4ToMoney(this.tax.carRepair2)
      // tab 4 N0 43
      this.tax.ssfSpecial = this.tab4ToMoney(this.tax.ssfSpecial)


      this.buyEbook = this.tax.bookEbook


      if (this.tax!.statmarry == 'S') {
        this.bS = true;
        this.bM0 = false;
        this.bM1 = false;
        this.b0 = false;
        this.b1 = false;
        this.bW1 = false;
        this.bW2 = false;
        this.bD1 = false;
        this.bD2 = false;
      }
      if (this.tax!.statmarry == 'M') {
        this.isDisableMarryStatus = false
        this.isDisableMarryStatus2 = false
        if (this.tax!.marryregister == '0') {
          this.bS = false;
          this.bM0 = true;
          this.bM1 = false;
          this.b0 = false;
          this.b1 = false;
          this.bW1 = false;
          this.bW2 = false;
          this.bD1 = false;
          this.bD2 = false;
        }
        if (this.tax!.marryregister == '1') {
          if (this.tax!.inc_spouse == '0') {
            this.bS = false;
            this.bM0 = false;
            this.bM1 = true;
            this.b0 = true;
            this.b1 = false;
            this.bW1 = false;
            this.bW2 = false;
            this.bD1 = false;
            this.bD2 = false;
          }
          if (this.tax!.inc_spouse == '1') {
            this.bS = false;
            this.bM0 = false;
            this.bM1 = true;
            this.b0 = false;
            this.b1 = true;
            this.bW1 = false;
            this.bW2 = false;
            this.bD1 = false;
            this.bD2 = false;
          }
        }
      }
      if (this.tax!.statmarry == 'W') {
        this.bS = false;
        this.bM0 = false;
        this.bM1 = false;
        this.b0 = false;
        this.b1 = false;
        this.bW1 = true;
        this.bW2 = false;
        this.bD1 = false;
        this.bD2 = false;
      }
      if (this.tax!.statmarry == 'D') {
        this.bS = false;
        this.bM0 = false;
        this.bM1 = false;
        this.b0 = false;
        this.b1 = false;
        this.bW1 = false;
        this.bW2 = false;
        this.bD1 = true;
        this.bD2 = false;
      }
      if (this.tax!.statmarry == 'E') {
        this.bS = true;
        this.bM0 = false;
        this.bM1 = false;
        this.b0 = false;
        this.b1 = false;
        this.bW1 = false;
        this.bW2 = false;
        this.bD1 = false;
        this.bD2 = false;
      }
      this.cdr.markForCheck();
    })
    this.empService.getWorkInformation(empId).subscribe((result: any) => {
      this.working = result
      this.cdr.markForCheck()
    })
    this.empService.getEmployeeProfile(empId).subscribe((result: any) => {
      this.profile = result
      this.cdr.markForCheck()
    })
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe(result => {
      this.sendtoWF = new MySendtoModel(result, this.translateService)
      this.sendTo = this.sendtoWF.sendTo!.length > 0 ? this.sendtoWF.sendTo![0] : undefined
      this.cdr.markForCheck()
    })
  }
  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result
    })
  }
  async filecheckUpload(files: any, type: string) {
    var reader: any = new FileReader()
    reader = new FileReader()
    reader.onload = () => {
      const json = btoa(reader.result)
      this.newFile = json
    }
    reader.readAsBinaryString(files[0])
    this.uploadFilename = files[0].name
    let uploadFileSize = files[0].size
    if (type == "file") {
      this.nameFilecheck = true
    }
    if (type == "map1") {
      this.map1Namecheck = true
    }
    if (type == "map0") {
      this.map0Namecheck = true
    }
    if (type == "spouse") {
      this.spouseNamecheck = true
    }
    if (uploadFileSize > this.uploadConfig.maxSize) {
      if (type == "file") {
        this.nameFile = "browse_file"
        this.nameFilecheck = false
      }
      if (type == "map1") {
        this.map1Name = "browse_file"
        this.map1Namecheck = false
      }
      if (type == "map0") {
        this.map0Name = "browse_file"
        this.map0Namecheck = false
      }
      if (type == "spouse") {
        this.spouseName = "browse_file"
        this.spouseNamecheck = false
      }
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
  async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  onFileSelected(event: any, type: string) {
    var files = event.target.files
    if (files.length > 0) {
      if (type == "file") {
        if (files[0].name != this.nameFile) {
          this.filecheckUpload(files, type)
        }
      }
      if (type == "map1") {
        if (files[0].name != this.map1Name) {
          this.filecheckUpload(files, type)
        }
      }
      if (type == "map0") {
        if (files[0].name != this.map0Name) {
          this.filecheckUpload(files, type)
        }
      }
      if (type == "spouse") {
        if (files[0].name != this.spouseName) {
          this.filecheckUpload(files, type)
        }
      }
    }
    this.fileInput!.nativeElement.value = ""
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
      if (this.map1Namecheck || this.map0Namecheck || this.spouseNamecheck) {
        body.uploadfield = "mempl_card.atfile"
        body.subfolder = "";
        if (this.map1Namecheck || this.map0Namecheck) {
          body.uploadfield = "mempl_addr.picture";
        }
      }
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          if (this.nameFilecheck) {
            this.nameFile = "browse_file"
          }
          if (this.map1Namecheck) {
            this.map1Name = "browse_file"
          }
          if (this.map0Namecheck) {
            this.map0Name = "browse_file"
          }
          if (this.spouseNamecheck) {
            this.spouseName = "browse_file"
          }
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.'
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        } else {
          if (this.nameFilecheck) {
            this.nameFile = body.fileName
            this.nameFileTimestampFile = this.timestampFile
          }
          if (this.map1Namecheck) {

            this.map1Name = result.message
          }
          if (this.map0Namecheck) {
            this.map0Name = result.message
          }
          if (this.spouseNamecheck) {
            this.spouseName = result.message
          }
        }
        this.nameFilecheck = false
        this.map1Namecheck = false
        this.map0Namecheck = false
        this.spouseNamecheck = false
      })


    }
    this.closeBtnClick()
  }
  resetIMG() {
    this.timestampFile = '';
    this.nameFile = 'browse_file';
    this.nameFileTimestampFile = this.timestampFile
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit()
  }
  selectStartEmpDateChange() {
    this.selectStartEmpDateParser = this.parserFormat.format(this.selectStartEmpDate).replace(this.re, '-')
  }
  empFamilySpouseBirthdayChange() {
    this.empFamilySpouseBirthdayParser = this.parserFormat.format(this.empFamilySpouseBirthday).replace(this.re, '-')
    this.empFamilySpouse.birthday = this.empFamilySpouseBirthdayParser
  }
  empFamilyFatherBirthdayChange() {
    this.empFamilyFatherBirthdayParser = this.parserFormat.format(this.empFamilyFatherBirthday).replace(this.re, '-')
    this.empFamilyFather.birthday = this.empFamilyFatherBirthdayParser
  }
  empFamilyMotherBirthdayChange() {
    this.empFamilyMotherBirthdayParser = this.parserFormat.format(this.empFamilyMotherBirthday).replace(this.re, '-')
    this.empFamilyMother.birthday = this.empFamilyMotherBirthdayParser
  }
  empFamilyChildBirthdayChange() {
    this.empFamilyChildBirthdayParser = this.parserFormat.format(this.empFamilyChildBirthday).replace(this.re, '-')
    this.empFamilyChild.birthday = this.empFamilyChildBirthdayParser
  }
  taxNo3(item: string) {
    if (item == "father") {
      this.fatherIdCheck3 = !this.fatherIdCheck3
      if (this.fatherIdCheck3) {
        this.fatherId3 = this.emp!.family.father.idCard
      } else {
        this.fatherId3 = ''
      }
    }
    if (item == "mother") {
      this.motherIdCheck3 = !this.motherIdCheck3
      if (this.motherIdCheck3) {
        this.motherId3 = this.emp!.family.mother.idCard
      } else {
        this.motherId3 = ''
      }
    }
    if (item == "fatherSpouse") {
      this.fatherSpouseIdCheck3 = !this.fatherSpouseIdCheck3
      if (this.fatherSpouseIdCheck3) {
        this.fatherSpouseId3 = this.emp!.family.spouse.fatherIdCard
      } else {
        this.fatherSpouseId3 = ''
      }
    }
    if (item == "motherSpouse") {
      this.motherSpouseIdCheck3 = !this.motherSpouseIdCheck3
      if (this.motherSpouseIdCheck3) {
        this.motherSpouseId3 = this.emp!.family.spouse.motherIdCard
      } else {
        this.motherSpouseId3 = ''
      }
    }
  }

  calTaxNo3() {
    let all = 0
    if (this.fatherIdCheck3) {
      all = all + 30000
    }
    if (this.motherIdCheck3) {
      all = all + 30000
    }
    if (this.fatherSpouseIdCheck3) {
      all = all + 30000
    }
    if (this.motherSpouseIdCheck3) {
      all = all + 30000
    }
    return all
  }
  taxNo4(item: string) {
    if (item == "father") {
      this.fatherIdCheck4 = !this.fatherIdCheck4
      if (this.fatherIdCheck4) {
        this.fatherId4 = this.emp!.family.father.idCard
        this.fatherInsurance4 = this.tax!.ins_fat
      } else {
        this.fatherId4 = ""
        this.fatherInsurance4 = '0.00'
      }
    }
    if (item == "mother") {
      this.motherIdCheck4 = !this.motherIdCheck4
      if (this.motherIdCheck4) {
        this.motherId4 = this.emp!.family.mother.idCard
        this.motherInsurance4 = this.tax!.ins_mot
      } else {
        this.motherId4 = ""
        this.motherInsurance4 = '0.00'
      }
    }
    if (item == "fatherSpouse") {
      this.fatherSpouseIdCheck4 = !this.fatherSpouseIdCheck4
      if (this.fatherSpouseIdCheck4) {
        this.fatherSpouseId4 = this.emp!.family.spouse.fatherIdCard
        this.fatherSpouseInsurance4 = this.tax!.ins_fat_spouse
      } else {
        this.fatherSpouseId4 = ""
        this.fatherSpouseInsurance4 = '0.00'
      }
    }
    if (item == "motherSpouse") {
      this.motherSpouseIdCheck4 = !this.motherSpouseIdCheck4
      if (this.motherSpouseIdCheck4) {
        this.motherSpouseId4 = this.emp!.family.spouse.motherIdCard
        this.motherSpouseInsurance4 = this.tax!.ins_mot_spouse
      } else {
        this.motherSpouseId4 = ""
        this.motherSpouseInsurance4 = '0.00'
      }
    }
  }
  taxNo24(item: string) {
    this.tax!.iscripple = item
    this.changeValue('__wf__iscripple', this.taxOld!.iscripple, 'radio', 'tab-4', this.tax!.iscripple)
  }
  taxNo24o2(item: string) {
    this.tax!.is_cripple = item
    this.changeValue('__wf__is_cripple', this.taxOld!.is_cripple, 'radio', 'tab-4', this.tax!.is_cripple)
  }
  async getEmployeeAllProfile(empId: string) {
    await this.workflowService.getEmployeeAllProfile(empId).then(result => {
      this.__wf__fieldFocusArray = []
      this.__wf__tabEditArray = []
      this.emp = result
      this.empOld = JSON.parse(JSON.stringify(this.emp))
      this.__wf__deduct_childs = this.emp.tax.childDomestic + this.emp.tax.childAbroad
      this.emp.family.spouse.prefixId = this.emp.family.spouse.prefixId == undefined ? "01" : this.emp.family.spouse.prefixId
      this.emp.family.father.prefixId = this.emp.family.father.prefixId == undefined ? "01" : this.emp.family.father.prefixId
      this.emp.family.mother.prefixId = this.emp.family.mother.prefixId == undefined ? "03" : this.emp.family.mother.prefixId
      this.emp.family.father.status = this.emp.family.father.status == undefined ? "1" : this.emp.family.father.status
      this.emp.family.mother.status = this.emp.family.mother.status == undefined ? "1" : this.emp.family.mother.status
      // tab 4 N0 7
      this.empTaxInsurancePensions = this.emp.tax.insurancePensions.toString()
      this.empTaxInsurancePensions = this.tab4ToMoney(this.empTaxInsurancePensions)

      // tab 4 N0 18
      this.empTaxDonationSpecial = this.emp.tax.donationSpecial.toLocaleString()
      this.empTaxDonationSpecial = this.tab4ToMoney(this.empTaxDonationSpecial)

      // tab 4 N0 22
      this.firstHome = this.emp.tax.firstHome.toString()
      this.firstHome = this.tab4ToMoney(this.firstHome)
      this.firstHomeOld = this.emp.tax.firstHome.toString()
      this.firstHomeOld = this.tab4ToMoney(this.firstHomeOld)
      // tab 4 N0 23
      this.firstHome2 = this.emp.tax.firstHome.toString()
      this.firstHome2 = this.tab4ToMoney(this.firstHome2)
      this.firstHome2Old = this.emp.tax.firstHome.toString()
      this.firstHome2Old = this.tab4ToMoney(this.firstHome2Old)

      this.addkDeduction()
      this.__wf__ofname = this.emp.employee.firstName
      this.__wf__olname = this.emp.employee.lastName
      if (this.emp.family.spouse.birthday) {
        this.empFamilySpouseBirthday = new NgbDate(parseInt(this.emp.family.spouse.birthday.split("-")[0]), parseInt(this.emp.family.spouse.birthday.split("-")[1]), parseInt(this.emp.family.spouse.birthday.split("-")[2]))
        this.empFamilySpouseBirthdayOld = new NgbDate(parseInt(this.emp.family.spouse.birthday.split("-")[0]), parseInt(this.emp.family.spouse.birthday.split("-")[1]), parseInt(this.emp.family.spouse.birthday.split("-")[2]))
      }
      if (this.emp.family.father.birthday) {
        this.empFamilyFatherBirthday = new NgbDate(parseInt(this.emp.family.father.birthday.split("-")[0]), parseInt(this.emp.family.father.birthday.split("-")[1]), parseInt(this.emp.family.father.birthday.split("-")[2]))
        this.empFamilyFatherBirthdayOld = new NgbDate(parseInt(this.emp.family.father.birthday.split("-")[0]), parseInt(this.emp.family.father.birthday.split("-")[1]), parseInt(this.emp.family.father.birthday.split("-")[2]))
      }
      if (this.emp.family.mother.birthday) {
        this.empFamilyMotherBirthday = new NgbDate(parseInt(this.emp.family.mother.birthday.split("-")[0]), parseInt(this.emp.family.mother.birthday.split("-")[1]), parseInt(this.emp.family.mother.birthday.split("-")[2]))
        this.empFamilyMotherBirthdayOld = new NgbDate(parseInt(this.emp.family.mother.birthday.split("-")[0]), parseInt(this.emp.family.mother.birthday.split("-")[1]), parseInt(this.emp.family.mother.birthday.split("-")[2]))
      }
      this.emp!.family.children.forEach((x, i) => {
        this.familyChildBirthday[i] = new NgbDate(parseInt(x.birthday.split("-")[0]), parseInt(x.birthday.split("-")[1]), parseInt(x.birthday.split("-")[2]))
        this.familyChildSelect[i] = false
      });
      this.emp!.tax.totalChildren = this.emp!.family.children.length

      if (this.emp.tax.statusMarry == "M") {
        this.marryDate = new NgbDate(parseInt(this.emp.tax.dateMarry.split("-")[0]), parseInt(this.emp.tax.dateMarry.split("-")[1]), parseInt(this.emp.tax.dateMarry.split("-")[2]));
      } else {
        this.marryDate = new NgbDate(0, 0, 0);
      }

      this.fatherIdCheck3 = false
      this.fatherId3 = ''
      if (this.emp.tax.extenuateFather == 1) {
        this.fatherIdCheck3 = true
        this.fatherId3 = this.emp.family.father.idCard
      }
      this.motherIdCheck3 = false
      this.motherId3 = ''
      if (this.emp.tax.extenuateMother == 1) {
        this.motherIdCheck3 = true;
        this.motherId3 = this.emp.family.mother.idCard
      }
      this.fatherSpouseIdCheck3 = false
      this.fatherSpouseId3 = ''
      if (this.emp.tax.extenuateSpouseFather == 1) {
        this.fatherSpouseIdCheck3 = true;
        this.fatherSpouseId3 = this.emp.family.spouse.fatherIdCard
      }
      this.motherSpouseIdCheck3 = false
      this.motherSpouseId3 = ''
      if (this.emp.tax.extenuateSpouseMother == 1) {
        this.motherSpouseIdCheck3 = true;
        this.motherSpouseId3 = this.emp.family.spouse.motherIdCard
      }

      this.fatherIdCheck4 = false;
      this.fatherId4 = ''
      this.fatherInsurance4 = '0.00'
      if (this.emp.tax.insuranceFather <= 15000 && this.emp.tax.fatherIdCard) {
        this.fatherIdCheck4 = true;
        this.fatherId4 = this.emp.tax.fatherIdCard
        this.fatherInsurance4 = this.tax!.ins_fat
        this.tab4check(4, 1)
      }

      this.motherIdCheck4 = false;
      this.motherId4 = ''
      this.motherInsurance4 = '0.00'
      if (this.emp.tax.insuranceMother <= 15000 && this.emp.tax.motherIdCard) {
        this.motherIdCheck4 = true;
        this.motherId4 = this.emp.tax.motherIdCard
        this.motherInsurance4 = this.tax!.ins_mot
        this.tab4check(4, 2)
      }

      this.fatherSpouseIdCheck4 = false;
      this.fatherSpouseId4 = ''
      this.fatherSpouseInsurance4 = '0.00'
      if (this.emp.tax.insuranceSpouseFather <= 15000 && this.emp.tax.spouseFatherIdCard) {
        this.fatherSpouseIdCheck4 = true;
        this.fatherSpouseId4 = this.emp.tax.spouseFatherIdCard
        this.fatherSpouseInsurance4 = this.tax!.ins_fat_spouse
        this.tab4check(4, 3)
      }

      this.motherSpouseIdCheck4 = false;
      this.motherSpouseId4 = ''
      this.motherSpouseInsurance4 = '0.00'
      if (this.emp.tax.insuranceSpouseMother <= 15000 && this.emp.tax.spouseMotherIdCard) {
        this.motherSpouseIdCheck4 = true;
        this.motherSpouseId4 = this.emp.tax.spouseMotherIdCard
        this.motherSpouseInsurance4 = this.tax!.ins_mot_spouse
        this.tab4check(4, 4)
      }
      if (this.emp.address.filter(x => x.addrCurrent == 0).length == 1) {
        this.empAddrCurrent0 = this.emp.address.filter(x => x.addrCurrent == 0)[0]
        this.empAddrCurrent0Old = JSON.parse(JSON.stringify(this.empAddrCurrent0))
      } else {
        this.empAddrCurrent0 = undefined
        this.empAddrCurrent0Old = undefined
      }
      if (this.emp.address.filter(x => x.addrCurrent == 1).length == 1) {
        this.empAddrCurrent1 = this.emp.address.filter(x => x.addrCurrent == 1)[0]
        this.empAddrCurrent1Old = JSON.parse(JSON.stringify(this.empAddrCurrent1))
      } else {
        this.empAddrCurrent1 = undefined
        this.empAddrCurrent1Old = undefined
      }
      this.empAddrCurrent1 = new MyEmployeeProfileAllAddress(this.empAddrCurrent1!, this.translateService)
      this.empAddrCurrent0 = new MyEmployeeProfileAllAddress(this.empAddrCurrent0!, this.translateService)
      this.empAddrCurrent1Old = new MyEmployeeProfileAllAddress(this.empAddrCurrent1!, this.translateService)
      this.empAddrCurrent0Old = new MyEmployeeProfileAllAddress(this.empAddrCurrent0!, this.translateService)
      this.getPrefix();
      this.getDegree();
      this.getInstitue();
      this.getFaculty();
      this.getMajor();
      this.getZipcode();
      this.getWork();
      if (this.runno) {
        this.setScreenValue()
      }
      this.cdr.markForCheck();
    })
  }
  getPrefix() {
    this.workflowService.getPrefix().then(result => {
      this.prefix = result.sort((a, b) => (a.prefixId! > b.prefixId!) ? 1 : -1)
      this.prefix = this.prefix.map(x => new MyPrefix(x, this.translateService))
      this.setEmpFamilySpousePrefix()
      this.setEmpFamilyFatherPrefix()
      this.setEmpFamilyMotherPrefix()
      this.setEmpFamilyChildPrefix()
      this.setEmpFamilyFatherStatus()
      this.setEmpFamilyMotherStatus()
      this.setEmpFamilyChildStatus()
      this.setEmpFamilyChildEducation()
      this.cdr.markForCheck()
    })
  }
  getPrefixEdesc(v: string) {
    let prefix = this.prefix!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase()))
    return prefix[0].edesc!
  }
  prefixDesc(v: string) {
    let prefix = this.prefix!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase()))
    return this.translateService.currentLang == 'th'
      ? (prefix[0] ? prefix[0].tdesc : '')
      : (prefix[0] ? prefix[0].edesc : '')
  }
  setEmpFamilySpousePrefix() {
    this.empFamilySpouse.prefix = {
      prefixId: this.prefix![0].prefixId!,
      tdesc: this.prefix![0].tdesc!,
      edesc: this.prefix![0].edesc!
    }
  }
  empFamilySpousePrefixChange(v: string) {
    let prefix = this.prefix!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase() || x.edesc.toLowerCase() == v.toLowerCase()))
    this.empFamilySpouse.prefix = {
      prefixId: prefix[0].prefixId!,
      tdesc: prefix[0].tdesc!,
      edesc: prefix[0].edesc!
    }
  }
  setEmpFamilyFatherPrefix() {
    this.empFamilyFather.prefix = {
      prefixId: this.prefix![0].prefixId!,
      tdesc: this.prefix![0].tdesc!,
      edesc: this.prefix![0].edesc!
    }
  }
  setEmpFamilyMotherPrefix() {
    this.empFamilyMother.prefix = {
      prefixId: this.prefix![2].prefixId!,
      tdesc: this.prefix![2].tdesc!,
      edesc: this.prefix![2].edesc!
    }
  }
  empFamilyMotherPrefixChange(v: string) {
    let prefix = this.prefix!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase() || x.edesc.toLowerCase() == v.toLowerCase()))
    this.empFamilyMother.prefix = {
      prefixId: prefix[0].prefixId!,
      tdesc: prefix[0].tdesc!,
      edesc: prefix[0].edesc!
    }
  }
  setEmpFamilyChildPrefix() {
    this.empFamilyChild.prefix = {
      prefixId: this.prefix![0].prefixId!,
      tdesc: this.prefix![0].tdesc!,
      edesc: this.prefix![0].edesc!
    }
  }
  empFamilyChildPrefixChange(v: string) {
    let prefix = this.prefix!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase() || x.edesc.toLowerCase() == v.toLowerCase()))
    this.empFamilyChild.prefix = {
      prefixId: prefix[0].prefixId!,
      tdesc: prefix[0].tdesc!,
      edesc: prefix[0].edesc!
    }
  }
  familyStatusDesc(v: string) {
    let Status = this.empFamilyStatus!.filter((x: any) => ((x.tdesc + "").toLowerCase() == (v + "").toLowerCase()))
    return this.translateService.currentLang == 'th'
      ? (Status[0] ? Status[0].tdesc : '')
      : (Status[0] ? Status[0].edesc : '')
  }
  setEmpFamilyFatherStatus() {
    this.empFamilyFather.status = {
      statusId: this.empFamilyStatus![1].statusId!,
      tdesc: this.empFamilyStatus![1].tdesc!,
      edesc: this.empFamilyStatus![1].edesc!
    }
  }
  empFamilyFatherStatusChange(v: string) {
    let status = this.empFamilyStatus!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase() || x.edesc.toLowerCase() == v.toLowerCase()))
    this.empFamilyFather.status = {
      statusId: status[0].statusId!,
      tdesc: status[0].tdesc!,
      edesc: status[0].edesc!
    }
  }
  setEmpFamilyMotherStatus() {
    this.empFamilyMother.status = {
      statusId: this.empFamilyStatus![1].statusId!,
      tdesc: this.empFamilyStatus![1].tdesc!,
      edesc: this.empFamilyStatus![1].edesc!
    }
  }
  empFamilyMotherStatusChange(v: string) {
    let status = this.empFamilyStatus!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase() || x.edesc.toLowerCase() == v.toLowerCase()))
    this.empFamilyMother.status = {
      statusId: status[0].statusId!,
      tdesc: status[0].tdesc!,
      edesc: status[0].edesc!
    }
  }
  setEmpFamilyChildStatus() {
    this.empFamilyChild.status = {
      statusId: this.empFamilyStatus![1].statusId!,
      tdesc: this.empFamilyStatus![1].tdesc!,
      edesc: this.empFamilyStatus![1].edesc!
    }
  }
  empFamilyChildStatusChange(v: string) {
    let status = this.empFamilyStatus!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase() || x.edesc.toLowerCase() == v.toLowerCase()))
    this.empFamilyChild.status = {
      statusId: status[0].statusId!,
      tdesc: status[0].tdesc!,
      edesc: status[0].edesc!
    }
  }
  familyEducationDesc(v: string) {
    let education = this.empFamilyEducation!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase()))
    return this.translateService.currentLang == 'th'
      ? (education[0] ? education[0].tdesc : '')
      : (education[0] ? education[0].edesc : '')
  }
  setEmpFamilyChildEducation() {
    this.empFamilyChild.education = {
      educationId: this.empFamilyEducation![1].educationId!,
      tdesc: this.empFamilyEducation![1].tdesc!,
      edesc: this.empFamilyEducation![1].edesc!
    }
  }
  empFamilyChildEducationChange(v: string) {
    let education = this.empFamilyEducation!.filter((x: any) => (x.tdesc.toLowerCase() == v.toLowerCase() || x.edesc.toLowerCase() == v.toLowerCase()))
    this.empFamilyChild.education = {
      educationId: education[0].educationId!,
      tdesc: education[0].tdesc!,
      edesc: education[0].edesc!
    }
  }
  childPrefix(i: number) {
    if (this.prefix) {
      if (this.prefix!.filter(x => x.prefixId == this.emp!.family.children[i].prefixId).length == 1) {
        return this.translateService.currentLang == "th" ?
          this.prefix!.filter(x => x.prefixId == this.emp!.family.children[i].prefixId)[0].tdesc :
          this.prefix!.filter(x => x.prefixId == this.emp!.family.children[i].prefixId)[0].edesc
      } else {
        return ""
      }
    }
  }
  addFamilyChild() {
    let temp: ProfileFamilyChildren = {
      prefixId: this.familyChildren.prefixId,
      prefixName: this.prefix!.filter(x => x.prefixId == this.familyChildren.prefixId)[0].tdesc!,
      fName: this.familyChildren.fName,
      lName: this.familyChildren.lName,
      birthday: this.parserFormat.format(this.familyChildBirthdayEdit).replace(this.re, '-').split("-").reverse().join("-"),
      idCard: this.familyChildren.idCard,
      occupationId: this.familyChildren.occupationId,
      occupationName: this.work!.filter(x => x.occId == this.familyChildren.occupationId).length == 1 ? this.work!.filter(x => x.occId == this.familyChildren.occupationId)[0].tdesc! : "",
      otherOccupation: "",
      status: this.familyChildren.status,
      statusName: this.empFamilyStatus.filter(x => x.statusId == this.familyChildren.status)[0].tdesc,
      statusStudy: this.familyChildren.statusStudy,
      statusStudyName: this.empFamilyEducation.filter(x => x.educationId == this.familyChildren.statusStudy)[0].tdesc
    }
    if (this.indexEdit > -1) {
      this.emp!.family.children[this.indexEdit] = temp
      this.familyChildSelect[this.indexEdit] = false
      this.familyChildBirthday[this.indexEdit] = new NgbDate(parseInt(temp.birthday.split("-")[0]), parseInt(temp.birthday.split("-")[1]), parseInt(temp.birthday.split("-")[2]))
      this.checkDeduction(this.emp!.family.children[this.indexEdit].birthday, this.indexEdit)
    } else {
      this.emp!.family.children[this.emp!.family.children.length] = temp
      this.familyChildSelect[this.familyChildSelect.length] = false
      this.familyChildBirthday[this.familyChildBirthday.length] = new NgbDate(parseInt(temp.birthday.split("-")[0]), parseInt(temp.birthday.split("-")[1]), parseInt(temp.birthday.split("-")[2]))
      this.checkDeduction(this.emp!.family.children[this.emp!.family.children.length - 1].birthday, this.emp!.family.children.length - 1)
    }
    this.emp!.tax.totalChildren = this.emp!.family.children.length
    this.childAddchangeValue()

  }
  childAddchangeValue() {
    this.emp!.family.children.forEach((x, i) => {
      this.changeValue('__wf__mempl_family$prefix$' + (i + 4), this.empOld!.family.children.length > i ? this.empOld!.family.children[i].prefixId : '', 'select', 'tab-3', this.emp!.family.children[i].prefixId)
      this.changeValue('__wf__mempl_family$fnameid$' + (i + 4), this.empOld!.family.children.length > i ? this.empOld!.family.children[i].fName : '', 'text', 'tab-3', this.emp!.family.children[i].fName)
      this.changeValue('__wf__mempl_family$lname$' + (i + 4), this.empOld!.family.children.length > i ? this.empOld!.family.children[i].lName : '', 'text', 'tab-3', this.emp!.family.children[i].lName)
      this.changeValue('__wf__mempl_family$birthday$' + (i + 4), this.empOld!.family.children.length > i ? this.empOld!.family.children[i].birthday : '', 'text', 'tab-3', this.emp!.family.children[i].birthday)
      this.changeValue('__wf__mempl_family$stat_study$' + (i + 4), this.empOld!.family.children.length > i ? this.empOld!.family.children[i].statusStudy : '', 'text', 'tab-3', this.emp!.family.children[i].statusStudy)
      this.changeValue('__wf__mempl_family$status$' + (i + 4), this.empOld!.family.children.length > i ? this.empOld!.family.children[i].status : '', 'text', 'tab-3', this.emp!.family.children[i].status)
      this.changeValue('__wf__mempl_family$idcard$' + (i + 4), this.empOld!.family.children.length > i ? this.empOld!.family.children[i].idCard : '', 'text', 'tab-3', this.emp!.family.children[i].idCard)
    })
  }
  checkSelectAll() {
    this.isSelect = !this.isSelect
    this.familyChildSelect.forEach((x, i) => {
      this.familyChildSelect[i] = this.isSelect
    })
  }
  removeFamilyChild() {
    this.emp!.family.children.forEach((x, i) => {
      if (this.familyChildSelect[i]) {
        this.emp!.family.children.splice(i, 1)
        this.__wf__fieldFocusArray = this.__wf__fieldFocusArray.filter(x => !(x.startsWith('__wf__mempl_family$') && (x.indexOf('$' + (this.emp!.family.children.length + 4) + ':') > -1)))
        this.__wf__tabEditArray = this.__wf__tabEditArray.filter(x => x != 'tab-3')
        if (this.__wf__fieldFocusArray.filter(x => x.endsWith('tab-3')).length > 0) {
          this.__wf__tabEditArray.push('tab-3')
        }
        this.familyChildSelect.splice(i, 1)
        this.familyChildBirthday.splice(i, 1)
        this.deductibleAllowance.splice(i, 1)
        this.removeFamilyChild()
      }
    });
    this.emp!.tax.totalChildren = this.emp!.family.children.length
    this.childAddchangeValue()
  }
  getDegree() {
    this.workflowService.getDegree().then(result => {
      this.degree = result.sort((a, b) => (a.degreeId! > b.degreeId!) ? 1 : -1)
      this.degree = this.degree.map(e => new MyDegree(e, this.translateService))
      this.degreeShow = this.degree
      this.cdr.markForCheck()
    })
  }
  empDegreeDesc(item: any) {
    let degree = this.degree!.filter((x: any) => (x.degreeId.toLowerCase() == item.degreeId.toLowerCase()))
    degree[0] ? item.degreeName = degree[0].tdesc : item.degreeName = ''
    return this.translateService.currentLang == 'th'
      ? (degree[0] ? degree[0].tdesc : '')
      : (degree[0] ? degree[0].edesc : '')
  }
  searchDegreeChange() {
    this.degreeShow = this.degree!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.searchDegree) !== -1 || x.edesc.toLowerCase().indexOf(this.searchDegree) !== -1))
    this.pageModal = 1
    this.collectionSizeModal = this.degreeShow.length
  }
  selectDegree(item: Degree) {
    if (this.indexEdit > -1) {
      this.emp!.education[this.indexEdit].degreeId = item.degreeId!
      this.emp!.education[this.indexEdit].degreeName = item.tdesc!
      this.changeValue('__wf__mempl_educate$degreeid$' + (this.indexEdit + 1), this.empOld!.education[this.indexEdit].degreeId, 'text', 'tab-1', item.degreeId!)
    } else {
      this.educationNew.degreeId = item.degreeId!
      this.educationNew.degreeName = item.tdesc!
    }
  }
  getInstitue() {
    this.workflowService.getInstitue().then(result => {
      this.institue = result.sort((a, b) => (a.institueId! > b.institueId!) ? 1 : -1)
      this.institue = this.institue.map(e => new MyInstitue(e, this.translateService))
      this.institueShow = this.institue
      this.cdr.markForCheck()
    })
  }
  empInstitueDesc(item: any) {
    if (item.instituteId) {
      let institue = this.institue!.filter((x: any) => (x.institueId.toLowerCase() == item.instituteId.toLowerCase()))
      institue[0] ? item.instituteName = institue[0].tdesc : item.instituteName = ''
      return this.translateService.currentLang == 'th'
        ? (institue[0] ? institue[0].tdesc : '')
        : (institue[0] ? institue[0].edesc : '')
    } else if (item.institueId) {
      let institue = this.institue!.filter((x: any) => (x.institueId.toLowerCase() == item.institueId.toLowerCase()))
      institue[0] ? item.instituteName = institue[0].tdesc : item.instituteName = ''
      return this.translateService.currentLang == 'th'
        ? (institue[0] ? institue[0].tdesc : '')
        : (institue[0] ? institue[0].edesc : '')
    } else {
      return ''
    }
  }
  searchInstitueChange() {
    this.institueShow = this.institue!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.searchInstitue) !== -1 || x.edesc.toLowerCase().indexOf(this.searchInstitue) !== -1))
    this.pageModal = 1
    this.collectionSizeModal = this.institueShow.length
  }
  selectInstitue(item: Institue) {
    if (this.indexEdit > -1) {
      this.emp!.education[this.indexEdit].instituteId = item.institueId!
      this.emp!.education[this.indexEdit].instituteName = item.tdesc!
      this.changeValue('__wf__mempl_educate$institue$' + (this.indexEdit + 1), this.empOld!.education[this.indexEdit].instituteId, 'text', 'tab-1', item.institueId!)
    } else {
      this.educationNew.instituteId = item.institueId!
      this.educationNew.instituteName = item.tdesc!
    }
  }
  getFaculty() {
    this.workflowService.getFaculty().then(result => {
      this.faculty = result.sort((a, b) => (a.facultyId! > b.facultyId!) ? 1 : -1)
      this.faculty = this.faculty.map(e => new MyFaculty(e, this.translateService))
      this.facultyShow = this.faculty
      this.cdr.markForCheck()
    })
  }
  empFacultyDesc(item: any) {
    let faculty = this.faculty!.filter((x: any) => (x.facultyId.toLowerCase() == item.facultyId.toLowerCase()))
    faculty[0] ? item.facultyName = faculty[0].tdesc : item.facultyName = ''
    return this.translateService.currentLang == 'th'
      ? (faculty[0] ? faculty[0].tdesc : '')
      : (faculty[0] ? faculty[0].edesc : '')

  }
  searchFacultyChange() {
    this.facultyShow = this.faculty!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.searchFaculty) !== -1 || x.edesc.toLowerCase().indexOf(this.searchFaculty) !== -1))
    this.pageModal = 1
    this.collectionSizeModal = this.facultyShow.length
  }
  selectFaculty(item: Faculty) {
    if (this.indexEdit > -1) {
      this.emp!.education[this.indexEdit].facultyId = item.facultyId!
      this.emp!.education[this.indexEdit].facultyName = item.tdesc!
      this.changeValue('__wf__mempl_educate$faculty$' + (this.indexEdit + 1), this.empOld!.education[this.indexEdit].facultyId, 'text', 'tab-1', item.facultyId!)
    } else {
      this.educationNew.facultyId = item.facultyId!
      this.educationNew.facultyName = item.tdesc!
    }
  }
  getMajor() {
    this.workflowService.getMajor().then(result => {
      this.major = result.sort((a, b) => (a.majorId! > b.majorId!) ? 1 : -1)
      this.major = this.major.map(e => new MyMajor(e, this.translateService))
      this.majorShow = this.major
      this.cdr.markForCheck()
    })
  }
  empMajorDesc(item: any) {
    let major = this.major!.filter((x: any) => (x.majorId.toLowerCase() == item.majorId.toLowerCase()))
    major[0] ? item.majorName = major[0].tdesc : item.majorName = ''
    return this.translateService.currentLang == 'th'
      ? (major[0] ? major[0].tdesc : '')
      : (major[0] ? major[0].edesc : '')
  }
  searchMajorChange() {
    this.majorShow = this.major!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.searchMajor) !== -1 || x.edesc.toLowerCase().indexOf(this.searchMajor) !== -1))
    this.pageModal = 1
    this.collectionSizeModal = this.majorShow.length
  }
  selectMajor(item: Major) {
    if (this.indexEdit > -1) {
      this.emp!.education[this.indexEdit].majorId = item.majorId!
      this.emp!.education[this.indexEdit].majorName = item.tdesc!
      this.changeValue('__wf__mempl_educate$majorid$' + (this.indexEdit + 1), this.empOld!.education[this.indexEdit].majorId, 'text', 'tab-1', item.majorId!)
    } else {
      this.educationNew.majorId = item.majorId!
      this.educationNew.facultyName = item.tdesc!
    }
  }
  addEducationCheck() {
    if (this.educationNew.degreeId == "" ||
      this.educationNew.degreeName == "" ||
      this.educationNew.facultyId == "" ||
      this.educationNew.facultyName == "" ||
      this.educationNew.instituteId == "" ||
      this.educationNew.instituteName == "" ||
      this.educationNew.majorId == "" ||
      this.educationNew.majorName == "" ||
      this.educationNew.startYear == null ||
      this.educationNew.endYear == null ||
      this.educationNew.gpa == null
    ) {
      return true
    }
  }
  addEducation() {
    let temp = {
      degreeId: this.educationNew.degreeId,
      degreeName: this.educationNew.degreeName,
      endYear: this.educationNew.endYear,
      facultyId: this.educationNew.facultyId,
      facultyName: this.educationNew.facultyName,
      gpa: this.educationNew.gpa,
      instituteId: this.educationNew.instituteId,
      instituteName: this.educationNew.instituteName,
      majorId: this.educationNew.majorId,
      majorName: this.educationNew.majorName,
      startYear: this.educationNew.startYear,
    }
    this.emp!.education.push(temp!)
    this.changeValue('__wf__mempl_educate$degreeid$' + (this.emp!.education.length), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[this.emp!.education.length - 1].degreeId : '', 'text', 'tab-1', this.emp!.education[this.emp!.education.length - 1].degreeId)
    this.changeValue('__wf__mempl_educate$institue$' + (this.emp!.education.length), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[this.emp!.education.length - 1].instituteId : '', 'text', 'tab-1', this.emp!.education[this.emp!.education.length - 1].instituteId)
    this.changeValue('__wf__mempl_educate$faculty$' + (this.emp!.education.length), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[this.emp!.education.length - 1].facultyId : '', 'text', 'tab-1', this.emp!.education[this.emp!.education.length - 1].facultyId)
    this.changeValue('__wf__mempl_educate$majorid$' + (this.emp!.education.length), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[this.emp!.education.length - 1].majorId : '', 'text', 'tab-1', this.emp!.education[this.emp!.education.length - 1].majorId)
    this.changeValue('__wf__mempl_educate$year_start$' + (this.emp!.education.length), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[this.emp!.education.length - 1].startYear + '' : '', 'text', 'tab-1', this.emp!.education[this.emp!.education.length - 1].startYear + '')
    this.changeValue('__wf__mempl_educate$year_end$' + (this.emp!.education.length), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[this.emp!.education.length - 1].endYear + '' : '', 'text', 'tab-1', this.emp!.education[this.emp!.education.length - 1].endYear + '')
    this.changeValue('__wf__mempl_educate$gpa$' + (this.emp!.education.length), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[this.emp!.education.length - 1].gpa + '' : '', 'text', 'tab-1', this.emp!.education[this.emp!.education.length - 1].gpa + '')
  }

  educationAddchangeValue() {
    this.emp!.education.forEach((x, i) => {
      this.changeValue('__wf__mempl_educate$degreeid$' + (i + 1), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[i].degreeId : '', 'text', 'tab-1', this.emp!.education[i].degreeId)
      this.changeValue('__wf__mempl_educate$institue$' + (i + 1), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[i].instituteId : '', 'text', 'tab-1', this.emp!.education[i].instituteId)
      this.changeValue('__wf__mempl_educate$faculty$' + (i + 1), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[i].facultyId : '', 'text', 'tab-1', this.emp!.education[i].facultyId)
      this.changeValue('__wf__mempl_educate$majorid$' + (i + 1), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[i].majorId : '', 'text', 'tab-1', this.emp!.education[i].majorId)
      this.changeValue('__wf__mempl_educate$year_start$' + (i + 1), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[i].startYear + '' : '', 'text', 'tab-1', this.emp!.education[i].startYear + '')
      this.changeValue('__wf__mempl_educate$year_end$' + (i + 1), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[i].endYear + '' : '', 'text', 'tab-1', this.emp!.education[i].endYear + '')
      this.changeValue('__wf__mempl_educate$gpa$' + (i + 1), this.empOld!.education.length >= (this.emp!.education.length) ? this.empOld!.education[i].gpa + '' : '', 'text', 'tab-1', this.emp!.education[i].gpa + '')
    })
  }

  removeEducation(i: number) {
    this.emp!.education.splice(i, 1)
    this.__wf__fieldFocusArray = this.__wf__fieldFocusArray.filter(x => !(x.startsWith('__wf__mempl_educate$') && (x.indexOf('$' + (this.emp!.education.length + 1) + ':') > -1)))
    this.__wf__tabEditArray = this.__wf__tabEditArray.filter(x => x != 'tab-1')
    if (this.__wf__fieldFocusArray.filter(x => x.endsWith('tab-1')).length > 0) {
      this.__wf__tabEditArray.push('tab-1')
    }
    this.educationAddchangeValue()
  }

  getZipcode() {
    this.workflowService.getZipcodeObject().then(result => {
      this.zipcode = result.sort((a, b) => (a.zipcodeId! > b.zipcodeId!) ? 1 : -1)
      this.zipcode = this.zipcode.map(e => new MyZipcodeObject(e, this.translateService))
      this.zipcodeShow = this.zipcode
      this.cdr.markForCheck()
    })
  }
  searchZipcodeChange() {
    this.zipcodeShow = this.zipcode!.filter((x: any) => (x.zipcodeId.toLowerCase().indexOf(this.searchZipcode) !== -1))
    this.pageModal = 1
    this.collectionSizeModal = this.zipcodeShow.length
  }
  selectZipcode(item: ZipcodeObject) {
    if (this.indexEdit == 0) {
      this.empAddrCurrent0!.zipCode = item
      this.changeValue('__wf__mempl_addr$zipcode$0', this.empAddrCurrent0Old!.zipCode!.zipcodeId!, 'text', 'tab-2', this.empAddrCurrent0!.zipCode!.zipcodeId!)
    }
    if (this.indexEdit == 1) {
      this.empAddrCurrent1!.zipCode = item
      this.changeValue('__wf__mempl_addr$zipcode$1', this.empAddrCurrent1Old!.zipCode!.zipcodeId!, 'text', 'tab-2', this.empAddrCurrent1!.zipCode!.zipcodeId!)
    }
  }
  zipcodeChange(i: number) {

    let zipcodeId = ''
    if (i == 0) {
      zipcodeId = this.empAddrCurrent0!.zipCode!.zipcodeId!
    }
    if (i == 1) {
      zipcodeId = this.empAddrCurrent1!.zipCode!.zipcodeId!
    }
    let zipcode = {
      districtId: '',
      districtName: '',
      districtNameEng: '',
      provinceId: '',
      provinceLongName: '',
      provinceLongNameEng: '',
      zipcodeId: '',
      zipcodeName: '',
      zipcodeNameEng: '',
    }
    let zipcodelist = this.zipcode!.filter((x: any) => (x.zipcodeId == zipcodeId))
    if (zipcodelist.length > 0) {
      zipcode.districtId = zipcodelist[0].districtId!
      zipcode.districtName = zipcodelist[0].districtName!
      zipcode.districtNameEng = zipcodelist[0].districtNameEng!
      zipcode.provinceId = zipcodelist[0].provinceId!
      zipcode.provinceLongName = zipcodelist[0].provinceLongName!
      zipcode.provinceLongNameEng = zipcodelist[0].provinceLongNameEng!
      zipcode.zipcodeId = zipcodelist[0].zipcodeId!
      zipcode.zipcodeName = zipcodelist[0].zipcodeName!
      zipcode.zipcodeNameEng = zipcodelist[0].zipcodeNameEng!
    }
    if (i == 0) {
      this.empAddrCurrent0!.zipCode = zipcode
    }
    if (i == 1) {
      this.empAddrCurrent1!.zipCode = zipcode
    }
  }
  getWork() {
    this.workflowService.getWork().then(result => {
      this.work = result.sort((a, b) => (a.occId! > b.occId!) ? 1 : -1)
      this.work = this.work.map(e => new MyWorkModel(e, this.translateService))
      this.workShow = this.work
      this.collectionSizeModal = this.workShow.length
      this.cdr.markForCheck()
    })
  }
  empWorkDesc(item: string) {
    let work = this.work!.filter(x => (x.occId == item))
    return this.translateService.currentLang == 'th'
      ? (work[0] ? work[0].tdesc : '')
      : (work[0] ? work[0].edesc : '')
  }
  searchWorkChange() {
    this.workShow = this.work!.filter((x: any) => (x.tdesc.toLowerCase().indexOf(this.searchWork) !== -1 || x.edesc.toLowerCase().indexOf(this.searchWork) !== -1))
    this.pageModal = 1
    this.collectionSizeModal = this.workShow.length
  }
  selectWork(item: WorkModel) {
    if (this.indexEdit == 0) {
      this.emp!.family.spouse.occupationId = item.occId!
      this.emp!.family.spouse.occupationName = item.tdesc!
      this.changeValue('__wf__mempl_family$occupation$1', this.empOld!.family.spouse.occupationId, 'text', 'tab-3', this.emp!.family.spouse.occupationId)
    }
    if (this.indexEdit == 1) {
      this.emp!.family.father.occupationId = item.occId!
      this.emp!.family.father.occupationName = item.tdesc!
      this.changeValue('__wf__mempl_family$occupation$2', this.empOld!.family.father.occupationId, 'text', 'tab-3', this.emp!.family.father.occupationId)
    }
    if (this.indexEdit == 2) {
      this.emp!.family.mother.occupationId = item.occId!
      this.emp!.family.mother.occupationName = item.tdesc!
      this.changeValue('__wf__mempl_family$occupation$3', this.empOld!.family.mother.occupationId, 'text', 'tab-3', this.emp!.family.mother.occupationId)
    }
  }
  monthThToNumber(v: string) {
    let vs = v.split(' ')

    if (vs[1] == 'มกราคม') {
      return vs[0] + "-1-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'กุมภาพันธ์') {
      return vs[0] + "-2-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'มีนาคม') {
      return vs[0] + "-3-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'เมษายน') {
      return vs[0] + "-4-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'พฤษภาคม') {
      return vs[0] + "-5-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'มิถุนายน') {
      return vs[0] + "-6-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'กรกฎาคม') {
      return vs[0] + "-7-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'สิงหาคม') {
      return vs[0] + "-8-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'กันยายน') {
      return vs[0] + "-9-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'ตุลาคม') {
      return vs[0] + "-10-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'พฤศจิกายน') {
      return vs[0] + "-11-" + (parseInt(vs[2]) - 543)
    }
    if (vs[1] == 'ธันวาคม') {
      return vs[0] + "-12-" + (parseInt(vs[2]) - 543)
    }
  }
  changeMarryStatus(value: string) {
    if (value == "S") {
      this.marryDate = new NgbDate(0, 0, 0)
      this.tax!.statmarry = "S"
      this.tax!.marryregister = '0'
      this.tax!.inc_spouse = '0'
      this.bS = true
      this.bM0 = false
      this.bM1 = false
      this.b0 = false
      this.b1 = false
      this.bW1 = false
      this.bW2 = false
      this.bD1 = false
      this.bD2 = false
      this.isDisableMarryStatus = true
      this.isDisableMarryStatus2 = true
    }
    if (value == "M0") {
      this.marryDate = new NgbDate(0, 0, 0)
      this.tax!.statmarry = "M"
      this.tax!.marryregister = '0'
      this.tax!.inc_spouse = '0'
      this.bS = false
      this.bM0 = true
      this.bM1 = false
      this.b0 = false
      this.b1 = false
      this.bW1 = false
      this.bW2 = false
      this.bD1 = false
      this.bD2 = false
      this.isDisableMarryStatus = true
      this.isDisableMarryStatus2 = true
    }
    if (value == "M1") {
      this.marryDate = new NgbDate(parseInt(this.emp!.tax.dateMarry.split("-")[0]), parseInt(this.emp!.tax.dateMarry.split("-")[1]), parseInt(this.emp!.tax.dateMarry.split("-")[2]))
      this.tax!.statmarry = "M"
      this.tax!.marryregister = '1'
      this.bS = false
      this.bM0 = false
      this.bM1 = true
      this.bW1 = false
      this.bW2 = false
      this.bD1 = false
      this.bD2 = false
      this.isDisableMarryStatus = false
      this.isDisableMarryStatus2 = false
      if (this.tax!.inc_spouse == '0') {
        this.tax!.inc_spouse = '0'
        this.b0 = true
        this.b1 = false
      }
      if (this.tax!.inc_spouse == '1') {
        this.tax!.inc_spouse = '1'
        this.b0 = false
        this.b1 = true
      }
    }
    if (value == "0") {
      this.tax!.inc_spouse = '0'
      this.b0 = true
      this.b1 = false
    }
    if (value == "1") {
      this.tax!.inc_spouse = '1'
      this.b0 = false
      this.b1 = true
    }
    if (value == "W1") {
      this.marryDate = new NgbDate(0, 0, 0)
      this.tax!.statmarry = "W"
      this.tax!.marryregister = '0'
      this.tax!.inc_spouse = '0'
      this.bS = false
      this.bM0 = false
      this.bM1 = false
      this.b0 = false
      this.b1 = false
      this.bW1 = true
      this.bW2 = false
      this.bD1 = false
      this.bD2 = false
      this.isDisableMarryStatus = true
      this.isDisableMarryStatus2 = true
    }
    if (value == "W2") {
      this.marryDate = new NgbDate(0, 0, 0)
      this.tax!.statmarry = "W"
      this.tax!.marryregister = '0'
      this.tax!.inc_spouse = '0'
      this.bS = false
      this.bM0 = false
      this.bM1 = false
      this.b0 = false
      this.b1 = false
      this.bW1 = false
      this.bW2 = true
      this.bD1 = false
      this.bD2 = false
      this.isDisableMarryStatus = true
      this.isDisableMarryStatus2 = true
    } else if (value == "D1") {
      this.marryDate = new NgbDate(0, 0, 0)
      this.tax!.statmarry = "D"
      this.tax!.marryregister = '0'
      this.tax!.inc_spouse = '0'
      this.bS = false
      this.bM0 = false
      this.bM1 = false
      this.b0 = false
      this.b1 = false
      this.bW1 = false
      this.bW2 = false
      this.bD1 = true
      this.bD2 = false
      this.isDisableMarryStatus = true
      this.isDisableMarryStatus2 = true
    } else if (value == "D2") {
      this.marryDate = new NgbDate(0, 0, 0)
      this.tax!.statmarry = "D"
      this.tax!.marryregister = '0'
      this.tax!.inc_spouse = '0'
      this.bS = false
      this.bM0 = false
      this.bM1 = false
      this.b0 = false
      this.b1 = false
      this.bW1 = false
      this.bW2 = false
      this.bD1 = false
      this.bD2 = true
      this.isDisableMarryStatus = true
      this.isDisableMarryStatus2 = true
    }
    this.changeValue('__wf__status_marry', this.taxOld!.statmarry, 'radio', 'tab-4', this.tax!.statmarry)
  }
  calChild30000() {
    return this.emp!.tax.childDomestic * 30000
  }
  calChild60000() {
    return this.emp!.tax.childAbroad * 60000
  }
  openModal(Model: string, name: string, index?: number) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    this.indexEdit = -1
    if (index != undefined) {
      this.indexEdit = index!
    }
    if (name == 'Degree') {
      this.searchDegree = ''
      this.degreeShow = this.degree
      this.collectionSizeModal = this.degreeShow!.length
    }
    if (name == 'Institue') {
      this.searchInstitue = ''
      this.institueShow = this.institue
      this.collectionSizeModal = this.institueShow!.length
    }
    if (name == 'Faculty') {
      this.searchFaculty = ''
      this.facultyShow = this.faculty
      this.collectionSizeModal = this.facultyShow!.length
    }
    if (name == 'Major') {
      this.searchMajor = ''
      this.majorShow = this.major
      this.collectionSizeModal = this.majorShow!.length
    }
    if (name == 'AddEDU') {
      this.educationNew.degreeId = ""
      this.educationNew.degreeName = ""
      this.educationNew.endYear = 0
      this.educationNew.facultyId = ""
      this.educationNew.facultyName = ""
      this.educationNew.gpa = 0
      this.educationNew.instituteId = ""
      this.educationNew.instituteName = ""
      this.educationNew.majorId = ""
      this.educationNew.majorName = ""
      this.educationNew.startYear = 0
    }
    if (name == 'Zipcode') {
      this.searchZipcode = ''
      this.zipcodeShow = this.zipcode
      this.collectionSizeModal = this.zipcodeShow!.length
    }
    if (name == 'Work') {
      this.searchWork = ''
      this.workShow = this.work
      this.collectionSizeModal = this.workShow!.length
    }
    if (name == "contentEmp") {
      this.empListSearch = ""
      this.empListShow = this.empList
      this.collectionSizeModal = this.empListShow!.length
    }
    if (name == 'Child') {
      if (index == undefined) {
        this.familyChildren = {
          prefixId: "01",
          prefixName: "",
          fName: "",
          lName: "",
          birthday: "",
          idCard: "",
          occupationId: "1",
          occupationName: "",
          otherOccupation: "",
          status: "1",
          statusName: "",
          statusStudy: "1",
          statusStudyName: ""
        }
        this.familyChildBirthdayEdit = new NgbDate(0, 0, 0)
      } else {
        this.familyChildren.prefixId = this.emp!.family.children[index].prefixId
        this.familyChildren.fName = this.emp!.family.children[index].fName
        this.familyChildren.lName = this.emp!.family.children[index].lName
        this.familyChildBirthdayEdit = new NgbDate(this.familyChildBirthday[index].year, this.familyChildBirthday[index].month, this.familyChildBirthday[index].day)
        this.familyChildren.statusStudy = this.emp!.family.children[index].statusStudy
        this.familyChildren.status = this.emp!.family.children[index].status
        this.familyChildren.idCard = this.emp!.family.children[index].idCard
      }
    }
    this.modalService.open(Model, { centered: true, size: 'lg' })
  }
  addkDeduction() {
    this.emp!.family.children.forEach((x, i) => {
      this.checkDeduction(x.birthday, i)
    })
  }
  checkDeduction(item: string, i: number) {
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
      this.deductibleAllowance[i] = "0"
    } else {
      if (i == 0) {
        this.deductibleAllowance[i] = "1"
      } else {
        if (parseInt(item.split("-")[0]) >= 2018) {
          this.deductibleAllowance[i] = "2"
        } else {
          this.deductibleAllowance[i] = "1"
        }
      }
    }
    if (this.deductibleAllowance.filter(x => x == '1').length > 7) {
      this.deductibleAllowance[i] = "0"
      this.msg = this.translateService.currentLang == "th" ? 'สามารถเพิ่มบุตรลดหย่อน 30,000 บาทได้สูงสุด 7 คน' : 'Child deductible allowance of 30,000 bath is maximum of 7 people.'
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      });
    }
    if (this.deductibleAllowance.filter(x => x == '2').length > 5) {
      this.deductibleAllowance[i] = "0"
      this.msg = this.translateService.currentLang == "th" ? 'สามารถเพิ่มบุตรลดหย่อน 60,000 บาทได้สูงสุด 5 คน' : 'Child deductible allowance of 60,000 bath is maximum of 5 people.'
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      });
    }
    this.emp!.tax.childDomestic = this.deductibleAllowance.filter(x => x == '1').length
    this.emp!.tax.childAbroad = this.deductibleAllowance.filter(x => x == '2').length
    this.__wf__deduct_childs = this.emp!.tax.childDomestic + this.emp!.tax.childAbroad
  }
  langTHCheck() {
    return this.translateService.currentLang == 'th' ? true : false
  }
  openOnSubmit() {
    if (this.nameFile != 'browse_file') {
      this.msg = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
      this.msg = this.__wf__tabEditArray.filter(x => x == 'tab-1' || x == 'tab-2' || x == 'tab-3' || x == 'tab-4').length > 0 ? this.msg + '<br>' + (this.translateService.currentLang == 'th' ? 'มีการแก้ไขข้อมูลที่แถบต่อไปนี้:' : 'The value have change in tab:') : this.msg
      this.msg = this.__wf__tabEditArray.filter(x => x == 'tab-1').length > 0 ? this.msg + '<br>' + (this.translateService.currentLang == 'th' ? '- ข้อมูลทั่วไป' : '- General Information') : this.msg
      this.msg = this.__wf__tabEditArray.filter(x => x == 'tab-2').length > 0 ? this.msg + '<br>' + (this.translateService.currentLang == 'th' ? '- ข้อมูลที่อยู่' : '- Address') : this.msg
      this.msg = this.__wf__tabEditArray.filter(x => x == 'tab-3').length > 0 ? this.msg + '<br>' + (this.translateService.currentLang == 'th' ? '- ครอบครัว' : '- Family') : this.msg
      this.msg = this.__wf__tabEditArray.filter(x => x == 'tab-4').length > 0 ? this.msg + '<br>' + (this.translateService.currentLang == 'th' ? '- ภาษี' : '- Tax') : this.msg
      this.modalService.open(this.confirmModal, {
        centered: true,
        backdrop: 'static'
      })
    } else {
      this.msg = this.translateService.currentLang == "th" ? 'กรุณาแนบไฟล์ !!' : 'Please Attach File.'
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
    }
  }
  onSubmit() {
    let screenObj: any = {}
    screenObj["timestampFile"] = this.nameFileTimestampFile
    screenObj["attach_time"] = this.nameFileTimestampFile

    screenObj["__wf__fieldFocus"] = this.__wf__fieldFocusArray.join("|") + '|'
    screenObj["__wf__tabEdit"] = this.__wf__tabEditArray.join("|") + '|'
    // ข้อมูลทั่วไป //
    // รายละเอียดของพนักงาน
    screenObj["__wf__employeeid"] = this.emp!.employee.employeeId ? this.emp!.employee.employeeId : ""
    screenObj["__wf__emp_prefix"] = this.emp!.employee.prefixId ? this.emp!.employee.prefixId : ""
    screenObj["__wf__fname"] = this.emp!.employee.thaiFirstName ? this.emp!.employee.thaiFirstName : ""
    screenObj["__wf__ofname"] = this.__wf__ofname ? this.__wf__ofname : ""
    screenObj["__wf__lname"] = this.emp!.employee.thaiLastName ? this.emp!.employee.thaiLastName : ""
    screenObj["__wf__olname"] = this.__wf__olname ? this.__wf__olname : ""
    screenObj["__wf__nickname"] = this.emp!.employee.thaiNickName ? this.emp!.employee.thaiNickName : ""
    screenObj["__wf__eprefix"] = this.prefix!.filter(x => x.prefixId == this.emp!.employee.prefixId)[0].edesc
    screenObj["__wf__emp_sex"] = ""
    screenObj["__wf__efname"] = this.emp!.employee.engFirstName ? this.emp!.employee.engFirstName : ""
    screenObj["__wf__elname"] = this.emp!.employee.engLastName ? this.emp!.employee.engLastName : ""
    screenObj["__wf__enickname"] = this.emp!.employee.engNickName ? this.emp!.employee.engNickName : ""
    screenObj["__wf__effofname"] = this.parserFormat.format(this.selectStartEmpDate).replace(this.re, "-") != "00-00-0" ? this.parserFormat.format(this.selectStartEmpDate).replace(this.re, "-") : ""
    screenObj["__wf__mobile_view"] = this.emp!.employee.mobile ? this.emp!.employee.mobile : ""
    screenObj["__wf__mobile"] = this.emp!.employee.mobile ? this.emp!.employee.mobile : ""
    // รายละเอียดตำแหน่งงาน
    screenObj["__wf__bu1"] = this.emp!.employee.bu1Name ? this.emp!.employee.bu1Name : ""
    screenObj["__wf__bu2"] = this.emp!.employee.bu2Name ? this.emp!.employee.bu2Name : ""
    screenObj["__wf__bu3"] = this.emp!.employee.bu3Name ? this.emp!.employee.bu3Name : ""
    screenObj["__wf__bu4"] = this.emp!.employee.bu4Name ? this.emp!.employee.bu4Name : ""
    screenObj["__wf__bu5"] = this.emp!.employee.bu5Name ? this.emp!.employee.bu5Name : ""
    // ประวัติการศึกษา
    screenObj["__wf__educate_max_line"] = this.emp!.education.length
    screenObj["__wf__educate_last_line"] = this.emp!.education.length
    let listrecord = ""
    for (let i = 1; i <= this.emp!.education.length; i++) {
      listrecord = listrecord + i + ","
      screenObj["__wf__mempl_educate$educ_index$" + i] = i
      screenObj["__wf__mempl_educate$degreeid$" + i] = this.emp!.education[i - 1].degreeId
      screenObj["__wf__mempl_educate$degreedesc$" + i] = this.emp!.education[i - 1].degreeName
      screenObj["__wf__mempl_educate$institue$" + i] = this.emp!.education[i - 1].instituteId
      screenObj["__wf__mempl_educate$instituedesc$" + i] = this.emp!.education[i - 1].instituteName
      screenObj["__wf__mempl_educate$faculty$" + i] = this.emp!.education[i - 1].facultyId
      screenObj["__wf__mempl_educate$facultydesc$" + i] = this.emp!.education[i - 1].facultyName
      screenObj["__wf__mempl_educate$majorid$" + i] = this.emp!.education[i - 1].majorId
      screenObj["__wf__mempl_educate$majordesc$" + i] = this.emp!.education[i - 1].majorName
      screenObj["__wf__mempl_educate$gpa$" + i] = this.emp!.education[i - 1].gpa
      screenObj["__wf__mempl_educate$year_start$" + i] = this.emp!.education[i - 1].startYear
      screenObj["__wf__mempl_educate$year_end$" + i] = this.emp!.education[i - 1].endYear
    }
    screenObj["__wf__educate_row"] = listrecord
    // ข้อมูลที่อยู่ //
    screenObj["__wf__addr_line0"] = 0
    screenObj["__wf__addr_line1"] = 1
    // ที่อยู่ปัจจุบัน
    screenObj["__wf__mempl_addr$line_no$1"] = 1
    screenObj["__wf__mempl_addr$addr_current$1"] = "1"
    screenObj["__wf__mempl_addr$tvillage$1"] = this.empAddrCurrent1!.villageThai ? this.empAddrCurrent1!.villageThai : ""
    screenObj["__wf__mempl_addr$troom_no$1"] = this.empAddrCurrent1!.roomNoThai ? this.empAddrCurrent1!.roomNoThai : ""
    screenObj["__wf__mempl_addr$tfloor$1"] = this.empAddrCurrent1!.floorThai ? this.empAddrCurrent1!.floorThai : ""
    screenObj["__wf__mempl_addr$taddr$1"] = this.empAddrCurrent1!.addrThai ? this.empAddrCurrent1!.addrThai : ""
    screenObj["__wf__mempl_addr$tsoi$1"] = this.empAddrCurrent1!.soiThai ? this.empAddrCurrent1!.soiThai : ""
    screenObj["__wf__mempl_addr$tmoo$1"] = this.empAddrCurrent1!.mooThai ? this.empAddrCurrent1!.mooThai : ""
    screenObj["__wf__mempl_addr$troad$1"] = this.empAddrCurrent1!.roadThai ? this.empAddrCurrent1!.roadThai : ""
    screenObj["__wf__mempl_addr$tdistrict$1"] = this.empAddrCurrent1!.subDistrictThai ? this.empAddrCurrent1!.subDistrictThai : ""
    screenObj["__wf__mempl_addr$districtid$1"] = this.empAddrCurrent1!.zipCode!.districtId ? this.empAddrCurrent1!.zipCode!.districtId : ""
    screenObj["__wf__mempl_addr$amphur$1"] = this.empAddrCurrent1!.zipCode!.districtName ? this.empAddrCurrent1!.zipCode!.districtName : ""
    screenObj["__wf__mempl_addr$provinceid$1"] = this.empAddrCurrent1!.zipCode!.provinceId ? this.empAddrCurrent1!.zipCode!.provinceId : ""
    screenObj["__wf__mempl_addr$tprovince$1"] = this.empAddrCurrent1!.zipCode!.provinceLongName ? this.empAddrCurrent1!.zipCode!.provinceLongName : ""
    screenObj["__wf__mempl_addr$zipcode$1"] = this.empAddrCurrent1!.zipCode!.zipcodeId ? this.empAddrCurrent1!.zipCode!.zipcodeId : ""
    screenObj["__wf__mempl_addr$evillage$1"] = this.empAddrCurrent1!.villageEng ? this.empAddrCurrent1!.villageEng : ""
    screenObj["__wf__mempl_addr$eroom_no$1"] = this.empAddrCurrent1!.roomNoEng ? this.empAddrCurrent1!.roomNoEng : ""
    screenObj["__wf__mempl_addr$efloor$1"] = this.empAddrCurrent1!.floorEng ? this.empAddrCurrent1!.floorEng : ""
    screenObj["__wf__mempl_addr$eaddr$1"] = this.empAddrCurrent1!.addrEng ? this.empAddrCurrent1!.addrEng : ""
    screenObj["__wf__mempl_addr$esoi$1"] = this.empAddrCurrent1!.soiEng ? this.empAddrCurrent1!.soiEng : ""
    screenObj["__wf__mempl_addr$emoo$1"] = this.empAddrCurrent1!.mooEng ? this.empAddrCurrent1!.mooEng : ""
    screenObj["__wf__mempl_addr$eroad$1"] = this.empAddrCurrent1!.roadEng ? this.empAddrCurrent1!.roadEng : ""
    screenObj["__wf__mempl_addr$edistrict$1"] = this.empAddrCurrent1!.subDistrictEng ? this.empAddrCurrent1!.subDistrictEng : ""
    screenObj["__wf__mempl_addr$eamphur$1"] = this.empAddrCurrent1!.zipCode!.districtNameEng ? this.empAddrCurrent1!.zipCode!.districtNameEng : ""
    screenObj["__wf__mempl_addr$eprovince$1"] = this.empAddrCurrent1!.zipCode!.provinceLongNameEng ? this.empAddrCurrent1!.zipCode!.provinceLongNameEng : ""
    screenObj["__wf__mempl_addr$tel$1"] = this.empAddrCurrent1!.tel ? this.empAddrCurrent1!.tel : ""
    screenObj["__wf__mempl_addr$fax$1"] = this.empAddrCurrent1!.fax ? this.empAddrCurrent1!.fax : ""
    screenObj["__wf__mempl_addr$distance$1"] = this.empAddrCurrent1!.distance ? this.empAddrCurrent1!.distance : ""
    screenObj["__wf__mempl_addr$picture$1"] = this.map1Name == "browse_file" ? "" : this.map1Name
    // ที่อยู่ตามทะเบียนบ้าน
    screenObj["__wf__mempl_addr$line_no$0"] = 0
    screenObj["__wf__mempl_addr$addr_current$0"] = "0"
    screenObj["__wf__mempl_addr$districtid$0"] = this.empAddrCurrent0!.zipCode!.districtId ? this.empAddrCurrent0!.zipCode!.districtId : ""
    screenObj["__wf__mempl_addr$provinceid$0"] = this.empAddrCurrent0!.zipCode!.provinceId ? this.empAddrCurrent0!.zipCode!.provinceId : ""
    screenObj["__wf__mempl_addr$tvillage$0"] = this.empAddrCurrent0!.villageThai ? this.empAddrCurrent0!.villageThai : ""
    screenObj["__wf__mempl_addr$troom_no$0"] = this.empAddrCurrent0!.roomNoThai ? this.empAddrCurrent0!.roomNoThai : ""
    screenObj["__wf__mempl_addr$tfloor$0"] = this.empAddrCurrent0!.floorThai ? this.empAddrCurrent0!.floorThai : ""
    screenObj["__wf__mempl_addr$taddr$0"] = this.empAddrCurrent0!.addrThai ? this.empAddrCurrent0!.addrThai : ""
    screenObj["__wf__mempl_addr$tsoi$0"] = this.empAddrCurrent0!.soiThai ? this.empAddrCurrent0!.soiThai : ""
    screenObj["__wf__mempl_addr$tmoo$0"] = this.empAddrCurrent0!.mooThai ? this.empAddrCurrent0!.mooThai : ""
    screenObj["__wf__mempl_addr$troad$0"] = this.empAddrCurrent0!.roadThai ? this.empAddrCurrent0!.roadThai : ""
    screenObj["__wf__mempl_addr$tdistrict$0"] = this.empAddrCurrent0!.subDistrictThai ? this.empAddrCurrent0!.subDistrictThai : ""
    screenObj["__wf__mempl_addr$amphur$0"] = this.empAddrCurrent0!.zipCode!.districtName ? this.empAddrCurrent0!.zipCode!.districtName : ""
    screenObj["__wf__mempl_addr$tprovince$0"] = this.empAddrCurrent0!.zipCode!.provinceLongName ? this.empAddrCurrent0!.zipCode!.provinceLongName : ""
    screenObj["__wf__mempl_addr$zipcode$0"] = this.empAddrCurrent0!.zipCode!.zipcodeId ? this.empAddrCurrent0!.zipCode!.zipcodeId : ""
    screenObj["__wf__mempl_addr$evillage$0"] = this.empAddrCurrent0!.villageEng ? this.empAddrCurrent0!.villageEng : ""
    screenObj["__wf__mempl_addr$eroom_no$0"] = this.empAddrCurrent0!.roomNoEng ? this.empAddrCurrent0!.roomNoEng : ""
    screenObj["__wf__mempl_addr$efloor$0"] = this.empAddrCurrent0!.floorEng ? this.empAddrCurrent0!.floorEng : ""
    screenObj["__wf__mempl_addr$eaddr$0"] = this.empAddrCurrent0!.addrEng ? this.empAddrCurrent0!.addrEng : ""
    screenObj["__wf__mempl_addr$esoi$0"] = this.empAddrCurrent0!.soiEng ? this.empAddrCurrent0!.soiEng : ""
    screenObj["__wf__mempl_addr$emoo$0"] = this.empAddrCurrent0!.mooEng ? this.empAddrCurrent0!.mooEng : ""
    screenObj["__wf__mempl_addr$eroad$0"] = this.empAddrCurrent0!.roadEng ? this.empAddrCurrent0!.roadEng : ""
    screenObj["__wf__mempl_addr$edistrict$0"] = this.empAddrCurrent0!.subDistrictEng ? this.empAddrCurrent0!.subDistrictEng : ""
    screenObj["__wf__mempl_addr$eamphur$0"] = this.empAddrCurrent0!.zipCode!.districtNameEng ? this.empAddrCurrent0!.zipCode!.districtNameEng : ""
    screenObj["__wf__mempl_addr$eprovince$0"] = this.empAddrCurrent0!.zipCode!.provinceLongNameEng ? this.empAddrCurrent0!.zipCode!.provinceLongNameEng : ""
    screenObj["__wf__mempl_addr$tel$0"] = this.empAddrCurrent0!.tel ? this.empAddrCurrent0!.tel : ""
    screenObj["__wf__mempl_addr$fax$0"] = this.empAddrCurrent0!.fax ? this.empAddrCurrent0!.fax : ""
    screenObj["__wf__mempl_addr$distance$0"] = this.empAddrCurrent0!.distance ? this.empAddrCurrent0!.distance : ""
    screenObj["__wf__mempl_addr$picture$0"] = this.map0Name == "browse_file" ? "" : this.map0Name
    // ข้อมูลครอบครัว //
    // คู่สมรส
    screenObj["__wf__line_spouse"] = 1
    screenObj["__wf__mempl_card$cardno$1"] = ""
    screenObj["__wf__mempl_card$line_no$1"] = ""
    screenObj["__wf__max_line_card"] = "0"
    screenObj["__wf__mempl_family$prefix$1"] = this.emp!.family.spouse.fName ? this.emp!.family.spouse.prefixId : ""
    screenObj["__wf__mempl_family$fnameid$1"] = this.emp!.family.spouse.fName ? this.emp!.family.spouse.fName : ""
    screenObj["__wf__mempl_family$lname$1"] = this.emp!.family.spouse.lName ? this.emp!.family.spouse.lName : ""
    screenObj["__wf__mempl_family$line_no$1"] = "1"
    screenObj["__wf__mempl_family$relationid$1"] = "03"
    screenObj["__wf__mempl_family$stat_study$1"] = "0"
    screenObj["__wf__fname_spouse"] = ""
    screenObj["__wf__lname_spouse"] = ""
    screenObj["__wf__idspouse"] = ""
    screenObj["__wf__prefix_spouse"] = ""
    screenObj["__wf__mempl_family$status$1"] = ""
    screenObj["__wf__mempl_family$deduction$1"] = ""
    screenObj["__wf__mempl_family$deduc_type$1"] = ""
    screenObj["__wf__mempl_family$delete_record$1"] = ""
    if (this.emp!.family.spouse.fName) {
      screenObj["__wf__mempl_family$birthday$1"] = this.parserFormat.format(this.empFamilySpouseBirthday).replace(this.re, "-") != "00-00-0" ? this.parserFormat.format(this.empFamilySpouseBirthday).replace(this.re, "-") : ""
    } else {
      screenObj["__wf__mempl_family$birthday$1"] = ""
    }
    screenObj["__wf__mempl_family$idcard$1"] = this.emp!.family.spouse.idCard ? this.emp!.family.spouse.idCard : ""
    screenObj["__wf__mempl_family$occupation$1"] = this.emp!.family.spouse.occupationId ? this.emp!.family.spouse.occupationId : ""
    screenObj["__wf__mempl_card$atfile$1"] = this.spouseName == "browse_file" ? "" : this.spouseName
    if (this.work!.filter(x => (x.occId == this.emp!.family.spouse.occupationId)).length == 1) {
      screenObj["__wf__occupationdesc$1"] = this.work!.filter(x => (x.occId == this.emp!.family.spouse.occupationId))[0].tdesc
    } else {
      screenObj["__wf__occupationdesc$1"] = ""
    }
    // บิดา-มารดา คู่สมรส
    screenObj["__wf__fathmryidcard"] = this.emp!.family.spouse.fatherIdCard ? this.emp!.family.spouse.fatherIdCard : ""
    screenObj["__wf__mothmryidcard"] = this.emp!.family.spouse.motherIdCard ? this.emp!.family.spouse.motherIdCard : ""
    // บิดา-มารดา
    screenObj["__wf__line_dad"] = 2
    screenObj["__wf__fathidcard"] = this.emp!.family.father.idCard ? this.emp!.family.father.idCard : ""
    screenObj["__wf__mempl_family$line_no$2"] = "2"
    screenObj["__wf__mempl_family$prefix$2"] = this.emp!.family.father.fName ? this.emp!.family.father.prefixId : ""
    screenObj["__wf__mempl_family$fnameid$2"] = this.emp!.family.father.fName ? this.emp!.family.father.fName : ""
    screenObj["__wf__mempl_family$lname$2"] = this.emp!.family.father.lName ? this.emp!.family.father.lName : ""
    if (this.emp!.family.father.fName) {
      screenObj["__wf__mempl_family$birthday$2"] = this.parserFormat.format(this.empFamilyFatherBirthday).replace(this.re, "-") != "00-00-0" ? this.parserFormat.format(this.empFamilyFatherBirthday).replace(this.re, "-") : ""
    } else {
      screenObj["__wf__mempl_family$birthday$2"] = ""
    }
    screenObj["__wf__mempl_family$stat_study$2"] = "0"
    screenObj["__wf__mempl_family$status$2"] = this.emp!.family.father.fName ? this.emp!.family.father.status : ""
    screenObj["__wf__mempl_family$occupation$2"] = this.emp!.family.father.occupationId ? this.emp!.family.father.occupationId : ""
    if (this.work!.filter(x => (x.occId == this.emp!.family.father.occupationId)).length == 1) {
      screenObj["__wf__occupationdesc$2"] = this.work!.filter(x => (x.occId == this.emp!.family.father.occupationId))[0].tdesc
    } else {
      screenObj["__wf__occupationdesc$2"] = ""
    }
    screenObj["__wf__mempl_family$relationid$2"] = "01"
    screenObj["__wf__mempl_family$deduction$2"] = ""
    screenObj["__wf__mempl_family$idcard$2"] = this.emp!.family.father.idCard ? this.emp!.family.father.idCard : ""
    screenObj["__wf__mempl_family$deduc_type$2"] = ""
    screenObj["__wf__mempl_family$delete_record$2"] = ""

    screenObj["__wf__line_mom"] = 3;
    screenObj["__wf__mothidcard"] = this.emp!.family.mother.idCard ? this.emp!.family.mother.idCard : ""
    screenObj["__wf__mempl_family$line_no$3"] = "3"
    screenObj["__wf__mempl_family$prefix$3"] = this.emp!.family.mother.fName ? this.emp!.family.mother.prefixId : ""
    screenObj["__wf__mempl_family$fnameid$3"] = this.emp!.family.mother.fName ? this.emp!.family.mother.fName : ""
    screenObj["__wf__mempl_family$lname$3"] = this.emp!.family.mother.lName ? this.emp!.family.mother.lName : ""
    if (this.emp!.family.mother.fName) {
      screenObj["__wf__mempl_family$birthday$3"] = this.parserFormat.format(this.empFamilyMotherBirthday).replace(this.re, "-") != "00-00-0" ? this.parserFormat.format(this.empFamilyMotherBirthday).replace(this.re, "-") : ""
    } else {
      screenObj["__wf__mempl_family$birthday$3"] = ""
    }
    screenObj["__wf__mempl_family$stat_study$3"] = "0"
    screenObj["__wf__mempl_family$status$3"] = this.emp!.family.mother.fName ? this.emp!.family.mother.status : ""
    screenObj["__wf__mempl_family$occupation$3"] = this.emp!.family.mother.occupationId ? this.emp!.family.mother.occupationId : ""
    if (this.work!.filter(x => (x.occId == this.emp!.family.mother.occupationId)).length == 1) {
      screenObj["__wf__occupationdesc$3"] = this.work!.filter(x => (x.occId == this.emp!.family.mother.occupationId))[0].tdesc
    } else {
      screenObj["__wf__occupationdesc$3"] = ""
    }
    screenObj["__wf__mempl_family$relationid$3"] = "02"
    screenObj["__wf__mempl_family$deduction$3"] = ""
    screenObj["__wf__mempl_family$idcard$3"] = this.emp!.family.mother.idCard ? this.emp!.family.mother.idCard : ""
    screenObj["__wf__mempl_family$deduc_type$3"] = ""
    screenObj["__wf__mempl_family$delete_record$3"] = ""

    //บุตร
    this.emp!.family.children.forEach((x, i) => {
      screenObj["__wf__chk_box$" + (i + 4)] = i + 4
      screenObj["__wf__mempl_family$line_no$" + (i + 4)] = i + 4
      screenObj["__wf__mempl_family$prefix$" + (i + 4)] = this.emp!.family.children[i].prefixId
      screenObj["__wf__mempl_family$fnameid$" + (i + 4)] = this.emp!.family.children[i].fName
      screenObj["__wf__mempl_family$lname$" + (i + 4)] = this.emp!.family.children[i].lName
      screenObj["__wf__mempl_family$birthday$" + (i + 4)] = this.emp!.family.children[i].birthday.split("-").reverse().join("-")
      screenObj["__wf__mempl_family$stat_study$" + (i + 4)] = this.emp!.family.children[i].statusStudy
      screenObj["__wf__mempl_family$status$" + (i + 4)] = this.emp!.family.children[i].status
      screenObj["__wf__mempl_family$occupation$" + (i + 4)] = ""
      screenObj["__wf__mempl_family$relationid$" + (i + 4)] = "04"
      screenObj["__wf__mempl_family$deduction$" + (i + 4)] = this.deductibleAllowance[i] != "0" ? "1" : "0"
      screenObj["__wf__mempl_family$idcard$" + (i + 4)] = this.emp!.family.children[i].idCard
      screenObj["__wf__mempl_family$deduc_type$" + (i + 4)] = this.deductibleAllowance[i]
      screenObj["__wf__mempl_family$delete_record$" + (i + 4)] = "0"
    })
    //ภาษี
    screenObj["__wf__business1"] = this.emp!.employee.bu1Name;
    screenObj["__wf__idtax"] = this.emp!.tax.idtax;
    screenObj["__wf__business2"] = this.emp!.employee.bu2Name;
    screenObj["__wf__id_people"] = this.emp!.tax.idPeople;
    screenObj["__wf__empid"] = this.emp!.tax.employeeId;
    screenObj["__wf__startdate"] = this.emp!.employee.startDate;
    screenObj["__wf__fullname"] = this.emp!.employee.fullName;
    screenObj["__wf__birthday"] = this.profile!.birthDate!.split("-").reverse().join("-");
    screenObj["__wf__empages"] = this.profile!.age!.year + ' ปี ' + this.profile!.age!.month + ' เดือน ' + this.profile!.age!.day + ' วัน';

    screenObj["__wf__status_marry"] = this.tax!.statmarry ? this.tax!.statmarry : ""
    screenObj["__wf__inc_spouse"] = this.tax!.inc_spouse ? this.tax!.inc_spouse : ""
    screenObj["__wf__datemarry"] = this.parserFormat.format(this.marryDate).replace(this.re, "-") != "00-00-0" ? this.parserFormat.format(this.marryDate).replace(this.re, "-") : ""

    // 2
    screenObj["_wf__total_childs"] = this.emp!.tax.totalChildren;
    screenObj["__wf__deduct_childs"] = this.__wf__deduct_childs
    screenObj["__wf__child"] = this.emp!.tax.child
    screenObj["__wf__total1"] = (this.emp!.tax.child * 30000);
    screenObj["__wf__child_domestic"] = this.emp!.tax.childDomestic
    screenObj["__wf__total2"] = this.calChild30000();
    screenObj["__wf__child_abroad"] = this.emp!.tax.childAbroad
    screenObj["__wf__total3"] = this.calChild60000();
    // 3
    screenObj["__wf__fthyn"] = this.fatherIdCheck3 ? 1 : 0;
    screenObj["__wf__fthidcard"] = this.fatherIdCheck3 ? this.fatherId3 : ""
    screenObj["__wf__mthyn"] = this.motherIdCheck3 ? 1 : 0;
    screenObj["__wf__mthidcard"] = this.motherIdCheck3 ? this.motherId3 : ""
    screenObj["__wf__fthmryyn"] = this.fatherSpouseIdCheck3 ? 1 : 0;
    screenObj["__wf__fthmryidcard"] = this.fatherSpouseIdCheck3 ? this.fatherSpouseId3 : ""
    screenObj["__wf__mthmryyn"] = this.motherSpouseIdCheck3 ? 1 : 0;
    screenObj["__wf__mthmryidcard"] = this.motherSpouseIdCheck3 ? this.motherSpouseId3 : ""
    screenObj["__wf__total9"] = this.calTaxNo3()

    // 4
    screenObj["__wf__fat_ins_chk"] = this.fatherIdCheck4 ? 1 : 0;
    screenObj["__wf__ins_fat"] = this.fatherInsurance4;
    screenObj["__wf__mot_ins_chk"] = this.motherIdCheck4 ? 1 : 0;
    screenObj["__wf__ins_mot"] = this.motherInsurance4;
    screenObj["__wf__fat_spouse_ins_chk"] = this.fatherSpouseIdCheck4 ? 1 : 0;
    screenObj["__wf__ins_fat_spouse"] = this.fatherSpouseInsurance4;
    screenObj["__wf__mot_spouse_ins_chk"] = this.motherSpouseIdCheck4 ? 1 : 0;
    screenObj["__wf__ins_mot_spouse"] = this.motherSpouseInsurance4;
    // 5 - 7
    screenObj["__wf__premium"] = this.tax!.insurance;
    screenObj["__wf__spose_premium"] = this.tax!.insurance_spouse;
    screenObj["__wf__ins_pensions"] = this.empTaxInsurancePensions;
    // 8
    // ?????
    // 9
    screenObj["__wf__rmf"] = this.tax!.rmf;
    // 10
    screenObj["__wf__ssf"] = this.tax!.ssf;
    // 11 - 12
    screenObj["__wf__ltf"] = this.tax!.ltf;
    screenObj["__wf__vigorish"] = this.tax!.interest;
    // 13
    // ?????
    // 14
    screenObj["__wf__total_cripple"] = this.tax!.totalCripple;
    screenObj["__wf__crippleallowance"] = (parseInt(this.tax!.totalCripple) * 60000) + '.00';

    // 15 - 16
    screenObj["__wf__edudonation"] = this.tax!.edudonation;
    screenObj["__wf__sportdonation"] = this.tax!.sportdonation;
    // 17
    screenObj["__wf__hospitaldonation"] = this.tax!.hospitalDonation;
    //
    // 18 - 19
    screenObj["__wf__donation_special"] = this.empTaxDonationSpecial;
    screenObj["__wf__donation"] = this.tax!.donation;
    // 20
    screenObj["__wf__donate_political_party"] = this.tax!.politicalDonation;
    // 21
    screenObj["__wf__iscripple"] = this.tax!.iscripple;
    screenObj["__wf__is_cripple"] = this.tax!.is_cripple;
    // 22 - 27
    screenObj["__wf__first_home2"] = this.firstHome;
    screenObj["__wf__first_home"] = this.firstHome2;
    screenObj["__wf__home_repair"] = this.tax!.homeRepair2;
    screenObj["__wf__car_repair"] = this.tax!.carRepair2;
    screenObj["__wf__travel_in_country_main"] = this.travelInCountry;
    screenObj["__wf__travel_in_country"] = this.travelInCountry2;
    // 28 - 36
    screenObj["__wf__childbirth"] = this.tax!.childbirth;
    screenObj["__wf__otop"] = this.tax!.otop;
    screenObj["__wf__buy_edu_sport"] = this.tax!.buyEducationSport;
    screenObj["__wf__book_ebook"] = this.tax!.buyEbook;
    screenObj["__wf__savings"] = this.tax!.savings;
    screenObj["__wf__health_insurance"] = this.tax!.healthInsurance;
    screenObj["__wf__buy_cctv"] = this.tax!.buyCctv;
    screenObj["__wf__debit_card_fee"] = this.tax!.debitCardFee;
    screenObj["__wf__stock"] = this.tax!.investStartup;
    // 37
    screenObj["__wf__expenses_songkran"] = this.tax!.songkranFestival;
    // 38 - 43
    screenObj["__wf__buy_car_tire"] = this.tax!.buyRubber;
    screenObj["__wf__buy_book_ebook"] = this.buyEbook2;
    screenObj["__wf__buy_otop"] = this.tax!.buyInCountry;
    screenObj["__wf__home_repair2"] = this.tax!.homeRepair2;
    screenObj["__wf__car_repair2"] = this.tax!.carRepair2;
    screenObj["__wf__ssf_special"] = this.tax!.ssfSpecial;

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
    };
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
        if (this.runno) {
          this.cancelWF()
        }
        this.local.back();
      } else {
        this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถสร้างเอกสารได้' : 'Can not create workflow.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        });
      }
    });
  }
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe(async (result) => {
      this.screen_value = result.workflowData.screen_value;
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      // ข้อมูลทั่วไป //
      // รายละเอียดของพนักงาน
      await this.getEmployeeAllProfile(this.screen_value["__wf__employeeid"])
      await this.getEmpService(this.screen_value["__wf__employeeid"])
      this.__wf__employeeid = this.screen_value["__wf__employeeid"]
      this.emp!.employee.employeeId = this.screen_value["__wf__employeeid"]
      this.emp!.employee.prefixId = this.screen_value["__wf__emp_prefix"]
      this.__wf__ofname = this.screen_value["__wf__ofname"]
      this.emp!.employee.thaiFirstName = this.screen_value["__wf__fname"]
      this.emp!.employee.thaiLastName = this.screen_value["__wf__lname"]
      this.__wf__olname = this.screen_value["__wf__olname"]
      this.emp!.employee.thaiNickName = this.screen_value["__wf__nickname"]
      this.emp!.employee.engFirstName = this.screen_value["__wf__efname"]
      this.emp!.employee.engLastName = this.screen_value["__wf__elname"]
      this.emp!.employee.engNickName = this.screen_value["__wf__enickname"]
      this.selectStartEmpDate = this.screen_value["__wf__effofname"] ? new NgbDate(parseInt(this.screen_value["__wf__effofname"].split("-")[2]),
        parseInt(this.screen_value["__wf__effofname"].split("-")[1]),
        parseInt(this.screen_value["__wf__effofname"].split("-")[0])) : new NgbDate(0, 0, 0)
      this.emp!.employee.mobile = this.screen_value["__wf__mobile_view"]
      //รายละเอียดตำแหน่งงาน
      this.emp!.employee.bu1Name = this.screen_value["__wf__bu1"]
      this.emp!.employee.bu2Name = this.screen_value["__wf__bu2"]
      this.emp!.employee.bu3Name = this.screen_value["__wf__bu3"]
      this.emp!.employee.bu4Name = this.screen_value["__wf__bu4"]
      this.emp!.employee.bu5Name = this.screen_value["__wf__bu5"]
      // ประวัติการศึกษา
      this.emp!.education = []
      for (let i = 1; i <= this.screen_value["__wf__mempl_educate$educ_index$" + i]; i++) {
        this.emp!.education.push({
          degreeId: this.screen_value["__wf__mempl_educate$degreeid$" + i],
          degreeName: this.screen_value["__wf__mempl_educate$degreedesc$" + i],
          instituteId: this.screen_value["__wf__mempl_educate$institue$" + i],
          instituteName: this.screen_value["__wf__mempl_educate$instituedesc$" + i],
          facultyId: this.screen_value["__wf__mempl_educate$faculty$" + i],
          facultyName: this.screen_value["__wf__mempl_educate$facultydesc$" + i],
          majorId: this.screen_value["__wf__mempl_educate$majorid$" + i],
          majorName: this.screen_value["__wf__mempl_educate$majordesc$" + i],
          startYear: this.screen_value["__wf__mempl_educate$year_start$" + i],
          endYear: this.screen_value["__wf__mempl_educate$year_end$" + i],
          gpa: this.screen_value["__wf__mempl_educate$gpa$" + i]
        })
      }
      // ที่อยู่ปัจจุบัน
      this.empAddrCurrent1!.addrCurrent = this.screen_value["__wf__mempl_addr$addr_current$1"]
      this.empAddrCurrent1!.villageThai = this.screen_value["__wf__mempl_addr$tvillage$1"]
      this.empAddrCurrent1!.roomNoThai = this.screen_value["__wf__mempl_addr$troom_no$1"]
      this.empAddrCurrent1!.floorThai = this.screen_value["__wf__mempl_addr$tfloor$1"]
      this.empAddrCurrent1!.addrThai = this.screen_value["__wf__mempl_addr$taddr$1"]
      this.empAddrCurrent1!.soiThai = this.screen_value["__wf__mempl_addr$tsoi$1"]
      this.empAddrCurrent1!.mooThai = this.screen_value["__wf__mempl_addr$tmoo$1"]
      this.empAddrCurrent1!.roadThai = this.screen_value["__wf__mempl_addr$troad$1"]
      this.empAddrCurrent1!.subDistrictThai = this.screen_value["__wf__mempl_addr$tdistrict$1"]
      this.empAddrCurrent1!.zipCode!.districtId = this.screen_value["__wf__mempl_addr$districtid$1"]
      this.empAddrCurrent1!.zipCode!.districtName = this.screen_value["__wf__mempl_addr$amphur$1"]
      this.empAddrCurrent1!.zipCode!.provinceId = this.screen_value["__wf__mempl_addr$provinceid$1"]
      this.empAddrCurrent1!.zipCode!.provinceLongName = this.screen_value["__wf__mempl_addr$tprovince$1"]
      this.empAddrCurrent1!.zipCode!.zipcodeId = this.screen_value["__wf__mempl_addr$zipcode$1"]
      this.empAddrCurrent1!.villageEng = this.screen_value["__wf__mempl_addr$evillage$1"]
      this.empAddrCurrent1!.roomNoEng = this.screen_value["__wf__mempl_addr$eroom_no$1"]
      this.empAddrCurrent1!.floorEng = this.screen_value["__wf__mempl_addr$efloor$1"]
      this.empAddrCurrent1!.addrEng = this.screen_value["__wf__mempl_addr$eaddr$1"]
      this.empAddrCurrent1!.soiEng = this.screen_value["__wf__mempl_addr$esoi$1"]
      this.empAddrCurrent1!.mooEng = this.screen_value["__wf__mempl_addr$emoo$1"]
      this.empAddrCurrent1!.roadEng = this.screen_value["__wf__mempl_addr$eroad$1"]
      this.empAddrCurrent1!.subDistrictEng = this.screen_value["__wf__mempl_addr$edistrict$1"]
      this.empAddrCurrent1!.zipCode!.districtNameEng = this.screen_value["__wf__mempl_addr$eamphur$1"]
      this.empAddrCurrent1!.zipCode!.provinceLongNameEng = this.screen_value["__wf__mempl_addr$eprovince$1"]
      this.empAddrCurrent1!.tel = this.screen_value["__wf__mempl_addr$tel$1"]
      this.empAddrCurrent1!.fax = this.screen_value["__wf__mempl_addr$fax$1"]
      this.empAddrCurrent1!.distance = this.screen_value["__wf__mempl_addr$distance$1"]
      // ที่อยู่ตามทะเบียนบ้าน
      this.empAddrCurrent0!.addrCurrent = this.screen_value["__wf__mempl_addr$addr_current$0"]
      this.empAddrCurrent0!.zipCode!.districtId = this.screen_value["__wf__mempl_addr$districtid$0"]
      this.empAddrCurrent0!.zipCode!.provinceId = this.screen_value["__wf__mempl_addr$provinceid$0"]
      this.empAddrCurrent0!.villageThai = this.screen_value["__wf__mempl_addr$tvillage$0"]
      this.empAddrCurrent0!.roomNoThai = this.screen_value["__wf__mempl_addr$troom_no$0"]
      this.empAddrCurrent0!.floorThai = this.screen_value["__wf__mempl_addr$tfloor$0"]
      this.empAddrCurrent0!.addrThai = this.screen_value["__wf__mempl_addr$taddr$0"]
      this.empAddrCurrent0!.soiThai = this.screen_value["__wf__mempl_addr$tsoi$0"]
      this.empAddrCurrent0!.mooThai = this.screen_value["__wf__mempl_addr$tmoo$0"]
      this.empAddrCurrent0!.roadThai = this.screen_value["__wf__mempl_addr$troad$0"]
      this.empAddrCurrent0!.subDistrictThai = this.screen_value["__wf__mempl_addr$tdistrict$0"]
      this.empAddrCurrent0!.zipCode!.districtName = this.screen_value["__wf__mempl_addr$amphur$0"]
      this.empAddrCurrent0!.zipCode!.provinceLongName = this.screen_value["__wf__mempl_addr$tprovince$0"]
      this.empAddrCurrent0!.zipCode!.zipcodeId = this.screen_value["__wf__mempl_addr$zipcode$0"]
      this.empAddrCurrent0!.villageEng = this.screen_value["__wf__mempl_addr$evillage$0"]
      this.empAddrCurrent0!.roomNoEng = this.screen_value["__wf__mempl_addr$eroom_no$0"]
      this.empAddrCurrent0!.floorEng = this.screen_value["__wf__mempl_addr$efloor$0"]
      this.empAddrCurrent0!.addrEng = this.screen_value["__wf__mempl_addr$eaddr$0"]
      this.empAddrCurrent0!.soiEng = this.screen_value["__wf__mempl_addr$esoi$0"]
      this.empAddrCurrent0!.mooEng = this.screen_value["__wf__mempl_addr$emoo$0"]
      this.empAddrCurrent0!.roadEng = this.screen_value["__wf__mempl_addr$eroad$0"]
      this.empAddrCurrent0!.subDistrictEng = this.screen_value["__wf__mempl_addr$edistrict$0"]
      this.empAddrCurrent0!.zipCode!.districtNameEng = this.screen_value["__wf__mempl_addr$eamphur$0"]
      this.empAddrCurrent0!.zipCode!.provinceLongNameEng = this.screen_value["__wf__mempl_addr$eprovince$0"]
      this.empAddrCurrent0!.tel = this.screen_value["__wf__mempl_addr$tel$0"]
      this.empAddrCurrent0!.fax = this.screen_value["__wf__mempl_addr$fax$0"]
      this.empAddrCurrent0!.distance = this.screen_value["__wf__mempl_addr$distance$0"]

      // ข้อมูลครอบครัว //
      // คู่สมรส
      this.emp!.family.spouse.prefixId = this.screen_value["__wf__mempl_family$prefix$1"] ? this.screen_value["__wf__mempl_family$prefix$1"] : "01"
      this.emp!.family.spouse.fName = this.screen_value["__wf__mempl_family$fnameid$1"]
      this.emp!.family.spouse.lName = this.screen_value["__wf__mempl_family$lname$1"]
      this.empFamilySpouseBirthday = this.screen_value["__wf__mempl_family$birthday$1"] ? new NgbDate(parseInt(this.screen_value["__wf__mempl_family$birthday$1"].split("-")[2]),
        parseInt(this.screen_value["__wf__mempl_family$birthday$1"].split("-")[1]),
        parseInt(this.screen_value["__wf__mempl_family$birthday$1"].split("-")[0])) : new NgbDate(0, 0, 0)
      this.emp!.family.spouse.idCard = this.screen_value["__wf__mempl_family$idcard$1"]
      this.emp!.family.spouse.occupationId = this.screen_value["__wf__mempl_family$occupation$1"]
      this.empFamilySpouse.fileName = this.screen_value["__wf__mempl_card$atfile$1"] ? this.screen_value["__wf__mempl_card$atfile$1"] : "browse_file"
      // บิดา-มารดา คู่สมรส
      this.emp!.family.spouse.fatherIdCard = this.screen_value["__wf__fathmryidcard"]
      this.emp!.family.spouse.motherIdCard = this.screen_value["__wf__mothmryidcard"]
      // บิดา-มารดา
      this.emp!.family.father.idCard = this.screen_value["__wf__mempl_family$idcard$2"]
      this.emp!.family.father.prefixId = this.screen_value["__wf__mempl_family$prefix$2"] ? this.screen_value["__wf__mempl_family$prefix$2"] : "01"
      this.emp!.family.father.fName = this.screen_value["__wf__mempl_family$fnameid$2"]
      this.emp!.family.father.lName = this.screen_value["__wf__mempl_family$lname$2"]
      this.empFamilyFatherBirthday = this.screen_value["__wf__mempl_family$birthday$2"] ? new NgbDate(parseInt(this.screen_value["__wf__mempl_family$birthday$2"].split("-")[2]),
        parseInt(this.screen_value["__wf__mempl_family$birthday$2"].split("-")[1]),
        parseInt(this.screen_value["__wf__mempl_family$birthday$2"].split("-")[0])) : new NgbDate(0, 0, 0)
      this.emp!.family.father.occupationId = this.screen_value["__wf__mempl_family$occupation$2"]
      this.emp!.family.father.status = this.screen_value["__wf__mempl_family$status$2"]

      this.emp!.family.mother.idCard = this.screen_value["__wf__mempl_family$idcard$3"]
      this.emp!.family.mother.prefixId = this.screen_value["__wf__mempl_family$prefix$3"] ? this.screen_value["__wf__mempl_family$prefix$3"] : "01"
      this.emp!.family.mother.fName = this.screen_value["__wf__mempl_family$fnameid$3"]
      this.emp!.family.mother.lName = this.screen_value["__wf__mempl_family$lname$3"]
      this.empFamilyMotherBirthday = this.screen_value["__wf__mempl_family$birthday$3"] ? new NgbDate(parseInt(this.screen_value["__wf__mempl_family$birthday$3"].split("-")[2]),
        parseInt(this.screen_value["__wf__mempl_family$birthday$3"].split("-")[1]),
        parseInt(this.screen_value["__wf__mempl_family$birthday$3"].split("-")[0])) : new NgbDate(0, 0, 0)
      this.emp!.family.mother.occupationId = this.screen_value["__wf__mempl_family$occupation$3"]
      this.emp!.family.mother.status = this.screen_value["__wf__mempl_family$status$3"]

      //บุตร
      this.emp!.family.children = []
      this.familyChildSelect = []
      this.familyChildBirthday = []
      this.deductibleAllowance = []
      for (let i = 0; this.screen_value["__wf__mempl_family$line_no$" + (i + 4)]; i++) {
        this.emp!.family.children.push({
          prefixId: this.screen_value["__wf__mempl_family$prefix$" + (i + 4)],
          prefixName: this.prefix!.filter(x => x.prefixId == this.screen_value["__wf__mempl_family$prefix$" + (i + 4)])[0].tdesc!,
          fName: this.screen_value["__wf__mempl_family$fnameid$" + (i + 4)],
          lName: this.screen_value["__wf__mempl_family$lname$" + (i + 4)],
          birthday: this.screen_value["__wf__mempl_family$birthday$" + (i + 4)] ? (this.screen_value["__wf__mempl_family$birthday$" + (i + 4)] + "").split("-").reverse().join("-") : "0-00-00",
          idCard: this.screen_value["__wf__mempl_family$idcard$" + (i + 4)],
          occupationId: this.screen_value["__wf__mempl_family$occupation$" + (i + 4)],
          occupationName: this.work!.filter(x => x.occId == this.screen_value["__wf__mempl_family$occupation$" + (i + 4)]).length == 1 ? this.work!.filter(x => x.occId == this.screen_value["__wf__mempl_family$occupation$" + (i + 4)])[0].tdesc! : "",
          otherOccupation: "",
          status: this.screen_value["__wf__mempl_family$status$" + (i + 4)],
          statusName: this.empFamilyStatus.filter(x => x.statusId == this.screen_value["__wf__mempl_family$status$" + (i + 4)])[0].tdesc,
          statusStudy: this.screen_value["__wf__mempl_family$stat_study$" + (i + 4)],
          statusStudyName: this.empFamilyEducation.filter(x => x.educationId == this.screen_value["__wf__mempl_family$stat_study$" + (i + 4)])[0].tdesc
        })
        this.checkDeduction(this.emp!.family.children[i].birthday, i)
        this.familyChildSelect.push(false)
        this.familyChildBirthday.push(new NgbDate(parseInt(this.emp!.family.children[i].birthday.split("-")[0]), parseInt(this.emp!.family.children[i].birthday.split("-")[1]), parseInt(this.emp!.family.children[i].birthday.split("-")[2])))
      }
      //ภาษี
      this.tax!.statmarry = this.screen_value["__wf__status_marry"]
      this.isDisableMarryStatus = true
      this.isDisableMarryStatus2 = true
      if (this.tax!.statmarry == 'S') {
        this.bS = true
        this.bM0 = false
        this.bM1 = false
        this.b0 = false
        this.b1 = false
        this.bW1 = false
        this.bW2 = false
        this.bD1 = false
        this.bD2 = false
      } else if (this.tax!.statmarry == 'M') {
        this.isDisableMarryStatus = false
        this.isDisableMarryStatus2 = false
        if (this.screen_value["__wf__datemarry"]) {
          this.bS = false
          this.bM0 = false
          this.bM1 = true
          this.b0 = false
          this.b1 = false
          this.bW1 = false
          this.bW2 = false
          this.bD1 = false
          this.bD2 = false
        } else {
          this.bS = false
          this.bM0 = true
          this.bM1 = false
          this.b0 = false
          this.b1 = false
          this.bW1 = false
          this.bW2 = false
          this.bD1 = false
          this.bD2 = false
        }
        if (this.tax!.marryregister == '0') {
          this.bS = false
          this.bM0 = true
          this.bM1 = false
          this.b0 = false
          this.b1 = false
          this.bW1 = false
          this.bW2 = false
          this.bD1 = false
          this.bD2 = false
        }
        if (this.tax!.marryregister == '1') {
          if (this.tax!.inc_spouse == '0') {
            this.bS = false
            this.bM0 = false
            this.bM1 = true
            this.b0 = true
            this.b1 = false
            this.bW1 = false
            this.bW2 = false
            this.bD1 = false
            this.bD2 = false
          }
          if (this.tax!.inc_spouse == '1') {
            this.bS = false
            this.bM0 = false
            this.bM1 = true
            this.b0 = false
            this.b1 = true
            this.bW1 = false
            this.bW2 = false
            this.bD1 = false
            this.bD2 = false
          }
        }
      } else if (this.tax!.statmarry == 'W') {
        this.bS = false
        this.bM0 = false
        this.bM1 = false
        this.b0 = false
        this.b1 = false
        this.bW1 = true
        this.bW2 = false
        this.bD1 = false
        this.bD2 = false
      } else if (this.tax!.statmarry == 'D') {
        this.bS = false
        this.bM0 = false
        this.bM1 = false
        this.b0 = false
        this.b1 = false
        this.bW1 = false
        this.bW2 = false
        this.bD1 = true
        this.bD2 = false
      } else if (this.tax!.statmarry == 'E') {
        this.bS = true
        this.bM0 = false
        this.bM1 = false
        this.b0 = false
        this.b1 = false
        this.bW1 = false
        this.bW2 = false
        this.bD1 = false
        this.bD2 = false
      } else {
        this.bS = false
        this.bM0 = false
        this.bM1 = false
        this.b0 = false
        this.b1 = false
        this.bW1 = false
        this.bW2 = false
        this.bD1 = false
        this.bD2 = false
      }
      this.tax!.inc_spouse = this.screen_value["__wf__inc_spouse"]
      this.marryDate = this.screen_value["__wf__datemarry"] ? new NgbDate(parseInt(this.screen_value["__wf__datemarry"].split("-")[2]),
        parseInt(this.screen_value["__wf__datemarry"].split("-")[1]),
        parseInt(this.screen_value["__wf__datemarry"].split("-")[0])) : new NgbDate(0, 0, 0)
      // 2
      this.emp!.tax.totalChildren = this.screen_value["_wf__total_childs"]
      this.emp!.tax.child = this.screen_value["__wf__child"]
      this.emp!.tax.childDomestic = this.screen_value["__wf__child_domestic"]
      this.emp!.tax.childAbroad = this.screen_value["__wf__child_abroad"]
      this.__wf__deduct_childs = this.screen_value["__wf__deduct_childs"]
      // 3
      this.fatherIdCheck3 = this.screen_value["__wf__fthyn"] == 1 ? true : false
      this.fatherId3 = this.screen_value["__wf__fthidcard"]
      this.motherIdCheck3 = this.screen_value["__wf__mthyn"] == 1 ? true : false
      this.motherId3 = this.screen_value["__wf__mthidcard"]
      this.fatherSpouseIdCheck3 = this.screen_value["__wf__fthmryyn"] == 1 ? true : false
      this.fatherSpouseId3 = this.screen_value["__wf__fthmryidcard"]
      this.motherSpouseIdCheck3 = this.screen_value["__wf__mthmryyn"] == 1 ? true : false
      this.motherSpouseId3 = this.screen_value["__wf__mthmryidcard"]
      // 4
      this.fatherIdCheck4 = this.screen_value["__wf__fat_ins_chk"] == 1 ? true : false
      this.fatherInsurance4 = this.screen_value["__wf__ins_fat"]
      this.motherIdCheck4 = this.screen_value["__wf__mot_ins_chk"] == 1 ? true : false
      this.motherInsurance4 = this.screen_value["__wf__ins_mot"]
      this.fatherSpouseIdCheck4 = this.screen_value["__wf__fat_spouse_ins_chk"] == 1 ? true : false
      this.fatherSpouseInsurance4 = this.screen_value["__wf__ins_fat_spouse"]
      this.motherSpouseIdCheck4 = this.screen_value["__wf__mot_spouse_ins_chk"] == 1 ? true : false
      this.motherSpouseInsurance4 = this.screen_value["__wf__ins_mot_spouse"]

      this.fatherId4 = this.fatherIdCheck4 ? this.fatherId3 : ""
      this.motherId4 = this.motherIdCheck4 ? this.motherId3 : ""
      this.fatherSpouseId4 = this.fatherSpouseIdCheck4 ? this.fatherSpouseId3 : ""
      this.motherSpouseId4 = this.motherSpouseIdCheck4 ? this.motherSpouseId3 : ""
      // 5 6
      this.tax!.insurance = this.screen_value["__wf__premium"]
      this.tax!.insurance_spouse = this.screen_value["__wf__spose_premium"]
      this.emp!.tax.insurancePensions = this.screen_value["__wf__ins_pensions"]
      // 7
      this.empTaxInsurancePensions = this.emp!.tax.insurancePensions.toString()
      // 8
      // ?????
      // 9
      this.tax!.rmf = this.screen_value["__wf__rmf"]
      // 10
      this.tax!.ssf = this.screen_value["__wf__ssf"]
      // 11 - 12
      this.tax!.ltf = this.screen_value["__wf__ltf"]
      this.tax!.interest = this.screen_value["__wf__vigorish"]
      // 13
      // ?????
      // 14
      this.tax!.totalCripple = this.screen_value["__wf__total_cripple"]

      // 15 - 16
      this.tax!.edudonation = this.screen_value["__wf__edudonation"]
      this.tax!.sportdonation = this.screen_value["__wf__sportdonation"]
      // 17
      this.tax!.hospitalDonation = this.screen_value["__wf__hospitaldonation"]
      //
      // 18 - 19
      this.emp!.tax.donationSpecial = this.screen_value["__wf__donation_special"]
      this.empTaxDonationSpecial = this.emp!.tax.donationSpecial.toString()
      this.tax!.donation = this.screen_value["__wf__donation"]
      // 20
      this.tax!.politicalDonation = this.screen_value["__wf__donate_political_party"]
      // 21
      this.tax!.iscripple = this.screen_value["__wf__iscripple"]
      this.tax!.is_cripple = this.screen_value["__wf__is_cripple"]
      // 22 - 27
      this.firstHome = this.screen_value["__wf__first_home2"]
      this.firstHome2 = this.screen_value["__wf__first_home"]
      this.tax!.homeRepair2 = this.screen_value["__wf__home_repair"]
      this.tax!.carRepair2 = this.screen_value["__wf__car_repair"]
      this.travelInCountry = this.screen_value["__wf__travel_in_country_main"]
      this.travelInCountry2 = this.screen_value["__wf__travel_in_country"]
      // 28 - 36
      this.tax!.childbirth = this.screen_value["__wf__childbirth"]
      this.tax!.otop = this.screen_value["__wf__otop"]
      this.tax!.buyEducationSport = this.screen_value["__wf__buy_edu_sport"]
      this.tax!.buyEbook = this.screen_value["__wf__book_ebook"]
      this.tax!.savings = this.screen_value["__wf__savings"]
      this.tax!.healthInsurance = this.screen_value["__wf__health_insurance"]
      this.tax!.buyCctv = this.screen_value["__wf__buy_cctv"]
      this.tax!.debitCardFee = this.screen_value["__wf__debit_card_fee"]
      this.tax!.investStartup = this.screen_value["__wf__stock"]
      // 37
      this.tax!.songkranFestival = this.screen_value["__wf__expenses_songkran"]
      // 38 - 43
      this.tax!.buyRubber = this.screen_value["__wf__buy_car_tire"]
      this.buyEbook2 = this.screen_value["__wf__buy_book_ebook"]
      this.tax!.buyInCountry = this.screen_value["__wf__buy_otop"]
      this.tax!.homeRepair2 = this.screen_value["__wf__home_repair2"]
      this.tax!.carRepair2 = this.screen_value["__wf__car_repair2"]
      this.tax!.ssfSpecial = this.screen_value["__wf__ssf_special"]

      // tab 4 N0 5
      this.tax!.insurance = this.tab4ToMoney(this.tax!.insurance)
      // tab 4 N0 6
      this.tax!.insurance_spouse = this.tab4ToMoney(this.tax!.insurance_spouse)
      // tab 4 N0 9
      this.tax!.rmf = this.tab4ToMoney(this.tax!.rmf)
      // tab 4 N0 10
      this.tax!.ssf = this.tab4ToMoney(this.tax!.ssf)
      // tab 4 N0 11
      this.tax!.ltf = this.tab4ToMoney(this.tax!.ltf)
      // tab 4 N0 12
      this.tax!.interest = this.tab4ToMoney(this.tax!.interest)
      // tab 4 N0 15
      this.tax!.edudonation = this.tab4ToMoney(this.tax!.edudonation)
      // tab 4 N0 16
      this.tax!.sportdonation = this.tab4ToMoney(this.tax!.sportdonation)
      // tab 4 N0 17
      this.tax!.hospitalDonation = this.tab4ToMoney(this.tax!.hospitalDonation)
      // tab 4 N0 19
      this.tax!.donation = this.tab4ToMoney(this.tax!.donation)
      // tab 4 N0 20
      this.tax!.politicalDonation = this.tab4ToMoney(this.tax!.politicalDonation)
      // tab 4 N0 24
      this.tax!.homeRepair2 = this.tab4ToMoney(this.tax!.homeRepair2)
      // tab 4 N0 25
      this.tax!.carRepair2 = this.tab4ToMoney(this.tax!.carRepair2)
      // tab 4 N0 26
      this.travelInCountry = this.tax!.travel_in_country
      this.travelInCountry = this.tab4ToMoney(this.travelInCountry)
      // tab 4 N0 27
      this.travelInCountry2 = this.tax!.travel_in_country
      this.travelInCountry2 = this.tab4ToMoney(this.travelInCountry2)
      // tab 4 N0 28
      this.tax!.childbirth = this.tab4ToMoney(this.tax!.childbirth)
      // tab 4 N0 29
      this.tax!.otop = this.tab4ToMoney(this.tax!.otop)
      // tab 4 N0 30
      this.tax!.buyEducationSport = this.tab4ToMoney(this.tax!.buyEducationSport)
      // tab 4 N0 31
      this.tax!.buyEbook = this.tab4ToMoney(this.tax!.buyEbook)
      // tab 4 N0 32
      this.tax!.savings = this.tab4ToMoney(this.tax!.savings)
      // tab 4 N0 33
      this.tax!.healthInsurance = this.tab4ToMoney(this.tax!.healthInsurance)
      // tab 4 N0 34
      this.tax!.buyCctv = this.tab4ToMoney(this.tax!.buyCctv)
      // tab 4 N0 35
      this.tax!.debitCardFee = this.tab4ToMoney(this.tax!.debitCardFee)
      // tab 4 N0 36
      this.tax!.investStartup = this.tab4ToMoney(this.tax!.investStartup)
      // tab 4 N0 37
      this.tax!.songkranFestival = this.tab4ToMoney(this.tax!.songkranFestival)
      // tab 4 N0 38
      this.tax!.buyRubber = this.tab4ToMoney(this.tax!.buyRubber)
      // tab 4 N0 39
      this.buyEbook2 = this.tax!.bookEbook
      this.buyEbook2 = this.tab4ToMoney(this.buyEbook2)
      // tab 4 N0 40
      this.tax!.buyInCountry = this.tab4ToMoney(this.tax!.buyInCountry)
      // tab 4 N0 41
      this.tax!.homeRepair2 = this.tab4ToMoney(this.tax!.homeRepair2)
      // tab 4 N0 42
      this.tax!.carRepair2 = this.tab4ToMoney(this.tax!.carRepair2)
      // tab 4 N0 43
      this.tax!.ssfSpecial = this.tab4ToMoney(this.tax!.ssfSpecial)

      // tab 4 N0 7
      this.empTaxInsurancePensions = this.emp!.tax.insurancePensions.toString()
      this.empTaxInsurancePensions = this.tab4ToMoney(this.empTaxInsurancePensions)

      // tab 4 N0 18
      this.empTaxDonationSpecial = this.emp!.tax.donationSpecial.toLocaleString()
      this.empTaxDonationSpecial = this.tab4ToMoney(this.empTaxDonationSpecial)

      // tab 4 N0 22
      this.firstHome = this.emp!.tax.firstHome.toString()
      this.firstHome = this.tab4ToMoney(this.firstHome)
      // tab 4 N0 23
      this.firstHome2 = this.emp!.tax.firstHome.toString()
      this.firstHome2 = this.tab4ToMoney(this.firstHome2)


      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = Pwf014SupDetailComponent
      this.cdr.markForCheck()
    })
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
    const modalRef = this.modalService.open(DocReferenceModalComponent, {
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
    this.msg = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?'
    this.modalService.open(this.cancelModal, {
      centered: true,
      backdrop: 'static'
    })
  }

  tab3checkParents(no: number) {
    if (no == 1) {
      if (this.emp!.family.father.idCard.length > 0 && this.emp!.family.father.idCard.length < 13) {
        this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    }
    if (no == 2) {
      if (this.emp!.family.mother.idCard.length > 0 && this.emp!.family.mother.idCard.length < 13) {
        this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    }
    if (no == 3) {
      if (this.emp!.family.spouse.fatherIdCard.length > 0 && this.emp!.family.spouse.fatherIdCard.length < 13) {
        this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    }
    if (no == 4) {
      if (this.emp!.family.spouse.motherIdCard.length > 0 && this.emp!.family.spouse.motherIdCard.length < 13) {
        this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    }
  }
  tab3checkChildrenId() {
    if (this.familyChildren.idCard.length < 13) {
      this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: "static"
      })
    }
  }

  tab4check(No: number, no?: number) {
    // 2
    if (No == 2 && no == 1) {
      if (this.emp!.tax.totalChildren) {
        if (this.emp!.tax.totalChildren > 99) {
          this.emp!.tax.totalChildren = 99
        }
      } else {
        this.emp!.tax.totalChildren = 0
      }
    }
    if (No == 2 && no == 2) {
      if (this.emp!.tax.childDomestic) {
        if (this.emp!.tax.childDomestic > 3) {
          this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 3 เท่านั้น" : "Please Input value 0 to 3 only."
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: "static"
          });
          this.emp!.tax.childDomestic = 3
        }
      } else {
        this.emp!.tax.childDomestic = 0
      }
    }
    if (No == 2 && no == 3) {
      if (this.emp!.tax.childAbroad) {
        if (this.emp!.tax.childAbroad > 3) {
          this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 3 เท่านั้น" : "Please Input value 0 to 3 only."
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: "static"
          });
          this.emp!.tax.childAbroad = 3
        }
      } else {
        this.emp!.tax.childAbroad = 0
      }
    }
    // 3
    if (No == 3 && no == 1) {
      if (this.fatherId3.length > 0 && this.fatherId3.length < 13) {
        this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    }
    if (No == 3 && no == 2) {
      if (this.motherId3.length > 0 && this.motherId3.length < 13) {
        this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    }
    if (No == 3 && no == 3) {
      if (this.fatherSpouseId3.length > 0 && this.fatherSpouseId3.length < 13) {
        this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    }
    if (No == 3 && no == 4) {
      if (this.motherSpouseId3.length > 0 && this.motherSpouseId3.length < 13) {
        this.msg = this.translateService.currentLang == "th" ? "หมายเลขประจำตัวประชาชนต้องมี 13 หลัก" : "Identification ID have must 13 character."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        })
      }
    }
    // 4
    if (No == 4 && no == 1) {
      this.fatherInsurance4 = this.fatherInsurance4.indexOf(".") == 0 ? "0" + this.fatherInsurance4 : this.fatherInsurance4
      if (this.fatherInsurance4.indexOf(".") == -1) {
        this.fatherInsurance4 = this._decimalPipe
          .transform(this.fatherInsurance4, "1.2-2")!;
      }
      else {
        this.fatherInsurance4 = this._decimalPipe
          .transform(this.fatherInsurance4, "1.2-2")!;
      }
      this.fatherInsurance4 = this.fatherInsurance4 == ".00" ? "0.00" : this.fatherInsurance4
      if (parseFloat(this.fatherInsurance4.split(",").join("")) > 15000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 15000 เท่านั้น" : "Please Input value 0 to 15000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.fatherInsurance4 = "15,000.00"
      }
    }
    if (No == 4 && no == 2) {
      this.motherInsurance4 = this.motherInsurance4.indexOf(".") == 0 ? "0" + this.motherInsurance4 : this.motherInsurance4
      if (this.motherInsurance4.indexOf(".") == -1) {
        this.motherInsurance4 = this._decimalPipe
          .transform(this.motherInsurance4, "1.2-2")!;
      }
      else {
        this.motherInsurance4 = this._decimalPipe
          .transform(this.motherInsurance4, "1.2-2")!;
      }
      this.motherInsurance4 = this.motherInsurance4 == ".00" ? "0.00" : this.motherInsurance4
      if (parseFloat(this.motherInsurance4.split(",").join("")) > 15000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 15000 เท่านั้น" : "Please Input value 0 to 15000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.motherInsurance4 = "15,000.00"
      }
    }
    if (No == 4 && no == 3) {
      this.fatherSpouseInsurance4 = this.fatherSpouseInsurance4.indexOf(".") == 0 ? "0" + this.fatherSpouseInsurance4 : this.fatherSpouseInsurance4
      if (this.fatherSpouseInsurance4.indexOf(".") == -1) {
        this.fatherSpouseInsurance4 = this._decimalPipe
          .transform(this.fatherSpouseInsurance4, "1.2-2")!;
      }
      else {
        this.fatherSpouseInsurance4 = this._decimalPipe
          .transform(this.fatherSpouseInsurance4, "1.2-2")!;
      }
      this.fatherSpouseInsurance4 = this.fatherSpouseInsurance4 == ".00" ? "0.00" : this.fatherSpouseInsurance4
      if (parseFloat(this.fatherSpouseInsurance4.split(",").join("")) > 15000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 15000 เท่านั้น" : "Please Input value 0 to 15000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.fatherSpouseInsurance4 = "15,000.00"
      }
    }
    if (No == 4 && no == 4) {
      this.motherSpouseInsurance4 = this.motherSpouseInsurance4.indexOf(".") == 0 ? "0" + this.motherSpouseInsurance4 : this.motherSpouseInsurance4
      if (this.motherSpouseInsurance4.indexOf(".") == -1) {
        this.motherSpouseInsurance4 = this._decimalPipe
          .transform(this.motherSpouseInsurance4, "1.2-2")!;
      }
      else {
        this.motherSpouseInsurance4 = this._decimalPipe
          .transform(this.motherSpouseInsurance4, "1.2-2")!;
      }
      this.motherSpouseInsurance4 = this.motherSpouseInsurance4 == ".00" ? "0.00" : this.motherSpouseInsurance4
      if (parseFloat(this.motherSpouseInsurance4.split(",").join("")) > 15000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 15000 เท่านั้น" : "Please Input value 0 to 15000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.motherSpouseInsurance4 = "15,000.00"
      }
    }
    // 5
    if (No == 5) {
      this.tax!.insurance = this.tab4ToMoney(this.tax!.insurance)
      if (parseFloat(this.tax!.insurance.split(",").join("")) > parseFloat(this.configShow.PY3011)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3011.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3011.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.insurance = this.configShow.PY3011
        this.tab4check(5)
      }
    }
    // 6
    if (No == 6) {
      this.tax!.insurance_spouse = this.tab4ToMoney(this.tax!.insurance_spouse)
      if (parseFloat(this.tax!.insurance_spouse.split(",").join("")) > parseFloat(this.configShow.PY3011)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3011.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3011.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.insurance_spouse = this.configShow.PY3011
        this.tab4check(6)
      }
    }
    // 7
    if (No == 7) {
      this.empTaxInsurancePensions = this.tab4ToMoney(this.empTaxInsurancePensions)
      if (parseFloat(this.empTaxInsurancePensions.split(",").join("")) > parseFloat(this.configShow.PY9906)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY9906.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY9906.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.empTaxInsurancePensions = this.configShow.PY9906
        this.tab4check(7)
      }
    }
    // 9
    if (No == 9) {
      this.tax!.rmf = this.tab4ToMoney(this.tax!.rmf)
    }
    // 10
    if (No == 10) {
      this.tax!.ssf = this.tab4ToMoney(this.tax!.ssf)
      if (parseFloat(this.tax!.ssf.split(",").join("")) > parseFloat(this.configShow.PY3034)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3034.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3034.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.ssf = this.configShow.PY3034
        this.tab4check(10)
      }
    }
    // 11
    if (No == 11) {
      this.tax!.ltf = this.tab4ToMoney(this.tax!.ltf)
      if (parseFloat(this.tax!.ltf.split(",").join("")) > parseFloat(this.configShow.PY3013)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3013.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3013.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.ltf = this.configShow.PY3013
        this.tab4check(11)
      }
    }
    // 12
    if (No == 12) {
      this.tax!.interest = this.tab4ToMoney(this.tax!.interest)
      if (parseFloat(this.tax!.interest.split(",").join("")) > 500000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 500000 เท่านั้น" : "Please Input value 0 to 500000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.interest = "500,000.00"
        this.tab4check(12)
      }
    }
    // 14
    if (No == 14) {
      if (parseInt(this.tax!.totalCripple) > 20) {
        this.tax!.totalCripple = "20"
      }
      this.tax!.totalCripple = this.tax!.totalCripple == "" ? "0" : this.tax!.totalCripple
    }
    // 15
    if (No == 15) {
      this.tax!.edudonation = this.tab4ToMoney(this.tax!.edudonation)
      if (parseFloat(this.tax!.edudonation.split(",").join("")) > 900000000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 900000000 เท่านั้น" : "Please Input value 0 to 900000000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.edudonation = "900,000,000.00"
        this.tab4check(15)
      }
    }
    // 16
    if (No == 16) {
      this.tax!.sportdonation = this.tab4ToMoney(this.tax!.sportdonation)
      if (parseFloat(this.tax!.sportdonation.split(",").join("")) > 900000000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 900000000 เท่านั้น" : "Please Input value 0 to 900000000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.sportdonation = "900,000,000.00"
        this.tab4check(16)
      }
    }
    // 17
    if (No == 17) {
      this.tax!.hospitalDonation = this.tab4ToMoney(this.tax!.hospitalDonation)
      if (parseFloat(this.tax!.hospitalDonation.split(",").join("")) > 900000000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 900000000 เท่านั้น" : "Please Input value 0 to 900000000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.hospitalDonation = "900,000,000.00"
        this.tab4check(17)
      }
    }
    // 18
    if (No == 18) {
      this.empTaxDonationSpecial = this.tab4ToMoney(this.empTaxDonationSpecial)
      if (parseFloat(this.empTaxDonationSpecial.split(",").join("")) > 900000000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 900000000 เท่านั้น" : "Please Input value 0 to 900000000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.empTaxDonationSpecial = "900,000,000.00"
        this.tab4check(18)
      }
    }
    // 19
    if (No == 19) {
      this.tax!.donation = this.tab4ToMoney(this.tax!.donation)
      if (parseFloat(this.tax!.donation.split(",").join("")) > 900000000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 900000000 เท่านั้น" : "Please Input value 0 to 900000000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.donation = "900,000,000.00"
        this.tab4check(19)
      }
    }
    // 20
    if (No == 20) {
      this.tax!.politicalDonation = this.tab4ToMoney(this.tax!.politicalDonation)
      if (parseFloat(this.tax!.politicalDonation.split(",").join("")) > parseFloat(this.configShow.PY3063)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3063.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3063.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.politicalDonation = this.configShow.PY3063
        this.tab4check(20)
      }
    }
    // 22
    if (No == 22) {
      this.firstHome = this.tab4ToMoney(this.firstHome)
      if (parseFloat(this.firstHome.split(",").join("")) > parseFloat(this.configShow.PY3042)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3042.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3042.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.firstHome = this.configShow.PY3042
        this.tab4check(22)
      }
    }
    // 23
    if (No == 23) {
      this.firstHome2 = this.tab4ToMoney(this.firstHome2)
      if (parseFloat(this.firstHome2.split(",").join("")) > parseFloat(this.configShow.PY3038)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3038.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3038.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.firstHome2 = this.configShow.PY3038
        this.tab4check(23)
      }
    }
    // 24
    if (No == 24) {
      this.tax!.homeRepair2 = this.tab4ToMoney(this.tax!.homeRepair2)
      if (parseFloat(this.tax!.homeRepair2.split(",").join("")) > parseFloat(this.configShow.PY9907)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY9907.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY9907.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.homeRepair2 = this.configShow.PY9907
        this.tab4check(24)
      }
    }
    // 25
    if (No == 25) {
      this.tax!.carRepair2 = this.tab4ToMoney(this.tax!.carRepair2)
      if (parseFloat(this.tax!.carRepair2.split(",").join("")) > parseFloat(this.configShow.PY9908)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY9908.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY9908.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.carRepair2 = this.configShow.PY9908
        this.tab4check(25)
      }
    }
    // 26
    if (No == 26) {
      this.travelInCountry = this.tab4ToMoney(this.travelInCountry)
      if (parseFloat(this.travelInCountry.split(",").join("")) > parseFloat(this.configShow.PY3037)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3037.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3037.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.travelInCountry = this.configShow.PY3037
        this.tab4check(26)
      }
    }
    // 27
    if (No == 27) {
      this.travelInCountry2 = this.tab4ToMoney(this.travelInCountry2)
      if (parseFloat(this.travelInCountry2.split(",").join("")) > parseFloat(this.configShow.PY9905)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY9905.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY9905.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.travelInCountry2 = this.configShow.PY9905
        this.tab4check(27)
      }
    }
    // 28
    if (No == 28) {
      this.tax!.childbirth = this.tab4ToMoney(this.tax!.childbirth)
      if (parseFloat(this.tax!.childbirth.split(",").join("")) > parseFloat(this.configShow.PY3051)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3051.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3051.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.childbirth = this.configShow.PY3051
        this.tab4check(28)
      }
    }
    // 29
    if (No == 29) {
      this.tax!.otop = this.tab4ToMoney(this.tax!.otop)
      if (parseFloat(this.tax!.otop.split(",").join("")) > parseFloat(this.configShow.PY3063)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3063.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3063.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.otop = this.configShow.PY3063
        this.tab4check(29)
      }
    }
    // 30
    if (No == 30) {
      this.tax!.buyEducationSport = this.tab4ToMoney(this.tax!.buyEducationSport)
      if (parseFloat(this.tax!.buyEducationSport.split(",").join("")) > parseFloat(this.configShow.PY9903)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY9903.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY9903.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.buyEducationSport = this.configShow.PY9903
        this.tab4check(30)
      }
    }
    // 31
    if (No == 31) {
      this.tax!.buyEbook = this.tab4ToMoney(this.tax!.buyEbook)
      if (parseFloat(this.tax!.buyEbook.split(",").join("")) > parseFloat(this.configShow.PY3064)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3064.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3064.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.buyEbook = this.configShow.PY3064
        this.tab4check(31)
      }
    }
    // 32
    if (No == 32) {
      this.tax!.savings = this.tab4ToMoney(this.tax!.savings)
      if (parseFloat(this.tax!.savings.split(",").join("")) > 500000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 500000 เท่านั้น" : "Please Input value 0 to 500000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.savings = "500,000.00"
        this.tab4check(32)
      }
    }
    // 33
    if (No == 33) {
      this.tax!.healthInsurance = this.tab4ToMoney(this.tax!.healthInsurance)
      if (parseFloat(this.tax!.healthInsurance.split(",").join("")) > 15000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 15000 เท่านั้น" : "Please Input value 0 to 15000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.healthInsurance = "15,000.00"
        this.tab4check(33)
      }
    }
    // 34
    if (No == 34) {
      this.tax!.buyCctv = this.tab4ToMoney(this.tax!.buyCctv)
      if (parseFloat(this.tax!.buyCctv.split(",").join("")) > 100000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 100000 เท่านั้น" : "Please Input value 0 to 100000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.buyCctv = "100,000.00"
        this.tab4check(34)
      }
    }
    // 35
    if (No == 35) {
      this.tax!.debitCardFee = this.tab4ToMoney(this.tax!.debitCardFee)
      if (parseFloat(this.tax!.debitCardFee.split(",").join("")) > 100000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 100000 เท่านั้น" : "Please Input value 0 to 100000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.debitCardFee = "100,000.00"
        this.tab4check(35)
      }
    }
    // 36
    if (No == 36) {
      this.tax!.investStartup = this.tab4ToMoney(this.tax!.investStartup)
    }
    // 37
    if (No == 37) {
      this.tax!.songkranFestival = this.tab4ToMoney(this.tax!.songkranFestival)
      if (parseFloat(this.tax!.songkranFestival.split(",").join("")) > 15000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 15000 เท่านั้น" : "Please Input value 0 to 15000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.songkranFestival = "15,000.00"
        this.tab4check(37)
      }
    }
    // 38
    if (No == 38) {
      this.tax!.buyRubber = this.tab4ToMoney(this.tax!.buyRubber)
      if (parseFloat(this.tax!.buyRubber.split(",").join("")) > 100000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 100000 เท่านั้น" : "Please Input value 0 to 100000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.buyRubber = "100,000.00"
        this.tab4check(38)
      }
    }
    // 39
    if (No == 39) {
      this.buyEbook2 = this.tab4ToMoney(this.buyEbook2)
      if (parseFloat(this.buyEbook2.split(",").join("")) > 100000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 100000 เท่านั้น" : "Please Input value 0 to 100000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.buyEbook2 = "100,000.00"
        this.tab4check(39)
      }
    }
    // 40
    if (No == 40) {
      this.tax!.buyInCountry = this.tab4ToMoney(this.tax!.buyInCountry)
      if (parseFloat(this.tax!.buyInCountry.split(",").join("")) > 15000) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง 15000 เท่านั้น" : "Please Input value 0 to 15000 only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.buyInCountry = "15,000.00"
        this.tab4check(40)
      }
    }
    // 41
    if (No == 41) {
      this.tax!.homeRepair2 = this.tab4ToMoney(this.tax!.homeRepair2)
      if (parseFloat(this.tax!.homeRepair2.split(",").join("")) > parseFloat(this.configShow.PY3053)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3053.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3053.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.homeRepair2 = this.configShow.PY3053
        this.tab4check(41)
      }
    }
    // 42
    if (No == 42) {
      this.tax!.carRepair2 = this.tab4ToMoney(this.tax!.carRepair2)
      if (parseFloat(this.tax!.carRepair2.split(",").join("")) > parseFloat(this.configShow.PY3054)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3054.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3054.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.carRepair2 = this.configShow.PY3054
        this.tab4check(42)
      }
    }
    // 43
    if (No == 43) {
      this.tax!.ssfSpecial = this.tab4ToMoney(this.tax!.ssfSpecial)
      if (parseFloat(this.tax!.ssfSpecial.split(",").join("")) > parseFloat(this.configShow.PY3065)) {
        this.msg = this.translateService.currentLang == "th" ? "กรุณากรอกค่า 0 ถึง " + this.configShow.PY3065.split(".")[0] + " เท่านั้น" : "Please Input value 0 to " + this.configShow.PY3065.split(".")[0] + " only."
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: "static"
        });
        this.tax!.ssfSpecial = this.configShow.PY3065
        this.tab4check(43)
      }
    }
  }
  tab4checkNg(No: number, no?: number) {
    // 4
    if (No == 4 && no == 1) {
      if (parseFloat(this.fatherInsurance4) > 15000) {
        this.tab4checkNo4FormControl1.setErrors({ invalidNumber: true })
      }
    }
    if (No == 4 && no == 2) {
      if (parseFloat(this.motherInsurance4) > 15000) {
        this.tab4checkNo4FormControl2.setErrors({ invalidNumber: true })
      }
    }
    if (No == 4 && no == 3) {
      if (parseFloat(this.fatherSpouseInsurance4) > 15000) {
        this.tab4checkNo4FormControl3.setErrors({ invalidNumber: true })
      }
    }
    if (No == 4 && no == 4) {
      if (parseFloat(this.motherSpouseInsurance4) > 15000) {
        this.tab4checkNo4FormControl4.setErrors({ invalidNumber: true })
      }
    }
    // 5
    if (No == 5) {
      if (parseFloat(this.tax!.insurance) > parseFloat(this.configShow.PY3011)) {
        this.tab4checkNo5FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 6
    if (No == 6) {
      if (parseFloat(this.tax!.insurance_spouse) > parseFloat(this.configShow.PY3011)) {
        this.tab4checkNo6FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 7
    if (No == 7) {
      if (parseFloat(this.empTaxInsurancePensions) > parseFloat(this.configShow.PY9906)) {
        this.tab4checkNo7FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 10
    if (No == 10) {
      if (parseFloat(this.tax!.ssf) > parseFloat(this.configShow.PY3034)) {
        this.tab4checkNo10FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 11
    if (No == 11) {
      if (parseFloat(this.tax!.ltf) > parseFloat(this.configShow.PY3013)) {
        this.tab4checkNo11FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 12
    if (No == 12) {
      if (parseFloat(this.tax!.interest) > 500000) {
        this.tab4checkNo12FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 14
    if (No == 14) {
      if (parseFloat(this.tax!.totalCripple) > 20) {
        this.tab4checkNo14FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 15
    if (No == 15) {
      if (parseFloat(this.tax!.edudonation) > 900000000) {
        this.tab4checkNo15FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 16
    if (No == 16) {
      if (parseFloat(this.tax!.sportdonation) > 900000000) {
        this.tab4checkNo16FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 17
    if (No == 17) {
      if (parseFloat(this.tax!.hospitalDonation) > 900000000) {
        this.tab4checkNo17FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 18
    if (No == 18) {
      if (parseFloat(this.empTaxDonationSpecial) > 900000000) {
        this.tab4checkNo18FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 19
    if (No == 19) {
      if (parseFloat(this.tax!.donation) > 900000000) {
        this.tab4checkNo19FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 20
    if (No == 20) {
      if (parseFloat(this.tax!.politicalDonation) > parseFloat(this.configShow.PY3063)) {
        this.tab4checkNo20FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 22
    if (No == 22) {
      if (parseFloat(this.firstHome) > parseFloat(this.configShow.PY3042)) {
        this.tab4checkNo22FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 23
    if (No == 23) {
      if (parseFloat(this.firstHome2) > parseFloat(this.configShow.PY3038)) {
        this.tab4checkNo23FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 24
    if (No == 24) {
      if (parseFloat(this.tax!.homeRepair2) > parseFloat(this.configShow.PY9907)) {
        this.tab4checkNo24FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 25
    if (No == 25) {
      if (parseFloat(this.tax!.carRepair2) > parseFloat(this.configShow.PY9908)) {
        this.tab4checkNo25FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 26
    if (No == 26) {
      if (parseFloat(this.travelInCountry) > parseFloat(this.configShow.PY3037)) {
        this.tab4checkNo26FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 27
    if (No == 27) {
      if (parseFloat(this.travelInCountry2) > parseFloat(this.configShow.PY9905)) {
        this.tab4checkNo27FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 28
    if (No == 28) {
      if (parseFloat(this.tax!.childbirth) > parseFloat(this.configShow.PY3051)) {
        this.tab4checkNo28FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 29
    if (No == 29) {
      if (parseFloat(this.tax!.otop) > parseFloat(this.configShow.PY3063)) {
        this.tab4checkNo29FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 30
    if (No == 30) {
      if (parseFloat(this.tax!.buyEducationSport) > parseFloat(this.configShow.PY9903)) {
        this.tab4checkNo30FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 31
    if (No == 31) {
      if (parseFloat(this.tax!.buyEbook) > parseFloat(this.configShow.PY3064)) {
        this.tab4checkNo31FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 32
    if (No == 32) {
      if (parseFloat(this.tax!.savings) > 500000) {
        this.tab4checkNo32FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 33
    if (No == 33) {
      if (parseFloat(this.tax!.healthInsurance) > 15000) {
        this.tab4checkNo33FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 34
    if (No == 34) {
      if (parseFloat(this.tax!.buyCctv) > 100000) {
        this.tab4checkNo34FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 35
    if (No == 35) {
      if (parseFloat(this.tax!.debitCardFee) > 100000) {
        this.tab4checkNo35FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 37
    if (No == 37) {
      if (parseFloat(this.tax!.songkranFestival) > 15000) {
        this.tab4checkNo37FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 38
    if (No == 38) {
      if (parseFloat(this.tax!.buyRubber) > 100000) {
        this.tab4checkNo38FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 39
    if (No == 39) {
      if (parseFloat(this.buyEbook2) > 100000) {
        this.tab4checkNo39FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 40
    if (No == 40) {
      if (parseFloat(this.tax!.buyInCountry) > 15000) {
        this.tab4checkNo40FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 41
    if (No == 41) {
      if (parseFloat(this.tax!.homeRepair2) > parseFloat(this.configShow.PY3053)) {
        this.tab4checkNo41FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 42
    if (No == 42) {
      if (parseFloat(this.tax!.carRepair2) > parseFloat(this.configShow.PY3054)) {
        this.tab4checkNo42FormControl.setErrors({ invalidNumber: true })
      }
    }
    // 43
    if (No == 43) {
      if (parseFloat(this.tax!.ssfSpecial) > parseFloat(this.configShow.PY3065)) {
        this.tab4checkNo43FormControl.setErrors({ invalidNumber: true })
      }
    }
  }

  tab4ToMoney(item: string) {
    return this._decimalPipe
      .transform(item, "1.2-2")!;
  }

  changeValue(name: string, oldValue: string, type: string, tab: string, newValue: string) {
    this.__wf__fieldFocusArray = this.__wf__fieldFocusArray.filter(x => !x.startsWith(name))
    if (oldValue != newValue) {
      this.__wf__fieldFocusArray.push(name + ':' + oldValue + ':' + type + ':' + tab)
    }
    this.__wf__tabEditArray = this.__wf__tabEditArray.filter(x => x != tab)
    if (this.__wf__fieldFocusArray.filter(x => x.endsWith(tab)).length > 0) {
      this.__wf__tabEditArray.push(tab)
    }
  }

  splitComma(text: string): string {
    return text ? text.split(',').join('') : "0.00"
  }
ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
}
