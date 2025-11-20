import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyWelfare, Welfare } from 'src/app/models/Welfare.model';
import { WorkAreaModel } from 'src/app/models/workareamodel.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { workflowService } from 'src/app/services/workflow.service';
import { AlertModalComponent } from '../../alert-modal/alert-modal.component';
import { CurrencyModel } from 'src/app/models/currency.model';
import { DecimalPipe, Location } from '@angular/common';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { WelfareOffsiteDetailComponent } from '../welfare-offsite-detail/welfare-offsite-detail.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
import { WorkflowAttachFileMultiComponent } from '../../workflow-attach-file-multi/workflow-attach-file-multi.component';
import { WorkflowEmpInformationComponent } from '../../workflow-emp-information/workflow-emp-information.component';
@Component({
  selector: 'app-welfare-offsite-create',
  templateUrl: './welfare-offsite-create.component.html',
  styleUrls: ['./welfare-offsite-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    WorkflowAttachFileMultiComponent,
    WorkflowEmpInformationComponent,
  ]
})
export class WelfareOffsiteCreateComponent implements OnInit {
  @ViewChild('alertModal') alertModal: undefined
  active = 1;
  activeKeep = 1;
  activeSelected = 1;

  pageModal = 0
  pageSizeModal = 10
  collectionSizeModal = 0

  wfid: any
  runno: string | undefined
  employeeCCId = ""
  empInformation: WorkingsModel = new MyWorkingsModel({}, this.translateService)

  maxDate= new NgbDate(new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDate())

  currentDate = new Date()


  welfareLists: Welfare[] = []
  searchWelfare =""


  workAreaList: WorkAreaModel[] = []
  searchWorkArea = ""
  welfareFormList = [{
    isCollapsed: false,
    locationCode: '',
    location: '',
    workDescription: '',
    projectCode: '',
    startDate: new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate()),
    startTime: '00:00',
    endDate: new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate()),
    endTime: '00:00',
    days: '0',
    hours: '0',

