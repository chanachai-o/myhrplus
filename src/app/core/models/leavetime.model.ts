export interface LeaveTime {
    lineno: number;
    startdate: string;
    enddate: string;
    starttime: string;
    endtime: string;
    completed: boolean;
    totalTime: string;
    reasonId?: string;
    reason?: string;
}