import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"
import { FileModel, MyFileModel } from "./filemodel.model"
import { MyNameModel, NameModel } from "./namemodel.model"
import { MyPageableModel, PageableModel } from "./pageablemodel.model"
import { MyPersonalModel, PersonalModel } from "./personalmodel.model"
import { MySortModel, SortModel } from "./sortmodel.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

function getDataArray(data: any): any {
    return data ? data : []
}

function getDataModel(data: any): any {
    return data ? data : {}
}

function getDataStringJSON(data: any): string {
    return (data != undefined && data != null) ? data.toString() : '{}'
}

export interface RecruitApplicantPageModel {
    totalPages: string
    last: string
    totalElements: string
    number: string
    size: string
    first: string
    numberOfElements: string
    empty: string
    pageable: PageableModel
    sort: SortModel
    content: RecruitApplicantModel[]
}
export class MyRecruitApplicantPageModel extends BaseModel implements RecruitApplicantPageModel {
    totalPages: string
    last: string
    totalElements: string
    number: string
    size: string
    first: string
    numberOfElements: string
    empty: string
    pageable: PageableModel
    sort: SortModel
    content: RecruitApplicantModel[]
    constructor(data: Partial<RecruitApplicantPageModel>, translateService: TranslateService) {
        super(data, translateService)
        this.totalPages = getDataString(data.totalPages)
        this.last = getDataString(data.last)
        this.totalElements = getDataString(data.totalElements)
        this.number = getDataString(data.number)
        this.size = getDataString(data.size)
        this.first = getDataString(data.first)
        this.numberOfElements = getDataString(data.numberOfElements)
        this.empty = getDataString(data.empty)
        this.pageable = new MyPageableModel(getDataModel(data.pageable), translateService)
        this.sort = new MySortModel(getDataModel(data.sort), translateService)
        this.content = getDataArray(data.content).map((x: RecruitApplicantModel) => new MyRecruitApplicantModel(x, translateService))
    }
}

export interface RecruitApplicantModel {
    applicantId: string
    requestId: string
    jobId: string
    oldJobId: string
    email: string
    salaryExpect: string
    applicantDate: string
    personal: PersonalModel
    contact: ContactModel
    family: FamilyModel
    education: EducationModel[]
    jobExp: JobExpModel
    skill: SkillModel
    other: OtherModel
    jobRouter: JobRouterModel[]
    wantInterview: string
    internal: string
    employeeId: string
}
export class MyRecruitApplicantModel extends BaseModel implements RecruitApplicantModel {
    applicantId: string
    requestId: string
    jobId: string
    oldJobId: string
    email: string
    salaryExpect: string
    applicantDate: string
    personal: PersonalModel
    contact: ContactModel
    family: FamilyModel
    education: EducationModel[]
    jobExp: JobExpModel
    skill: SkillModel
    other: OtherModel
    jobRouter: JobRouterModel[]
    wantInterview: string
    internal: string
    employeeId: string
    constructor(data: Partial<RecruitApplicantModel>, translateService: TranslateService) {
        super(data, translateService)
        this.applicantId = getDataString(data.applicantId)
        this.requestId = getDataString(data.requestId)
        this.jobId = getDataString(data.jobId)
        this.oldJobId = getDataString(data.oldJobId)
        this.email = getDataString(data.email)
        this.salaryExpect = getDataString(data.salaryExpect)
        this.applicantDate = getDataString(data.applicantDate)
        this.personal = new MyPersonalModel(getDataModel(JSON.parse(getDataStringJSON(data.personal))), translateService)
        this.contact = new MyContactModel(getDataModel(JSON.parse(getDataStringJSON(data.contact))), translateService)
        this.family = new MyFamilyModel(getDataModel(JSON.parse(getDataStringJSON(data.family))), translateService)
        this.education = JSON.parse(getDataStringJSON(data.education)).map((x: EducationModel) => new MyEducationModel(getDataModel(x), translateService))
        this.jobExp = new MyJobExpModel(getDataModel(JSON.parse(getDataStringJSON(data.jobExp))), translateService)
        this.skill = new MySkillModel(getDataModel(JSON.parse(getDataStringJSON(data.skill))), translateService)
        this.other = new MyOtherModel(getDataModel(JSON.parse(getDataStringJSON(data.other))), translateService)
        this.jobRouter = JSON.parse(getDataStringJSON(data.jobRouter)).map((x: JobRouterModel) => new MyJobRouterModel(getDataModel(x), translateService))
        this.wantInterview = getDataString(data.wantInterview)
        this.internal = getDataString(data.internal)
        this.employeeId = getDataString(data.employeeId)
    }
}

export interface ContactModel {
    home: AddressModel
    phone: string
    email: string
    current: AddressModel
}
export class MyContactModel extends BaseModel implements ContactModel {
    phone: string
    email: string
    current: AddressModel
    home: AddressModel
    constructor(data: Partial<ContactModel>, translateService: TranslateService) {
        super(data, translateService)
        this.phone = getDataString(data.phone)
        this.email = getDataString(data.email)
        this.current = new MyAddressModel(getDataModel(data.current), translateService)
        this.home = new MyAddressModel(getDataModel(data.home), translateService)
    }
}

