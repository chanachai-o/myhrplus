import { Component, Injectable, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import localeThai from '@angular/common/locales/th'
import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate } from "@angular/common";
@Injectable()
@Component({
  selector: 'app-datepicker-i18n-thai',
  templateUrl: './datepicker-i18n-thai.component.html',
  styleUrls: ['./datepicker-i18n-thai.component.css']
})
export class DatepickerI18nThaiComponent extends NgbDatepickerI18n {
    private _locale = 'th'
    private _weekdaysShort: readonly string[]
    private _monthsShort: readonly string[]
    private _monthsFull: readonly string[]
    constructor(private translateService: TranslateService) {
        super()
        this._locale = this.translateService.currentLang
        registerLocaleData(localeThai)

        let weekdaysStartingOnSunday = getLocaleDayNames(this._locale, FormStyle.Standalone, TranslationWidth.Short)
        this._weekdaysShort = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7])

        this._monthsShort = getLocaleMonthNames(this._locale, FormStyle.Standalone, TranslationWidth.Abbreviated)
        this._monthsFull = getLocaleMonthNames(this._locale, FormStyle.Standalone, TranslationWidth.Wide)
        this.translateService.onLangChange.subscribe(
            (event: LangChangeEvent) => {
                this._locale = this.translateService.currentLang
                weekdaysStartingOnSunday = getLocaleDayNames(this._locale, FormStyle.Standalone, TranslationWidth.Short)
                this._weekdaysShort = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7])
                this._monthsShort = getLocaleMonthNames(this._locale, FormStyle.Standalone, TranslationWidth.Abbreviated)
                this._monthsFull = getLocaleMonthNames(this._locale, FormStyle.Standalone, TranslationWidth.Wide)
            }
        );
    }
    getWeekdayShortName(weekday: number): string {
        throw new Error('Method not implemented.')
    }
    getMonthShortName(month: number): string {
        return this._monthsShort[month - 1] || ''
    }
    getMonthFullName(month: number): string {
        return this._monthsFull[month - 1] || ''
    }
    getWeekdayLabel(weekday: number, width?: "long" | "short" | "narrow") {
        return this._weekdaysShort[weekday - 1] || ''
    }
    getDayAriaLabel(date: NgbDateStruct): string {
        const jsDate = new Date(date.year, date.month - 1, date.day)
        return formatDate(jsDate, 'fullDate', this._locale)
    }
    getYearNumerals(year: number): string {
        return String(year)
    }
}