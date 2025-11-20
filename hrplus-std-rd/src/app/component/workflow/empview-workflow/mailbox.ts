export class Mailbox {

    constructor(
        public MailId: string,
        public fromId: string,
        public workflowId: string,
        public Subject: string,
        public Message: string,
        public date: Date,
        public readStatus: boolean,
        public seen: boolean,
        public workflowStatus: string,
        public mailbox: string,
        public filter: string[],
        public label: string[]
    ) { }
}




