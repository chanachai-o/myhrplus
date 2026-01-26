import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { SectionService } from '../../services/section.service';
import { Section } from '../../models/section.model';
import { SectionFormComponent } from './section-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    SectionFormComponent
  ],
  templateUrl: './section-list.component.html'
})
export class SectionListComponent implements OnInit {
  public service = inject(SectionService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: Section | null = null;

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
      { field: 'bu3id', headerText: this.translate.instant('features.company.entities.section.column.bu3Id'), width: '120px' },
      { field: 'parent', headerText: this.translate.instant('features.company.entities.section.column.parent'), width: '120px' },
      { field: 'tdesc', headerText: this.translate.instant('features.company.entities.section.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('features.company.entities.section.column.edesc'), width: '200px' },
      { field: 'short_name', headerText: this.translate.instant('features.company.entities.section.column.shortName'), width: '100px' },
      {
        field: 'active',
        headerText: this.translate.instant('features.company.entities.section.column.active'),
        width: '100px',
        type: 'boolean' as const,
        formatter: (value: string) => {
          return value === '1'
            ? this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.ACTIVE)
            : this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.INACTIVE);
        }
      },
      { field: 'build_date', headerText: this.translate.instant('features.company.entities.section.column.buildDate'), type: 'date' as const, width: '120px' },
      { field: 'expire_date', headerText: this.translate.instant('features.company.entities.section.column.expireDate'), type: 'date' as const, width: '120px' },
      { field: 'edit_date', headerText: this.translate.instant('features.company.entities.section.column.editDate'), type: 'date' as const, width: '120px' }
    ];
  }

  onCreate() {
    this.selectedItem = null;
    this.showModal = true;
  }

  onEdit(item: Section) {
    this.selectedItem = item;
    this.showModal = true;
  }

  onSaveSuccess() {
    this.data$ = this.service.getAll(); // Refresh data
  }
}

