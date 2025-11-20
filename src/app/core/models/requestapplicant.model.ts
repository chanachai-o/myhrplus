import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"
import { JobcodeModel, MyJobcodeModel } from "./jobcodemodel.model";
import { MyPageableModel, PageableModel } from "./pageablemodel.model";
import { MyPositionModel, PositionModel } from "./positionmodel.model";
import { MySortModel, SortModel } from "./sortmodel.model";

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

function getDataModel(data: any): any {
    return data ? data : {}
}

function getDataArray(data: any): any {
    return data ? data : []
}

export interface RequestApplicantPageModel {
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
    content: RequestApplicantModel[]
}
export class MyRequestApplicantPageModel extends BaseModel implements RequestApplicantPageModel {
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
    content: RequestApplicantModel[]
    constructor(data: Partial<RequestApplicantPageModel>, translateService: TranslateService) {
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
        this.content = getDataArray(data.content).map((x: RequestApplicantModel) => new MyRequestApplicantModel(x, translateService))
    }
}

export interface RequestApplicantModel {
    requestId: string;
    requestKind: string;
    requestIdReference: string;
    jobId: string;
    positionId: string;
    groupId1: string;
    groupId2: string;
    employmentType: string;
    employmentTypeNumber: string;
    contactDuration: string;
    numberOfEmployee: string;
    startDate: string;
    lastDate: string;
    approveDate: string;
    effectDate: string;
    receiveDate: string;
    lowestSalary: string;
    highestSalary: string;
    youngestAge: string;
    oldestAge: string;
    degreeRequirement: string;
    major: string;
    purposeOfRequirement: string;
    sex: string;
    requisitionStatus: string;
    docDate: string;
    requestBy: string;
    requestDate: string;
    experienceThai: string;
    experienceEng: string;
    otherRequirementThai: string;
    otherRequirementEng: string;
    interviewForm: string;
    responsible: string;
    numberOfEnteredEmployee: string;
    requestType: string;
    requestAdding: string;
    requestSubstitution: string;
    requestAnnually: string;
    requestByApprove: string;
    branch: string;
    bu1: string;
    bu2: string;
    bu3: string;
    bu4: string;
    bu5: string;
    conclusion: string;
    conclusionDate: string;
    responsibilityThai: string;
    responsibilityEng: string;
    remark: string;
    hrIsRemark: string;
    workflowSequenceNumber: string;
    language: string;
    skill1: string;
    skill2: string;
    skill3: string;
    skill4: string;
    skill5: string;
    experience: string;
    workingCondition: string;
    pregnant: string;
    pregnantDesc: string;
    impaired: string;
    impairedDesc: string;
    addContract: string;
    replaceContract: string;
    planing: string;
    planDesc: string;
    notebook: string;
    desktop: string;
    room: string;
    cubicle: string;
    desk: string;
    software: string;
    reason: string;
    destination: string;
    expert: string;
    positionSpecific: string;
    otherKnowledge: string;
    behavior: string;
    selectionMethod: string;
    requestReason: string;
    requestReasonDesc: string;
    requestSalary1: string;
    requestSalary2: string;
    cancelBy: string;
    cancelReason: string;
    reasonToRaiseRates: string;
    caseNotListed: string;
    contactDurationStartDate: string;
    contactDurationEndDate: string;
    degreeId: string;
    salaryType: string;
    examData: string;
    qualificationThai: string;
    qualificationEng: string;
    router: string;
    responsibleMan: string;
    dayTypeGroup: string;
    majors: string;
    priorityId: string;
    showPriorityOnJobBoard: string;
    job: JobcodeModel;
    position: PositionModel;
}
export class MyRequestApplicantModel extends BaseModel implements RequestApplicantModel {
    requestId: string;
    requestKind: string;
    requestIdReference: string;
    jobId: string;
    positionId: string;
    groupId1: string;
    groupId2: string;
    employmentType: string;
    employmentTypeNumber: string;
    contactDuration: string;
    numberOfEmployee: string;
    startDate: string;
    lastDate: string;
    approveDate: string;
    effectDate: string;
    receiveDate: string;
    lowestSalary: string;
    highestSalary: string;
    youngestAge: string;
    oldestAge: string;
    degreeRequirement: string;
    major: string;
    purposeOfRequirement: string;
    sex: string;
    requisitionStatus: string;
    docDate: string;
    requestBy: string;
    requestDate: string;
    experienceThai: string;
    experienceEng: string;
    otherRequirementThai: string;
    otherRequirementEng: string;
    interviewForm: string;
    responsible: string;
    numberOfEnteredEmployee: string;
    requestType: string;
    requestAdding: string;
    requestSubstitution: string;
    requestAnnually: string;
    requestByApprove: string;
    branch: string;
    bu1: string;
    bu2: string;
    bu3: string;
    bu4: string;
    bu5: string;
    conclusion: string;
    conclusionDate: string;
    responsibilityThai: string;
    responsibilityEng: string;
    remark: string;
    hrIsRemark: string;
    workflowSequenceNumber: string;
    language: string;
    skill1: string;
    skill2: string;
    skill3: string;
    skill4: string;
    skill5: string;
    experience: string;
    workingCondition: string;
    pregnant: string;
    pregnantDesc: string;
    impaired: string;
    impairedDesc: string;
    addContract: string;
    replaceContract: string;
    planing: string;
    planDesc: string;
    notebook: string;
    desktop: string;
    room: string;
    cubicle: string;
    desk: string;
    software: string;
    reason: string;
    destination: string;
    expert: string;
    positionSpecific: string;
    otherKnowledge: string;
    behavior: string;
    selectionMethod: string;
    requestReason: string;
    requestReasonDesc: string;
    requestSalary1: string;
    requestSalary2: string;
    cancelBy: string;
    cancelReason: string;
    reasonToRaiseRates: string;
    caseNotListed: string;
    contactDurationStartDate: string;
    contactDurationEndDate: string;
    degreeId: string;
    salaryType: string;
    examData: string;
    qualificationThai: string;
    qualificationEng: string;
    router: string;
    responsibleMan: string;
    dayTypeGroup: string;
    majors: string;
    priorityId: string;
    showPriorityOnJobBoard: string;
    job: JobcodeModel;
    position: PositionModel;
    constructor(data: Partial<RequestApplicantModel>, translateService: TranslateService) {
        super(data, translateService)
        this.requestId = getDataString(data.requestId)
        this.requestKind = getDataString(data.requestKind)
        this.requestIdReference = getDataString(data.requestIdReference)
        this.jobId = getDataString(data.jobId)
        this.positionId = getDataString(data.positionId)
        this.groupId1 = getDataString(data.groupId1)
        this.groupId2 = getDataString(data.groupId2)
        this.employmentType = getDataString(data.employmentType)
        this.employmentTypeNumber = getDataString(data.employmentTypeNumber)
        this.contactDuration = getDataString(data.contactDuration)
        this.numberOfEmployee = getDataString(data.numberOfEmployee)
        this.startDate = getDataString(data.startDate)
        this.lastDate = getDataString(data.lastDate)
        this.approveDate = getDataString(data.approveDate)
        this.effectDate = getDataString(data.effectDate)
        this.receiveDate = getDataString(data.receiveDate)
        this.lowestSalary = getDataString(data.lowestSalary)
        this.highestSalary = getDataString(data.highestSalary)
        this.youngestAge = getDataString(data.youngestAge)
        this.oldestAge = getDataString(data.oldestAge)
        this.degreeRequirement = getDataString(data.degreeRequirement)
        this.major = getDataString(data.major)
        this.purposeOfRequirement = getDataString(data.purposeOfRequirement)
        this.sex = getDataString(data.sex)
        this.requisitionStatus = getDataString(data.requisitionStatus)
        this.docDate = getDataString(data.docDate)
        this.requestBy = getDataString(data.requestBy)
        this.requestDate = getDataString(data.requestDate)
        this.experienceThai = getDataString(data.experienceThai)
        this.experienceEng = getDataString(data.experienceEng)
        this.otherRequirementThai = getDataString(data.otherRequirementThai)
        this.otherRequirementEng = getDataString(data.otherRequirementEng)
        this.interviewForm = getDataString(data.interviewForm)
        this.responsible = getDataString(data.responsible)
        this.numberOfEnteredEmployee = getDataString(data.numberOfEnteredEmployee)
        this.requestType = getDataString(data.requestType)
        this.requestAdding = getDataString(data.requestAdding)
        this.requestSubstitution = getDataString(data.requestSubstitution)
        this.requestAnnually = getDataString(data.requestAnnually)
        this.requestByApprove = getDataString(data.requestByApprove)
        this.branch = getDataString(data.branch)
        this.bu1 = getDataString(data.bu1)
        this.bu2 = getDataString(data.bu2)
        this.bu3 = getDataString(data.bu3)
        this.bu4 = getDataString(data.bu4)
        this.bu5 = getDataString(data.bu5)
        this.conclusion = getDataString(data.conclusion)
        this.conclusionDate = getDataString(data.conclusionDate)
        this.responsibilityThai = getDataString(data.responsibilityThai)
        this.responsibilityEng = getDataString(data.responsibilityEng)
        this.remark = getDataString(data.remark)
        this.hrIsRemark = getDataString(data.hrIsRemark)
        this.workflowSequenceNumber = getDataString(data.workflowSequenceNumber)
        this.language = getDataString(data.language)
        this.skill1 = getDataString(data.skill1)
        this.skill2 = getDataString(data.skill2)
        this.skill3 = getDataString(data.skill3)
        this.skill4 = getDataString(data.skill4)
        this.skill5 = getDataString(data.skill5)
        this.experience = getDataString(data.experience)
        this.workingCondition = getDataString(data.workingCondition)
        this.pregnant = getDataString(data.pregnant)
        this.pregnantDesc = getDataString(data.pregnantDesc)
        this.impaired = getDataString(data.impaired)
        this.impairedDesc = getDataString(data.impairedDesc)
        this.addContract = getDataString(data.addContract)
        this.replaceContract = getDataString(data.replaceContract)
        this.planing = getDataString(data.planing)
        this.planDesc = getDataString(data.planDesc)
        this.notebook = getDataString(data.notebook)
        this.desktop = getDataString(data.desktop)
        this.room = getDataString(data.room)
        this.cubicle = getDataString(data.cubicle)
        this.desk = getDataString(data.desk)
        this.software = getDataString(data.software)
        this.reason = getDataString(data.reason)
        this.destination = getDataString(data.destination)
        this.expert = getDataString(data.expert)
        this.positionSpecific = getDataString(data.positionSpecific)
        this.otherKnowledge = getDataString(data.otherKnowledge)
        this.behavior = getDataString(data.behavior)
        this.selectionMethod = getDataString(data.selectionMethod)
        this.requestReason = getDataString(data.requestReason)
        this.requestReasonDesc = getDataString(data.requestReasonDesc)
        this.requestSalary1 = getDataString(data.requestSalary1)
        this.requestSalary2 = getDataString(data.requestSalary2)
        this.cancelBy = getDataString(data.cancelBy)
        this.cancelReason = getDataString(data.cancelReason)
        this.reasonToRaiseRates = getDataString(data.reasonToRaiseRates)
        this.caseNotListed = getDataString(data.caseNotListed)
        this.contactDurationStartDate = getDataString(data.contactDurationStartDate)
        this.contactDurationEndDate = getDataString(data.contactDurationEndDate)
        this.degreeId = getDataString(data.degreeId)
        this.salaryType = getDataString(data.salaryType)
        this.examData = getDataString(data.examData)
        this.qualificationThai = getDataString(data.qualificationThai)
        this.qualificationEng = getDataString(data.qualificationEng)
        this.router = getDataString(data.router)
        this.responsibleMan = getDataString(data.responsibleMan)
        this.dayTypeGroup = getDataString(data.dayTypeGroup)
        this.majors = getDataString(data.majors)
        this.priorityId = getDataString(data.priorityId)
        this.showPriorityOnJobBoard = getDataString(data.showPriorityOnJobBoard)
        this.job = new MyJobcodeModel(getDataModel(data.job), translateService)
        this.position = new MyPositionModel(getDataModel(data.position), translateService)
    }
}


