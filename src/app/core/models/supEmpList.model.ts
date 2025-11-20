import { Content } from "./supEmp.model";
import { PageAble } from "./pageable.model";
import { Sort2 } from "./sort2.model";

export interface SupEmpList {
    content: Content[];
    pageable: PageAble;
    totalPages: number;
    totalElements: number;
    last: boolean;
    number: number;
    sort: Sort2;
    size: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}
