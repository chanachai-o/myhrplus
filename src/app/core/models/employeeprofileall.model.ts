import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
import { MyZipcodeObject, ZipcodeObject } from './zipcodeObject.model';
export interface EmployeeProfileAllModel {
    address: EmployeeProfileAllAddress[]
    education: EmployeeProfileAllEducation[]
    employee: EmployeeProfileAllEmployee
    family: EmployeeProfileAllFamily
    tax: EmployeeProfileAllTax
}
export interface EmployeeProfileAllAddress {
    addrCurrent: number | undefined;
    addrCurrentName: string | undefined;
    addrEng: string | undefined;
    addrThai: string | undefined;
    distance: string | undefined;
    fax: string | undefined;
    floorEng: string | undefined;
    floorThai: string | undefined;
    mooEng: string | undefined;
    mooThai: string | undefined;
    roadEng: string | undefined;
    roadThai: string | undefined;
    roomNoEng: string | undefined;
    roomNoThai: string | undefined;
    soiEng: string | undefined;
    soiThai: string | undefined;
    subDistrictEng: string | undefined;
    subDistrictThai: string | undefined;
    tel: string | undefined;
    villageEng: string | undefined;
    villageThai: string | undefined;
    zipCode?: ZipcodeObject
}
export class MyEmployeeProfileAllAddress extends BaseModel implements EmployeeProfileAllAddress {
    addrCurrent: number | undefined;
    addrCurrentName: string | undefined;
    addrEng: string | undefined;
    addrThai: string | undefined;
    distance: string | undefined;
    fax: string | undefined;
    floorEng: string | undefined;
    floorThai: string | undefined;
    mooEng: string | undefined;
    mooThai: string | undefined;
    roadEng: string | undefined;
    roadThai: string | undefined;
    roomNoEng: string | undefined;
    roomNoThai: string | undefined;
    soiEng: string | undefined;
    soiThai: string | undefined;
    subDistrictEng: string | undefined;
    subDistrictThai: string | undefined;
    tel: string | undefined;
    villageEng: string | undefined;
    villageThai: string | undefined;
    zipCode?: ZipcodeObject
    constructor(data: Partial<any>, tranSer: TranslateService) {
        super(data, tranSer);
        this.zipCode = new MyZipcodeObject(this.zipCode!, this.translateService);

    }


}
export interface EmployeeProfileAllEducation {
    degreeId: string
    degreeName: string
    endYear: number
    facultyId: string
    facultyName: string
    gpa: number
    instituteId: string
    instituteName: string
    majorId: string
    majorName: string
    startYear: number
}
export interface EmployeeProfileAllEmployee {
    bossId: string
    bu1Id: string
    bu1Name: string
    bu2Id: string
    bu2Name: string
    bu3Id: string
    bu3Name: string
    bu4Id: string
    bu4Name: string
    bu5Id: string
    bu5Name: string
    companyId: string
    costcenterId: string
    costcenterName: string
    dlidl: string
    email: string
    empGroupId: string
    empTypeName: string
    employeeId: string
    employeePicture: string
    engFirstName: string
    engLastName: string
    engNickName: string
    firstName: string
    fullName: string
    jobId: string
    jobName: string
    lastName: string
    memberId: string
    mobile: string
    positionId: string
    positionName: string
    prefix: string
    prefixId: string
    startDate: string
    thaiFirstName: string
    thaiLastName: string
    thaiNickName: string
    time0Id: string
    time0Name: string
    workareaId: string
}
export interface EmployeeProfileAllFamily {
    children: ProfileFamilyChildren[]
    father: ProfileFamilyFM
    mother: ProfileFamilyFM
    spouse: ProfileFamilySpouse
}
export interface ProfileFamilyChildren {
    prefixId: string;
    prefixName: string;
    fName: string;
    lName: string;
    birthday: string;
    idCard: string;
    occupationId: string;
    occupationName: string;
    otherOccupation: string;
    status: string;
    statusName: string;
    statusStudy: string;
    statusStudyName: string;
}
export interface ProfileFamilyFM {
    prefixId: string;
    prefixName: string;
    fName: string;
    lName: string;
    birthday: string;
    idCard: string;
    occupationId: string;
    occupationName: string;
    otherOccupation: string;
    status: string;
    statusName: string;
}
export interface ProfileFamilySpouse {
    prefixId: string;
    prefixName: string;
    fName: string;
    lName: string;
    birthday: string;
    idCard: string;
    fatherIdCard: string;
    motherIdCard: string;
    occupationId: string;
    occupationName: string;
    otherOccupation: string;
    status: string;
    statusName: string;
}
export interface EmployeeProfileAllTax {
    buyInCountry: number
    carRepair: number
    child: number
    childAbroad: number
    childDomestic: number
    crippleAllowance: number
    dateMarry: string
    donation: number
    donationSpecial: number
    eMediaDonation: number
    educationDonation: number
    employeeId: string
    extenuateFather: number
    extenuateMother: number
    extenuateSpouseFather: number
    extenuateSpouseMother: number
    fatherIdCard: string
    firstHome: number
    gbk: number
    homeRepair: number
    idPeople: string
    idSoc: string
    idtax: string
    insurance: number
    insuranceFather: number
    insuranceMother: number
    insurancePensions: number
    insuranceSpouse: number
    insuranceSpouseFather: number
    insuranceSpouseMother: number
    interest: number
    isCripple: number
    ltf: number
    motherIdCard: string
    realEstate: number
    rmf: number
    songkranFestival: number
    sportDonation: number
    spouseFatherIdCard: string
    spouseMotherIdCard: string
    statusMarry: string
    statusMarryName: string
    totalChildren: number
    travelInCountry: number
}