export interface AddressModel {
    soi: string
    floor: string
    village: string
    zipcode: ZipcodeModel
    moo: string
    roomNo: string
    addr: string
    number: string
    road: string
    district: string
}
export class MyAddressModel extends BaseModel implements AddressModel {
    soi: string
    floor: string
    village: string
    moo: string
    roomNo: string
    addr: string
    number: string
    road: string
    district: string
    zipcode: ZipcodeModel
    constructor(data: Partial<AddressModel>, translateService: TranslateService) {
        super(data, translateService)
        this.soi = getDataString(data.soi)
        this.floor = getDataString(data.floor)
        this.village = getDataString(data.village)
        this.moo = getDataString(data.moo)
        this.roomNo = getDataString(data.roomNo)
        this.addr = getDataString(data.addr)
        this.number = getDataString(data.number)
        this.road = getDataString(data.road)
        this.district = getDataString(data.district)
        this.zipcode = new MyZipcodeModel(getDataModel(data.zipcode), translateService)
    }
}

export interface ZipcodeModel {
    provinceid: string
    autoid: string
    districtid: string
    zipid: string
    districtName: NameModel
    provinceName: NameModel
    disname: NameModel
    proname: NameModel
    getDistrictDesc(): string
    getProvinceDesc(): string
}
export class MyZipcodeModel extends BaseModel implements ZipcodeModel {
    provinceid: string
    autoid: string
    districtid: string
    zipid: string
    districtName: NameModel
    provinceName: NameModel
    disname: NameModel
    proname: NameModel
    constructor(data: Partial<ZipcodeModel>, translateService: TranslateService) {
        super(data, translateService)
        this.provinceid = getDataString(data.provinceid)
        this.autoid = getDataString(data.autoid)
        this.districtid = getDataString(data.districtid)
        this.zipid = getDataString(data.zipid)
        this.districtName = new MyNameModel(getDataModel(data.districtName), translateService)
        this.provinceName = new MyNameModel(getDataModel(data.provinceName), translateService)
        this.disname = new MyNameModel(getDataModel(data.disname), translateService)
        this.proname = new MyNameModel(getDataModel(data.proname), translateService)
    }
    getDistrictDesc(): string {
        return this.districtName.getDesc() ? this.districtName.getDesc() : this.disname.getDesc()
    }
    getProvinceDesc(): string {
        return this.provinceName.getDesc() ? this.provinceName.getDesc() : this.proname.getDesc()
    }
}

export interface EducationModel {
    yearstart: string
    gpa: string
    degreetype: string
    yearend: string
    faculty: string
    country: string
    major: MajorModel
    fac: FacModel
    university: UniversityModel
    honors: HonorsModel
}
export class MyEducationModel extends BaseModel implements EducationModel {
    yearstart: string
    gpa: string
    degreetype: string
    yearend: string
    faculty: string
    country: string
    major: MajorModel
    fac: FacModel
    university: UniversityModel
    honors: HonorsModel
    constructor(data: Partial<EducationModel>, translateService: TranslateService) {
        super(data, translateService)
        this.yearstart = getDataString(data.yearstart)
        this.gpa = getDataString(data.gpa)
        this.degreetype = getDataString(data.degreetype)
        this.yearend = getDataString(data.yearend)
        this.faculty = getDataString(data.faculty)
        this.country = getDataString(data.country)
        this.major = new MyMajorModel(getDataModel(data.major), translateService)
        this.fac = new MyFacModel(getDataModel(data.fac), translateService)
        this.university = new MyUniversityModel(getDataModel(data.university), translateService)
        this.honors = new MyHonorsModel(getDataModel(data.honors), translateService)
    }
}

export interface UniversityModel {
    searchtext: string
    universitylist: UniversitylistModel
}
export class MyUniversityModel extends BaseModel implements UniversityModel {
    searchtext: string
    universitylist: UniversitylistModel
    constructor(data: Partial<UniversityModel>, translateService: TranslateService) {
        super(data, translateService)
        this.searchtext = getDataString(data.searchtext)
        this.universitylist = new MyUniversitylistModel(getDataModel(data.universitylist), translateService)
    }
}

export interface UniversitylistModel {
    name: NameModel
    instituteid: string
}
export class MyUniversitylistModel extends BaseModel implements UniversitylistModel {
    instituteid: string
    name: NameModel
    constructor(data: Partial<UniversitylistModel>, translateService: TranslateService) {
        super(data, translateService)
        this.instituteid = getDataString(data.instituteid)
        this.name = new MyNameModel(getDataModel(data.name), translateService)
    }
}

export interface HonorsModel {
    havehonors: string
    id: string
}
export class MyHonorsModel extends BaseModel implements HonorsModel {
    havehonors: string
    id: string
    constructor(data: Partial<HonorsModel>, translateService: TranslateService) {
        super(data, translateService)
        this.id = getDataString(data.id)
        this.havehonors = getDataString(data.havehonors)
    }
}

export interface MajorModel {
    searchtext: string
    majorlist: MajorlistModel
}
export class MyMajorModel extends BaseModel implements MajorModel {
    searchtext: string
    majorlist: MajorlistModel
    constructor(data: Partial<MajorModel>, translateService: TranslateService) {
        super(data, translateService)
        this.searchtext = getDataString(data.searchtext)
        this.majorlist = new MyMajorlistModel(getDataModel(data.majorlist), translateService)
    }
}

