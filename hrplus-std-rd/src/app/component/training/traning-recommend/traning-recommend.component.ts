import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Course } from 'src/app/models/course.model';
import { MyRecommendContent, RecommendContent } from 'src/app/models/recommendcontent.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-traning-recommend',
  templateUrl: './traning-recommend.component.html',
  styleUrls: ['./traning-recommend.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgbPaginationModule, NgbModalModule, ScrollingModule]
})
export class TraningRecommendComponent implements OnInit {
  page = 1; // Pagination starts from page 1
  pageSize = 10;
  collectionSize = 0;

  allData: RecommendContent[] = [];
  pagedData: RecommendContent[] = [];

  loading = false;
  nodata = false;

  selectedItem: RecommendContent | undefined;
  courseDetail: Course | undefined;

  msg = "";
  @ViewChild('alertModal') alertModal: any;

  constructor(
    public empService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  public async loadData() {
    this.loading = true;
    this.nodata = false;
    this.allData = [];
    this.pagedData = [];
    this.collectionSize = 0;

    try {
      let currentPage = 0;
      let lastPageReached = false;
      do {
        const result: any = await this.empService.getRecommend(this.pageSize, currentPage);
        if (result && result.content) {
          this.allData = this.allData.concat(result.content.map((e: any) => new MyRecommendContent(e, this.translateService)));
          lastPageReached = result.last;
          currentPage = result.number + 1;
        } else {
          lastPageReached = true; // Stop if no content or result
        }
      } while (!lastPageReached);

      this.collectionSize = this.allData.length;
      this.nodata = this.allData.length === 0;
      this.refreshData();
      this.loading = false;
      this.cdr.markForCheck();

    } catch (reason: any) {
      this.msg = reason.message;
      this.modalService.open(this.alertModal, { centered: true, backdrop: 'static' });
      this.loading = false;
      this.nodata = true;
      this.cdr.markForCheck();
    }
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

  closeBtnClick() {
    this.modalService.dismissAll();
    this.loadData(); // Reload data after closing alert
  }

  openDialogCourse(dialog: any, item: RecommendContent) {
    this.selectedItem = item;
    this.courseDetail = item.course; // Assuming item has a 'course' property
    this.modalService.open(dialog, { centered: true, size: 'lg' });
  }
}
