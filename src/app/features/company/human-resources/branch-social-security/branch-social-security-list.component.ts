import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { BranchSocialSecurityService } from '../../services/branch-social-security.service';
import { BranchSocialSecurity } from '../../models/branch-social-security.model';
import { BranchSocialSecurityFormComponent } from './branch-social-security-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-branch-social-security-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    BranchSocialSecurityFormComponent
  ],
  templateUrl: './branch-social-security-list.component.html'
})
export class BranchSocialSecurityListComponent implements OnInit {
  public service = inject(BranchSocialSecurityService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: BranchSocialSecurity | null = null;

  headerActions: any[] = [];
  columns: any[] = [];

  ngOnInit() {
    // Wait for translations to load, then initialize
    this.translate.get(TRANSLATION_KEYS.COMMON.ACTIONS.ADD).subscribe(() => {
      this.initializeTranslations();
    });
  }

  private initializeTranslations() {
    this.headerActions = [
      {
        label: this.translate.instant(TRANSLATION_KEYS.COMMON.ACTIONS.ADD),
        variant: 'primary' as const,
        onClick: () => this.onCreate()
      }
    ];

    this.columns = [
      { field: 'branch_no', headerText: this.translate.instant('features.company.entities.branchSocialSecurity.column.branchNo'), width: '150px' },
      { field: 'tdesc', headerText: this.translate.instant('features.company.entities.branchSocialSecurity.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('features.company.entities.branchSocialSecurity.column.edesc'), width: '200px' },
      { field: 'social_code', headerText: this.translate.instant('features.company.entities.branchSocialSecurity.column.socialCode'), width: '150px' },
      { field: 'social_sub_code', headerText: this.translate.instant('features.company.entities.branchSocialSecurity.column.socialSubCode'), width: '150px' },
      { field: 'tel', headerText: this.translate.instant('features.company.entities.branchSocialSecurity.column.tel'), width: '120px' },
      { field: 'edit_date', headerText: this.translate.instant('features.company.entities.branchSocialSecurity.column.editDate'), type: 'date' as const, width: '120px' }
    ];
  }

  onCreate() {
    this.selectedItem = null;
    this.showModal = true;
  }

  onEdit(item: BranchSocialSecurity) {
    this.selectedItem = item;
    this.showModal = true;
  }

  onSaveSuccess() {
    this.data$ = this.service.getAll(); // Refresh data
  }
}


