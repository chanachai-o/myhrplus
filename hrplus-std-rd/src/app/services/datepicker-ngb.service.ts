import { Injectable } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DatepickerNgbService {

  currentDate = new Date()

  constructor(private translate: TranslateService) { }

  validateFormatDate(dateModel: NgModel, yearPopUp?: boolean, formatPopup?: boolean) {
    const chkYearPopUp: boolean = yearPopUp!==undefined?yearPopUp:true;
    const chkFormatPopUp: boolean = formatPopup!==undefined?formatPopup:true;
    let dateValid = dateModel.model;
    if (dateModel.invalid) { //Number case
      if (!isNaN(Number(dateModel.value))) { // ถ้าเป็นตัวเลขเอาไปทำฟอแมต date
        if (dateModel.value.length != 8) {
          if(chkFormatPopUp) {
            alert(this.translate.instant('Please enter 8 digit date.'));
          }
          dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
        } else {
          let date = new Date(dateModel.value.substring(4, 8), Number(dateModel.value.substring(2, 4)) - 1, dateModel.value.substring(0, 2));
          dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
          if (dateValid.invalid || (date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
            if ((date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
              if(chkYearPopUp) {
                alert(this.translate.instant('Calendar80'));
              }
            }
          } else {
            dateValid = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
          }
          // let year = ((date.getFullYear() - this.currentDate.getFullYear()) > 100) ? date.getFullYear() - 543 : date.getFullYear()
        }
      } else { // ถ้าเป็นตัวหนังสือให้โชว์ปัจจุบัน
        dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
      }
    } else { //Date case
      let date = new Date(dateModel.model.year, Number(dateModel.model.month) - 1, dateModel.model.day);
      if ((date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
        if(chkYearPopUp) {
          alert(this.translate.instant('Calendar80'));
        }
        dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
      } else {
        dateValid = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
      }
    }
    return dateValid;
  }

  validateFormatDateNull(dateModel: NgModel, yearPopUp?: boolean, formatPopup?: boolean) {
    const chkYearPopUp: boolean = yearPopUp!==undefined?yearPopUp:true;
    const chkFormatPopUp: boolean = formatPopup!==undefined?formatPopup:true;
    let dateValid = dateModel.model
    if (dateModel.invalid) { //Number case
      if (!isNaN(Number(dateModel.value))) {
        if (dateModel.value.length != 8) {
          if(chkFormatPopUp) {
            alert(this.translate.instant('Please enter 8 digit date.'))
          }
          dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
        } else {
          let date = new Date(dateModel.value.substring(4, 8), Number(dateModel.value.substring(2, 4)) - 1, dateModel.value.substring(0, 2));
          dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
          if (dateValid.invalid || (date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
            if ((date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
              if(chkYearPopUp) {
                alert(this.translate.instant('Calendar80'));
              }
            }
          } else {
            dateValid = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
          }
          //let year = ((date.getFullYear() - this.currentDate.getFullYear()) > 100) ? date.getFullYear() - 543 : date.getFullYear()
        }
      } else {
        dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
      }
    } else { //Date case
      if (!dateModel.value) {
        if(chkFormatPopUp) {
          alert(this.translate.instant('Please enter 8 digit date.'))
        }
        dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
      } else {
        let date = new Date(dateModel.model.year, Number(dateModel.model.month) - 1, dateModel.model.day);
        if ((date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
          if(chkYearPopUp) {
            alert(this.translate.instant('Calendar80'));
          }
          dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
        } else {
          dateValid = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }
      }
    }
    return dateValid;
  }
  validateFormatDateNullNoAlert(dateModel: NgModel) {
    let dateValid = dateModel.model
    if (dateModel.invalid) { //Number case
      if (!isNaN(Number(dateModel.value))) {
        if (dateModel.value.length != 8) {
          dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
        } else {
          let date = new Date(dateModel.value.substring(4, 8), Number(dateModel.value.substring(2, 4)) - 1, dateModel.value.substring(0, 2));
          dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
          if (dateValid.invalid || (date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
            if ((date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
            }
          } else {
            dateValid = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
          }
          //let year = ((date.getFullYear() - this.currentDate.getFullYear()) > 100) ? date.getFullYear() - 543 : date.getFullYear()
        }
      } else {
        dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
      }
    } else { //Date case

      if (!dateModel.value) {
        dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
      } else {
        let date = new Date(dateModel.model.year, Number(dateModel.model.month) - 1, dateModel.model.day);
        if ((date.getFullYear() - this.currentDate.getFullYear() > 80) || (date.getFullYear() - this.currentDate.getFullYear() < -80)) {
          dateValid = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
        } else {
          dateValid = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }
      }
    }
    return dateValid;
  }

  checkMaxDate(startDate: NgbDate, endDate: NgbDate) {
    if (startDate && endDate) {
      let st = new Date(startDate.year, startDate.month, startDate.day)
      let en = new Date(endDate.year, endDate.month, endDate.day)
      if (st >= en) {
        return startDate;
      }
    }
    return endDate;
  }
}
