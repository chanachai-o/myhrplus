import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MySendTo, SendTo } from 'src/app/models/sendto.model';
import { workflowService } from 'src/app/services/workflow.service';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { WorkflowEmployeeModalComponent } from '../workflow-employee-modal/workflow-employee-modal.component';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyWorkflowDefinitionModel } from 'src/app/models/workflowdefinition.model';
import { MyWorkflowMenuModel, WorkflowChildModel, WorkflowMenuModel } from 'src/app/models/workflowmenu.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    WorkflowEmployeeModalComponent
  ],
  selector: 'app-workflow-sendto',
  templateUrl: './workflow-sendto.component.html',
  styleUrls: ['./workflow-sendto.component.scss']
})
export class WorkflowSendtoComponent implements OnInit {
  @Input() wfid: string = "";
  @Input() cardName: string = "";
  @Input() subjectName: string = "";
  @Input() cardNameTh: string = "";
  @Input() cardNameEng: string = "";
  sendto: SendTo[] = []
  ccList: SendTo[] = []
  employeeModal?: NgbModalRef
  employeeList: MyWorkingsModel[] = []
  employeeListLoading = true
  employeeCCNameTh = ""
  employeeCCNameEng = ""
  sentToName = ""
  ccName = ""
  @Output() employeeCCId = new EventEmitter<string>();
  employeeCC: string[] = []
  @Input() menuPage: string = "";
  workflowMenuList: WorkflowMenuModel[] = [] = [];
  @Input() subjectNameTh: string = "";
  @Input() subjectNameEng: string = "";
  constructor(private wfs: workflowService,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getEmpAll()
    this.subjectName = this.subjectName ? this.subjectName : (this.cardName ? this.cardName : '')
    if(this.menuPage!) {
      this.wfs.getWorkflowMenu().pipe(map(x => x.map(y => new MyWorkflowMenuModel(y, this.translateService)))).subscribe(response => {
        for(let items of response) {
          if(items.child!) {
            this.getMenuDesc(items.child);
            if(this.cardNameTh! || this.cardNameEng!) {
              this.subjectName = this.getMessageTranslate(this.cardNameTh, this.cardNameEng)!?this.getMessageTranslate(this.cardNameTh, this.cardNameEng):this.cardName
              this.cardName = ''
              break;
            }
          }
        }
      })
    }
    if(this.wfid!) {
      this.wfs.getWorkflowDefinitionLists().pipe(map(x => x.map(y => new MyWorkflowDefinitionModel(y, this.translateService)))).subscribe(response => {
        let wfDefModel = response.filter(x => x.wfId==Number(this.wfid!))
        this.subjectNameTh = wfDefModel[0].tname!?wfDefModel[0].tname:wfDefModel[0].tdesc!?wfDefModel[0].tdesc:this.cardNameTh
        this.subjectNameEng = wfDefModel[0].ename!?wfDefModel[0].ename:wfDefModel[0].edesc!?wfDefModel[0].edesc:this.cardNameEng
        if(this.subjectNameTh! || this.subjectNameEng!) {
          this.subjectName = ''
        }
      })
    }
    this.wfs.sendtoWF(this.wfid).subscribe(result => {
      if (result.sendTo) {
        if (result.sendTo.length > 0) {
          this.sendto = result.sendTo.map(e => new MySendTo(e, this.translateService))
          this.sendto.forEach((e, i) => {
            this.sentToName += e.getFullname()
            if (i != (this.sendto?.length - 1)) {
              this.sentToName += " , "
            }
          })
        } else {
          this.sentToName = ""
        }
      }
      if (result.cc) {
        if (result.cc.length > 0) {
          this.ccList = result.cc.map(e => new MySendTo(e, this.translateService))
          this.ccList.forEach((e: any, i) => {
            const prefix = e.prefix
            this.ccName += this.translateText(prefix?.tdesc, prefix?.edesc) + e.getFullname().replace('  ',' ').replace(' ','  ')
            if (i != (this.ccList?.length - 1)) {
              this.ccName += " , "
            }
          })
          this.employeeCC = this.ccList.map((x: any) => x.employeeId)
          this.employeeCCId.emit(this.ccList.map((x: any) => {
            // const prefix = x.prefix
            // return this.translateText(prefix?.tdesc, prefix?.edesc) + x.getFullname().replace('  ',' ').replace(' ','  ')
            return  x.employeeId
          }).join(","))
        } else {
          this.ccName = ""
        }
      }
      this.cdr.markForCheck()
    }, error => {
      this.openAlertModal(error.message)
    })

    this.translateService.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.sentToName = "";
        this.sendto.forEach((e, i) => {
          this.sentToName += e.getFullname()
          if (i != (this.sendto?.length - 1)) {
            this.sentToName += " , "
          }
        })
        this.ccName = "";
        this.ccList.forEach((e: any, i) => {
          const prefix = e.prefix
          this.ccName += this.translateText(prefix?.tdesc, prefix?.edesc) + e.getFullname().replace('  ',' ').replace(' ','  ')
          if (i != (this.ccList?.length - 1)) {
            this.ccName += " , "
          }
        })
      }
    );
  }

  getMessageTranslate(th?: string, eng?: string) {
    if (this.translateService.currentLang == 'th') {
      return th ? th : (eng ? eng : '')
    } else {
      return eng ? eng : (th ? th : '')
    }
  }


  openAlertModal(message?: string) {
    const modalRef = this.ngbModal.open(AlertModalComponent, {
      centered: true,
      backdrop: 'static'
    })
    modalRef.componentInstance.message = message ? message : ""
    modalRef.result.then((result) => {
      modalRef.dismiss()
    }, (reason) => {
      modalRef.dismiss()
    })
  }


  translateText(th: any, en: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : '') : (en ? en : '')
  }

  openEmployeeModal() {
    this.employeeModal = this.ngbModal.open(WorkflowEmployeeModalComponent, {
      centered: true,
      windowClass: 'dialog-width',
      size: 'lg'
    })
    this.employeeModal.componentInstance.typeCheckBox = true
    this.employeeModal.componentInstance.employeeList = this.employeeList
    this.employeeModal.componentInstance.empFilter = this.employeeList
    this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
    this.employeeModal.componentInstance.employeeCCId = this.employeeCC
    this.employeeModal.result.then(result => {
      this.ccName = ""
      this.ccList = result.map((e: any) => new MyWorkingsModel(e, this.translateService))
      this.ccList.forEach((e: any, i) => {
        const prefix = e.prefix
        this.ccName += this.translateText(prefix?.tdesc, prefix?.edesc) + e.getFullname().replace('  ',' ').replace(' ','  ')
        if (i != (this.ccList?.length - 1)) {
          this.ccName += " , "
        }
      })
      this.employeeCC = this.ccList.map((x: any) => x.employeeId)
      this.employeeCCId.emit(this.ccList.map((x: any) => {
        // const prefix = x.prefix
        // return this.translateText(prefix?.tdesc, prefix?.edesc) + x.getFullname().replace('  ',' ').replace(' ','  ')
        return  x.employeeId
      }).join(","))
      this.employeeModal = undefined
      this.cdr.markForCheck()
    }, reason => {
      this.ngbModal.dismissAll()
    })
  }
  getEmpAll() {
    this.employeeListLoading = true
    this.wfs.getEmpAll().subscribe(response => {
      this.employeeList = response.map(x => new MyWorkingsModel(x, this.translateService))
      this.employeeListLoading = false
      if (this.employeeModal) {
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.empFilter = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
      }
      this.cdr.markForCheck()
    }, error => {
      this.employeeListLoading = false
      if (this.employeeModal) {
        this.employeeModal.componentInstance.employeeList = this.employeeList
        this.employeeModal.componentInstance.empFilter = this.employeeList
        this.employeeModal.componentInstance.employeeListLoading = this.employeeListLoading
      }
      this.openAlertModal(error.message)
    })
  }

  getMenuDesc(childMenu: WorkflowChildModel[]) {
    for(let items of childMenu) {
      const link = items.link ? items.link.replace(/^.*\/.*\/(.*)\..*$/g, '$1') : "";
      if(link == this.menuPage) {
        this.cardNameTh = items.tName!;
        this.cardNameEng = items.eName!;
        break;
      }
    }
  }
}
