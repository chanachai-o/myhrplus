/**
 * Human Resources Menu Configuration
 * Configuration for menu items displayed in Human Resources list page
 */

export interface HumanResourcesMenuItem {
  code: string;           // Module code (e.g., CO01A0102)
  route: string;          // Route path (relative to /human-resources)
  icon: string;           // Material icon name
  labelThai: string;      // Thai label
  labelEnglish: string;   // English label
  description: string;    // Description (e.g., "Company Type (CS008)")
  category: 'company-information' | 'branch-business-unit'; // Category for grouping
  badgeColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red'; // Badge color
}

export const HUMAN_RESOURCES_MENU_ITEMS: HumanResourcesMenuItem[] = [
  // Company Information Section
  {
    code: 'CO01A0102',
    route: 'company-type',
    icon: 'business',
    labelThai: 'ประเภทบริษัท',
    labelEnglish: 'Company Type',
    description: 'Company Type (CS008)',
    category: 'company-information',
    badgeColor: 'blue'
  },
  {
    code: 'CO04A10',
    route: 'company-group',
    icon: 'layers',
    labelThai: 'กลุ่มบริษัท',
    labelEnglish: 'Company Group',
    description: 'Company Group (CS001)',
    category: 'company-information',
    badgeColor: 'blue'
  },
  {
    code: 'CO01A0110',
    route: 'bank-company',
    icon: 'account_balance',
    labelThai: 'ข้อมูลธนาคาร',
    labelEnglish: "Bank's Company Information",
    description: 'Bank Info (CS006)',
    category: 'company-information',
    badgeColor: 'blue'
  },
  {
    code: 'CO01A0116',
    route: 'company-asset',
    icon: 'inventory',
    labelThai: 'ทะเบียนทรัพย์สิน',
    labelEnglish: 'Company Assets Information',
    description: 'Company Assets (CS043)',
    category: 'company-information',
    badgeColor: 'blue'
  },
  {
    code: 'CO01A0117',
    route: 'company-paper',
    icon: 'description',
    labelThai: 'ทะเบียนเอกสาร',
    labelEnglish: 'Company Papers Information',
    description: 'Company Papers (CS045)',
    category: 'company-information',
    badgeColor: 'blue'
  },

  // Branch and Business Unit Section
  {
    code: 'CO01A0201',
    route: 'branch-social-security',
    icon: 'security',
    labelThai: 'ทะเบียนสาขาประกันสังคม',
    labelEnglish: 'Branch Social Security',
    description: 'Branch Social Security (CS047)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0202',
    route: 'division',
    icon: 'business',
    labelThai: 'ทะเบียนฝ่าย',
    labelEnglish: 'Division',
    description: 'Division (PRU002)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0203',
    route: 'department',
    icon: 'folder',
    labelThai: 'ทะเบียนแผนก',
    labelEnglish: 'Department',
    description: 'Department (PRU003)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0204',
    route: 'section',
    icon: 'folder_open',
    labelThai: 'ทะเบียนส่วน',
    labelEnglish: 'Section',
    description: 'Section (PRU004)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0205',
    route: 'team',
    icon: 'group',
    labelThai: 'ทะเบียนทีมงาน',
    labelEnglish: 'Team',
    description: 'Team (PRU005)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0206',
    route: 't2',
    icon: 'label',
    labelThai: 'T2',
    labelEnglish: 'T2',
    description: 'T2 (PRU037)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0208',
    route: 't3',
    icon: 'label',
    labelThai: 'T3',
    labelEnglish: 'T3',
    description: 'T3 (PRU238)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0209',
    route: 't4',
    icon: 'label',
    labelThai: 'T4',
    labelEnglish: 'T4',
    description: 'T4 (PRU239)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0207',
    route: 'company',
    icon: 'business',
    labelThai: 'ทะเบียนบริษัท',
    labelEnglish: 'Company',
    description: 'Company (PRU009)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0210',
    route: 'branch',
    icon: 'store',
    labelThai: 'ทะเบียนสาขาบริษัท',
    labelEnglish: 'Branch',
    description: 'Branch (PRU009_BRANCH)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0224',
    route: 'working-area',
    icon: 'location_on',
    labelThai: 'ทะเบียนสถานที่ทำงาน',
    labelEnglish: 'Working Area Table',
    description: 'Working Area (PRU031)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0224',
    route: 'working-area-type',
    icon: 'category',
    labelThai: 'ทะเบียนประเภทสถานที่ทำงาน',
    labelEnglish: 'Working Area Type Table',
    description: 'Working Area Type (PRU150_YUM)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0215',
    route: 'pl',
    icon: 'table_chart',
    labelThai: 'ทะเบียน PL',
    labelEnglish: 'PL Table',
    description: 'PL Table (CO030_PL)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0213',
    route: 'approve-level',
    icon: 'verified',
    labelThai: 'ทะเบียนสิทธิ์การอนุมัติ',
    labelEnglish: 'Approve Level Table',
    description: 'Approve Level (PRU_APPRVLEVEL)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0214',
    route: 'cost-center',
    icon: 'account_tree',
    labelThai: 'ทะเบียนคอร์สเซ้นเตอร์',
    labelEnglish: 'Cost Center Table',
    description: 'Cost Center (PRU034)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0219',
    route: 'workarea-location',
    icon: 'location_on',
    labelThai: 'ทะเบียนละติจูดลองจิจูดสถานที่ทำงาน',
    labelEnglish: 'Latitude Longitude Work Area',
    description: 'Latitude Longitude Work Area (CS052)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0220',
    route: 'workarea-beacon',
    icon: 'bluetooth_searching',
    labelThai: 'ทะเบียนสถานที่ทำงานโดยใช้บีคอน',
    labelEnglish: 'Work Area Location By Beacon',
    description: 'Work Area Location By Beacon (CS053)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0222',
    route: 'brand-store',
    icon: 'store',
    labelThai: 'ทะเบียนสาขาสโตร์ (STORE)',
    labelEnglish: 'Brand Store Table (STORE)',
    description: 'Brand Store (CS050)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0223',
    route: 'zone-type',
    icon: 'map',
    labelThai: 'ทะเบียน Zone Type',
    labelEnglish: 'Zone Type Table',
    description: 'Zone Type (CO050)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0401',
    route: 'position',
    icon: 'badge',
    labelThai: 'ทะเบียนตำแหน่ง',
    labelEnglish: 'Position Table',
    description: 'Position Table (PRU010)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  },
  {
    code: 'CO01A0221',
    route: 'workarea-store',
    icon: 'work',
    labelThai: 'สถานที่ทำงาน (WorkArea)',
    labelEnglish: 'WorkArea',
    description: 'WorkArea (PRU148_STORE)',
    category: 'branch-business-unit',
    badgeColor: 'green'
  }
];

/**
 * Get menu items by category
 */
export function getMenuItemsByCategory(category: HumanResourcesMenuItem['category']): HumanResourcesMenuItem[] {
  return HUMAN_RESOURCES_MENU_ITEMS.filter(item => item.category === category);
}

/**
 * Get all categories
 */
export function getCategories(): HumanResourcesMenuItem['category'][] {
  return Array.from(new Set(HUMAN_RESOURCES_MENU_ITEMS.map(item => item.category)));
}

