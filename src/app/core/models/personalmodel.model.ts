import { TranslateService } from "@ngx-translate/core"
import { environment } from "src/environments/environment"
import { BaseModel } from "./base.model"
import { ChildrenModel, MyChildrenModel } from "./childrenModelmodel .model"
import { FileModel, MyFileModel } from "./filemodel.model"
import { IdentificationModel, MyIdentificationModel } from "./identificationmodel.model"
import { MilitaryModel, MyMilitaryModel } from "./militarymodel.model"
import { MyNamechangeModel, NamechangeModel } from "./namechangemodel.model"
import { MyNameModel, NameModel } from "./namemodel.model"
import { MySsoModel, SsoModel } from "./ssomodel.model"

function getDataString(data: any): string {
    return (data != undefined && data != null) ? data.toString() : ''
}

function getDataArray(data: any): any {
    return data ? data : []
}

function getDataModel(data: any): any {
    return data ? data : {}
}

export interface PersonalModel {
    secondjobinterest: string
    residenceid: string
    birthorder: string
    birthmark: string
    firstjobinterest: string
    birthplace: string
    dateavailable: string
    weight: string
    status: string
    marryregister: string
    blood: string
    religionid: string
    genderid: string
    height: string
    nationalityid: string
    imgname: string
    birthdate: string
    raceid: string
    prefixid: string
    fname: NameModel
    mname: NameModel
    lname: NameModel
    nickname: NameModel
    namechange: NamechangeModel
    children: ChildrenModel
    sso: SsoModel
    military: MilitaryModel
    identification: IdentificationModel
    files: FileModel[]
    getFullName(): string
    getImg(): string
}
export class MyPersonalModel extends BaseModel implements PersonalModel {
    secondjobinterest: string
    residenceid: string
    birthorder: string
    birthmark: string
    firstjobinterest: string
    birthplace: string
    dateavailable: string
    weight: string
    status: string
    marryregister: string
    blood: string
    religionid: string
    genderid: string
    height: string
    nationalityid: string
    imgname: string
    birthdate: string
    raceid: string
    prefixid: string
    fname: NameModel
    mname: NameModel
    lname: NameModel
    nickname: NameModel
    namechange: NamechangeModel
    children: ChildrenModel
    sso: SsoModel
    military: MilitaryModel
    identification: IdentificationModel
    files: FileModel[]
    constructor(data: Partial<PersonalModel>, translateService: TranslateService) {
        super(data, translateService)
        this.secondjobinterest = getDataString(data.secondjobinterest)
        this.residenceid = getDataString(data.residenceid)
        this.birthorder = getDataString(data.birthorder)
        this.birthmark = getDataString(data.birthmark)
        this.firstjobinterest = getDataString(data.firstjobinterest)
        this.birthplace = getDataString(data.birthplace)
        this.dateavailable = getDataString(data.dateavailable)
        this.weight = getDataString(data.weight)
        this.status = getDataString(data.status)
        this.marryregister = getDataString(data.marryregister)
        this.blood = getDataString(data.blood)
        this.religionid = getDataString(data.religionid)
        this.genderid = getDataString(data.genderid)
        this.height = getDataString(data.height)
        this.nationalityid = getDataString(data.nationalityid)
        this.imgname = getDataString(data.imgname)
        this.birthdate = getDataString(data.birthdate)
        this.raceid = getDataString(data.raceid)
        this.prefixid = getDataString(data.prefixid)
        this.fname = new MyNameModel(getDataModel(data.fname), translateService)
        this.mname = new MyNameModel(getDataModel(data.mname), translateService)
        this.lname = new MyNameModel(getDataModel(data.lname), translateService)
        this.nickname = new MyNameModel(getDataModel(data.nickname), translateService)
        this.namechange = new MyNamechangeModel(getDataModel(data.namechange), translateService)
        this.children = new MyChildrenModel(getDataModel(data.children), translateService)
        this.sso = new MySsoModel(getDataModel(data.sso), translateService)
        this.military = new MyMilitaryModel(getDataModel(data.military), translateService)
        this.identification = new MyIdentificationModel(getDataModel(data.identification), translateService)
        this.files = getDataArray(data.files).map((x: FileModel) => new MyFileModel(x, translateService))
    }
    getFullName(): string {
        return this.fname.getDesc() + ' ' + this.lname.getDesc()
    }
    getImg(): string {
        return this.imgname ? environment.rootUrl + '/hr/FileViewer.jsp?uploadfield=mapplicant.picture&filename=' + this.imgname : ''
    }
}