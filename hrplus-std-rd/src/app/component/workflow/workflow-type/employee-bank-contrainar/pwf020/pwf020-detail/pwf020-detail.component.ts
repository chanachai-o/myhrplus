import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { KerryBankModel } from 'src/app/models/kerry-mix-model.model';
import { BankService } from 'src/app/services/bank.service';
import { AlertModalComponent } from '../../../alert-modal/alert-modal.component';
import { EmpBank, MyEmpBank } from 'src/app/models/empBank.model';
import { EmployeeService } from 'src/app/services/employee.service';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSendtoComponent, WorkflowAttachFileComponent, WorkflowRemarkComponent } from 'src/app/component/workflow/workflow-type/index' // Added import
import { WorkflowDetailFooterComponent } from '../../../workflow-detail/workflow-detail-footer/workflow-detail-footer.component';
import { WorkflowEmpInformationComponent } from '../../../workflow-emp-information/workflow-emp-information.component';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    AlertModalComponent,
    WorkflowSendtoComponent, // Added
    WorkflowAttachFileComponent, // Added
    WorkflowRemarkComponent, // Added
    FormsModule,
    WorkflowEmpInformationComponent,
    WorkflowDetailFooterComponent,
  ],
  selector: 'app-pwf020-detail',
  templateUrl: './pwf020-detail.component.html',
  styleUrls: ['./pwf020-detail.component.scss']
})
export class Pwf020DetailComponent implements OnInit {
  @Input() data: any;
  bankList: KerryBankModel[] = []
  bank: KerryBankModel = new KerryBankModel({})
  wfid = "2300"
  workflowData: any
  manageDocument: any
  employeeId = ""

  accountNo = ""


  constructor(private cdr: ChangeDetectorRef,
    private bankService: BankService,
    private ngbModal: NgbModal,
    private translateService: TranslateService,) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.workflowData = changes.data.currentValue.workflowData
      this.employeeId = this.workflowData.screen_value.__wf__employeeid
      this.manageDocument = changes.data.currentValue.manageDocument
      this.bankService.getList().pipe(map(x => x.map(y => new KerryBankModel(y, this.translateService)))).subscribe(response => {
        const bank = response.find(x => x.bankId == this.workflowData.screen_value.__wf__mempl_bank$bankid$1)
        this.bank = new KerryBankModel(bank ? bank : {}, this.translateService)
        this.accountNo = this.workflowData.screen_value.__wf__mempl_bank$accountid$1
        this.cdr.markForCheck()
      }, error => {
        this.openAlertModal(error.message)
      })
    }
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

  getMessageTranslate(th?: string, eng?: string) {
    if (this.translateService.currentLang == 'th') {
      return th ? th : (eng ? eng : '')
    } else {
      return eng ? eng : (th ? th : '')
    }
  }



}