export interface MajorlistModel {
    majorid: string
    name: NameModel
}
export class MyMajorlistModel extends BaseModel implements MajorlistModel {
    majorid: string
    name: NameModel
    constructor(data: Partial<MajorlistModel>, translateService: TranslateService) {
        super(data, translateService)
        this.majorid = getDataString(data.majorid)
        this.name = new MyNameModel(getDataModel(data.name), translateService)
    }
}

export interface FacModel {
    searchtext: string
    facultylist: FaculitylistModel
    faculitylist: FaculitylistModel
}
export class MyFacModel extends BaseModel implements FacModel {
    searchtext: string
    facultylist: FaculitylistModel
    faculitylist: FaculitylistModel
    constructor(data: Partial<FacModel>, translateService: TranslateService) {
        super(data, translateService)
        this.searchtext = getDataString(data.searchtext)
        this.faculitylist = new MyFaculitylistModel(getDataModel(data.faculitylist), translateService)
        this.facultylist = new MyFaculitylistModel(getDataModel(data.facultylist), translateService)
    }
}

export interface FaculitylistModel {
    mfacultyid: string
    facultydesc: NameModel
}
export class MyFaculitylistModel extends BaseModel implements FaculitylistModel {
    mfacultyid: string
    facultydesc: NameModel
    constructor(data: Partial<FaculitylistModel>, translateService: TranslateService) {
        super(data, translateService)
        this.mfacultyid = getDataString(data.mfacultyid)
        this.facultydesc = new MyNameModel(getDataModel(data.facultydesc), translateService)
    }
}

export interface FamilyModel {
    family: FamilyDetailModel[]
    reference: ReferenceModel[]
}
export class MyFamilyModel extends BaseModel implements FamilyModel {
    family: FamilyDetailModel[]
    reference: ReferenceModel[]
    constructor(data: Partial<FamilyModel>, translateService: TranslateService) {
        super(data, translateService)
        this.family = getDataArray(data.family).map((x: FamilyDetailModel) => new MyFamilyDetailModel(x, translateService))
        this.reference = getDataArray(data.reference).map((x: ReferenceModel) => new MyReferenceModel(x, translateService))
    }
}
export interface ReferenceModel {
    jobtitle: string
    phone: string
    accesspermit: string
    name: string
    companyname: string
    relations: string
    address: string
    accesspermitdesc: string
    dept: string
    collaborate: string
}
export class MyReferenceModel extends BaseModel implements ReferenceModel {
    jobtitle: string
    phone: string
    accesspermit: string
    name: string
    companyname: string
    relations: string
    address: string
    accesspermitdesc: string
    dept: string
    collaborate: string
    constructor(data: Partial<ReferenceModel>, translateService: TranslateService) {
        super(data, translateService)
        this.jobtitle = getDataString(data.jobtitle)
        this.phone = getDataString(data.phone)
        this.accesspermit = getDataString(data.accesspermit)
        this.phone = getDataString(data.phone)
        this.name = getDataString(data.name)
        this.companyname = getDataString(data.companyname)
        this.relations = getDataString(data.relations)
        this.address = getDataString(data.address)
        this.accesspermitdesc = getDataString(data.accesspermitdesc)
        this.dept = getDataString(data.dept)
        this.collaborate = getDataString(data.collaborate)
    }
}

export interface FamilyDetailModel {
    fname: string
    lname: string
    occupation: string
    phone: string
    position: string
    workplace: string
    age: string
    prefixid: string
    status: string
    relation: string
    genderid: string
    company: string
    nationalityid: string
    degreeid: string
}
export class MyFamilyDetailModel extends BaseModel implements FamilyDetailModel {
    fname: string
    lname: string
    occupation: string
    phone: string
    position: string
    workplace: string
    age: string
    prefixid: string
    status: string
    relation: string
    genderid: string
    company: string
    nationalityid: string
    degreeid: string
    constructor(data: Partial<FamilyDetailModel>, translateService: TranslateService) {
        super(data, translateService)
        this.fname = getDataString(data.fname)
        this.lname = getDataString(data.lname)
        this.occupation = getDataString(data.occupation)
        this.phone = getDataString(data.phone)
        this.position = getDataString(data.position)
        this.workplace = getDataString(data.workplace)
        this.age = getDataString(data.age)
        this.prefixid = getDataString(data.prefixid)
        this.status = getDataString(data.status)
        this.relation = getDataString(data.relation)
        this.genderid = getDataString(data.genderid)
        this.company = getDataString(data.company)
        this.nationalityid = getDataString(data.nationalityid)
        this.degreeid = getDataString(data.degreeid)
    }
}

export interface JobExpModel {
    training: TrainingModel[]
    internship: InternshipModel[]
    job: JobModel[]
}
export class MyJobExpModel extends BaseModel implements JobExpModel {
    training: TrainingModel[]
    internship: InternshipModel[]
    job: JobModel[]
    constructor(data: Partial<JobExpModel>, translateService: TranslateService) {
        super(data, translateService)
        this.training = getDataArray(data.training).map((x: TrainingModel) => new MyTrainingModel(x, translateService))
        this.internship = getDataArray(data.internship).map((x: InternshipModel) => new MyInternshipModel(x, translateService))
        this.job = getDataArray(data.job).map((x: JobModel) => new MyJobModel(x, translateService))
    }
}

