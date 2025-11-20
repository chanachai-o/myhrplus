import {
    formatDate,
    FormStyle,
    getLocaleDayNames,
    getLocaleMonthNames,
    registerLocaleData,
    TranslationWidth,
} from "@angular/common";
import { Component, Injectable, OnInit } from "@angular/core";
import {
    NgbDatepickerI18n,
    NgbDateStruct,
    NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import localeThai from "@angular/common/locales/th";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    selector: "app-employee-pnd91",
    templateUrl: "./employee-pnd91.component.html",
    styleUrls: ["./employee-pnd91.component.scss"],
})
export class EmployeePnd91Component implements OnInit {
    token: any = JSON.parse(sessionStorage.getItem("currentUser")!);
    page = 0;
    pageSize = 100;
    collectionSize = 0;
    isLoading = false;
    pdfSrc = "";
    currentDate = new Date();
    yearSelected = this.currentDate.getFullYear();
    yearList = [
        { value: this.currentDate.getFullYear() },
        { value: this.currentDate.getFullYear() - 1 },
        { value: this.currentDate.getFullYear() - 2 },
        { value: this.currentDate.getFullYear() - 3 },
        { value: this.currentDate.getFullYear() - 4 },
    ];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {}

    loadPDF() {
        this.isLoading = true;
        this.getPnd91();
    }

    getPnd91() {
        let body = {
            employeeId: this.token.employeeid,
            year: this.yearSelected.toString(),
        };
        this.http
            .post(environment.jbossUrl + "/irapi/ireport/pnd91", body)
            .subscribe(
                (result: any) => {
                    console.log("result", result);
                    this.isLoading = false;
                    if (result.success) {
                        this.pdfSrc = environment.rootUrl + result.message;
                        window.open(this.pdfSrc);
                    }
                    console.log(this.pdfSrc);
                },
                (error) => {
                    this.isLoading = false;
                }
            );
    }
}
