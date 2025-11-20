import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { TrainingContent } from 'src/app/models/trainingcontent.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { environment } from 'src/environments/environment';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule],
  selector: 'app-aps-ability-list-tkc',
  templateUrl: './aps-ability-list-tkc.component.html',
  styleUrls: ['./aps-ability-list-tkc.component.scss']
})
export class ApsAbilityListTkcComponent implements OnInit {
  web = environment.jbossUrl
  page = 0;
  pageSize = 100;
  collectionSize = 0;
  closeResult = '';
  loading = false;
  nodata = false;
  index = 0;
  data: TrainingContent[] | undefined;
  currentUser = JSON.parse(sessionStorage.getItem("currentUser")!);
  empProfile?: EmployeeProfileModel;

  status = ''
  constructor(private modalService: NgbModal, public translateService: TranslateService, private cdr: ChangeDetectorRef,
    private empService: EmployeeService
  ) {
  }

  openDialog(dialog: string, index: number, status?: 'ประเมินตัวเอง') {
    this.status = status || ''
    console.log("🥷🏿 ~ this.status:", this.status)
    this.index = index;
    this.modalService.open(dialog, { centered: true, windowClass: 'dialog-width', backdrop: "static", size: 'lg' });
  }




  ngOnInit(): void {
    this.empService
      .getEmployeeProfile(this.currentUser.employeeid)
      .subscribe((result) => {
        this.empProfile = result;
        this.cdr.markForCheck();
      });
  }

}
