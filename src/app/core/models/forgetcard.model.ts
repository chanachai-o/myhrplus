import { PageAble } from "./pageable.model";
import {ContentForgetCard} from "./contentforgetcard.model"

  export interface ForgetCard {
      content: ContentForgetCard[];
      empty: boolean;
      first: boolean;
      last: boolean;
      number: number;
      numberOfElements: number;
      pageable?: PageAble;
      size: number;
      totalElements?: number;
      totalPages: number;
  }



