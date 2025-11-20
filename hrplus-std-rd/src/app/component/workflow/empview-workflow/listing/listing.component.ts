import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Category, mailbox, filter, label } from './categories';
import { MailGlobalVariable } from '../mail.service';
import { MailService } from '../mailService';
import { getUser } from '../user-data';
import { mailboxList } from '../mailbox-data';
import { Mailbox } from '../mailbox';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { workflowService } from 'src/app/services/workflow.service';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { InboxModel } from 'src/app/models/workflow.model';

@Component({
    selector: 'app-listing',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NgbModule
    ],
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {



    mailboxes: Category[] = mailbox;
    filters: Category[] = filter;
    labels: Category[] = label;
    public showSidebar = false;





















    test:any = [];
    menu = [
      {
        value: 'Personal',
        No: '1'
      },
      {
        value: 'Time Attendance',
        No: '2'
      },
      {
        value: 'Training',
        No: '3'
      },
      {
        value: 'Recruitment',
        No: '4'
      },
      {
        value: 'Welfare',
        No: '5'
      },
      {
        value: 'แบบฟอร์มยกเลิกเอกสาร',
        No: '6'
      },
      {
        value: 'แบบฟอร์มเอกสารจัดเวร',
        No: '7'
      },
    ];

    personal = [
      {
        value: 'ใบขอหนังสือรับรอง',
        pic: 'insert_drive_file',
        link: 'certificate-component'
      },
      {
        value: 'ใบปรับปรุงข้อมูลพนักงาน',
        pic: 'person_pin',
        link: 'empedit-component'
      },
      {
        value: 'ใบปรับปรุงข้อมูลพนักงานโดยหัวหน้า',
        pic: 'person_add',
        link: 'empedit-sup-component'
      },
    ];

    time = [
      {
        value: 'ใบขอลาหยุดงาน',
        pic: 'airline_seat_individual_suite',
        link: 'leave-container'
      },
      {
        value: 'ใบขอลาหยุดงานโดยหัวหน้า',
        pic: 'people_outline',
        link: 'cscwf001-hr-container'
      },
      {
        value: 'ใบขอลาหยุดงานโดย Center',
        pic: 'business_center',
        link: 'cscwf001-center-container'
      },
      {
        value: 'ใบแก้ไขบันทึกการทำงาน',
        pic: 'library_books',
        link: 'time-edit'
      },
      {
        value: 'ใบแก้ไขบันทึกการทำงานโดยหัวหน้า',
        pic: 'person-booth',
        link: 'time-edit-sup'
      },
      {
        value: 'ใบแก้ไขบันทึกการทำงานโดย Center',
        pic: 'assignment_ind',
        link: 'time-edit-center'
      },
      {
        value: 'ใบขอเปลี่ยนกะการทำงาน',
        pic: 'swap_horiz',
        link: 'swap-component'
      },
      {
        value: 'ใบขอแลกกะการทำงานกับผู้อื่น',
        pic: 'sync',
        link: 'swap-other-component'
      },
      {
        value: 'ใบขอทำงานล่วงเวลา',
        pic: 'timelapse',
        link: 'ot-container'
      },
      {
        value: 'ใบขอทำงานล่วงเวลาโดยหัวหน้า',
        pic: 'supervised_user_circle',
        link: 'ot-sup-component'
      },
      {
        value: 'ใบขอทำงานล่วงเวลาโดย Center',
        pic: 'record_voice_over',
        link: 'ot-center-component'
      },
      {
        value: 'ใบขออนุมัติทำงานล่วงเวลาโดย Center',
        pic: 'dock',
        link: 'otapprove-center-component'
      },
    ];

    training = [
      {
        value: 'ใบขออนุมัติฝึกอบรมและสัมมนาภายนอก',
        pic: 'all_out',
        link: 'trainout-approve-component'
      },
      {
        value: 'ใบขออนุมัติฝึกอบรมและสัมมนาภายใน',
        pic: 'settings_input_svideo',
        link: 'trainin-approve-component'
      },
    ];

    recruit = [
      {
        value: 'ใบขออัตรากำลัง',
        pic: 'group_add',
        link: 'recruit-request-component'
      },
    ];

    welfare = [
      {
        value: 'ใบขอเปลี่ยนแปลงอัตราเงินสะสม',
        pic: 'money',
        link: 'cost-component'
      },
      {
        value: 'Advance Clearance',
        pic: 'people_outline',
        link: 'advance-clearance-component'
      },
      {
        value: 'แบบฟอร์มกการเบิกค่ารักษาพยาบาลและเงินช่วยเหลือสวัสดิการ',
        pic: 'local_hospital',
        link: 'hospital-welfare-component'
      },
      {
        value: 'ใบขอเบิกสวัสดิการรักษาพยาบาล',
        pic: 'healing',
        link: 'hospital-component'
      },
    ];

    calcelDoc = [
      {
        value: 'ใบยกเลิกเอกสาร (สำหรับพนักงาน)',
        pic: 'clear',
        link: 'caancel-component'
      },
    ];

    shiftDoc = [
      {
        value: 'ใบขอเปิดแลกเวรการทำงาน',
        pic: 'sync',
        link: 'shift-swap-component'
      },
      {
        value: 'ใบขอแลกเวรการทำงาน',
        pic: 'exchange-alt',
        link: 'leave-component'
      },
    ];
    requireWF2: StatisticWF2[] | undefined;
    showList:InboxModel[] = [];
    inboxList:InboxModel[] = [];
    inboxListLangth = 0;
    outboxList:InboxModel[] = [];
    outboxListLangth = 0;
    page = 1;
    pageSize = 10;
    collectionSize = 0;
    loadingIn = false;
    loadingOut = false;
    selectedWF:InboxModel | undefined;


    constructor(public ms: MailGlobalVariable,
        public mailService: MailService,
        public router: Router,
        public modal: NgbModal,
        private workflowService: workflowService,
        private cdr: ChangeDetectorRef) {
        this.test.push(this.menu, this.personal, this.time, this.training, this.training, this.recruit,this.welfare, this.calcelDoc, this.shiftDoc);
        this.requireWFApi2();
        this.getInboxList();
        this.getOutboxList();


        if (this.ms.type === null || this.ms.type === '' || this.ms.type === undefined) {
            this.router.navigate(['component/workflow/inbox']);
        }
        this.ms.type = 'inbox';
    }

    requireWFApi2() {
      this.workflowService.requireWF().subscribe((result) => {
        this.requireWF2 = result.statistic!.statistic;
        this.cdr.markForCheck();
      });
    }
    getInboxList(){
        this.loadingIn = true;
        this.workflowService
          .getInboxList(this.page-1, '')
          .subscribe((result) => {
            result.content.forEach((result:any) => {
              this.inboxList.push(result);
              this.collectionSize = this.inboxList.length;
              this.cdr.markForCheck();
            });
          } , err=>{} , () =>{
            this.showList = this.inboxList;
            this.inboxList.forEach((result:any) => {if(result.status.indexOf('0')!=-1){
                this.inboxListLangth = this.inboxListLangth +1;
            }});
            this.loadingIn = false;
          });
      }
      getOutboxList(){
        this.loadingOut = true;
        this.workflowService
          .getOutboxList(this.page-1, '')
          .subscribe((result) => {
            result.content.forEach((result:any) => {
              this.outboxList.push(result);
              this.collectionSize = this.outboxList.length;
              this.cdr.markForCheck();
            });
          } , err=>{} , () =>{
            this.outboxList.forEach((result:any) => {if(result.status.indexOf('0')!=-1){
                this.outboxListLangth = this.outboxListLangth +1;
            }});
            this.loadingOut = false;
          });
      }

      thisInbox(){
        this.showList = this.inboxList;
        this.page = 1;
        this.collectionSize = this.inboxList.length;
      }
      thisOutbox(){
        this.showList = this.outboxList;
        this.page = 1;
        this.collectionSize = this.outboxList.length;
      }
















    ngOnInit(): void {

        this.ms.mailList = this.mailService.getInbox();
        this.ms.collectionSize = this.ms.mailList.length;

        for (const mail of this.mailService.getInbox()) {
            // tslint:disable-next-line: no-non-null-assertion
            this.ms.users!.push!(getUser!(mail.fromId)!);
        }
        this.ms.topLable = 'Inbox';
        this.global();
    }

    global() {

        this.ms.inboxCount = this.mailService.getInbox().
        filter(inbox => inbox.mailbox === 'Inbox' && inbox.seen === false).length;
        this.ms.spamCount = this.mailService.getTransfer().length;
        this.ms.draftCount = this.mailService.getSharebox().length;
    }

    mailboxesChanged(type: string) {

        if (type === 'Inbox') {
            this.thisInbox();
            this.ms.mailList = this.mailService.getInbox();
            this.ms.collectionSize = this.mailService.getInbox().length;
            this.changeCaterories(type);
            this.ms.type = 'inbox';
            this.router.navigate(['component/workflow/inbox']);
        } else if (type === 'Sentbox') {
            this.thisOutbox();
            this.ms.mailList = this.mailService.getSentbox();
            this.ms.collectionSize = this.mailService.getSentbox().length;
            this.changeCaterories(type);
            this.ms.type = 'sentbox';
            this.router.navigate(['component/workflow/sentbox']);
        } else if (type === 'Sharebox') {
            this.ms.mailList = this.mailService.getSharebox();
            this.ms.collectionSize = this.mailService.getSharebox().length;
            this.changeCaterories(type);
            this.ms.type = 'sharebox';
            this.router.navigate(['component/workflow/sharebox']);
        } else if (type === 'Transfer') {
            this.ms.mailList = this.mailService.getTransfer();
            this.ms.collectionSize = this.mailService.getTransfer().length;
            this.changeCaterories(type);
            this.ms.type = 'transfer';
            this.router.navigate(['component/workflow/transfer']);
        } else if (type === 'Delete') {
            this.ms.mailList = this.mailService.getDelete();
            this.ms.collectionSize = this.mailService.getDelete().length;
            this.changeCaterories(type);
            this.ms.type = 'delete';
            this.router.navigate(['component/workflow/delete']);
        }

    }

    changeCaterories(category: string) {

        this.ms.users = [];
        for (const mail of this.ms.mailList) {
            // tslint:disable-next-line: no-non-null-assertion
            this.ms.users.push(getUser(mail.fromId)!);
        }
        this.ms.selectedMail = null;
        this.ms.topLable = category;
    }

    mailSelected(item: InboxModel) {
        this.selectedWF = undefined;
        this.selectedWF = item;
        // this.ms.selectedMail.seen = true;
        // mail.seen = true;
        // this.ms.addClass = true;
        // // tslint:disable-next-line: no-non-null-assertion
        // this.ms.selectedUser = getUser(mail.fromId)!;

        // this.global();

        // if (this.ms.type === 'inbox') {
        //     this.router.navigate(['component/workflow/inbox', mail.MailId]);
        // }

        // if (this.ms.type === 'sentbox') {
        //     this.router.navigate(['component/workflow/sentbox', mail.MailId]);
        // }

        // if (this.ms.type === 'sharebox') {
        //     this.router.navigate(['component/workflow/sharebox', mail.MailId]);
        // }

        // if (this.ms.type === 'transfer') {
        //     this.router.navigate(['component/workflow/transfer', mail.MailId]);
        // }

        // if (this.ms.type === 'delete') {
        //     this.router.navigate(['component/workflow/delete', mail.MailId]);
        // }

        // if (this.ms.type === 'star') {
        //     this.router.navigate(['component/workflow/star', mail.MailId]);
        // }

        // if (this.ms.type === 'important') {
        //     this.router.navigate(['component/workflow/important', mail.MailId]);
        // }

        // if (this.ms.type === 'Personal') {
        //     this.router.navigate(['component/workflow/personal', mail.MailId]);
        // }

        // if (this.ms.type === 'Work') {
        //     this.router.navigate(['component/workflow/work', mail.MailId]);
        // }

        // if (this.ms.type === 'Payment') {
        //     this.router.navigate(['component/workflow/payment', mail.MailId]);
        // }

        // if (this.ms.type === 'Invoice') {
        //     this.router.navigate(['component/workflow/invoice', mail.MailId]);
        // }

        // if (this.ms.type === 'Account') {
        //     this.router.navigate(['component/workflow/account', mail.MailId]);
        // }
    }

    filtersClick(type: string) {

        if (type === 'Star') {
            this.filterss(type);
            this.ms.type = 'star';
            this.router.navigate(['component/workflow/star']);
        } else if (type === 'Important') {
            this.filterss(type);
            this.ms.type = 'important';
            this.router.navigate(['component/workflow/important']);
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    filterss(filter: string) {

        this.ms.mailList = [];
        for (const mail of mailboxList) {
            for (const fil of mail.filter) {
                if (fil === filter) {
                    this.ms.mailList.push(mail);
                }
            }
        }
        this.ms.users = [];
        for (const mail of this.ms.mailList) {
            // tslint:disable-next-line: no-non-null-assertion
            this.ms.users.push(getUser(mail.fromId)!);
        }
        this.ms.collectionSize = this.ms.mailList.length;
        this.ms.topLable = filter;
        this.ms.selectedMail = null;
    }



    labelChange(type: string) {

        if (type === 'Personal') {
            this.labelss(type);
            this.router.navigate(['component/workflow/personal']);
        } else if (type === 'Work') {
            this.labelss(type);
            this.router.navigate(['component/workflow/work']);
        } else if (type === 'Payment') {
            this.labelss(type);
            this.router.navigate(['component/workflow/payments']);
        } else if (type === 'Account') {
            this.labelss(type);
            this.router.navigate(['component/workflow/accounts']);
        } else if (type === 'Invoice') {
            this.labelss(type);
            this.router.navigate(['component/workflow/invoices']);
        } else if (type === 'Forum') {
            this.labelss(type);
            this.router.navigate(['component/workflow/forum']);
        }
    }

    labelss(type: string) {

        this.ms.mailList = [];
        for (const mail of mailboxList) {
            // tslint:disable-next-line: no-shadowed-variable
            for (const label of mail.label) {
                if (label === type) {
                    this.ms.mailList.push(mail);
                }
            }
        }
        this.ms.users = [];
        for (const mail of this.ms.mailList) {
            // tslint:disable-next-line: no-non-null-assertion
            this.ms.users.push(getUser(mail.fromId)!);
        }
        this.ms.collectionSize = this.ms.mailList.length;
        this.ms.selectedMail = null;
        this.ms.topLable = type;
        this.ms.type = type;

    }


    openModal(content: string) {
        this.modal.open(content, { centered: true,windowClass: 'dialog-width'   });
    }

    mobileSidebar() {
        this.showSidebar = !this.showSidebar;
    }

}
