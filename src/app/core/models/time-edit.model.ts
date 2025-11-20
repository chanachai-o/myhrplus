/**
 * Time edit model
 */
export interface TimeEdit {
  lineno: number;
  forgetdate: string;
  forgettime: string;
  forgettype: string;
  completed: boolean;
  reasonId?: string;
  reason?: string;
}

