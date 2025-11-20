import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { LangChangeEvent, TranslateService, TranslateModule } from "@ngx-translate/core";
import { CompanyHistoryModel } from "src/app/models/companyhistory.model";
import { CompanyService } from "src/app/services/company.service";
import { environment } from "src/environments/environment";
import { COMPANYPROFILE, comprofile } from "./data-company-profile";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule],
    selector: "app-company-profile",
    templateUrl: "./company-profile.component.html",
    styleUrls: ["./company-profile.component.scss"],
})
export class CompanyProfileComponent implements OnInit {
    history: CompanyHistoryModel[] | any;
    currentLang = "";
    safeHtml?: SafeHtml
    constructor(
        private comService: CompanyService,
        public cdr: ChangeDetectorRef,
        public translateService: TranslateService,
        private sanitizer: DomSanitizer
    ) {
        // WARNING: This component uses a highly unconventional and insecure method
        // to render content. It fetches raw HTML from a service and injects it
        // directly into the DOM using `insertAdjacentHTML`.
        //
        // SECURITY RISK: This is vulnerable to Cross-Site Scripting (XSS) attacks.
        // The HTML content from the backend is NOT sanitized.
        //
        // ARCHITECTURE ISSUE: This approach bypasses Angular's change detection,
        // data binding, and component lifecycle for the injected content.
        // Styling requires ::ng-deep, and it is difficult to maintain.
        //
        // RECOMMENDATION: Refactor the backend service to return structured data (JSON)
        // instead of raw HTML. The component should then use a proper Angular template
        // to render this data safely and efficiently.

        this.comService.getCompanyHistory().subscribe((comHis) => {
            this.currentLang = this.translateService.currentLang;
            this.history = comHis;
            //   this.history[0].tdesc = this.history[0].tdesc!.replace(
            //     new RegExp('img', "g"),
            //     'img style="height:253px!important; width:450px!important;"'
            //   );
            //   this.history[0].edesc = this.history[0].edesc!.replace(
            //     new RegExp('img', "g"),
            //     'img style="height:253px!important; width:450px!important;"'
            //   );
            this.history[0].tdesc = this.history[0].tdesc!.replaceAll(
                'src="/hr/FileDownload',
                'src="' + environment.jbossUrl + "/FileDownload"
            );

            this.history[0].edesc = this.history[0].edesc!.replaceAll(
                'src="/hr/FileDownload',
                'src="' + environment.jbossUrl + "/FileDownload"
            );
            if (this.translateService.currentLang == "th") {
                this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.history[0].tdesc || ''));
            } else {
                this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.history[0].edesc || ''));
            }
            //   this.tagDiv!.nativeElement.removeAttribute("style");
        });
        this.cdr.markForCheck();
    }

    ngOnInit(): void {
        this.translateService.onLangChange.subscribe(
            (event: LangChangeEvent) => {
                if (this.translateService.currentLang == "th") {
                    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.history[0].tdesc || ''));
                } else {
                    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.history[0].edesc || ''));
                }
            }
        );
    }

    refreshProfile(): void {
        // Reload company history
        this.comService.getCompanyHistory().subscribe((comHis) => {
            this.currentLang = this.translateService.currentLang;
            this.history = comHis;

            this.history[0].tdesc = this.history[0].tdesc!.replaceAll(
                'src="/hr/FileDownload',
                'src="' + environment.jbossUrl + "/FileDownload"
            );

            this.history[0].edesc = this.history[0].edesc!.replaceAll(
                'src="/hr/FileDownload',
                'src="' + environment.jbossUrl + "/FileDownload"
            );

            if (this.translateService.currentLang == "th") {
                this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.history[0].tdesc || ''));
            } else {
                this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.history[0].edesc || ''));
            }
        });
    }

    decodeHtml(html: string): string {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
}
