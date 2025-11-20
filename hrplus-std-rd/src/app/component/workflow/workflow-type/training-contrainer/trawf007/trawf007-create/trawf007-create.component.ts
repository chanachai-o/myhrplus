import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { MyCourse } from 'src/app/models/course.model';
import { Employee, MyEmployee } from 'src/app/models/employee.model';
import { MyLocations } from 'src/app/models/locations.model';
import { SendtoModel } from 'src/app/models/sendtomodel.model';
import { TrainCost } from 'src/app/models/traincost.model';
import { TrainIn } from 'src/app/models/trainin.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { DatePipe, Location } from '@angular/common';

import { workflowService } from 'src/app/services/workflow.service';
import { ConfirmModalComponent } from '../../../confirm-modal/confirm-modal.component';
import { SendTo } from 'src/app/models/sendto.model';
import { Trawf007DetailComponent } from '../trawf007-detail/trawf007-detail.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index'
@Component({
  selector: 'app-trawf007-create',
  templateUrl: './trawf007-create.component.html',
  styleUrls: ['./trawf007-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent // Added
  ]
})
export class Trawf007CreateComponent implements OnInit {
  @Input() data: any;


  pageTrainCost = 1;
  pageSizeTrainCost = 10;
  collectionSizeTrainCost = 0;
  pageCourseEmp = 1;
  pageSizeCourseEmp = 10;
  collectionSizeCourseEmp = 0;
  pageModal = 1;
  pageSizeModal = 10;
  collectionSizeModal = 0;

  wfid: any;
  token: any;

  remark = ''

  @ViewChild('alertModal') alertModal: undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  timestampFile: any;
  newFile: any;
  uploadFilename: any;
  uploadFileSize: any;
  nameFile = 'browse_file';
  uploadConfig: any;
  msg = '';
  runno: string | undefined;
  sendtoWF: SendTo[] | undefined
  emp: WorkingsModel | undefined;

  trainIn: TrainIn[] | undefined
  trainInShow: TrainIn[] | undefined
  trainInSelect: TrainIn = {
    trainingId: ''
  }
  searchTrainIn = ""
  trainInSelectId = ''
  trainCost: TrainCost[] | undefined
  courseEmp: Employee[] | undefined

  workflowData: any
  traningId = "";
  inputs = {
    data: {}
  }
  @ViewChild('DocReferenceModal') DocReferenceModal: undefined
  dynamicComponent: any
  referenceParam = ""
  workingsShow: WorkingsModel[] | undefined
  selectEmployee: { emp: WorkingsModel, select: boolean }[] = []
  isSelect = false;
  _searchTerm = ''
  collectionSizeModel = 0
  pageModel = 1
  pageSizeModel = 10
  employeeID = ''
  empCheckbox: { emp: WorkingsModel, name: string, select: boolean }[] = []
  loadingEmp = false
  empList: any

  employeeCCId = ""
  constructor(private modalService: NgbModal,
    public modal: NgbModal,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private empService: EmployeeService,
    private translateService: TranslateService,
    private local: Location,
    private datePipe: DatePipe) {
    this.activatedRoute.paramMap.subscribe(result => {
      this.wfid = result.get("wfid");
      this.runno = result.get("runno") ? result.get("runno")! : undefined
      this.traningId = result.get("traningId") ? result.get("traningId")! : ""
    });
    this.token = JSON.parse(sessionStorage.getItem('currentUser')!)
    this.getuploadWFApi()
    this.sendtoWFApi()
    this.getEmpHr();
    this.getTrainIn()
    if (this.runno && this.runno != "0") {
      this.setScreenValue();
    }
  }
  refDoc: any;
  screenObj: any;

  setScreenValue() {
    this.workflowService.getDetailByRunNo(this.runno!).subscribe((result) => {
      this.refDoc = result;
      this.screenObj = result.workflowData.screen_value;
      this.trainInSelectId = this.screenObj.__wf__trainingid;
      this.trainingIdChange(this.trainInSelectId)
      this.remark = result.workflowData.remark
      if (result.manageDocument.attachFile) {
        this.nameFile = result.manageDocument.attachFile[0].name
        this.timestampFile = this.screenObj.timestampFile
      }
      this.workflowData = result.workflowData
      this.referenceParam = this.workflowData["referenceParam"]
      this.inputs.data = result
      this.dynamicComponent = Trawf007DetailComponent

      this.cdr.markForCheck();
    });
  }
  selectAllEmp(event: boolean) {
    this.empCheckbox.map(x => x.select = event)
  }
  checkSelect(item: any) {
    item.select = !item.select;
  }

  checkAll() {
    this.isSelect = !this.isSelect
    this.selectEmployee.forEach(result => {
      result.select = this.isSelect;
    });
  }
  get searchTerm(): string {
    return this._searchTerm
  }

