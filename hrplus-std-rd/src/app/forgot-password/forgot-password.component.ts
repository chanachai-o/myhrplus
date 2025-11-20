import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from "../auth.service";

export interface DBModel {
  db: string;
  dbName: string;
  dbDisplay: string;
  dbcomp: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
  providers: [AuthService],
})
export class ForgotPasswordComponent implements OnInit {
  msgForget = "";
  dbForgetSelected = "DB";
  userNameForget: string = "";
  emailForget: string = "";
  dbList: DBModel[] | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.getDatabase().subscribe(
      (result) => {
        this.dbList = result;
        this.dbForgetSelected = result[0].db;
      },
      (error: HttpErrorResponse) => {
        this.msgForget = error.message;
      }
    );
  }

  sentEmail() {
    this.authService
      .setMailForgetPassword(
        this.userNameForget,
        this.emailForget,
        this.dbForgetSelected
      )
      .then((result: any) => {
        if (result.status) {
          this.msgForget = "Sent Password to Email Success!!";
        } else {
          this.msgForget =
            result.msgEmail +
            "\n" +
            result.msgEmployeeid +
            "\n" +
            result.msgUsername;
        }
      })
      .catch((reason) => {
        if (reason.status == "401") {
          this.msgForget = "Invalid Username or Password";
        } else {
          this.msgForget = reason.message;
        }
      });
  }
}
