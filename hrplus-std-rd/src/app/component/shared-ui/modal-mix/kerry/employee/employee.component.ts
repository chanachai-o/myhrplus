import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDatepickerModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { KerryEmployeeModel } from 'src/app/models/kerry-mix-model.model';

@Component({
  selector: 'app-kerry-employee-modal',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgbModule,
    NgbDatepickerModule,
    NgbPaginationModule,
  ]
})
export class KerryEmployeeModalComponent implements OnInit {
  @Input() employeeListLoading: boolean = false
  @Input() employeeList: KerryEmployeeModel[] = []
  @Input() empFilter: KerryEmployeeModel[] = []
  employeeSearch = ""
  page = 1
  pageSize = 10
  constructor(public activeModal: NgbActiveModal,
    private translateService: TranslateService) {

  }
  employeeListFilter() {
    return this.employeeList.filter((x: KerryEmployeeModel) => {
      if (x.fname?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.lname?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.efname?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.elname?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.employeeId?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.position.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.position.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu1.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu1.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu2.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu2.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu3.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu3.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu4.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu4.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu5.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu5.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu6.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu6.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu7.tdesc?.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
        x.job.bu7.edesc?.toLowerCase().includes(this.employeeSearch.toLowerCase())) {
        return x
      }
    })
  }
  // ngDoCheck() {
  //   if (this.employeeSearch) {
  //     const text = this.employeeSearch.toLowerCase()
  //     this.empFilter = this.employeeList.filter((x: KerryEmployeeModel) => {
  //       if (x.fname?.toLowerCase().includes(text) ||
  //         x.lname?.toLowerCase().includes(text) ||
  //         x.efname?.toLowerCase().includes(text) ||
  //         x.elname?.toLowerCase().includes(text) ||
  //         x.employeeId?.toLowerCase().includes(text)) {
  //         return x
  //       }
  //     })
  //   }
  // }

  searchData(text: string) {
    // text = text.toLowerCase()
    // this.empFilter = text ? this.employeeList.filter((x: KerryEmployeeModel) => {
    //   if (x.fname?.toLowerCase().includes(text) ||
    //     x.lname?.toLowerCase().includes(text) ||
    //     x.efname?.toLowerCase().includes(text) ||
    //     x.elname?.toLowerCase().includes(text) ||
    //     x.employeeId?.toLowerCase().includes(text)) {
    //     return x
    //   }
    // }) : this.employeeList
    this.page = 1
  }

  ngOnInit(): void {
    this.empFilter = this.employeeList
    console.log(" 🐒  this.employeeList:", this.employeeList)
  }

  checkText(text?: any) {
    return text ? text : "-"
  }

  getTextTranslate(th: string, eng: String) {
    return this.translateService.currentLang == "th" ? th : eng
  }
}
