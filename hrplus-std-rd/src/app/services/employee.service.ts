import { MySwipeCard } from './../models/swipecard.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  EmployeeProfileModel,
  MyEmployeeProfileModel,
} from '../models/employeeprofilemodel.model';

import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

import { from, Observable, of, pipe, zip } from 'rxjs';
import {
  MovementsModel,
  MyMovementsModel,
} from '../models/movementmodel.model';
import { EducateModel, MyEducateModel } from '../models/educatemodel.model';
import { AddressModel, MyAddressModel } from '../models/address.model';
import { MyWorkingsModel, WorkingsModel } from '../models/workingmodel.model';
import { map, tap } from 'rxjs/operators';
import { MyFamilyModel, FamilyModel } from '../models/family.model';
import { TranslateService } from '@ngx-translate/core';
import { LeaveStat, MyEmpLeaveStat } from '../models/leavestat.model';
import { environment } from '../../environments/environment';
import { OtStatModel } from '../models/otstat.model';
import { ForgetCard } from '../models/forgetcard.model';
import {
  LeaveStatJboss,
  MyLeaveStatJboss,
} from '../models/leavestatjboss.model';
import { LeavestatEvent } from '../models/leavestatevent.model';
import {
  MyWelfareCheckModel,
  WelfareCheckModel,
} from '../models/welfarecheck.model';
import { WelHis } from '../models/welfarehistory.model';
import { TotMdate } from '../models/totmdate.model';
import { MyWorkPlanModel, WorkPlan } from '../models/workplan.model';
import { SwipeCard } from '../models/swipecard.model';
import { DatePipe } from '@angular/common';
import { WarningByPeriod } from '../models/warning.model';
import { TrainingHistoryModel, MyTrainingHistoryModel } from '../models/traininghis.model';
import { MyRecommendModel, RecommendModel } from '../models/recommend.model';
import { SupEmpList } from '../models/supEmpList.model';
import { MySupEmpGroup, SupEmpGroup } from '../models/supEmpGroup.model';
import { SupLeaveStat } from '../models/supLeaveStat.model';
import { CardSwiping } from '../models/cardswiping.model';
import { PVFund } from '../models/pvf.model';
import { Tax } from '../models/tax.model';
import { EmpBank, MyEmpBank } from '../models/empBank.model';
import { EmpCard, MyEmpCard } from '../models/empCard.model';
import { MySupTimeWarn, SupTimeWarn } from '../models/supTimeWarn.model';
import { SupGetNameModel } from '../models/supgetname.model';
import { PageModel } from '../models/page.model';
import { EmpLeaveSum } from '../models/empLeaveSum.model';
import {
  MyTrainingContent,
  TrainingContent,
} from '../models/trainingcontent.model';
import {
  MyRecommendContent,
  RecommendContent,
} from '../models/recommendcontent.model';
import { LeaveSummary, MyLeaveSummary } from '../models/leaveSummary.model';
import { WorkExp } from '../models/workexp.model';
import { UProfile } from '../models/globals/uprofile.model';
import { EmpShiftModel } from '../models/empShift.model';
import { Dayoff } from '../models/dayoff.model';
import { setCharacter } from '../models/setCharacter.model';
import { ContentsModel } from '../models/contentsmodel.model';
import { EventgrpLeave } from '../models/eventgrpleave.model';
import { DailyTimeEmpModel, DailyTimeEmpPageModel } from '../models/dailytimeemp.model';
import { SubordinateModel } from '../models/subordinatelist.model';
import { Employee } from '../models/employee.model';
import { WorkArea } from '../models/workarea.model';
import { RecruitApplicantModel, RecruitApplicantPageModel } from '../models/recruitapplicant.model';
import { EmployeeSubordinatesPageModel } from '../models/employeesubordinatespage.model';
import { PositionModel } from '../models/positionmodel.model';
import { RequestApplicantModel, RequestApplicantPageModel } from '../models/requestapplicant.model';
import { ObjModel } from '../models/objmodel.model';
import { PrefixModel } from '../models/prefixmodel.model';
import { Time0Model } from '../models/time0model.model';
import { EventgrpLeaveModel } from '../models/eventgrpleavemodel .model';
import { WorkAreaModel } from '../models/workareamodel.model';
import { CostcenterModel } from '../models/costcentermodel.model';
import { CostCenterModel } from '../models/costcenter.model';
import { JobcodeModel } from '../models/jobcodemodel.model';
import { EmployeePageModel } from '../models/employeemodel.model';
import { NationalityModel } from '../models/nationalitymodel.model';
import { NationalModel } from '../models/nationalmodel.model';
import { ReligionModel } from '../models/religionmodel.model';
import { ZipcodeModel } from '../models/zipcodemodel.model';
import { RecruitAppointmentModel } from '../models/recruitappointmentmodel.model';
import { DegreeModel } from '../models/degreemodel.model';
import { InstitueModel } from '../models/instituemodel.model';
import { FacultyModel } from '../models/facultymodel.model';
import { MajorModel } from '../models/majormodel.model';
import { FamilyralationModel } from '../models/relationmdel.model';
import { LangSkillModel } from '../models/langskillmodel.model';
import { OccupationModel } from '../models/occupationmodel.model';
import { BranchModel } from '../models/branchmodel.model';
import { SourcejobModel } from '../models/soureJobmodel.model';
import { MyPaperListModel } from '../models/paperlistmodel.model';
import { MyTraining, Training } from '../models/training.model';
import { EventgrpWF, MyEventgrpWF } from '../models/eventgrpWF.model';
import { HandicappedTypeModel } from '../models/Handicappedtype.model';
import { EmployeeRosterModel } from '../models/employeeroster.model';
import { EmployeeProcessModel } from '../models/employeeprocess.model';
import { KerryCostCenterModel, KerryEmployeeModel, KerryTaxModel } from '../models/kerry-mix-model.model';
import { Type } from '../models/type.model';
import { ReasonModel } from '../models/reason.model';
import { EncodeCyptoService } from './encode-cypto.service';
import { Ot1TempModel } from '../models/ot1-temp.model';
import { MyStatistic } from '../models/statistic.model';
import { WorkingsMiniModel } from '../models/workings-mini.model';


