
import { Sort2 } from "./sort2.model";
import {PageAble} from "./pageable.model"
import { LeavestatEventContent } from "./leavestateventContent.model"


  export interface LeavestatEvent {
      content?: LeavestatEventContent[];
      pageable?: PageAble;
      totalPages?: number;
      totalElements?: number;
      last?: boolean;
      number?: number;
      sort?: Sort2;
      size?: number;
      numberOfElements?: number;
      first?: boolean;
      empty?: boolean;
  }

