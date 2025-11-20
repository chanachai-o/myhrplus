import { LeaveTime } from './leave-time.model';

/**
 * Workflow data model
 */
export interface WorkflowData {
  start_time?: string;
  completion_time?: string;
  wf_status?: string;
  companyId?: string;
  wf_id?: string;
  wf_ver?: string;
  doc_no?: string;
  initiator?: string;
  position_code?: string;
  screen_value?: LeaveTime;
  remark?: string;
  subject?: string;
  thaiSubject?: string;
  engSubject?: string;
}