export interface InternshipModel {
    title: string
    start: string
    description: string
    companyname: string
    end: string
}
export class MyInternshipModel extends BaseModel implements InternshipModel {
    title: string
    start: string
    description: string
    companyname: string
    end: string
    constructor(data: Partial<InternshipModel>, translateService: TranslateService) {
        super(data, translateService)
        this.title = getDataString(data.title)
        this.start = getDataString(data.start)
        this.description = getDataString(data.description)
        this.companyname = getDataString(data.companyname)
        this.end = getDataString(data.end)
    }
}

export interface TrainingModel {
    certificate: string
    start: string
    name: string
    by: string
    end: string
}
export class MyTrainingModel extends BaseModel implements TrainingModel {
    certificate: string
    start: string
    name: string
    by: string
    end: string
    constructor(data: Partial<TrainingModel>, translateService: TranslateService) {
        super(data, translateService)
        this.certificate = getDataString(data.certificate)
        this.start = getDataString(data.start)
        this.name = getDataString(data.name)
        this.by = getDataString(data.by)
        this.end = getDataString(data.end)
    }
}

export interface JobModel {
    phone: string
    reason: string
    roomNo: string
    moo: string
    addr: string
    endingsalary: string
    road: string
    companyname: string
    present: string
    title: string
    natureBusiness: string
    floor: string
    village: string
    soi: string
    start: string
    description: string
    supervisorName: string
    salary: string
    district: string
    end: string
    zipcode: ZipcodeModel
    allowances: AllowancesModel
}
export class MyJobModel extends BaseModel implements JobModel {
    phone: string
    reason: string
    roomNo: string
    moo: string
    addr: string
    endingsalary: string
    road: string
    companyname: string
    present: string
    title: string
    natureBusiness: string
    floor: string
    village: string
    soi: string
    start: string
    description: string
    supervisorName: string
    salary: string
    district: string
    end: string
    zipcode: ZipcodeModel
    allowances: AllowancesModel
    constructor(data: Partial<JobModel>, translateService: TranslateService) {
        super(data, translateService)
        this.phone = getDataString(data.phone)
        this.reason = getDataString(data.reason)
        this.roomNo = getDataString(data.roomNo)
        this.moo = getDataString(data.moo)
        this.addr = getDataString(data.addr)
        this.endingsalary = getDataString(data.endingsalary)
        this.road = getDataString(data.road)
        this.companyname = getDataString(data.companyname)
        this.present = getDataString(data.present)
        this.title = getDataString(data.title)
        this.natureBusiness = getDataString(data.natureBusiness)
        this.floor = getDataString(data.floor)
        this.village = getDataString(data.village)
        this.soi = getDataString(data.soi)
        this.start = getDataString(data.start)
        this.description = getDataString(data.description)
        this.supervisorName = getDataString(data.supervisorName)
        this.salary = getDataString(data.salary)
        this.district = getDataString(data.district)
        this.end = getDataString(data.end)
        this.zipcode = new MyZipcodeModel(getDataModel(data.zipcode), translateService)
        this.allowances = new MyAllowancesModel(getDataModel(data.allowances), translateService)
    }
}

export interface AllowancesModel {
    position: string
    car: string
    phone: string
    life: string
    other: string
    bonus: string
    travel: string
}
export class MyAllowancesModel extends BaseModel implements AllowancesModel {
    position: string
    car: string
    phone: string
    life: string
    other: string
    bonus: string
    travel: string
    constructor(data: Partial<AllowancesModel>, translateService: TranslateService) {
        super(data, translateService)
        this.position = getDataString(data.position)
        this.car = getDataString(data.car)
        this.phone = getDataString(data.phone)
        this.life = getDataString(data.life)
        this.other = getDataString(data.other)
        this.bonus = getDataString(data.bonus)
        this.travel = getDataString(data.travel)
    }
}

export interface JobRouterModel {
    id: string
    status: string
    examdata: ExamdataModel
    swlangcode: string
    flow: string
    question: QuestionModel[]
    skipby: string
    step: string
}
export class MyJobRouterModel extends BaseModel implements JobRouterModel {
    id: string
    status: string
    swlangcode: string
    flow: string
    skipby: string
    step: string
    examdata: ExamdataModel
    question: QuestionModel[]
    constructor(data: Partial<JobRouterModel>, translateService: TranslateService) {
        super(data, translateService)
        this.id = getDataString(data.id)
        this.status = getDataString(data.status)
        this.swlangcode = getDataString(data.swlangcode)
        this.flow = getDataString(data.flow)
        this.skipby = getDataString(data.skipby)
        this.step = getDataString(data.step)
        this.examdata = new MyExamdataModel(getDataModel(data.examdata), translateService)
        this.question = getDataArray(data.question).map((x: QuestionModel) => new MyQuestionModel(x, translateService))
    }
}

