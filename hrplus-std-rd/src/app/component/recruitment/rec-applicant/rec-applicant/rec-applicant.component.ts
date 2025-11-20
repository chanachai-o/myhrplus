import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core'
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule, NgbDateStruct, NgbModal, NgbNav, NgbNavModule, NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import endOfMonth from 'date-fns/endOfMonth'
import { Subscription } from 'rxjs'
import { MyBranch } from 'src/app/models/branch.model'
import { BranchModel, MyBranchModel } from 'src/app/models/branchmodel.model'
import { DegreeModel, MyDegreeModel } from 'src/app/models/degreemodel.model'
import { EmployeeModel, MyEmployeeModel, MyEmployeePageModel } from 'src/app/models/employeemodel.model'
import { FacultyModel, MyFacultyModel } from 'src/app/models/facultymodel.model'
import { InstitueModel, MyInstitueModel } from 'src/app/models/instituemodel.model'
import { JobcodeModel, MyJobcodeModel } from 'src/app/models/jobcodemodel.model'
import { LangSkillModel, MyLangSkillModel } from 'src/app/models/langskillmodel.model'
import { MajorModel, MyMajorModel } from 'src/app/models/majormodel.model'
import { MyNationalityModel, NationalityModel } from 'src/app/models/nationalitymodel.model'
import { MyNationalModel, NationalModel } from 'src/app/models/nationalmodel.model'
import { MyOccupationModel, OccupationModel } from 'src/app/models/occupationmodel.model'
import { MyPositionModel, PositionModel } from 'src/app/models/positionmodel.model'
import { MyPrefixModel, PrefixModel } from 'src/app/models/prefixmodel.model'
import { LangskillModel, MyRecruitApplicantPageModel, RecruitApplicantModel } from 'src/app/models/recruitapplicant.model'
import { FamilyralationModel, MyFamilyralationModel } from 'src/app/models/relationmdel.model'
import { MyReligionModel, ReligionModel } from 'src/app/models/religionmodel.model'
import { MyRequestApplicantModel, MyRequestApplicantPageModel, RequestApplicantModel } from 'src/app/models/requestapplicant.model'
import { WorkAreaModel } from 'src/app/models/workareamodel.model'
import { MyZipcodeModel, ZipcodeModel } from 'src/app/models/zipcodemodel.model'
import { EmployeeService } from 'src/app/services/employee.service'
import localeThai from '@angular/common/locales/th'
import { CommonModule, formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, registerLocaleData, TranslationWidth } from '@angular/common'
import { MySourcejobModel, SourcejobModel } from 'src/app/models/soureJobmodel.model'
import { Console } from 'console'
import { resolve } from 'path'
import { MyPaperListModel, PaperListModel } from 'src/app/models/paperlistmodel.model'
import { ModalEmployeeComponent } from 'src/app/component/shared-ui/modal-employee/modal-employee.component'
import { FormsModule } from '@angular/forms'

