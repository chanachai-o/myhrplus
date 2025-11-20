import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InboxModel, InboxDetailModel } from '../models/workflow.model';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RequireWFModel, MyRequireWFModel } from '../models/requireWF.model'
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MyWorkflowMain, WorkFlowMain } from '../models/workflowmain.model';
import { MySendtoModel, SendtoModel } from '../models/sendtomodel.model';
import { UploadGetmodel } from '../models/uploadget.model'
import { ForgetTime, MyForgetTime } from '../models/forgettime.model'
import { Country } from '../models/country.model';
import { Employee, MyEmployee, Salatype } from '../models/employee.model';
import { ShiftModel } from '../models/shiftmodel.model'
import { TrainIn } from '../models/trainin.model';
import { TrainCost } from '../models/traincost.model';
import { ChangeMoneyModel, MyChangeMoneyModel } from '../models/changemoney.model';
import { Degree } from '../models/degree.model';
import { Institue } from '../models/institue.model';
import { Faculty } from '../models/faculty.model';
import { Major } from '../models/major.model';
import { Zipcode } from '../models/zipcode.model';
import { WelfareDialogModel } from '../models/welfaredia.model'
import { ShiftListModel } from '../models/shiftlist.model'
import { ZipcodeObject } from '../models/zipcodeObject.model';
import { ShiftListTimeModel } from '../models/shiftlisttime.model';
import { WorkModel } from '../models/work.model';
import { Prefix } from '../models/prefix.model';
import { WorkflowMenuModel } from '../models/workflowmenu.model';
import { EmployeeProfileAllModel } from '../models/employeeprofileall.model';
import { Branch } from '../models/branch.model';
import { Bu1 } from '../models/bu1.model';
import { Bu2 } from '../models/bu2.model';
import { Bu3 } from '../models/bu3.model';
import { Bu4 } from '../models/bu4.model';
import { Bu5 } from '../models/bu5.model';
import { Position } from '../models/position.model';
import { Job } from '../models/job.model';
import { EmployeeTypeModel } from '../models/employeetype.model';
import { AnyAaaaRecord } from 'dns';
import { SystemCodeReqtypeModel } from '../models/systemcodereqtype.model';
import { WorkingsModel } from '../models/workingmodel.model';
import { HolidayList } from '../models/holidaylist.Model';
import { CertificateTemplate } from '../models/certificatetemplate.model';
import { Welfare } from '../models/Welfare.model';
import { Sitewel } from '../models/sitewel.model';
import { WelfareViewModel } from '../models/welfareview.model';
import { EventgrpLeave } from '../models/eventgrpleave.model';
import { ReasonModel } from '../models/reason.model';
import { ReasonOtModel } from '../models/reason-ot.model';
import { WorkflowRemark } from '../models/workflowremark.model';
import { MyFamilyLists } from '../models/familylists.model';
import { ShiftTimeListModel } from '../models/shiftimelist.model';
import { MyWorkflowModel, WorkflowModel, WorkflowPageModel } from '../models/workflowmodel.model';
import { WorkflowPositionPageModel } from '../models/workflowposition.model';
import { WorkflowDefinitionModel } from '../models/workflowdefinition.model';
import { WorkflowRemarkModel } from '../models/workflowremarkmodel.model';
import { KerryCertificateModel } from '../models/kerry-mix-model.model';
import { EncodeCyptoService } from './encode-cypto.service';
import { PageModel } from '../models/page.model';
import { CommandLineModel } from '../models/commandline.model';
import { Bu2Model } from '../models/bu2model.model';
import { CommandLineReportModel } from '../models/commandline-report.model';
import { CostcenterModel } from '../models/costcentermodel.model';
import { ProjectModel } from '../models/projectmodel.model';
import { WelfareGroupModel } from '../models/welfare-group.model';

@Injectable({
  providedIn: 'root',
})
export class workflowService {
  lang: string = "";
  createStatus: boolean = true
  constructor(private http: HttpClient,
    private router: Router,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private cyptoService: EncodeCyptoService) {
  }

  createWF(wfModel: any): Observable<boolean> {
    if (this.createStatus) {
      this.createStatus = false
      return this.http.post(environment.jbossUrl + '/wapi/workflow', wfModel, { observe: 'response' })
        .pipe(
          tap(x => this.createStatus = true),
          map(r => r.status == 200)
        );
    } else {
      return of(false)
    }
  }
  getInboxList(page: number, textSearch: string): Observable<InboxModel> {
    return this.http.get<InboxModel>(environment.jbossUrl + '/wapi/mynote/inbox-myhr?size=500&page=' + page + textSearch);
  }

  getInboxListByPage(page: number, textSearch: string): Promise<InboxModel> {
    return new Promise((resolve, reject) => {
      this.http
        .get<InboxModel>(
          environment.jbossUrl + '/wapi/mynote/inbox-myhr?size=50&page=' + page + textSearch
        )
        .subscribe(data => {
          // console.log(data);
          resolve(data);
        });
    });
  }


  getOutboxList(page: number, textSearch: string): Observable<InboxModel> {
    return this.http.get<InboxModel>(environment.jbossUrl + '/wapi/mynote/sentbox-myhr?size=500&page=' + page + textSearch);
  }

