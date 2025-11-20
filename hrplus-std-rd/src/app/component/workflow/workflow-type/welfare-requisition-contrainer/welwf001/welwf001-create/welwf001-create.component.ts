import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model'
import { WorkingsModel } from 'src/app/models/workingmodel.model'
import { EmployeeService } from 'src/app/services/employee.service'
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location } from '@angular/common'
import { workflowService } from 'src/app/services/workflow.service'
import localeThai from '@angular/common/locales/th'
import { MyWelfare, Welfare } from 'src/app/models/Welfare.model'
import { MySitewel, Sitewel } from 'src/app/models/sitewel.model'
import { MyWelfareViewModel, WelfareViewModel } from 'src/app/models/welfareview.model'
import { Welwf001DetailComponent } from '../welwf001-detail/welwf001-detail.component'
import { FamilyLists, MyFamilyLists } from 'src/app/models/familylists.model'
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service'
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { WelfareGroupModel } from 'src/app/models/welfare-group.model'
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component'
import { FormsModule } from '@angular/forms'
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    DatePipe,
    DecimalPipe,
    Welwf001DetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowSendtoComponent,
    FormsModule,
    WorkflowRemarkComponent,
  ],
  selector: 'app-welwf001-create',
  templateUrl: './welwf001-create.component.html',
  styleUrls: ['./welwf001-create.component.scss'],
  providers: [DecimalPipe],
})
export class Welwf001CreateComponent implements OnInit {
  @Input() data: any;
  employeeCCId = ""
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  active = 1;
  activeKeep = 1;
  activeSelected = 1;
  validDate = false;
  @ViewChild('alertModal') alertModal: undefined
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  @ViewChild('confirmModal') confirmModal: undefined
  timestampFile: any
  newFile: any
  uploadFilename: any
  uploadFileSize: any
  nameFile = 'browse_file'
  uploadConfig: any
  msg = ''
  remark = ''
  wfid: any
  token: any
  checkFamilyLists = false
  sendtoWF: SendtoModel | undefined
  emp: WorkingsModel | undefined
  runno: string | undefined
  screenObj: any
  re = /\//gi
  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  __wf__mcomplain$welid$01 = ""
  __wf__weldesc01 = { tdesc: "", edesc: "" }
  __wf__mcomplain$line_no$01 = ""
  __wf__familydesc01 = { tdesc: "", edesc: "" }
  __wf__mcomplain$sitewelid$01 = ""
  __wf__siteweldesc01 = { tdesc: "", edesc: "" }
  __wf__mcomplain$hopital$01 = ""
  __wf__mcomplain$datesent$01 = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  __wf__mcomplain$datebill$01 = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  __wf__mcomplain$numberbill$01 = ""
  __wf__mcomplain$amountmoney$01 = ""
  __wf__mcomplain$amountrealmoney$01 = ""
  __wf__totalmoney = 0;
  __wf__mcomplain$attach$01 = ""
  priority = "0"

  welfareLists: Welfare[] = []
  welfareListsShow: Welfare[] | undefined
  welfareListsSearch = ""
  familyLists: FamilyLists[] | undefined
  familyListsShow: any[] | undefined
  familyListsSearch = ""
  sitewelLists: Sitewel[] | undefined
  sitewelListsShow: Sitewel[] | undefined
  sitewelListsSearch = ""

  welfareView: WelfareViewModel[] | undefined
  welfareViewDate: string[] = []
  welfareViewYearTh: number[] = []
  welfareViewTotal = 0
  welfareViewCost = 0

  welfareListsDoc: Welfare | undefined
  welfareListsDocChack = [{ select: false, docId: "" }]
  resultstatus = false
  maxDate= new NgbDate(new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDate())
  workflowData: any
  cost:number = 0
  inputs = {
    data: {}
  }
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('cancelModal') cancelModal: undefined
  dynamicComponent: any

  calculateWord = {
    th: 'กรุณากดปุ่ม"คำนวณ"ก่อนส่ง',
    en: 'Please press "Calculate" before submit.'
  }

