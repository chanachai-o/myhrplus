import { BaseModel, TranslateService } from './base.model';
import { Employee, MyEmployee } from './employee.model';

/**
 * Message model
 */
export interface MessageModel {
  messageId: string;
  flag: number;
  topic: string;
  privateMessage: string;
  receiveDate: string;
  receiveTime: string;
  senderId: Employee;
  receiverId: Employee;
}

export class MyMessageModel extends BaseModel implements MessageModel {
  messageId: string;
  flag: number;
  topic: string;
  privateMessage: string;
  receiveDate: string;
  receiveTime: string;
  senderId: Employee;
  receiverId: Employee;
  selected: boolean = false; // For UI selection state

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.messageId = data.messageId || '';
    this.flag = data.flag || 0;
    this.topic = data.topic || '';
    this.privateMessage = data.privateMessage || '';
    this.receiveDate = data.receiveDate || '';
    this.receiveTime = data.receiveTime || '';
    this.senderId = data.senderId
      ? new MyEmployee(data.senderId, translateService)
      : {} as Employee;
    this.receiverId = data.receiverId
      ? new MyEmployee(data.receiverId, translateService)
      : {} as Employee;
  }

  /** Combines receiveDate and receiveTime into a single Date object for sorting. */
  getDate(): Date {
    if (this.receiveDate && this.receiveTime) {
      return new Date(`${this.receiveDate}T${this.receiveTime}`);
    }
    // Return a default old date if properties are missing
    return new Date(0);
  }
}