  getOutboxByPage(page: number, textSearch: string): Promise<InboxModel> {
    return new Promise((resolve, reject) => {
      this.http
        .get<InboxModel>(
          environment.jbossUrl + '/wapi/mynote/sentbox-myhr?size=50&page=' + page + textSearch
        )
        .subscribe(data => {
          // console.log(data);
          resolve(data);
        });
    });
  }

  getSharedboxList(page: number, textSearch: string): Observable<InboxModel> {
    return this.http.get<InboxModel>(environment.jbossUrl + '/wapi/mynote/sharebox?size=500&page=' + page + textSearch);
  }

  getShareboxListByPage(page: number, textSearch: string): Promise<InboxModel> {
    return new Promise((resolve, reject) => {
      this.http
        .get<InboxModel>(
          environment.jbossUrl + '/wapi/mynote/sharebox?size=50&page=' + page + textSearch
        )
        .subscribe(data => {
          // console.log(data);
          resolve(data);
        });
    });
  }




  approveWF(wfModel: any): Observable<boolean> {
    return this.http.post(environment.jbossUrl + '/wapi/workflow/approve', wfModel, { observe: 'response' })
      .pipe(
        map(r => r.status == 200)
      );
  }

  disapproveWF(wfModel: any): Observable<boolean> {
    return this.http.post(environment.jbossUrl + '/wapi/workflow/disapprove', wfModel, { observe: 'response' })
      .pipe(
        map(r => r.status == 200)
      );
  }

