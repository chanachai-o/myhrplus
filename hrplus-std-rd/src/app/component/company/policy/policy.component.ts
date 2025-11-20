import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Policy } from 'src/app/models/policy.model';
import { CompanyService } from 'src/app/services/company.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

  @ViewChild("imgModal") imgModal: undefined;
  url = environment.jbossUrl;
  policyData: Policy[] | undefined;
  data = [];
  data2 = [];
  data3 = [];
  file: any
  constructor(private compService: CompanyService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef) {

    this.compService.getPolicy().subscribe(result => {
      this.policyData = result;
      this.cdr.markForCheck();
    });


  }
  ngOnInit(): void {
  }

  // New methods for modern UI
  refreshPolicies(): void {
    // Refresh policy data
    this.compService.getPolicy().subscribe(result => {
      this.policyData = result;
      this.cdr.markForCheck();
    });
  }

  previewFile(file: any): void {
    // Implement file preview functionality
    console.log('Previewing file:', file);
    this.file = file
    // Add preview logic here (e.g., open in modal, new tab, etc.)
    if (this.file) {
      this.openImg()
    }
  }

  openImg() {
    this.modalService.open(this.imgModal, {
      centered: true,
      // windowClass: "dialog-width",
      // fullscreen: true,
      size: 'xl'

    });
  }
}