export interface QuestionModel {
    ansgroup: AnsgroupModel
    videoproperty: VideopropertyModel
    pictureproperty: PicturepropertyModel
    audioproperty: AudiopropertyModel
    question: NameModel
    type: string
}
export class MyQuestionModel extends BaseModel implements QuestionModel {
    ansgroup: AnsgroupModel
    videoproperty: VideopropertyModel
    pictureproperty: PicturepropertyModel
    audioproperty: AudiopropertyModel
    question: NameModel
    type: string
    constructor(data: Partial<QuestionModel>, translateService: TranslateService) {
        super(data, translateService)
        this.type = getDataString(data.type)
        this.ansgroup = new MyAnsgroupModel(getDataModel(data.ansgroup), translateService)
        this.videoproperty = new MyVideopropertyModel(getDataModel(data.videoproperty), translateService)
        this.pictureproperty = new MyPicturepropertyModel(getDataModel(data.pictureproperty), translateService)
        this.audioproperty = new MyAudiopropertyModel(getDataModel(data.audioproperty), translateService)
        this.question = new MyNameModel(getDataModel(data.question), translateService)
    }
}


export interface AudiopropertyModel {
    urlaudio: string
    isaudio: string
}
export class MyAudiopropertyModel extends BaseModel implements AudiopropertyModel {
    urlaudio: string
    isaudio: string
    constructor(data: Partial<AudiopropertyModel>, translateService: TranslateService) {
        super(data, translateService)
        this.urlaudio = getDataString(data.urlaudio)
        this.isaudio = getDataString(data.isaudio)
    }
}

export interface PicturepropertyModel {
    ispicture: string
    urlpicture: string
}
export class MyPicturepropertyModel extends BaseModel implements PicturepropertyModel {
    ispicture: string
    urlpicture: string
    constructor(data: Partial<PicturepropertyModel>, translateService: TranslateService) {
        super(data, translateService)
        this.ispicture = getDataString(data.ispicture)
        this.urlpicture = getDataString(data.urlpicture)
    }
}

export interface VideopropertyModel {
    isvideo: string
    urlvideo: string
}
export class MyVideopropertyModel extends BaseModel implements VideopropertyModel {
    isvideo: string
    urlvideo: string
    constructor(data: Partial<VideopropertyModel>, translateService: TranslateService) {
        super(data, translateService)
        this.isvideo = getDataString(data.isvideo)
        this.urlvideo = getDataString(data.urlvideo)
    }
}

export interface AnsgroupModel {
    choice: ChoiceModel[]
    answer: string
}
export class MyAnsgroupModel extends BaseModel implements AnsgroupModel {
    choice: ChoiceModel[]
    answer: string
    constructor(data: Partial<AnsgroupModel>, translateService: TranslateService) {
        super(data, translateService)
        this.answer = getDataString(data.answer)
        this.choice = getDataArray(data.choice).map((x: ChoiceModel) => new MyChoiceModel(x, translateService))
    }
}

export interface ChoiceModel {
    id: string
    value: string
    label: NameModel
}
export class MyChoiceModel extends BaseModel implements ChoiceModel {
    id: string
    value: string
    label: NameModel
    constructor(data: Partial<ChoiceModel>, translateService: TranslateService) {
        super(data, translateService)
        this.id = getDataString(data.id)
        this.value = getDataString(data.value)
        this.label = new MyNameModel(getDataModel(data.label), translateService)
    }
}

export interface ExamdataModel {
    topic: NameModel
    evaluate: EvaluateModel
    description: NameModel
    timelimit: TimelimitModel
    autochecking: string
    showscore: string
}
export class MyExamdataModel extends BaseModel implements ExamdataModel {
    topic: NameModel
    evaluate: EvaluateModel
    description: NameModel
    timelimit: TimelimitModel
    autochecking: string
    showscore: string
    constructor(data: Partial<ExamdataModel>, translateService: TranslateService) {
        super(data, translateService)
        this.autochecking = getDataString(data.autochecking)
        this.showscore = getDataString(data.showscore)
        this.topic = new MyNameModel(getDataModel(data.topic), translateService)
        this.evaluate = new MyEvaluateModel(getDataModel(data.evaluate), translateService)
        this.description = new MyNameModel(getDataModel(data.description), translateService)
        this.timelimit = new MyTimelimitModel(getDataModel(data.timelimit), translateService)
    }
}

export interface EvaluateModel {
    isevaluate: string
    passing: string
    totalscore: string
}
export class MyEvaluateModel extends BaseModel implements EvaluateModel {
    isevaluate: string
    passing: string
    totalscore: string
    constructor(data: Partial<EvaluateModel>, translateService: TranslateService) {
        super(data, translateService)
        this.isevaluate = getDataString(data.isevaluate)
        this.passing = getDataString(data.passing)
        this.totalscore = getDataString(data.totalscore)
    }
}

export interface TimelimitModel {
    minute: string
    istimelimit: string
    hour: string
}
export class MyTimelimitModel extends BaseModel implements TimelimitModel {
    minute: string
    istimelimit: string
    hour: string
    constructor(data: Partial<TimelimitModel>, translateService: TranslateService) {
        super(data, translateService)
        this.minute = getDataString(data.minute)
        this.istimelimit = getDataString(data.istimelimit)
        this.hour = getDataString(data.hour)
    }
}

