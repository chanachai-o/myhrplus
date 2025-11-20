import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface ShiftplanModel {
  employeeId: string;
  fullName: string;
  positionId: string;
  positionName: string;
  mobile: string;
  listShiftPlanning: ListShiftPlanningModel[];
}
export class MyShiftplanModel extends BaseModel implements ShiftplanModel {
  employeeId: string;
  fullName: string;
  positionId: string;
  positionName: string;
  mobile: string;
  listShiftPlanning: ListShiftPlanningModel[];
  constructor(data: Partial<ShiftplanModel>, translateService: TranslateService) {
    super(data, translateService);
    this.employeeId = data.employeeId!
    this.fullName = data.fullName!
    this.positionId = data.positionId!
    this.positionName = data.positionName!
    this.mobile = data.mobile!
    this.listShiftPlanning = data.listShiftPlanning!
  }
}

export interface ListShiftPlanningModel {
  employeeId: string;
  dateId: string;
  shiftId: string;
  shiftPositionId: string;
  shiftPositionName: string;
  costCenterId: string;
  shiftIn: number;
  shiftOut: number;
  shiftType: string;
  isNightHoliday: boolean;
  isExchange: boolean;
  exchangeType: number;
}

export interface ListExchangeShiftPlanningModel {
  exchangeId: string;
  employeeId: string;
  fullName: string;
  dateId: string;
  shiftType: string;
  shiftId: string;
  remark: string;
  shiftIn: number;
  shiftOut: number;
  exchangeType: number;
}
export class MyListExchangeShiftPlanningModel extends BaseModel implements ListExchangeShiftPlanningModel {
  exchangeId: string;
  employeeId: string;
  fullName: string;
  dateId: string;
  shiftType: string;
  shiftId: string;
  remark: string;
  shiftIn: number;
  shiftOut: number;
  exchangeType: number;
  constructor(data: Partial<ListExchangeShiftPlanningModel>, translateService: TranslateService) {
    super(data, translateService);
    this.exchangeId = data.exchangeId!
    this.employeeId = data.employeeId!
    this.fullName = data.fullName!
    this.dateId = data.dateId!
    this.shiftType = data.shiftType!
    this.shiftId = data.shiftId!
    this.remark = data.remark!
    this.shiftIn = data.shiftIn!
    this.shiftOut = data.shiftOut!
    this.exchangeType = data.exchangeType!
  }
}