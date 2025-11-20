import { SupTimeEdit } from './suptimeedit.model';
import { Employee } from './employee.model';

export interface SupTimeEditDialog {
    time: SupTimeEdit;
    empList: Employee[];
}