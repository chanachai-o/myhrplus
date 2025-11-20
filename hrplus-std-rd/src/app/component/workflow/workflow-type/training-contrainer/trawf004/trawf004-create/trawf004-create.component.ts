import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Injectable, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SendtoModel } from 'src/app/models/sendtomodel.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth, Location, DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { workflowService } from 'src/app/services/workflow.service';
import localeThai from '@angular/common/locales/th';
import { Trawf004DetailComponent } from '../trawf004-detail/trawf004-detail.component';
import { FormsModule } from '@angular/forms';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
@Component({
  selector: 'app-trawf004-create',
  templateUrl: './trawf004-create.component.html',
  styleUrls: ['./trawf004-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
  ],
  providers:[DecimalPipe]
})
export class Trawf004CreateComponent implements OnInit {
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
  costValue = '0'
  sendtoWF: SendtoModel[] | undefined
  emp: WorkingsModel | undefined;
  runno: string | undefined;
  __wf__headtraining = ''
  __wf__companytraining = ''
  __wf__phone = ''
  __wf__classdatefrm = new NgbDate(0, 0, 0);
  __wf__classdateto = new NgbDate(0, 0, 0);
  __wf__timestart = ''
  __wf__timestop = ''
  __wf__trainlocation = ''
  __wf__objecttraining = ''
  __wf__payment_date = new NgbDate(0, 0, 0);
  __wf__training_value = '0.00'
  __wf__tax7_value = '0.00'
  __wf__total_value = '0.00'
  re = /\//gi;
  __wf__classdatefrmParser = ''
  __wf__classdatetoParser = ''
  __wf__payment_dateParser = ''

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
    private local: Location,
    private datePipe: DatePipe,
    private _decimalPipe: DecimalPipe,
    private parserFormat: NgbDateParserFormatter) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get('wfid')
      this.runno = result.get("runno")!;
    });
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    this.sendtoWFApi()
    this.getuploadWFApi()
    this.requireEMP()
    if (this.runno) {
      this.setScreenValue();
    }
  }
  refDoc: any;
  screenObj: any;
  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.refDoc = result;
      this.screenObj = result.workflowData.screen_value;
      this.__wf__headtraining = this.screenObj.__wf__headtraining
      this.__wf__companytraining = this.screenObj.__wf__companytraining
      this.__wf__trainlocation = this.screenObj.__wf__trainlocation
      this.__wf__phone = this.screenObj.__wf__phone
      this.__wf__objecttraining = this.screenObj.__wf__objecttraining
      let startDate = (this.screenObj.__wf__classdatefrm + '').split('-')
      this.__wf__classdatefrm = new NgbDate(parseInt(startDate[2]), parseInt(startDate[1]), parseInt(startDate[0]))
      let endDate = (this.screenObj.__wf__classdateto + '').split('-')
      this.__wf__classdateto = new NgbDate(parseInt(endDate[2]), parseInt(startDate[1]), parseInt(startDate[0]))
      this.__wf__timestart = (this.screenObj.__wf__timestart + '').replace('.', ':')
      this.__wf__timestop = (this.screenObj.__wf__timestop + '').replace('.', ':')
      let paymentDate = (this.screenObj.__wf__payment_date + '').split('-')
      this.__wf__payment_date = new NgbDate(parseInt(paymentDate[2]), parseInt(startDate[1]), parseInt(startDate[0]))
      this.__wf__training_value = this.screenObj.__wf__training_value
      this.__wf__tax7_value = this.screenObj.__wf__tax7_value
      this.__wf__total_value = this.screenObj.__wf__total_value
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screenObj.timestampFile
      }
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.inputs.data = result
      this.dynamicComponent = Trawf004DetailComponent
      this.cdr.markForCheck();
    });
  }
  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe((result: any) => {
      this.sendtoWF = result.sendTo;

      this.cdr.markForCheck();
    });
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
    });
  }
  async onFileSelected(event: any) {
    var files = event.target.files;
    if (files.length > 0) {
      if (files[0].name != this.nameFile) {
        var reader: any = new FileReader();
        reader = new FileReader();
        reader.onload = () => {
          const json = btoa(reader.result);
          this.newFile = json;
        };
        reader.readAsBinaryString(files[0]);
        this.uploadFilename = files[0].name;
        this.uploadFileSize = files[0].size;
        if (this.uploadFileSize > this.uploadConfig.maxSize) {
          this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
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
    let screenObj: any = {};
    screenObj["timestampFile"] = this.timestampFile;
    screenObj["attach_time"] = this.timestampFile;

    screenObj["__wf__employeeid"] = this.emp!!.employeeId;
    screenObj["__wf__fullname"] = this.emp!.getFullname();
    screenObj["__wf__position"] = this.emp!.position!.tdesc;
    screenObj["__wf__bu1"] = this.emp!.bu1!.tdesc;
    screenObj["__wf__bu2"] = this.emp!.bu2!.tdesc;
    screenObj["__wf__bu3"] = this.emp!.bu3!.tdesc;
    screenObj["__wf__bu4"] = this.emp!.bu4!.tdesc;
    screenObj["__wf__bu5"] = this.emp!.bu5!.tdesc;
    screenObj["__wf__tel_ext"] = this.emp!.telExt;

    screenObj["__wf__traineeid"] = this.emp!.employeeId;
    screenObj["__wf__resdate"] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    screenObj["__wf__bu1id"] = this.emp!.bu1!.bu1id;
    screenObj["__wf__bu2id"] = this.emp!.bu2!.bu2id;
    screenObj["__wf__bu3id"] = this.emp!.bu3!.bu3id;
    screenObj["__wf__job"] = this.emp!.job!.jobcodeId;
    screenObj["__wf__emp_position"] = this.emp!.position!.positionId;
    screenObj["__wf__branch"] = this.emp!.branch!.branchId;
    screenObj["__wf__bossid"] = this.emp!.bossId;
    screenObj["__wf__salatype"] = '101';
    screenObj["__wf__emp_group"] = 'NONE';
    screenObj["__wf__emp_level"] = 'NONE';

    screenObj["__wf__trnee_regist"] = '3';
    screenObj["__wf__status"] = '2';
    screenObj["__wf__workarea"] = this.emp!.workarea!.workareaId;
    screenObj["__wf__listemp"] = '';
    screenObj["__wf__emp_count"] = '1';
    screenObj["__wf__line_no"] = '1';
    screenObj["__wf__isstep1"] = 'true';
    screenObj["__wf__isstep2"] = 'false';
    screenObj["__wf__isstepcancel"] = 'false';
    screenObj["__wf__isstepcomment"] = 'false';
    screenObj["__wf__isstepreturn"] = 'false';
    screenObj["__wf__isstepcopy"] = 'false';
    screenObj["__wf__isdraft"] = 'false';
    screenObj["__wf__isstep3"] = 'false';
    screenObj["__wf__isadminedit"] = 'false';
    screenObj["__wf__isadmincancel"] = 'false';
    screenObj["__wf__isadmindelete"] = 'false';
    screenObj["__wf__isadminclean"] = 'false';
    screenObj["__wf__isarchive"] = 'false';

    screenObj["__wf__headtraining"] = this.__wf__headtraining
    screenObj["__wf__companytraining"] = this.__wf__companytraining
    screenObj["__wf__phone"] = this.__wf__phone
    screenObj["__wf__classdatefrm"] = this.__wf__classdatefrmParser
    screenObj["__wf__classdateto"] = this.__wf__classdatetoParser
    screenObj["__wf__timestart"] = this.__wf__timestart.replace(':', '.')
    screenObj["__wf__timestop"] = this.__wf__timestop.replace(':', '.')
    screenObj["__wf__trainlocation"] = this.__wf__trainlocation
    screenObj["__wf__objecttraining"] = this.__wf__objecttraining
    screenObj["__wf__payment_date"] = this.__wf__payment_dateParser
    screenObj["__wf__training_value"] = this.__wf__training_value + ''
    screenObj["__wf__tax7_value"] = this.__wf__tax7_value + ''
    screenObj["__wf__total_value"] = this.__wf__total_value
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
    };
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
        if (this.runno) {
          this.cancelWF();
        }
        this.local.back();
      } else {
        this.msg = this.translateService.currentLang == 'th' ? 'ไม่สามารถสร้างเอกสารได้' : 'Can not create workflow.'
        this.modalService.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
        });
      }
    });
  }
  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
  }


  checkSubmit() {
    if (
      this.__wf__headtraining == '' ||
      this.__wf__companytraining == '' ||
      this.__wf__phone == '' ||
      this.__wf__classdatefrmParser == '00-00-0' ||
      this.__wf__classdatetoParser == '00-00-0' ||
      this.__wf__timestart == '' ||
      this.__wf__timestop == '' ||
      this.__wf__trainlocation == '' ||
      this.__wf__objecttraining == '' ||
      this.__wf__payment_dateParser == '00-00-0'
    ) {
      return true
    }
  }
  timeChange() {
    if (this.parserFormat.format(this.__wf__classdatefrm).replace(this.re, '-').split('-').reverse().join('') ==
      this.parserFormat.format(this.__wf__classdateto).replace(this.re, '-').split('-').reverse().join('')) {
      if (this.__wf__timestart.split(':').join('') > this.__wf__timestop.split(':').join('')) {
        this.__wf__timestop = this.__wf__timestart
      }
    }
  }
  dateChange(name: string) {
    let nowDate = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
    if (name == '__wf__classdatefrm' || name == '__wf__classdateto') {
      if (this.parserFormat.format(nowDate).replace(this.re, '-').split('-').reverse().join('') >
        this.parserFormat.format(this.__wf__classdatefrm).replace(this.re, '-').split('-').reverse().join('')) {
        this.__wf__classdatefrm = nowDate
      }
      this.__wf__classdatefrmParser = this.parserFormat.format(this.__wf__classdatefrm).replace(this.re, '-')
      if (this.parserFormat.format(this.__wf__classdateto).replace(this.re, '-').split('-').reverse().join('') <
        this.parserFormat.format(this.__wf__classdatefrm).replace(this.re, '-').split('-').reverse().join('')) {
        this.__wf__classdateto = new NgbDate(this.__wf__classdatefrm.year, this.__wf__classdatefrm.month, this.__wf__classdatefrm.day);
      }
      this.__wf__classdatetoParser = this.parserFormat.format(this.__wf__classdateto).replace(this.re, '-')
    }
    if (name == '__wf__payment_date') {
      if (this.parserFormat.format(nowDate).replace(this.re, '-').split('-').reverse().join('') >
        this.parserFormat.format(this.__wf__payment_date).replace(this.re, '-').split('-').reverse().join('')) {
        this.__wf__payment_date = nowDate
      }
      this.__wf__payment_dateParser = this.parserFormat.format(this.__wf__payment_date).replace(this.re, '-')
    }
    this.timeChange()
  }

  calTax() {
    this.__wf__total_value = this._decimalPipe
      .transform((parseFloat(this.__wf__training_value.split(",").join("")) + ((parseFloat(this.__wf__training_value.split(",").join("")) * parseFloat(this.__wf__tax7_value)) / 100)), "1.2-2")!;
    return this.__wf__total_value
  }

  toMoney() {
    this.__wf__training_value = this.__wf__training_value.indexOf(".") == 0 ? "0" + this.__wf__training_value : this.__wf__training_value
    if (this.__wf__training_value.indexOf(".") == -1) {
      this.__wf__training_value = this._decimalPipe
        .transform(this.__wf__training_value, "1.2-2")!;
    }
    else {
      this.__wf__training_value = this._decimalPipe
        .transform(this.__wf__training_value, "1.2-2")!;
    }
    this.__wf__training_value = this.__wf__training_value == ".00" ? "0.00" : this.__wf__training_value

  }

  toMoney2() {
    this.__wf__training_value = this._decimalPipe
      .transform(this.__wf__training_value, "1.2-2")!;
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
