import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Category, mailbox, filter, label } from 'src/app/component/workflow/empview-workflow/listing/categories';
import { MailGlobalVariable } from 'src/app/component/workflow/empview-workflow/mail.service';
import { MailService } from 'src/app/component/workflow/empview-workflow/mailService';
import { getUser } from 'src/app/component/workflow/empview-workflow/user-data';
import { mailboxList } from 'src/app/component/workflow/empview-workflow/mailbox-data';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { workflowService } from 'src/app/services/workflow.service';
import { StatisticWF2 } from 'src/app/models/statisticWF2.model';
import { InboxModel } from 'src/app/models/workflow.model';
import { WorkflowMenuModel } from 'src/app/models/workflowmenu.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule],
    selector: 'app-admin-delete',
    templateUrl: './admin-delete.component.html',
    styleUrls: ['./admin-delete.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .myhrcolor-1 .tooltip-inner {
      background-color: #FFF;
      color: #2962ff;
      font-weight: 400;
      border-style: solid;
      border-color: #2962ff;
      border-width: 1px;
    }
    .myhrcolor-1 .arrow::before {
      border-top-color: #2962ff;
    }
    .myhrcolor-2 .tooltip-inner {
      background-color: #FFF;
      color: #36bea6;
      font-weight: 400;
      border-style: solid;
      border-color: #36bea6;
      border-width: 1px;
    }
    .myhrcolor-2 .arrow::before {
      border-top-color: #36bea6;
    }
    .myhrcolor-3 .tooltip-inner {
      background-color: #FFF;
      color: #f62d51;
      font-weight: 400;
      border-style: solid;
      border-color: #f62d51;
      border-width: 1px;
    }
    .myhrcolor-3 .arrow::before {
      border-top-color: #f62d51;
    }
    .myhrcolor-4 .tooltip-inner {
      background-color: #FFF;
      color: #ffbc34;
      font-weight: 400;
      border-style: solid;
      border-color: #ffbc34;
      border-width: 1px;
    }
    .myhrcolor-4 .arrow::before {
      border-top-color: #ffbc34;
    }
    .myhrcolor-date .tooltip-inner {
      background-color: #FFF;
      color: #a1aab2;
      font-weight: 400;
      border-style: solid;
      border-color: #a1aab2;
      border-width: 1px;
    }
    .myhrcolor-date .arrow::before {
      border-top-color: #a1aab2;
    }
  `]
})
export class AdminDeleteComponent implements OnInit {
    baseUrl = environment.rootUrl;
    
    active = 1;
    activeKeep = 1;
    activeSelected = 1;
  
    isButtonVisible = true;
  
    mailboxes: Category[] = mailbox;
    filters: Category[] = filter;
    labels: Category[] = label;
    public showSidebar = false;
  
    selectedIteMail: any
    requireWF2: StatisticWF2[] | undefined;
    showList: InboxModel[] = [];
    showListDate: string[] = [];
    showListTime: string[] = [];
    inboxList: InboxModel[] = [];
    inboxListLangth = 0;
    page = 1;
    pageSize = 10;
    countPage = 0;
    collectionSize = 0;
    loadingIn = false;
    loadingOut = false;
    selectedWF: InboxModel | undefined;
  
    docSearch = ""
    textSearch: string = "";
  
  
    lastPage = false;
    loop = 0;
    constructor(public ms: MailGlobalVariable,
      public mailService: MailService,
      public router: Router,
      public modal: NgbModal,
      private workflowService: workflowService,
      private cdr: ChangeDetectorRef,
      private translateService: TranslateService) {
  
      this.requireWFApi2();
      this.loadData();
      this.ms.type = 'inbox';
    }
    workflowMenu: WorkflowMenuModel[] | undefined
    workflowMenuList: [[string]] = [['']];
  
    private async loadData() {
      this.page = 1
      this.selectedWF = undefined
      this.inboxList = [];
      this.loop = 0;
      this.countPage = 0;
      this.lastPage = false;
      this.loadingIn = true;
      do {
        this.loop++;
        await this.getData();
      } while (!this.lastPage && this.loop <= 2);
      this.countPage = 0;
      this.collectionSize = this.inboxList.length;
      this.loadingIn = false;
    }

  
  
    listClick(event: any, newValue: any) {
      this.selectedIteMail = newValue;
    }
  
    newInbox(event: any) {
      this.loadData();
    }
    reply() {
      this.ms.replyShow = true;
    }
  
    sendButtonClick() {
      this.ms.replyShow = false;
    }
  
    removeClass() {
      this.ms.addClass = false;
    }
    requireWFApi2() {
      this.workflowService.requireWF().subscribe((result) => {
        this.requireWF2 = result.statistic!.statistic;
        this.cdr.markForCheck();
      });
    }
  
    async getData() {
      await this.workflowService.getInboxListByPage(this.countPage, this.textSearch).then((result: any) => {
        this.countPage = result['number'] + 1;
        this.inboxList = this.inboxList.concat(result['content']);
  
        this.lastPage = result['last'];
        this.loop = 0;
        this.showList = this.inboxList
  
        this.collectionSize = this.inboxList.length;
        this.loadingIn = false;
        this.cdr.markForCheck();
      }).catch((reason) => {
        this.lastPage = true;
      });
    }
  
    convertDate(date: string) {
      let temp = date.split(' ')[0]
      return temp.split('/')[1] + '/' + temp.split('/')[0] + '/' + temp.split('/')[2]
    }
  
    convertTime(date: string) {
      let temp = date.split(' ')[1]
      return temp.split(':')[1] + ':' + temp.split(':')[2]
    }
  

    thisInbox() {
      this.showList = this.inboxList;
      this.page = 1;
      this.collectionSize = this.inboxList.length;
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
      this.ms.addClass = true;
    }
  
    filtersClick(type: string) {
  
      if (type === 'Star') {
        this.filterss(type);
        this.ms.type = 'star';
        this.router.navigate(['component/empview-workflow/star']);
      } else if (type === 'Important') {
        this.filterss(type);
        this.ms.type = 'important';
        this.router.navigate(['component/empview-workflow/important']);
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
        this.router.navigate(['component/empview-workflow/personal']);
      } else if (type === 'Work') {
        this.labelss(type);
        this.router.navigate(['component/empview-workflow/work']);
      } else if (type === 'Payment') {
        this.labelss(type);
        this.router.navigate(['component/empview-workflow/payments']);
      } else if (type === 'Account') {
        this.labelss(type);
        this.router.navigate(['component/empview-workflow/accounts']);
      } else if (type === 'Invoice') {
        this.labelss(type);
        this.router.navigate(['component/empview-workflow/invoices']);
      } else if (type === 'Forum') {
        this.labelss(type);
        this.router.navigate(['component/empview-workflow/forum']);
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
  
    searchDoc() {
      this.showList = this.inboxList.filter((x: any) => (x.docNo.toLowerCase().indexOf(this.docSearch.toLowerCase()) !== -1))
      this.collectionSize = this.showList.length
      this.page = 1
    }
  
    searchApi() {
      this.page = 1;
      this.textSearch = '&textSearch=' + this.docSearch;
      this.loadData();
    }
  
  
    openModal(content: string) {
      this.modal.open(content, { centered: true, size: 'lg' });
    }
  
    mobileSidebar() {
      this.showSidebar = !this.showSidebar;
    }
  
  }