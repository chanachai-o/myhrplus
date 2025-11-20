import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MissionModel } from 'src/app/models/mission.model';
import { VissionModel } from 'src/app/models/vission.model';
import { CompanyService } from 'src/app/services/company.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-vision-mission',
  templateUrl: './vision-mission.component.html',
  styleUrls: ['./vision-mission.component.scss']
})
export class VisionMissionComponent implements OnInit {
  vissionData: VissionModel | undefined;
  missionData: MissionModel | undefined;
  vissionSafeHtml?: SafeHtml
  missionSafeHtml?: SafeHtml
  constructor(private comService: CompanyService, public cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer, public translateService: TranslateService
  ) {
    // WARNING: This component uses [innerHTML] to render HTML content fetched from a service.
    // This is a potential security risk (XSS) if the backend data is not properly sanitized.
    // This approach also bypasses Angular's template processing for the injected content.
    // RECOMMENDATION: If possible, refactor the backend to return structured text/data
    // and use standard Angular templates for rendering.

    this.comService.getVission().subscribe(vision => {
      this.vissionData = vision;
      this.setSafeHtml()
      this.cdr.markForCheck();
    });
    this.comService.getMission().subscribe(mission => {
      this.missionData = mission;
      this.setSafeHtml()
      this.cdr.markForCheck();
    });

    this.translateService.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        if (this.translateService.currentLang == "th") {
          this.vissionSafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.vissionData?.tdesc || ''));
          this.missionSafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.missionData?.tdesc || ''));
        } else {
          this.vissionSafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.vissionData?.edesc || ''));
          this.missionSafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.missionData?.edesc || ''));
        }
      }
    );
  }

  setSafeHtml() {
    if (this.translateService.currentLang == "th") {
      this.vissionSafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.vissionData?.tdesc || ''));
      this.missionSafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.missionData?.tdesc || ''));
    } else {
      this.vissionSafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.vissionData?.edesc || ''));
      this.missionSafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(this.missionData?.edesc || ''));
    }
  }

  ngOnInit(): void {
  }

  refreshContent(): void {
    // Reload vision data
    this.comService.getVission().subscribe(vision => {
      this.vissionData = vision;
      this.cdr.markForCheck();
    });

    // Reload mission data
    this.comService.getMission().subscribe(mission => {
      this.missionData = mission;
      this.cdr.markForCheck();
    });
  }


  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
