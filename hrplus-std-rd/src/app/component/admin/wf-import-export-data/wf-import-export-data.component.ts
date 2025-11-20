import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertModalComponent } from 'src/app/component/workflow/workflow-type/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component';
import { CommandLineReportModel } from 'src/app/models/commandline-report.model';
import { UploadGetmodel } from 'src/app/models/uploadget.model';
import { workflowService } from 'src/app/services/workflow.service';
const FileSaver = require('file-saver');
import * as XLSX from 'xlsx-js-style';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgbModule
  ],
  selector: 'app-wf-import-export-data',
  templateUrl: './wf-import-export-data.component.html',
  styleUrls: ['./_wf-import-export-data.scss']
})
export class WfImportExportDataComponent implements OnInit, OnDestroy {
  uploadConfig?: UploadGetmodel;
  newFileUpload?: File;
  file = { name: 'browse_file', data: '' };
  reader: FileReader = new FileReader();

  commandLineReportModel: CommandLineReportModel[] = [];
  exportToExcelLoading = false;
  private commandlineReportSubscription?: Subscription;

  constructor(
    private workflowService: workflowService,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.reader.onload = () => {
      this.file.data = btoa(this.reader.result?.toString() || '');
    };
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.commandlineReportSubscription?.unsubscribe();
  }

  loadData(): void {
    this.uploadFileCondition();
    this.getCommandlineReport();
  }

  getCommandlineReport(): void {
    this.exportToExcelLoading = true;
    this.commandlineReportSubscription = this.workflowService.getCommandlineReport().subscribe({
      next: response => {
        this.commandLineReportModel = response;
        this.exportToExcelLoading = false;
      },
      error: error => {
        this.openAlertModal(error.message);
        this.exportToExcelLoading = false;
      }
    });
  }

  uploadFileCondition(): void {
    this.workflowService.uploadFileCondition().then(result => {
      this.uploadConfig = result;
      this.uploadConfig.filter = this.uploadConfig.filter.replace(/\*/gi, '');
      this.changeDetectorRef.markForCheck();
    }).catch(error => {
      this.openAlertModal(error.messageAlert);
    });
  }

  selectFile(files: FileList | null): void {
    if (!files || files.length === 0) {
      return;
    }
    this.newFileUpload = files[0];

    if (!this.newFileUpload.name.toLowerCase().endsWith('.csv')) {
      this.openAlertModal(this.translateService.instant('Please select csv file.'));
      this.clearFile();
      return;
    }

    if (this.uploadConfig && this.newFileUpload.size > this.uploadConfig.maxSize) {
      this.openAlertModal(this.translateService.instant('File is too large.'));
      this.clearFile();
      return;
    }

    this.file.name = this.newFileUpload.name;
    this.reader.readAsBinaryString(this.newFileUpload);
  }

  clearFile(): void {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    this.file = { name: 'browse_file', data: '' };
    this.newFileUpload = undefined;
  }

  uploadFile(): void {
    if (!this.newFileUpload || !this.file.data) return;

    const body = {
      uploadfield: "attached_file_temp.file_name",
      subfolder: new Date().getTime(),
      fileName: this.newFileUpload.name,
      data: this.file.data
    };

    this.workflowService.uploadFileCommandline(body).then(result => {
      if (result.failResult.length === 0) {
        this.openAlertModal(this.translateService.instant('Successfully uploaded.'));
      } else {
        this.openAlertModal(this.translateService.instant('Can not upload files.'));
      }
      this.clearFile();
    }).catch(error => {
      this.openAlertModal(error.messageAlert);
      this.clearFile();
    });
  }

  importData(): void {
    if (this.file.name === 'browse_file') {
      this.openAlertModal(this.translateService.instant('Please upload csv file.'));
      return;
    }

    const modalRef = this.ngbModal.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.message = this.translateService.instant('Do you want to import the data?');
    modalRef.result.then(() => {
      this.uploadFile();
    }, () => {});
  }

  exportToExcel(): void {
    if (this.exportToExcelLoading) return;

    const header = ['WFID', 'EMPLOYEEID', 'COMMANDLINE1', 'COMMANDLINE2', 'COMMANDLINE3', 'COMMANDLINE4', 'COMMANDLINE5', 'COMMANDLINE6'];
    const data = this.commandLineReportModel.map(x => [
      x.wfId,
      x.employeeId,
      x.bossId1,
      x.bossId2,
      x.bossId3,
      x.bossId4,
      x.bossId5,
      x.bossId6,
    ]);

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    worksheet['!cols'] = header.map(() => ({ wch: 25 })); // Set column width for all

    const workbook: XLSX.WorkBook = { Sheets: { 'CommandLine': worksheet }, SheetNames: ['CommandLine'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'text/csv;charset=UTF-8' });
    FileSaver.saveAs(blob, "CommandLineReport.csv");
  }

  openAlertModal(message?: string): void {
    const modalRef = this.ngbModal.open(AlertModalComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.message = message || "";
  }
}