@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  lang: string = "";

  private BASE_PATH: string = environment.baseUrl + '/dashboard';
  private uprofile: Observable<UProfile> | undefined;
  urlApi = environment.baseUrl

  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  private ttl = 5 * 60 * 1000; // 5 นาที

  constructor(
    private http: HttpClient,
    private router: Router,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private cyptoService: EncodeCyptoService
  ) { }
 // ฟังก์ชัน generic แคช GET ทุกเส้น
  getWithCache<T>(url: string, params?: HttpParams): Promise<T> {
    const fullUrl = params ? `${url}?${params.toString()}` : url;
    const cacheKey = `GET|${fullUrl}`;
    const now = Date.now();

    // มี cache + ยังไม่หมดอายุ
    if (this.cache.has(cacheKey) && (this.cacheExpiry.get(cacheKey) ?? 0) > now) {
      return Promise.resolve(this.cache.get(cacheKey));
    }

    // ยิง API
    return new Promise((resolve, reject) => {
      this.http.get<T>(url, { params }).subscribe(
        (response) => {
          this.cache.set(cacheKey, response);
          this.cacheExpiry.set(cacheKey, now + this.ttl);
          resolve(response);
        },
        (error) => reject(error)
      );
    });
  }

  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  getEmployeeProfile(empIdS?: string): Observable<EmployeeProfileModel> {
    let test;

    if (empIdS == undefined) {
      test = this.http
        .get('/employee/profile')
        .pipe(map((test: any) => new MyEmployeeProfileModel(test, this.translateService)));
    } else {
      test = this.http
        .get('/employee/profile?employeeid=' + this.cyptoService.encryptUsingAES256(empIdS))
        .pipe(map((test: any) => new MyEmployeeProfileModel(test, this.translateService)));
    }
    return test;
  }
  getHadjposition(employeeId: string, date: string): Promise<any> {
    return this.http.get<any>(this.urlApi + '/hadjposition/employee/' + date + "?employeeid=" + this.cyptoService.encryptUsingAES256(employeeId)).toPromise()
  }
  getAddress(empId?: string): Observable<AddressModel[]> {
    if (empId == undefined) {
      return this.http
        .get('/employee/address')
        .pipe(map((x: any) => x.map((test: any) => this.convertToAddress(test))));
    } else {
      return this.http
        .get('/employee/address?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any) => x.map((test: any) => this.convertToAddress(test))));
    }
  }

  private convertToAddress(dataModel: any): AddressModel {
    const data = {
      line_no: dataModel.line_no,
      addr_current: dataModel.addr_current,
      tvillage: dataModel.tvillage,
      evillage: dataModel.evillage,
      taddr: dataModel.taddr,
      eaddr: dataModel.eaddr,
      troad: dataModel.troad,
      eroad: dataModel.eroad,
      troom_no: dataModel.troom_no,
      eroom_no: dataModel.eroom_no,
      tsoi: dataModel.tsoi,
      esoi: dataModel.esoi,
      district: dataModel.district,
      zipcode: dataModel.zipcode,
      tfloor: dataModel.tfloor,
      efloor: dataModel.efloor,
      tmoo: dataModel.tmoo,
      emoo: dataModel.emoo,
      tsubdistrict: dataModel.tsubdistrict,
      esubdistrict: dataModel.esubdistrict,
    };
    const model = new MyAddressModel(data, this.translateService);
    return model;
  }

  getWorkInformation(empId?: string): Observable<WorkingsModel> {
    if (empId == undefined) {
      return this.http
        .get('/employee/working')
        .pipe(map((test: any) => this.convertToWorkInformation(test)));
    } else {
      return this.http
        .get('/employee/working?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((test: any) => this.convertToWorkInformation(test)));
    }
  }
  convertToWorkInformation(dataModel: any): WorkingsModel {
    const data = {
      employeeId: dataModel.employeeId,
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
      pl: dataModel.pl,
      job: dataModel.job,
      type: dataModel.type,
      group: dataModel.group,
      grade: dataModel.grade,
      costcenter: dataModel.costcenter,
      bossId: dataModel.bossId,
      time0: dataModel.time0,
      branch: dataModel.branch,
      telExt: dataModel.telExt,
      startdate: dataModel.startdate,
      firstHiredate: dataModel.firstHiredate,
      approveDate: dataModel.approveDate
    };
    const model = new MyWorkingsModel(data, this.translateService);
    return model;
  }





  getMovements(empId?: string): Observable<MovementsModel[]> {
    if (empId == undefined) {
      return this.http
        .get('/employee/movement')
        .pipe(map((x: any) => x.map((test: any) => this.convertToMovement(test))));
    } else {
      return this.http
        .get('/employee/movement?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any) => x.map((test: any) => this.convertToMovement(test))));
    }
  }
  private convertToMovement(dataModel: any): MovementsModel {
    const data = {
      employeeid: dataModel.employeeid,
      companyid: dataModel.companyid,
      adj_date: dataModel.adj_date,
      eff_date: dataModel.eff_date,
      line_no: dataModel.line_no,
      adj_type: dataModel.adj_type,
      adj_reason: dataModel.adj_reason,
      job: dataModel.job,
      subgrade: dataModel.subgrade,
      emp_position: dataModel.emp_position,
      bu1: dataModel.bu1,
      bu2: dataModel.bu2,
      bu3: dataModel.bu3,
      salary: dataModel.salary,
      old_job: dataModel.old_job,
      old_subgrade: dataModel.old_subgrade,
      old_emp_position: dataModel.old_emp_position,
      old_bu1: dataModel.old_bu1,
      old_bu2: dataModel.old_bu2,
      old_bu3: dataModel.old_bu3,
      old_salary: dataModel.old_salary,
    };
    const model = new MyMovementsModel(data, this.translateService);
    return model;
  }

  getFamily(empId?: string): Observable<FamilyModel[]> {
    if (empId == undefined) {
      return this.http
        .get('/employee/family')
        .pipe(map((x: any) => x.map((test: any) => this.convertToFamily(test))));
    } else {
      return this.http
        .get('/employee/family?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any) => x.map((test: any) => this.convertToFamily(test))));
    }
  }

  private convertToFamily(dataModel: any): FamilyModel {
    const data: FamilyModel = {
      relation: dataModel.relation,
      prefix: dataModel.prefix,
      fname: dataModel.fname,
      lname: dataModel.lname,
      efname: dataModel.efname,
      elname: dataModel.elname,
      idcard: dataModel.idcard,
      birthday: dataModel.birthday,
      statMarry: dataModel.statMarry,
      yearMarry: dataModel.yearMarry,
      statOther: dataModel.statOther,
      statStudy: dataModel.statStudy,
      occupation: dataModel.occupation,
      otherOccupation: dataModel.otherOccupation,
      isGuarantor: dataModel.isGuarantor,
      isContract: dataModel.isContract,
      taddr: dataModel.taddr,
      tvillage: dataModel.tvillage,
      troomNo: dataModel.troomNo,
      tfloor: dataModel.tfloor,
      tmoo: dataModel.tmoo,
      tsoi: dataModel.tsoi,
      troad: dataModel.troad,
      tsubdistrict: dataModel.tsubdistrict,
      eaddr: dataModel.eaddr,
      evillage: dataModel.evillage,
      eroomNo: dataModel.eroomNo,
      efloor: dataModel.efloor,
      emoo: dataModel.emoo,
      esoi: dataModel.esoi,
      eroad: dataModel.eroad,
      esubdistrict: dataModel.esubdistrict,
      tel: dataModel.tel,
      fax: dataModel.fax,
      guarantydate: dataModel.guarantydate,
      guarantytitle: dataModel.guarantytitle,
      age: dataModel.age,
      workplace: dataModel.workplace,
      relations: dataModel.relations,
      status: dataModel.status,
      zipcode: dataModel.Zipcode,
      district: dataModel.District,
    };
    const model = new MyFamilyModel(data, this.translateService);
    return model;
  }

  getEducation(empId?: string): Observable<EducateModel[]> {
    if (empId == undefined) {
      return this.http
        .get('/employee/educate')
        .pipe(map((x: any) => x.map((test: any) => this.convertToEducate(test))));
    } else {
      return this.http
        .get('/employee/educate?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any) => x.map((test: any) => this.convertToEducate(test))));
    }
  }
  private convertToEducate(dataModel: any): EducateModel {
    const data = {
      educIndex: dataModel.educIndex,
      degree: dataModel.degree,
      country: dataModel.country,
      faculty: dataModel.faculty,
      major: dataModel.major,
      gpa: dataModel.gpa,
      institue: dataModel.institue,
      background: dataModel.background,
      honourably: dataModel.honourably,
      otherInstitue: dataModel.otherInstitue,
      otherFaculty: dataModel.otherFaculty,
      otherMajorid: dataModel.otherMajorid,
      yearStart: dataModel.yearStart,
      yearEnd: dataModel.yearEnd,
    };
    const model = new MyEducateModel(data, this.translateService);
    return model;
  }

  getLeaveStat(startdate?: string, enddate?: string, page?: number, size?: number): Promise<LeaveStat> {
    return new Promise((resolve, reject) => {
      this.http.get<LeaveStat>('/absent/start/' + startdate + '/end/' + enddate + '?page=' + page + '&size=' + size)
        .subscribe((response: any) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }

  private convertToLeaveStat(dataModel: any): LeaveStat {
    const data: LeaveStat = {
      absent: dataModel.content,
      pageable: dataModel.pageable,
      totalPages: dataModel.totalPages,
      last: dataModel.last,
      totalElements: dataModel.totalElements,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      first: dataModel.first,
      numberOfElements: dataModel.numberOfElements,
      empty: dataModel.empty,
    };
    const model = new MyEmpLeaveStat(data, this.translateService);

    return model;
  }

  getOtStat(startdate?: string, enddate?: string): Observable<OtStatModel> {
    if (startdate == null && enddate == null) {
      return this.http
        .get('/totmdate/start/2000-01-01/end/2020-12-31')
        .pipe(map((test: any) => this.convertToOtStat(test)));
    } else {
      return this.http
        .get('/totmdate/start/' + startdate + '/end/' + enddate)
        .pipe(map((test: any) => this.convertToOtStat(test)));
    }
  }
  private convertToOtStat(dataModel: any): OtStatModel {
    const data = {
      otstatcontent: dataModel.otstatcontent,
      pageable: dataModel.pageable,
      totalPages: dataModel.totalPages,
      last: dataModel.last,
      totalElements: dataModel.totalElements,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      first: dataModel.first,
      numberOfElements: dataModel.numberOfElements,
      empty: dataModel.empty,
    };
    return data;
  }

  getForgetcard(startdate?: string, enddate?: string, page?: number, size?: number): Promise<ForgetCard> {
    return new Promise((resolve, reject) => {
      this.http.get<LeavestatEvent>('/forgetcard/start/' + startdate + '/end/' + enddate + '?page=' + page + '&size=' + size)
        .subscribe((response: any) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }

  getWelfareCheck(): Observable<WelfareCheckModel[]> {
    return this.http
      .get(environment.jbossUrl + '/welapi/welfare/allowance-check')
      .pipe(
        map((x: any) => x.map((test: any) => this.convertToWelfareCheck(test)))
      );
  }

  private convertToWelfareCheck(dataModel: any): WelfareCheckModel {
    const data = {
      welId: dataModel.welId,
      tdesc: dataModel.tdesc,
      edesc: dataModel.edesc,
      welCost: dataModel.welCost,
      sumCost: dataModel.sumCost,
      welgrp: dataModel.welgrp,
      isLimit: dataModel.isLimit,
      isUsed: dataModel.isUsed,
      isRemain: dataModel.isRemain
    };
    const model = new MyWelfareCheckModel(data, this.translateService);
    return model;
  }

  getWelfareHistory(yselect?: number, page?: any, size?: any): Promise<WelHis> {
    return new Promise((resolve, reject) => {
      this.http.get<LeavestatEvent>('/welfare/complain?budgetYear=' + yselect + '&page=' + page + '&size=' + size)
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }


  private convertToWelfateHistory(datamodel: any): WelHis {
    const data = {
      complain: datamodel.content,
      pageable: datamodel.pageable,
      totalPages: datamodel.totalPages,
      totalElements: datamodel.totalElements,
      last: datamodel.last,
      number: datamodel.number,
      sort: datamodel.sort,
      size: datamodel.size,
      numberOfElements: datamodel.numberOfElements,
      first: datamodel.first,
      empty: datamodel.empty,
    };

    return data;
  }

  getLeaveStatJboss(yearid?: number): Observable<LeaveStatJboss> {
    return this.http
      .get(environment.jbossUrl + '/taapi/leave/statistic?yearId=' + yearid)
      .pipe(map((test: any) => this.convertToLeaveStatJboss(test)));
  }

  getLeaveByType(type?: string, yearid?: number): Observable<MyStatistic> {
    return this.http.get<MyStatistic>(environment.jbossUrl + '/taapi/leave/statistic/type/' + type + '?yearId=' + yearid).pipe(map((e: any) => new MyStatistic(e, this.translateService)));
  }

  private convertToLeaveStatJboss(dataModel: any): LeaveStatJboss {
    const data = {
      allleave: dataModel.allleave,
      statistic: dataModel.statistic,
    };
    const model = new MyLeaveStatJboss(data, this.translateService);
    return model;
  }
  getLeaveStatEventTotal(eventgrp?: any, year?: any, page?: any, size?: any): Promise<LeavestatEvent> {
    return new Promise((resolve, reject) => {
      this.http.get<LeavestatEvent>('/tls/eventgrp/' + eventgrp + '/year/' + year + '?page=' + page + '&size=' + size)
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }

  getTOtMdate(startdate: string, enddate: string, page: number, size: number): Promise<TotMdate> {
    return new Promise((resolve, reject) => {
      this.http.get<LeavestatEvent>('/totmdate/start/' + startdate + '/end/' + enddate + '?page=' + page + '&size=' + size)
        .subscribe((response: any) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }

  getWorkData(start?: any, end?: any, empId?: string): Observable<WorkPlan[]> {
    if (empId) {
      var swipe = this.getSwipeCard(start, end, empId);
      var time = this.getWorkPlan(start, end, empId);
    } else {
      var swipe = this.getSwipeCard(start, end);
      var time = this.getWorkPlan(start, end);
    }

    var zipData: Observable<WorkPlan[]>;

    zipData = zip(time, swipe).pipe(
      map(([time, swipe]) => {
        for (let i = 0; i < time.length; i++) {
          time[i].costCenter = [];

          for (let j = 0; j < swipe.length; j++) {
            var cdate = this.convertToDDMMYYYY(swipe[j].swipeDate);
            if (cdate == time[i].dateId) {
              time[i]?.costCenter!.push(
                ' ' + swipe[j].swipeTime.toFixed(2).toString()
              );
              time[i].time0id = swipe[j].time0id;
            }
          }
        }

        return time;
      })
    );

    return zipData;
  }

  getSwipeCard(start?: any, end?: any, empId?: string): Observable<SwipeCard[]> {
    if (empId) {
      const swipeT = this.http
        .get('/swipetime/data/start/' + start + '/end/' + end + '?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any) => x.map((data: any) => new MySwipeCard(data, this.translateService))));

      return swipeT;
    } else {
      const swipeT = this.http
        .get('/swipetime/data/start/' + start + '/end/' + end)
        .pipe(map((x: any) => x.map((data: any) => new MySwipeCard(data, this.translateService))));

      return swipeT;
    }

  }

  getSwipeCardSub(start?: any, end?: any, empId?: string): Observable<SwipeCard[]> {
    const swipeT = this.http
      .get('/swipetime/subordinate/data/start/' + start + '/end/' + end)
      .pipe(map((x: any) => x.map((data: any) => new MySwipeCard(data, this.translateService))));

    return swipeT;

  }

  getWorkPlan(start?: any, end?: any, empId?: string): Observable<WorkPlan[]> {
    if (empId) {
      const getT = this.http
        .get(
          environment.jbossUrl +
          '/taapi/working-time/working-plan/start/' +
          start +
          '/end/' +
          end + '?employeeid=' + this.cyptoService.encryptUsingAES256(empId)
        )
        .pipe(map((x: any) => x.map((data: any) => new MyWorkPlanModel(data, this.translateService))));
      return getT;
    }
    else {
      const getT = this.http
        .get(
          environment.jbossUrl +
          '/taapi/working-time/working-plan/start/' +
          start +
          '/end/' +
          end
        )
        .pipe(map((x: any) => x.map((data: any) => new MyWorkPlanModel(data, this.translateService)), tap(x => console.log(x))));

      return getT;
    }
  }

  getWorkPlanSub(start?: any, end?: any, subgroupid?: string): Observable<WorkPlan[]> {
    if (subgroupid) {
      const getT = this.http
        .get(
          environment.jbossUrl +
          '/taapi/working-time/working-plan/subordinate/start/' +
          start +
          '/end/' +
          end +
          '?subgroupId=' + subgroupid
        )
        .pipe(map((x: any) => x.map((data: any) => new MyWorkPlanModel(data, this.translateService)), tap(x => console.log(x))));
      return getT;
    }
    else {
      const getT = this.http
        .get(
          environment.jbossUrl +
          '/taapi/working-time/working-plan/subordinate/start/' +
          start +
          '/end/' +
          end +
          '?subgroupId='
        )
        .pipe(map((x: any) => x.map((data: any) => new MyWorkPlanModel(data, this.translateService)), tap(x => console.log(x))));

      return getT;
    }
  }

  getWorkPlanSubEmp(start?: any, end?: any, empId?: string) {
    return this.http
      .get<MyWorkPlanModel[]>(
        environment.jbossUrl +
        '/taapi/working-time/working-plan/' +
        start +
        '/' +
        end +
        '?employeeid=' + this.cyptoService.encryptUsingAES256(empId!)
      )
      .pipe(map((x: any) => x.map((data: any) => new MyWorkPlanModel(data, this.translateService))));
  }

  getWorkPlanSubEmp2(start?: any, end?: any, empId?: string) {
    return this.http
      .get<MyWorkPlanModel[]>(
        environment.jbossUrl +
        '/taapi/working-time/working-plan/start/' +
        start +
        '/end/' +
        end +
        '?employeeid=' + empId
      )
      .pipe(map((x: any) => x.map((data: any) => new MyWorkPlanModel(data, this.translateService))));
  }


  //tdate format "yyyy-MM-dd" to "dd-MM-yyyy"
  convertToDDMMYYYY(tdate: string): string {
    var ty = tdate.substring(0, 4);
    var tm = tdate.substring(5, 7);
    var td = tdate.substring(8, 10);
    return td + '-' + tm + '-' + ty;
  }

  private convertWorkPlan(dataModel: any): WorkPlan {
    const data = {
      dateId: dataModel.dateId,
      timeCode: dataModel.timeCode,
      startDate: dataModel.startDate,
      startTime: dataModel.startTime,
      endDate: dataModel.endDate,
      endTime: dataModel.endTime,
      docNo: dataModel.docNo,
      docType: dataModel.docType,
      eventgrp: dataModel.eventgrp,
      hourD: dataModel.hourD,
      lv: dataModel.lv,
      apot: dataModel.apot,
    };

    const model = new MyWorkPlanModel(data, this.translateService);

    return model;
  }

  //GET EMPLOYEE NAME
  getEmpInformation(subgroupid?: string): Observable<WorkingsModel[]> {
    if (subgroupid == undefined) {
      return this.http
        .get('/employee/subordinates/all?subgroupid=')
        .pipe(
          map((x: any) =>
            x.map((test: any) => this.convertToWorkInformation(test))
          )
        );
    } else {
      return this.http
        .get('/employee/subordinates/all?subgroupid=' + subgroupid)
        .pipe(
          map((x: any) =>
            x.map((test: any) => this.convertToWorkInformation(test))
          )
        );
    }
  }

  getEmpAll(subgroupid?: any): Observable<WorkingsModel[]> {
    return this.http
      .get('/employee/subordinates/all?subgroupid=01')
      .pipe(
        map((x: any) => x.map((test: any) => this.convertToWorkInformation(test)))
      );
  }
  convertToEmpAll(dataModel: any): SupGetNameModel {
    const data = {
      employee: dataModel.employee,
      supTime: dataModel.supTime,
    };
    return data;
  }
  // zipEmpId(start? , end? , supgroupid?) : Observable<SupGetNameModel[]>{
  //   var sup = this.getSupTimeAttendance(start , end , supgroupid);
  //   var emp = this.getEmpInformation()
  //   var zipEmp : Observable<SupGetNameModel[]>;

  //     zipEmp = zip(sup,emp).pipe(
  //       map(([sup,emp]) => {
  //         for (let i = 0; i < sup.length; i++) {
  //           sup[i].employeeId = '';
  //           for (let j = 0; j < array.length; j++) {
  //             const element = array[j];

  //           }

  //         }
  //       })
  //     )

  //   return zipEmp;
  // }

  getSupTimeData(
    start?: string,
    end?: string,
    subgroupid?: string
  ): Observable<WorkPlan[]> {
    var swipe = this.getSwipeCardSub(start, end);
    var time = this.getWorkPlanSub(start, end, subgroupid);
    // swipe.subscribe(x => console.log("sssssss", x));
    var zipData: Observable<WorkPlan[]>;

    zipData = zip(time, swipe).pipe(
      map(([time, swipe]) => {
        for (let i = 0; i < time.length; i++) {
          time[i].costCenter = [];

          for (let j = 0; j < swipe.length; j++) {
            var cdate = this.convertToDDMMYYYY(swipe[j].swipeDate);
            if (cdate == time[i].dateId &&
              time[i].employeeId == swipe[j].employeeId) {
              time[i]?.costCenter!.push(
                ' ' + swipe[j].swipeTime.toFixed(2).toString()
              );
              time[i].time0id = swipe[j].time0id;
            }
          }
        }

        return time;
      })
    );

    return zipData;
    // zipData = zip(time, swipe).pipe(
    //   map(([time, swipe]) => {
    //     for (let i = 0; i < time.length; i++) {
    //       for (let j = 0; j < swipe.length; j++) {
    //         // swipe = [] เลยไม่เข้า for นี้
    //         var cdate = this.convertToDDMMYYYY(swipe[j].swipeDate); // เลยทำให้ cdate เป็น undefined
    //         for (let j = 0; j < swipe.length; j++) {
    //           var cdate = this.convertToDDMMYYYY(swipe[j].swipeDate);
    //           if (
    //             cdate == time[i].dateId &&
    //             time[i].employeeId == swipe[j].employeeId
    //           ) {
    //             time[i]?.costCenter!.push(
    //               ' ' + swipe[j].swipeTime.toFixed(2).toString()
    //             );
    //             time[i].time0id = swipe[j].time0id;
    //           }
    //         }
    //       }
    //       return time;
    //     }
    //   })
    // );
    // // zipData.subscribe((xx) => console.log('zipdata service : ', xx));
    // keepZip = zipData;

    // return keepZip;
  }

  getCardSwipping(start?: any, end?: any): Observable<CardSwiping[]> {
    const cardSwip = this.http
      .get('/swipetime/data/start/' + start + '/end/' + end)
      .pipe(map((x: any) => x.map((test: any) => this.convertCardSwiping(test))));
    cardSwip.subscribe((xx) => {
      //console.log('cardswipe service : ', xx);
      // if (cardSwip == undefined) {
      //   xx.push({
      //     employeeId: '',
      //     swipeDate: '',
      //     swipeTime: 0,
      //     swipeType: '',
      //     source: '',
      //     machineNo: '',
      //     time0id: '',
      //     docId: '',
      //   });
      // }
    });

    return cardSwip;
  }

  private convertCardSwiping(dataModel: any): CardSwiping {
    const data = {
      employeeId: dataModel.employeeId,
      swipeDate: dataModel.swipeDate,
      swipeTime: dataModel.swipeTime,
      swipeType: dataModel.swipeType,
      source: dataModel.source,
      machineNo: dataModel.machineNo,
      time0id: dataModel.time0id,
      docId: dataModel.docId,
    };
    return data;
  }

  getWarningByPeriod(
    starDate: string,
    endDate: string
  ): Observable<any[]> {
    return this.http
      .get('/tc1/warning/period/start/' + starDate + '/end/' + endDate)
      .pipe(
        map((x: any) => x.map((test: any) => this.convertWarningByPeriod(test)))
        // tap((x:any)=>{console.log('s',x)})
      );
  }
  private convertWarningByPeriod(dataModel: any): WarningByPeriod {
    const data = {
      dateId: dataModel.dateId,
      employee: dataModel.employee,
      eventgrpId: dataModel.eventgrpId,
      time0Id: dataModel.time0Id,
      warn00: dataModel.warn00,
      warn01: dataModel.warn01,
      warn02: dataModel.warn02,
      warn03: dataModel.warn03,
      warn04: dataModel.warn04,
      warn05: dataModel.warn05,
      warn11: dataModel.warn11,
      warn12: dataModel.warn12,
      warn13: dataModel.warn13,
      warn14: dataModel.warn14,
      warn15: dataModel.warn15,
      cdtBg: dataModel.cdtBg,
      cdtEn: dataModel.cdtEn,
      mdtBg: dataModel.mdtBg,
      mdtEn: dataModel.mdtEn,
      ctmBg: dataModel.ctmBg,
      ctmEn: dataModel.ctmEn,
      mtmBg: dataModel.mtmBg,
      mtmEn: dataModel.mtmEn
      // "cdtBg": "2021-11-07",
      // "cdtEn": "2021-11-07",
      // "mdtBg": "2021-11-07",
      // "mdtEn": "2021-11-07",
      // "ctmBg": 10.0,
      // "ctmEn": 20.0,
      // "mtmBg": 7.0,
      // "mtmEn": 20.0

    };
    return data;
  }

  getTraineeplan(empId?: any): Observable<TrainingHistoryModel> {
    if (empId) {
      return this.http
        .get('/trainee/plan?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((test: any) => this.coverTraineeplan(test)));
    } else {
      return this.http
        .get('/trainee/plan?sort=identity.training')
        .pipe(map((test: any) => this.coverTraineeplan(test)));
    }
  }
  private coverTraineeplan(dataModel: any): TrainingHistoryModel {
    const data = {
      content: dataModel.content,
      pageable: dataModel.pageable,
      last: dataModel.last,
      totalPages: dataModel.totalPages,
      totalElements: dataModel.totalElements,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      first: dataModel.first,
      numberOfElements: dataModel.numberOfElements,
      empty: dataModel.empty,
    };
    const model = new MyTrainingHistoryModel(data, this.translateService);
    return model;
  }

  getTrainingHistory(size?: number, page?: number, empId?: any): Observable<TrainingHistoryModel> {
    if (empId) {
      if (page) {
        return this.http
          .get('/trainee/history?size=' + size + '&page=' + page + '&employeeid=' + this.cyptoService.encryptUsingAES256(empId))
          .pipe(map((test: any) => new MyTrainingHistoryModel(test, this.translateService)));
      } else {
        return this.http
          .get('/trainee/history?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
          .pipe(map((test: any) => new MyTrainingHistoryModel(test, this.translateService)));
      }
    } else {
      return this.http
        .get('/trainee/history?size=' + size + '&page=' + page)
        .pipe(map((test: any) => new MyTrainingHistoryModel(test, this.translateService)), tap(data => console.log("TRANINGHISTORY", data)));
    }
  }

  getRecommend(size: number, page: number, empId?: string): Promise<RecommendModel> {
    if (empId) {
      return new Promise((resolve, reject) => {
        this.http.get<WorkingsModel[]>('/trainee/recommend' + '?size=' + size + '&page=' + page + '&employeeid=' + this.cyptoService.encryptUsingAES256(empId))
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.http.get<WorkingsModel[]>('/trainee/recommend' + '?size=' + size + '&page=' + page)
          .subscribe((response: any) => {
            resolve(response);
          }, (error) => {
            reject(error);
          });
      });
    }
  }





  private coverRecommendModel(dataModel: any): RecommendModel {
    const data = {
      content: dataModel.content,
      pageable: dataModel.pageable,
      last: dataModel.last,
      totalPages: dataModel.totalPages,
      totalElements: dataModel.totalElements,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      numberOfElements: dataModel.numberOfElements,
      first: dataModel.first,
      empty: dataModel.empty,
    };
    const model = new MyRecommendModel(data, this.translateService);
    return model;
  }

  getSupEmpGroup(): Observable<SupEmpGroup> {
    return this.http
      .get('/subordinate/group')
      .pipe(map((test: any) => this.convertSupEmpGroup(test)));
  }
  private convertSupEmpGroup(dataModel: any): SupEmpGroup {
    const data = {
      content: dataModel.content,
      pageable: dataModel.pageable,
      last: dataModel.last,
      totalPages: dataModel.totalPages,
      totalElements: dataModel.totalElements,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      first: dataModel.first,
      numberOfElements: dataModel.numberOfElements,
      empty: dataModel.empty,
    };
    const model = new MySupEmpGroup(data, this.translateService);
    return model;
  }

  getWorkExp(empId: any): Observable<WorkExp[]> {
    if (empId == undefined) {
      return this.http
        .get('/employee/experience')
        .pipe(map((x: any) => x.map((test: any) => this.convertWorkExp(test))));
    } else {
      return this.http
        .get('/employee/experience?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any) => x.map((test: any) => this.convertWorkExp(test))));
    }

  }
  private convertWorkExp(dataModel: any): WorkExp {
    const data = {
      expIndex: dataModel.expIndex,
      companyName: dataModel.companyName,
      expPosition: dataModel.expPosition,
      expFrom: dataModel.expFrom,
      expTo: dataModel.expTo,
      salary: dataModel.salary,
      resignReason: dataModel.resignReason
    };
    return data;
  }

  //useitnow
  // getSupEmpList(groupId?: string, pageS? : number, pageI? : number): Promise<WorkingsModel[]> {
  //   if (groupId == undefined) {
  //     return new Promise((resolve, reject) => {
  //       this.http
  //         .get<WorkingsModel[]>(
  //           '/employee/subordinates?size=' + pageS + '&page=' + pageI
  //         )
  //         .subscribe((response) => {
  //           resolve(response);
  //         });
  //     });
  //   } else {
  //     if (pageS != undefined && pageI != undefined) {
  //       return new Promise((resolve, reject) => {
  //         this.http
  //           .get<WorkingsModel[]>(
  //             '/employee/subordinates?subgroupid=' + groupId + '&page=' +  pageI + '&size=' + pageS
  //           )
  //           .subscribe((response) => {
  //             resolve(response);
  //           });
  //       });
  //     } else {
  //       return new Promise((resolve, reject) => {
  //         this.http
  //           .get<WorkingsModel[]>(
  //             '/employee/subordinates?subgroupid=' + groupId
  //           )
  //           .subscribe((response) => {
  //             resolve(response);
  //           });
  //       });
  //     }
  //   }
  // }

  deleteSubordinateList(body: any) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
        body: body
      };
      this.http.delete<any>(environment.jbossUrl + "/emvapi/subordinate/delete-subordinate-grp", options)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error: ErrorEvent) => {
            reject(error);
          }
        );
    });
  }
  postSubordinateList(body: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(environment.jbossUrl + "/emvapi/subordinate/save-subordinate-grp", body)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error: ErrorEvent) => {
            reject(error);
          }
        );
    });
  }

  getSubordinateList(): Promise<SubordinateModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<SubordinateModel[]>(
          '/subordinate/group/lists'
        )
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }

  getSubordinateEmpList(): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<Employee[]>(
          '/employee/empcenter'
        )
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }
  getSupEmpList(groupId: string, pageS: number, pageI: number): Promise<WorkingsModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<WorkingsModel[]>(
          '/employee/subordinates?subgroupid=' + groupId + '&page=' + pageI + '&size=' + pageS
        )
        .subscribe((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }
  // getSupEmpListPage(groupId: string, pageS: number, pageI: number): Observable<EmployeeSubordinatesPageModel> {
  //   const params = new HttpParams()
  //     .set('subgroupid', groupId || '')
  //     .set('page', String(pageI))
  //     .set('size', String(pageS));

  //   return this.http.get<EmployeeSubordinatesPageModel>('/employee/subordinates', { params });
  // }
  getSupEmpListPage(
    groupId: string, pageS: number, pageI: number, search?: string
  ): Observable<EmployeeSubordinatesPageModel> {
    let params = new HttpParams()
      .set('subgroupid', groupId || '')
      .set('page', String(pageI))
      .set('size', String(pageS));
  
    if (search && search.trim()) {
      // หมายเหตุ: เปลี่ยนชื่อ key ให้ตรงกับ Backend ของคุณ เช่น 'q' / 'keyword' / 'search'
      params = params.set('search', search.trim());
    }
  
    return from(
      this.getWithCache<EmployeeSubordinatesPageModel>('/employee/subordinates', params)
    );
  }


  getSupEmpList2(groupId?: string, pageS?: number, pageI?: number): Observable<SupEmpList> {
    if (groupId == undefined) {
      return this.http
        .get('/employee/subordinates?size=' + pageS + '&page=' + pageI)
        .pipe(map((test: any) => this.convertSupEmpList(test)));
    } else {
      if (pageS != undefined && pageI != undefined) {
        return this.http
          .get(
            '/employee/subordinates?subgroupid=' +
            groupId +
            '&page=' +
            pageI +
            '&size=' +
            pageS
          )
          .pipe(map((test: any) => this.convertSupEmpList(test)));
      } else {
        return this.http
          .get('/employee/subordinates?subgroupid=' + groupId)
          .pipe(map((test: any) => this.convertSupEmpList(test)));
      }
    }
  }

  private convertSupEmpList(dataModel: any): SupEmpList {
    const data = {
      content: dataModel.content,
      pageable: dataModel.pageable,
      last: dataModel.last,
      totalPages: dataModel.totalPages,
      totalElements: dataModel.totalElements,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      first: dataModel.first,
      numberOfElements: dataModel.numberOfElements,
      empty: dataModel.empty,
    };

    return data;
  }

  getSupleaveStatistic(startDate?: any, endDate?: any): Observable<SupLeaveStat> {
    return this.http
      .get('/tls/subordinate/start/' + startDate + '/end/' + endDate)
      .pipe(map((test: any) => this.convertSupLeaveStatistic(test)));
  }

  private convertSupLeaveStatistic(dataModel: any): SupLeaveStat {
    const data = {
      content: dataModel.content,
      pageable: dataModel.pageable,
      last: dataModel.last,
      totalPages: dataModel.totalPages,
      totalElements: dataModel.totalElements,
      number: dataModel.number,
      sort: dataModel.sort,
      size: dataModel.size,
      first: dataModel.first,
      numberOfElements: dataModel.numberOfElements,
      empty: dataModel.empty,
    };
    return data;
  }

  getListEmpWorking(sizePage: number, page: number): Promise<WorkingsModel[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<WorkingsModel[]>(
          '/employee/workings?size=' + sizePage + '&page=' + page
        )
        .subscribe((response) => {
          resolve(response);
        });
    });
  }

  getListEmpWorkingObserve(sizePage: number, page: number): Observable<WorkingsModel[]> {
    return this.http
      .get<WorkingsModel[]>(
        '/employee/workings/mini?page=' + page + '&size=' + sizePage
      )

  }

  getEmployeeWorkings(sizePage: number, page: number): Promise<ContentsModel> {
    return new Promise((resolve, reject) => {
      this.http.get<ContentsModel>('/employee/workings?size=' + sizePage + '&page=' + page).subscribe(response => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }


  getListEmpWorking2(sizePage?: number): Promise<WorkingsModel[]> {
    return new Promise((resolve, reject) => {
      if (sizePage) {
        this.http
          .get<WorkingsModel[]>(
            '/employee/workings?size=' + sizePage
          )
          .subscribe((response) => {
            resolve(response);
          });
      } else {
        this.http
          .get<WorkingsModel[]>(
            '/employee/workings'
          )
          .subscribe((response) => {
            resolve(response);
          });
      }

    });
  }



  getBank(empId?: any): Observable<EmpBank[]> {
    if (empId == undefined) {
      return this.http.get<any>(environment.baseUrl + '/employee/bank')
    } else {
      return this.http
        .get('/employee/bank?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any) => x.map((test: any) => this.convertEmpBank(test))));
    }
  }

  private convertEmpBank(dataModel: any): EmpBank {
    const data = {
      employeeId: dataModel.employeeId,
      bank: dataModel.bank,
      bankBranch: dataModel.bankBranch,
      accountId: dataModel.accountId,
    };
    const model = new MyEmpBank(data, this.translateService);
    return model;
  }

  getCard(empId?: any): Observable<EmpCard[]> {
    if (empId == undefined) {
      return this.http
        .get('/employee/cards')
        .pipe(map((x: any) => x.map((test: any) => this.convertEmpCard(test))));
    } else {
      return this.http
        .get('/employee/cards?employeeid=' + this.cyptoService.encryptUsingAES256(empId))
        .pipe(map((x: any) => x.map((test: any) => this.convertEmpCard(test))));
    }
  }

  private convertEmpCard(dataModel: any): EmpCard {
    const data = {
      employeeId: dataModel.employeeId,
      cardType: dataModel.cardType,
      activeDate: dataModel.activeDate,
      expireDate: dataModel.expireDate,
      cardNo: dataModel.cardNo,
      cardDesc: dataModel.cardDesc,
      atFile: dataModel.atFile,
      createBy: dataModel.createBy
    };
    const model = new MyEmpCard(data, this.translateService);
    return model;
  }

  getSupTimeWarn(start?: any, end?: any, groupId?: any): Observable<SupTimeWarn[]> {
    var data;
    if (groupId) {
      data = this.http
        .get('/tc1/subordinates/warning/period/start/' + start + '/end/' + end + '?subgroupid=' + groupId)
        .pipe(
          map((x: any) => x.map((result: any) => new MySupTimeWarn(result, this.translateService)))
        );
    } else {
      data = this.http
        .get('/tc1/subordinates/warning/period/start/' + start + '/end/' + end)
        .pipe(
          map((x: any) => x.map((result: any) => new MySupTimeWarn(result, this.translateService)))
        );
    }

    return data;
  }

  getNewSupLeaveStatistic(param?: {
    start?: string;
    end?: string;
    page?: number;
    size?: number;
    subgroupid?: string;
  }): Promise<PageModel<EmpLeaveSum>> {
    return new Promise((resolve, reject) => {
      this.http.get<LeaveStat>('/tls/subordinate/start/' + param?.start + '/end/' + param?.end + '?size=' + param?.size + '&page=' + param?.page+ '&subgroupid=' + param?.subgroupid)
        .subscribe((response: any) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    });
  }

  getTrainPlan(param?: {
    employeeid?: string;
    page?: number;
    size?: number;
  }): Observable<PageModel<TrainingContent>> {
    let url = '/trainee/plan?employeeid=' + this.cyptoService.encryptUsingAES256(param?.employeeid!);
    return this.http
      .get<PageModel<TrainingContent>>(url, this.getHttpParam(param))
      .pipe(
        map((page) => {
          return {
            ...page,
            content: page.content.map(
              (e) => new MyTrainingContent(e, this.translateService)
            ),
          };
        })
      );
  }

  getTrainHis(param?: {
    employeeid?: string;
    page?: number;
    size?: number;
  }): Observable<PageModel<TrainingContent>> {
    let url = '/trainee/history?employeeid=' + this.cyptoService.encryptUsingAES256(param?.employeeid!);
    return this.http
      .get<PageModel<TrainingContent>>(url, this.getHttpParam(param))
      .pipe(
        map((page) => {
          return {
            ...page,
            content: page.content.map(
              (e) => new MyTrainingContent(e, this.translateService)
            ),
          };
        })
      );
  }

  getTrainRecc(param?: {
    employeeid?: string;
    page?: number;
    size?: number;
  }): Observable<PageModel<RecommendContent>> {
    let url = '/trainee/recommend?employeeid=' + this.cyptoService.encryptUsingAES256(param?.employeeid!);
    return this.http
      .get<PageModel<RecommendContent>>(url, this.getHttpParam(param))
      .pipe(
        map((page) => {
          return {
            ...page,
            content: page.content.map(
              (e) => new MyRecommendContent(e, this.translateService)
            ),
          };
        })
      );
  }

  getNewSupLeaveStatisticEvent(param?: {
    start?: string;
    end?: string;
    eventgrpid?: string;
    employeeid?: string;
  }) {
    let url =
      '/tls/eventgrp/' +
      param?.eventgrpid +
      '/start/' +
      param?.start +
      '/end/' +
      param?.end +
      '?employeeid=' +
      this.cyptoService.encryptUsingAES256(param?.employeeid!);
    return this.http
      .get<PageModel<LeaveSummary[]>>(url, this.getHttpParam(param))
      .pipe(
        map((page) => {
          return {
            ...page,
            content: page.content.map(
              (e) => new MyLeaveSummary(e, this.translateService)
            ),
          };
        })
      );
  }

  getEmpInSupLeaveEventgrp(param?: { employeeid?: string }) {
    let url = environment.jbossUrl + '/taapi/leave/eventgrp/' + param?.employeeid;
    return this.http.get<EventgrpWF[]>(url, this.getHttpParam(param)).pipe(map((response) =>
      response.map(x =>
        new MyEventgrpWF(x, this.translateService)
      )
    ));
  }

  getEmpInSupLeaveStatisticEvent(param?: { employeeid?: string }) {
    let url =
      environment.jbossUrl + '/taapi/leave/statistic/' + param?.employeeid;
    return this.http
      .get<LeaveStatJboss>(url, this.getHttpParam(param))
      .pipe(
        map((response) => new MyLeaveStatJboss(response, this.translateService))
      );
  }

  private getHttpParam(param: any): { params?: HttpParams } {
    return param != undefined
      ? {
        params: Object.entries(param).reduce(
          (params, [key, value]) => params.set(key, String(value)),
          new HttpParams()
        ),
      }
      : {};
  }

  getEmployeeWorkingWithPagable(param?: {
    page?: number;
    size?: number;
  }): Observable<PageModel<WorkingsModel>> {
    const url = "/employee/workings";
    return this.http.get<PageModel<WorkingsModel>>(url, this.getHttpParam(param))
      .pipe(
        map((page) => {
          return {
            ...page,
            content: page.content.map(
              (e) => new MyWorkingsModel(e, this.translateService)
            ),
          };
        }),
        tap(x => console.log("EMPWORKING", x))
      );
  }

  getEmployeeCenter(): Observable<any> {
    return this.http
      .get('/employee/empcenter')
      .pipe();
  }

  getEmployeeCenterResign(): Observable<any> {
    return this.http
      .get('/employee/empcenter')
      .pipe();
  }


  getTax(empId?: any): Promise<Tax> {
    return new Promise((resolve, reject) => {
      if (empId == undefined) {
        this.http
          .get(environment.baseUrl + "/employee/tax")
          .subscribe((data: any) => {
            resolve(data);
          });
      } else {
        this.http
          .get(environment.baseUrl + "/employee/tax?employeeid=" + this.cyptoService.encryptUsingAES256(empId))
          .subscribe((data: any) => {
            resolve(data);
          });
      }
    });
  }

  getProvidentFund(empId?: any): Promise<PVFund[]> {
    return new Promise((resolve, reject) => {
      if (empId == undefined) {
        this.http
          .get(environment.baseUrl + "/employee/pvf")
          .subscribe((data: any) => {
            resolve(data);
          });
      } else {
        this.http
          .get(environment.baseUrl + "/employee/pvf?employeeid=" + this.cyptoService.encryptUsingAES256(empId))
          .subscribe((data: any) => {
            resolve(data);
          });
      }
    });
  }

  getWorkingPlan(empId: string, startDate: string, endDate: string): Promise<EmpShiftModel> {
    let body = {
      "employeeId": empId,
      "startDate": startDate,//dd-mm-yyyy
      "endDate": endDate//dd-mm-yyyy
    }
    return new Promise((resolve, reject) => {
      this.http
        .post(environment.jbossUrl + "/taapi/working-time/get-working-plan", body)
        .subscribe((data: any) => {
          resolve(data);
        }), (error: any) => {
          reject(error);
        }
    });
  }
  getWorkingPlan2(empId: string, startDate: string, endDate: string): Promise<Dayoff[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.jbossUrl + "/taapi/working-time/working-plan/start/" + startDate + "/end/" + endDate + "?employeeid=" + this.cyptoService.encryptUsingAES256(empId))
        .subscribe((data: any) => {
          resolve(data);
        }), (error: any) => {
          reject(error);
        }
    });
  }

  empChangeShiftList(emp: string, datalist: string, datalist_old: string): Promise<EmpShiftModel> {
    let body = {
      "emp": emp,
      "datalist": datalist,
      "datalist_old": datalist_old
    }
    return new Promise((resolve, reject) => {
      this.http
        .post(environment.jbossUrl + "/taapi/working-time/emp-change-shift-list", body)
        .subscribe((data: any) => {
          resolve(data);
        }), (error: any) => {
          reject(error);
        }
    });
  }

  getSetPass(): Promise<setCharacter> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseUrl + "/user/manage")
        .subscribe((data: any) => {
          resolve(data);
        }), (error: any) => {
          reject(error);
        }
    })
  }

  getDailyWorkEmployee(startEmployeeId: string, startDate: string, endDate: string, endEmployeeId?: string, branch?: string, bu1?: string, bu2?: string, bu3?: string, bu4?: string, bu5?: string, salatype?: string): Promise<DailyTimeEmpModel[]> {
    let paramArray = []
    if (!endEmployeeId) {
      paramArray.push('employeeId=' + startEmployeeId,
        'startDate=' + startDate,
        'endDate=' + endDate,
        branch ? ('branch=' + branch) : '',
        bu1 ? ('bu1=' + bu1) : '',
        bu2 ? ('bu2=' + bu2) : '',
        bu3 ? ('bu3=' + bu3) : '',
        bu4 ? ('bu4=' + bu4) : '',
        bu5 ? ('bu5=' + bu5) : '',
        salatype ? ('salatype=' + salatype) : '')
    } else {
      paramArray.push('startEmployeeId=' + startEmployeeId,
        'endEmployeeId=' + endEmployeeId,
        'startDate=' + startDate,
        'endDate=' + endDate,
        branch ? ('branch=' + branch) : '',
        bu1 ? ('bu1=' + bu1) : '',
        bu2 ? ('bu2=' + bu2) : '',
        bu3 ? ('bu3=' + bu3) : '',
        bu4 ? ('bu4=' + bu4) : '',
        bu5 ? ('bu5=' + bu5) : '',
        salatype ? ('salatype=' + salatype) : '')
    }
    let param = '?' + paramArray.filter(x => x != '').join('&')
    return this.http.get<DailyTimeEmpModel[]>(environment.baseUrl + "/tc1/lists" + param).toPromise()
  }

  getDailyWorkEmployeePage(page: string, size: string, startDate: string, endDate: string, startEmployeeId?: string, endEmployeeId?: string, salatype?: string): Observable<DailyTimeEmpPageModel> {
    let paramArray = []
    paramArray.push('page=' + page,
      'size=' + size,
      'startDate=' + startDate,
      'endDate=' + endDate,
      salatype ? ('salatype=' + salatype) : '')
    if (startEmployeeId && !endEmployeeId) {
      paramArray.push('employeeId=' + startEmployeeId)
    }
    if (endEmployeeId) {
      paramArray.push('startEmployeeId=' + startEmployeeId,
        'endEmployeeId=' + endEmployeeId)
    }
    let param = '?' + paramArray.filter(x => x != '').join('&')
    return this.http.get<DailyTimeEmpPageModel>(environment.baseUrl + "/tc1" + param)
  }

  getDailyWorkSubordinatesPage(page: string, size: string, startDate: string, endDate: string, startEmployeeId?: string, endEmployeeId?: string, subgroupid?: string, salatype?: string): Observable<DailyTimeEmpPageModel> {
    let paramArray = []
    paramArray.push('page=' + page,
      'size=' + size,
      'startDate=' + startDate,
      'endDate=' + endDate,
      salatype ? ('salatype=' + salatype) : '',
      subgroupid ? ('subgroupid=' + subgroupid) : '')
    if (startEmployeeId && !endEmployeeId) {
      paramArray.push('employeeId=' + startEmployeeId)
    }
    if (endEmployeeId) {
      paramArray.push('startEmployeeId=' + startEmployeeId,
        'endEmployeeId=' + endEmployeeId)
    }
    let param = '?' + paramArray.filter(x => x != '').join('&')
    return this.http.get<DailyTimeEmpPageModel>(environment.baseUrl + "/tc1/subordinates" + param)
  }

  getLeave(employeeid?: string): Promise<EventgrpLeave[]> {
    return new Promise((resolve, reject) => {
      this.http.get<EventgrpLeave[]>(environment.baseUrl + "/eventgrp/leave" + (employeeid ? '?employeeId=' + employeeid : '')).subscribe(result => resolve(result), error => reject(error))
    })
  }

  getLeaveEmpYear(yearId?: number) {
    return this.http.get<EventgrpLeave[]>(environment.baseUrl + "/eventgrp/leave?yearId=" + yearId)
  }

  setShift(model: any): Promise<any> {
    // "setShift" : [
    //   {
    //     "employeeId": "100004",
    //     "dateId": "2022-06-01",
    //     "oldTime0Id": "2H",
    //     "time0Id": "G1"
    //   },
    //   {
    //     "employeeId": string,
    //     "dateId": string,
    //     "oldTime0Id": string,
    //     "time0Id": string
    //   }
    // ]
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.jbossUrl + '/taapi/daily-attendance/set-shift', model)
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  setWorkOff(model: any): Promise<any> {
    //   "setWorkOff" : [
    //   {
    //   "employeeId" : "100004",
    //   "dateId" : "2022-06-01",
    //   "dateType" : "T"
    //   },
    //   {
    //   "employeeId" :string,
    //   "dateId" :string,
    //   "dateType" :string
    //   }
    //   ]
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.jbossUrl + '/taapi/daily-attendance/set-workoff', model)
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  postLeave(model: any): Promise<any> {
    // {
    //   "postleave" : [
    //     {
    //       "employeeId": "100004",
    //       "dateId": "2022-06-03",
    //       "startTime": "8.00",
    //       "endTime": "17.00",
    //       "leaveType": "ANL",
    //       "postingType": "0",
    //       "leaveReason": "ทดสอบลาวันที่ 3"
    //     },
    //     {
    //       "employeeId": string,
    //       "dateId": string,
    //       "startTime": string,
    //       "endTime": string,
    //       "leaveType": string,
    //       "postingType": string,
    //       "leaveReason": string
    //     }
    //   ]
    // }
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.jbossUrl + '/taapi/daily-attendance/post-leave', model)
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  getWorkAreaLists(): Promise<WorkArea[]> {
    return new Promise((resolve, reject) => {
      this.http.get<WorkArea[]>(environment.baseUrl + '/work-area/lists')
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  getCostCenterlists(): Promise<CostCenterModel[]> {
    return new Promise((resolve, reject) => {
      this.http.get<CostCenterModel[]>(environment.baseUrl + '/cost-center/lists')
        .subscribe(result => resolve(result), error => reject(error))
    })
  }
   getCostCenterlistsActive(): Promise<CostCenterModel[]> {
    return new Promise((resolve, reject) => {
      this.http.get<CostCenterModel[]>(environment.baseUrl + '/cost-center/list-active')
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  setCOff(model: any): Promise<any> {
    //     "setCOff" : [
    //         {
    //             "employeeId" : "100004",
    //             "dateId" : "2022-06-26",
    //             "dateType" : "T",
    //             "formatType" : "0",
    //             "leaveReason" : " ทดสอบ"
    //         }
    //     ]
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.jbossUrl + '/taapi/daily-attendance/set-coff', model)
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  process(model: any): Promise<any> {
    //     "process" : [
    //         {
    //             "employeeId" : "100004",
    //             "dateId" : "2022-06-03"
    //         },
    //         {
    //             "employeeId" : string,
    //             "dateId" : string
    //         }
    //     ]
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.jbossUrl + '/taapi/daily-attendance/process', model)
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  saveBossForgetCard(model: any): Promise<any> {
    // "fsCardId" : "0",
    // "empRequest" : "410305",
    // "timeRequest" : [
    //     {
    //         "lineNo" : "1",
    //         "employeeId" : "100004",
    //         "forgetDate" : "2022-06-26",
    //         "forgetTime" : "8.00",
    //         "forgetType" : "0",
    //         "remark" : "ทดสอบเวลาเข้า"
    //     },
    //     {
    //         "lineNo" : "2",
    //         "employeeId" : "100004",
    //         "forgetDate" : "2022-06-26",
    //         "forgetTime" : "17.00",
    //         "forgetType" : "1",
    //         "remark" : "ทดสอบเวลาออก"
    //     }
    // ]
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.jbossUrl + '/taapi/time-attendance/save-boss-forget-card', model)
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  saveOt(model: any): Promise<any> {
    // "otId" : "0",
    // "empRequest" : "410305",
    // "timeRequest" : [
    //     {
    // "lineNo" : "1",
    // "employeeId" : "100004",
    // "startDate" : "2022-06-27",
    // "endDate" : "2022-06-27",
    // "startTime" : "17.00",
    // "endTime" : "20.00",
    // "totalTime" : "3.00",
    // "otCause" : "SP",
    // "otWorkArea" : "HR",
    // "otCostCenter" : "1001",
    // "otType" : "0",
    // "otTime0" : "1",
    // "remark" : "ทดสอบขอโอที"
    //     }
    // ]
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.jbossUrl + '/taapi/time-attendance/save-ot', model)
        .subscribe(result => resolve(result), error => reject(error))
    })
  }

  recruitApplicantLists(): Promise<RecruitApplicantModel[]> {
    return this.http.get<RecruitApplicantModel[]>(environment.baseUrl + '/recruit/applicant/lists').toPromise()
  }

  recruitApplicantPage(page: string, size: string, startDate?: string, endDate?: string): Observable<RecruitApplicantPageModel> {
    if (startDate && endDate) {
      return this.http.get<RecruitApplicantPageModel>(environment.baseUrl + '/recruit/applicant/period/' + startDate + '/' + endDate + '?page=' + page + '&size=' + size)
    }
    return this.http.get<RecruitApplicantPageModel>(environment.baseUrl + '/recruit/applicant?page=' + page + '&size=' + size)
  }

  prefixLists(): Promise<PrefixModel[]> {
    return this.http.get<PrefixModel[]>(environment.baseUrl + '/prefix/lists').toPromise()
  }
  getHandicapped(): Promise<HandicappedTypeModel[]> {
    return this.http.get<HandicappedTypeModel[]>(environment.baseUrl + '/handicapped/list').toPromise()
  }

  positionLists(): Promise<PositionModel[]> {
    return this.http.get<PositionModel[]>(environment.baseUrl + '/position/lists').toPromise()
  }

  requestApplicantLists(): Promise<RequestApplicantModel[]> {
    return this.http.get<RequestApplicantModel[]>(environment.baseUrl + '/request/lists').toPromise()
  }

  requestApplicantPage(page: string, size: string): Observable<RequestApplicantPageModel> {
    return this.http.get<RequestApplicantPageModel>(environment.baseUrl + '/request?page=' + page + '&size=' + size)
  }

  employeeSubordinates(page: string, size: string, subgroupid?: string): Promise<EmployeeSubordinatesPageModel> {
    if (subgroupid) {
      return this.http.get<EmployeeSubordinatesPageModel>(environment.baseUrl + '/employee/subordinates?page=' + page + '&size=' + size + '&subgroupid=' + subgroupid).toPromise()
    } else {
      return this.http.get<EmployeeSubordinatesPageModel>(environment.baseUrl + '/employee/subordinates?page=' + page + '&size=' + size).toPromise()
    }
  }

  subordinateGroupLists(): Promise<SubordinateModel[]> {
    return this.http.get<SubordinateModel[]>(environment.baseUrl + '/subordinate/group/lists').toPromise()
  }

  salatypeLists(): Promise<ObjModel[]> {
    return this.http.get<ObjModel[]>(environment.baseUrl + '/salatype/lists').toPromise()
  }
  getSalatypeRateLists(): Promise<ObjModel[]> {
    return this.http.get<ObjModel[]>(environment.baseUrl + '/salary-rate/workarea').toPromise()
  }
  getJobSalatypeRateLists(workareaId: string): Promise<ObjModel[]> {
    return this.http.get<ObjModel[]>(environment.baseUrl + '/salary-rate/jobcode/' + workareaId).toPromise()
  }
  getProcessEmp(starDate: string, endDate: string): Promise<EmployeeProcessModel[]> {
    return this.http.get<EmployeeProcessModel[]>(environment.baseUrl + '/employee/start-work/' + starDate + '/' + endDate).toPromise()
  }

  time0List(): Promise<Time0Model[]> {
    return this.http.get<Time0Model[]>(environment.baseUrl + '/time0/lists?status=0').toPromise()
  }

  eventgrpLeave(empId?: string): Promise<EventgrpLeaveModel[]> {
    if (empId) {
      return this.http.get<EventgrpLeaveModel[]>(environment.baseUrl + '/eventgrp/leave').toPromise()
    } else {
      return this.http.get<EventgrpLeaveModel[]>(environment.baseUrl + '/eventgrp/leave?employeeId=' + empId).toPromise()
    }
  }

  changeReasonLists(): Promise<ReasonModel[]> {
    return this.http.get<ReasonModel[]>(environment.baseUrl + '/change-reason/lists').toPromise()
  }

  overtimeReasonLists(): Promise<ReasonModel[]> {
    return this.http.get<ReasonModel[]>(environment.baseUrl + '/overtime-reason/lists').toPromise()
  }

  workAreaLists(): Promise<WorkAreaModel[]> {
    return this.http.get<WorkAreaModel[]>(environment.baseUrl + '/work-area/lists').toPromise()
  }

  costCenterLists(): Promise<CostcenterModel[]> {
    return this.http.get<CostcenterModel[]>(environment.baseUrl + '/cost-center/lists').toPromise()
  }

  jobcodeLists(): Promise<JobcodeModel[]> {
    return this.http.get<JobcodeModel[]>(environment.baseUrl + '/jobcode/lists').toPromise()
  }

  employeeWorkingsPage(page: string, size: string): Observable<EmployeePageModel> {
    return this.http.get<EmployeePageModel>(environment.baseUrl + '/employee/workings?page=' + page + '&size=' + size)
  }

  nationalityLists(): Promise<NationalityModel[]> {
    return this.http.get<NationalityModel[]>(environment.baseUrl + '/nationality/lists').toPromise()
  }

  nationalLists(): Promise<NationalModel[]> {
    return this.http.get<NationalModel[]>(environment.baseUrl + '/national/lists').toPromise()
  }

  religionLists(): Promise<ReligionModel[]> {
    return this.http.get<ReligionModel[]>(environment.baseUrl + '/religion/lists').toPromise()
  }

  recruitAppointmentLists(): Promise<RecruitAppointmentModel[]> {
    return this.http.get<RecruitAppointmentModel[]>(environment.baseUrl + '/recruit/appointment/lists').toPromise()
  }

  degreeLists(): Promise<DegreeModel[]> {
    return this.http.get<DegreeModel[]>(environment.baseUrl + '/degree/lists').toPromise()
  }

  institueLists(): Promise<InstitueModel[]> {
    return this.http.get<InstitueModel[]>(environment.baseUrl + '/institue/lists').toPromise()
  }

  facultyLists(): Promise<FacultyModel[]> {
    return this.http.get<FacultyModel[]>(environment.baseUrl + '/faculty/lists').toPromise()
  }

  majorLists(): Promise<MajorModel[]> {
    return this.http.get<MajorModel[]>(environment.baseUrl + '/major/lists').toPromise()
  }

  zipcodeLists(): Promise<ZipcodeModel[]> {
    return this.http.get<ZipcodeModel[]>(environment.baseUrl + '/zipcode/lists').toPromise()
  }
  familyRelationList(): Promise<FamilyralationModel[]> {
    return this.http.get<FamilyralationModel[]>(environment.baseUrl + '/relation/lists').toPromise()
  }
  familyList(): Promise<FamilyModel[]> {
    return this.http.get<FamilyModel[]>(environment.baseUrl + '/family/lists').toPromise()
  }
  langSkillList(): Promise<LangSkillModel[]> {
    return this.http.get<LangSkillModel[]>(environment.baseUrl + '/language/lists').toPromise()
  }
  occupationList(): Promise<OccupationModel[]> {
    return this.http.get<OccupationModel[]>(environment.baseUrl + '/occupation/lists').toPromise()
  }
  branchList(): Promise<BranchModel[]> {
    return this.http.get<BranchModel[]>(environment.baseUrl + '/branch/lists').toPromise()
  }
  sourcejobList(): Promise<SourcejobModel[]> {
    return this.http.get<SourcejobModel[]>(environment.baseUrl + '/source-job/lists').toPromise()
  }
  getIdPeople(id: string): Promise<any> {
    return this.http.get<any>(environment.baseUrl + '/employee/roster-people/' + id).toPromise()
  }
  getadAccount(adAccount: string): Promise<any> {
    return this.http.get<any>(environment.baseUrl + '/user/ad-account/' + adAccount).toPromise()
  }
  paperTypeList(): Promise<MyPaperListModel[]> {
    return this.http.get<MyPaperListModel[]>(environment.baseUrl + '/paper-list/lists').toPromise()
  }
  wantInterview(body: any): Promise<any> {
    return this.http.post<any>(environment.jbossUrl + '/reapi/recruit/want-interview', body).toPromise()
  }
  postEmployeeRoster(body: EmployeeRosterModel): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/employee/roster', body).toPromise()
  }
  postEmployeeRosterImport(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/employee/roster/import', body).toPromise()
  }
  postEmployeeWaiver(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/employee/waiver-list', body).toPromise()
  }
  postEmployeeWaiverList(body: any): Promise<any> {
    return this.http.post<any>(environment.baseUrl + '/employee/delete', body).toPromise()
  }

  trainingList(starDate: string, endDate: string): Observable<Training[]> {
    return this.http.get<Training[]>(environment.baseUrl + '/training/date/' + starDate + "/" + endDate).pipe(map((x: Training[]) => x.map(y => new MyTraining(y, this.translateService))));
  }

  getKerryEmpWorkAreaLists(): Observable<KerryEmployeeModel[]> {
    return this.http.get<KerryEmployeeModel[]>(environment.baseUrl + '/employee/work-area')
  }
  getKerryEmpWorkAreaByDate(startDate: string): Observable<KerryEmployeeModel[]> {
    // yyyy-mm-dd
    return this.http.get<KerryEmployeeModel[]>(environment.baseUrl + '/employee/work-area/date/' + startDate)
  }
  getKerryEmpByWorkAreaDateLists(workareaId: string, startDate: string, endDate: string): Observable<KerryEmployeeModel[]> {
    return this.http.get<KerryEmployeeModel[]>(environment.baseUrl + '/employee/work-area/' + workareaId + '/' + startDate + '/' + endDate)
  }
  getKerryEmpByWorkAreaSubordinates(workareaId: string): Observable<KerryEmployeeModel[]> {
    return this.http.get<KerryEmployeeModel[]>(environment.baseUrl + '/employee/subordinates/' + workareaId)
  }
  getKerryEmpListByWorkArea(workareaId: string): Observable<KerryEmployeeModel[]> {
    return this.http.get<KerryEmployeeModel[]>(environment.baseUrl + '/employee/work-area/list/' + workareaId)
  }
  getKerryEmpListByWorkAreaCenter(workareaId: string): Observable<KerryEmployeeModel[]> {
    return this.http.get<KerryEmployeeModel[]>(environment.baseUrl + '/employee/empcenter/work-area/' + workareaId)
  }
  getEmptype(): Observable<Type[]> {
    return this.http.get<Type[]>(environment.baseUrl + '/employee-type/lists')
  }
  getChangeReason(): Observable<ReasonModel[]> {
    return this.http.get<ReasonModel[]>(environment.baseUrl + '/change-reason/lists')
  }
  getWorkArea(): Observable<WorkAreaModel[]> {
    return this.http.get<WorkAreaModel[]>(environment.baseUrl + '/work-area/lists')
  }
  getCostCenter(): Observable<KerryCostCenterModel[]> {
    return this.http.get<KerryCostCenterModel[]>(environment.baseUrl + '/cost-center/lists')
  }
  getCostCenterActive(): Observable<KerryCostCenterModel[]> {
    return this.http.get<KerryCostCenterModel[]>(environment.baseUrl + '/cost-center/list-active')
  }
  kerryProcess(body: any): Observable<any> {
    //     "process" : [
    //         {
    //             "employeeId" : string,
    //             "dateId" : string
    //         }
    //     ]
    return this.http.post<any>(environment.jbossUrl + '/taapi/daily-attendance/process', body)
  }
  getEmpSubordinates(): Observable<KerryEmployeeModel[]> {
    return this.http.get<KerryEmployeeModel[]>(environment.baseUrl + '/employee/subordinates-list')
  }
  getAgeWork(employeeId: string): Observable<{
    startDate: string, day: string, month: string, year: string
  }> {
    return this.http.get<{
      startDate: string, day: string, month: string, year: string
    }>(environment.baseUrl + '/employee/age-work?employeeid=' + this.cyptoService.encryptUsingAES256(employeeId)
    )
  }
  getPwf014Tax(employeeId: string): Observable<KerryTaxModel> {
    return this.http.get<KerryTaxModel>(environment.baseUrl + '/employee/pwf014-tax?employeeid=' + this.cyptoService.encryptUsingAES256(employeeId))
  }

  checkOt1Temp(startDate: string, endDate: string, startTime: string, endTime: string, employeeId?: string): Observable<Ot1TempModel> {
    return this.http.get<Ot1TempModel>('/totmdate/check-ot1-temp/period?startDate=' + startDate + '&endDate=' + endDate + '&startTime=' + startTime + '&endTime=' + endTime + (employeeId ? '&employeeid=' + this.cyptoService.encryptUsingAES256(employeeId) : ''))
  }

  getPvftran(fundTableId: string, genDate: string, idMember: string): Observable<any> {
    return this.http.get<any>(environment.baseUrl + '/pvf-tran/' + fundTableId + '/' + genDate + '?idMember=' + idMember)
  }
  configTax(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + '/config/lists/tax')
  }

  getZeemeSync() {
    return this.http.get<{
      employeeId: string;
      companyId: string;
      employeeCode: string;
      memberId: string;
      lagacyId: string;
      lagacyName: string;
      usernameId: string;
    }>(environment.baseUrl + '/zeeme/sync')
  }
  getMenuZeeme(companyId: string) {
    return this.http.get<any>(`https://zeeme.myhr.co.th/ZeemeApi/rest/company-config/${companyId}`);
  }

  getEmployeeWorkingsMini(): Observable<WorkingsMiniModel[]> {
    return this.http.get<WorkingsMiniModel[]>(environment.baseUrl + '/employee/workings/mini/lists')
  }

  getPosition(): Observable<PositionModel[]> {
    return this.http.get<PositionModel[]>(environment.baseUrl + '/position/lists')
  }
}
