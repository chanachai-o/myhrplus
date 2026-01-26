import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';
import { TeamFormComponent } from './team-form.component';
import { TRANSLATION_KEYS } from '@core/constants/translation-keys.constant';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    PageHeaderComponent,
    DataGridComponent,
    TeamFormComponent
  ],
  templateUrl: './team-list.component.html'
})
export class TeamListComponent implements OnInit {
  public service = inject(TeamService);
  private translate = inject(TranslateService);

  data$ = this.service.getAll();
  showModal = false;
  selectedItem: Team | null = null;

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
      { field: 'bu4id', headerText: this.translate.instant('company.team.column.bu4Id'), width: '120px' },
      { field: 'parent', headerText: this.translate.instant('company.team.column.parent'), width: '120px' },
      { field: 'tdesc', headerText: this.translate.instant('company.team.column.tdesc'), width: '200px' },
      { field: 'edesc', headerText: this.translate.instant('company.team.column.edesc'), width: '200px' },
      { field: 'short_name', headerText: this.translate.instant('company.team.column.shortName'), width: '100px' },
      {
        field: 'active',
        headerText: this.translate.instant('company.team.column.active'),
        width: '100px',
        type: 'boolean' as const,
        formatter: (value: string) => {
          return value === '1'
            ? this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.ACTIVE)
            : this.translate.instant(TRANSLATION_KEYS.COMMON.STATUS.INACTIVE);
        }
      },
      { field: 'build_date', headerText: this.translate.instant('company.team.column.buildDate'), type: 'date' as const, width: '120px' },
      { field: 'expire_date', headerText: this.translate.instant('company.team.column.expireDate'), type: 'date' as const, width: '120px' },
      { field: 'edit_date', headerText: this.translate.instant('company.team.column.editDate'), type: 'date' as const, width: '120px' }
    ];
  }

  onCreate() {
    this.selectedItem = null;
    this.showModal = true;
  }

  onEdit(item: Team) {
    this.selectedItem = item;
    this.showModal = true;
  }

  onSaveSuccess() {
    this.data$ = this.service.getAll(); // Refresh data
  }
}