export interface LoadPage {
    page: number,
    size: 100,
    loading: boolean
}
export interface Detail {
    requestApplicant: RequestApplicantModel,
    jobcode: JobcodeModel,
    position: PositionModel,
    requisitionStatus: { id: string, tdesc: string, edesc: string }
}
export interface Profile {
    recruitApplicant: RecruitApplicantModel
    prefix: PrefixModel,
    maritalStatus: { id: string, value: string, tdesc: string, edesc: string },
    oldJobcode: JobcodeModel,
    jobcode: JobcodeModel,
    gender: { id: string, tdesc: string, edesc: string },
    nationality: NationalityModel,
    national: NationalModel,
    religion: ReligionModel,
    degree: DegreeModel[],
    militaryStatus: { id: string, tdesc: string, edesc: string },
    institue: InstitueModel[],
    faculty: FacultyModel[],
    major: MajorModel[],
    honors: { id: string, tdesc: string, edesc: string }[],
    jobZipcode: ZipcodeModel[],
    skillDegree: DegreeModel[],
    workArea: WorkAreaModel,
    familyRelation: FamilyralationModel[],
    langSkill: LangSkillModel[],
    occupation: OccupationModel[],
    familyStatus: { id: string, tdesc: string, edesc: string }[],
    branch: BranchModel,
    sourceJob: SourcejobModel,
    paperList: PaperListModel[],

}
export interface DataList {
    requestApplicant: { list: Detail[], load: LoadPage },
    recruitApplicant: { list: { data: Profile[], internal: Profile[], external: Profile[], raw: RecruitApplicantModel[] }, load: LoadPage },
    prefix: { list: PrefixModel[], load: boolean },
    maritalStatus: { id: string, value: string, tdesc: string, edesc: string }[],
    jobcode: { list: JobcodeModel[], load: boolean },
    position: { list: PositionModel[], load: boolean },
    requisitionStatus: { id: string, tdesc: string, edesc: string }[],
    employee: { list: EmployeeModel[], load: LoadPage },
    gender: { id: string, tdesc: string, edesc: string }[],
    nationality: { list: NationalityModel[], load: boolean },
    national: { list: NationalModel[], load: boolean },
    religion: { list: ReligionModel[], load: boolean },
    degree: { list: DegreeModel[], load: boolean },
    militaryStatus: { id: string, tdesc: string, edesc: string }[],
    institue: { list: InstitueModel[], load: boolean },
    faculty: { list: FacultyModel[], load: boolean },
    major: { list: MajorModel[], load: boolean },
    honors: { id: string, tdesc: string, edesc: string }[],
    zipcode: { list: ZipcodeModel[], load: boolean },
    workArea: { list: WorkAreaModel[], load: boolean },
    familyRelation: { list: FamilyralationModel[], load: boolean },
    langSkill: { list: LangSkillModel[], load: boolean },
    occupation: { list: OccupationModel[], load: boolean }
    familyStatus: { id: string, tdesc: string, edesc: string }[],
    branch: { list: BranchModel[], load: boolean },
    sourceJob: { list: SourcejobModel[], load: boolean },
    paperList: { list: PaperListModel[], load: boolean },

}
export interface DataSelected {
    requestApplicant: { id: string, detail: Detail },
    jobcode: { id: string, detail: JobcodeModel },
    employee: { id: string, detail: EmployeeModel },
    name: { name: string, surname: string },
    date: { start: NgbDate, end: NgbDate },
}
export interface ModalDetail {
    modalName: string,
    text: { cardHead: string, search: string[], tableHead: string[] },
    data: { list: any, show: any }[],
    page: { page: number, pageSize: number, collectionSize: number },
    search: string,
    load: boolean
}

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, NgbDatepickerModule, NgbNavModule, FormsModule, NgbPaginationModule],
    selector: 'app-rec-applicant',
    templateUrl: './rec-applicant.component.html',
    styleUrls: ['./rec-applicant.component.scss']
})
export class RecApplicantComponent implements OnInit {
    active = 1
    subscription: Subscription[] = []
    dataList: DataList = {
        requestApplicant: { list: [], load: { page: 0, size: 100, loading: false } },
        recruitApplicant: { list: { data: [], internal: [], external: [], raw: [] }, load: { page: 0, size: 100, loading: false } },
        prefix: { list: [], load: false },
        maritalStatus: [
            { id: '1', value: 'S', tdesc: 'โสด', edesc: 'Single' },
            { id: '2', value: 'M', tdesc: 'สมรส', edesc: 'Married' },
            { id: '3', value: 'D', tdesc: 'หย่าร้าง', edesc: 'Divorce' },
            { id: '4', value: 'W', tdesc: 'หม้าย', edesc: 'Widow' },
            { id: '5', value: 'E', tdesc: 'แยกกันอยู่', edesc: 'Separated' },
            { id: '6', value: 'N', tdesc: 'หมั้นแล้ว', edesc: 'Engaged' }],
        jobcode: { list: [], load: false },
        position: { list: [], load: false },
        requisitionStatus: [
            { id: '1', tdesc: 'รอดำเนินการ', edesc: 'Normal' },
            { id: '2', tdesc: 'อยู่ระหว่างดำเนินการ', edesc: 'In Process' },
            { id: '3', tdesc: 'ครบถ้วนแล้ว', edesc: 'Complete' },
            { id: '4', tdesc: 'ยกเลิก', edesc: 'Cancled' },
        ],
        employee: { list: [], load: { page: 0, size: 100, loading: false } },
        gender: [
            { id: '1', tdesc: 'ชาย', edesc: 'Male' },
            { id: '2', tdesc: 'หญิง', edesc: 'Female' },
            { id: '3', tdesc: 'ไม่ระบุ', edesc: 'Not Specific' }],
        nationality: { list: [], load: false },
        national: { list: [], load: false },
        religion: { list: [], load: false },
        degree: { list: [], load: false },
        militaryStatus: [
            { id: '1', tdesc: 'ผ่านการเกณฑ์ทหารแล้ว', edesc: 'Completed' },
            { id: '2', tdesc: 'ยังไม่ผ่านการเกณฑ์ทหาร', edesc: 'Incomplete' },
            { id: '3', tdesc: 'ได้รับการยกเว้น', edesc: 'Exempted' }],
        institue: { list: [], load: false },
        faculty: { list: [], load: false },
        major: { list: [], load: false },
        honors: [
            { id: '1', tdesc: 'เกียรตินิยมอันดับหนึ่งเหรียญทอง', edesc: 'First-class honors, Gold Medal' },
            { id: '2', tdesc: 'เกียรตินิยมอันดับหนึ่ง', edesc: 'First-class honors' },
            { id: '3', tdesc: 'เกียรตินิยมอันดับหนึ่ง', edesc: 'Second-class honors' }],
        zipcode: { list: [], load: false },
        workArea: { list: [], load: false },
        familyRelation: { list: [], load: false },
        langSkill: { list: [], load: false },
        occupation: { list: [], load: false },
        familyStatus: [
            { id: '1', tdesc: 'มีชีวิต', edesc: 'Alive' },
            { id: '2', tdesc: 'ถึงแก่กรรม', edesc: 'Dead' },
            { id: '3', tdesc: 'สูญหาย', edesc: 'Lost' }
        ],
        branch: { list: [], load: false },
        sourceJob: { list: [], load: false },
        paperList: { list: [], load: false },


    }
    dataSelected: DataSelected = {
        requestApplicant: {
            id: '',
            detail: {
                requestApplicant: new MyRequestApplicantModel({}, this.translateService),
                jobcode: new MyJobcodeModel({}, this.translateService),
                position: new MyPositionModel({}, this.translateService),
                requisitionStatus: { id: '', tdesc: '', edesc: '' }
            }
        },
        jobcode: { id: '', detail: new MyJobcodeModel({}, this.translateService) },
        employee: { id: '', detail: new MyEmployeeModel({}, this.translateService) },
        name: { name: '', surname: '' },
        date: { start: new NgbDate(new Date().getFullYear(), 1, 1), end: new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()) },

    }

    pageTable = [{ page: 1, pageSize: 10, collectionSize: 0 }, { page: 1, pageSize: 10, collectionSize: 0 }]
    modalDetail: ModalDetail = {
        modalName: '',
        text: {
            cardHead: '',
            search: [],
            tableHead: []
        },
        data: [],
        search: '',
        page: { page: 1, pageSize: 10, collectionSize: 0 },
        load: false
    }
    messageAlert = ''
    startDate = ''
    endDate = ''

    @ViewChild('alertModal') alertModal: undefined
    constructor(private translateService: TranslateService,
        private employeeService: EmployeeService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngbModal: NgbModal,
        private ngbDateParserFormatter: NgbDateParserFormatter) {
        this.loadData()
        // console.log(this.dataSelected.date);
    }


    recruitApplicantToProfile(recruitApplicant: RecruitApplicantModel[]): Profile[] {
        return recruitApplicant.map(x => {
            return {
                recruitApplicant: x,
                prefix: this.matchData('prefix', x.personal.prefixid),
                maritalStatus: this.matchData('maritalStatus', x.personal.status),
                oldJobcode: this.matchData('jobcode', x.oldJobId),
                jobcode: this.matchData('jobcode', x.jobId),
                gender: this.matchData('gender', x.personal.genderid),
                nationality: this.matchData('nationality', x.personal.raceid),
                national: this.matchData('national', x.personal.nationalityid),
                religion: this.matchData('religion', x.personal.religionid),
                degree: x.education.map(x => { return this.matchData('degree', x.degreetype) }),
                militaryStatus: this.matchData('militaryStatus', x.personal.military.status),
                institue: x.education.map(x => { return this.matchData('institue', x.university.universitylist.instituteid) }),
                faculty: x.education.map(x => { return this.matchData('faculty', x.fac.facultylist.mfacultyid) }),
                major: x.education.map(x => { return this.matchData('major', x.major.majorlist.majorid) }),
                honors: x.education.map(x => { return this.matchData('honors', x.honors.id) }),
                jobZipcode: x.jobExp.job.map(x => { return this.matchData('zipcode', x.zipcode.zipid) }),
                skillDegree: x.skill.activity.map(x => { return this.matchData('degree', x.degreetype) }),
                workArea: this.matchData('workArea', x.other.workarea),
                familyRelation: x.family.family.map(x => { return this.matchData('relation', x.relation) }),
                langSkill: x.skill.langskill.map(x => { return this.matchData('langskill', x.langskilllist.id) }),
                occupation: x.family.family.map(x => { return this.matchData('occupation', x.occupation) }),
                familyStatus: x.family.family.map(x => { return this.matchData('familyStatus', x.status) }),
                branch: this.matchData('branch', x.other.workarea),
                sourceJob: this.matchData('sourceJob', x.other.sourcejob),
                paperList: x.other.files.map(x => { return this.matchData('papertype', x.paperType) }),


            }
        })
    }

    matchData(name: string, id: string): any {
        if (name == 'prefix') {
            if (id) {
                return this.dataList.prefix.list.filter(x => x.prefixId == id).length > 0 ?
                    this.dataList.prefix.list.filter(x => x.prefixId == id)[0] :
                    new MyPrefixModel({}, this.translateService)
            } else {
                return new MyPrefixModel({}, this.translateService)
            }
        }
        if (name == 'maritalStatus') {
            if (id) {
                return this.dataList.maritalStatus.filter(x => x.value == id).length > 0 ?
                    this.dataList.maritalStatus.filter(x => x.value == id)[0] :
                    { id: '', value: '', tdesc: '', edesc: '' }
            } else {
                return { id: '', value: '', tdesc: '', edesc: '' }
            }
        }
        if (name == 'jobcode') {
            if (id) {
                return this.dataList.jobcode.list.filter(x => x.jobcodeId == id).length > 0 ?
                    this.dataList.jobcode.list.filter(x => x.jobcodeId == id)[0] :
                    new MyJobcodeModel({}, this.translateService)
            } else {
                return new MyJobcodeModel({}, this.translateService)
            }
        }
        if (name == 'position') {
            if (id) {
                return this.dataList.position.list.filter(x => x.positionId == id).length > 0 ?
                    this.dataList.position.list.filter(x => x.positionId == id)[0] :
                    new MyPositionModel({}, this.translateService)
            } else {
                return new MyPositionModel({}, this.translateService)
            }
        }
        if (name == 'requisitionStatus') {
            if (id) {
                return this.dataList.requisitionStatus.filter(x => x.id == id).length > 0 ?
                    this.dataList.requisitionStatus.filter(x => x.id == id)[0] :
                    { id: '', value: '', tdesc: '', edesc: '' }
            } else {
                return { id: '', value: '', tdesc: '', edesc: '' }
            }
        }
        if (name == 'gender') {
            if (id) {
                return this.dataList.gender.filter(x => x.id == id).length > 0 ?
                    this.dataList.gender.filter(x => x.id == id)[0] :
                    { id: '', tdesc: '', edesc: '' }
            } else {
                return { id: '', tdesc: '', edesc: '' }
            }
        }
        if (name == 'nationality') {
            if (id) {
                return this.dataList.nationality.list.filter(x => x.nationalityId == id).length > 0 ?
                    this.dataList.nationality.list.filter(x => x.nationalityId == id)[0] :
                    new MyNationalityModel({}, this.translateService)
            } else {
                return new MyNationalityModel({}, this.translateService)
            }
        }
        if (name == 'national') {
            if (id) {
                return this.dataList.national.list.filter(x => x.nationalId == id).length > 0 ?
                    this.dataList.national.list.filter(x => x.nationalId == id)[0] :
                    new MyNationalModel({}, this.translateService)
            } else {
                return new MyNationalModel({}, this.translateService)
            }
        }
        if (name == 'religion') {
            if (id) {
                return this.dataList.religion.list.filter(x => x.religionId == id).length > 0 ?
                    this.dataList.religion.list.filter(x => x.religionId == id)[0] :
                    new MyReligionModel({}, this.translateService)
            } else {
                return new MyReligionModel({}, this.translateService)
            }
        }
        if (name == 'degree') {
            if (id) {
                return this.dataList.degree.list.filter(x => x.degreeId == id).length > 0 ?
                    this.dataList.degree.list.filter(x => x.degreeId == id)[0] :
                    new MyDegreeModel({}, this.translateService)
            } else {
                return new MyDegreeModel({}, this.translateService)
            }
        }
        if (name == 'militaryStatus') {
            if (id) {
                return this.dataList.militaryStatus.filter(x => x.id == id).length > 0 ?
                    this.dataList.militaryStatus.filter(x => x.id == id)[0] :
                    { id: '', tdesc: '', edesc: '' }
            } else {
                return { id: '', tdesc: '', edesc: '' }
            }
        }
        if (name == 'institue') {
            if (id) {
                return this.dataList.institue.list.filter(x => x.institueId == id).length > 0 ?
                    this.dataList.institue.list.filter(x => x.institueId == id)[0] :
                    new MyInstitueModel({}, this.translateService)
            } else {
                return new MyInstitueModel({}, this.translateService)
            }
        }
        if (name == 'faculty') {
            if (id) {
                return this.dataList.faculty.list.filter(x => x.facultyId == id).length > 0 ?
                    this.dataList.faculty.list.filter(x => x.facultyId == id)[0] :
                    new MyFacultyModel({}, this.translateService)
            } else {
                return new MyFacultyModel({}, this.translateService)
            }
        }
        if (name == 'major') {
            if (id) {
                return this.dataList.major.list.filter(x => x.majorId == id).length > 0 ?
                    this.dataList.major.list.filter(x => x.majorId == id)[0] :
                    new MyFacultyModel({}, this.translateService)
            } else {
                return new MyFacultyModel({}, this.translateService)
            }
        }
        if (name == 'honors') {
            if (id) {
                return this.dataList.honors.filter(x => x.id == id).length > 0 ?
                    this.dataList.honors.filter(x => x.id == id)[0] :
                    { id: '', tdesc: '', edesc: '' }
            } else {
                return { id: '', tdesc: '', edesc: '' }
            }
        }
        if (name == 'zipcode') {
            if (id) {
                return this.dataList.zipcode.list.filter(x => x.zipcodeId == id).length > 0 ?
                    this.dataList.zipcode.list.filter(x => x.zipcodeId == id)[0] :
                    new MyZipcodeModel({}, this.translateService)
            } else {
                return new MyZipcodeModel({}, this.translateService)
            }
        }
        if (name == 'workArea') {
            if (id) {
                return this.dataList.workArea.list.filter(x => x.workareaId == id).length > 0 ?
                    this.dataList.workArea.list.filter(x => x.workareaId == id)[0] :
                    new WorkAreaModel({}, this.translateService)
            } else {
                return new WorkAreaModel({}, this.translateService)
            }
        }
        if (name == 'relation') {
            if (id) {
                return this.dataList.familyRelation.list.filter(x => x.relationId == id).length > 0 ?
                    this.dataList.familyRelation.list.filter(x => x.relationId == id)[0] :
                    new MyFamilyralationModel({}, this.translateService)
            } else {
                return new MyFamilyralationModel({}, this.translateService)
            }
        }
        if (name == 'langskill') {
            if (id) {
                return this.dataList.langSkill.list.filter(x => x.languageId == id).length > 0 ?
                    this.dataList.langSkill.list.filter(x => x.languageId == id)[0] :
                    new MyFamilyralationModel({}, this.translateService)
            } else {
                return new MyFamilyralationModel({}, this.translateService)
            }
        }
        if (name == 'occupation') {
            if (id) {
                return this.dataList.occupation.list.filter(x => x.occId == id).length > 0 ?
                    this.dataList.occupation.list.filter(x => x.occId == id)[0] :
                    new MyFamilyralationModel({}, this.translateService)
            } else {
                return new MyFamilyralationModel({}, this.translateService)
            }
        }
        if (name == 'familyStatus') {
            if (id) {
                return this.dataList.familyStatus.filter(x => x.id == id).length > 0 ?
                    this.dataList.familyStatus.filter(x => x.id == id)[0] :
                    { id: '', tdesc: '', edesc: '' }
            } else {
                return { id: '', tdesc: '', edesc: '' }
            }
        }
        if (name == 'branch') {
            if (id) {
                return this.dataList.branch.list.filter(x => x.branchId == id).length > 0 ?
                    this.dataList.branch.list.filter(x => x.branchId == id)[0] :
                    new WorkAreaModel({}, this.translateService)
            } else {
                return new WorkAreaModel({}, this.translateService)
            }
        }
        if (name == 'sourceJob') {
            if (id) {
                return this.dataList.sourceJob.list.filter(x => x.sourceJobId == id).length > 0 ?
                    this.dataList.sourceJob.list.filter(x => x.sourceJobId == id)[0] :
                    new WorkAreaModel({}, this.translateService)
            } else {
                return new WorkAreaModel({}, this.translateService)
            }
        }
        if (name == 'papertype') {
            if (id) {
                return this.dataList.paperList.list.filter(x => x.paperId == id).length > 0 ?
                    this.dataList.paperList.list.filter(x => x.paperId == id)[0] :
                    new MyPaperListModel({}, this.translateService)
            } else {
                return new MyPaperListModel({}, this.translateService)
            }
        }

    }

    loadingData(status: boolean) {
        this.dataList.prefix.load = status
        this.dataList.jobcode.load = status
        this.dataList.position.load = status
        this.dataList.nationality.load = status
        this.dataList.national.load = status
        this.dataList.religion.load = status
        this.dataList.degree.load = status
        this.dataList.institue.load = status
        this.dataList.faculty.load = status
        this.dataList.major.load = status
        this.dataList.zipcode.load = status
        this.dataList.workArea.load = status
        this.dataList.familyRelation.load = status
        this.dataList.langSkill.load = status
        this.dataList.occupation.load = status
        this.dataList.branch.load = status
        this.dataList.sourceJob.load = status
        this.dataList.paperList.load = status
    }

    loadData() {
        this.dataList.recruitApplicant.load.loading = this.dataList.recruitApplicant.load.page == 0 ? true : false
        this.dataList.requestApplicant.load.loading = this.dataList.requestApplicant.load.page == 0 ? true : false
        this.dataList.employee.load.loading = this.dataList.employee.load.page == 0 ? true : false
        this.loadingData(true)
        this.employeeWorkingsPage()
        let data1 = this.employeeService.prefixLists()
        let data2 = this.employeeService.jobcodeLists()
        let data3 = this.employeeService.positionLists()
        let data4 = this.employeeService.nationalityLists()
        let data5 = this.employeeService.nationalLists()
        let data6 = this.employeeService.religionLists()
        let data7 = this.employeeService.degreeLists()
        let data8 = this.employeeService.institueLists()
        let data9 = this.employeeService.facultyLists()
        let data10 = this.employeeService.majorLists()
        let data11 = this.employeeService.zipcodeLists()
        let data12 = this.employeeService.workAreaLists()
        let data13 = this.employeeService.familyRelationList()
        let data14 = this.employeeService.langSkillList()
        let data15 = this.employeeService.occupationList()
        let data16 = this.employeeService.branchList()
        let data17 = this.employeeService.sourcejobList()
        let data18 = this.employeeService.paperTypeList()


        Promise.all([data1, data2, data3, data4, data5, data6, data7, data8, data9, data10]).then(result => {
            this.dataList.prefix.list = result[0].map(x => new MyPrefixModel(x, this.translateService))
            this.dataList.jobcode.list = result[1].map(x => new MyJobcodeModel(x, this.translateService)).sort((a, b) => { if (parseInt(a.jobcodeId)) { return parseInt(a.jobcodeId) > parseInt(b.jobcodeId) ? 1 : -1 } else { return a.jobcodeId > b.jobcodeId ? 1 : -1 } })
            this.dataList.position.list = result[2].map(x => new MyPositionModel(x, this.translateService))
            this.dataList.nationality.list = result[3].map(x => new MyNationalityModel(x, this.translateService))
            this.dataList.national.list = result[4].map(x => new MyNationalModel(x, this.translateService))
            this.dataList.religion.list = result[5].map(x => new MyReligionModel(x, this.translateService))
            this.dataList.degree.list = result[6].map(x => new MyDegreeModel(x, this.translateService))
            this.dataList.institue.list = result[7].map(x => new MyInstitueModel(x, this.translateService))
            this.dataList.faculty.list = result[8].map(x => new MyFacultyModel(x, this.translateService))
            this.dataList.major.list = result[9].map(x => new MyMajorModel(x, this.translateService))
            this.changeDetectorRef.markForCheck()
        }).catch(error => {
            this.loadingData(false)
            this.messageAlert = this.messageAlert + error.messageAlert + '<br>'
            this.messageAlert = this.messageAlert.slice(4)
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
            return error
        }).then(error => {
            if (!error) {
                Promise.all([data11, data12, data13, data14, data15, data16, data17, data18]).then(result => {
                    this.dataList.zipcode.list = result[0].map(x => new MyZipcodeModel(x, this.translateService))
                    this.dataList.workArea.list = result[1].map(x => new WorkAreaModel(x, this.translateService))
                    this.dataList.familyRelation.list = result[2].map(x => new MyFamilyralationModel(x, this.translateService))
                    this.dataList.langSkill.list = result[3].map(x => new MyLangSkillModel(x, this.translateService))
                    this.dataList.occupation.list = result[4].map(x => new MyOccupationModel(x, this.translateService))
                    this.dataList.branch.list = result[5].map(x => new MyBranchModel(x, this.translateService))
                    this.dataList.sourceJob.list = result[6].map(x => new MySourcejobModel(x, this.translateService))
                    this.dataList.paperList.list = result[7].map(x => new MyPaperListModel(x, this.translateService))
                    this.loadingData(false)
                    this.changeDetectorRef.markForCheck()
                }).catch(error => {
                    this.loadingData(false)
                    this.messageAlert = this.messageAlert + error.messageAlert + '<br>'
                    this.messageAlert = this.messageAlert.slice(4)
                    this.ngbModal.open(this.alertModal, {
                        centered: true,
                        backdrop: 'static'
                    })
                    return error
                }).then(error => {
                    if (!error) {
                        this.recruitApplicantPage()
                        this.requestApplicantPage()
                        // console.log(this.dataList);
                    }
                })
            }
        })
    }

    openModal(modal: string, name: string, item?: Profile) {
        if (name == 'employee') {
            this.modalDetail = {
                modalName: name,
                text: {
                    cardHead: 'menu.employee-list',
                    search: ['Name-Surname (Thai)', 'Name-Surname (Eng.)'],
                    tableHead: ['No.', 'Employee ID', 'Name-Surname', 'Position', 'Bu1', 'Bu2', 'Bu3', 'Bu4', 'Bu5']
                },
                data: this.dataList.employee.list.map((x, i) => {
                    return {
                        list: x,
                        show: [
                            i + 1,
                            x.employeeId ? x.employeeId : '-',
                            x.getFullName() ? x.getFullName() : '-',
                            x.position.getDesc() ? x.position.getDesc() : '-',
                            x.bu1.getDesc() ? x.bu1.getDesc() : '-',
                            x.bu2.getDesc() ? x.bu2.getDesc() : '-',
                            x.bu3.getDesc() ? x.bu3.getDesc() : '-',
                            x.bu4.getDesc() ? x.bu4.getDesc() : '-',
                            x.bu5.getDesc() ? x.bu5.getDesc() : '-']
                    }
                }),
                search: '',
                page: { page: 1, pageSize: 10, collectionSize: this.dataList.employee.list.length },
                load: this.dataList.employee.load.loading
            }
            const modalRef = this.ngbModal.open(modal, { centered: true, windowClass: 'dialog-width', size: 'lg' })

            modalRef.result.then((result) => {
                console.log("ค่าที่เลือกจาก modal:", result);   // log ตรงนี้ต้องขึ้น
                this.selectData(name, result);                   // เรียก selectData
            }).catch((reason) => {
                console.log("Modal ปิด:", reason);
            });
        }
        if (name == 'requestApplicant') {
            this.modalDetail = {
                modalName: name,
                text: {
                    cardHead: 'Table of MREQUEST Detail',
                    search: ['Requisition ID'],
                    tableHead: ['Requisition ID', 'Job Title Req', 'Position Req', 'Number of Employee', 'Type', 'First date of request', 'Last date of request', 'Requisition Status']
                },
                data: this.dataList.requestApplicant.list.map(x => {
                    return {
                        list: x,
                        show: [x.requestApplicant.requestId,
                        x.jobcode.getDesc() ? x.jobcode.getDesc() : '-',
                        x.position.getDesc() ? x.position.getDesc() : '-',
                        x.requestApplicant.numberOfEmployee,
                        x.requestApplicant.employmentType,
                        x.requestApplicant.approveDate.split('-').reverse().join('-'),
                        x.requestApplicant.lastDate.split('-').reverse().join('-'),
                        this.getDesc(x.requisitionStatus.tdesc, x.requisitionStatus.edesc)]
                    }
                }),
                search: '',
                page: { page: 1, pageSize: 10, collectionSize: this.dataList.requestApplicant.list.length },
                load: this.dataList.requestApplicant.load.loading
            }
            const modalRef = this.ngbModal.open(modal, { centered: true, windowClass: 'dialog-width', size: 'lg' });

            modalRef.result.then((result) => {
                console.log("ค่าที่เลือกจาก modal:", result);   // log ตรงนี้ต้องขึ้น
                this.selectData(name, result);                   // เรียก selectData
            }).catch((reason) => {
                console.log("Modal ปิด:", reason);
            });


        }
        if (name == 'jobcode') {
            this.modalDetail = {
                modalName: name,
                text: {
                    cardHead: 'Master Job Code',
                    search: ['Job Code ID'],
                    tableHead: ['Job Code ID', 'Job Title Name (Thai)', 'Job Title Name (Eng.)', 'Sub Section #2 Desc.', 'Sub Section #1 Desc.', 'Section Desc.', 'Department Desc.', 'Division Desc.']
                },
                data: this.dataList.jobcode.list.map(x => {
                    return {
                        list: x,
                        show: [x.jobcodeId,
                        x.tdesc ? x.tdesc : '-',
                        x.edesc ? x.edesc : '-',
                        x.bu5.getDesc() ? x.bu5.getDesc() : '-',
                        x.bu4.getDesc() ? x.bu4.getDesc() : '-',
                        x.bu3.getDesc() ? x.bu3.getDesc() : '-',
                        x.bu1.getDesc() ? x.bu1.getDesc() : '-',
                        x.bu2.getDesc() ? x.bu2.getDesc() : '-']
                    }
                }),
                search: '',
                page: { page: 1, pageSize: 10, collectionSize: this.dataList.jobcode.list.length },
                load: this.dataList.jobcode.load
            }
            const modalRef = this.ngbModal.open(modal, { centered: true, windowClass: 'dialog-width', size: 'lg' })

            modalRef.result.then((result) => {
                console.log("ค่าที่เลือกจาก modal:", result);   // log ตรงนี้ต้องขึ้น
                this.selectData(name, result);                   // เรียก selectData
            }).catch((reason) => {
                console.log("Modal ปิด:", reason);
            });
        }
        if (name == 'employeeDetail' && item) {
            this.ngbModal.open(ModalEmployeeComponent, { windowClass: 'dialog-width', size: 'lg' }).componentInstance.data = { profile: item }
        }
    }

    selectData(name: string, item?: any, index?: number) {
        const data = item?.list ? item.list : item; // 👈 normalize ถ้ามี list

        if (data) {
            if (name == 'requestApplicant') {
                // 👇 log ตรวจสอบ
                console.log("ค่า requestApplicant จาก modal:", data.requestApplicant?.requestId);

                this.dataSelected.requestApplicant.id = data.requestApplicant.requestId;
                this.dataSelected.requestApplicant.detail = data;

                // 👇 log ว่า id ถูกเซ็ตหรือยัง
                console.log("ค่า dataSelected.requestApplicant.id:", this.dataSelected.requestApplicant.id);
            }

            if (name == 'jobcode') {
                this.dataSelected.jobcode.id = data.jobcodeId;
                this.dataSelected.jobcode.detail = data;
            }

            if (name == 'employee') {
                this.dataSelected.employee.id = data.employeeId;
                this.dataSelected.employee.detail = data;
                this.dataSelected.name.name = data.fname || data.efname || '';
                this.dataSelected.name.surname = data.lname || data.elname || '';
            }
        } else {
            console.log('ไม่มี item ส่งเข้ามา (พิมพ์เองใน input)');

            if (name == 'requestApplicant') {
                this.dataSelected.requestApplicant.detail =
                    this.dataList.requestApplicant.list.find(
                        x => x.requestApplicant.requestId == this.dataSelected.requestApplicant.id
                    ) || {
                        requestApplicant: new MyRequestApplicantModel({}, this.translateService),
                        jobcode: new MyJobcodeModel({}, this.translateService),
                        position: new MyPositionModel({}, this.translateService),
                        requisitionStatus: { id: '', tdesc: '', edesc: '' },
                    };
            }

            if (name == 'jobcode') {
                this.dataSelected.jobcode.detail =
                    this.dataList.jobcode.list.find(
                        x => x.jobcodeId == this.dataSelected.jobcode.id
                    ) || new MyJobcodeModel({}, this.translateService);
            }

            if (name == 'employee') {
                this.dataSelected.employee.detail =
                    this.dataList.employee.list.find(
                        x => x.employeeId == this.dataSelected.employee.id
                    ) || new MyEmployeeModel({}, this.translateService);
            }
        }

        this.filterJobApplicants();
    }



    checkLoadingModal(name: string): boolean {
        if (name == 'requestApplicant') {
            return this.modalDetail.load = this.dataList.requestApplicant.load.loading
        }
        if (name == 'jobcode') {
            return this.modalDetail.load = this.dataList.jobcode.load
        }
        if (name == 'employee') {
            return this.modalDetail.load = this.dataList.employee.load.loading
        }
        return true
    }

    searchDataModal(name: string) {
        if (name == 'requestApplicant') {
            this.modalDetail.data = this.dataList.requestApplicant.list.filter(x => (x.requestApplicant.requestId.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
                return {
                    list: x,
                    show: [x.requestApplicant.requestId,
                    x.jobcode.getDesc() ? x.jobcode.getDesc() : '-',
                    x.position.getDesc() ? x.position.getDesc() : '-',
                    x.requestApplicant.numberOfEmployee,
                    x.requestApplicant.employmentType,
                    x.requestApplicant.approveDate.split('-').reverse().join('-'),
                    x.requestApplicant.lastDate.split('-').reverse().join('-'),
                    this.getDesc(x.requisitionStatus.tdesc, x.requisitionStatus.edesc)]
                }
            })
        }
        if (name == 'jobcode') {
            this.modalDetail.data = this.dataList.jobcode.list.filter(x => (x.jobcodeId.toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map(x => {
                return {
                    list: x,
                    show: [x.jobcodeId,
                    x.tdesc ? x.tdesc : '-',
                    x.edesc ? x.edesc : '-',
                    x.bu5.getDesc() ? x.bu5.getDesc() : '-',
                    x.bu4.getDesc() ? x.bu4.getDesc() : '-',
                    x.bu3.getDesc() ? x.bu3.getDesc() : '-',
                    x.bu1.getDesc() ? x.bu1.getDesc() : '-',
                    x.bu2.getDesc() ? x.bu2.getDesc() : '-']
                }
            })
        }
        if (name == 'employee') {
            this.modalDetail.data = this.dataList.employee.list.filter(x => (x.getFullNameTh().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1) || (x.getFullNameEn().toLowerCase().indexOf(this.modalDetail.search.toLowerCase()) !== -1)).map((x, i) => {
                return {
                    list: x,
                    show: [
                        i + 1,
                        x.employeeId,
                        x.getFullName() ? x.getFullName() : '-',
                        x.position.getDesc() ? x.position.getDesc() : '-',
                        x.bu1.getDesc() ? x.bu1.getDesc() : '-',
                        x.bu2.getDesc() ? x.bu2.getDesc() : '-',
                        x.bu3.getDesc() ? x.bu3.getDesc() : '-',
                        x.bu4.getDesc() ? x.bu4.getDesc() : '-',
                        x.bu5.getDesc() ? x.bu5.getDesc() : '-']
                }
            })
        }
        this.modalDetail.page.page = 1
        this.modalDetail.page.collectionSize = this.modalDetail.data.length
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this.subscription.map(x => x.unsubscribe())
    }

    recruitApplicantPage() {
        this.subscription[0] = this.employeeService.recruitApplicantPage(this.dataList.recruitApplicant.load.page.toString(), this.dataList.recruitApplicant.load.size.toString(), this.ngbDateParserFormatter.format(this.dataSelected.date.start).replace(/\//gi, '-').split('-').reverse().join('-'), this.ngbDateParserFormatter.format(this.dataSelected.date.end).replace(/\//gi, '-').split('-').reverse().join('-')).subscribe(result => {
            this.dataList.recruitApplicant.list.raw = this.dataList.recruitApplicant.list.raw.concat(result.content)
            this.dataList.recruitApplicant.list.data = this.dataList.recruitApplicant.list.data.concat(this.recruitApplicantToProfile(new MyRecruitApplicantPageModel(result, this.translateService).content))
            this.dataList.recruitApplicant.list.internal = this.dataList.recruitApplicant.list.data.filter(x => x.recruitApplicant.internal != '0')
            this.dataList.recruitApplicant.list.external = this.dataList.recruitApplicant.list.data.filter(x => x.recruitApplicant.internal == '0')
            this.pageTable[0].collectionSize = this.dataList.recruitApplicant.list.internal.length
            this.pageTable[1].collectionSize = this.dataList.recruitApplicant.list.external.length
            if (result.last) {
                this.dataList.recruitApplicant.list.data.sort((a, b) => parseInt(a.recruitApplicant.requestId.replace('-', '')) > parseInt(b.recruitApplicant.requestId.replace('-', '')) ? -1 : 1)
                this.dataList.recruitApplicant.list.internal.sort((a, b) => parseInt(a.recruitApplicant.requestId.replace('-', '')) > parseInt(b.recruitApplicant.requestId.replace('-', '')) ? -1 : 1)
                this.dataList.recruitApplicant.list.external.sort((a, b) => parseInt(a.recruitApplicant.requestId.replace('-', '')) > parseInt(b.recruitApplicant.requestId.replace('-', '')) ? -1 : 1)
                this.dataList.recruitApplicant.load = { loading: false, page: 0, size: 100 }
                this.pageTable[0] = { page: 1, pageSize: 10, collectionSize: this.dataList.recruitApplicant.list.internal.length }
                this.pageTable[1] = { page: 1, pageSize: 10, collectionSize: this.dataList.recruitApplicant.list.external.length }
                //console.log(this.dataList)
            } else {
                this.dataList.recruitApplicant.load.page++
                this.dataList.recruitApplicant.load.loading = false
                this.changeDetectorRef.markForCheck()
                this.recruitApplicantPage()
            }
            this.changeDetectorRef.markForCheck()
        }, error => {
            this.dataList.recruitApplicant.load.loading = false
            this.messageAlert = error.message
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
        })
    }

    requestApplicantPage() {
        this.subscription[1] = this.employeeService.requestApplicantPage(this.dataList.requestApplicant.load.page.toString(), this.dataList.requestApplicant.load.size.toString()).subscribe(result => {
            this.dataList.requestApplicant.list = this.dataList.requestApplicant.list.concat(new MyRequestApplicantPageModel(result, this.translateService).content.map(x => {
                return {
                    requestApplicant: x,
                    jobcode: this.matchData('jobcode', x.jobId),
                    position: this.matchData('position', x.positionId),
                    requisitionStatus: this.matchData('requisitionStatus', x.requisitionStatus)
                }
            }))
            if (result.last) {
                this.dataList.requestApplicant.list.sort((a, b) => parseInt(a.requestApplicant.requestId.replace('-', '')) > parseInt(b.requestApplicant.requestId.replace('-', '')) ? -1 : 1)
                this.dataList.requestApplicant.load = { loading: false, page: 0, size: 100 }
            } else {
                this.dataList.requestApplicant.load.page++
                this.dataList.requestApplicant.load.loading = false
                this.changeDetectorRef.markForCheck()
                this.requestApplicantPage()
            }
            this.changeDetectorRef.markForCheck()
        }, error => {
            this.dataList.requestApplicant.load.loading = false
            this.messageAlert = error.message
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
        })
    }

    employeeWorkingsPage() {
        this.subscription[2] = this.employeeService.employeeWorkingsPage(this.dataList.employee.load.page.toString(), this.dataList.employee.load.size.toString()).subscribe(result => {
            this.dataList.employee.list = this.dataList.employee.list.concat(new MyEmployeePageModel(result, this.translateService).content)
            if (result.last) {
                this.dataList.employee.list.sort((a, b) => {
                    if (parseInt(a.employeeId)) {
                        return parseInt(a.employeeId) > parseInt(b.employeeId) ? 1 : -1
                    } else {
                        return a.employeeId > b.employeeId ? 1 : -1
                    }
                })
                this.dataList.employee.load = { loading: false, page: 0, size: 100 }
            } else {
                this.dataList.employee.load.page++
                this.dataList.employee.load.loading = false
                this.changeDetectorRef.markForCheck()
                this.employeeWorkingsPage()
            }
            this.changeDetectorRef.markForCheck()
        }, error => {
            this.dataList.employee.load.loading = false
            this.messageAlert = error.message
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
        })
    }

    getDesc(tdesc: string, edesc: string): string {
        return this.translateService.currentLang == 'th' ? tdesc : edesc
    }

    filterJobApplicants() {
        this.dataList.recruitApplicant.list.internal = this.dataList.recruitApplicant.list.data.filter(x => x.recruitApplicant.internal != '0')
            .filter(x => this.dataSelected.requestApplicant.id == '-' ? x.recruitApplicant.requestId == '' : x.recruitApplicant.requestId.indexOf(this.dataSelected.requestApplicant.id) != -1)
            .filter(x => x.jobcode.jobcodeId.indexOf(this.dataSelected.jobcode.id) != -1)
            .filter(x => x.recruitApplicant.employeeId.indexOf(this.dataSelected.employee.id) != -1)
            .filter(x => ((x.prefix.tdesc + x.recruitApplicant.personal.fname.tha).toLowerCase().indexOf(this.dataSelected.name.name.toLowerCase()) != -1 || (x.prefix.edesc + x.recruitApplicant.personal.fname.eng).toLowerCase().indexOf(this.dataSelected.name.name.toLowerCase()) != -1))
            .filter(x => (x.recruitApplicant.personal.lname.tha.toLowerCase().indexOf(this.dataSelected.name.surname.toLowerCase()) != -1 || x.recruitApplicant.personal.lname.eng.toLowerCase().indexOf(this.dataSelected.name.surname.toLowerCase()) != -1))
        //.filter(x => new Date(x.recruitApplicant.applicantDate) >=  new Date(this.startDate) && new Date(x.recruitApplicant.applicantDate) <= new Date(this.endDate))
        this.dataList.recruitApplicant.list.external = this.dataList.recruitApplicant.list.data.filter(x => x.recruitApplicant.internal == '0')
            .filter(x => this.dataSelected.requestApplicant.id == '-' ? x.recruitApplicant.requestId == '' : x.recruitApplicant.requestId.indexOf(this.dataSelected.requestApplicant.id) != -1)
            .filter(x => x.jobcode.jobcodeId.indexOf(this.dataSelected.jobcode.id) != -1)
            .filter(x => x.recruitApplicant.employeeId.indexOf(this.dataSelected.employee.id) != -1)
            .filter(x => ((x.prefix.tdesc + x.recruitApplicant.personal.fname.tha).toLowerCase().indexOf(this.dataSelected.name.name.toLowerCase()) != -1 || (x.prefix.edesc + x.recruitApplicant.personal.fname.eng).toLowerCase().indexOf(this.dataSelected.name.name.toLowerCase()) != -1))
            .filter(x => (x.recruitApplicant.personal.lname.tha.toLowerCase().indexOf(this.dataSelected.name.surname.toLowerCase()) != -1 || x.recruitApplicant.personal.lname.eng.toLowerCase().indexOf(this.dataSelected.name.surname.toLowerCase()) != -1))
        //.filter(x => new Date(x.recruitApplicant.applicantDate) >=  new Date(this.startDate) && new Date(x.recruitApplicant.applicantDate) <= new Date(this.endDate))
        this.pageTable[0].page = 1
        this.pageTable[0].collectionSize = this.dataList.recruitApplicant.list.internal.length
        this.pageTable[1].page = 1
        this.pageTable[1].collectionSize = this.dataList.recruitApplicant.list.external.length
        console.log(this.dataList.recruitApplicant.list.external)
    }
    filterJobApplicantsDate() {
        this.dataList.recruitApplicant.list.internal = this.dataList.recruitApplicant.list.data.filter(x => x.recruitApplicant.internal != '0')
            .filter(x => this.dataSelected.requestApplicant.id == '-' ? x.recruitApplicant.requestId == '' : x.recruitApplicant.requestId.indexOf(this.dataSelected.requestApplicant.id) != -1)
            .filter(x => x.jobcode.jobcodeId.indexOf(this.dataSelected.jobcode.id) != -1)
            .filter(x => x.recruitApplicant.employeeId.indexOf(this.dataSelected.employee.id) != -1)
            .filter(x => ((x.prefix.tdesc + x.recruitApplicant.personal.fname.tha).toLowerCase().indexOf(this.dataSelected.name.name.toLowerCase()) != -1 || (x.prefix.edesc + x.recruitApplicant.personal.fname.eng).toLowerCase().indexOf(this.dataSelected.name.name.toLowerCase()) != -1))
            .filter(x => (x.recruitApplicant.personal.lname.tha.toLowerCase().indexOf(this.dataSelected.name.surname.toLowerCase()) != -1 || x.recruitApplicant.personal.lname.eng.toLowerCase().indexOf(this.dataSelected.name.surname.toLowerCase()) != -1))
            .filter(x => new Date(x.recruitApplicant.applicantDate) >= new Date(this.startDate) && new Date(x.recruitApplicant.applicantDate) <= new Date(this.endDate))
        this.dataList.recruitApplicant.list.external = this.dataList.recruitApplicant.list.data.filter(x => x.recruitApplicant.internal == '0')
            .filter(x => this.dataSelected.requestApplicant.id == '-' ? x.recruitApplicant.requestId == '' : x.recruitApplicant.requestId.indexOf(this.dataSelected.requestApplicant.id) != -1)
            .filter(x => x.jobcode.jobcodeId.indexOf(this.dataSelected.jobcode.id) != -1)
            .filter(x => x.recruitApplicant.employeeId.indexOf(this.dataSelected.employee.id) != -1)
            .filter(x => ((x.prefix.tdesc + x.recruitApplicant.personal.fname.tha).toLowerCase().indexOf(this.dataSelected.name.name.toLowerCase()) != -1 || (x.prefix.edesc + x.recruitApplicant.personal.fname.eng).toLowerCase().indexOf(this.dataSelected.name.name.toLowerCase()) != -1))
            .filter(x => (x.recruitApplicant.personal.lname.tha.toLowerCase().indexOf(this.dataSelected.name.surname.toLowerCase()) != -1 || x.recruitApplicant.personal.lname.eng.toLowerCase().indexOf(this.dataSelected.name.surname.toLowerCase()) != -1))
            .filter(x => new Date(x.recruitApplicant.applicantDate) >= new Date(this.startDate) && new Date(x.recruitApplicant.applicantDate) <= new Date(this.endDate))
        this.pageTable[0].page = 1
        this.pageTable[0].collectionSize = this.dataList.recruitApplicant.list.internal.length
        this.pageTable[1].page = 1
        this.pageTable[1].collectionSize = this.dataList.recruitApplicant.list.external.length
    }

    clearFilter() {
        this.dataSelected = {
            requestApplicant: {
                id: '',
                detail: {
                    requestApplicant: new MyRequestApplicantModel({}, this.translateService),
                    jobcode: new MyJobcodeModel({}, this.translateService),
                    position: new MyPositionModel({}, this.translateService),
                    requisitionStatus: { id: '', tdesc: '', edesc: '' }
                }
            },
            jobcode: { id: '', detail: new MyJobcodeModel({}, this.translateService) },
            employee: { id: '', detail: new MyEmployeeModel({}, this.translateService) },
            name: { name: '', surname: '' },
            date: { start: new NgbDate(new Date().getFullYear(), 1, 1), end: new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, endOfMonth(new Date()).getDate()) }
        }
        this.filterJobApplicants()
    }
    checkDateFormat(date: NgbDate): boolean {
        let parseDate = this.ngbDateParserFormatter.format(date)
        let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
        if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
            return true
        }
        return false
    }
    searchdate() {
        if (this.dataList.recruitApplicant.list.external.length > 0 || this.dataList.recruitApplicant.list.internal.length > 0) {
            if (!this.checkDateFormat(this.dataSelected.date.start) && !this.checkDateFormat(this.dataSelected.date.end)) {
                this.dataSelected.date.start = new NgbDate(new Date().getFullYear(), 1, 1)
                this.dataSelected.date.end = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
            }
            if (!this.checkDateFormat(this.dataSelected.date.start) && this.checkDateFormat(this.dataSelected.date.end)) {
                this.dataSelected.date.start = new NgbDate(new Date().getFullYear(), 1, 1)
            }
            if (this.checkDateFormat(this.dataSelected.date.start) && !this.checkDateFormat(this.dataSelected.date.end)) {
                this.dataSelected.date.end = new NgbDate(this.dataSelected.date.start.year, this.dataSelected.date.start.month, this.dataSelected.date.start.day)
            }
            let date = [this.dataSelected.date.start, this.dataSelected.date.end].sort((a, b) => parseInt(this.ngbDateParserFormatter.format(a).replace(/\//gi, '-').split('-').reverse().join('')) > parseInt(this.ngbDateParserFormatter.format(b).replace(/\//gi, '-').split('-').reverse().join('')) ? 1 : -1)
            this.dataSelected.date.start = new NgbDate(date[0].year, date[0].month, date[0].day)
            this.dataSelected.date.end = new NgbDate(date[1].year, date[1].month, date[1].day)

            this.startDate = this.ngbDateParserFormatter.format(this.dataSelected.date.start).replace(/\//gi, '-').split('-').reverse().join('-')
            this.endDate = this.ngbDateParserFormatter.format(this.dataSelected.date.end).replace(/\//gi, '-').split('-').reverse().join('-')
            this.filterJobApplicantsDate()
        } else {
            if (!this.checkDateFormat(this.dataSelected.date.start) && !this.checkDateFormat(this.dataSelected.date.end)) {
                this.dataSelected.date.start = new NgbDate(new Date().getFullYear(), 1, 1)
                this.dataSelected.date.end = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
            }
            if (!this.checkDateFormat(this.dataSelected.date.start) && this.checkDateFormat(this.dataSelected.date.end)) {
                this.dataSelected.date.start = new NgbDate(new Date().getFullYear(), 1, 1)
            }
            if (this.checkDateFormat(this.dataSelected.date.start) && !this.checkDateFormat(this.dataSelected.date.end)) {
                this.dataSelected.date.end = new NgbDate(this.dataSelected.date.start.year, this.dataSelected.date.start.month, this.dataSelected.date.start.day)
            }
            let date = [this.dataSelected.date.start, this.dataSelected.date.end].sort((a, b) => parseInt(this.ngbDateParserFormatter.format(a).replace(/\//gi, '-').split('-').reverse().join('')) > parseInt(this.ngbDateParserFormatter.format(b).replace(/\//gi, '-').split('-').reverse().join('')) ? 1 : -1)
            this.dataSelected.date.start = new NgbDate(date[0].year, date[0].month, date[0].day)
            this.dataSelected.date.end = new NgbDate(date[1].year, date[1].month, date[1].day)
            let startDate = this.ngbDateParserFormatter.format(this.dataSelected.date.start).replace(/\//gi, '-').split('-').reverse().join('-')
            let endDate = this.ngbDateParserFormatter.format(this.dataSelected.date.end).replace(/\//gi, '-').split('-').reverse().join('-')
            this.dataList.recruitApplicant.list = { data: [], internal: [], external: [], raw: [] }
            this.recruitApplicantPage()
        }






    }


    wantInterview(item: RecruitApplicantModel) {
        let body = this.dataList.recruitApplicant.list.raw.filter(x => x.applicantId == item.applicantId)[0]
        body.wantInterview = item.wantInterview

        console.log(body)
        this.employeeService.wantInterview(body).then(result => {
            console.log(result)
            console.log(body.applicantDate);
        }).catch(error => {
            console.log(error)
        })

    }


}
