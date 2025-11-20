import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import localeThai from '@angular/common/locales/th';
import { WorkAreaService } from 'src/app/services/workarea.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeRosterModel } from 'src/app/models/employeeroster.model';
import { MyPrefixModel, PrefixModel } from 'src/app/models/prefixmodel.model';
import { HandicappedTypeModel } from 'src/app/models/Handicappedtype.model';
import { Job, MyJob } from 'src/app/models/job.model';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { workflowService } from 'src/app/services/workflow.service';
import { EmpTypeModel } from 'src/app/models/emptype.model';
import { MyEmployeeTypeModel } from 'src/app/models/employeetype.model';
import { EmployeeTypeModel } from 'src/app/models/employeetype.model';
import { SalaTypeModel } from 'src/app/models/salatype.model';
import { ContractPartyModel } from 'src/app/models/contractparty.model';
import { PaperModel } from 'src/app/models/paper.model';
import { EmpStatusModel } from 'src/app/models/empstatus.model';
import { EmpPositionModel } from 'src/app/models/empposition.model';
import { environment } from 'src/environments/environment';
import { WorkAreaRgm1 } from 'src/app/models/workareargm1.model';
import { RosterPaperListModel } from 'src/app/models/paperlist.model';
import { UntypedFormControl, UntypedFormGroup, NgModel, Validators, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { KerryWorkareaModel } from 'src/app/models/kerry-mix-model.model';
import { SalaTypeRgm1 } from 'src/app/models/salatype-rgm1.model';
import { SalatypeRateModel } from 'src/app/models/salatype-sammary.model';
import { SalatypeRateJobCodeModel } from 'src/app/models/salatype-jobcode.model';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { TrainingModule } from '../../training/training.module';
export interface ResponseSave {
    createInstanceSuccess: string
    createInstanceFail: any
    employeeId: string
    thFullName: string
    engFullName: string
  }
@Component({
  selector: 'app-summary-data',
  templateUrl: './summary-data.component.html',
  styleUrls: ['./summary-data.component.scss'],
  standalone: true,
  imports : [CommonModule, TrainingModule, TranslateModule, NgbDatepickerModule, FormsModule, ReactiveFormsModule]
})
export class SummaryDataComponent implements OnInit {
    @ViewChild('alertModal') alertModal: undefined
    @ViewChild('alertModalCheckId') alertModalCheckId: undefined
    pageModal = 1;
    pageSizeModal = 10;
    collectionSizeModal = 0;

    workarea1List:SalatypeRateModel[]=[]
    workarea1ListShow:SalatypeRateModel[]=[]
    nameForm = new UntypedFormGroup({
        fname: new UntypedFormControl('', [Validators.required, Validators.maxLength(30)]),
        lname: new UntypedFormControl('', [Validators.required, Validators.maxLength(40)]),
        efname: new UntypedFormControl('', [Validators.required, Validators.maxLength(30)]),
        elname: new UntypedFormControl('', [Validators.required, Validators.maxLength(40)]),
    })
    workareaId=''
    empType:EmployeeTypeModel[]=[]
    modelProfile:EmployeeRosterModel = new EmployeeRosterModel({
        workArea:new KerryWorkareaModel({}),
        status:new EmpStatusModel({},this.translateService)
    },this.translateService)

    prefixList:PrefixModel[]=[]
    handicappedList:HandicappedTypeModel[]=[]

    jobcodeList:Job[]=[]
    jobcodeListShow:Job[]=[]
    jobId=''


    selctBoss:WorkingsModel= new MyWorkingsModel({},this.translateService)
    salatypeLists:SalaTypeModel[]= []

    ContractpartyList:ContractPartyModel[]= []
    ContractpartyListShow:ContractPartyModel[]= []
    counterpartyId=''

    paperList:PaperModel[]= []

    positionList:EmpPositionModel[]= []
    positionListShow:EmpPositionModel[]= []
    positionId = ''
    handicappedCheck= false;

    changeDate=new Date();
    minDate = { year: this.changeDate.getFullYear() - 100, month: 1, day: 1 }
    maxDate = { year: this.changeDate.getFullYear() - 15, month: this.changeDate.getMonth()+1, day: this.changeDate.getDate() }
    selectStartDate = new NgbDate(this.changeDate.getFullYear(),this.changeDate.getMonth()+1,this.changeDate.getDate());
    selectBirthDay = new NgbDate(this.changeDate.getFullYear(),this.changeDate.getMonth()+1,this.changeDate.getDate());
    re = /\//gi;
    bYear = 0
    bMonth = 0
    bDay = 0
    checkIdCard = true
    checkIdAcc = false
    msg=''

    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    @ViewChild('uploadModal') uploadModal: undefined;
    newFile: any;
    uploadFilename: any;
    uploadFileSize: any;
    nameFile = 'browse_file';
    uploadConfig: any;
    imgPath = environment.jbossUrl + "/FileViewer.jsp?uploadfield=memployee.picture&filename=";

    @ViewChild('fileInputDoc') fileInputDoc: ElementRef | undefined;
    filePath = environment.jbossUrl + "/FileDownload.jsp?uploadfield=mempl_paper.reffile&filename=";
    newFileDoc: any;
    uploadFilenameDoc: any;
    uploadFileSizeDoc: any;
    nameFileDoc = 'browse_file';
    uploadConfigDoc: any;
    checkbtn=true
    searchText=''
    slectDoc?:PaperModel
    salaryrateList:SalatypeRateModel[]=[]
    responseCheckid:any
    responseSave?:ResponseSave
    bossModal:SalaTypeRgm1 | null | undefined
    typeCheck=''
  constructor(
    private workareaService: WorkAreaService,
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    public translateService: TranslateService,
    private workflowService: workflowService,
    private cdr: ChangeDetectorRef,
    private parserFormat: NgbDateParserFormatter,
    public datepickerService: DatepickerNgbService
  ) {
    this.modelProfile.isHandicapped = '0'
  }
  changeHandicapped(){
    if(this.handicappedCheck == false){
        this.modelProfile.isHandicapped = '0'
        this.modelProfile.handicappedType = null
    }else if(this.handicappedCheck == true){
        this.modelProfile.isHandicapped = '1'
    }
  }
  selectFilter(type : string){
    if(type == 'job'){
        let jobFil = this.jobcodeList.filter(x => x.jobcodeId!.toLowerCase() == this.jobId.toLowerCase())
        this.modelProfile.job =  jobFil.length > 0 ?jobFil[0]:this.modelProfile.job = new MyJob({}, this.translateService)
        this.selectPosition(new EmpPositionModel(jobFil.length > 0?jobFil[0].position:{}))
    }
    if(type == 'positon'){
        this.modelProfile.empPosition =  this.positionList.filter(x => x.positionId!.toLowerCase() == this.positionId.toLowerCase()).length > 0 ?this.positionList.filter(x => x.positionId!.toLowerCase() == this.positionId.toLowerCase())[0] :this.modelProfile.empPosition = new EmpPositionModel({}, this.translateService)
    }
    if(type == 'workarea'){
        let modalWorakarea =  this.workarea1List.filter(x => x.workarea?.workareaId!.toLowerCase() == this.workareaId.toLowerCase())[0]
        this.modelProfile.workArea =  this.workarea1List.filter(x => x.workarea?.workareaId!.toLowerCase() == this.workareaId.toLowerCase()).length > 0 ?new KerryWorkareaModel({
                workareaId:modalWorakarea.workarea!.workareaId,
                tdesc:modalWorakarea.workarea?.tdesc,
                edesc:modalWorakarea.workarea?.edesc,
            },this.translateService) :this.modelProfile.workArea = new KerryWorkareaModel({}, this.translateService)
        if(modalWorakarea){
            this.getJobcode(modalWorakarea.workarea!.workareaId!)
            this.bossModal = modalWorakarea.workarea?.rgm1
            this.workareaId = modalWorakarea.workarea!.workareaId!
            this.modelProfile.bossId = modalWorakarea.workarea!.rgm1!.employeeId
        }else{
            this.bossModal = new SalaTypeRgm1()
            this.workareaId = ''
            this.modelProfile.bossId = ''
        }
    }
    if(type == 'counterparty'){
        this.modelProfile.contractParty =  this.ContractpartyList!.filter(x => x.partyId!.toLowerCase() == this.counterpartyId.toLowerCase()).length > 0 ?this.ContractpartyList!.filter(x => x.partyId!.toLowerCase() == this.counterpartyId.toLowerCase())[0]: this.modelProfile.contractParty = new ContractPartyModel({},this.translateService)
    }
  }
  searchFilter(type :string) {
    if(type == 'job'){
        this.jobcodeListShow = this.jobcodeList!.filter((x: any) => x.jobcodeId.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || x.tdesc.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || x.edesc.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1);
        this.pageModal = 1;
        this.collectionSizeModal = this.jobcodeListShow.length
    }
    if(type == 'position'){
        this.positionListShow = this.positionList!.filter(x => x.positionId.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || x.getName()!.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
        this.pageModal = 1;
        this.collectionSizeModal = this.positionListShow.length
    }
    if(type == 'workarea'){
        this.workarea1ListShow = this.workarea1List!.filter(x => x.workarea!.workareaId!.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1||x.workarea!.getWorkAreaDesc()!.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
        this.pageModal = 1;
        this.collectionSizeModal = this.workarea1ListShow.length
    }
    if(type == 'contractparty'){
        this.ContractpartyListShow = this.ContractpartyList!.filter(x => x.partyId!.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || x.getName()!.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 )
        this.pageModal = 1;
        this.collectionSizeModal = this.ContractpartyListShow.length
    }

  }
  openModal(modal: string, type: string) {
    this.searchText = ''
    this.pageModal = 1;
    this.pageSizeModal = 10;
    if(type == "workarea"){
        this.collectionSizeModal = this.workarea1ListShow!.length;
    }
    if(type == "jobcode"){
        this.collectionSizeModal = this.jobcodeListShow!.length;
    }
    if(type == "Contractparty"){
        this.collectionSizeModal = this.ContractpartyListShow!.length;
    }
    if(type == "Position"){
        this.collectionSizeModal = this.positionListShow!.length;
    }
    this.modalService.open(modal, { centered: true, size: 'xl' });
  }

  getSalatypeRateLists(){
    this.employeeService.getSalatypeRateLists().then(reuslt => {
        this.workarea1List = reuslt.map(  (e: any) => new SalatypeRateModel(e, this.translateService));
        this.workarea1ListShow = this.workarea1List
    })
  }

  ngOnInit(): void {
    this.getEmployeeTypeList();
    this.getSalatypeRateLists();
    this.employeeService.prefixLists().then(reuslt => {
        this.prefixList = reuslt.map((e: any) => new MyPrefixModel(e, this.translateService));
        this.modelProfile.empPrefix = this.prefixList[0]
    })
    this.employeeService.salatypeLists().then(reuslt => {
        this.salatypeLists = reuslt.map((e: any) => new SalaTypeModel(e, this.translateService));
    })
    this.workareaService.getContractparty().then(reuslt => {
        this.ContractpartyList = reuslt.map((e: any) => new ContractPartyModel(e, this.translateService));
        this.ContractpartyListShow = this.ContractpartyList
    })
    this.workareaService.getPaperList().then(reuslt => {
        this.paperList = reuslt.map((e: any) => new PaperModel(e, this.translateService));
        if(this.paperList.length > 0){
            this.slectDoc = this.paperList[0]
        }
    })
    this.employeeService.getHandicapped().then(reuslt => {
        this.handicappedList = reuslt.map(  (e: any) => new HandicappedTypeModel(e, this.translateService));
    })


    this.getuploadWFApi();
    this.getuploadFile();
    this.changeBirthDay()
  }
  getEmployeeTypeList() {
    this.workflowService.getEmployeeTypeList().then(result => {
      this.empType = result.map(e => new MyEmployeeTypeModel(e, this.translateService))
      this.cdr.markForCheck()
    })
  }
  onCheckId(type:string){
    this.responseCheckid = ''
    this.typeCheck = type
    if(type == '1'){
        this.employeeService.getIdPeople(this.modelProfile.idPeople).then(result =>{
            this.responseCheckid = result
            let messageStatus = this.translateService.currentLang == 'th'? result?.status?.tdesc:result?.status?.edesc
            let msgBlacklist = this.translateService.currentLang == 'th'? 'บัญชีดำ':'Blacklist'
            if(result?.status?.statusCode == 'A' || result?.status?.statusCode ==  'V' || result?.status?.statusCode ==  'W' || result?.blackList == 'B'){
                this.msg = result?.blackList == 'B'? msgBlacklist:this.translateService.currentLang == 'th'?result.warning:'ID card number Identical to the information in the system'
                this.modalService.open(this.alertModalCheckId, {
                  centered: true,
                  backdrop: 'static'
                })
                this.checkIdCard = true
            }else{
              this.msg = this.translateService.currentLang == 'th'?("สามารถเพิ่มข้อมูลได้ : "+result.warning ):'Can add information : ID Card number There is no duplicate infomation.'
              this.modalService.open(this.alertModalCheckId, {
                centered: true,
                backdrop: 'static'
              })
                this.checkIdCard = false
            }
        })
    }else if(type =='2'){
        this.employeeService.getadAccount(this.modelProfile.adAccount).then(result =>{
            this.responseCheckid = result
            if(this.responseCheckid.length > 0){
                this.msg = this.translateService.currentLang == 'th'? 'ไม่สามารถใช้รหัสนี้ได้':'This code cannot be used.'
                this.modalService.open(this.alertModalCheckId, {
                  centered: true,
                  backdrop: 'static'
                })
                this.checkIdAcc = true
            }else{
              this.msg = this.translateService.currentLang == 'th'? 'สามารถใช้รหัสนี้ได้':'You can use this code.'
              this.modalService.open(this.alertModalCheckId, {
                centered: true,
                backdrop: 'static'
              })
                this.checkIdAcc = false
            }
        })
    }

  }
  validateDate(dateModel: NgModel) {
    let dateValid = dateModel.model
    if (dateModel.invalid) {
      if (!isNaN(Number(dateModel.value))) { // ถ้าเป็นตัวเลขเอาไปทำฟอแมต date
        let date = new Date(dateModel.value.substring(4, 8), Number(dateModel.value.substring(2, 4)) - 1, dateModel.value.substring(0, 2))
        dateValid = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
      } else { // ถ้าเป็นตัวหนังสือให้โชว์ปัจจุบัน
        dateValid = new NgbDate(this.changeDate.getFullYear()-15, this.changeDate.getMonth() + 1, this.changeDate.getDate());
      }
    }

    this.selectBirthDay =  dateValid;
    this.changeBirthDay();
  }

  changeBirthDay(){

    let datbirthDay = this.parserFormat.format(this.selectBirthDay).replace(this.re,'-').split('-')
    let birthDate = new Date(datbirthDay[2]+"-"+datbirthDay[1]+"-"+datbirthDay[0]);
        var today = new Date();
        var birth = new Date(birthDate);

        var years = today.getFullYear() - birth.getFullYear();
        var months = today.getMonth() - birth.getMonth();
        var days = today.getDate() - birth.getDate();

        if (months < 0 || (months === 0 && days < 0)) {
          years--;
          months += 12;
        }

        if (days < 0) {
          var prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
          days += prevMonthLastDay;
          months--;
        }
        this.bYear = years
        this.bMonth= months
        this.bDay = days
  }
getJobcode(workareaId:string){
    this.employeeService.getJobSalatypeRateLists(workareaId).then(reuslt => {
        const listJob =  reuslt.map(  (e: any) => new SalatypeRateJobCodeModel(e, this.translateService));
        listJob.forEach(x =>{
            this.jobcodeList.push(x.jobcode!)
        })
        this.jobcodeListShow = this.jobcodeList
    })
}
  selectWorkarea(item:SalatypeRateModel){
    this.getJobcode(item.workarea?.workareaId!)
    this.bossModal = new SalaTypeRgm1()
    this.modelProfile.workArea = new KerryWorkareaModel({
        workareaId:item.workarea?.workareaId,
        tdesc:item.workarea?.tdesc,
        edesc:item.workarea?.edesc,
    },this.translateService)
    this.bossModal = item.workarea?.rgm1
    this.workareaId = item.workarea?.workareaId!
    this.modelProfile.bossId = item.workarea!.rgm1!.employeeId
    this.jobcodeList = []
    this.modelProfile.job = new MyJob({},this.translateService)
    this.modelProfile.empPosition = new EmpPositionModel({},this.translateService)
    this.jobId = ''
    this.positionId = ''

  }

  selectJobcode(item:Job){
    this.modelProfile.job = item
    this.jobId = item.jobcodeId!
    this.selectPosition(new EmpPositionModel(item.position))
  }

  selectContractparty(item:ContractPartyModel){
    this.modelProfile.contractParty = item
    this.counterpartyId = item.partyId
  }
  selectPosition(item:EmpPositionModel){
    this.modelProfile.empPosition = item
    this.positionId = item.positionId
  }
  closeBtnClick() {
    this.modalService.dismissAll()
  }
  clearValue(){
    this.modelProfile = new EmployeeRosterModel()
    this.handicappedCheck= false
    this.positionId = ''
    this.workareaId =''
    this.jobId =''
    this.counterpartyId='None'
    this.modelProfile.handicappedType = null
    this.resetIMG()
  }
  getuploadWFApi() {
    this.workflowService.getConfigupload().subscribe((result) => {
      this.uploadConfig = result;
    });
  }
  getuploadFile() {
    this.workflowService.getConfiguploadFile().subscribe((result) => {
      this.uploadConfigDoc = result;
    });
  }

  public async onFileSelected(event: any) {
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
        }
        else {
          await this.delay(100);
          this.onUploadPicture()
        }
      }
    }
    this.fileInput!.nativeElement.value = "";
  }
  async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  public onUploadPicture() {
    if (this.newFile) {
      let body = {
        uploadfield: "memployee.picture",
        fileName: this.uploadFilename,
        data: this.newFile,
      };
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.nameFile = 'browse_file';
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
        } else {
          this.nameFile = result.message;
          this.modelProfile.picture = this.nameFile
        }

      })
    }
    this.closeBtnClick();
  }
  //   mempl_paper.reffile เอกสาร
  public async onFileSelectedDoc(event: any) {
    var files = event.target.files;
    if (files.length > 0) {
      if (files[0].name != this.nameFileDoc) {
        var reader: any = new FileReader();
        reader = new FileReader();
        reader.onload = () => {
          const json = btoa(reader.result);
          this.newFileDoc = json;
        };
        reader.readAsBinaryString(files[0]);
        this.uploadFilenameDoc = files[0].name;
        this.uploadFileSizeDoc = files[0].size;
        if (this.uploadFileSizeDoc > this.uploadConfigDoc.maxSize) {
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
        }
        else {
          await this.delay(100);
          this.onUploadPictureDoc()
        }
      }
    }
    this.fileInputDoc!.nativeElement.value = "";
  }

  public onUploadPictureDoc() {
    if (this.nameFileDoc) {
      let body = {
        uploadfield: "mempl_paper.reffile",
        fileName: this.uploadFilenameDoc,
        data: this.newFileDoc,
      };
      this.workflowService.postuploadWF(body).subscribe((result) => {
        if (!result.success) {
          this.nameFileDoc = 'browse_file';
          this.msg = this.translateService.currentLang == "th" ? 'ไม่สามารถอัพโหลดไฟล์ได้' : 'Can not upload files.';
          this.modalService.open(this.alertModal, {
            centered: true,
            backdrop: 'static'
          });
        } else {
            const arr = this.modelProfile.paperList.map(x => parseInt(x.lineNo))
            let lineNoRun = arr.length > 0 ? Math.max(...arr) + 1 : 1
            this.modelProfile.paperList.push(new RosterPaperListModel({
                lineNo:lineNoRun.toString(),
                companyId: null,
                reffile: result.message,
                paper: new PaperModel(this.slectDoc,this.translateService)
            },this.translateService))
        //   this.nameFileDoc = result.message;
        //   this.modelProfile.reffile = this.nameFileDoc
        }
      })
    }
    this.closeBtnClick();
  }
  resetIMG() {
    this.modelProfile.picture = '';
    this.nameFile = 'browse_file';
  }
  deleteDoc(index: any) {
    this.modelProfile.paperList.splice(index, 1)
    this.modelProfile.paperList.forEach((element,i )=> {
        element.lineNo =(i+1).toString()
    });
  }
 checkAccount(){
    if(this.modelProfile.adAccount.length >0){
        this.checkIdAcc = true
    }else {
        this.checkIdAcc = false
    }

 }
 checkIdPeople(){
    this.checkIdCard = true
        if(this.modelProfile.idPeople.length == 13){
            const m = this.modelProfile.idPeople.match(/(\d{12})(\d)/)
            if (!m) {
              this.checkbtn = true
              this.checkIdCard = true
              throw new Error('บัตรประชาชนต้องมี 13 หลัก')
            }
            const digits = m[1].split('');
            const sum = digits.reduce((total: number, digit: string, i: number) => {
              return total + (13 - i) * +digit;
            }, 0)
            const lastDigit = `${(11 - sum % 11) % 10}`
            const inputLastDigit = m[2]
            if (lastDigit !== inputLastDigit) {
              console.warn('บัตรประชาชนไม่ถูกต้อง', this.modelProfile.idPeople)
              this.checkbtn = true
              this.checkIdCard = true
            }else{
                this.checkbtn = false
            }
        }else{
            this.checkbtn = true
        }
 }
  onSunmit(modal: any){
    if(this.selectBirthDay.year){
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // เดือนใน JavaScript เริ่มจาก 0 ต้อง +1
      const currentDay = currentDate.getDate();
      // คำนวณอายุจากปีเกิด
      let age = currentYear - this.selectBirthDay.year;
      // ตรวจสอบเดือนและวัน
      if (currentMonth < this.selectBirthDay.month ||
        (currentMonth === this.selectBirthDay.month && currentDay < this.selectBirthDay.day)) {
          age--; // ถ้ายังไม่ถึงวันเกิดในปีนี้ ต้องลบอายุออกอีก 1 ปี
      }

      if(age < 15){
        this.openAlertModal("กรุณากรอกวันเกิดให้ถูกต้อง!! วันเกิดต้องอายุมากกว่า 15 ปี")
       } else{
        let datestart = this.parserFormat.format(this.selectStartDate).replace(this.re,'-').split('-')
        let datbirthDay = this.parserFormat.format(this.selectBirthDay).replace(this.re,'-').split('-')
        this.modelProfile.startDate =  datestart[2]+"-"+datestart[1]+"-"+datestart[0];
        this.modelProfile.birthDay =  datbirthDay[2]+"-"+datbirthDay[1]+"-"+datbirthDay[0];
        this.modelProfile.contractParty = this.modelProfile.contractParty?.partyId?this.modelProfile.contractParty:null
        this.modelProfile.status =  new EmpStatusModel({statusCode:'V'})
        // this.openAlertModal("666!!")
        this.employeeService.postEmployeeRoster(new EmployeeRosterModel(this.modelProfile)).then(result => {
            this.responseSave = result
            if(this.responseSave){
              // this.modalService.open(modal, { centered: true, size: 'md' });
              //   this.clearValue()
              //   this.ngOnInit()

              const modalRef = this.modalService.open(modal, { centered: true, size: 'md' });
                modalRef.result.then(
                  (result) => {
                    // เมื่อปิด modal แบบ success (เช่นคลิกปุ่มยืนยัน)
                    this.clearValue();
                    this.ngOnInit();
                  },
                  (reason) => {
                    // เมื่อปิด modal แบบ dismiss (เช่นคลิกปุ่ม X หรือกด Escape)
                    this.clearValue();
                    this.ngOnInit();
                  }
                );
            }
        }).catch(error=>{
            this.responseSave = error
            console.log(error)
            // this.msg = error.createInstanceFail
            // this.modalService.open(this.alertModal, {
            //   centered: true,
            //   backdrop: 'static'
            // })
        }
      )
     }
    }else {
      this.openAlertModal("กรุณากรอกวันเกิดให้ถูกต้อง!!")
    }
  }

  textTranslate(th:string,eng:string){
    return this.translateService.currentLang == 'th'?(th.trim()||""):(eng.trim()||"")
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
