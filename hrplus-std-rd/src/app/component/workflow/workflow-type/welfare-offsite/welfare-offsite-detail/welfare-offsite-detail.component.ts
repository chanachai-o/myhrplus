import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { workflowService } from 'src/app/services/workflow.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core'; // Added
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
import { FormsModule } from '@angular/forms';
import { WorkflowEmpInformationComponent } from '../../workflow-emp-information/workflow-emp-information.component';
import { WorkflowDetailFooterComponent } from '../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-welfare-offsite-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule, // Added
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
  ],
  templateUrl: './welfare-offsite-detail.component.html',
  styleUrls: ['./welfare-offsite-detail.component.scss']
})
export class WelfareOffsiteDetailComponent implements OnInit {
  workflowData: any
  manageDocument: any
  employeeId = ""
  wfid = "3310"
  modelWelfare = {
    locationCode: '',
    location: '',
    workDescription: '',
    projectCode: '',
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '00:00',
    days: '0',
    hours: '0'
  }
  welfareFormList = [{
    locationCode: '',
    location: '',
    workDescription: '',
    projectCode: '',
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '00:00',
    days: '0',
    hours: '0',

    datesent:'',
    datebill:'',
    numberbill:'',

    welfareId: "",
    welfareName: "",

    oil: false,
    room: false,
    expressway_etc: false,
    reserve_payment: false,
    currency: false,

    oil_prices: 0,
    oil_number_km: 0,
    oil_prices_withdraw: 0,

    room_prices: 0,
    room_number_days: 0,
    room_number_withdraw: 0,

    expressway_etc_cost: 0,
    expressway_etc_remark: "",
    expressway_etc_cost_withdraw: 0,

    reserve_payment_cost: 0,
    reserve_payment_cost_withdraw: 0,

    currency_rateId: "",
    currency_rate: "",
    currency_bath: 0,
    currency_cost: 0,

    reqcost: 0,
    cost_total: 0,
    cost: 0,
    timestampFile: '',
    nameFile: "browse_file",
    nameFileUpload:""
  }];
  re = /\//gi;
  constructor(private wfService: workflowService) { }

  ngOnInit(): void {
  }

  dowloadFile(nameFile:string) {
    if (this.manageDocument) {
      if(this.manageDocument.attachFile?.length > 1){
        let findFile = this.manageDocument?.attachFile?.find((x:any) => x.name == nameFile)
        this.wfService.downloadFile(findFile.subFolder, findFile.name).then(result => {
          const myBlob = new Blob([result ? result : ""]);
          FileSaver.saveAs(myBlob, findFile.name);
        })
    }
    }
  }
 checkmultiFile(){
  if(this.manageDocument){
    if(this.manageDocument.attachFile?.length > 1){
      let findFile = this.manageDocument?.attachFile?.find((x:any) => x.name == this.workflowData.screen_value.nameFileUpload)
      return findFile.name
  }else{
      return this.manageDocument.attachFile[0].name
  }
  }
 }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      console.log("🚀 ~ WelfareOffsiteDetailComponent ~ ngOnChanges ~ this.workflowData:", this.workflowData)
      this.employeeId = this.workflowData.screen_value.__wf__employeeid
      this.manageDocument = changes.data.currentValue.manageDocument

