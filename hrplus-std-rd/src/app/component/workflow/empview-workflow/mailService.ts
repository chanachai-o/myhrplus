import { Injectable } from '@angular/core';
import { mailboxList } from './mailbox-data';


@Injectable()
export class MailService {

    public getInbox() {
        return mailboxList.filter(mail => mail.mailbox === 'Inbox');
    }
    public getSentbox() {
        return mailboxList.filter(mail => mail.mailbox === 'Sentbox');
    }
    public getSharebox() {
        return mailboxList.filter(mail => mail.mailbox === 'Sharebox');
    }
    public getTransfer() {
        return mailboxList.filter(mail => mail.mailbox === 'Transfer');
    }
    public getDelete() {
        return mailboxList.filter(mail => mail.mailbox === 'Delete');
    }
}