export interface OtherModel {
    askoldcompanyDesc: string
    acquaintance: string
    workupcountryDesc: string
    ordinationDays: string
    dropforjob: string
    sourcejobExplain: string
    otheropinion: string
    sourcejob: string
    workarea: string
    hajj: string
    remark: string
    ordination: string
    presentemployer: string
    shiftwork: string
    guarantees: string
    idealtoperform: string
    otherdetail: string
    apply: string
    drinkalcohol: string
    employingthispos: string
    visiononjob: string
    workupcountry: string
    askoldcompany: string
    jobtypelike: string
    interested: string
    swot: string
    health: ExplainModel
    distinguished: DistinguishedModel
    pregnant: PregnantModel
    surgical: ExplainModel
    policecapture: ExplainModel
    discharge: ExplainModel
    referee_group: RefereeGroupModel[]
    colorblindness: ExplainModel
    overtime: ExplainModel
    trade_union: TradeUnionModel
    smoking: SmokingModel
    sometimes: SometimesModel
    applyDesc: ApplyDescModel
    files: FileModel[]
}
export class MyOtherModel extends BaseModel implements OtherModel {
    askoldcompanyDesc: string
    acquaintance: string
    workupcountryDesc: string
    ordinationDays: string
    dropforjob: string
    sourcejobExplain: string
    otheropinion: string
    sourcejob: string
    workarea: string
    hajj: string
    remark: string
    ordination: string
    presentemployer: string
    shiftwork: string
    guarantees: string
    idealtoperform: string
    otherdetail: string
    apply: string
    drinkalcohol: string
    employingthispos: string
    visiononjob: string
    workupcountry: string
    askoldcompany: string
    jobtypelike: string
    interested: string
    swot: string
    health: ExplainModel
    surgical: ExplainModel
    policecapture: ExplainModel
    discharge: ExplainModel
    colorblindness: ExplainModel
    overtime: ExplainModel
    distinguished: DistinguishedModel
    pregnant: PregnantModel
    trade_union: TradeUnionModel
    smoking: SmokingModel
    sometimes: SometimesModel
    applyDesc: ApplyDescModel
    referee_group: RefereeGroupModel[]
    files: FileModel[]
    constructor(data: Partial<OtherModel>, translateService: TranslateService) {
        super(data, translateService)
        this.askoldcompanyDesc = getDataString(data.askoldcompanyDesc)
        this.acquaintance = getDataString(data.acquaintance)
        this.workupcountryDesc = getDataString(data.workupcountryDesc)
        this.ordinationDays = getDataString(data.ordinationDays)
        this.dropforjob = getDataString(data.dropforjob)
        this.sourcejobExplain = getDataString(data.sourcejobExplain)
        this.otheropinion = getDataString(data.otheropinion)
        this.sourcejob = getDataString(data.sourcejob)
        this.workarea = getDataString(data.workarea)
        this.hajj = getDataString(data.hajj)
        this.remark = getDataString(data.remark)
        this.ordination = getDataString(data.ordination)
        this.presentemployer = getDataString(data.presentemployer)
        this.shiftwork = getDataString(data.shiftwork)
        this.guarantees = getDataString(data.guarantees)
        this.idealtoperform = getDataString(data.idealtoperform)
        this.otherdetail = getDataString(data.otherdetail)
        this.apply = getDataString(data.apply)
        this.drinkalcohol = getDataString(data.drinkalcohol)
        this.employingthispos = getDataString(data.employingthispos)
        this.visiononjob = getDataString(data.visiononjob)
        this.workupcountry = getDataString(data.workupcountry)
        this.askoldcompany = getDataString(data.askoldcompany)
        this.jobtypelike = getDataString(data.jobtypelike)
        this.interested = getDataString(data.interested)
        this.swot = getDataString(data.swot)
        this.health = new MyExplainModel(getDataModel(data.health), translateService)
        this.surgical = new MyExplainModel(getDataModel(data.surgical), translateService)
        this.policecapture = new MyExplainModel(getDataModel(data.policecapture), translateService)
        this.discharge = new MyExplainModel(getDataModel(data.discharge), translateService)
        this.colorblindness = new MyExplainModel(getDataModel(data.colorblindness), translateService)
        this.overtime = new MyExplainModel(getDataModel(data.overtime), translateService)
        this.distinguished = new MyDistinguishedModel(getDataModel(data.distinguished), translateService)
        this.pregnant = new MyPregnantModel(getDataModel(data.pregnant), translateService)
        this.trade_union = new MyTradeUnionModel(getDataModel(data.trade_union), translateService)
        this.smoking = new MySmokingModel(getDataModel(data.smoking), translateService)
        this.sometimes = new MySometimesModel(getDataModel(data.sometimes), translateService)
        this.applyDesc = new MyApplyDescModel(getDataModel(data.applyDesc), translateService)
        this.files = getDataArray(data.files).map((x: FileModel) => new MyFileModel(x, translateService))
        this.referee_group = getDataArray(data.referee_group).map((x: RefereeGroupModel) => new MyRefereeGroupModel(x, translateService))
    }
}