      this.welfareFormList=[]
      for (let i = 0; i < Number(this.workflowData.screen_value.__wf__last_record); i++) {
        this.welfareFormList.push({
          locationCode: this.workflowData.screen_value["__wf__sitewelid$"+(i+1)],
          location: this.workflowData.screen_value["__wf__siteweldesc$"+(i+1)],
          workDescription: this.workflowData.screen_value["__wf__responsibilitie$"+(i+1)],
          projectCode: this.workflowData.screen_value["__wf__projectid$"+(i+1)],
          startDate: this.workflowData.screen_value["__wf__start_date$"+(i+1)].replace(this.re, '-').split("-").reverse().join("-"),
          startTime: this.workflowData.screen_value["__wf__start_time$"+(i+1)].replace('.', ':'),
          endDate: this.workflowData.screen_value["__wf__end_date$"+(i+1)].replace(this.re, '-').split("-").reverse().join("-"),
          endTime: this.workflowData.screen_value["__wf__end_time$"+(i+1)].replace('.', ':'),
          days: this.workflowData.screen_value["__wf__days$"+(i+1)],
          hours: this.workflowData.screen_value["__wf__hours$"+(i+1)],
          welfareId: this.workflowData.screen_value["__wf__welid$" + (i + 1)],
          welfareName: this.workflowData.screen_value["__wf__weldesc$" + (i + 1)],

          datesent:this.workflowData.screen_value["__wf__datesent$"+(i+1)].replace(this.re, '-').split("-").reverse().join("-"),
          datebill:this.workflowData.screen_value["__wf__datebill$"+(i+1)].replace(this.re, '-').split("-").reverse().join("-"),
          numberbill:this.workflowData.screen_value["__wf__numberbill$"+(i+1)],

          oil:this.workflowData.screen_value["__wf__oil$" + (i + 1)] == '1'?true:false,
          room:this.workflowData.screen_value["__wf__room$" + (i + 1)]== '1'?true:false,
          expressway_etc:this.workflowData.screen_value["__wf__expressway_etc$" + (i + 1)]== '1'?true:false,
          reserve_payment:this.workflowData.screen_value["__wf__reserve_payment$" + (i + 1)]== '1'?true:false,
          currency:this.workflowData.screen_value["__wf__currency$" + (i + 1)]== '1'?true:false,

          oil_prices:this.workflowData.screen_value["__wf__oil_prices$" + (i+1)],
          oil_number_km:this.workflowData.screen_value["__wf__oil_number_km$" + (i+1)],
          oil_prices_withdraw:this.workflowData.screen_value["__wf__oil_total$" + (i+1)],

          room_prices:this.workflowData.screen_value["__wf__room_prices$" + (i+1)],
          room_number_days:this.workflowData.screen_value["__wf__room_number_days$" + (i+1)],
          room_number_withdraw:this.workflowData.screen_value["__wf__room_total$" + (i+1)],

          expressway_etc_cost : this.workflowData.screen_value["__wf__expressway_etc_cost$" + (i+1)],
          expressway_etc_remark: this.workflowData.screen_value["__wf__expressway_etc_remark$" + (i+1)],
          expressway_etc_cost_withdraw : this.workflowData.screen_value["__wf__expressway_etc_cost_total$" + (i+1)],

          reserve_payment_cost: this.workflowData.screen_value["__wf__reserve_payment_cost$" + (i+1)],
          reserve_payment_cost_withdraw: this.workflowData.screen_value["__wf__reserve_payment_cost_total$" + (i+1)],

          currency_rateId: this.workflowData.screen_value["__wf__currency_foreign$" + (i+1)],
          currency_rate: this.workflowData.screen_value["__wf__currency_rate$" + (i+1)],
          currency_bath: this.workflowData.screen_value["__wf__currency_bath$" + (i+1)],
          currency_cost: this.workflowData.screen_value["__wf__currency_costtotal$" + (i+1)],

          reqcost: this.workflowData.screen_value["__wf__reqcost$" + (i+1)],
          cost_total:this.workflowData.screen_value["__wf__cost_total$" + (i+1)],
          cost:this.workflowData.screen_value["__wf__cost$" + (i+1)],

          timestampFile:this.workflowData.screen_value["__wf__timestampfile$" + (i+1)],
          nameFile: this.workflowData.screen_value["__wf__namefile$" + (i+1)],
          nameFileUpload: this.workflowData.screen_value["__wf__nameFileUpload$" + (i+1)],
        })
      }

    }
  }
}
