import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MySendtoModel, SendtoModel } from 'src/app/models/sendtomodel.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location, DatePipe } from '@angular/common';
import { workflowService } from 'src/app/services/workflow.service';
import localeThai from '@angular/common/locales/th';
import { ChangeMoneyModel, MyChangeMoneyModel } from 'src/app/models/changemoney.model';
import { MyPVFund, PVFund } from 'src/app/models/pvf.model';
import { Tax } from 'src/app/models/tax.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { DocReferenceModalComponent } from '../../../doc-reference-modal/doc-reference-modal.component';
import { Wel210NstdaDetailComponent } from '../wel210-nstda-detail/wel210-nstda-detail.component';
import { WorkflowSendtoComponent } from '../../../workflow-sendto/workflow-sendto.component';
import { WorkflowRemarkComponent } from '../../../workflow-remark/workflow-remark.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    Wel210NstdaDetailComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    DocReferenceModalComponent,
    WorkflowSendtoComponent,
    WorkflowRemarkComponent,
    FormsModule,
  ],
  selector: 'app-wel210-nstda-create',
  templateUrl: './wel210-nstda-create.component.html',
  styleUrls: ['./wel210-nstda-create.component.scss']
})
export class Wel210NstdaCreateComponent implements OnInit {
  @Input() data: any;
  @ViewChild('alertModal') alertModal: undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('confirmModal') confirmModal: undefined;
  timestampFile: any;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = 'browse_file';
  uploadConfig: any;
  msg = '';
  remark = '';
  wfid: any;
  token: any;
  sendtoWF: SendtoModel | undefined
  emp: WorkingsModel | undefined;


  page = 1;
  pageSize = 10;
  collectionSize = 0;
  pageModal = 1;
  pageSizeModal = 10;
  collectionSizeModal = 0;


  changeMoney: ChangeMoneyModel[] | undefined
  changeMoneyShow: ChangeMoneyModel[] | undefined
  searchChangeMoney = ''
  pvFund: PVFund[] | undefined
  tax: Tax | undefined

  __wf__fundtablem = ''
  __wf__oldratioCIMB = ''
  __wf__oldtotal = ''
  __wf__new_fundtablem = ''
  __wf__mempl_pvf$newratio$CIMB = '100.00'
  __wf__newtotal = '100.00'
  priority = '0'

  runno: any
  screen_value: any
  workflowData: any

  inputs = {
    data: {}
  }
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  @ViewChild('cancelModal') cancelModal: undefined
  dynamicComponent: any
  referenceParam = ""

