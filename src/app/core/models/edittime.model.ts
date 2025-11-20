import { EditTimeContent } from "./edittime.content.model";
import { Sort } from "./sort.model"
import { PageAble } from "./pageable.model"

  export interface EditTime {
      content: EditTimeContent[];
      pageable: PageAble;
      totalPages: number;
      last: boolean;
      totalElements: number;
      number: number;
      sort: Sort;
      size: number;
      first: boolean;
      numberOfElements: number;
      empty: boolean;
  }


