import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { NgbModal, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { WorkflowModel } from "src/app/models/workflowmodel.model";
import { workflowService } from "src/app/services/workflow.service";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbPaginationModule],
  selector: 'app-assigned-work',
  templateUrl: './assigned-work.component.html',
  styleUrls: ['./assigned-work.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssignedWorkComponent implements OnInit {
  @Output() firstGetShareboxPage = new EventEmitter<boolean>();
  @Output() sendDocNo = new EventEmitter<string>();
  @Input() docNo = ""
  subscription: Subscription[] = []
  @Input() workflowListAllLoading = true
  @Input() workflowListLoading = true
  @Output() sendWorkflowList = new EventEmitter<any>();
  @Input() workflowList: { checkbox: boolean, data: WorkflowModel }[] = []
  workflow?: WorkflowModel
  page = 1
  pageSize = 10
  @Output() sendCheckboxAll = new EventEmitter<boolean>();
  @Input() checkboxAll = false
  @ViewChild("workflowDataList") workflowDataList?: ElementRef
  @ViewChild("workflowDataShow") workflowDataShow?: ElementRef
  constructor(private workflowService: workflowService,
    public translateService: TranslateService,
    private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  getShareboxPage() {
    this.firstGetShareboxPage.emit(true)
  }

  changeDocNo(docNo: string) {
    this.docNo = docNo
    this.sendDocNo.emit(this.docNo)
  }

  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then(result => {
      this.ngbModal.dismissAll()
    }, reason => {
      this.ngbModal.dismissAll()
    })
  }

  scrollToTop(el: string) {
    if (el == "workflowDataList") {
      this.workflowDataList?.nativeElement.scroll({
        top: 0,
        left: 0
      })
    } else if (el == "workflowDataShow") {
      this.workflowDataShow?.nativeElement.scroll({
        top: 0,
        left: 0
      })
    }
  }

  convertDate(date: string): string {
    const temp = date.split(' ')[0]
    return temp.split('/')[1] + '/' + temp.split('/')[0] + '/' + temp.split('/')[2]
  }

  convertTime(date: string): string {
    const temp = date.split(' ')[1]
    return temp.split(':')[1] + ':' + temp.split(':')[2]
  }

  windowWidth(width: number): boolean {
    return window.innerWidth >= width
  }

  changeCheckboxAll(check: boolean) {
    this.checkboxAll = check
    this.workflowList = this.workflowList.map(x => {
      if (x.data.status == "0") {
        return { ...x, checkbox: check }
      }
      return x
    })
    this.sendCheckboxAll.emit(this.checkboxAll)
    this.sendWorkflowList.emit(this.workflowList)
  }

}
