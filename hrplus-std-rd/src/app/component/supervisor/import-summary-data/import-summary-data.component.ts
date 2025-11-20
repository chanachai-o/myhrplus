import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HandicappedTypeModel } from 'src/app/models/Handicappedtype.model';
import { ContractPartyModel } from 'src/app/models/contractparty.model';
import { EmployeeRosterModel } from 'src/app/models/employeeroster.model';
import { EmployeeTypeModel, MyEmployeeTypeModel } from 'src/app/models/employeetype.model';
import { EmpPositionModel } from 'src/app/models/empposition.model';
import { EmpStatusModel } from 'src/app/models/empstatus.model';
import { EmpTypeModel } from 'src/app/models/emptype.model';
import { Job, MyJob } from 'src/app/models/job.model';
import { KerryWorkareaModel } from 'src/app/models/kerry-mix-model.model';
import { MyPrefixModel, PrefixModel } from 'src/app/models/prefixmodel.model';
import { SalaTypeModel } from 'src/app/models/salatype.model';
import { MyWorkArea, WorkArea } from 'src/app/models/workarea.model';
import { WorkArea0Model } from 'src/app/models/workarea0.model';
import { WorkAreaRgm1 } from 'src/app/models/workareargm1.model';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { WorkAreaService } from 'src/app/services/workarea.service';
import { workflowService } from 'src/app/services/workflow.service';
import * as XLSX from 'xlsx-js-style';
const FileSaver = require('file-saver');
@Component({
    selector: 'app-import-summary-data',
    templateUrl: './import-summary-data.component.html',
    styleUrls: ['./import-summary-data.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule],
})
export class ImportSummaryDataComponent implements OnInit {
    @ViewChild('alertModal') alertModal: undefined
    @ViewChild('checkModal') checkModal: undefined
    @ViewChild('fileInput') fileInput: ElementRef | undefined;
    arrayBuffer: any;
    file?: File;
    loading = false;
    disabledbtn = true
    nameFile: string = "browse_file";
    modelProfile: EmployeeRosterModel[] = []
    modelProfileList: EmployeeRosterModel[] = []
    unableProfileList: EmployeeRosterModel[] = []
    data = []
    msg = ''
    checkIdCard = false;
    positionList: EmpPositionModel[] = []
    prefixList: PrefixModel[] = []
    handicappedList: HandicappedTypeModel[] = []
    jobcodeList: Job[] = []
    listEmpWorking: WorkingsModel[] | undefined
    salatypeLists: SalaTypeModel[] = []
    ContractpartyList: ContractPartyModel[] = []
    workarea1List: WorkAreaRgm1[] = []
    empType: EmployeeTypeModel[] = []
    templateFile?: Blob
    re = /\//gi;
    checkModel?:{}
    loadingJob=false;
    constructor(public translateService: TranslateService,
        private employeeService: EmployeeService,
        private workareaService: WorkAreaService,
        private workflowService: workflowService,
        private cdr: ChangeDetectorRef,
        private modalService: NgbModal,
        private http: HttpClient,
        private parserFormat: NgbDateParserFormatter) { }

    ngOnInit() {
        this.http
            .get("/assets/template/Example_Import.xlsx", { responseType: "blob" })
            .subscribe(
                (data) => {
                    this.templateFile = data
                },
                (error: ErrorEvent) => {
                    alert(error.message);
                }
            );

        this.employeeService.positionLists().then(result => {
            this.positionList = result.map((e: any) => new EmpPositionModel(e, this.translateService));
        })
        this.employeeService.prefixLists().then(result => {
            this.prefixList = result.map((e: any) => new MyPrefixModel(e, this.translateService));
        })
        this.employeeService.salatypeLists().then(result => {
            this.salatypeLists = result.map((e: any) => new SalaTypeModel(e, this.translateService));
        })
        this.workareaService.getContractparty().then(result => {
            this.ContractpartyList = result.map((e: any) => new ContractPartyModel(e, this.translateService));
        })
        this.workareaService.getJobcode().then(result => {
            this.jobcodeList = result.map((e: any) => new MyJob(e, this.translateService));
            this.jobcodeList =  this.jobcodeList.filter(x => x.branch?.branchId != null)
            this.loadingJob = true
        })
        this.employeeService.getHandicapped().then(result => {
            this.handicappedList = result.map((e: any) => new HandicappedTypeModel(e, this.translateService));
        })
        this.workareaService.getAllWorkarea().toPromise().then(reuslt => {
            this.workarea1List = reuslt.map(  (e: any) => new WorkAreaRgm1(e, this.translateService));
        })

 
        this.workflowService.getEmployeeTypeList().then(result => {
            this.empType = result.map(e => new MyEmployeeTypeModel(e, this.translateService))
            this.cdr.markForCheck()
        })
    }

    onFileChange(event: any) {
        if (event.length > 0) {
            this.onClear();
            this.loading = true
            this.file = event[0];
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.arrayBuffer = fileReader.result;
                var data = new Uint8Array(this.arrayBuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                var bstr = arr.join("");
                var workbook = XLSX.read(bstr, { type: "binary" });
                var first_sheet_name = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet_name];
                this.data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
                console.log("data",this.data)
                this.data.forEach((e: any) => {
                    let workareaFilter = this.workarea1List.filter(i => i.workareaId == e.WORKAREA)[0]
                    this.modelProfile.push(new EmployeeRosterModel({
                        employeeId:e.EMPLOYEEID?e.EMPLOYEEID:'',
                        adAccount:e.AD_ACCOUNT?e.AD_ACCOUNT:'',
                        companyId: e.COMPANYID?e.COMPANYID:'',
                        picture: e.PICTURE?e.PICTURE:'',
                        fname: e.FNAME?e.FNAME:'',
                        lname: e.LNAME?e.LNAME:'',
                        efname: e.EFNAME?e.EFNAME:'',
                        elname: e.ELNAME?e.ELNAME:'',
                        idPeople: e.ID_PEOPLE?e.ID_PEOPLE:'',
                        swipecardId: e.SWIPECARDID?e.SWIPECARDID:'',
                        isHandicapped: e.ISHANDICAPPED?e.ISHANDICAPPED:'',
                        birthDay: e.BIRTHDAY?e.BIRTHDAY:'',
                        startDate: e.STARTDATE?e.STARTDATE:'',
                        bossId: e.BOSSID?e.BOSSID:'',
                        email: e.EMAIL?e.EMAIL:'',
                        telNo: e.TEL_NO?e.TEL_NO:'',
                        paperList: [],
                        empPosition: this.positionList.filter(i => i.positionId == e.EMP_POSITION)[0],
                        job: this.jobcodeList.filter(i => i.jobcodeId == e.JOB)[0],
                        empPrefix: this.prefixList.filter(i => i.prefixId == e.EMP_PREFIX)[0],
                        contractParty: this.ContractpartyList.filter(i => i.partyId == e.CONTRACT_PARTY)[0],
                        salaType: this.salatypeLists.filter(i => i.codeId == e.SALATYPE)[0],
                        handicappedType: this.handicappedList.filter(i => i.handicappedTypeId == e.HANDICAPPEDTYPE)[0],
                        workArea: workareaFilter? new KerryWorkareaModel({
                            workareaId:workareaFilter.workareaId,
                            tdesc:workareaFilter.tdesc,
                            edesc:workareaFilter.edesc,
                        }): new KerryWorkareaModel ({}),
                        // workArea: ,
                        empType: new EmpTypeModel(this.empType.filter(i => i.codeId == e.EMP_TYPE)[0]),
                        status: new EmpStatusModel({
                            statusCode: e.STATUS
                        }),
                        checkId:this.jobcodeList.filter(i => i.jobcodeId == e.JOB)[0]?false:true
                    },this.translateService))
                })
                this.onCheckId();
            }

            fileReader.readAsArrayBuffer(this.file!);
            this.nameFile = this.file!.name
        }
        this.fileInput!.nativeElement.value = "";
    }
    onCheckId() {
        this.modelProfile.forEach(i => {
            if(i.checkId == false){
                if(i.adAccount){
                    this.employeeService.getadAccount(i.adAccount).then(result =>{
                        if(result.length > 0){
                            i.adAccount ='ข้อมูลซ้ำ'
                            i.checkId = true
                        }
                    })
                }
                const m = i.idPeople.match(/(\d{12})(\d)/)
                if (!m) {
                    i['msgStatus'] = this.translateService.currentLang == 'th'?'บัตรประจำตัวประชาชนต้องมี 13 หลัก':'ID Card Must Be 13 digits'
                    return i.checkId = true
                }
                const digits = m[1].split('');
                const sum = digits.reduce((total: number, digit: string, i: number) => {
                  return total + (13 - i) * +digit;
                }, 0)
                const lastDigit = `${(11 - sum % 11) % 10}`
                const inputLastDigit = m[2]
                if (lastDigit !== inputLastDigit) {
                    i['msgStatus'] = this.translateService.currentLang == 'th' ? 'บัตรประจำตัวประชาชนไม่ถูกต้อง':'Invalid ID card'
                    return i.checkId = true
                }else{
                    this.employeeService.getIdPeople(i.idPeople).then(result => {
                        console.log("🔎 ~ file: import-summary-data.component.ts:201 ~ result:", result)
                        let messageStatus = ''
                        if(!i.employeeId || !i.fname || !i.lname || !i.efname || !i.elname || !i.salaType || !i.birthDay ||i.adAccount =='ข้อมูลซ้ำ'){
                            messageStatus = 'โปรดตรวจสอบข้อมูลให้ถูกต้อง'
                        } else  if(i.idPeople.length != 13 || result?.status?.statusCode == 'A' || result?.status?.statusCode ==  'V' || result?.status?.statusCode ==  'W' || result?.blackList == 'B'){
                            messageStatus = this.translateService.currentLang == 'th'? result?.status?.tdesc:result?.status?.edesc
                        }  
                        let msgBlacklist = this.translateService.currentLang == 'th'? 'บัญชีดำ':'Blacklist'
                        i.checkId = (i.idPeople.length != 13 || result?.status?.statusCode == 'A' || result?.status?.statusCode ==  'V' || result?.status?.statusCode ==  'W' || result?.blackList == 'B' || !i.employeeId || !i.fname || !i.lname || !i.efname || !i.elname || !i.salaType || !i.birthDay ||i.adAccount =='ข้อมูลซ้ำ') ? true : false
                        if(( i.idPeople.length != 13 || result?.status?.statusCode == 'A' || result?.status?.statusCode ==  'V' || result?.status?.statusCode ==  'W' || result?.status?.statusCode == 'Y'|| result?.blackList == 'B')){
                            i['msgStatus'] = (result?.blackList == 'B'? msgBlacklist:result.warning + (result?.status ? ","+ messageStatus : "" ))
                        } else if(!i.employeeId || !i.fname || !i.lname || !i.efname || !i.elname || !i.salaType || !i.birthDay ){
                            i['msgStatus'] = 'โปรดตรวจสอบข้อมูลให้ถูกต้อง'
                        } else if(i.adAccount =='ข้อมูลซ้ำ'){
                            i['msgStatus'] = 'รหัส AD_ACCOUNT มีข้อมูลซ้ำกับในระบบ'
                        }
                        this.loading = false
                        this.disabledbtn = false
                    })
                    
                }
            } else{
                i['msgStatus'] = this.translateService.currentLang == 'th' ? 'รหัสงานไม่ถูกต้อง':'Invalid Job Id'
            }
            this.loading = false
        })
    }
    openCheckError(item:any){
        console.log(item)
         this.checkModel = {
            adAccount:item.adAccount?item.adAccount:'',
            birthDay:item.birthDay?item.birthDay:'',
            bossId:item.bossId?item.bossId:'',
            checkId:item.checkId?item.checkId:'',
            companyId:item.companyId?item.companyId:'',
            contractParty:item.contractParty?item.contractParty:'',
            efname:item.efname?item.efname:'',
            elname:item.elname?item.elname:'',
            email:item.email?item.email:'',
            empPosition:item.empPosition?item.empPosition:'',
            empPrefix:item.empPrefix?item.empPrefix:'',
            empType:item.empType?item.empType:'',
            employeeId:item.employeeId?item.employeeId:'',
            fname:item.fname?item.fname:'',
            lname:item.lname?item.lname:'',
            handicappedType:item.handicappedType?item.handicappedType:'',
            idPeople:item.idPeople?item.idPeople:'',
            isHandicapped:item.isHandicapped?item.isHandicapped:'',
            job:item.job?item.job:'',
            msgStatus:item.msgStatus?item.msgStatus:'',
            salaType:item.salaType?item.salaType:'',
            startDate:item.startDate?item.startDate:'',
            swipecardId:item.swipecardId?item.swipecardId:'',
            telNo:item.telNo?item.telNo:'',
            workArea:item.workArea?item.workArea:''
        }
        this.modalService.open(this.checkModal, {
            centered: true,size:'lg'
        })
    }
    onClear(){
        this.nameFile = ''
        this.modelProfile = []
        this.modelProfileList = []
        this.file = undefined
    }
    showexample() {
        // this.example = !this.example;
        FileSaver.saveAs(this.templateFile, "Example_Import.xlsx");
    }
    onSunmit() {
        this.modelProfile.forEach(x => {
            delete x['msgStatus'];
        })
        this.unableProfileList = this.modelProfile.filter(x => x.checkId == true)
        this.modelProfileList = this.modelProfile.filter(x => x.checkId == false)
        this.modelProfileList = this.modelProfileList.map((e: any) => new EmployeeRosterModel({ ...e, checkId: undefined }))
        this.employeeService.postEmployeeRosterImport(this.modelProfileList).then(result => {
            this.msg = this.translateService.currentLang == 'th' ? "บันทึกข้อมูล เชื่อมต่อZeeMe และประมวลผลสำเร็จ" : result.message
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            }).result.then(
                (result) => {
                    if(result == 'Close'){
                        this.onClear();
                        this.disabledbtn = true
                        this.ngOnInit();
                    }
                },
                (reason) => {
                 
                },
            );
  
        }).catch(error => {
            this.msg = error.error.error
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
        })

    }

}