export interface RefereeGroupModel {
    lname: string
    major: string
    prefix: string
    name: string
    position: string
    dept: string
    relation: string
}
export class MyRefereeGroupModel extends BaseModel implements RefereeGroupModel {
    lname: string
    major: string
    prefix: string
    name: string
    position: string
    dept: string
    relation: string
    constructor(data: Partial<RefereeGroupModel>, translateService: TranslateService) {
        super(data, translateService)
        this.lname = getDataString(data.lname)
        this.major = getDataString(data.major)
        this.prefix = getDataString(data.prefix)
        this.name = getDataString(data.name)
        this.position = getDataString(data.position)
        this.dept = getDataString(data.dept)
        this.relation = getDataString(data.relation)
    }
}

export interface SometimesModel {
    workupcountry: string
    overtime: string
}
export class MySometimesModel extends BaseModel implements SometimesModel {
    workupcountry: string
    overtime: string
    constructor(data: Partial<SometimesModel>, translateService: TranslateService) {
        super(data, translateService)
        this.workupcountry = getDataString(data.workupcountry)
        this.overtime = getDataString(data.overtime)
    }
}

export interface SmokingModel {
    status: string
    cartonperday: string
}
export class MySmokingModel extends BaseModel implements SmokingModel {
    status: string
    cartonperday: string
    constructor(data: Partial<SmokingModel>, translateService: TranslateService) {
        super(data, translateService)
        this.cartonperday = getDataString(data.cartonperday)
        this.status = getDataString(data.status)
    }
}

export interface ApplyDescModel {
    position: string
    year: string
}
export class MyApplyDescModel extends BaseModel implements ApplyDescModel {
    position: string
    year: string
    constructor(data: Partial<ApplyDescModel>, translateService: TranslateService) {
        super(data, translateService)
        this.position = getDataString(data.position)
        this.year = getDataString(data.year)
    }
}

export interface ExplainModel {
    explain: string
    status: string
}
export class MyExplainModel extends BaseModel implements ExplainModel {
    explain: string
    status: string
    constructor(data: Partial<ExplainModel>, translateService: TranslateService) {
        super(data, translateService)
        this.explain = getDataString(data.explain)
        this.status = getDataString(data.status)
    }
}

export interface PregnantModel {
    months: string
    status: string
}
export class MyPregnantModel extends BaseModel implements PregnantModel {
    months: string
    status: string
    constructor(data: Partial<PregnantModel>, translateService: TranslateService) {
        super(data, translateService)
        this.months = getDataString(data.months)
        this.status = getDataString(data.status)
    }
}

export interface DistinguishedModel {
    inter: string
    local: string
}
export class MyDistinguishedModel extends BaseModel implements DistinguishedModel {
    inter: string
    local: string
    constructor(data: Partial<DistinguishedModel>, translateService: TranslateService) {
        super(data, translateService)
        this.local = getDataString(data.local)
        this.inter = getDataString(data.inter)
    }
}

export interface TradeUnionModel {
    role: string
    name: string
    status: string
}
export class MyTradeUnionModel extends BaseModel implements TradeUnionModel {
    role: string
    name: string
    status: string
    constructor(data: Partial<TradeUnionModel>, translateService: TranslateService) {
        super(data, translateService)
        this.role = getDataString(data.role)
        this.name = getDataString(data.name)
        this.status = getDataString(data.status)
    }
}

export interface SkillModel {
    ietls: string
    toefl: string
    toeic: string
    sport: string[]
    hobbies: string[]
    expertise: string[]
    vehicle: VehicleModel
    officeEquipment: OfficeEquipmentModel
    shorthand: NameModel
    typing: NameModel
    computerSkills: ComputerSkillsModel
    activity: ActivityModel[]
    langskill: LangskillModel[]
}
export class MySkillModel extends BaseModel implements SkillModel {
    ietls: string
    toefl: string
    toeic: string
    sport: string[]
    hobbies: string[]
    expertise: string[]
    vehicle: VehicleModel
    officeEquipment: OfficeEquipmentModel
    shorthand: NameModel
    typing: NameModel
    computerSkills: ComputerSkillsModel
    activity: ActivityModel[]
    langskill: LangskillModel[]
    constructor(data: Partial<SkillModel>, translateService: TranslateService) {
        super(data, translateService)
        this.ietls = getDataString(data.ietls)
        this.toefl = getDataString(data.toefl)
        this.toeic = getDataString(data.toeic)
        this.sport = getDataArray(data.sport)
        this.hobbies = getDataArray(data.hobbies)
        this.expertise = getDataArray(data.expertise)
        this.vehicle = new MyVehicleModel(getDataModel(data.vehicle), translateService)
        this.officeEquipment = new MyOfficeEquipmentModel(getDataModel(data.officeEquipment), translateService)
        this.shorthand = new MyNameModel(getDataModel(data.shorthand), translateService)
        this.typing = new MyNameModel(getDataModel(data.typing), translateService)
        this.computerSkills = new MyComputerSkillsModel(getDataModel(data.computerSkills), translateService)
        this.activity = getDataArray(data.activity).map((x: ActivityModel) => new MyActivityModel(x, translateService))
        this.langskill = getDataArray(data.langskill).map((x: LangskillModel) => new MyLangskillModel(x, translateService))
    }
}

