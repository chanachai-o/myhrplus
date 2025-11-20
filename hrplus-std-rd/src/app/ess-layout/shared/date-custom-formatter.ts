import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DateCustomFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split("/");
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { day: toInteger(dateParts[0]), month: null!, year: null! };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return {
          day: toInteger(dateParts[0]),
          month: toInteger(dateParts[1]),
          year: null!
        };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return {
          day: toInteger(dateParts[0]),
          month: toInteger(dateParts[1]),
          year: toInteger(dateParts[2])
        };
      }
    }
    return null!;
  }

  format(date: NgbDateStruct): string {
    return date
      ? `${isNumber(date.day) ? padNumber(date.day) : ""}/${isNumber(date.month) ? padNumber(date.month) : ""}/${date.year
      }`
      : "";
  }

  ngbFormatYYYYMMDD(date: NgbDateStruct): string {
    if (typeof date == "object") {
      return date ?
        `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
        '';
    } else {
      return ""
    }
  }

  dateFormatYYYYMMDD(date: Date): string {
    function formatNN(number: number) {
      return ('0' + number.toString()).slice(-2)
    }
    return date.getFullYear() + "-" + formatNN(date.getMonth() + 1) + "-" + formatNN(date.getDate())
  }

  //tdate format "yyyy-MM-dd" to "dd-MM-yyyy"
  convertToDDMMYYYY(tdate: string): string {
    var ty = tdate.substring(0, 4);
    var tm = tdate.substring(5, 7);
    var td = tdate.substring(8, 10);
    return td + '-' + tm + '-' + ty;
  }
}
export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return "";
  }
}
