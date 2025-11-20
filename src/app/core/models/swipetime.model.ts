import { SwipeCard } from "./swipecard.model";
import { PageAble } from "./pageable.model";
import { Sort } from "./sort.model";

export interface SwipeTime {
    swipeCard: SwipeCard[];
    pageable: PageAble;
    totalPages: number;
    last: boolean;
    totalElements: number;
    number: number;
    sort: Sort;
    size: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}