  referenceParam = ""
  welfareGroupList:WelfareGroupModel[] = []
  selectWelfareGroup:WelfareGroupModel = new WelfareGroupModel({},this.translateService)
  searchWelfareGroup= ""
  nameFileUpload = ""
  constructor(private modalService: NgbModal,
    public modal: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    public translateService: TranslateService,
    private local: Location,
    private datePipe: DatePipe,
    private _decimalPipe: DecimalPipe,
    public datepickerService: DatepickerNgbService,
    private parserFormat: NgbDateParserFormatter) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    if (this.runno) {
      this.setScreenValue()
    }

    this.getuploadWFApi()
    this.sendtoWFApi()
    this.requireEMP()
    this.getWelfareLists()
    this.getFamilyLists()
    this.getSitewelLists()
    // this.getWelfareGrpLists();

  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe(result => {
      this.sendtoWF = new MySendtoModel(result, this.translateService)
      this.cdr.markForCheck()
    })
  }
  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
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
      let date = new Date()
      this.timestampFile = date.getTime()
      let body = {
        uploadfield: 'attached_file_temp.file_name',
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      }
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.timestampFile = ''
          this.nameFile = 'browse_file'
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.'
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          })
        } else {
          this.nameFile = body.fileName
          this.nameFileUpload = result.message
        }

      })
    }
    this.closeBtnClick()
  }
  resetIMG() {
    this.timestampFile = ''
    this.nameFile = 'browse_file'
  }
  openOnSubmit() {
    if (!this.resultstatus) {
      this.msg = this.translateService.currentLang == 'th' ? this.calculateWord.th : this.calculateWord.en
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
    } else {
      this.msg = this.translateService.currentLang == 'th' ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
      this.modalService.open(this.confirmModal, {
        centered: true,
        backdrop: 'static'
      })
    }

  }
  onSubmit() {
    let screenObj: any = {}
    screenObj["timestampFile"] = this.timestampFile
    screenObj["attach_time"] = this.timestampFile


    screenObj["__wf__budyear"] = new Date().getFullYear()
    screenObj["__wf__employeeid"] = this.emp!.employeeId
    screenObj["__wf__result_cal"] = true
    screenObj["__wf__fullname"] = this.emp!.employeeId + ' ' + this.emp!.fname + ' ' + this.emp!.lname
    screenObj["__wf__position"] = this.emp!.position!.tdesc
    screenObj["__wf__bu1"] = this.emp!.bu1!.tdesc
    screenObj["__wf__bu2"] = this.emp!.bu2!.tdesc
    screenObj["__wf__bu3"] = this.emp!.bu3!.tdesc

    // รหัสสวัสดิการ
    // screenObj["__wf__mcomplain$welid$01"] = this.__wf__mcomplain$welid$01
    // screenObj["__wf__weldesc01"] = this.__wf__weldesc01.tdesc
    screenObj["__wf__welid$1"] = this.__wf__mcomplain$welid$01;
    screenObj["__wf__weldesc$1"] = this.__wf__weldesc01.tdesc;

    screenObj["__wf__mcomplain$line_no$01"] = this.__wf__mcomplain$line_no$01
    screenObj["__wf__familydesc01"] = this.__wf__familydesc01.tdesc
    // สถานที่ใช้สวัสดิการ
    // screenObj["__wf__mcomplain$sitewelid$01"] = this.__wf__mcomplain$sitewelid$01
    // screenObj["__wf__siteweldesc01"] = this.__wf__siteweldesc01.tdesc
    screenObj["__wf__sitewelid$1"] = this.__wf__mcomplain$sitewelid$01;
    screenObj["__wf__siteweldesc$1"] = this.__wf__siteweldesc01.tdesc;

    // ชื่อโรงพยาบาล
    // screenObj["__wf__mcomplain$hopital$01"] = this.__wf__mcomplain$hopital$01
    screenObj["__wf__responsibilitie$1"] = this.__wf__mcomplain$hopital$01;

    // วันที่ส่ง
    // screenObj["__wf__mcomplain$datesent$01"] = this.parserFormat.format(this.__wf__mcomplain$datesent$01).replace(this.re, '-')
    screenObj["__wf__datesent$1"] =  this.parserFormat.format(this.__wf__mcomplain$datesent$01).replace(this.re, '-');

    // วันที่ใบเสร็จ
    // screenObj["__wf__mcomplain$datebill$01"] = this.parserFormat.format(this.__wf__mcomplain$datebill$01).replace(this.re, '-')
    screenObj["__wf__datebill$1"] = this.parserFormat.format(this.__wf__mcomplain$datebill$01).replace(this.re, '-');

    // เลขที่ใบเสร็จ
    // screenObj["__wf__mcomplain$numberbill$01"] = this.__wf__mcomplain$numberbill$01
    screenObj["__wf__numberbill$1"] = this.__wf__mcomplain$numberbill$01 ;

    // ยอดเงิน
    // screenObj["__wf__mcomplain$amountmoney$01"] = this.__wf__mcomplain$amountmoney$01
    screenObj["__wf__reqcost$1"] = this.__wf__mcomplain$amountmoney$01;

    // ยอดที่เบิกได้ : บาท
    // screenObj["__wf__mcomplain$amountrealmoney$01"] = this.__wf__mcomplain$amountmoney$01

screenObj["__wf__cost$1"] = this.__wf__mcomplain$amountrealmoney$01;
    screenObj["__wf__cost_total$1"] =  this.cost;

    screenObj["__wf__mcomplain$whouse$01"] = "1"
    screenObj["__wf__mcomplain$docgid$01"] = "002"

    screenObj["__wf__last_record"] =  "1"
    screenObj["__wf__list_record"] =  ",01"

    screenObj["__wf__namefile$1"] = this.nameFile;
    screenObj["__wf__timestampfile$1"] = this.timestampFile;
    screenObj["__wf__nameFileUpload$1"] = this.nameFileUpload;

    // screenObj["__wf__welgid"] =this.selectWelfareGroup.welgId
    // screenObj["__wf__welgdesc"] =this.selectWelfareGroup.getDesc()

    let doc = ""
    this.welfareListsDocChack.forEach(x => {
      if (x.select) {
        doc = doc + x.docId + ","
      }

    })
    screenObj["__wf__mcomplain$attach$01"] = doc.substring(0, doc.length - 1)
    screenObj["__wf__attachdesc01"] = ""
    screenObj["__wf__totalmoney"] = this.__wf__totalmoney
    screenObj["__wf__totalrealmoney"] = "0.00"
    screenObj["__wf__amountrow"] = "1"
    screenObj["__wf__remark"] = this.remark;

    screenObj["priority"] = this.priority

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
        this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถสร้างเอกสารได้' : 'Can not create workflow.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
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


      this.__wf__mcomplain$hopital$01 = this.screenObj["__wf__responsibilitie$1"]
      this.__wf__mcomplain$datesent$01 = new NgbDate(parseInt(this.screenObj["__wf__datesent$1"].split("-")[2]), parseInt(this.screenObj["__wf__datesent$1"].split("-")[1]), parseInt(this.screenObj["__wf__datesent$1"].split("-")[0]))
      this.__wf__mcomplain$datebill$01 = new NgbDate(parseInt(this.screenObj["__wf__datebill$1"].split("-")[2]), parseInt(this.screenObj["__wf__datebill$1"].split("-")[1]), parseInt(this.screenObj["__wf__datebill$1"].split("-")[0]))
      this.__wf__mcomplain$numberbill$01 = this.screenObj["__wf__numberbill$1"]
      this.__wf__mcomplain$amountmoney$01 = this.screenObj["__wf__reqcost$1"]
      this.__wf__mcomplain$amountrealmoney$01 = this.screenObj["__wf__cost$1"]
      this.cost = this.screenObj["__wf__cost_total$1"]

      // this.priority = this.screenObj["priority"]
      this.selectWelfareGroup.welgId = this.screenObj["__wf__welgid"]

      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.getWelfareLists()
      // this.findWelfareGroupList()
      this.getFamilyLists()
      this.getSitewelLists()

      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.inputs.data = result
      this.dynamicComponent = Welwf001DetailComponent
      this.cdr.markForCheck()
    })
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }

  getWelfareLists() {
    this.workflowService.getWelfareLists().then((result) => {
      this.welfareLists = result.map(e => new MyWelfare(e, this.translateService)).sort((a: Welfare, b: Welfare) => a.welId! > b.welId! ? 1 : -1)
      this.welfareLists = this.welfareLists.filter(item => item.welg?.welgId == 'WF01' || item.welg?.welgId == 'WF02' || item.welg?.welgId == 'WF03');
      if (this.runno && this.screenObj) {
        if (this.welfareLists!.filter((x: Welfare) => x.welId!.toLowerCase() == this.screenObj["__wf__welid$1"].toLowerCase()).length == 1) {
          this.selectWelfareLists(this.welfareLists!.filter((x: Welfare) => x.welId!.toLowerCase() == this.screenObj["__wf__welid$1"].toLowerCase())[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  getWelfareGrpLists(){
    this.workflowService.getWelfareGrpLists().then((result) => {
      this.welfareGroupList = result.map(e => new WelfareGroupModel(e, this.translateService))
      this.welfareGroupList = this.welfareGroupList.sort((a, b) => a.welgId.toLowerCase().localeCompare(b.welgId.toLowerCase())).filter(item => item.welgId == 'WF01' || item.welgId == 'WF02' || item.welgId == 'WF03');
    })
  }
  filterWorkArea() {
    return this.welfareGroupList.filter(x => x.tdesc.toLowerCase().includes(this.searchWelfareGroup.toLowerCase()) ||x.edesc.toLowerCase().includes(this.searchWelfareGroup.toLowerCase()) || x.welgId.toLowerCase().includes(this.searchWelfareGroup.toLowerCase()))
  }
  selectWelfareGroupList(item:WelfareGroupModel){
    this.selectWelfareGroup = item
    // this.getWelfareListsById(item.welgId)
    this.__wf__mcomplain$welid$01 = ""
    this.__wf__weldesc01.tdesc = ""
    this.__wf__weldesc01.edesc = ""
    this.__wf__mcomplain$amountrealmoney$01 = ""
  }
  findWelfareGroupList() {
   let data = this.welfareGroupList.find(x => x.welgId == this.selectWelfareGroup.welgId)
    if(data){
      this.selectWelfareGroup.welgId = new WelfareGroupModel({...data,welgId:this.selectWelfareGroup.welgId}, this.translateService).welgId;
      this.selectWelfareGroup.tdesc = new WelfareGroupModel({...data,welgId:this.selectWelfareGroup.welgId}, this.translateService).tdesc;
      this.selectWelfareGroup.edesc = new WelfareGroupModel({...data,welgId:this.selectWelfareGroup.welgId}, this.translateService).edesc;
      // this.getWelfareListsById(this.selectWelfareGroup.welgId)
    }else{
      this.selectWelfareGroup.welgId = new WelfareGroupModel({welgId:this.selectWelfareGroup.welgId}, this.translateService).welgId;
      this.selectWelfareGroup.tdesc = ''
      this.selectWelfareGroup.edesc = ''
      this.welfareLists = []
    }
  }
  searchWelfareLists() {
    this.welfareListsShow = this.welfareLists!.filter((x: Welfare) => x.welId!.toLowerCase().indexOf(this.welfareListsSearch.toLowerCase()) !== -1||x.tdesc?.toLowerCase().indexOf(this.welfareListsSearch.toLowerCase()) !== -1||x.edesc?.toLowerCase().indexOf(this.welfareListsSearch.toLowerCase()) !== -1);
    this.pageModal = 1;
    this.collectionSizeModal = this.welfareListsShow.length
  }
  selectWelfareLists(item: Welfare) {
    this.welfareView = undefined
    this.__wf__mcomplain$amountmoney$01 = '0.00'
    this.__wf__mcomplain$welid$01 = item.welId!
    this.__wf__weldesc01.tdesc = item.tdesc!
    this.__wf__weldesc01.edesc = item.edesc!
    if (this.__wf__mcomplain$welid$01 == "IPD002") {
      this.checkFamilyLists = true;
    } else {
      this.checkFamilyLists = false;
    }
    this.resultstatus = false
    this.welfareListsDoc = this.welfareLists.find(x => x.welId!.toLowerCase() == this.__wf__mcomplain$welid$01.toLowerCase())
    this.welfareListsDocChack = []
    if (this.welfareListsDoc) {
      this.welfareListsDoc.documentGrp?.referencesDocument?.forEach(x => {
        if (x.status == "1") {
          this.welfareListsDocChack.push({ select: true, docId: x.document!.docId! })
        } else {
          this.welfareListsDocChack.push({ select: false, docId: x.document!.docId! })
        }
      })
    }
    this.calWelfare2()
  }
  change__wf__mcomplain$welid$01() {
    if (this.welfareLists!.filter((x: Welfare) => x.welId!.toLowerCase() == this.__wf__mcomplain$welid$01.toLowerCase()).length == 1) {
      this.selectWelfareLists(this.welfareLists!.filter((x: Welfare) => x.welId!.toLowerCase() == this.__wf__mcomplain$welid$01.toLowerCase())[0])
    } else {
      this.__wf__weldesc01 = { tdesc: "", edesc: "" }
      this.checkFamilyLists = false;
    }

  }
  coverStringToNumber(number: Number){
    return Number(String(number).replace(/,/g, ''))
  }
  getFamilyLists() {
    this.workflowService.getFamilyLists().then((result) => {
      this.familyLists = result.map(e => new MyFamilyLists(e, this.translateService))
      this.cdr.markForCheck()
    })
  }
  searchFamilyLists() {
    this.familyListsShow = this.familyLists!.filter((x: any) => x.welId!.toLowerCase().indexOf(this.familyListsSearch.toLowerCase()) !== -1);
    this.pageModal = 1;
    this.collectionSizeModal = 0
  }
  selectFamilyLists(item: FamilyLists) {
    this.__wf__mcomplain$line_no$01 = this.emp!.employeeId!
    this.__wf__familydesc01.tdesc = item.fname! + ' ' + item.lname!
    this.__wf__familydesc01.edesc = item.efname! + ' ' + item.elname!
  }
  change__wf__mcomplain$line_no$01() {
    // if (this.familyLists!.filter((x: any) => x.welId!.toLowerCase() == this.__wf__mcomplain$line_no$01.toLowerCase()).length == 1) {
    //   this.selectFamilyLists(this.familyLists!.filter((x: any) => x.welId!.toLowerCase() == this.__wf__mcomplain$welid$01)[0])
    // } else {
    //   this.__wf__familydesc01 = { tdesc: "", edesc: "" }
    // }
    this.__wf__familydesc01 = { tdesc: "", edesc: "" }
  }

  getSitewelLists() {
    this.workflowService.getSitewelLists().then((result) => {
      this.sitewelLists = result.map(e => new MySitewel(e, this.translateService))
      if (this.runno && this.screenObj) {
        if (this.sitewelLists!.filter((x: Sitewel) => x.sitewelId!.toLowerCase() == this.screenObj["__wf__sitewelid$1"].toLowerCase()).length == 1) {
          this.selectSitewelLists(this.sitewelLists!.filter((x: Sitewel) => x.sitewelId!.toLowerCase() == this.screenObj["__wf__sitewelid$1"])[0])
        }
      }
      this.cdr.markForCheck()
    })
  }
  searchSitewelLists() {
    this.sitewelListsShow = this.sitewelLists!.filter((x: Sitewel) => x.edesc?.toLowerCase().indexOf(this.sitewelListsSearch.toLowerCase()) !== -1||x.tdesc?.toLowerCase().indexOf(this.sitewelListsSearch.toLowerCase()) !== -1||x.sitewelId!.toLowerCase().indexOf(this.sitewelListsSearch.toLowerCase()) !== -1);
    this.pageModal = 1;
    this.collectionSizeModal = 0
  }
  selectSitewelLists(item: Sitewel) {
    this.__wf__mcomplain$sitewelid$01 = item.sitewelId!
    this.__wf__siteweldesc01.tdesc = item.tdesc!
    this.__wf__siteweldesc01.edesc = item.edesc!
  }
  change__wf__mcomplain$sitewelid$01() {
    if (this.sitewelLists!.filter((x: Sitewel) => x.sitewelId!.toLowerCase() == this.__wf__mcomplain$sitewelid$01.toLowerCase()).length == 1) {
      this.selectSitewelLists(this.sitewelLists!.filter((x: Sitewel) => x.sitewelId!.toLowerCase() == this.__wf__mcomplain$sitewelid$01)[0])
    } else {
      this.__wf__siteweldesc01 = { tdesc: "", edesc: "" }
    }
  }

  viewWelfare() {
    this.welfareView = undefined
    this.workflowService.viewWelfare(this.__wf__mcomplain$datesent$01.year + "", this.__wf__mcomplain$welid$01, this.token.employeeid).then(result => {
      this.welfareView = result.map(e => new MyWelfareViewModel(e, this.translateService)).sort((a: WelfareViewModel, b: WelfareViewModel) => (a.occurDate! < b.occurDate!) ? 1 : -1)
      this.welfareViewTotal = 0
      this.welfareViewYearTh = []
      this.welfareViewCost = 0
      this.welfareView.forEach((x, i) => {
        if (i == 0) {
          this.welfareViewCost = result[0].reqCost ? result[0].reqCost : 0
        }
        this.welfareViewCost = this.welfareViewCost - (x.cost ? x.cost : 0)
        this.numberToMonth((x.occurDate + "").split("-")[1])
        this.welfareViewYearTh.push(parseInt((x.occurDate + "").split("-")[0]) + 543)
        this.welfareViewTotal = this.welfareViewTotal + x.cost!
      })
      this.cdr.markForCheck()
    })
  }
  numberToMonth(v: string) {
    if (v == "01") {
      this.welfareViewDate.push("january")
    }
    if (v == "02") {
      this.welfareViewDate.push("february")
    }
    if (v == "03") {
      this.welfareViewDate.push("march")
    }
    if (v == "04") {
      this.welfareViewDate.push("april")
    }
    if (v == "05") {
      this.welfareViewDate.push("may")
    }
    if (v == "06") {
      this.welfareViewDate.push("june")
    }
    if (v == "07") {
      this.welfareViewDate.push("july")
    }
    if (v == "08") {
      this.welfareViewDate.push("august")
    }
    if (v == "09") {
      this.welfareViewDate.push("september")
    }
    if (v == "10") {
      this.welfareViewDate.push("october")
    }
    if (v == "11") {
      this.welfareViewDate.push("november")
    }
    if (v == "12") {
      this.welfareViewDate.push("december")
    }
  }

  toMoney3(value: string) {
    return this._decimalPipe
      .transform(value, "1.2-2")!;
  }
  calWelfare2() {
    let body: any = {
      "welId": this.__wf__mcomplain$welid$01,
      "employeeId": this.token.employeeid,
      "cost": "0.00",
      "gainerId": "",
      "occurDate": new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2),
      "degreeId": "",
      "requisId": "",
      "siteWelId": "",
      "reqCost": "",
      "reqType": "",
      "terminal": "",
      "siteWelgId": "",
      "recNo": "1",
      "refNo": "",
      "isFullLimit": "",
      "major": "",
      "encourage": "",
      "requisgId": "",
      "jobGradeId": "",
      "budMonth": "",
      "budYear": "",
      "startDate": "",
      "endDate": "",
      "disId": "",
      "roomBoardDay": "0",
      "roomBoardExpenses": "0",
      "roomBoardSum": "0",
      "visitDay": "0",
      "visitExpenses": "0",
      "visitSum": "0",
      "surgicalExpenses": "0",
      "generalExpenses": "0",
      "totalCost": "0",
      "cost1002": "0",
      "cost1003": "0",
      "cost1004": "0",
      "cost1005": "0"
    }
    this.workflowService.checkRequisition(body).then((result) => {
      this.__wf__mcomplain$amountrealmoney$01 = this.coverStringToNumber(result.amountPerTime).toString()
      this.cost = this.coverStringToNumber(result.limit)
      this.__wf__totalmoney = result.amountPerTime
      this.cdr.markForCheck()
    })
  }
  calWelfare() {
    let body: any = {
      "welId": this.__wf__mcomplain$welid$01,
      "employeeId": this.token.employeeid,
      "cost": Number(this.__wf__mcomplain$amountmoney$01.split(",").join("")).toString(),
      "gainerId": "",
      "occurDate": this.parserFormat.format(this.__wf__mcomplain$datebill$01).split("/").reverse().join("-"),
      "degreeId": "",
      "requisId": "",
      "siteWelId": "",
      "reqCost": Number(this.__wf__mcomplain$amountmoney$01.split(",").join("")).toString(),
      "reqType": "",
      "terminal": "",
      "siteWelgId": "",
      "recNo": "1",
      "refNo": "",
      "isFullLimit": "",
      "major": "",
      "encourage": "",
      "requisgId": "",
      "jobGradeId": "",
      "budMonth": "",
      "budYear": "",
      "startDate": "",
      "endDate": "",
      "disId": "",
      "roomBoardDay": "0",
      "roomBoardExpenses": "0",
      "roomBoardSum": "0",
      "visitDay": "0",
      "visitExpenses": "0",
      "visitSum": "0",
      "surgicalExpenses": "0",
      "generalExpenses": "0",
      "totalCost": "0",
      "cost1002": "0",
      "cost1003": "0",
      "cost1004": "0",
      "cost1005": "0"
    }
    this.workflowService.checkRequisition(body).then((result) => {
      if (result.status == "true") {
        this.msg = this.translateService.currentLang == 'th' ? 'สามารถเบิกได้' : 'Can request.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
        this.resultstatus = true
      } else {
        this.msg = this.translateService.currentLang == 'th' ?
          this.__wf__weldesc01.tdesc + " ไม่สามารถเบิกได้ <br> ยอดที่ขอเบิก = " + this.numberWithCommas(this.__wf__mcomplain$amountmoney$01) +
          "<br>ยอดสวัสดิการ = " + this.toMoney3(result.limit) +
          "<br>ยอดที่เบิกไปแล้ว = " + this.toMoney3(result.used) +
          "<br>ยอดคงเหลือ = " + this.toMoney3(result.remain) +
          "<br>ยอดเบิกต่อครั้ง = " + this.toMoney3(result.amountPerTime) +
          "<br>ยอดเบิกเกินครั้งนี้ = " + this.toMoney3(((parseFloat(this.__wf__mcomplain$amountmoney$01.replace(',','')) + parseFloat(result.used)) - parseFloat(result.limit)).toString())
          : this.__wf__weldesc01.edesc + " Can't request.<br>Request Amount = " + this.__wf__mcomplain$amountmoney$01 +
          "<br>Welfare Amount = " + this.toMoney3(result.limit) +
          "<br>Withdrawn Amount = " + this.toMoney3(result.used) +
          "<br>Remail Amount = " + this.toMoney3(result.remain) +
          "<br>Amount per Times = " + this.toMoney3(result.amountPerTime) +
          "<br>Excess Amount = " + this.toMoney3(((parseFloat(this.__wf__mcomplain$amountmoney$01.replace(',','')) + parseFloat(result.used)) - parseFloat(result.limit)).toString())
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
        this.resultstatus = false
      }
      this.__wf__mcomplain$amountrealmoney$01 = this.coverStringToNumber(result.amountPerTime).toString()
      this.cdr.markForCheck()
    })
  }

  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  toMoney() {
    this.__wf__mcomplain$amountmoney$01 = this.__wf__mcomplain$amountmoney$01.indexOf(".") == 0 ? "0" + this.__wf__mcomplain$amountmoney$01 : this.__wf__mcomplain$amountmoney$01
    if (this.__wf__mcomplain$amountmoney$01.indexOf(".") == -1) {
      this.__wf__mcomplain$amountmoney$01 = this._decimalPipe
        .transform(this.__wf__mcomplain$amountmoney$01, "1.2-2")!;
    }
    else {
      this.__wf__mcomplain$amountmoney$01 = this._decimalPipe
        .transform(this.__wf__mcomplain$amountmoney$01, "1.2-2")!;
    }
    this.__wf__mcomplain$amountmoney$01 = this.__wf__mcomplain$amountmoney$01 == ".00" ? "0.00" : this.__wf__mcomplain$amountmoney$01

  }

  toMoney2() {
    this.__wf__mcomplain$amountmoney$01 = this._decimalPipe
      .transform(this.__wf__mcomplain$amountmoney$01, "1.2-2")!;
  }


  openModal(modal: string, name: string) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name == 'modalCC') {

    }
    if (name == "contentEmp") {

    }
    if (name == "modalWelfare") {
      this.welfareListsSearch = ""
      this.welfareListsShow = this.welfareLists
      this.collectionSizeModal = this.welfareListsShow!.length
    }
    if (name == "modalFamily") {
      this.familyListsSearch = ""
      this.familyListsShow = this.familyLists
      this.collectionSizeModal = this.familyListsShow!.length
    }
    if (name == "modalLocation") {
      this.sitewelListsSearch = ""
      this.sitewelListsShow = this.sitewelLists
      this.collectionSizeModal = this.sitewelListsShow!.length
    }
    if (name == "modalRef") {

    }

    this.modalService.open(modal, { centered: true, size: 'lg' });
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
      windowClass: 'dialog-width'
    })
  }
  onCancel() {
    this.msg = this.translateService.currentLang == "th" ? 'คุณต้องการบันทึกข้อมูลหรือไม่?' : 'Do you want to save the data?'
    this.modalService.open(this.cancelModal, {
      centered: true,
      backdrop: 'static'
    })
  }

  checkDate() {
    this.validDate = false;
    let datecheck = new Date(this.__wf__mcomplain$datebill$01.year + "," + this.__wf__mcomplain$datebill$01.month + "," + this.__wf__mcomplain$datebill$01.day)
    datecheck.setDate(datecheck.getDate() + 60);
    console.log("datecheck", datecheck)
    if (datecheck < new Date()) {
      this.msg = 'ไม่สามารถบันทึกได้ เนื่องจากขอเบิกสวัสดิการเกิน 60 วัน'
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
      this.validDate = true;
    } else {
      if (new Date() > new Date((this.__wf__mcomplain$datebill$01.year + 1) + "," + "1" + "," + "31")) {
        this.msg = 'ไม่สามารถบันทึกได้ เนื่องจากขอเบิกเกินวันที่ 31/01/' + (this.__wf__mcomplain$datebill$01.year + 1)
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        })
        this.validDate = true;
      }
    }
    let dateSent = new Date(this.__wf__mcomplain$datesent$01.year + "," + this.__wf__mcomplain$datesent$01.month + "," + this.__wf__mcomplain$datesent$01.day);
    if (new Date(this.__wf__mcomplain$datebill$01.year + "," + this.__wf__mcomplain$datebill$01.month + "," + this.__wf__mcomplain$datebill$01.day) > dateSent) {
      this.msg = 'ไม่สามารถบันทึกได้ วันที่ใบเสร็จไม่ควรเกินกว่าวันที่ส่ง'
      this.modalService.open(this.alertModal, {
        centered: true,
        backdrop: 'static'
      })
      this.validDate = true;
    }

  }
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
}
