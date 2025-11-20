import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgbDatepickerModule, NgbModal, NgbModalRef, NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { ConfirmModalComponent } from "src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component";
import { MessageModel, MyMessageModel } from "src/app/models/message.model";
import {
  MyWorkingsModel,
  WorkingsModel,
} from "src/app/models/workingmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { PrivateMessageService } from "src/app/services/private-message.service";
import { Subscription, forkJoin } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { CreateMessageComponent } from "../../shared-ui/modal-mix/myhr/create-message/create-message.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ThaiDatePipe } from "../../shared-ui/thaidate.pipe";
import { SafeHtmlPipe } from "../../../pipes/safe-html.pipe";

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule, FormsModule, NgbPaginationModule, ReactiveFormsModule, ThaiDatePipe, NgbTooltipModule, SafeHtmlPipe],
  selector: "app-private-message-outbox",
  templateUrl: "./private-message-outbox.component.html",
  styleUrls: ["./private-message-outbox.component.scss"],
})
export class PrivateMessageOutboxComponent implements OnInit {
  page = 1;
  pageSize = 10;
  loading = false;
  search = "";

  listAll: MyMessageModel[] = [];
  list: MyMessageModel[] = [];
  select?: MyMessageModel;

  // Compatibility getter for the template's `show` property
  get show(): string {
    return this.select?.messageId || '0';
  }
  set show(id: string) {
    this.select = this.list.find(m => m.messageId === id);
  }

  createMessageModal?: NgbModalRef;

  employeeListSubscription?: Subscription;
  employeeListLoading = false;
  employeeList: WorkingsModel[] = [];

  constructor(
    private privateMessageService: PrivateMessageService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    public translateService: TranslateService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.privateMessageSendbox();
    this.employeeListLoading = true;
    this.getEmployeeList();
  }

  ngOnDestroy(): void {
    this.employeeListSubscription?.unsubscribe();
  }

  getEmployeeList() {
    this.employeeListSubscription = this.employeeService
      .employeeWorkingsPage("0", "500")
      .pipe(
        switchMap((res: any) => {
          const req$ = Array.apply(null, Array(res["totalPages"])).map(
            (e, index) => {
              return this.employeeService.employeeWorkingsPage(
                index.toString(),
                res["size"].toString()
              );
            }
          );
          return forkJoin(req$).pipe(
            map((response: any) => {
              let data: any[] = [];
              response.forEach((x: any) => {
                data = data.concat(x.content);
              });
              return data;
            })
          );
        })
      )
      .subscribe(
        (response) => {
          this.employeeList = response.map(
            (x: any) => new MyWorkingsModel(x, this.translateService)
          );
          this.employeeListLoading = false;
          if (this.createMessageModal) {
            this.createMessageModal.componentInstance.employeeList =
              this.employeeList;
            this.createMessageModal.componentInstance.employeeListLoading =
              this.employeeListLoading;
          }
        },
        (error) => {
          this.openAlertModal(error.message);
        }
      );
  }

  goToCompose(message?: MyMessageModel) {
    this.createMessageModal = this.ngbModal.open(CreateMessageComponent, {
      centered: true,
      backdrop: "static",
      size: "lg",
    });
    this.createMessageModal.componentInstance.employeeList = this.employeeList;
    this.createMessageModal.componentInstance.employeeListLoading =
      this.employeeListLoading;
    if (message) {
      this.createMessageModal.componentInstance.employeeId =
        message.senderId.employeeId;
      this.createMessageModal.componentInstance.topic = message.topic;
      this.createMessageModal.componentInstance.privateMessage =
        message.privateMessage;
    }
    this.createMessageModal.result.then(
      (result) => {
        this.privateMessageSendbox();
        this.createMessageModal = undefined;
        this.cdr.markForCheck();
      },
      (reason) => {
        this.createMessageModal = undefined;
        this.cdr.markForCheck();
      }
    );
  }

  privateMessageSendbox() {
    this.loading = true;
    this.privateMessageService.privateMessageSendbox().then(
      (result) => {
        this.listAll = result.map(
          (e) => new MyMessageModel(e, this.translateService)
        );
        this.listAll.sort((a, b) => b.getDate().getTime() - a.getDate().getTime());
        this.list = this.listAll;
        this.loading = false;
        this.cdr.markForCheck();
      },
      (error) => {
        this.openAlertModal(error.message);
        this.loading = false;
      }
    );
  }

  delete() {
    const selectedItems = this.list.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      return;
    }

    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static",
    });
    modalRef.componentInstance.message =
      this.translateService.instant("Do you want to delete the selected messages?");
    modalRef.result.then(
      (result) => {
        const deletePromises = selectedItems.map((item) =>
          this.privateMessageService.privateMessageDelete({ messageId: item.messageId })
        );
        forkJoin(deletePromises).subscribe(
          () => {
            this.select = undefined;
            this.privateMessageSendbox();
          },
          (error) => {
            this.openAlertModal(error.message);
          }
        );
      },
      (reason) => {}
    );
  }

  searchData() {
    if (!this.search) {
      this.list = this.listAll;
      return;
    }
    const searchTerm = this.search.toLowerCase();
    this.list = this.listAll.filter(
      (x) =>
        x.topic.toLowerCase().includes(searchTerm) ||
        x.receiverId.getFullname().toLowerCase().includes(searchTerm)
    );
  }

  read(item: MyMessageModel) {
    // For outbox, we don't mark as read on the server, just display
    this.select = item;
  }

  selectAll(checked: boolean) {
    this.list.forEach((item) => (item.selected = checked));
  }

  hasSelectedItems(): boolean {
    return this.list.some((item) => item.selected);
  }

  windowWidth(width: number): boolean {
    return window.innerWidth >= width;
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: "static",
    });
    modalRef.componentInstance.message = message ? message : "";
    modalRef.result.then(
      (result) => {
        this.ngbModal.dismissAll();
      },
      (reason) => {
        this.ngbModal.dismissAll();
      }
    );
  }

  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == "th"
      ? th
        ? th
        : eng
        ? eng
        : ""
      : eng
      ? eng
      : th
      ? th
      : "";
  }
}