  employeeCCId = ""
  constructor(private modalService: NgbModal,
    public modal: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private translateService: TranslateService,
    private local: Location) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!
    })
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    if (this.runno) {
      this.setScreenValue()
    }
    this.sendtoWFApi()
    this.getuploadWFApi()
    this.requireEMP()

    this.getChangeMoney()
    this.getProvidentFund()
    this.getTax()
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe(result => {
      this.sendtoWF = new MySendtoModel(result, this.translateService)
      this.cdr.markForCheck()
    })
  }
  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }
  getuploadWFApi() {
    this.workflowService.getuploadWF().subscribe((result) => {
      this.uploadConfig = result;
      this.cdr.markForCheck();
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
        uploadfield: 'attached_file_temp.file_name',
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      };
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.timestampFile = '';
          this.nameFile = 'browse_file';
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
        } else {
          this.nameFile = body.fileName;
        }

      })
    }
    this.closeBtnClick();
  }
  resetIMG() {
    this.timestampFile = '';
    this.nameFile = 'browse_file';
  }
  openOnSubmit() {
    this.msg = this.translateService.currentLang == 'th' ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?';
    this.modalService.open(this.confirmModal, {
      centered: true,
      backdrop: 'static'
    });
  }
  onSubmit() {
    let screenObj: any = {}
    screenObj["timestampFile"] = this.timestampFile
    screenObj["attach_time"] = this.timestampFile

    screenObj["__wf__emp_request"] = this.token.employeeid;
    screenObj["__wf__employeeid"] = this.emp!.employeeId;
    screenObj["__wf__fullname"] = this.emp!.getFullname();
    screenObj["__wf__position"] = this.emp!.position!.tdesc;
    screenObj["__wf__bu1"] = this.emp!.bu1!.tdesc;
    screenObj["__wf__bu2"] = this.emp!.bu2!.tdesc;
    screenObj["__wf__bu3"] = this.emp!.bu3!.tdesc;
    screenObj["__wf__bu4"] = this.emp!.bu4!.tdesc;
    screenObj["__wf__bu5"] = this.emp!.bu5!.tdesc;
    screenObj["__wf__tel_ext"] = this.emp!.telExt



    screenObj["__wf__fundtablem"] = this.__wf__fundtablem
    screenObj["__wf__oldratioCIMB"] = parseFloat(this.__wf__oldratioCIMB).toFixed(2)
    screenObj["__wf__oldtotal"] = parseFloat(this.__wf__oldtotal).toFixed(2)
    screenObj["__wf__new_fundtablem"] = this.__wf__new_fundtablem
    screenObj["__wf__mempl_pvf$newratio$CIMB"] = parseFloat(this.__wf__mempl_pvf$newratio$CIMB).toFixed(2)
    screenObj["__wf__newtotal"] = parseFloat(this.__wf__newtotal).toFixed(2)
    screenObj["priority"] = this.priority
    let body = {
      companyId: this.token.companyid,
      wf_ver: '1',
      wf_id: this.wfid,
      doc_no: '0',
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
    });
  }
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.screen_value = result.workflowData.screen_value;
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.__wf__new_fundtablem = this.screen_value["__wf__new_fundtablem"]
      this.priority = this.screen_value["priority"]
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = result.workflowData.timestampFile
      }


      this.inputs.data = result
      this.dynamicComponent = Wel210NstdaDetailComponent
      this.cdr.markForCheck()
    })
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
  }
  getChangeMoney() {
    this.workflowService.getChangeMoney().then(result => {
      this.changeMoney = result.map(e => new MyChangeMoneyModel(e, this.translateService))
      this.changeMoneyShow = this.changeMoney
      this.cdr.markForCheck()
    })
  }
  searchChangeMoneyChange() {
    this.changeMoneyShow = this.changeMoney!.filter((x: any) => x.fundtableId.indexOf(this.searchChangeMoney) !== -1);
    this.pageModal = 1;
    this.collectionSizeModal = this.changeMoneyShow.length
  }
  selectChangeMoney(item: ChangeMoneyModel) {
    this.__wf__new_fundtablem = item.fundtableId!
  }
  getProvidentFund() {
    this.empService.getProvidentFund().then(result => {
      this.pvFund = result.map(e => new MyPVFund(e, this.translateService))
      if (this.pvFund) {
        this.__wf__oldratioCIMB = this.pvFund.length > 0 ? this.pvFund[0].amount!.toString() : ''
        this.__wf__oldtotal = this.__wf__oldratioCIMB
      }
      this.cdr.markForCheck()
      console.log("ssssssssssssssssssssss", result)
    })
  }
  getTax() {
    this.empService.getTax().then(result => {
      this.tax = result
      this.__wf__fundtablem = this.tax.fundtablem.fundtableId ? this.tax.fundtablem.fundtableId : ''
      this.cdr.markForCheck()
    })
  }
  __wf__mempl_pvf$newratio$CIMBChange() {
    if (this.__wf__mempl_pvf$newratio$CIMB > '100') {
      this.__wf__mempl_pvf$newratio$CIMB = '100'
    } else if (this.__wf__mempl_pvf$newratio$CIMB < '0') {
      this.__wf__mempl_pvf$newratio$CIMB = '0'
    }
    this.__wf__newtotal = this.__wf__mempl_pvf$newratio$CIMB
  }
  priorityChange(item: string) {
    this.priority = item
  }
  openModal(modal: string, name: string) {
    this.pageModal = 1
    this.pageSizeModal = 10
    this.collectionSizeModal = 0
    if (name = 'modalFund') {
      this.searchChangeMoney = ''
      this.changeMoneyShow = this.changeMoney
      this.collectionSizeModal = this.changeMoneyShow!.length
    }
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }
  // สำเนา
  openModalCC(modalCC: string) {
    this.modalService.open(modalCC, { centered: true, size: 'lg' });
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
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
}
