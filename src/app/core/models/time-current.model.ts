import { Eventgrp } from './eventgrp.model';

/**
 * Time current model - represents time attendance record for a day
 */
export interface TimeCurrent {
  machineNo?: string;
  employeeid?: string;
  dateid?: string;
  sequence?: string;
  c_tm_bg?: number;  // Clock time begin
  c_tm_en?: number;  // Clock time end
  m_tm_bg?: number;  // Machine time begin
  m_tm_en?: number;  // Machine time end
  c_dt_bg?: string;  // Clock date begin
  c_dt_en?: string;  // Clock date end
  m_dt_bg?: string;  // Machine date begin
  m_dt_en?: string;  // Machine date end
  lt?: number;       // Late time
  c_lv?: number;     // Clock leave
  m_lv?: number;     // Machine leave
  tr_type?: string; // Transaction type
  ac_ot?: number;    // Actual OT
  ap_ot?: number;    // Approved OT
  iswork?: number;   // Is work day
  doctype?: string; // Document type
  dt_in_inzone?: string;
  dt_out_inzone?: string;
  tm_in_inzone?: number;
  tm_out_inzone?: number;
  dt_in_outzone?: string;
  dt_out_outzone?: string;
  tm_in_outzone?: number;
  tm_out_outzone?: number;
  ot1?: number;      // OT type 1
  ot5?: number;     // OT type 5
  ot2?: number;     // OT type 2
  ot3?: number;     // OT type 3
  eventgrp?: Eventgrp;    // Event group
  unused1?: number;
  unused2?: number;
  unused3?: number;
  unused4?: number;
  unused5?: number;
  unused6?: number;
  unused7?: number;
  unused8?: number;
  unused9?: number;
  unused10?: number;
  salatype?: string;
  currency?: string;
  exchange?: number;
  salary?: string;
  hour_d?: number;
  every?: string;
  dt_breakin?: string;
  tm_breakin?: number;
  dt_breakout?: string;
  tm_breakout?: number;
  emp_level?: string;
  bossid?: string;
  daytype?: string;
  hour_s?: number;
  date_actual?: string;
  o_tm_bg?: number;
  o_tm_en?: number;
  o_dt_bg?: string;
  o_dt_en?: string;
  ot_before?: number;
  ot_after?: number;
  sh_tm_bg?: number;
  sh_tm_en?: number;
  sh_dt_bg?: string;
  sh_dt_en?: string;
  runno?: number;
  prused1?: number;
  prused2?: number;
  prused3?: number;
  prused4?: number;
  prused5?: number;
  pl?: string;
  bk_ot_dt_in?: string;
  bk_ot_dt_out?: string;
  bk_ot_tm_in?: number;
  bk_ot_tm_out?: number;
  lv_ty?: string;
  forget_in?: string;
  forget_out?: string;
  previousshift?: string;
  nextshift?: string;
  warn00?: string;
  warn01?: string;
  source_in?: string;
  source_out?: string;
  warn11?: string;
  warn02?: string;
  warn03?: string;
  warn04?: string;
  warn05?: string;
  warn06?: string;
  warn07?: string;
  [key: string]: any; // Allow additional properties
}

