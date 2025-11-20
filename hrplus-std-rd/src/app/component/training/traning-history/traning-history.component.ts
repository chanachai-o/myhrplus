import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TrainingContent } from 'src/app/models/trainingcontent.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-traning-history',
  templateUrl: './traning-history.component.html',
  styleUrls: ['./traning-history.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPaginationModule, NgbModalModule]
})
export class TraningHistoryComponent implements OnInit {

  page = 1; // Pagination starts from page 1
  pageSize = 10;
  collectionSize = 0;
  
  allData: TrainingContent[] = [];
  pagedData: TrainingContent[] = [];

  loading = false;
  nodata = false;
  
  selectedItem: TrainingContent | undefined;

  imgName = "";
  imgHeadName = "";
  lecturerProfile:any;

  constructor(
    private modalService: NgbModal,
    public empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.nodata = false;
    this.empService.getTrainingHistory(this.pageSize, this.page).subscribe({
      next: (result) => {
        this.allData = result.content;
        this.collectionSize = this.allData.length;
        this.nodata = this.allData.length === 0;
        this.refreshData();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.allData = [];
        this.pagedData = [];
        this.collectionSize = 0;
        this.loading = false;
        this.nodata = true;
        this.cdr.markForCheck();
      }
    });
  }

  refreshData() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.pagedData = this.allData.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number): void {
    this.page = page;
    this.refreshData();
  }

  onPageSizeChange(): void {
    this.page = 1; // Reset to the first page
    this.refreshData();
  }

  openDialog(dialog: any, item: TrainingContent) {
    this.selectedItem = item;
    this.modalService.open(dialog, { centered: true, size: 'lg' });
  }

  openDialogCourse(dialog: any, item: TrainingContent) {
    this.selectedItem = item;
    this.modalService.open(dialog, { centered: true, size: 'lg' });
  }

  openDialogTraining(dialog: any, item: TrainingContent) {
    this.selectedItem = item;
    this.modalService.open(dialog, { centered: true, size: 'lg' });
  }

  openDialogImg(dialog: any, imgName: string, imgHeadName: string) {
    this.imgName = imgName;
    this.imgHeadName = imgHeadName;
    this.modalService.open(dialog, { centered: true });
  }

  openDialogProfile(dialog: any, item: any) {
    this.lecturerProfile = item.trainer;
    this.modalService.open(dialog, { centered: true });
  }

}