export interface ActivityModel {
    roledesc: string
    start: string
    name: string
    degreetype: string
    role: string
    end: string
}
export class MyActivityModel extends BaseModel implements ActivityModel {
    roledesc: string
    start: string
    name: string
    degreetype: string
    role: string
    end: string
    constructor(data: Partial<ActivityModel>, translateService: TranslateService) {
        super(data, translateService)
        this.roledesc = getDataString(data.roledesc)
        this.start = getDataString(data.start)
        this.name = getDataString(data.name)
        this.degreetype = getDataString(data.degreetype)
        this.role = getDataString(data.role)
        this.end = getDataString(data.end)
    }
}

export interface ComputerSkillsModel {
    softwarePackagedesc: string
    other: string
    softwarePackage: string
    word: string
    excel: string
    autoCad: string
    powerpoint: string
    access: string
}
export class MyComputerSkillsModel extends BaseModel implements ComputerSkillsModel {
    softwarePackagedesc: string
    other: string
    softwarePackage: string
    word: string
    excel: string
    autoCad: string
    powerpoint: string
    access: string
    constructor(data: Partial<ComputerSkillsModel>, translateService: TranslateService) {
        super(data, translateService)
        this.softwarePackagedesc = getDataString(data.softwarePackagedesc)
        this.other = getDataString(data.other)
        this.softwarePackage = getDataString(data.softwarePackage)
        this.word = getDataString(data.word)
        this.excel = getDataString(data.excel)
        this.autoCad = getDataString(data.autoCad)
        this.powerpoint = getDataString(data.powerpoint)
        this.access = getDataString(data.access)
    }
}

export interface LangskillModel {
    skill: SkillDetailModel
    remark: string
    name: string
    searchtext: string
    langskilllist: LangskilllistModel
}
export class MyLangskillModel extends BaseModel implements LangskillModel {
    remark: string
    name: string
    searchtext: string
    skill: SkillDetailModel
    langskilllist: LangskilllistModel
    constructor(data: Partial<LangskillModel>, translateService: TranslateService) {
        super(data, translateService)
        this.remark = getDataString(data.remark)
        this.name = getDataString(data.name)
        this.searchtext = getDataString(data.searchtext)
        this.skill = new MySkillDetailModel(getDataModel(data.skill), translateService)
        this.langskilllist = new MyLangskilllistModel(getDataModel(data.langskilllist), translateService)
    }
}

export interface SkillDetailModel {
    reading: string
    write: string
    speak: string
    listen: string
}
export class MySkillDetailModel extends BaseModel implements SkillDetailModel {
    reading: string
    write: string
    speak: string
    listen: string
    constructor(data: Partial<SkillDetailModel>, translateService: TranslateService) {
        super(data, translateService)
        this.reading = getDataString(data.reading)
        this.write = getDataString(data.write)
        this.speak = getDataString(data.speak)
        this.listen = getDataString(data.listen)
    }
}

export interface LangskilllistModel {
    id: string
    name: NameModel
}
export class MyLangskilllistModel extends BaseModel implements LangskilllistModel {
    id: string
    name: NameModel
    constructor(data: Partial<LangskilllistModel>, translateService: TranslateService) {
        super(data, translateService)
        this.id = getDataString(data.id)
        this.name = new MyNameModel(getDataModel(data.name), translateService)
    }
}

export interface OfficeEquipmentModel {
    copier: string
    other: string
    active: string
}
export class MyOfficeEquipmentModel extends BaseModel implements OfficeEquipmentModel {
    copier: string
    other: string
    active: string
    constructor(data: Partial<OfficeEquipmentModel>, translateService: TranslateService) {
        super(data, translateService)
        this.copier = getDataString(data.copier)
        this.other = getDataString(data.other)
        this.active = getDataString(data.active)
    }
}

export interface VehicleModel {
    driving: string
    car: CarModel
    motorcycle: CarModel
}
export class MyVehicleModel extends BaseModel implements VehicleModel {
    driving: string
    car: CarModel
    motorcycle: CarModel
    constructor(data: Partial<VehicleModel>, translateService: TranslateService) {
        super(data, translateService)
        this.driving = getDataString(data.driving)
        this.car = new MyCarModel(getDataModel(data.car), translateService)
        this.motorcycle = new MyCarModel(getDataModel(data.motorcycle), translateService)
    }
}


export interface CarModel {
    issuedAt: string
    expiryDate: string
    driving: string
    own: string
    number: string
    license: string
    issuedDate: string
}
export class MyCarModel extends BaseModel implements CarModel {
    issuedAt: string
    expiryDate: string
    driving: string
    own: string
    number: string
    license: string
    issuedDate: string
    constructor(data: Partial<CarModel>, translateService: TranslateService) {
        super(data, translateService)
        this.issuedAt = getDataString(data.issuedAt)
        this.expiryDate = getDataString(data.expiryDate)
        this.driving = getDataString(data.driving)
        this.own = getDataString(data.own)
        this.number = getDataString(data.number)
        this.license = getDataString(data.license)
        this.issuedDate = getDataString(data.issuedDate)
    }
}