    datesent:new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate()),
    datebill:new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate()),
    numberbill:'',

    welfareId: "",
    welfareName: "",

    oil: false,
    room: false,
    expressway_etc: false,
    reserve_payment: false,
    currency: false,

    oil_prices:0,
    oil_number_km:0,
    oil_prices_withdraw:0,

    room_prices:0,
    room_number_days:0,
    room_number_withdraw:0,

    expressway_etc_cost : 0,
    expressway_etc_remark: "",
    expressway_etc_cost_withdraw : 0,

    reserve_payment_cost: 0,
    reserve_payment_cost_withdraw: 0,

    currency_rateId: "",
    currency_rate: "",
    currency_bath: 0,
    currency_cost: 0,

    reqcost: 0,
    cost:0,
    cost_total:0,

    timestampFile: '',
    nameFile: "browse_file",
    nameFileUpload:""
}];
  costOther = 0
  indexWelfare = 0
  timestampFile: any
  nameFile = "browse_file"
  remark=''
  currencyList:CurrencyModel[] = []
  searchCurrency = ""
  workflowData: any
  inputs = {
    data: {},
  };
  referenceParam = ""
  re = /\//gi;
  total = 0
  checkCal = true
  costBalance = 0
  token = JSON.parse(sessionStorage.getItem('currentUser')!)

    msg={
      success:[{}],
      fail:[{}]
    }
    screenObj: any
    dynamicComponent: any
    calculateWord = {
      th: 'กรุณากดปุ่ม"คำนวณ"ก่อนส่ง',
      en: 'Please press "Calculate" before submit.'
    }
    private timeChangeSubject: Subject<{ type: string, index: number }> = new Subject();
    nameFileUpload:string=""
  constructor(
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    public translateService: TranslateService,
    private workflowService: workflowService,
    private local: Location,
    private _decimalPipe: DecimalPipe,
    private parserFormat: NgbDateParserFormatter,
    public datepickerService: DatepickerNgbService,
  ) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })
    if (this.runno) {
      this.setScreenValue()
    }
    this.timeChangeSubject
      .pipe(debounceTime(300)) // หน่วงเวลา 300ms ก่อนเรียก timeChange
      .subscribe(({ type, index }) => {
        this.executeTimeChange(type, index);
      });
   }


  ngOnInit(): void {
    this.getWelfareLists();
    this.getWorkAreaLists();
    this.getCurrency();
  }
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe(result => {
      this.screenObj = result.workflowData.screen_value;
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }
      this.inputs.data = result
      this.dynamicComponent = WelfareOffsiteDetailComponent

      this.welfareFormList=[]
      for (let i = 0; i < Number(this.workflowData.screen_value.__wf__last_record); i++) {
        this.welfareFormList.push({
          isCollapsed: false,
          locationCode: this.workflowData.screen_value["__wf__sitewelid$"+(i+1)],
          location: this.workflowData.screen_value["__wf__siteweldesc$"+(i+1)],
          workDescription: this.workflowData.screen_value["__wf__responsibilitie$"+(i+1)],
          projectCode: this.workflowData.screen_value["__wf__projectid$"+(i+1)],
          startDate: new NgbDate(
            parseInt(this.workflowData.screen_value["__wf__start_date$"+(i+1)].split("-")[0]),
            parseInt(this.workflowData.screen_value["__wf__start_date$"+(i+1)].split("-")[1]),
            parseInt(this.workflowData.screen_value["__wf__start_date$"+(i+1)].split("-")[2])
          ),
          startTime: this.workflowData.screen_value["__wf__start_time$"+(i+1)].replace('.', ':'),
          endDate: new NgbDate(
            parseInt(this.workflowData.screen_value["__wf__end_date$"+(i+1)].split("-")[0]),
            parseInt(this.workflowData.screen_value["__wf__end_date$"+(i+1)].split("-")[1]),
            parseInt(this.workflowData.screen_value["__wf__end_date$"+(i+1)].split("-")[2])
          ),
          endTime: this.workflowData.screen_value["__wf__end_time$"+(i+1)].replace('.', ':'),
          days: this.workflowData.screen_value["__wf__days$"+(i+1)],
          hours: this.workflowData.screen_value["__wf__hours$"+(i+1)],

          datesent:this.workflowData.screen_value["__wf__datesent$"+(i+1)],
          datebill:this.workflowData.screen_value["__wf__datebill$"+(i+1)],
          numberbill:this.workflowData.screen_value["__wf__numberbill$"+(i+1)],

          welfareId: this.workflowData.screen_value["__wf__welid$" + (i + 1)],
          welfareName: this.workflowData.screen_value["__wf__weldesc$" + (i + 1)],

          oil:this.workflowData.screen_value["__wf__oil$" + (i + 1)] == '1'?true:false,
          room:this.workflowData.screen_value["__wf__room$" + (i + 1)]== '1'?true:false,
          expressway_etc:this.workflowData.screen_value["__wf__expressway_etc$" + (i + 1)]== '1'?true:false,
          reserve_payment:this.workflowData.screen_value["__wf__reserve_payment$" + (i + 1)]== '1'?true:false,
          currency:this.workflowData.screen_value["__wf__currency$" + (i + 1)]== '1'?true:false,

          oil_prices:this.coverStringToNumber(this.workflowData.screen_value["__wf__oil_prices$" + (i+1)]),
          oil_number_km:this.coverStringToNumber(this.workflowData.screen_value["__wf__oil_number_km$" + (i+1)]),
          oil_prices_withdraw:this.coverStringToNumber(this.workflowData.screen_value["__wf__oil_total$" + (i+1)]),

          room_prices:this.coverStringToNumber(this.workflowData.screen_value["__wf__room_prices$" + (i+1)]),
          room_number_days:this.coverStringToNumber(this.workflowData.screen_value["__wf__room_number_days$" + (i+1)]),
          room_number_withdraw:this.coverStringToNumber(this.workflowData.screen_value["__wf__room_total$" + (i+1)]),

          expressway_etc_cost : this.coverStringToNumber(this.workflowData.screen_value["__wf__expressway_etc_cost$" + (i+1)]),
          expressway_etc_remark: this.workflowData.screen_value["__wf__expressway_etc_remark$" + (i+1)],
          expressway_etc_cost_withdraw : this.coverStringToNumber(this.workflowData.screen_value["__wf__expressway_etc_cost_total$" + (i+1)]),

          reserve_payment_cost: this.coverStringToNumber(this.workflowData.screen_value["__wf__reserve_payment_cost$" + (i+1)]),
          reserve_payment_cost_withdraw: this.coverStringToNumber(this.workflowData.screen_value["__wf__reserve_payment_cost_total$" + (i+1)]),

          currency_rateId: this.workflowData.screen_value["__wf__currency_foreign$" + (i+1)],
          currency_rate: this.workflowData.screen_value["__wf__currency_rate$" + (i+1)],
          currency_bath: this.coverStringToNumber(this.workflowData.screen_value["__wf__currency_bath$" + (i+1)]),
          currency_cost: this.coverStringToNumber(this.workflowData.screen_value["__wf__currency_costtotal$" + (i+1)]),

          reqcost: this.coverStringToNumber(this.workflowData.screen_value["__wf__reqcost$" + (i+1)]),
          cost_total:this.coverStringToNumber(this.workflowData.screen_value["__wf__cost_total$" + (i+1)]),
          cost:this.coverStringToNumber(this.workflowData.screen_value["__wf__cost$" + (i+1)]),

          timestampFile:this.workflowData.screen_value["__wf__timestampfile$" + (i+1)],
          nameFile: this.workflowData.screen_value["__wf__nameFileUpload$" + (i+1)],
          nameFileUpload: this.workflowData.screen_value["__wf__nameFileUpload$" + (i+1)],

        })
          this. nameFileUpload = this.workflowData.screen_value["nameFileUpload"]
      }
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })
  }
  toggleSection(section: any) {
    section.isCollapsed = !section.isCollapsed;
  }
  addList(){
    this.welfareFormList.push({
      isCollapsed: false,
      locationCode: '',
      location: '',
      workDescription: '',
      projectCode: '',
      startDate: new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate()),
      startTime: '00:00',
      endDate: new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate()),
      endTime: '00:00',
      days: '0',
      hours: '0',

      datesent:new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate()),
      datebill:new NgbDate(this.currentDate.getFullYear(),this.currentDate.getMonth() + 1,this.currentDate.getDate()),
      numberbill:'',

      welfareId: "",
      welfareName: "",

      oil: false,
      room: false,
      expressway_etc: false,
      reserve_payment: false,
      currency: false,

      oil_prices:0,
      oil_number_km:0,
      oil_prices_withdraw:0,

      room_prices:0,
      room_number_days:0,
      room_number_withdraw:0,

      expressway_etc_cost : 0,
      expressway_etc_remark: "",
      expressway_etc_cost_withdraw : 0,

      reserve_payment_cost: 0,
      reserve_payment_cost_withdraw: 0,

      currency_rateId: "",
      currency_rate: "",
      currency_bath: 0,
      currency_cost: 0,

      reqcost: 0,
      cost_total:0,
      cost:0,
      timestampFile: '',
      nameFile: "browse_file",
      nameFileUpload:''
    })
    this.checkCal = true
  }
  removeList(index: number){
    this.welfareFormList.splice(index, 1)
    this.checkCal = true
  }
  getWorkAreaLists() {
    this.empService.getWorkAreaLists().then(response => {
      this.workAreaList = response.map(x => new WorkAreaModel(x, this.translateService))
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
      this.cdr.markForCheck()
    })
  }
  filterWorkArea() {
    return this.workAreaList.filter(x => x.tdesc.toLowerCase().includes(this.searchWorkArea.toLowerCase()) ||x.edesc.toLowerCase().includes(this.searchWorkArea.toLowerCase()) || x.workareaId.toLowerCase().includes(this.searchWorkArea.toLowerCase()))
  }

  findDataWorkArea(index: number) {
    let data = this.workAreaList!.find(x => x.workareaId == this.welfareFormList[index].locationCode)
    if(data){
      this.welfareFormList[index].locationCode = new WorkAreaModel({...data,workareaId:this.welfareFormList[index].locationCode}, this.translateService).workareaId;
      this.welfareFormList[index].location = new WorkAreaModel({...data,workareaId:this.welfareFormList[index].locationCode}, this.translateService).getDesc();
    }else{
      this.welfareFormList[index].locationCode = new WorkAreaModel({workareaId:this.welfareFormList[index].locationCode}, this.translateService).workareaId;
      this.welfareFormList[index].location = ''
    }
  }
  selectWorkArea(item: WorkAreaModel) {
    this.welfareFormList[this.indexWelfare].locationCode = item.workareaId
    this.welfareFormList[this.indexWelfare].location = item.getDesc()
  }
  getWelfareLists() {
    this.workflowService.getWelfareLists().then((result) => {
      this.welfareLists = result.map(e => new MyWelfare(e, this.translateService)).sort((a: Welfare, b: Welfare) => a.welId! > b.welId! ? 1 : -1)
      this.welfareLists = this.welfareLists.filter(item => item.welId !== 'WFM001' && item.welId !== 'WFM002');
      this.cdr.markForCheck()
    })
  }

  filterWelfareLists() {
    return this.welfareLists!.filter((x: Welfare) => x.welId!.toLowerCase().includes(this.searchWelfare.toLowerCase())||x.tdesc?.toLowerCase().includes(this.searchWelfare.toLowerCase())||x.edesc?.toLowerCase().includes(this.searchWelfare.toLowerCase()));
  }
  findDataWelfare(index: number) {
    let data = this.welfareLists!.find(x => x.welId == this.welfareFormList[index].welfareId)
    if(data){
      this.welfareFormList[index].welfareId = new MyWelfare({...data,welId:this.welfareFormList[index].welfareId}, this.translateService).welId;
      this.welfareFormList[index].welfareName = new MyWelfare({...data,welId:this.welfareFormList[index].welfareId}, this.translateService).getWelfareDesc();
    }else{
      this.welfareFormList[index].welfareId = new MyWelfare({welId:this.welfareFormList[index].welfareId}, this.translateService).welId;
      this.welfareFormList[index].welfareName = ''
    }
  }
  selectWelfare(item: MyWelfare) {
    this.welfareFormList[this.indexWelfare].welfareId = item.welId
    this.welfareFormList[this.indexWelfare].welfareName = item.getWelfareDesc()

    this.calWelfare2()
  }

    calWelfare2() {
      let dateCal = this.welfareFormList[this.indexWelfare].days
      if(this.welfareFormList[this.indexWelfare].welfareId == "WFM008" ){
        if(Number(this.welfareFormList[this.indexWelfare].hours) >= 24){
          dateCal = Math.round(Number(this.welfareFormList[this.indexWelfare].hours) / 24).toString()
        }
      }
    let body: any = {
      "welId":  this.welfareFormList[this.indexWelfare].welfareId,
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
      "cost1005": "0",
      "oil_number_km": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].oil_number_km),
      "oil_prices": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].oil_prices),
      "oil_prices_withdraw": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].oil_prices_withdraw),
      "room_prices": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].room_prices),
      "room_days": dateCal,
      "room_number_withdraw": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].room_number_withdraw),
      "expressway_etc_cost": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].expressway_etc_cost),
      "expressway_etc_cost_withdraw": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].expressway_etc_cost_withdraw),
      "reserve_payment_cost": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].reserve_payment_cost),
      "reserve_payment_cost_withdraw": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].reserve_payment_cost_withdraw),
      "currency_bath": this.coverStringToNumber(this.welfareFormList[this.indexWelfare].currency_bath),
      "currency_rateId": (this.welfareFormList[this.indexWelfare].currency_rateId),
      "currency": (this.welfareFormList[this.indexWelfare].currency),
      "currency_cost": (this.welfareFormList[this.indexWelfare].currency_cost)
    }
    this.workflowService.checkRequisition(body).then((result) => {
      this.welfareFormList[this.indexWelfare].cost = this.coverStringToNumber(result.amountPerTime)
      this.welfareFormList[this.indexWelfare].cost_total = this.coverStringToNumber(result.limit)
      if(this.welfareFormList[this.indexWelfare].welfareId == "WFM008" ){
        this.welfareFormList[this.indexWelfare].reqcost = this.coverStringToNumber(result.amountPerTime)

      }
      // this.__wf__totalmoney = result.limit
      this.calCostToCostTotalAll()
      this.cdr.markForCheck()
    })
  }
  checkCostWelfare(){
    // const combinedWelfare = this.welfareFormList.reduce((acc:any, current:any) => {
    //   const found = acc.find((item:any) => item.welfareId === current.welfareId);
    //   if (found) {
    //     found.toTalreqcost = this.coverStringToNumber(found.reqcost) + this.coverStringToNumber(current.reqcost);
    //   } else {
    //     acc.push({ ...current, toTalreqcost: this.coverStringToNumber(current.reqcost) });
    //   }
    //   return acc;
    // }, []);
    // console.log(combinedWelfare);
    // const reqcostCheck = combinedWelfare.every((item:any) => item.toTalreqcost <= item.cost_total);
    // if ( reqcostCheck) {
    //   this.calWelfare()
    // } else {
    //   this.openAlertModal(this.translateService.currentLang == "th" ? 'ไม่สามารถเบิกได้เนื่องจากเบิกสวัสดิการเกินยอดคงเหลือ' :'Expenses cannot be reimbursed because the welfare limit is insufficient.' )
    // }
    this.calWelfare()
  }

  async calWelfare() {
    this.msg = {
      success:[],
      fail:[]
    }
    for (const [index, item] of this.welfareFormList.entries()) {
      let dateCal = item.days
      if(item.welfareId == "WFM008" ){
        if(Number(item.hours) >= 24){
          dateCal = Math.round(Number(item.hours) / 24).toString()
        }
      }
      let body: any = {
        "welId": item.welfareId,
        "employeeId": this.token.employeeid,
        "cost": this.coverStringToNumber(item.reqcost).toString(),
        "gainerId": "",
        "occurDate": this.parserFormat.format(item.startDate).split("/").reverse().join("-"),
        "degreeId": "",
        "requisId": "",
        "siteWelId": "",
        "reqCost": this.coverStringToNumber(item.reqcost).toString(),
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
        "cost1005": "0",
        "oil_number_km": this.coverStringToNumber(item.oil_number_km).toString(),
        "oil_prices": this.coverStringToNumber(item.oil_prices).toString(),
        "oil_prices_withdraw": this.coverStringToNumber(item.oil_prices_withdraw).toString(),
        "room_prices": this.coverStringToNumber(item.room_prices).toString(),
        "room_days": (dateCal).toString(),
        "room_number_withdraw": this.coverStringToNumber(item.room_number_withdraw).toString(),
        "expressway_etc_cost": this.coverStringToNumber(item.expressway_etc_cost).toString(),
        "expressway_etc_cost_withdraw": this.coverStringToNumber(item.expressway_etc_cost_withdraw).toString(),
        "reserve_payment_cost": this.coverStringToNumber(item.reserve_payment_cost).toString(),
        "reserve_payment_cost_withdraw": this.coverStringToNumber(item.reserve_payment_cost_withdraw).toString(),
        "currency_bath": this.coverStringToNumber(item.currency_bath).toString(),
        "currency_rateId": (item.currency_rateId).toString(),
        "currency": (item.currency).toString(),
        "currency_cost": (item.currency_cost).toString()
      };
      try {
        const result = await this.workflowService.checkRequisition(body);
        item.cost = result.amountPerTime;
        if(item.welfareId == "WFM008" ){
          item.reqcost = result.amountPerTime
        }
        if (result.status == "true") {
          this.msg.success.push(this.translateService.currentLang == 'th' ? (item.welfareName) :(item.welfareName ));
          this.checkCal = false
        } else {
          this.msg.fail.push(
            this.translateService.currentLang == 'th'
              ? item.welfareName +
                "<br> ยอดที่ขอเบิก = " + this.numberWithCommas(item.reqcost) +
                "<br>ยอดสวัสดิการ = " + this.toMoney3(result.limit) +
                "<br>ยอดที่เบิกไปแล้ว = " + this.toMoney3(result.used) +
                "<br>ยอดคงเหลือ = " + this.toMoney3(result.remain) +
                "<br>ยอดเบิกต่อครั้ง = " + this.toMoney3(result.amountPerTime) +
                "<br>ยอดเบิกเกินครั้งนี้ = " + this.toMoney3(((this.coverStringToNumber(item.reqcost)+parseFloat(result.used)) - parseFloat(result.limit)).toString())
              : item.welfareName +
                "<br>Request Amount = " + item.reqcost +
                "<br>Welfare Amount = " + this.toMoney3(result.limit) +
                "<br>Withdrawn Amount = " + this.toMoney3(result.used) +
                "<br>Remail Amount = " + this.toMoney3(result.remain) +
                "<br>Amount per Times = " + this.toMoney3(result.amountPerTime) +
                "<br>Excess Amount = " + this.toMoney3(((this.coverStringToNumber(item.reqcost)+parseFloat(result.used)) - parseFloat(result.limit)).toString())
          );

        this.checkCal = this.checkCal || (result.status === "false");
        }
        if(this.welfareFormList.length === (index + 1)){
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
        }
        this.cdr.markForCheck();
      } catch (error) {
        console.error("Error with requisition check:", error);
      }
    }
  }


  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  toMoney3(value: string) {
    return this._decimalPipe
      .transform(value, "1.2-2")!;
  }
  getCurrency(){
    this.workflowService.getCurrency().subscribe((result) => {
      this.currencyList = result.map(e => new CurrencyModel(e, this.translateService))
    })
  }
  filterCurrencyList() {
    return this.currencyList!.filter((x: CurrencyModel) => x.currencyId!.toLowerCase().includes(this.searchCurrency.toLowerCase()));
  }
  selectCurrency(item: CurrencyModel) {
    this.welfareFormList[this.indexWelfare].currency_rateId = item.currencyId
    this.welfareFormList[this.indexWelfare].currency_rate = item.exchange
    this.calCurrency(this.indexWelfare)

  }
  formatYYYY_MM_DD(date: Date) {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    }

  fmtStr = (s: string | number): string => {
    const num = parseFloat(s.toString().replace(/,/g, ''));
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }
  onSubmit() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
    modalRef.result.then(result => {
      let screenObj:any = {};
      let listRecord = ''
      let listFile:Number[] = []
      screenObj["__wf__employeeid"] = this.empInformation.employeeId;
      screenObj["__wf__fullname"] = this.empInformation.getFullname();
      screenObj["__wf__position"] = this.empInformation.position?.tdesc;
      screenObj["__wf__bu1"] = this.empInformation.bu1?.tdesc;
      screenObj["__wf__bu2"] = this.empInformation.bu2?.tdesc;
      screenObj["__wf__bu3"] = this.empInformation.bu3?.tdesc;
      screenObj["__wf__bu4"] = this.empInformation.bu4?.tdesc;
      screenObj["__wf__bu5"] = this.empInformation.bu5?.tdesc;
      screenObj["__wf__ext"] = this.empInformation.telExt;

      screenObj["__wf__mr.a"] = this.empInformation.telExt;


      this.welfareFormList.forEach((item, index) => {
      listRecord = listRecord + ',' + index+1;
      if(item.timestampFile){
        listFile = listFile.concat(Number(item.timestampFile))
      }
      // สถานที่
      screenObj["__wf__sitewelid$" + (index+1)] = item.locationCode;
      screenObj["__wf__siteweldesc$" + (index+1)] = item.location;
      // งานที่รับผิดชอบ/งานที่ปฏิบัติ
      screenObj["__wf__responsibilitie$" + (index+1)] = item.workDescription;
      // หมายเลขโครงการที่ปฏิบัติ
      screenObj["__wf__projectid$" + (index+1)] = item.projectCode;

      screenObj["__wf__start_date$" + (index+1)] = this.parserFormat.format(item.startDate).replace(this.re, '-').split("-").reverse().join("-");
      screenObj["__wf__end_date$" + (index+1)] = this.parserFormat.format(item.endDate).replace(this.re, '-').split("-").reverse().join("-");
      screenObj["__wf__start_time$" + (index+1)] = item.startTime.replace(':','.');
      screenObj["__wf__end_time$" + (index+1)] =  item.endTime.replace(':','.');
      screenObj["__wf__days$" + (index+1)] =  item.days;
      screenObj["__wf__hours$" + (index+1)] =  item.hours;

        screenObj["__wf__caseid$" + (index+1)] = index+1;

        screenObj["__wf__welid$" + (index+1)] = item.welfareId;
        screenObj["__wf__weldesc$" + (index+1)] = item.welfareName;
        // วันที่ส่ง
        screenObj["__wf__datesent$" + (index+1)] =this.parserFormat.format(item.datesent).replace(this.re, '-').split("-").reverse().join("-");
        // วันที่ใบเสร็จ
        screenObj["__wf__datebill$" + (index+1)] =this.parserFormat.format(item.datebill).replace(this.re, '-').split("-").reverse().join("-"); ;
        // เลขที่ใบเสร็จ
        screenObj["__wf__numberbill$" + (index+1)] = item.numberbill ;
        // น้ำมัน
        screenObj["__wf__oil$" + (index+1)] = item.oil == true ? '1' : '0';
        screenObj["__wf__oil_prices$" + (index+1)] = this.fmtStr(item.oil_prices);
        screenObj["__wf__oil_number_km$" + (index+1)] = this.fmtStr(item.oil_number_km);
        screenObj["__wf__oil_total$" + (index+1)] = this.fmtStr(item.oil_prices_withdraw);

        // ค่าที่พัก
        screenObj["__wf__room$" + (index+1)] = item.room == true ? '1' : '0';
        screenObj["__wf__room_prices$" + (index+1)] = this.fmtStr(item.room_prices);
        screenObj["__wf__room_number_days$" + (index+1)] = item.room_number_days.toString();
        screenObj["__wf__room_total$" + (index+1)] = this.fmtStr(item.room_number_withdraw);

        // ค่าทางด่วน
        screenObj["__wf__expressway_etc$" + (index+1)] = item.expressway_etc == true ? '1' : '0';
        screenObj["__wf__expressway_etc_cost$" + (index+1)] = this.fmtStr(item.expressway_etc_cost);
        screenObj["__wf__expressway_etc_remark$" + (index+1)] = item.expressway_etc_remark;
        screenObj["__wf__expressway_etc_cost_total$" + (index+1)] = this.fmtStr(item.expressway_etc_cost_withdraw);

        // สำรองจ่าย
        screenObj["__wf__reserve_payment$" + (index+1)] = item.reserve_payment == true ? '1' : '0';
        screenObj["__wf__reserve_payment_cost$" + (index+1)] = this.fmtStr(item.reserve_payment_cost);
        screenObj["__wf__reserve_payment_cost_total$" + (index+1)] = this.fmtStr(item.reserve_payment_cost_withdraw);

        // ค่าเงินต่างประเทศ
        screenObj["__wf__currency$" + (index+1)] = item.currency == true ? '1' : '0';
        screenObj["__wf__currency_bath$" + (index+1)] = this.fmtStr(item.currency_bath);
        screenObj["__wf__currency_foreign$" + (index+1)] = item.currency_rateId;
        screenObj["__wf__currency_rate$" + (index+1)] = this.fmtStr(item.currency_rate);
        screenObj["__wf__currency_costtotal$" + (index+1)] = this.fmtStr(item.currency_cost);

        // ยอดเงิน
        screenObj["__wf__reqcost$" + (index+1)] = this.fmtStr(item.reqcost);
        screenObj["__wf__cost$" + (index+1)] = this.fmtStr(item.cost);
        screenObj["__wf__cost_total$" + (index+1)] = this.fmtStr(item.cost_total);

        screenObj["__wf__namefile$" + (index+1)] = item.nameFile;
        screenObj["__wf__timestampfile$" + (index+1)] = item.timestampFile;
        screenObj["__wf__nameFileUpload$" + (index+1)] = item.nameFileUpload;
      })

        screenObj["__wf__last_record"] = this.welfareFormList.length;
        screenObj["__wf__list_record"] = listRecord;
        screenObj["timestampFile"] = this.timestampFile;
        screenObj["attach_time"] = this.timestampFile;
        screenObj["nameFileUpload"] = this.nameFileUpload;
        screenObj["__wf__remark"] = this.remark;


      const token = JSON.parse(sessionStorage.getItem('currentUser')!)
      const body = {
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
      console.log("🚀 ~ WelfareOffsiteCreateComponent ~ onSubmit ~ body:", body)
      this.workflowService.createWF(body).subscribe(result => {
        if (result) {
          if (this.runno) {
            this.cancelWF();
          }
          this.local.back();
        } else {
          this.openAlertModal(this.translateService.currentLang == "th" ? "ไม่สามารถสร้างเอกสารได้" : "Can not create workflow.")
        }
      }, error => {
        this.openAlertModal(error.message)
      })
    }, reject => { })

  }
  cancelWF() {
    this.workflowService.cancelWF(this.workflowData).subscribe(
      (result: any) => {
        this.runno = undefined
        this.closeBtnClick()
      }
    );
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
  }

  clearValue(type:string,value:boolean,index: number) {
    if(!value&&type == 'currency'){
      this.welfareFormList[index].currency_rate = "",
      this.welfareFormList[index].currency_rateId = "",
      this.welfareFormList[index].currency_bath = 0,
      this.welfareFormList[index].currency_cost =  0
    }
    if(!value&&type == 'payment'){
      this.welfareFormList[index].reserve_payment_cost = 0
      this.welfareFormList[index].reserve_payment_cost_withdraw = 0
    }
    if(!value&&type == 'expressway'){
      this.welfareFormList[index].expressway_etc_cost = 0
      this.welfareFormList[index].expressway_etc_cost_withdraw = 0
      this.welfareFormList[index].expressway_etc_remark = ""
    }
    if(!value&&type == 'room'){
      this.welfareFormList[index].room_prices = 0
      this.welfareFormList[index].room_number_withdraw = 0
    }
    if(!value&&type == 'oil'){
      this.welfareFormList[index].oil_prices = 0
      this.welfareFormList[index].oil_number_km = 0
      this.welfareFormList[index].oil_prices_withdraw = 0
    }
    this.calCostToCostTotalAll();
    this.checkCal = true
  }
  calTotalIndex(index: number){
    // this.calCostToCostTotalAll()
    if(this.welfareFormList[index].welfareId == "WFM008"){
      this.welfareFormList[index].reqcost = this.welfareFormList[index].cost
    } else{
      let sumvalue = this.welfareFormList[index].oil_prices_withdraw + this.welfareFormList[index].room_number_withdraw + this.welfareFormList[index].expressway_etc_cost_withdraw + this.welfareFormList[index].reserve_payment_cost_withdraw + this.welfareFormList[index].currency_cost
      if(this.welfareFormList[index].reqcost < sumvalue){
        this.welfareFormList[index].reqcost =  sumvalue
      }
    }
    this.checkCal = true
  }

  calCostToCostTotalAll(){
    this.welfareFormList.forEach(item => {
      if(item.welfareId != "WFM008"){
        item.reqcost = 0
        item.reqcost = item.oil_prices_withdraw + item.room_number_withdraw + item.expressway_etc_cost_withdraw + item.reserve_payment_cost_withdraw + item.currency_cost
      }
    })
  this.checkCal = false
  }
  coverStringToNumber(number: Number){
    return Number(String(number).replace(/,/g, ''))
  }
  calOil(index: number){
    this.welfareFormList[index].oil_prices_withdraw = this.coverStringToNumber(this.welfareFormList[index].oil_number_km) * this.coverStringToNumber(this.welfareFormList[index].oil_prices)
    this.calCostToCostTotalAll()
    this.checkCal = true
  }
  calRoom(index: number){
    this.welfareFormList[index].room_number_withdraw = this.coverStringToNumber(this.welfareFormList[index].room_prices) * (this.welfareFormList[index].room_number_days?Number(this.welfareFormList[index].room_number_days):0)
    this.calCostToCostTotalAll()
    this.checkCal = true
  }
  calExpressway(index: number){
    this.welfareFormList[index].expressway_etc_cost_withdraw = this.coverStringToNumber(this.welfareFormList[index].expressway_etc_cost)
    this.calCostToCostTotalAll()
    this.checkCal = true
  }
  calPayment(index: number){
    this.welfareFormList[index].reserve_payment_cost_withdraw = this.coverStringToNumber(this.welfareFormList[index].reserve_payment_cost)
    this.calCostToCostTotalAll()
    this.checkCal = true
  }
  calCurrency(index: number){
    this.welfareFormList[index].currency_cost = this.coverStringToNumber(this.welfareFormList[index].currency_bath)* (this.welfareFormList[index].currency_rate?Number(this.welfareFormList[index].currency_rate):0)
    this.calCostToCostTotalAll()
    this.checkCal = true
  }

  getTimeDifference(index: number) {

    let startDate = new Date(this.welfareFormList[index].startDate.year, this.welfareFormList[index].startDate.month - 1, this.welfareFormList[index].startDate.day,Number(this.welfareFormList[index].startTime.split(":")[0]),Number(this.welfareFormList[index].startTime.split(":")[1]));
    let endDate = new Date(this.welfareFormList[index].endDate.year, this.welfareFormList[index].endDate.month - 1, this.welfareFormList[index].endDate.day,Number(this.welfareFormList[index].endTime.split(":")[0]),Number(this.welfareFormList[index].endTime.split(":")[1]));


    let diffInMs = Math.abs(startDate.getTime() - endDate.getTime());
    let hoursDifference = Math.floor(diffInMs / (1000 * 60 * 60));

    // ตั้งเวลาให้เป็นเที่ยงคืนทั้งสองวัน
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    let timeDifference = endDate.getTime() - startDate.getTime();
    let daysDifference = timeDifference / (1000 * 60 * 60 * 24);


    this.welfareFormList[index].days = daysDifference.toString();
    this.welfareFormList[index].hours = hoursDifference.toString();
    this.welfareFormList[index].room_number_days = daysDifference;

    // if(this.welfareFormList[index].welfareId == "WFM008" ){
    //   if(Number(this.welfareFormList[index].hours) >= 24){
    //     this.welfareFormList[index].days = Math.round(Number(this.welfareFormList[index].hours) / 24).toString();
    //     this.welfareFormList[index].room_number_days = Math.round(Number(this.welfareFormList[index].hours) / 24)
    //   }
    // }


    this.calRoom(index)
}

