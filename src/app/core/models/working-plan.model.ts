/**
 * Working plan model
 */
export interface WorkingPlan {
  dateId: string;
  timeCode: string;
  startDate: string;
  startTime: number;
  endDate: string;
  endTime: number;
  docNo: string;
  docType: string;
  eventgrp: {
    eventgrpId: string;
    tdesc: string;
    edesc: string;
  };
  hourD: number;
  lv: number;
  apot: number;
}

