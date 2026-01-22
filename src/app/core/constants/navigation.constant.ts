/**
 * Navigation Constants
 * Constants สำหรับ sidebar navigation structure
 * รองรับ Rail + Drawer structure (Two-layer sidebar)
 */

export interface NavigationChild {
  label: string;
  route?: string; // Optional - parent groups may not have routes
  icon?: string;
  roles?: string[];
  badge?: string;
  badgeColor?: string;
  expanded?: boolean; // For accordion/collapsible state
  children?: NavigationChild[]; // Support nested children for sub-modules (up to 4 levels)
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;              // Icon หลักใน Rail ซ้ายสุด
  roles: string[];          // ['user', 'admin'] - ใครเห็นได้บ้าง
  route?: string;            // Optional - Dashboard route สำหรับโมดูล (หน้าแรกของโมดูล)
  children?: NavigationChild[]; // รายการที่จะไปโผล่ใน Drawer (Rail ที่ 2)
  badge?: string;
  badgeColor?: string;
}

/**
 * Navigation Items Configuration
 * กำหนดโครงสร้างเมนูสำหรับ sidebar
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  // กลุ่ม 0: Home (ทุกคนมีสิทธิ์เห็น)


  // กลุ่ม 1: Admin (ทุกคนเห็น - เป็น admin ตั้งแต่แรก)
  {
    id: 'admin',
    label: 'Admin',
    icon: 'home',   // icon หลักใน Rail ซ้ายสุด
    roles: ['user', 'admin'], // ทุกคนเห็น (เป็น admin ตั้งแต่แรก)
    route: '/home', // Dashboard route - หน้าแรกของโมดูล (default to home)
    children: [
      {
        label: 'Home',
        route: '/home',
        icon: 'home'
      },
      // Level 2: Company Management (มี Level 3-4)
      {
        label: 'Company Management',
        icon: 'company',
        route: '/company', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3 - เมนูของโมดูล Company
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/company',
            icon: 'dashboard'
          },
          // 1. Human Resources (CO01A)
          {
            label: 'Human Resources',
            icon: 'business',
            children: [ // Level 4
              // 1.1 Company Information
              {
                label: 'Company Information',
                icon: 'info',
                children: [
                  { label: 'Company Type', route: '/company/human-resources/company-type', icon: 'category' },
                  { label: 'Company Group', route: '/company/human-resources/company-group', icon: 'group_work' },
                  { label: "Bank's Company Information", route: '/company/human-resources/bank-company', icon: 'account_balance' },
                  { label: 'Company Assets Information', route: '/company/human-resources/company-asset', icon: 'inventory' },
                  { label: 'Company Papers Information', route: '/company/human-resources/company-paper', icon: 'description' },
                  { label: 'Company Structure', route: '/company/human-resources/company-structure', icon: 'account_tree' }
                ]
              },
              // 1.2 Branch and Business Unit
              {
                label: 'Branch and Business Unit',
                icon: 'account_tree',
                children: [
                  { label: 'Branch Social Security', route: '/company/human-resources/branch-social-security', icon: 'security' },
                  { label: 'Division', route: '/company/human-resources/division', icon: 'business' },
                  { label: 'Department', route: '/company/human-resources/department', icon: 'folder' },
                  { label: 'Section', route: '/company/human-resources/section', icon: 'folder_open' },
                  { label: 'Team', route: '/company/human-resources/team', icon: 'group' },
                  { label: 'T2', route: '/company/human-resources/t2', icon: 'label' },
                  { label: 'T3', route: '/company/human-resources/t3', icon: 'label' },
                  { label: 'T4', route: '/company/human-resources/t4', icon: 'label' },
                  { label: 'Company', route: '/company/human-resources/company', icon: 'business' },
                  { label: 'Branch', route: '/company/human-resources/branch', icon: 'store' },
                  { label: 'Working Area Table', route: '/company/human-resources/working-area', icon: 'location_on' },
                  { label: 'Working Area Type Table', route: '/company/human-resources/working-area-type', icon: 'category' },
                  { label: 'PL Table', route: '/company/human-resources/pl', icon: 'table_chart' },
                  { label: 'Approve Level Table', route: '/company/human-resources/approve-level', icon: 'verified' },
                  { label: 'Cost Center Table', route: '/company/human-resources/cost-center', icon: 'account_tree' },
                  { label: 'Latitude Longitude Work Area', route: '/company/human-resources/workarea-location', icon: 'location_on' },
                  { label: 'Work Area Location By Beacon', route: '/company/human-resources/workarea-beacon', icon: 'bluetooth_searching' },
                  { label: 'Brand Store Table (STORE)', route: '/company/human-resources/brand-store', icon: 'store' },
                  { label: 'Zone Type Table', route: '/company/human-resources/zone-type', icon: 'map' },
                  { label: 'WorkArea', route: '/company/human-resources/workarea-store', icon: 'work' }
                ]
              },
              // 1.3 Reporting Line
              {
                label: 'Reporting Line',
                icon: 'account_tree',
                children: [
                  { label: 'Reporting Line Definition', route: '/company/hr/reporting-line/definition', icon: 'account_tree' },
                  { label: 'Change Boss', route: '/company/hr/reporting-line/change-boss', icon: 'swap_horiz' }
                ]
              },
              // 1.4 Job Description
              {
                label: 'Job Description',
                icon: 'work',
                children: [
                  { label: 'Position Table', route: '/company/hr/job-description/position', icon: 'work' },
                  { label: 'Position Group Register', route: '/company/hr/job-description/position-group', icon: 'group_work' },
                  { label: 'Job Group Table', route: '/company/hr/job-description/job-group', icon: 'folder' },
                  { label: 'Job Grade Table', route: '/company/hr/job-description/job-grade', icon: 'trending_up' },
                  { label: 'Job Title Table', route: '/company/hr/job-description/job-title', icon: 'title' },
                  { label: 'Job Code Level Table', route: '/company/hr/job-description/job-code-level', icon: 'layers' }
                ]
              },
              // 1.5 Master File
              {
                label: 'Master File',
                icon: 'folder',
                children: [
                  { label: 'Rounding-off Table', route: '/company/hr/master-file/rounding-off', icon: 'calculate' },
                  { label: 'Change Master File Code', route: '/company/hr/master-file/change-code', icon: 'edit' },
                  { label: 'Signature for e-Payslip Master', route: '/company/hr/master-file/e-payslip-signature', icon: 'draw' },
                  { label: 'KC/KPI Group', route: '/company/hr/master-file/kc-kpi-group', icon: 'group' },
                  { label: 'Key Competency', route: '/company/hr/master-file/key-competency', icon: 'star' },
                  { label: 'Key Performance Indicators', route: '/company/hr/master-file/kpi', icon: 'assessment' }
                ]
              },
              // 1.6 Manpower Analyst
              {
                label: 'Manpower Analyst',
                icon: 'people',
                children: [
                  { label: 'Manpower Type', route: '/company/hr/manpower-analyst/type', icon: 'category' },
                  { label: 'Manpower Number Table', route: '/company/hr/manpower-analyst/number-table', icon: 'table_chart' },
                  { label: 'Manpower Number Data', route: '/company/hr/manpower-analyst/number-data', icon: 'data_usage' },
                  { label: 'Manpower Number Detail', route: '/company/hr/manpower-analyst/number-detail', icon: 'details' }
                ]
              },
              // 1.7 Manpower
              {
                label: 'Manpower',
                icon: 'people',
                children: [
                  { label: 'Generate Manpower Budget', route: '/company/hr/manpower/generate-budget', icon: 'add_chart' },
                  { label: 'Approve Manpower Budget', route: '/company/hr/manpower/approve-budget', icon: 'check_circle' },
                  { label: 'Turnover Report', route: '/company/hr/manpower/turnover-report', icon: 'assessment' },
                  { label: 'Compare Manpower and Payroll', route: '/company/hr/manpower/compare-payroll', icon: 'compare' },
                  { label: 'Report Excel Report Reconcile', route: '/company/hr/manpower/report-reconcile', icon: 'description' }
                ]
              },
              // 1.8 Setup
              {
                label: 'Setup',
                icon: 'settings',
                children: [
                  { label: 'Project Table', route: '/company/hr/setup/project-table', icon: 'folder' }
                ]
              }
            ]
          },
          // 2. Approve (TA01A08)
          {
            label: 'Approve',
            icon: 'check_circle',
            children: [ // Level 4
              { label: 'ApproveBox', route: '/company/approve/approve-box', icon: 'check_circle' },
              { label: 'ApproveBoxEmployee', route: '/company/approve/approve-box-employee', icon: 'person_check' },
              { label: 'ApproveBoxEmployeeGroup', route: '/company/approve/approve-box-employee-group', icon: 'group' },
              { label: 'AdjustApproveBoxEmployee', route: '/company/approve/adjust-approve-box-employee', icon: 'edit' }
            ]
          },
          // 3. Employee Self Service (CO04A)
          {
            label: 'Employee Self Service',
            icon: 'person',
            children: [ // Level 4
              { label: 'News Setup', route: '/company/ess/news-setup', icon: 'article' },
              { label: 'Event Setup', route: '/company/ess/event-setup', icon: 'event' },
              { label: 'Banner Setup', route: '/company/ess/banner-setup', icon: 'image' },
              { label: 'Handbook Setup', route: '/company/ess/handbook-setup', icon: 'book' },
              { label: 'Video Setup', route: '/company/ess/video-setup', icon: 'video_library' },
              { label: 'Logo Setup', route: '/company/ess/logo-setup', icon: 'image' },
              { label: 'External Links Setup', route: '/company/ess/external-links-setup', icon: 'link' },
              { label: 'Vision Table', route: '/company/ess/vision-table', icon: 'visibility' },
              { label: 'Mission Table', route: '/company/ess/mission-table', icon: 'flag' },
              { label: 'Company History', route: '/company/ess/company-history', icon: 'history' },
              { label: 'Regulation/Order/Notice Group Table', route: '/company/ess/regulation-group', icon: 'gavel' },
              { label: 'Regulation/Order/Notice Type Table', route: '/company/ess/regulation-type', icon: 'category' },
              { label: 'Regulation/Order/Notice Table', route: '/company/ess/regulation-table', icon: 'gavel' }
            ]
          }
        ]
      },
      // Level 2: Personal Management (มี Level 3-4)
      {
        label: 'Personal Management',
        icon: 'people',
        route: '/personal', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3 - เมนูของโมดูล Personal
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/personal',
            icon: 'dashboard'
          },
          // 1. Personal Information (PS01A02)
          {
            label: 'Personal Information',
            icon: 'person',
            children: [ // Level 4
              { label: 'New Hiring', route: '/personal/personal-info/new-hiring', icon: 'person_add' },
              { label: 'New Hiring Outsource', route: '/personal/personal-info/new-hiring-outsource', icon: 'person_add' },
              { label: 'Personal Information', route: '/personal/personal-info/personal-information', icon: 'person' },
              { label: 'Salary Information', route: '/personal/personal-info/salary-information', icon: 'attach_money' },
              { label: 'Work Information', route: '/personal/personal-info/work-information', icon: 'work' },
              { label: 'Work Information Outsource', route: '/personal/personal-info/work-information-outsource', icon: 'work' },
              { label: 'Tax/PVF', route: '/personal/personal-info/tax-pvf', icon: 'receipt' },
              { label: 'Y-T-D Detail', route: '/personal/personal-info/ytd-detail', icon: 'calendar_today' },
              { label: 'L-T-D Yearly Summary', route: '/personal/personal-info/ltd-yearly-summary', icon: 'summarize' },
              { label: 'Loan Details', route: '/personal/personal-info/loan-details', icon: 'account_balance' },
              { label: 'Grade and Appraisal', route: '/personal/personal-info/grade-appraisal', icon: 'star' },
              { label: 'Special Skill', route: '/personal/personal-info/special-skill', icon: 'psychology' },
              { label: 'Language Skills', route: '/personal/personal-info/language-skills', icon: 'translate' },
              { label: 'Beneficiary Details', route: '/personal/personal-info/beneficiary-details', icon: 'people' },
              { label: 'Surety Details', route: '/personal/personal-info/surety-details', icon: 'verified_user' },
              { label: 'Insurance Details', route: '/personal/personal-info/insurance-details', icon: 'health_and_safety' },
              { label: 'Education Background', route: '/personal/personal-info/education-background', icon: 'school' },
              { label: 'Employee Relations', route: '/personal/personal-info/employee-relations', icon: 'group' },
              { label: 'Working Experiences', route: '/personal/personal-info/working-experiences', icon: 'work_history' },
              { label: 'Other Card', route: '/personal/personal-info/other-card', icon: 'credit_card' },
              { label: 'Period of Absence', route: '/personal/personal-info/period-of-absence', icon: 'event_busy' },
              { label: 'Address Information', route: '/personal/personal-info/address-information', icon: 'home' },
              { label: 'Salary Bank Distribution', route: '/personal/personal-info/salary-bank-distribution', icon: 'account_balance' },
              { label: 'Provident Fund', route: '/personal/personal-info/provident-fund', icon: 'savings' },
              { label: 'Tax Index', route: '/personal/personal-info/tax-index', icon: 'calculate' },
              { label: 'Bonus Adjustment History', route: '/personal/personal-info/bonus-adjustment-history', icon: 'history' },
              { label: 'Document Reference', route: '/personal/personal-info/document-reference', icon: 'description' },
              { label: 'Awarding and Warning', route: '/personal/personal-info/awarding-warning', icon: 'gavel' },
              { label: 'Assets Information', route: '/personal/personal-info/assets-information', icon: 'inventory' },
              { label: 'Contract Information', route: '/personal/personal-info/contract-information', icon: 'description' },
              { label: 'Position Information', route: '/personal/personal-info/position-information', icon: 'work' },
              { label: 'Request Certificate Data', route: '/personal/personal-info/request-certificate-data', icon: 'certificate' },
              { label: 'Black List Detail', route: '/personal/personal-info/black-list-detail', icon: 'block' },
              { label: 'Handicapped History', route: '/personal/personal-info/handicapped-history', icon: 'accessible' },
              { label: 'Personal Note', route: '/personal/personal-info/personal-note', icon: 'note' },
              { label: 'Insignia Information', route: '/personal/personal-info/insignia-information', icon: 'military_tech' },
              { label: 'Activity Detail', route: '/personal/personal-info/activity-detail', icon: 'event' },
              { label: 'Training Detail', route: '/personal/personal-info/training-detail', icon: 'school' },
              { label: 'Mempl Manpower Number', route: '/personal/personal-info/mempl-manpower-number', icon: 'people' },
              { label: 'Act for Position', route: '/personal/personal-info/act-for-position', icon: 'work' },
              { label: 'Workarea Location', route: '/personal/personal-info/workarea-location', icon: 'place' }
            ]
          },
          // 2. Staff Movement (PS01A08)
          {
            label: 'Staff Movement',
            icon: 'swap_horiz',
            children: [ // Level 4
              { label: 'Create Staff Movement', route: '/personal/staff-movement/create-staff-movement', icon: 'add' },
              { label: 'Create Staff Contract Movement', route: '/personal/staff-movement/create-staff-contract-movement', icon: 'add' },
              { label: 'Employee Movement Retraceable', route: '/personal/staff-movement/employee-movement-retraceable', icon: 'history' },
              { label: 'View Movement Summary', route: '/personal/staff-movement/view-movement-summary', icon: 'summarize' },
              { label: 'Create Resign', route: '/personal/staff-movement/create-resign', icon: 'exit_to_app' },
              { label: 'List No Promotion', route: '/personal/staff-movement/list-no-promotion', icon: 'list' },
              { label: 'Turn Over Rate Report', route: '/personal/staff-movement/turn-over-rate-report', icon: 'assessment' },
              { label: 'Adjust Income Deduction', route: '/personal/staff-movement/adjust-income-deduction', icon: 'edit' },
              { label: 'Adjust Income Deduction History', route: '/personal/staff-movement/adjust-income-deduction-history', icon: 'history' }
            ]
          },
          // 3. Process (PS01A03)
          {
            label: 'Process',
            icon: 'settings',
            children: [ // Level 4
              { label: 'Generate New Staff Movement', route: '/personal/process/generate-new-staff-movement', icon: 'play_arrow' },
              { label: 'Generate Team Movement', route: '/personal/process/generate-team-movement', icon: 'play_arrow' },
              { label: 'Disclaimed Processing', route: '/personal/process/disclaimed-processing', icon: 'cancel' },
              { label: 'Transfer Organize Structure', route: '/personal/process/transfer-organize-structure', icon: 'swap_horiz' },
              { label: 'Process Organization Chart', route: '/personal/process/process-organization-chart', icon: 'account_tree' },
              { label: 'Import Yearly Salary Increase', route: '/personal/process/import-yearly-salary-increase', icon: 'upload' },
              { label: 'Transfer Loan Data To Payroll', route: '/personal/process/transfer-loan-data-to-payroll', icon: 'sync' },
              { label: 'Transfer Enforcement Data To Payroll', route: '/personal/process/transfer-enforcement-data-to-payroll', icon: 'sync' },
              { label: 'Generate Income Deduction Movement', route: '/personal/process/generate-income-deduction-movement', icon: 'play_arrow' }
            ]
          },
          // 4. Import Data (PS01A09)
          {
            label: 'Import Data',
            icon: 'upload',
            children: [ // Level 4
              { label: 'Copy Employee Information', route: '/personal/import-data/copy-employee-information', icon: 'content_copy' },
              { label: 'Import Movement Transaction', route: '/personal/import-data/import-movement-transaction', icon: 'upload' },
              { label: 'Import New/Rehire Employee', route: '/personal/import-data/import-new-rehire-employee', icon: 'upload' },
              { label: 'Update Employee', route: '/personal/import-data/update-employee', icon: 'update' },
              { label: 'Import Employee Bank', route: '/personal/import-data/import-employee-bank', icon: 'upload' },
              { label: 'Import Employee Relations', route: '/personal/import-data/import-employee-relations', icon: 'upload' },
              { label: 'Import Termination', route: '/personal/import-data/import-termination', icon: 'upload' }
            ]
          },
          // 5. Setup (PS01A01)
          {
            label: 'Setup',
            icon: 'settings',
            children: [ // Level 4
              { label: 'Title Prefix Table', route: '/personal/setup/title-prefix-table', icon: 'badge' },
              { label: 'Institution Type', route: '/personal/setup/institution-type', icon: 'business' },
              { label: 'Educational Institution Category', route: '/personal/setup/educational-institution-category', icon: 'school' },
              { label: 'Educational Background Table', route: '/personal/setup/educational-background-table', icon: 'menu_book' },
              { label: 'Educational Major Subject Table', route: '/personal/setup/educational-major-subject-table', icon: 'subject' },
              { label: 'Faculty Table', route: '/personal/setup/faculty-table', icon: 'account_balance' },
              { label: 'Educational Level Table', route: '/personal/setup/educational-level-table', icon: 'trending_up' },
              { label: 'District Table', route: '/personal/setup/district-table', icon: 'location_city' },
              { label: 'Province Table', route: '/personal/setup/province-table', icon: 'map' },
              { label: 'Country Table', route: '/personal/setup/country-table', icon: 'public' },
              { label: 'Zipcode Table', route: '/personal/setup/zipcode-table', icon: 'markunread_mailbox' },
              { label: 'Race Table', route: '/personal/setup/race-table', icon: 'group' },
              { label: 'Nationality Table', route: '/personal/setup/nationality-table', icon: 'flag' },
              { label: 'Religion Table', route: '/personal/setup/religion-table', icon: 'church' },
              { label: 'Relation Table', route: '/personal/setup/relation-table', icon: 'family_restroom' },
              { label: 'Grade Level Table', route: '/personal/setup/grade-level-table', icon: 'star' },
              { label: 'Special Abilities Group Table', route: '/personal/setup/special-abilities-group-table', icon: 'group' },
              { label: 'Special Abilities Table', route: '/personal/setup/special-abilities-table', icon: 'psychology' },
              { label: 'Language Skill', route: '/personal/setup/language-skill', icon: 'translate' },
              { label: 'Personal Cards Detail Table', route: '/personal/setup/personal-cards-detail-table', icon: 'credit_card' },
              { label: 'Vehicle Table', route: '/personal/setup/vehicle-table', icon: 'directions_car' },
              { label: 'Bank Table', route: '/personal/setup/bank-table', icon: 'account_balance' },
              { label: 'Bank Branch Table', route: '/personal/setup/bank-branch-table', icon: 'store' },
              { label: 'Loan Type Table', route: '/personal/setup/loan-type-table', icon: 'account_balance_wallet' },
              { label: 'Occupation Table', route: '/personal/setup/occupation-table', icon: 'work' },
              { label: 'Employee Level Access Register', route: '/personal/setup/employee-level-access-register', icon: 'security' },
              { label: 'Function Position Table', route: '/personal/setup/function-position-table', icon: 'work' },
              { label: 'Employee Group Table', route: '/personal/setup/employee-group-table', icon: 'group' },
              { label: 'Welfare Location Table', route: '/personal/setup/welfare-location-table', icon: 'place' },
              { label: 'Adjustment Reason Table', route: '/personal/setup/adjustment-reason-table', icon: 'edit' },
              { label: 'Goodness Badness Table', route: '/personal/setup/goodness-badness-table', icon: 'gavel' },
              { label: 'Reward Merit Table', route: '/personal/setup/reward-merit-table', icon: 'emoji_events' },
              { label: 'Document Table', route: '/personal/setup/document-table', icon: 'description' },
              { label: 'Resignation Reason Table', route: '/personal/setup/resignation-reason-table', icon: 'exit_to_app' },
              { label: 'Resigned Assess Table', route: '/personal/setup/resigned-assess-table', icon: 'assessment' },
              { label: 'Benefit Table', route: '/personal/setup/benefit-table', icon: 'favorite' },
              { label: 'Assets Type Table', route: '/personal/setup/assets-type-table', icon: 'category' },
              { label: 'Assets Table', route: '/personal/setup/assets-table', icon: 'inventory' },
              { label: 'Insignia Table', route: '/personal/setup/insignia-table', icon: 'military_tech' },
              { label: 'SSO Resignation Reason Table', route: '/personal/setup/sso-resignation-reason-table', icon: 'exit_to_app' },
              { label: 'Movement Type Active', route: '/personal/setup/movement-type-active', icon: 'swap_horiz' },
              { label: 'Master Setup Employee ID', route: '/personal/setup/master-setup-employee-id', icon: 'badge' },
              { label: 'Setup Employee ID Format', route: '/personal/setup/setup-employee-id-format', icon: 'format_align_center' },
              { label: 'Tax Allowance List Clearing', route: '/personal/setup/tax-allowance-list-clearing', icon: 'calculate' },
              { label: 'Employment Type', route: '/personal/setup/employment-type', icon: 'work' },
              { label: 'Status Detail', route: '/personal/setup/status-detail', icon: 'info' },
              { label: 'Surety Type', route: '/personal/setup/surety-type', icon: 'verified_user' },
              { label: 'Black List Group', route: '/personal/setup/black-list-group', icon: 'group' },
              { label: 'Black List', route: '/personal/setup/black-list', icon: 'block' },
              { label: 'Handicapped Type', route: '/personal/setup/handicapped-type', icon: 'accessible' },
              { label: 'Certificate Request Template', route: '/personal/setup/certificate-request-template', icon: 'description' },
              { label: 'Contract Party', route: '/personal/setup/contract-party', icon: 'handshake' },
              { label: 'Custom Salary Rate Table', route: '/personal/setup/custom-salary-rate-table', icon: 'attach_money' }
            ]
          },
          // 6. Legal Execution (PS01A05)
          {
            label: 'Legal Execution',
            icon: 'gavel',
            children: [ // Level 4
              { label: 'Money Register Enforcement', route: '/personal/legal-execution/money-register-enforcement', icon: 'account_balance' },
              { label: 'Enforcement Conditions', route: '/personal/legal-execution/enforcement-conditions', icon: 'rule' },
              { label: 'Court Master', route: '/personal/legal-execution/court-master', icon: 'gavel' },
              { label: 'Office Master', route: '/personal/legal-execution/office-master', icon: 'business' },
              { label: 'Payment Method Master', route: '/personal/legal-execution/payment-method-master', icon: 'payment' },
              { label: 'Legal Execution Transfer Process', route: '/personal/legal-execution/legal-execution-transfer-process', icon: 'sync' },
              { label: 'Legal Execution History Transfer Report', route: '/personal/legal-execution/legal-execution-history-transfer-report', icon: 'history' },
              { label: 'Summary List By Office Report', route: '/personal/legal-execution/summary-list-by-office-report', icon: 'assessment' },
              { label: 'Cover Form Envelope', route: '/personal/legal-execution/cover-form-envelope', icon: 'mail' },
              { label: 'Remittance Form', route: '/personal/legal-execution/remittance-form', icon: 'description' },
              { label: 'Mailing Form', route: '/personal/legal-execution/mailing-form', icon: 'mail' },
              { label: 'Employee Summary Report', route: '/personal/legal-execution/employee-summary-report', icon: 'assessment' },
              { label: 'Legal Execution Sequestration Money Report', route: '/personal/legal-execution/legal-execution-sequestration-money-report', icon: 'assessment' }
            ]
          },
          // 7. Options (PS04A)
          {
            label: 'Options',
            icon: 'tune',
            children: [ // Level 4
              { label: 'Export Data', route: '/personal/options/export-data', icon: 'download' },
              { label: 'Route Workflow', route: '/personal/options/route-workflow', icon: 'account_tree' }
            ]
          },
          // 8. Service Charge (PS05A)
          {
            label: 'Service Charge',
            icon: 'receipt',
            children: [ // Level 4
              { label: 'Service Charge Condition', route: '/personal/service-charge/service-charge-condition', icon: 'rule' },
              { label: 'Service Charge Profile', route: '/personal/service-charge/service-charge-profile', icon: 'person' }
            ]
          },
          // 9. Export Concur (PS06A)
          {
            label: 'Export Concur',
            icon: 'sync',
            children: [ // Level 4
              { label: 'Export Data To Concur', route: '/personal/export-concur/export-data-to-concur', icon: 'sync' }
            ]
          },
          // 10. PDPA Consent (PS010A)
          {
            label: 'PDPA Consent',
            icon: 'security',
            children: [ // Level 4
              { label: 'PDPA Consent Config', route: '/personal/pdpa-consent/pdpa-consent-config', icon: 'security' }
            ]
          },
          // 11. Terms Of Use (PS09A)
          {
            label: 'Terms Of Use',
            icon: 'menu_book',
            children: [ // Level 4
              { label: 'User Manual', route: '/personal/terms/user-manual', icon: 'menu_book' }
            ]
          }
        ]
      },
      // Level 2: Payroll Management (มี Level 3-4)
      {
        label: 'Payroll Management',
        icon: 'attach_money',
        route: '/payroll', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/payroll',
            icon: 'dashboard'
          },
          // 1. Transaction (PR03A)
          {
            label: 'Transaction',
            icon: 'swap_horiz',
            children: [ // Level 4
              {
                label: 'Before Processing',
                icon: 'play_circle_outline',
                children: [
                  { label: 'Employee Working Hour', route: '/payroll/transaction/before-processing/employee-working-hour', icon: 'access_time' },
                  { label: 'Irregular Income Deduction', route: '/payroll/transaction/before-processing/irregular-income-deduction', icon: 'edit' },
                  { label: 'Other Incomes Deductions', route: '/payroll/transaction/before-processing/other-incomes-deductions', icon: 'list' },
                  { label: 'Generate Salary Retroact', route: '/payroll/transaction/before-processing/generate-salary-retroact', icon: 'play_arrow' },
                  { label: 'Fixed Income Deduction', route: '/payroll/transaction/before-processing/fixed-income-deduction', icon: 'attach_money' },
                  { label: 'Irregular Income Deduction Emp', route: '/payroll/transaction/before-processing/irregular-income-deduction-emp', icon: 'person' },
                  { label: 'Transfer Employee Info', route: '/payroll/transaction/before-processing/transfer-employee-info', icon: 'sync' }
                ]
              },
              {
                label: 'Run Processing',
                icon: 'play_circle',
                children: [
                  { label: 'Run Processing', route: '/payroll/transaction/run-processing', icon: 'play_arrow' }
                ]
              },
              {
                label: 'After Processing',
                icon: 'check_circle',
                children: [
                  { label: 'After Processing', route: '/payroll/transaction/after-processing', icon: 'check_circle' }
                ]
              }
            ]
          },
          // 2. E-Payslip
          {
            label: 'E-Payslip',
            icon: 'receipt',
            children: [ // Level 4
              { label: 'E-Payslip', route: '/payroll/e-payslip', icon: 'receipt' }
            ]
          },
          // 3. Text File Transfer
          {
            label: 'Text File Transfer',
            icon: 'file_upload',
            children: [ // Level 4
              { label: 'Text File Transfer', route: '/payroll/text-file-transfer', icon: 'file_upload' }
            ]
          },
          // 4. Options
          {
            label: 'Options',
            icon: 'tune',
            children: [ // Level 4
              { label: 'Options', route: '/payroll/options', icon: 'tune' }
            ]
          },
          // 5. Setup
          {
            label: 'Setup',
            icon: 'settings',
            children: [ // Level 4
              { label: 'Setup', route: '/payroll/setup', icon: 'settings' }
            ]
          },
          // 6. Terms Of Use
          {
            label: 'Terms Of Use',
            icon: 'menu_book',
            children: [ // Level 4
              { label: 'User Manual', route: '/payroll/terms/user-manual', icon: 'menu_book' }
            ]
          }
        ]
      },
      // Level 2: Time Management (มี Level 3-4)
      {
        label: 'Time Management',
        icon: 'access_time',
        route: '/ta', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/ta',
            icon: 'dashboard'
          },
          // 1. Daily Attendance (TA01A051)
          {
            label: 'Daily Attendance',
            icon: 'calendar_today',
            children: [ // Level 4
              { label: 'Daily Attendance', route: '/ta/daily-attendance/daily', icon: 'calendar_today' },
              { label: 'Working Time Detail', route: '/ta/daily-attendance/working-time-detail', icon: 'access_time' },
              { label: 'Working Time Detail History', route: '/ta/daily-attendance/working-time-detail-history', icon: 'history' }
            ]
          },
          // 2. Transaction (TA01A02)
          {
            label: 'Transaction',
            icon: 'swap_horiz',
            children: [ // Level 4
              { label: 'Forget Punch Time', route: '/ta/transaction/forget-punch-time', icon: 'schedule' },
              { label: 'Working Hour Request', route: '/ta/transaction/working-hour-request', icon: 'request_quote' },
              { label: 'Work Hour Request By Supervisor', route: '/ta/transaction/work-hour-request-by-supervisor', icon: 'supervisor_account' }
            ]
          },
          // 3. Data Before Processing
          {
            label: 'Data Before Processing',
            icon: 'play_circle_outline',
            children: [ // Level 4
              { label: 'Data Before Processing', route: '/ta/data-before-processing', icon: 'play_circle_outline' }
            ]
          },
          // 4. On Process
          {
            label: 'On Process',
            icon: 'play_circle',
            children: [ // Level 4
              { label: 'On Process', route: '/ta/on-process', icon: 'play_circle' }
            ]
          },
          // 5. Data After Processing
          {
            label: 'Data After Processing',
            icon: 'check_circle',
            children: [ // Level 4
              { label: 'Data After Processing', route: '/ta/data-after-processing', icon: 'check_circle' }
            ]
          },
          // 6. History
          {
            label: 'History',
            icon: 'history',
            children: [ // Level 4
              { label: 'History', route: '/ta/history', icon: 'history' }
            ]
          },
          // 7. Options
          {
            label: 'Options',
            icon: 'tune',
            children: [ // Level 4
              { label: 'Options', route: '/ta/options', icon: 'tune' }
            ]
          },
          // 8. Setup
          {
            label: 'Setup',
            icon: 'settings',
            children: [ // Level 4
              { label: 'Setup', route: '/ta/setup', icon: 'settings' }
            ]
          },
          // 9. OT Scope
          {
            label: 'OT Scope',
            icon: 'schedule',
            children: [ // Level 4
              { label: 'OT Scope', route: '/ta/ot-scope', icon: 'schedule' }
            ]
          },
          // 10. Roster
          {
            label: 'Roster',
            icon: 'calendar_month',
            children: [ // Level 4
              { label: 'Roster', route: '/ta/roster', icon: 'calendar_month' }
            ]
          },
          // 11. Terms Of Use
          {
            label: 'Terms Of Use',
            icon: 'menu_book',
            children: [ // Level 4
              { label: 'User Manual', route: '/ta/terms/user-manual', icon: 'menu_book' }
            ]
          }
        ]
      },
      // Level 2: Training Management (มี Level 3-4)
      {
        label: 'Training Management',
        icon: 'school',
        route: '/training', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/training',
            icon: 'dashboard'
          },
          // 1. Setup (TR0101)
          {
            label: 'Setup',
            icon: 'settings',
            children: [ // Level 4
              {
                label: 'Courses',
                icon: 'book',
                children: [
                  { label: 'Course Types', route: '/training/setup/courses/course-types', icon: 'category' },
                  { label: 'Course Groups', route: '/training/setup/courses/course-groups', icon: 'group_work' },
                  { label: 'Course Categories', route: '/training/setup/courses/course-categories', icon: 'folder' },
                  { label: 'Training Type Table', route: '/training/setup/courses/training-type-table', icon: 'table_chart' },
                  { label: 'Courses/Program', route: '/training/setup/courses/courses-program', icon: 'book' },
                  { label: 'DSD Training Type', route: '/training/setup/courses/dsd-training-type', icon: 'category' }
                ]
              },
              {
                label: 'Other Master',
                icon: 'folder',
                children: [
                  { label: 'Other Master', route: '/training/setup/other-master', icon: 'folder' }
                ]
              }
            ]
          },
          // 2. Evaluation Process
          {
            label: 'Evaluation Process',
            icon: 'assessment',
            children: [ // Level 4
              { label: 'Evaluation Process', route: '/training/evaluation-process', icon: 'assessment' }
            ]
          },
          // 3. Transaction
          {
            label: 'Transaction',
            icon: 'swap_horiz',
            children: [ // Level 4
              { label: 'Transaction', route: '/training/transaction', icon: 'swap_horiz' }
            ]
          },
          // 4. History
          {
            label: 'History',
            icon: 'history',
            children: [ // Level 4
              { label: 'History', route: '/training/history', icon: 'history' }
            ]
          },
          // 5. Terms Of Use
          {
            label: 'Terms Of Use',
            icon: 'menu_book',
            children: [ // Level 4
              { label: 'User Manual', route: '/training/terms/user-manual', icon: 'menu_book' }
            ]
          }
        ]
      },
      // Level 2: Welfare Management (มี Level 3-4)
      {
        label: 'Welfare Management',
        icon: 'favorite',
        route: '/welfare', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/welfare',
            icon: 'dashboard'
          },
          // 1. Master (WE01A01)
          {
            label: 'Master',
            icon: 'folder',
            children: [ // Level 4
              { label: 'Budget Group', route: '/welfare/master/budget-group', icon: 'account_balance_wallet' },
              { label: 'Budget of Year', route: '/welfare/master/budget-of-year', icon: 'calendar_today' },
              { label: 'Location Group', route: '/welfare/master/location-group', icon: 'group' },
              { label: 'Location', route: '/welfare/master/location', icon: 'place' },
              { label: 'Disease Accident', route: '/welfare/master/disease-accident', icon: 'health_and_safety' },
              { label: 'Disease Accident Group', route: '/welfare/master/disease-accident-group', icon: 'group' },
              { label: 'Reference Document', route: '/welfare/master/reference-document', icon: 'description' }
            ]
          },
          // 2. Nursing Room (WE05A)
          {
            label: 'Nursing Room',
            icon: 'local_hospital',
            children: [ // Level 4
              { label: 'Nursing Room', route: '/welfare/nursing-room', icon: 'local_hospital' }
            ]
          },
          // 3. Requisition (WE01A02)
          {
            label: 'Requisition',
            icon: 'request_quote',
            children: [ // Level 4
              { label: 'Requisition', route: '/welfare/requisition', icon: 'request_quote' }
            ]
          },
          // 4. History (WE01A03)
          {
            label: 'History',
            icon: 'history',
            children: [ // Level 4
              { label: 'History', route: '/welfare/history', icon: 'history' }
            ]
          },
          // 5. Process (WE01A04)
          {
            label: 'Process',
            icon: 'settings',
            children: [ // Level 4
              { label: 'Process', route: '/welfare/process', icon: 'settings' }
            ]
          },
          // 6. Webboard (WE02A)
          {
            label: 'Webboard',
            icon: 'forum',
            children: [ // Level 4
              { label: 'Webboard', route: '/welfare/webboard', icon: 'forum' }
            ]
          },
          // 7. Employee (WE03A)
          {
            label: 'Employee',
            icon: 'person',
            children: [ // Level 4
              { label: 'Employee', route: '/welfare/employee', icon: 'person' }
            ]
          },
          // 8. Terms Of Use
          {
            label: 'Terms Of Use',
            icon: 'menu_book',
            children: [ // Level 4
              { label: 'User Manual', route: '/welfare/terms/user-manual', icon: 'menu_book' }
            ]
          }
        ]
      },
      // Level 2: Recruit Management (มี Level 3-4)
      {
        label: 'Recruit Management',
        icon: 'person_add',
        route: '/recruit', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/recruit',
            icon: 'dashboard'
          },
          // 1. Setup (RE01A01)
          {
            label: 'Setup',
            icon: 'settings',
            children: [ // Level 4
              { label: 'Basic Configuration', route: '/recruit/setup/basic-config', icon: 'settings' },
              { label: 'Interview Committee', route: '/recruit/setup/interview-committee', icon: 'people' },
              { label: 'Skill Level Config', route: '/recruit/setup/skill-level-config', icon: 'trending_up' },
              { label: 'Source of Job', route: '/recruit/setup/source-of-job', icon: 'link' },
              { label: 'Candidate Status', route: '/recruit/setup/candidate-status', icon: 'info' },
              { label: 'Urgency Status', route: '/recruit/setup/urgency-status', icon: 'priority_high' }
            ]
          },
          // 2. Process (RE01A02)
          {
            label: 'Process',
            icon: 'swap_horiz',
            children: [ // Level 4
              { label: 'Process', route: '/recruit/process', icon: 'swap_horiz' }
            ]
          },
          // 3. Jobboard
          {
            label: 'Jobboard',
            icon: 'work',
            children: [ // Level 4
              { label: 'Jobboard', route: '/recruit/jobboard', icon: 'work' }
            ]
          },
          // 4. Terms Of Use
          {
            label: 'Terms Of Use',
            icon: 'menu_book',
            children: [ // Level 4
              { label: 'User Manual', route: '/recruit/terms/user-manual', icon: 'menu_book' }
            ]
          }
        ]
      },
      // Level 2: Appraisal Management (มี Level 3-4)
      {
        label: 'Appraisal Management',
        icon: 'assessment',
        route: '/appraisal', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/appraisal',
            icon: 'dashboard'
          },
          // 1. Appraisal Type (AS03A)
          {
            label: 'Appraisal Type',
            icon: 'category',
            children: [ // Level 4
              { label: 'Appraisal Type Table', route: '/appraisal/appraisal-type/appraisal-type-table', icon: 'category' }
            ]
          },
          // 2. Appraisal Grade (AS04A)
          {
            label: 'Appraisal Grade',
            icon: 'star',
            children: [ // Level 4
              { label: 'Appraisal Grade', route: '/appraisal/appraisal-grade/appraisal-grade', icon: 'star' },
              { label: 'Grade Table', route: '/appraisal/appraisal-grade/grade-table', icon: 'table_chart' },
              { label: 'Score Deduct Criteria', route: '/appraisal/appraisal-grade/score-deduct-criteria', icon: 'remove_circle' },
              { label: 'Group Grade Salary Adjustment', route: '/appraisal/appraisal-grade/group-grade-salary-adjustment', icon: 'attach_money' }
            ]
          },
          // 3. Appraisal Topic (AS05A)
          {
            label: 'Appraisal Topic',
            icon: 'topic',
            children: [ // Level 4
              { label: 'Appraisal Topic', route: '/appraisal/appraisal-topic', icon: 'topic' }
            ]
          },
          // 4. Appraisal Form (AS06A)
          {
            label: 'Appraisal Form',
            icon: 'description',
            children: [ // Level 4
              { label: 'Appraisal Form', route: '/appraisal/appraisal-form', icon: 'description' }
            ]
          },
          // 5. Appraisal Form Type (AS08A)
          {
            label: 'Appraisal Form Type',
            icon: 'folder',
            children: [ // Level 4
              { label: 'Appraisal Form Type', route: '/appraisal/appraisal-form-type', icon: 'folder' }
            ]
          },
          // 6. Appraisal Document (AS07A)
          {
            label: 'Appraisal Document',
            icon: 'description',
            children: [ // Level 4
              { label: 'Appraisal Document', route: '/appraisal/appraisal-document', icon: 'description' }
            ]
          },
          // 7. Other Data Setup
          {
            label: 'Other Data Setup',
            icon: 'settings',
            children: [ // Level 4
              { label: 'Other Data Setup', route: '/appraisal/other-data-setup', icon: 'settings' }
            ]
          },
          // 8. Appraisal Period
          {
            label: 'Appraisal Period',
            icon: 'calendar_today',
            children: [ // Level 4
              { label: 'Appraisal Period', route: '/appraisal/appraisal-period', icon: 'calendar_today' }
            ]
          },
          // 9. Admin
          {
            label: 'Admin',
            icon: 'admin_panel_settings',
            children: [ // Level 4
              { label: 'Admin', route: '/appraisal/admin', icon: 'admin_panel_settings' }
            ]
          },
          // 10. OKR Appraisal
          {
            label: 'OKR Appraisal',
            icon: 'track_changes',
            children: [ // Level 4
              { label: 'OKR Appraisal', route: '/appraisal/okr-appraisal', icon: 'track_changes' }
            ]
          },
          // 11. Terms Of Use
          {
            label: 'Terms Of Use',
            icon: 'menu_book',
            children: [ // Level 4
              { label: 'User Manual', route: '/appraisal/terms/user-manual', icon: 'menu_book' }
            ]
          }
        ]
      },
      // Level 2: Settings (มี Level 3-4)
      {
        label: 'Settings',
        icon: 'setting',
        route: '/setting', // Dashboard route - หน้าแรกของโมดูล
        children: [ // Level 3
          // 0. Dashboard (หน้าแรก)
          {
            label: 'Dashboard',
            route: '/setting',
            icon: 'dashboard'
          },
          // 1. User (ST01A)
          {
            label: 'User',
            icon: 'person',
            children: [ // Level 4
              {
                label: 'Email Reminder',
                icon: 'email',
                children: [
                  { label: 'Email Master', route: '/setting/user/email-reminder/email-master', icon: 'email' },
                  { label: 'Email Template Content', route: '/setting/user/email-reminder/email-template-content', icon: 'description' },
                  { label: 'Probation Period Notification', route: '/setting/user/email-reminder/probation-period-notification', icon: 'notifications' },
                  { label: 'New Hire Notification', route: '/setting/user/email-reminder/new-hire-notification', icon: 'person_add' }
                ]
              }
            ]
          },
          // 2. System Access
          {
            label: 'System Access',
            icon: 'security',
            children: [ // Level 4
              { label: 'System Access', route: '/setting/system-access', icon: 'security' }
            ]
          },
          // 3. User Level
          {
            label: 'User Level',
            icon: 'trending_up',
            children: [ // Level 4
              { label: 'User Level', route: '/setting/user-level', icon: 'trending_up' }
            ]
          },
          // 4. Personal Data
          {
            label: 'Personal Data',
            icon: 'person',
            children: [ // Level 4
              { label: 'Personal Data', route: '/setting/personal-data', icon: 'person' }
            ]
          },
          // 5. Options
          {
            label: 'Options',
            icon: 'tune',
            children: [ // Level 4
              { label: 'Options', route: '/setting/options', icon: 'tune' }
            ]
          },
          // 6. Excel Report
          {
            label: 'Excel Report',
            icon: 'description',
            children: [ // Level 4
              { label: 'Excel Report', route: '/setting/excel-report', icon: 'description' }
            ]
          },
          // 7. Main Master Data
          {
            label: 'Main Master Data',
            icon: 'folder',
            children: [ // Level 4
              { label: 'Main Master Data', route: '/setting/main-master-data', icon: 'folder' }
            ]
          },
          // 8. Workflow Screen
          {
            label: 'Workflow Screen',
            icon: 'account_tree',
            children: [ // Level 4
              { label: 'Workflow Screen', route: '/setting/workflow-screen', icon: 'account_tree' }
            ]
          },
          // 9. Swap Language
          {
            label: 'Swap Language',
            icon: 'translate',
            children: [ // Level 4
              { label: 'Swap Language', route: '/setting/swap-language', icon: 'translate' }
            ]
          },
          // 10. Zeeme Interface
          {
            label: 'Zeeme Interface',
            icon: 'api',
            children: [ // Level 4
              { label: 'Zeeme Interface', route: '/setting/zeeme-interface', icon: 'api' }
            ]
          },
          // 11. Barcode Generator
          {
            label: 'Barcode Generator',
            icon: 'qr_code',
            children: [ // Level 4
              { label: 'Barcode Generator', route: '/setting/barcode-generator', icon: 'qr_code' }
            ]
          },
          // 12. Token Generator
          {
            label: 'Token Generator',
            icon: 'vpn_key',
            children: [ // Level 4
              { label: 'Token Generator', route: '/setting/token-generator', icon: 'vpn_key' }
            ]
          },
          // 13. Data Shop
          {
            label: 'Data Shop',
            icon: 'store',
            children: [ // Level 4
              { label: 'Data Shop', route: '/setting/data-shop', icon: 'store' }
            ]
          },
          // 14. Routing Config
          {
            label: 'Routing Config',
            icon: 'route',
            children: [ // Level 4
              { label: 'Routing Config', route: '/setting/routing-config', icon: 'route' }
            ]
          },
          // 15. Terms Of Use
          {
            label: 'Terms Of Use',
            icon: 'menu_book',
            children: [ // Level 4
              { label: 'User Manual', route: '/setting/terms/user-manual', icon: 'menu_book' }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Get navigation items filtered by user roles
 * @param userRoles User roles array
 * @returns Filtered navigation items
 */
export function getNavigationItemsByRoles(userRoles: string[]): NavigationItem[] {
  // Always return all navigation items - admin by default
  // No role filtering - everyone sees admin menu
  return NAVIGATION_ITEMS.map(item => {
    // Return all children without filtering
    if (item.children) {
      return { ...item, children: item.children };
    }
    return item;
  });
}

/**
 * Get navigation item by ID
 * @param id Navigation item ID
 * @returns Navigation item or null
 */
export function getNavigationItemById(id: string): NavigationItem | null {
  return NAVIGATION_ITEMS.find(item => item.id === id) || null;
}

/**
 * Get navigation child by route
 * @param route Route path
 * @returns Navigation child or null
 */
export function getNavigationChildByRoute(route: string): NavigationChild | null {
  for (const item of NAVIGATION_ITEMS) {
    if (item.children) {
      const child = item.children.find(c => c.route === route);
      if (child) {
        return child;
      }
    }
  }
  return null;
}