timeChange(type: string, index: number) {
  this.timeChangeSubject.next({ type, index });
}
  executeTimeChange(type: string, index: number) {
    let startDate = new Date(this.welfareFormList[index].startDate.year, this.welfareFormList[index].startDate.month - 1, this.welfareFormList[index].startDate.day, Number(this.welfareFormList[index].startTime.split(":")[0]), Number(this.welfareFormList[index].startTime.split(":")[1]));
    let endDate = new Date(this.welfareFormList[index].endDate.year, this.welfareFormList[index].endDate.month - 1, this.welfareFormList[index].endDate.day, Number(this.welfareFormList[index].endTime.split(":")[0]), Number(this.welfareFormList[index].endTime.split(":")[1]));

    if(type == "start") {
      if(startDate.getTime() > endDate.getTime()) {
        this.welfareFormList[index].endTime = this.welfareFormList[index].startTime;
      }
    } else {
      if(endDate.getTime() < startDate.getTime()) {
        this.welfareFormList[index].startTime = this.welfareFormList[index].endTime;
      }
    }
    this.getTimeDifference(index);
  }
ckeckDate(type: string, index: number) {
  // let datesent = new Date(this.welfareFormList[index].datesent.year, this.welfareFormList[index].datesent.month - 1, this.welfareFormList[index].datesent.day);
  // let datebill = new Date(this.welfareFormList[index].datebill.year, this.welfareFormList[index].datebill.month - 1, this.welfareFormList[index].datebill.day);

  // if(type == "start") {
  //   if(datesent.getTime() > datebill.getTime()) {
  //      this.welfareFormList[index].datebill = this.welfareFormList[index].datesent;
  //   }
  // } else {
  //   if( datesent.getTime() < datebill.getTime() ) {
  //     this.welfareFormList[index].datebill = this.welfareFormList[index].datesent;
  //   }
  // }
}
  openModal(modal: string,name:string, index: number) {
    if(name == 'modalWelfare' || name == 'modalCurrency'|| name == 'modalLocation') {
      this.indexWelfare = index
    }
    this.searchWelfare = ''
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }


  openAlertModal(message?: string) {
    const modalRef = this.modalService.open(AlertModalComponent, {
        centered: true,
        backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
        this.modalService.dismissAll()
    }, (reason) => {
        this.modalService.dismissAll()
    })
}
}