  set searchTerm(val: string) {
    this._searchTerm = val
    if (this.workingsShow) {
      this.workingsShow = this.filterNameEmp(val)
      let empCheckbox = this.empCheckbox
      this.empCheckbox = []
      this.workingsShow!.forEach(x => {
        let select = empCheckbox.filter(z => z.emp.employeeId == x.employeeId).length > 0 ? empCheckbox.filter(z => z.emp.employeeId == x.employeeId)[0].select : false
        this.empCheckbox.push({ emp: x, name: x.getFullname(), select: select })
      })
      this.collectionSizeModel = this.workingsShow!.length
    }
  }
  filterNameEmp(v: string) {
    return this.empList!.filter((x: any) => (x.getFullname().toLowerCase().indexOf(v) !== -1))
  }
  removeData() {
    this.selectEmployee!.forEach((result, index) => {
      if (result.select) {
        this.selectEmployee!.splice(index, 1);
        this.removeData()
      }
    });
  }
  selectCheckboxEmpCheck() {
    return this.empCheckbox.filter(x => x.select == true).length == 0 ? true : false
  }
  selectEmp() {
    this.empCheckbox.filter(x => x.select == true).forEach(x => {
      if (this.selectEmployee.filter(y => y.emp.employeeId == x.emp.employeeId).length == 0) {
        this.selectEmployee!.push({ emp: x.emp, select: false })
      } else if (this.empCheckbox.filter(y => y.select == true).length != this.selectEmployee.length) {
        this.selectEmployee = []
        this.selectEmployee!.push({ emp: x.emp, select: false })
      }
    })
  }


  getEmpHr() {
    this.loadingEmp = true;
    this.workflowService.getEmpHr().subscribe(result => {
      this.empList = result.map((e: any) => new MyWorkingsModel(e, this.translateService));
      this.workingsShow = this.empList.sort((a: any, b: any) => a.employeeId > b.employeeId ? 1 : -1)
      this.workingsShow!.forEach(x => {
        this.empCheckbox.push({ emp: x!, name: x.getFullname(), select: false })
      })
      this.cdr.markForCheck();
      this.collectionSizeModel = this.empList.length
    })
    this.pageModel = 1
    this.loadingEmp = false;
  }

  sendtoWFApi() {
    this.workflowService.sendtoWF(this.wfid).subscribe((result: SendtoModel) => {
      this.sendtoWF = result.sendTo;
      this.requireEMP();
      this.cdr.markForCheck();
    });
  }

  requireEMP() {
    this.empService.getWorkInformation().subscribe(result => {
      this.emp = result;
      this.cdr.markForCheck();
    });
  }

  getTrainIn() {
    this.workflowService.getTrainIn().subscribe(result => {
      this.trainIn = result.sort((a, b) => (a.trainingId! > b.trainingId!) ? 1 : -1);
      this.trainInShow = this.trainIn;
      this.collectionSizeModal = this.trainIn ? this.trainIn.length : 0;

      if (this.traningId != "") {
        this.trainingIdChange(this.traningId);
      }
      this.cdr.markForCheck();
    });
  }

  searchTrainInChange() {
    this.trainInShow = this.trainIn!.filter((x: any) => (x.trainingId.toLowerCase().indexOf(this.searchTrainIn.toLowerCase()) !== -1));
    this.pageModal = 1;
    this.collectionSizeModal = this.trainInShow ? this.trainInShow.length : 0
  }

  trainingIdChange(v: string) {
    let trainIn = this.trainIn!.find((x: TrainIn) => (x.trainingId!.toLowerCase() == v.toLowerCase()));
    if (trainIn) {
      this.selectTrainIn(trainIn)
    } else {
      this.trainInSelect = {}
      this.trainCost = []
      this.courseEmp = undefined
    }
  }

  selectTrainIn(item: TrainIn) {
    this.trainInSelectId = item.trainingId!
    this.trainInSelect = item
    this.trainInSelect.location = new MyLocations(this.trainInSelect.location!, this.translateService)
    this.trainInSelect.course = new MyCourse(this.trainInSelect.course!, this.translateService)
    this.getCourseCost(this.trainInSelect.trainingId!)
    this.getCourseEmp(this.trainInSelect.trainingId!)
  }

  getCourseCost(courseId: string) {
    this.workflowService.getCourseCost(courseId).subscribe(result => {
      this.trainCost = result;
      this.collectionSizeTrainCost = this.trainCost.length
      this.cdr.markForCheck();
    });
  }

  calculate(item: string) {
    let all = 0
    if (this.trainCost) {
      if (item == 'estimate') {
        this.trainCost.forEach(x => {
          all = all + x.estimate
        })
      }
      if (item == 'used') {
        this.trainCost.forEach(x => {
          all = all + x.used
        })
      }
      return all
    }
    return all
  }

  getCourseEmp(courseId: string) {
    this.workflowService.getCourseEmp2(courseId).then(result => {
      this.courseEmp = result.map(e => new MyEmployee(e, this.translateService));
      this.collectionSizeCourseEmp = this.courseEmp.length
      this.cdr.markForCheck();
    });
  }