  returnWF(wfModel: any) {
    return this.http.post(environment.jbossUrl + '/wapi/workflow/return', wfModel, { observe: 'response' })
      .pipe(
        map(r => r.status == 200)
      );
  }
  //----
  checkWF(wfModel: any): Observable<string> {
    return this.http.post<string>(environment.jbossUrl + '/taapi/leave/check', wfModel, { observe: 'response' }
    )
      .pipe(
        map((r: any) => r.body)
      );
  }
  calculate(body: any): Promise<String> {
    return new Promise((resolve, reject) => {
      this.http.post<String>(environment.jbossUrl + "/taapi/leave/check", body)
        .subscribe((response: any) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }

  cancelWF(wfModel: any): Observable<boolean> {
    return this.http.post(environment.jbossUrl + '/wapi/workflow/cancel', wfModel, { observe: 'response' })
      .pipe(
        map(r => r.status == 200)
      );
  }

  postuploadWF(wfModel: any): Observable<any> {
    return this.http.post<string>(environment.jbossUrl + '/wapi/workflow/uploadfile', wfModel, { observe: 'response' }
    )
      .pipe(
        map(r => r.body)
      );
  }


  requireWF(): Observable<RequireWFModel> {
    return this.http
      .get<RequireWFModel>(environment.jbossUrl + '/taapi/leave/require')
      .pipe(map((test) => this.convertTorequireWF(test)));
  }
  private convertTorequireWF(dataModel: any): RequireWFModel {
    const data = {
      eventgrp: dataModel.eventgrp,
      statistic: dataModel.statistic,
    };

    const model = new MyRequireWFModel(data, this.translateService);
    return model;
  }

  workflowNo(wfnum: any): Observable<WorkFlowMain> {
    return this.http
      .get<WorkFlowMain>(environment.jbossUrl + '/wapi/workflow/' + wfnum)
      .pipe(map((test) => this.convertToWF(test)));
  }

  private convertToWF(dataModel: any): WorkFlowMain {
    const data = {
      workflowData: dataModel.workflowData,
      manageDocument: dataModel.manageDocument,
    };

    const model = new MyWorkflowMain(data, this.translateService);
    return model;
  }

  sendtoWF(wfid: any): Observable<SendtoModel> {
    return this.http
      .get<SendtoModel>(environment.jbossUrl + '/wapi/workflow/sendto/wfid/' + wfid)
      .pipe(map((e) => new MySendtoModel(e, this.translateService)));
  }

  getuploadWF(): Observable<UploadGetmodel> {
    return this.http
      .get<UploadGetmodel>(environment.jbossUrl + '/wapi/workflow/uploadfile/attached_file_temp.file_name')
      .pipe(map((test) => this.convertToUploadGet(test)));
  }
  getConfigupload(): Observable<UploadGetmodel> {
    return this.http
      .get<UploadGetmodel>(environment.jbossUrl + '/wapi/workflow/uploadfile/memployee.picture')
      .pipe(map((test) => this.convertToUploadGet(test)));
  }
  getConfiguploadFile(): Observable<UploadGetmodel> {
    return this.http
      .get<UploadGetmodel>(environment.jbossUrl + '/wapi/workflow/uploadfile/mempl_paper.reffile')
      .pipe(map((test) => this.convertToUploadGet(test)));
  }
  private convertToUploadGet(dataModel: any): UploadGetmodel {
    const data = {
      uploadfield: dataModel.uploadfield,
      filter: dataModel.filter,
      maxSize: dataModel.maxSize,
    }
    return data;
  }

  getForgetTime(start: any, end: any, empId?: any): Observable<ForgetTime[]> {
    if (empId) {
      return this.http.get<ForgetTime[]>('/forgetcard/timeerror/start/' + start + '/end/' + end + '?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any[]) => x.map((test) => this.convertForgetTime(test))));
    } else {
      return this.http.get<ForgetTime[]>('/forgetcard/timeerror/start/' + start + '/end/' + end)
        .pipe(map((x: any[]) => x.map((test) => this.convertForgetTime(test))));
    }
  }

  private convertForgetTime(dataModel: any): ForgetTime {
    const data = {
      dateId: dataModel.dateId,
      time0: dataModel.time0,
      dateError: dataModel.dateError,
      timeError: dataModel.timeError,
      codeError: dataModel.codeError,
    }
    const model = new MyForgetTime(data, this.translateService);
    return model;
  }

  getCountry(): Observable<Country[]> {
    return this.http.get<Country[]>('/country/lists')
      .pipe(map((x: any[]) => x.map((test) => this.convertCountry(test))));;
  }

  private convertCountry(dataModel: any): Country {
    const data = {
      countryId: dataModel.countryId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc
    }
    return data;
  }

  getEmpHr(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>('/employee/line')
      .pipe(map((x: any[]) => x.map((test) => this.convertToEmpHr(test))));
  }
  private convertToEmpHr(dataModel: any): Employee {
    const data = {
      employeeId: dataModel.employeeId,
      prefix: dataModel.prefix,
      fname: dataModel.fname,
      lname: dataModel.lname,
      efname: dataModel.efname,
      elname: dataModel.elname,
      bu1: dataModel.bu1,
      bu2: dataModel.bu2,
      bu3: dataModel.bu3,
      bu4: dataModel.bu4,
      bu5: dataModel.bu5,
      bu6: dataModel.bu6,
      bu7: dataModel.bu7,
      workarea: dataModel.workarea,
      position: dataModel.position,
      job: dataModel.job,
      type: dataModel.type,
      group: dataModel.group,
      costcenter: dataModel.costcenter,
      bossId: dataModel.bossId,
      time0: dataModel.time0,
      branch: dataModel.branch,
      telExt: dataModel.telExt,
      status: dataModel.status,
      startDate: dataModel.startDate,
      picture: dataModel.picture,
      firstHiredate: dataModel.firstHiredate,
      approveDate: dataModel.approveDate
    }

    return data;
  }

  getEmpCenter(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>('/employee/empcenter')
      .pipe(map((x: any[]) => x.map((test) => this.convertToEmpHr(test))));
  }


  getShift(): Observable<ShiftModel[]> {
    return this.http
      .get<ShiftModel[]>(environment.jbossUrl + '/taapi/chshift/shift/lists?employeeId=410305&startDate=20-05-2021&endDate=20-05-2021')
      .pipe(map((x: any[]) => x.map((test) => this.convertToShift(test))));
  }
  getShift2(): Observable<ShiftModel> {
    return this.http
      .get<ShiftModel>(environment.jbossUrl + '/taapi/chshift/shift/lists?employeeId=410305&startDate=20-05-2021&endDate=20-05-2021')
      .pipe(map((test) => this.convertToShift(test)));
  }
  private convertToShift(dataModel: any): ShiftModel {
    const data = {
      time0id: dataModel.time0id,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      status: dataModel.status
    }
    return data;
  }

  getTrainIn(): Observable<TrainIn[]> {
    return this.http
      .get<TrainIn[]>('/training/lists')
      .pipe(map((x: any[]) => x.map((test) => this.convertToTrainIn(test))));
  }

  getTrainInฺById(traningId: string): Observable<TrainIn> {
    return this.http
      .get<TrainIn>('/training/' + traningId)
      .pipe(map((x: any) => this.convertToTrainIn(x)));
  }

  private convertToTrainIn(dataModel: any): TrainIn {
    const data = {
      trainingId: dataModel.trainingId,
      title: dataModel.title,
      status: dataModel.status,
      resDateFrm: dataModel.resDateFrm,
      resDateTo: dataModel.resDateTo,
      classDateFrm: dataModel.classDateFrm,
      classDateTo: dataModel.classDateTo,
      academy: dataModel.academy,
      location: dataModel.location,
      room: dataModel.room,
      course: dataModel.course,
      timeStart: dataModel.timeStart,
      timeStop: dataModel.timeStop,
      classHour: dataModel.classHour,
      trainType: dataModel.trainType,
      memo: dataModel.memo
    }
    return data;
  }

  getCourseCost(trainId: any): Observable<TrainCost[]> {
    return this.http
      .get<TrainCost[]>('/trainexp/' + trainId)
      .pipe(map((x: any[]) => x.map((test) => this.convertToCourseCost(test))));
  }

  private convertToCourseCost(dataModel: any): TrainCost {
    const data = {
      trainingId: dataModel.trainingId,
      expense: dataModel.expense,
      expGrp: dataModel.expGrp,
      expensePerCapita: dataModel.expensePerCapita,
      estimate: dataModel.estimate,
      used: dataModel.used
    }
    return data;
  }

  getCourseEmp(trainId: any): Observable<Employee[]> {
    return this.http
      .get<Employee[]>('/training/' + trainId + '/employee/working')
      .pipe(map((x: any[]) => x.map((test) => this.convertToCourseEmp(test))));
  }

  private convertToCourseEmp(dataModel: any): Employee {
    const data = {
      employeeId: dataModel.employeeId,
      prefix: dataModel.prefix,
      fname: dataModel.fname,
      lname: dataModel.lname,
      efname: dataModel.efname,
      elname: dataModel.elname,
      bu1: dataModel.bu1,
      bu2: dataModel.bu2,
      bu3: dataModel.bu3,
      bu4: dataModel.bu4,
      bu5: dataModel.bu5,
      workarea: dataModel.workarea,
      position: dataModel.position,
      job: dataModel.job,
      type: dataModel.type,
      group: dataModel.group,
      costcenter: dataModel.costcenter,
      bossId: dataModel.bossId,
      time0: dataModel.time0,
      branch: dataModel.branch,
      telExt: dataModel.telExt,
      status: dataModel.status,
      startDate: dataModel.startDate,
      picture: dataModel.picture,
      firstHiredate: dataModel.firstHiredate,
      approveDate: dataModel.approveDate
    }
    const model = new MyEmployee(data, this.translateService);
    return model;
  }

  getZipcode(): Observable<Zipcode[]> {
    return this.http
      .get<Zipcode[]>('/zipcode/lists')
      .pipe(map((x: any[]) => x.map((test) => this.convertToZipcode(test))));
  }

  private convertToZipcode(dataModel: any): Zipcode {
    const data = {
      zipcodeId: dataModel.zipcodeId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      province: dataModel.province
    }
    return data;
  }
  getWelfareDialog(): Observable<WelfareDialogModel[]> {
    return this.http
      .get<WelfareDialogModel[]>(environment.jbossUrl + '/welapi/welfare/workflow')
      .pipe(map((x: any[]) => x.map((test) => this.convertToWelfareDia(test))));
  }
  private convertToWelfareDia(dataModel: any): WelfareDialogModel {
    const data = {
      welId: dataModel.welId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      welgId: dataModel.welgId,
      weltId: dataModel.weltId,
      whouse: dataModel.whouse,
      finishTime: dataModel.finishTime,
      isEducation: dataModel.isEducation,
      tDetail: dataModel.tDetail,
      eDetail: dataModel.eDetail,
      remark: dataModel.remark,
      budId: dataModel.budId,
      docgid: dataModel.docgid,
      welqty: dataModel.welqty
    }
    return data;
  }

  downloadFile(subfolder: string, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          environment.jbossUrl +
          "/wapi/workflow/download?uploadfield=attached_file.file_name&subfolder=" +
          subfolder +
          "&filename=" +
          filename,
          { responseType: "blob" }
        )
        .subscribe((response: any) => {
          resolve(response);
        });
    });
  }

  getShiftList(): Promise<ShiftListModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<ShiftListModel[]>(environment.baseUrl + "/time0/lists?status=0")
        .subscribe((data) => {
          let dataFilter = data.filter(e => { return e.time0id != "OFF" && e.time0id != "DEFAULT" })
          resolve(dataFilter);
        }, (error) => {
          reject(error);
        })
    })
  }

  getShiftListSup(shift: string): Promise<ShiftListModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/time0/subordinates/lists/" + shift)
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getShiftChangeList(emp?: string): Promise<ShiftListModel[]> {
    if (emp) {
      return new Promise((resolve, reject) => {
        this.http
          .get(environment.baseUrl + "/mempltime0trans/lists?employeeid=" + this.cyptoService.encryptUsingAES256(emp))
          .subscribe(
            (data: any) => {
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    } else {
      return Promise.reject(new Error("Employee ID is required."));
    }
  }
  

  getShiftListAll(shift: string): Promise<ShiftListModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<ShiftListModel[]>(environment.baseUrl + "/time0/lists/?status=" + shift)
        .subscribe(data => {
          let dataFilter = data.filter(e => { return e.time0id != "OFF" && e.time0id != "DEFAULT" })
          resolve(dataFilter);
        });
    });
  }

  postShiftListSup(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(environment.jbossUrl + "/taapi/working-time/save-time2", body)
        .subscribe((data: any) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
    });
  }

  getShiftListPlan(timeid: string, year: string, month: string): Promise<ShiftTimeListModel> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/time2/" + timeid + "/" + year + "/" + month)
        .subscribe((data: any) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
    });
  }

  getShiftListTime(start: string, end: string, shift: string, emp?: string): Promise<ShiftListTimeModel[]> {
    if (emp) {
      return new Promise((resolve, reject) => {
        this.http
          .get(environment.jbossUrl + "/taapi/working-time/working-plan/start/" + start + "/end/" + end + "/shift/" + shift + "?employeeid=" + this.cyptoService.encryptUsingAES256(emp))
          .subscribe((data: any) => {
            resolve(data);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.http
          .get(environment.jbossUrl + "/taapi/working-time/working-plan/start/" + start + "/end/" + end + "/shift/" + shift)
          .subscribe((data: any) => {
            resolve(data);
          });
      });
    }

  }

  getShiftListTimeBypass(start: string, end: string, shift: string, emp?: string): Promise<ShiftListTimeModel[]> {
    if (emp) {
      return new Promise((resolve, reject) => {
        this.http
          .get(environment.jbossUrl + "/taapi/working-time/working-plan/bypass/start/" + start + "/end/" + end + "/shift/" + shift + "?employeeid=" + this.cyptoService.encryptUsingAES256(emp))
          .subscribe((data: any) => {
            resolve(data);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.http
          .get(environment.jbossUrl + "/taapi/working-time/working-plan/bypass/start/" + start + "/end/" + end + "/shift/" + shift)
          .subscribe((data: any) => {
            resolve(data);
          });
      });
    }

  }

  getWork(): Promise<WorkModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/occupation/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }





  getEmployeeAllProfile(empid: string): Promise<EmployeeProfileAllModel> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.jbossUrl + "/wapi/employee/employee-profile/" + empid)
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getPrefix(): Promise<Prefix[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/prefix/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
  getDegree(): Promise<Degree[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/degree/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
  getInstitue(): Promise<Institue[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/institue/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
  getFaculty(): Promise<Faculty[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/faculty/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
  getMajor(): Promise<Major[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/major/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getZipcodeObject(): Promise<ZipcodeObject[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.jbossUrl + "/wapi/employee/get-list-zipcode")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getCourseEmp2(trainId: string): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + '/training/' + trainId + '/employee/working')
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getChangeMoney(): Promise<ChangeMoneyModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + '/fundtable0/lists')
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getFundList(): Promise<ChangeMoneyModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + '/fund/lists')
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
  getCheckFund(fundTableId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + '/mempl-pvf/' + fundTableId)
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
  getEmpWorkingList(): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employees/workings/list")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
  getEmpHireList(): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employee/hire/list")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getBranchList(): Promise<Branch[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/branch/lists")
        .subscribe((data: any) => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    });
  }

  getBu1List(): Promise<Bu1[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/bu1/lists")
        .subscribe((data: any) => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    });
  }

  getBu2List(): Promise<Bu2[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/bu2/lists")
        .subscribe((data: any) => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    });
  }

  getBu3List(): Promise<Bu3[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/bu3/lists")
        .subscribe((data: any) => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    });
  }

  getBu4List(): Promise<Bu4[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/bu4/lists")
        .subscribe((data: any) => {
          resolve(data);
        }, (error: any) => {
          reject(error)
        })
    });
  }

  getBu5List(): Promise<Bu5[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/bu5/lists")
        .subscribe((data: any) => {
          resolve(data);
        }, (error) => {
          reject(error);
        })
    })
  }

  getPositionList(): Promise<Position[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/position/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getJobcodeList(): Promise<Job[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/jobcode/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getEmployeeTypeList(): Promise<EmployeeTypeModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employee-type/lists")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getSystemCodeReqtype(): Promise<SystemCodeReqtypeModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/system-code/req-type")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getEmpHr2(): Promise<WorkingsModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employee/line")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getSubordinatesList(): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employee/subordinates/list")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getSubordinatesBoss(): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employee/bossid/subordinates/list")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }
  getEmployeeBranch(branchId: string): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employee/branch?branchId=" + branchId)
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getSubordinatesPage(page: number): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employee/subordinates/page?page=" + page)
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  //startdate ย้อนหลัง 4 เดือน enddate เป็นวันปัจจุบัน
  getHoliday(startDate: string, endDate: string, empId?: string): Promise<HolidayList[]> {
    return new Promise((resolve, reject) => {
      if (empId) {
        this.http
          .get(environment.jbossUrl + "/taapi/working-time/switch-holiday/lists?employeeid=" + this.cyptoService.encryptUsingAES256(empId))
          .subscribe((data: any) => {
            resolve(data);
          });
      } else {
        this.http
          .get(environment.jbossUrl + "/taapi/working-time/switch-holiday/lists")
          .subscribe((data: any) => {
            resolve(data);
          });
      }

    });
  }


  getCertificateTemplateLists(): Promise<CertificateTemplate[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/certificate-template/lists")
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }


  getWelfareLists(): Promise<Welfare[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/welfare/lists/workflow")
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }
  getWelfareListsById(welfareId : string): Promise<Welfare[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/welfare/lists/workflow/"+welfareId)
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }
  getWelfareGrpLists(): Promise<WelfareGroupModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/welfare/lists/welfaregrp")
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }
  getFamilyLists(): Promise<MyFamilyLists[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/family/lists/wfwelfare")
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }
  getSitewelLists(): Promise<Sitewel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/sitewel/lists")
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }

  viewWelfare(budgetYear: string, start_wel: string, empId: string): Promise<WelfareViewModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/welfare/complain/history/complete?budgetYear=" + budgetYear + "&start_wel=" + start_wel + "&end_wel=" + start_wel + "&sort=occurDate,DESC&employeeid=" + this.cyptoService.encryptUsingAES256(empId))
        .subscribe((data: any) => {
          resolve(data["content"]);
        });
    })
  }

  requestCancelInitiator(empId: string, page: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/workflow/request-cancel?initiator=" + empId + "&size=500&page=" + page)
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }

  requestCancelBoss(empId: string, page: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/workflow/request-cancel?boss=" + empId + "&size=500&page=" + page)
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }

  requestCancelCenter(empId: string, page: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/workflow/request-cancel?center=" + empId + "&size=500&page=" + page)
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }


  checkRequisition(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(environment.jbossUrl + "/welapi/welfare/check-requisition", body)
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }


  eventgrpLeave(): Promise<EventgrpLeave[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/eventgrp/leave")
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }
  changeReasonLists(): Promise<ReasonModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/change-reason/lists")
        .subscribe((data: any) => {
          resolve(data);
        }, (error) => {
          reject(error);
        })
    })
  }

  workflowRemark(wfID: string): Promise<WorkflowRemark> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/workflow/remark/" + wfID)
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }
  config(configId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/config/" + configId)
        .subscribe((data: any) => {
          resolve(data);
        });

    });
  }

  overtimeReasonLists(): Promise<ReasonOtModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/overtime-reason/lists")
        .subscribe((data: any) => {
          resolve(data);
        }, (error) => {
          reject(error);
        })
    })
  }

  getDetailByDocNo(docNo: string): Promise<InboxDetailModel> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.jbossUrl + "/wapi/workflow/docno/" + docNo)
        .subscribe((data: any) => {
          resolve(data);
        })
    })
  }

  getDetailByDocNoObserve(docNo: string) {
    return this.http.get<InboxDetailModel>(environment.jbossUrl + "/wapi/workflow/docno/" + docNo)
  }

  getDetailByRunNo(runNo: string): Observable<InboxDetailModel> {
    return this.http
      .get<InboxDetailModel>(environment.jbossUrl + '/wapi/workflow/' + runNo)
      .pipe(map((item: any) => {
        item.manageDocument.routingHistory!.sort((a: any, b: any) => ((a.completionTime ? new Date(a.completionTime) : new Date()) > (b.completionTime ? new Date(b.completionTime) : new Date())) ? 1 : -1)
        // console.log(item)
        return item
      }))
  }

  getHistoryDetailByRunNo(runNo: string): Observable<InboxDetailModel> {
    return this.http
      .get<InboxDetailModel>(environment.jbossUrl + '/wapi/workflow-his/seqno/' + runNo)
      .pipe(map((item: any) => {
        item.manageDocument.routingHistory!.sort((a: any, b: any) => ((a.completionTime ? new Date(a.completionTime) : new Date()) > (b.completionTime ? new Date(b.completionTime) : new Date())) ? 1 : -1)
        // console.log(item)
        return item
      }))
  }

  getNewNote(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + '/mynote/newnote');
  }

  getSalatype(): Promise<Salatype[]> {
    return new Promise((resolve, reject) => {
      this.http.get<Salatype[]>(environment.baseUrl + "/salatype/lists")
        .subscribe(response => {
          resolve(response);
        }, (error) => {
          reject(error);
        })
    })
  }

  getAbsentId(doc_no: string) {
    return this.http.get<string>(environment.jbossUrl + "/taapi/leave/docno/" + doc_no)
  }

  getConfigUpload(pathfile: string): Observable<UploadGetmodel> {
    return this.http
      .get<UploadGetmodel>(environment.jbossUrl + '/wapi/workflow/uploadfile/' + pathfile)
      .pipe(map((test) => this.convertToUploadGet(test)));
  }

  uploadFileCondition(): Promise<UploadGetmodel> {
    return this.http.get<UploadGetmodel>(environment.jbossUrl + '/wapi/workflow/uploadfile/attached_file_temp.file_name').toPromise()
  }

  uploadFile(body: any): Promise<any> {
    // let body = {
    //   uploadfield: "attached_file_temp.file_name",
    //   subfolder: new Date().getTime(),
    //   fileName: this.file.name,
    //   data: this.file.data,
    // }
    return this.http.post<any>(environment.jbossUrl + '/wapi/workflow/uploadfile', body).toPromise()
  }


  inboxMyHRPage(page: string, size: string, textSearch: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/mynote/inbox-myhr?size=' + size + '&page=' + page + '&textSearch=' + textSearch)
  }


  inboxMyHRStatusPage(page: string, size: string, textSearch: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/mynote/inbox-myhr-status?size=' + size + '&page=' + page + '&textSearch=' + textSearch )
  }

  sentboxPage(page: string, size: string, textSearch: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/mynote/sentbox-myhr?size=' + size + '&page=' + page + '&textSearch=' + textSearch)
  }

  shareboxPage(page: string, size: string, textSearch?: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/mynote/sharebox?size=' + size + '&page=' + page + '&textSearch=' + textSearch)
  }


  workflowApproveAll(body: any): Observable<any> {
    //   [
    //     {
    //         "wf_id": "2001",
    //         "wf_ver": "1",
    //         "wf_seq_no": "3579",
    //         "step_id": "2",
    //         "step_seq_no": "2"
    //     },
    //     {
    //         "wf_id": "2001",
    //         "wf_ver": "1",
    //         "wf_seq_no": "3578",
    //         "step_id": "2",
    //         "step_seq_no": "2"
    //     }
    // ]
    return this.http.post<any>(environment.jbossUrl + '/wapi/workflow/approve-all', body)
  }

  workflowAdminTroubleboxPage(page: string, size: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/workflow-admin/trouble-box?size=' + size + '&page=' + page)
  }

  workflowAdminAutoAssignPositionPage(page: string, size: string, employeeId: string): Observable<WorkflowPositionPageModel> {
    return this.http.get<WorkflowPositionPageModel>(environment.baseUrl + '/workflow-admin/auto-assign-position?size=' + size + '&page=' + page + '&employeeId=' + employeeId)
  }

  workflowAdminAdminViewPage(page: string, size: string, text?: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/workflow-admin/admin-view?size=' + size + '&page=' + page + text)
  }

  workflowAdminAdminViewHistoryPage(page: string, size: string, text?: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/workflow-admin/admin-view-history?size=' + size + '&page=' + page + text)
  }

  workflowAdminAdminTransferPage(page: string, size: string, text?: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/workflow-admin/admin-transfer?size=' + size + '&page=' + page + text)
  }

  workflowAdminAdminAssignPage(page: string, size: string, text?: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/workflow-admin/admin-assign?size=' + size + '&page=' + page + text)
  }

  workflowAdminAdminArchiveDocumentPage(page: string, size: string, text?: string): Observable<WorkflowPageModel> {
    return this.http.get<WorkflowPageModel>(environment.baseUrl + '/workflow-admin/admin-archive-document?size=' + size + '&page=' + page + text)
  }

  workflowAdminAssignWork(body: any): Observable<any> {
    // [{
    //   "wf_id": "2001",
    //   "wf_ver": "1",
    //   "wf_seq_no": "3563",
    //   "step_id": "1",
    //   "step_seq_no": "1",
    //   "tfr_actor_id": "100004"
    // }]
    return this.http.post<any>(environment.jbossUrl + '/wapi/workflow-admin/assign-work', body)
  }

  workflowAdminDelete(body: any): Observable<any> {
    // [    {
    //     "wf_id": "2014",
    //     "wf_ver": "1",
    //     "wf_seq_no": "3564",
    //     "step_id": "1",
    //     "step_seq_no": "1"
    // }]
    let option = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: body
    }
    return this.http.delete<any>(environment.jbossUrl + '/wapi/workflow-admin/delete', option)
  }

  workflowAdminArchive(body: any): Observable<any> {
    // [    {
    //     "wf_id": "2014",
    //     "wf_ver": "1",
    //     "wf_seq_no": "3564",
    //     "step_id": "1",
    //     "step_seq_no": "1"
    // }]
    return this.http.post<any>(environment.jbossUrl + '/wapi/workflow-admin/archive', body)
  }

  workflowAdminTransfer(body: any): Observable<any> {
    // [    {
    //     "wf_id": "2014",
    //     "wf_ver": "1",
    //     "wf_seq_no": "3564",
    //     "step_id": "1",
    //     "step_seq_no": "1"
    // }]
    return this.http.post<any>(environment.jbossUrl + '/wapi/workflow-admin/transfer', body)
  }

  getWorkflowMenu(): Observable<WorkflowMenuModel[]> {
    return this.http.get<WorkflowMenuModel[]>(environment.jbossUrl + "/capi/config/workflow-menu")
  }

  workflowAdminSaveAutoAssignPos(body: any): Observable<any> {
    //   {
    //     "employeeId": "410305",
    //     "positionId": "HR3",
    //     "autoAssignPosId": 5,
    //     "assignUserCode": "100007",
    //     "beginDate": "2022-09-24",
    //     "endDate": "2022-09-24"
    // }
    return this.http.post<any>(environment.jbossUrl + "/wapi/workflow-admin/save-auto-assign-pos", body)
  }

  workflowAdminDeleteAutoAssignPos(body: any): Observable<any> {
    // [{
    //       "employeeId": "410305",
    //       "positionId": "HR3",
    //       "autoAssignPosId": 4,
    //       "assignUserCode": "100007",
    //       "beginDate": "2022-09-23",
    //       "endDate": "2022-09-23"
    // }]
    let option = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: body
    }
    return this.http.delete<any>(environment.jbossUrl + "/wapi/workflow-admin/delete-auto-assign-pos", option)
  }

  getWorkflowDefinitionLists(): Observable<WorkflowDefinitionModel[]> {
    return this.http.get<WorkflowDefinitionModel[]>(environment.baseUrl + "/workflow-definition/lists")
  }

  getWorkflowRemark(wfId: string): Observable<WorkflowRemarkModel> {
    return this.http.get<WorkflowRemarkModel>(environment.baseUrl + "/workflow/remark/" + wfId)
  }

  postWorkflowAdminSaveWorkflowRemark(body: any): Observable<any> {
    //   {
    //     wfId : 5117,
    //     wfVer : 1,
    //     tRemark : "5117 ttt",
    //     eRemark : "5117 eee"
    // }
    return this.http.post<any>(environment.jbossUrl + "/wapi/workflow-admin/save-workflow-remark", body)
  }

  workflowTake(body: {
    "wf_id": string,
    "wf_ver": string,
    "wf_seq_no": string,
    "step_id": string,
    "step_seq_no": string,
    "transferId": string,
    "transferCode": string,
    "position_code": string
  }): Observable<any> {
    return this.http.post<any>(environment.jbossUrl + "/wapi/workflow/take", body)
  }

  getDetailBySeqno(runNo: string): Observable<InboxDetailModel> {
    return this.http
      .get<InboxDetailModel>(environment.jbossUrl + '/wapi/workflow/seqno/' + runNo)
      .pipe(map((item: any) => {
        item.manageDocument.routingHistory!.sort((a: any, b: any) => ((a.completionTime ? new Date(a.completionTime) : new Date()) > (b.completionTime ? new Date(b.completionTime) : new Date())) ? 1 : -1)
        return item
      }))
  }

  getTime0List(): Observable<ShiftListModel[]> {
    return this.http.get<ShiftListModel[]>(environment.baseUrl + "/time0/lists?status=0").pipe(map(x => x.filter(y => (y.time0id != "OFF" && y.time0id != "DEFAULT"))))
  }


  getOvertimeReasonLists(): Observable<ReasonOtModel[]> {
    return this.http.get<ReasonOtModel[]>(environment.baseUrl + "/overtime-reason/lists")
  }

  workflowStepErrorList(wfid?: number, page?: number, size?: number): Observable<PageModel<WorkflowModel>> {
    const url = '/mynote/abnormal-document/' + wfid + '?size=' + size + '&page=' + page;
    return this.http.get<PageModel<WorkflowModel>>(url)
      .pipe(
        map((page) => {
          return {
            ...page,
            content: page.content.map(
              (e) => new MyWorkflowModel(e, this.translateService)
            ),
          };
        })
      );
  }

  wfRepare(body: any) {
    return this.http.post(environment.jbossUrl + "/wapi/workflow/repair", body)
  }
  readWf(seq_no: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log(body)
      this.http.put<any>(environment.jbossUrl + '/wapi/mynote/read/' + seq_no, {}).subscribe(data => {
        //  console.log(data)
        resolve(data);
      });
    });
  }
  getEmpAll(): Observable<WorkingsModel[]> {
    return this.http.get<WorkingsModel[]>(environment.baseUrl + "/employee/workings/list")
  }
  getEmpCenter2(): Promise<WorkingsModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.baseUrl + "/employee/empcenter")
        .subscribe((data: any) => {
          resolve(data);
        });
    });
  }

  getCommandlineList(employeeId?: string): Observable<CommandLineModel[]> {
    return this.http.get<CommandLineModel[]>(environment.baseUrl + "/wf-commandline/list" + (employeeId ? ("?employeeid=" + employeeId) : ""))
  }

  getCommandlineDetail(employeeId: string, wfid: string): Observable<CommandLineModel> {
    return this.http.get<CommandLineModel>(environment.baseUrl + "/wf-commandline/detail?employeeid=" + employeeId + "&wfId=" + wfid)
  }
  getCommandlineReport(): Observable<CommandLineReportModel[]> {
    return this.http.get<CommandLineReportModel[]>(environment.baseUrl + "/wf-commandline/report")
  }
  getCostCenter(): Observable<CostcenterModel[]> {
    return this.http.get<CostcenterModel[]>(environment.baseUrl + "/cost-center/lists")
  }
  getSiteProject(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(environment.baseUrl + "/site-project/lists")
  }

  postCommandline(body: CommandLineModel): Observable<any> {
    return this.http.post<any>(environment.baseUrl + "/wf-commandline", body)
  }
  deleteCommandline(body: CommandLineModel): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: body
    }
    return this.http.delete<any>(environment.baseUrl + "/wf-commandline", option)
  }


  getBu2(): Observable<Bu2Model[]> {
    return this.http.get<Bu2Model[]>(environment.baseUrl + "/bu2/lists")
  }
  getEventgrpList(): Observable<any[]> {
    return this.http.get<any[]>(environment.baseUrl + "/eventgrp/mini/lists")
  }
  getCurrency(): Observable<any[]> {
    return this.http.get<any[]>(environment.baseUrl + "/currency/lists")
  }


  uploadFileCommandline(body: any): Promise<any> {
    // let body = {
    //   uploadfield: "attached_file_temp.file_name",
    //   subfolder: new Date().getTime(),
    //   fileName: this.file.name,
    //   data: this.file.data,
    // }
    return this.http.post<any>(environment.jbossUrl + '/wapi/wf-commandline/upload', body).toPromise()
  }
  takeAllWorkflow(bodyList: any) {
    const parallelList: Observable<any>[] = [];

    for (let i = 0; i < bodyList.length; i++) {
      parallelList.push(
        this.http.post(environment.jbossUrl + "/wapi/workflow/take", bodyList[i])
      );
    }
    return forkJoin(parallelList).pipe(map((response: any) => {
      return response
    }))
  }

}
