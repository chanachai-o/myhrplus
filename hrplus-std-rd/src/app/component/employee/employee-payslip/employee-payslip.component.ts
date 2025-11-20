import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoginModel } from "src/app/models/auth.model";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { ThaiDatePipe } from '../../shared-ui/thaidate.pipe';

export interface SalaType {
    codeId: string;
    tdesc: string;
    edesc: string;
}

export interface PayslipModel {
    effDate: string
    effTime: string
    salaType: SalaType;
    genDate: string;
    payDate: string;
    month: string;
    year: string;
    prgCode: string;
    showSlip: string;
    period: string;
    periodSeq: string;
}

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule, TranslateModule, ThaiDatePipe],
    selector: "app-employee-payslip",
    templateUrl: "./employee-payslip.component.html",
    styleUrls: ["./employee-payslip.component.scss"],
})
export class EmployeePayslipComponent implements OnInit {
    @ViewChild("passModal") passModal: undefined;
    token: any = JSON.parse(sessionStorage.getItem("currentUser")!);
    page = 0;
    pageSize = 100;
    collectionSize = 0;
    isLoading = false;
    password = ""
    pdfSrc: string = "";
    periodSelect: any;
    periodList?: PayslipModel[];
    msg = ""
    constructor(
        private http: HttpClient,
        public translateService: TranslateService,
        private modalService: NgbModal,
    ) { }

    ngOnInit(): void {
        this.http
            .get<PayslipModel[]>(
                environment.baseUrl + "/epayslip-config/period/lists"
            ).subscribe(result => {
                const currentDate = new Date()
                const currenttime = parseFloat(currentDate.getHours() + "." + currentDate.getMinutes())
                this.periodList = result.filter(x => x.effDate ?
                    (parseInt(x.effDate.split("-").join("")) <= parseInt(this.formatYYYY_MM_DD(currentDate).split("-").join("")) ?
                        parseFloat(x.effTime) <= currenttime : false)
                    : true)
                if (this.periodList.length > 0) {
                    this.periodSelect = this.periodList[0]
                }
            });
    }


    formatYYYY_MM_DD(date: Date) {
        function formatNN(number: number) {
            return ('0' + number.toString()).slice(-2)
        }
        return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
    }

    loadPDF() {
        this.password = ""
        this.getPayslip();
    }

    getPayslip() {
        this.http.get("/config/payslip-pass").subscribe((result: any) => {
            console.log("payslip", result)
            if (result.password) {
                this.modalService.open(this.passModal, {
                    centered: true,
                    backdrop: "static",
                });
            } else {
                this.showSlip();
            }
        }, (error) => {
            this.showSlip();
        })

    }

    showSlip() {
        this.isLoading = true;
        console.log("periodSelect", this.periodSelect);
        let body = {
            employeeId: this.token.employeeid,
            prgCode: this.periodSelect?.prgCode,
            month: this.periodSelect?.month,
            year: this.periodSelect?.year,
            lang: this.translateService.currentLang == "th" ? "tha" : "eng",
            gendate: this.periodSelect.genDate,
            day: this.periodSelect.genDate.split("-")[2],
            currentTemplate: "EPAYSLIP_CURRENT",
            currentJasperTemplate: "EPAYSLIP_CURRENT",
            historyTemplate: "EPAYSLIP_HISTORY",
            historyJasperTemplate: "EPAYSLIP_HISTORY",
        };
        this.http
            .post(environment.jbossUrl + "/irapi/ireport/temp/payslip", body)
            .subscribe(
                (result: any) => {
                    console.log("result", result);
                    this.isLoading = false;
                    if (result.success) {
                        if (result.message != "") {
                            this.pdfSrc = environment.rootUrl + result.message;
                            window.open(this.pdfSrc);
                        } else {
                            this.showGenPDF(body)
                        }
                    }
                },
                (error) => {
                    this.showGenPDF(body)
                }
            );
    }

    showGenPDF(body: any) {
        this.http
            .post(environment.jbossUrl + "/irapi/ireport/payslip", body)
            .subscribe(
                (result: any) => {
                    console.log("result", result);
                    this.isLoading = false;
                    if (result.success) {
                        this.pdfSrc = environment.rootUrl + result.message;
                        window.open(this.pdfSrc);
                    }
                },
                (error) => {
                    this.openAlertModal(error.message)
                    this.isLoading = false;
                }
            );
    }

    login() {
        let body: LoginModel = {
            username: this.token.username,
            password: this.password,
            dbName: sessionStorage.getItem('dbName')!,
            dbcomp: "100",
            lang: "th",
        };
        this.http
            .post<any>(environment.jbossUrl + "/usapi/authen", body)
            .subscribe(
                (response: any) => {
                    this.showSlip();
                    this.modalService.dismissAll();
                }, (error) => {
                    this.password = "";
                    this.openAlertModal("รหัสผ่านไม่ถูกต้อง")
                }
            );
    }


    openAlertModal(message?: string) {
        const modalRef = this.modalService.open(AlertModalComponent, {
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

}
