/**
 * Employee shift model
 */
export interface EmpShiftModel {
  employee: EmpShiftEmployee;
  items: EmpShiftItem[];
}

export interface EmpShiftEmployee {
  employeeId: string;
  memberId: string;
  companyId: string;
  fullName: string;
  prefixId: string;
  prefix: string;
  firstName: string;
  lastName: string;
  thaiFirstName: string;
  thaiLastName: string;
  engFirstName: string;
  engLastName: string;
  thaiNickName: string;
  engNickName: string;
  employeePicture: string;
  bossId: string;
  bu1Id: string;
  bu1Name: string;
  bu2Id: string;
  bu2Name: string;
  bu3Id: string;
  bu3Name: string;
  bu4Id: string;
  bu4Name: string;
  bu5Id: string;
  bu5Name: string;
  positionId: string;
  positionName: string;
  jobId: string;
  jobName: string;
  startDate: string;
  empTypeName: string;
  email: string;
  empGroupId: string;
  time0Id: string;
  time0Name: string;
  workareaId: string;
  workareaName: string;
  dlidl: string;
  mobile: string;
  costcenterId: string;
  costcenterName: string;
  tel: string;
}

export interface EmpShiftItem {
  dateId: string;
  shift: string;
  planIn: string;
  planOut: string;
  docNo: string;
  docType: string;
  docTypeName: string;
  eventId: string;
  eventName: string;
}

