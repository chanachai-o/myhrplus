import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AssessService {

    constructor(private http: HttpClient,
        private translateService: TranslateService
    ) { }

    getMastypeList() {
        return this.http.get(environment.baseUrl + '/appraisal/mastype/lists')
    }
    getAssessorList(apsyear: string, astid: string, employeeid: string) {
        return this.http.get(environment.baseUrl + '/appraisal/assessor/lists?apsyear=' + apsyear + '&astid=' + astid + '&employeeid=' + employeeid)
    }
    getAssessedListHr(apsyear: string, astid: string) {
        return this.http.get(environment.baseUrl + '/appraisal/assessed/lists?apsyear=' + apsyear + '&astid=' + astid)
    }
    getMasformDetail(asfid: string, employeeid: string, astid: string, apsyear: string, apsId: string, screen?: string) {
        return this.http.get(environment.baseUrl + '/appraisal/v2/masform-detail?asfid=' + asfid + '&employeeid=' + employeeid + '&astid=' + astid + '&apsyear=' + apsyear + '&apsId=' + apsId + (screen ? screen : ''))
    }
    getKpiformDetail(asfid: string, employeeid: string, astid: string, apsyear: string, apsId: string, screen?: string) {
        return this.http.get(environment.baseUrl + '/appraisal/masform-kpi?asfid=' + asfid + '&employeeid=' + employeeid + '&astid=' + astid + '&apsyear=' + apsyear + '&apsId=' + apsId + (screen ? screen : ''))
    }
    getSumformDetail(body: {
        asfId: string,
        asfIdKpi: string,
        apsId: string,
        apsKpiId: string,
        apstId: string,
        apstKpiId: string,
        apsyear: string,
        apsKpiyear: string,
        employeeId: string,
        dateNow: string
    }) {
        return this.http.post(environment.baseUrl + '/appraisal/competency-sum', body)
    }

    getOverallDetail(asfid: string, apsyear: string, astid: string, employeeid: string) {
        return this.http.get(environment.baseUrl + '/appraisal/masform-summary?asfid=' + asfid + '&apsyear=' + apsyear + '&astid=' + astid + '&employeeid=' + employeeid)
    }
    saveCompetencyMasform(body: any, assessor: string, screen?: string) {
        return this.http.post(environment.baseUrl + '/appraisal/v2/masform-competency?assessor=' + assessor + (screen ? screen : ''), body)
    }
    saveKpiform(body: any, assessor: string) {
        return this.http.post(environment.baseUrl + '/appraisal/kpi-masform?assessor=' + assessor, body)
    }
    saveSumform(body: any) {
        return this.http.post(environment.baseUrl + '/appraisal/hrapproved-save', body)
    }

    saveOverallDetail(body: any, assessor: string) {
        return this.http.post(environment.baseUrl + '/appraisal/summary-save?assessor=' + assessor, body)
    }

    saveKpiPicture(pictureModel: any) {
        return this.http.post(environment.jbossUrl + '/wapi/workflow/uploadfile', pictureModel, { observe: 'response' })
    }
    dowloadPicture(filename: string, subfolder?: string) {
        window.open(environment.jbossUrl + "/FileDownload.jsp?uploadfield=competency_kpi1.image&filename=" + filename + (subfolder ? "&subfolder=" + subfolder : ''))
    }
    saveAssessorList(body: any) {
        return this.http.post(environment.baseUrl + '/appraisal/assessed-save', body)
    }
    getSignature() {
        return this.http.get(environment.baseUrl + '/employee/user-level/signature')
    }

    getLogoImg(branchId: string): Observable<{ branchId: string, tdesc: string, edesc: string, logo: string }> {
        return this.http.get<{ branchId: string, tdesc: string, edesc: string, logo: string }>(environment.baseUrl + '/branch/logo/' + branchId)
    }
}