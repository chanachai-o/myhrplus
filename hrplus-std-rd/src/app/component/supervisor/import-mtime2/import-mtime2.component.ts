import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ShiftTimeListModel } from "src/app/models/shiftimelist.model";
import { TimeService } from "src/app/services/time.service";
import { workflowService } from "src/app/services/workflow.service";
const FileSaver = require('file-saver');
@Component({
    selector: "app-import-mtime2",
    templateUrl: "./import-mtime2.component.html",
    styleUrls: ["./import-mtime2.component.scss"],
    standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class ImportMtime2Component implements OnInit {
    @ViewChild("alertModal") alertModal: undefined;
    @ViewChild("confirmModal") confirmModal: undefined;
    example = false;
    uploadConfig: any;
    nameFile: string = "browse_file";
    newFile: string = "";
    uploadFilename: string = "";
    uploadFileSize: string = "";
    errormsg: string = "";
    timeListid = "";
    listtimeExcel: ShiftTimeListModel | undefined;
    shiftTimeListShow: any = [];
    loading = false;
    fullname = { th: "", en: "" };

    templateFile? : Blob
    @ViewChild("fileInput") fileInput: ElementRef | undefined;
    constructor(
        public translateService: TranslateService,
        private modalService: NgbModal,
        private workflowService: workflowService,
        private timeService: TimeService,
        public cdr: ChangeDetectorRef,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
    ) {
        this.getuploadWFApi();
    }

    ngOnInit(): void {
        this.loading = true; // Set loading to true on init
        this.http
            .get("/assets/template/importshift-template.csv", { responseType: "blob" })
            .subscribe(
                (data) => {
                    this.templateFile = data
                    console.log(data);
                    this.loading = false; // Set loading to false on success
                },
                (error: ErrorEvent) => {
                    alert(error.message);
                    this.loading = false; // Set loading to false on error
                }
            );
    }

    getuploadWFApi() {
        this.workflowService
            .getConfigUpload("import_shift.file_name")
            .subscribe((result) => {
                this.uploadConfig = result;
                console.log("configfile", this.uploadConfig);
            });
    }

    showexample() {
        FileSaver.saveAs(this.templateFile,"importshift-template.csv");
    }

    public async onFileSelected(event: any) {
        this.loading = true; // Set loading to true on file selection
        var files = event.target.files;
        if (files.length > 0) {
            if (files[0].name != this.nameFile) {
                var reader: any = new FileReader();
                reader = new FileReader();
                reader.onload = () => {
                    const json = btoa(reader.result);
                    this.newFile = json;
                };
                reader.readAsBinaryString(files[0]);
                this.uploadFilename = files[0].name;
                this.uploadFileSize = files[0].size;
                if (this.uploadFileSize > this.uploadConfig.maxSize) {
                    this.errormsg =
                        this.translateService.currentLang == "th"
                            ? "ไม่สามารถอัพโหลดไฟล์ได้"
                            : "Can not upload files.";
                    this.modalService.open(this.alertModal, {
                        centered: true,
                        backdrop: "static",
                    });
                    this.loading = false; // Reset loading on error
                } else {
                    await this.delay(100);
                    this.onUploadFileExcel();
                }
            }
        }
        this.fileInput!.nativeElement.value = "";
    }

    async delay(milliseconds: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }

    public onUploadFileExcel() {
        if (this.newFile) {
            let date = new Date();
            let body = {
                uploadfield: "import_shift.file_name",
                subfolder: date.getTime(),
                fileName: this.uploadFilename,
                data: this.newFile,
            };
            console.log("body", body);
            this.timeService.uploadShift(body).subscribe((result) => {
                console.log("sssss", result);
                if (!result.success) {
                    this.nameFile = "browse_file";
                    this.errormsg =
                        this.translateService.currentLang == "th"
                            ? "ไม่สามารถอัพโหลดไฟล์ได้"
                            : "Can not upload files.";
                    this.modalService.open(this.alertModal, {
                        centered: true,
                        backdrop: "static",
                    });
                    this.loading = false; // Reset loading on error
                } else {
                    this.nameFile = body.fileName;
                    this.timeListid = result.message;
                    this.loading = true; // Set loading to true before getTimeExcel
                    this.getTimeExcel();
                }
            });
        }
        this.modalService.dismissAll();
    }
    getTimeExcel() {
        this.timeService.getTimeExcel(this.timeListid).subscribe(
            (result) => {
                console.log("sssssssssssssss", result);
                this.listtimeExcel = result;
                let a: any = result.content[0];
                this.shiftTimeListShow = [];
                let i = 1;
                while (i <= 31) {
                    this.shiftTimeListShow.push(
                        a["time" + ("0" + i).slice(-2) + 1]
                    );
                    i++;
                }
                console.log("this.shiftTimeListShow", this.listtimeExcel);
                this.cdr.markForCheck();
                this.loading = false; // Reset loading on success
            },
            (error) => {
                this.loading = false; // Reset loading on error
            }
        );
    }
    onSubmit() {
        this.loading = true; // Set loading to true on submit
        let body = {
            listId: this.timeListid,
        };

        this.timeService.postTimeExcel(body).then((result: any) => {
            console.log("result", result);
            if (result) {
                this.errormsg =
                    this.translateService.currentLang == "th"
                        ? 'บันทึกข้อมูลเรียบร้อย"'
                        : "Save data completely";
                this.modalService.open(this.alertModal, {
                    centered: true,
                    backdrop: "static",
                });
            }
            this.loading = false; // Reset loading on success
        }).catch(error => {
            this.errormsg = error.error.error
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: "static",
            })
            this.loading = false; // Reset loading on error
        });
    }
    openOnSubmit() {
        this.errormsg =
            this.translateService.currentLang == "th"
                ? "ต้องการอัพโหลดไฟล์หรือไม่ ?"
                : "Do you want to upload file or not?";
        this.modalService.open(this.confirmModal, {
            centered: true,
            backdrop: "static",
        });
    }
}