  openModal(modal: string, name: string) {
    this.pageModal = 1;
    this.pageSizeModal = 10;
    if (name == "Course") {
      this.searchTrainIn = ""
      this.trainInShow = this.trainIn
      this.collectionSizeModal = this.trainInShow ? this.trainInShow.length : 0
    }
    if (name == 'Employee') {
      this._searchTerm = ''
      this.pageModel = 1
      this.collectionSizeModel = this.workingsShow!.length
      this.empCheckbox = []
      this.workingsShow!.forEach(x => {
        this.empCheckbox.push({ emp: x, name: x.getFullname(), select: this.selectEmployee == undefined ? false : this.selectEmployee!.filter(y => y.emp.employeeId! == x.employeeId!).length == 0 ? false : true })
      })
    }
    this.modal.open(modal, { centered: true, windowClass: 'dialog-width' });
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
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
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
        uploadfield: "attached_file_temp.file_name",
        subfolder: this.timestampFile,
        fileName: this.uploadFilename,
        data: this.newFile,
      };
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.timestampFile = '';
          this.nameFile = 'browse_file';
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
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

  openConfirmModal(status: string) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    if (status == 'submit') {
      modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
    } else if (status == 'cancel') {
      modalRef.componentInstance.message = this.translateService.currentLang == "th" ? 'คุณต้องการยืนยันข้อมูลหรือไม่?' : 'Do you want to confirm?'
    }
    modalRef.result.then((result) => {
      if (status == 'submit') {
        this.onSubmit()
      } else if (status == 'cancel') {
        this.cancelWF()
      }
    }, (reason) => {
      this.closeBtnClick()
    })
  }

  onSubmit() {
    let screenObj: any = {};

    screenObj["timestampFile"] = this.timestampFile;
    screenObj["attach_time"] = this.timestampFile;

    screenObj["__wf__reserverid"] = this.emp!.employeeId;
    screenObj["__wf__resdate"] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    screenObj["__wf__bu1id"] = this.emp!.bu1!.bu1id;
    screenObj["__wf__bu2id"] = this.emp!.bu2!.bu2id;
    screenObj["__wf__bu3id"] = this.emp!.bu3!.bu3id;
    screenObj["__wf__bu4id"] = this.emp!.bu4!.bu4id;
    screenObj["__wf__bu5id"] = this.emp!.bu5!.bu5id;
    screenObj["__wf__job"] = this.emp!.job!.tdesc;
    screenObj["__wf__emp_position"] = this.emp!.position!.positionId;
    screenObj["__wf__branch"] = this.emp!.branch!.branchId;
    screenObj["__wf__bossid"] = this.emp!.bossId;
    screenObj["__wf__salatype"] = '101';
    screenObj["__wf__emp_group"] = 'NONE';
    screenObj["__wf__emp_level"] = 'NONE';
    screenObj["__wf__trnee_regist"] = '3';
    screenObj["__wf__status"] = '1';
    screenObj["__wf__workarea"] = this.emp!.workarea!.workareaId;

    screenObj["__wf__employeeid"] = this.emp!!.employeeId;
    screenObj["__wf__fullname"] = this.emp!.getFullname();
    screenObj["__wf__position"] = this.emp!.position!.tdesc;
    screenObj["__wf__bu1"] = this.emp!.bu1!.tdesc;
    screenObj["__wf__bu2"] = this.emp!.bu2!.tdesc;
    screenObj["__wf__bu3"] = this.emp!.bu3!.tdesc;
    screenObj["__wf__bu4"] = this.emp!.bu4!.tdesc;
    screenObj["__wf__bu5"] = this.emp!.bu5!.tdesc;
    screenObj["__wf__tel_ext"] = this.emp!.telExt;

    screenObj["__wf__trainingid"] = this.trainInSelect!.trainingId;
    screenObj["__wf__trtitle"] = this.trainInSelect!.title;
    screenObj["__wf__crsdesc"] = this.trainInSelect!.course!.tdesc;
    screenObj["__wf__locdesc"] = this.trainInSelect!.location!.tdesc;
    screenObj["__wf__classdatefrm"] = this.trainInSelect!.classDateFrm;
    screenObj["__wf__classdateto"] = this.trainInSelect!.classDateTo;
    screenObj["__wf__timestart"] = this.trainInSelect!.timeStart!.toFixed(2);
    screenObj["__wf__timestop"] = this.trainInSelect!.timeStop!.toFixed(2);
    screenObj["__wf__budplaned"] = this.calculate('estimate')!.toFixed(2);
    screenObj["__wf__budused"] = this.calculate('used')!.toFixed(2);

    let emplist = ''
    this.courseEmp!.forEach(x => {
      emplist = emplist + x.employeeId + ',';
    });
    emplist = emplist.slice(0, -1);
    screenObj["__wf__emplist"] = emplist;
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
    console.log(body)
    this.workflowService.createWF(body).subscribe(result => {
      if (result) {
        if (this.runno && this.runno != "0") {
          this.workflowService.cancelWF(this.refDoc.workflowData).subscribe(
            (result: any) => {
            }
          );
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

  closeBtnClick() {
    this.modalService.dismissAll()
    this.ngOnInit();
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
  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }

}
