import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThaiDatePipe } from 'src/app/component/shared-ui/thaidate.pipe';
import { WorkingsModel } from 'src/app/models/workingmodel.model';
import { SwaplangCodeService } from 'src/app/services/swaplang-code.service';

@Component({
  standalone: true,
  imports:[CommonModule, TranslateModule, NgbPaginationModule, FormsModule, ThaiDatePipe],
  selector: 'app-workflow-employee-modal',
  templateUrl: './workflow-employee-modal.component.html',
  styleUrls: ['./workflow-employee-modal.component.scss']
})
export class WorkflowEmployeeModalComponent implements OnInit {
  @Input() employeeListLoading: boolean = false
  @Input() employeeList: WorkingsModel[] = []
  @Input() empFilter: WorkingsModel[] = []
  @Input() typeCheckBox = false
  @Input() employeeCCId: string[] = []
  empCheckBoxFilter: { checkbox: boolean, data: WorkingsModel }[] = []
  empCheckBoxFilterOld: { checkbox: boolean, data: WorkingsModel }[] = []
  employeeSearch = ""
  employeeSearchCheck = ""
  page = 1
  pageSize = 50
  constructor(public activeModal: NgbActiveModal,
    public SwaplangCodeService: SwaplangCodeService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService) {
    this.getSwaplangCode();
  }

  ngDoCheck() {
    if (this.employeeSearch) {
      const text = this.employeeSearch.toLowerCase()
      if(this.typeCheckBox){
        this.empCheckBoxFilter = text ? this.empCheckBoxFilterOld.filter((x: { checkbox: boolean, data: WorkingsModel }) => {
          if (x.data.fname?.toLowerCase().includes(text) ||
          x.data.lname?.toLowerCase().includes(text) ||
          x.data.efname?.toLowerCase().includes(text) ||
          x.data.elname?.toLowerCase().includes(text) ||
          (x.data.fname?.toLowerCase() + ' ' + x.data.lname?.toLowerCase()).includes(text) ||
          (x.data.efname?.toLowerCase() + ' ' + x.data.elname?.toLowerCase()).includes(text) ||
          (x.data.position)?.tdesc?.toLowerCase().includes(text) ||
          (x.data.position)?.edesc?.toLowerCase().includes(text) ||
          (x.data.bu1)?.tdesc?.toLowerCase().includes(text) ||
          (x.data.bu1)?.edesc?.toLowerCase().includes(text) ||
          (x.data.bu2)?.tdesc?.toLowerCase().includes(text) ||
          (x.data.bu2)?.edesc?.toLowerCase().includes(text) ||
          (x.data.bu3)?.tdesc?.toLowerCase().includes(text) ||
          (x.data.bu3)?.edesc?.toLowerCase().includes(text) ||
          (x.data.bu4)?.tdesc?.toLowerCase().includes(text) ||
          (x.data.bu4)?.edesc?.toLowerCase().includes(text) ||
          (x.data.bu5)?.tdesc?.toLowerCase().includes(text) ||
          (x.data.bu5)?.edesc?.toLowerCase().includes(text) ||
          (x.data.bu6)?.tdesc?.toLowerCase().includes(text) ||
          (x.data.bu6)?.edesc?.toLowerCase().includes(text) ||
          (x.data.bu7)?.tdesc?.toLowerCase().includes(text) ||
          (x.data.bu7)?.edesc?.toLowerCase().includes(text) ||
          x.data.employeeId?.toLowerCase().includes(text)) {
          return x
        }
        }): this.empCheckBoxFilterOld
      } else {
        this.empFilter = this.employeeList.filter((x: WorkingsModel) => {
          if (x.fname?.toLowerCase().includes(text) ||
            x.lname?.toLowerCase().includes(text) ||
            x.efname?.toLowerCase().includes(text) ||
            x.elname?.toLowerCase().includes(text) ||
            (x.fname?.toLowerCase() + ' ' + x.lname?.toLowerCase()).includes(text) ||
            (x.efname?.toLowerCase() + ' ' + x.elname?.toLowerCase()).includes(text) ||
            (x.position)?.tdesc?.toLowerCase().includes(text) ||
            (x.position)?.edesc?.toLowerCase().includes(text) ||
            (x.bu1)?.tdesc?.toLowerCase().includes(text) ||
            (x.bu1)?.edesc?.toLowerCase().includes(text) ||
            (x.bu2)?.tdesc?.toLowerCase().includes(text) ||
            (x.bu2)?.edesc?.toLowerCase().includes(text) ||
            (x.bu3)?.tdesc?.toLowerCase().includes(text) ||
            (x.bu3)?.edesc?.toLowerCase().includes(text) ||
            (x.bu4)?.tdesc?.toLowerCase().includes(text) ||
            (x.bu4)?.edesc?.toLowerCase().includes(text) ||
            (x.bu5)?.tdesc?.toLowerCase().includes(text) ||
            (x.bu5)?.edesc?.toLowerCase().includes(text) ||
            (x.bu6)?.tdesc?.toLowerCase().includes(text) ||
            (x.bu6)?.edesc?.toLowerCase().includes(text) ||
            (x.bu7)?.tdesc?.toLowerCase().includes(text) ||
            (x.bu7)?.edesc?.toLowerCase().includes(text) ||
            x.employeeId?.toLowerCase().includes(text)) {
            return x
          }
        })
      }

    }
    // if (this.typeCheckBox) {
    //   if (this.employeeSearch != this.employeeSearchCheck) {
    //     this.employeeSearchCheck = this.employeeSearch
    //     this.empCheckBoxFilter = []
    //     this.empCheckBoxFilter = this.empFilter.map(x => { return { checkbox: false, data: x } })
    //   } else {
    //     this.empCheckBoxFilter = this.empCheckBoxFilter.concat(this.empFilter.slice(this.empCheckBoxFilter.length).map(x => { return { checkbox: false, data: x } }))
    //   }
    // }
  }

