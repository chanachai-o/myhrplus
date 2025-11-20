import { Bu1 } from './bu1.model';
import { Bu2 } from './bu2.model';
import { Bu3 } from './bu3.model';
import { Bu4 } from './bu4.model';
import { Bu5 } from './bu5.model';
import { WorkArea } from './workarea.model';
import { Position } from './position.model';
import { Job } from './job.model';
import { Type } from './type.model';
import { Group } from './group.model';
import { Costcenter } from './costcenter.model';
import { Time0 } from "./time0.model";
import { Branch } from "./branch.model";
import { Status } from './status.model';

export interface Content {
    employeeId: string;
    fname: string;
    lname: string;
    efname: string;
    elname: string;
    bu1: Bu1;
    bu2: Bu2;
    bu3: Bu3;
    bu4: Bu4;
    bu5: Bu5;
    workarea: WorkArea;
    position: Position;
    job: Job;
    type: Type;
    group: Group;
    costcenter: Costcenter;
    bossId: string;
    time0: Time0;
    branch: Branch;
    telExt: string;
    status: Status;
    startDate: string;
}