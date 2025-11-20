export interface SupTimeEdit {
    lineno: number;
    empId: string;
    empname: string;
    forgetdate: string;
    forgettime: string;
    forgettype: string;
    completed: boolean;
    reasonId?: string;
    reason?: string;
}