  searchData(text: string) {
    text = text.toLowerCase()
    if (this.typeCheckBox) {
      this.empCheckBoxFilter = text ? this.empCheckBoxFilterOld.filter((x: { checkbox: boolean, data: WorkingsModel }) => {
        if (x.data.fname?.toLowerCase().includes(text) ||
        x.data.lname?.toLowerCase().includes(text) ||
        x.data.efname?.toLowerCase().includes(text) ||
        x.data.elname?.toLowerCase().includes(text) ||
        (x.data.fname?.toLowerCase()+' '+x.data.lname?.toLowerCase()).includes(text) ||
        (x.data.efname?.toLowerCase()+' '+x.data.elname?.toLowerCase()).includes(text) ||
        (x.data.position)?.tdesc?.toLowerCase().includes(text) ||
        (x.data.position)?.edesc?.toLowerCase().includes(text) ||
        (x.data.bu1)?.tdesc?.toLowerCase().includes(text) ||
        (x.data.bu1)?.edesc?.toLowerCase().includes(text) ||
        (x.data.bu2)?.tdesc?.toLowerCase().includes(text) ||
        (x.data.bu2)?.edesc?.toLowerCase().includes(text) ||
        (x.data.bu3)?.tdesc?.toLowerCase().includes(text) ||
        (x.data.bu3)?.edesc?.toLowerCase().includes(text) ||
        (x.data.bu4)?.tdesc?.toLowerCase().includes(text) ||
        (x.data.bu4)?.edesc?.toLowerCase().includes(text) ||
        (x.data.bu5)?.tdesc?.toLowerCase().includes(text) ||
        (x.data.bu5)?.edesc?.toLowerCase().includes(text) ||
        (x.data.bu6)?.tdesc?.toLowerCase().includes(text) ||
        (x.data.bu6)?.edesc?.toLowerCase().includes(text) ||
        (x.data.bu7)?.tdesc?.toLowerCase().includes(text) ||
        (x.data.bu7)?.edesc?.toLowerCase().includes(text) ||
        x.data.employeeId?.toLowerCase().includes(text)) {
        return x
      }
      }): this.empCheckBoxFilterOld
    } else{
      this.empFilter = text ? this.employeeList.filter((x: WorkingsModel) => {
        if (x.fname?.toLowerCase().includes(text) ||
          x.lname?.toLowerCase().includes(text) ||
          x.efname?.toLowerCase().includes(text) ||
          x.elname?.toLowerCase().includes(text) ||
          (x.fname?.toLowerCase()+' '+x.lname?.toLowerCase()).includes(text) ||
          (x.efname?.toLowerCase()+' '+x.elname?.toLowerCase()).includes(text) ||
          (x.position)?.tdesc?.toLowerCase().includes(text) ||
          (x.position)?.edesc?.toLowerCase().includes(text) ||
          (x.bu1)?.tdesc?.toLowerCase().includes(text) ||
          (x.bu1)?.edesc?.toLowerCase().includes(text) ||
          (x.bu2)?.tdesc?.toLowerCase().includes(text) ||
          (x.bu2)?.edesc?.toLowerCase().includes(text) ||
          (x.bu3)?.tdesc?.toLowerCase().includes(text) ||
          (x.bu3)?.edesc?.toLowerCase().includes(text) ||
          (x.bu4)?.tdesc?.toLowerCase().includes(text) ||
          (x.bu4)?.edesc?.toLowerCase().includes(text) ||
          (x.bu5)?.tdesc?.toLowerCase().includes(text) ||
          (x.bu5)?.edesc?.toLowerCase().includes(text) ||
          (x.bu6)?.tdesc?.toLowerCase().includes(text) ||
          (x.bu6)?.edesc?.toLowerCase().includes(text) ||
          (x.bu7)?.tdesc?.toLowerCase().includes(text) ||
          (x.bu7)?.edesc?.toLowerCase().includes(text) ||
          x.employeeId?.toLowerCase().includes(text)) {
          return x
        }
      }) : this.employeeList
    }
    this.page = 1
  }

  ngOnInit(): void {
    this.empFilter = this.employeeList
    if (this.typeCheckBox) {
      this.empCheckBoxFilterOld = this.employeeList.map(x => {
        return {
          checkbox: this.employeeCCId.find(y => x.employeeId == y) ? true : false,
          data: x
        }
      })
      this.empCheckBoxFilter = this.empCheckBoxFilterOld
    }
  }

  checkText(text?: any) {
    return text ? text : "-"
  }

  getTextTranslate(th: string, eng: String) {
    return this.translateService.currentLang == "th" ? th : eng
  }

  checkboxAll(value: boolean) {
    this.empCheckBoxFilter = this.empCheckBoxFilterOld.map(x => {
      return { ...x, checkbox: value }
    })
    this.empCheckBoxFilterOld =this.empCheckBoxFilter
  }


  checkBoxClose() {
    this.activeModal.close(this.empCheckBoxFilterOld.filter(x => x.checkbox).map(x => x.data))
  }

  getSwaplangCode() {
    this.SwaplangCodeService.getListESS();
  }
}
