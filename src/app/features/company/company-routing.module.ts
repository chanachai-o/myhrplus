import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyDashboardComponent } from './dashboard/company-dashboard.component';

const routes: Routes = [
  {
    path: 'human-resources',
    children: [
      {
        path: 'company-type',
        loadComponent: () => import('./human-resources/company-type/company-type-list.component').then(m => {
          console.log('[Route] Company Type — โหลด component สำเร็จ (path: company-type)');
          return m.CompanyTypeListComponent;
        })
      },
      {
        path: 'company-group',
        loadComponent: () => import('./human-resources/company-group/company-group-list.component').then(m => m.CompanyGroupListComponent)
      },
      {
        path: 'bank-company',
        loadComponent: () => import('./human-resources/bank-company/bank-company-list.component').then(m => m.BankCompanyListComponent)
      },
      {
        path: 'company-asset',
        loadComponent: () => import('./human-resources/company-asset/asset-list.component').then(m => m.AssetModelListComponent)
      },
      {
        path: 'company-paper',
        loadComponent: () => import('./human-resources/company-paper/paper-list.component').then(m => m.PaperListComponent)
      },
      {
        path: 'branch-social-security',
        loadComponent: () => import('./human-resources/branch-social-security/branch-social-security-list.component').then(m => m.BranchSocialSecurityListComponent)
      },
      {
        path: 'division',
        loadComponent: () => import('./human-resources/division/division-list.component').then(m => m.DivisionModelListComponent)
      },
      {
        path: 'department',
        loadComponent: () => import('./human-resources/department/department-list.component').then(m => m.DepartmentModelListComponent)
      },
      {
        path: 'section',
        loadComponent: () => import('./human-resources/section/section-list.component').then(m => m.SectionModelListComponent)
      },
      {
        path: 'team',
        loadComponent: () => import('./human-resources/team/team-list.component').then(m => m.TeamListComponent)
      },
      {
        path: 't2',
        loadComponent: () => import('./human-resources/t2/t2-list.component').then(m => m.T2ListComponent)
      },
      {
        path: 't3',
        loadComponent: () => import('./human-resources/t3/t3-list.component').then(m => m.T3ListComponent)
      },
      {
        path: 't4',
        loadComponent: () => import('./human-resources/t4/t4-list.component').then(m => m.T4ListComponent)
      },
      {
        path: 'company',
        loadComponent: () => import('./human-resources/company/company-list.component').then(m => m.CompanyModelListComponent)
      },
      {
        path: 'branch',
        loadComponent: () => import('./human-resources/branch/branch-list.component').then(m => m.BranchModelListComponent)
      },
      {
        path: 'working-area',
        loadComponent: () => import('./human-resources/working-area/working-area-list.component').then(m => m.WorkingAreaListComponent)
      },
      {
        path: 'working-area-type',
        loadComponent: () => import('./human-resources/working-area-type/working-area-type-list.component').then(m => m.WorkingAreaTypeListComponent)
      },
      {
        path: 'pl',
        loadComponent: () => import('./human-resources/pl/pl-list.component').then(m => m.PLListComponent)
      },
      {
        path: 'approve-level',
        loadComponent: () => import('./human-resources/approve-level/approve-level-list.component').then(m => m.ApproveLevelListComponent)
      },
      {
        path: 'cost-center',
        loadComponent: () => import('./human-resources/cost-center/cost-center-list.component').then(m => m.CostCenterListComponent)
      },
      {
        path: 'workarea-location',
        loadComponent: () => import('./human-resources/workarea-location/workarea-location-list.component').then(m => m.WorkareaLocationListComponent)
      },
      {
        path: 'workarea-beacon',
        loadComponent: () => import('./human-resources/workarea-beacon/workarea-beacon-list.component').then(m => m.WorkareaBeaconListComponent)
      },
      {
        path: 'brand-store',
        loadComponent: () => import('./human-resources/brand-store/brand-store-list.component').then(m => m.BrandStoreListComponent)
      },
      {
        path: 'zone-type',
        loadComponent: () => import('./human-resources/zone-type/zone-type-list.component').then(m => m.ZoneTypeListComponent)
      },
      {
        path: 'position',
        loadComponent: () => import('./human-resources/position/position-list.component').then(m => m.PositionListComponent)
      },
      {
        path: 'workarea-store',
        loadComponent: () => import('./human-resources/workarea-store/workarea-store-list.component').then(m => m.WorkareaStoreListComponent)
      },
      {
        path: 'company-structure',
        loadComponent: () => import('./human-resources/company-structure/company-structure.component').then(m => m.CompanyStructureComponent)
      },
      // Default route for human-resources - must be last to avoid matching child routes
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./human-resources/human-resources-list.component').then(m => m.HumanResourcesListComponent)
      }
    ]
  },
  // HR sub-routes (job-description, master-file, manpower-analyst, manpower) - URL: /company/hr/...
  {
    path: 'hr',
    children: [
      {
        path: 'reporting-line',
        children: [
          { path: 'definition', loadComponent: () => import('./reporting-line/definition/reporting-line-definition-list.component').then(m => m.ReportingLineDefinitionListComponent) },
          { path: 'change-boss', loadComponent: () => import('./reporting-line/change-boss/change-boss.component').then(m => m.ChangeBossComponent) }
        ]
      },
      {
        path: 'job-description',
        children: [
          { path: 'position', loadComponent: () => import('./human-resources/position/position-list.component').then(m => m.PositionListComponent) },
          { path: 'position-group', loadComponent: () => import('./job-description/position-group/position-group-list.component').then(m => m.PositionGroupListComponent) },
          { path: 'job-group', loadComponent: () => import('./job-description/job-group/job-group-list.component').then(m => m.JobGroupListComponent) },
          { path: 'job-code-level', loadComponent: () => import('./job-description/job-code-level/job-code-level-list.component').then(m => m.JobCodeLevelListComponent) },
          { path: 'job-grade', loadComponent: () => import('./job-description/job-grade/job-grade-list.component').then(m => m.JobGradeListComponent) },
          { path: 'job-title', loadComponent: () => import('./job-description/job-title/job-title-list.component').then(m => m.JobTitleListComponent) }
        ]
      },
      {
        path: 'master-file',
        children: [
          { path: 'rounding-off', loadComponent: () => import('./master-file/rounding-off/rounding-off-list.component').then(m => m.RoundingOffListComponent) },
          { path: 'e-payslip-signature', loadComponent: () => import('./master-file/e-payslip-signature/e-payslip-signature-list.component').then(m => m.EPayslipSignatureListComponent) },
          { path: 'kc-kpi-group', loadComponent: () => import('./master-file/kc-kpi-group/kc-kpi-group-list.component').then(m => m.KcKpiGroupListComponent) },
          { path: 'change-code', loadComponent: () => import('./master-file/change-code/change-code.component').then(m => m.ChangeCodeComponent) },
          { path: 'key-competency', loadComponent: () => import('./master-file/key-competency/key-competency-list.component').then(m => m.KeyCompetencyListComponent) },
          { path: 'kpi', loadComponent: () => import('./master-file/kpi/kpi-list.component').then(m => m.KpiListComponent) }
        ]
      },
      {
        path: 'manpower-analyst',
        children: [
          { path: 'type', loadComponent: () => import('./manpower-analyst/type/manpower-type-list.component').then(m => m.ManpowerTypeListComponent) },
          { path: 'number-table', loadComponent: () => import('./manpower-analyst/number-table/number-table-list.component').then(m => m.NumberTableListComponent) },
          { path: 'number-data', loadComponent: () => import('./manpower-analyst/number-data/number-data-list.component').then(m => m.NumberDataListComponent) },
          { path: 'number-detail', loadComponent: () => import('./manpower-analyst/number-detail/number-detail-list.component').then(m => m.NumberDetailListComponent) }
        ]
      },
      {
        path: 'manpower',
        children: [
          { path: 'generate-budget', loadComponent: () => import('./manpower/generate-budget/generate-budget.component').then(m => m.GenerateBudgetComponent) },
          { path: 'approve-budget', loadComponent: () => import('./manpower/approve-budget/approve-budget.component').then(m => m.ApproveBudgetComponent) },
          { path: 'turnover-report', loadComponent: () => import('./manpower/turnover-report/turnover-report.component').then(m => m.TurnoverReportComponent) },
          { path: 'compare-payroll', loadComponent: () => import('./manpower/compare-payroll/compare-payroll.component').then(m => m.ComparePayrollComponent) },
          { path: 'report-reconcile', loadComponent: () => import('./manpower/report-reconcile/report-reconcile.component').then(m => m.ReportReconcileComponent) }
        ]
      },
      {
        path: 'setup',
        children: [
          { path: 'project-table', loadComponent: () => import('./setup/project-table/project-table-list.component').then(m => m.ProjectTableListComponent) }
        ]
      }
    ]
  },
  // ESS (Employee Self Service) - URL: /company/ess/...
  {
    path: 'ess',
    children: [
      { path: 'news-setup', loadComponent: () => import('./ess/news-setup/news-setup.component').then(m => m.NewsSetupComponent) },
      { path: 'event-setup', loadComponent: () => import('./ess/event-setup/event-setup-list.component').then(m => m.EventSetupListComponent) },
      { path: 'banner-setup', loadComponent: () => import('./ess/banner-setup/banner-setup-list.component').then(m => m.BannerSetupListComponent) },
      { path: 'handbook-setup', loadComponent: () => import('./ess/handbook-setup/handbook-setup-list.component').then(m => m.HandbookSetupListComponent) },
      { path: 'video-setup', loadComponent: () => import('./ess/video-setup/video-setup-list.component').then(m => m.VideoSetupListComponent) },
      { path: 'logo-setup', loadComponent: () => import('./ess/logo-setup/logo-setup.component').then(m => m.LogoSetupComponent) },
      { path: 'external-links-setup', loadComponent: () => import('./ess/external-links-setup/external-links-setup.component').then(m => m.ExternalLinksSetupComponent) },
      { path: 'vision-table', loadComponent: () => import('./ess/vision-table/vision-table.component').then(m => m.VisionTableComponent) },
      { path: 'mission-table', loadComponent: () => import('./ess/mission-table/mission-table.component').then(m => m.MissionTableComponent) },
      { path: 'company-history', loadComponent: () => import('./ess/company-history/company-history.component').then(m => m.CompanyHistoryComponent) },
      { path: 'regulation-group', loadComponent: () => import('./ess/regulation-group/regulation-group.component').then(m => m.RegulationGroupComponent) },
      { path: 'regulation-type', loadComponent: () => import('./ess/regulation-type/regulation-type.component').then(m => m.RegulationTypeComponent) },
      { path: 'regulation-table', loadComponent: () => import('./ess/regulation-table/regulation-table.component').then(m => m.RegulationTableComponent) }
    ]
  },
  // Terms Of Use - URL: /company/terms/...
  {
    path: 'terms',
    children: [
      { path: 'user-manual', loadComponent: () => import('./terms/user-manual/user-manual.component').then(m => m.UserManualComponent) }
    ]
  },
  // Dashboard route
  {
    path: 'dashboard',
    component: CompanyDashboardComponent
  },
  // Approve (TA01A08) - URL: /company/approve/...
  {
    path: 'approve',
    children: [
      { path: 'approve-box', loadComponent: () => import('./approve/approve-box/approve-box.component').then(m => m.ApproveBoxComponent) },
      { path: 'approve-box-employee', loadComponent: () => import('./approve/approve-box-employee/approve-box-employee.component').then(m => m.ApproveBoxEmployeeComponent) },
      { path: 'approve-box-employee-group', loadComponent: () => import('./approve/approve-box-employee-group/approve-box-employee-group.component').then(m => m.ApproveBoxEmployeeGroupComponent) },
      { path: 'adjust-approve-box-employee', loadComponent: () => import('./approve/adjust-approve-box-employee/adjust-approve-box-employee.component').then(m => m.AdjustApproveBoxEmployeeComponent) }
    ]
  },
  // Placeholder routes
  { path: 'ess-setup', component: CompanyDashboardComponent },
  { path: 'reports', component: CompanyDashboardComponent },
  // Default route - redirect to dashboard to avoid matching child routes
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
