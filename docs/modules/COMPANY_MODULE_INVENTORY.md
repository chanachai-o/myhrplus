# Company Module - JSP Screen Inventory

## Overview
- **Total Screens**: ~150+ screens
- **Main Categories**: 5 categories
- **Active Menus**: 60+ menu items
- **Module Code**: CO (Company)
- **Base Path**: `hrAppWeb.war/COMPANY/`
- **Last Updated**: 2026-01-26

## Summary Statistics
- **Company Information**: 7 screens
- **Branch and Business Unit**: 18 screens
- **Reporting Line**: 2 screens
- **Job Description**: 6 screens
- **Master File**: 7 screens
- **Manpower Analyst**: 4 screens
- **Manpower**: 5 screens
- **Setup**: 1 screen
- **Approve**: 4 screens
- **Employee Self Service**: 13 screens
- **Reports**: 20+ reports
- **Terms Of Use**: 1 screen

---

## Angular Migration Status (ปัจจุบัน)

หน้าจอที่ migrate เป็น Angular แล้ว (มาตรฐาน Syncfusion DataGrid + Form + ConfirmationDialog + i18n หรือ placeholder) และมีเมนูใน Sidebar ครบ

### Human Resources — โครงสร้าง/รายงาน/ทะเบียน (14 หน้าจอ)
| หน้าจอ | Route | ประเภท |
|--------|-------|--------|
| Company Structure | `human-resources/company-structure` | placeholder |
| Reporting Line Definition | `hr/reporting-line/definition` | CRUD |
| Change Boss | `hr/reporting-line/change-boss` | placeholder |
| Job Grade Table | `hr/job-description/job-grade` | CRUD |
| Job Title Table | `hr/job-description/job-title` | CRUD |
| Change Master File Code | `hr/master-file/change-code` | placeholder |
| Key Competency | `hr/master-file/key-competency` | CRUD |
| KPI | `hr/master-file/kpi` | CRUD |
| Manpower Number Detail | `hr/manpower-analyst/number-detail` | CRUD |
| Approve Manpower Budget | `hr/manpower/approve-budget` | placeholder |
| Turnover Report | `hr/manpower/turnover-report` | placeholder |
| Compare Manpower and Payroll | `hr/manpower/compare-payroll` | placeholder |
| Report Excel Report Reconcile | `hr/manpower/report-reconcile` | placeholder |
| Project Table | `hr/setup/project-table` | CRUD |

### Job Description (HR) — `/company/hr/job-description/`
| หน้าจอ | Route | Components | i18n Key |
|--------|-------|------------|----------|
| Position Group Register | `position-group` | `job-description/position-group/*` | `company.positionGroup.*` |
| Job Group Table | `job-group` | `job-description/job-group/*` | `company.jobGroup.*` |
| Job Code Level Table | `job-code-level` | `job-description/job-code-level/*` | `company.jobCodeLevel.*` |

### Master File (HR) — `/company/hr/master-file/`
| หน้าจอ | Route | Components | i18n Key |
|--------|-------|------------|----------|
| Rounding-off Table | `rounding-off` | `master-file/rounding-off/*` | `company.roundingOff.*` |
| Signature for e-Payslip Master | `e-payslip-signature` | `master-file/e-payslip-signature/*` | `company.ePayslipSignature.*` |
| KC/KPI Group | `kc-kpi-group` | `master-file/kc-kpi-group/*` | `company.kcKpiGroup.*` |

### Manpower Analyst (HR) — `/company/hr/manpower-analyst/`
| หน้าจอ | Route | Components | i18n Key |
|--------|-------|------------|----------|
| Manpower Type | `type` | `manpower-analyst/type/*` | `company.manpowerType.*` |
| Manpower Number Table | `number-table` | `manpower-analyst/number-table/*` | `company.manpowerNumberTable.*` |
| Manpower Number Data | `number-data` | `manpower-analyst/number-data/*` | `company.manpowerNumberData.*` |

### Manpower (HR) — `/company/hr/manpower/`
| หน้าจอ | Route | Components | i18n Key |
|--------|-------|------------|----------|
| Generate Manpower Budget | `generate-budget` | `manpower/generate-budget/*` (placeholder) | `company.generateBudget.*` |

### Employee Self Service (ESS) — `/company/ess/`
| หน้าจอ | Route | Components | i18n Key |
|--------|-------|------------|----------|
| News Setup | `news-setup` | `ess/news-setup/*` (placeholder) | `company.newsSetup.*` |
| Event Setup | `event-setup` | `ess/event-setup/*` | `company.eventSetup.*` |
| Banner Setup | `banner-setup` | `ess/banner-setup/*` | `company.bannerSetup.*` |
| Handbook Setup | `handbook-setup` | `ess/handbook-setup/*` | `company.handbookSetup.*` |
| Video Setup | `video-setup` | `ess/video-setup/*` | `company.videoSetup.*` |
| Logo Setup | `logo-setup` | `ess/logo-setup/*` (placeholder) | `company.logoSetup.*` |
| External Links Setup | `external-links-setup` | `ess/external-links-setup/*` (placeholder) | `company.externalLinksSetup.*` |
| Vision Table | `vision-table` | `ess/vision-table/*` (placeholder) | `company.visionTable.*` |
| Mission Table | `mission-table` | `ess/mission-table/*` (placeholder) | `company.missionTable.*` |
| Company History | `company-history` | `ess/company-history/*` (placeholder) | `company.companyHistory.*` |
| Regulation/Order/Notice Group Table | `regulation-group` | `ess/regulation-group/*` (placeholder) | `company.regulationGroup.*` |
| Regulation/Order/Notice Type Table | `regulation-type` | `ess/regulation-type/*` (placeholder) | `company.regulationType.*` |
| Regulation/Order/Notice Table | `regulation-table` | `ess/regulation-table/*` (placeholder) | `company.regulationTable.*` |

### Approve (TA01A08) — `/company/approve/`
| หน้าจอ | Route | Components | i18n Key |
|--------|-------|------------|----------|
| ApproveBox | `approve-box` | `approve/approve-box/*` (placeholder) | `company.approveBox.*` |
| ApproveBoxEmployee | `approve-box-employee` | `approve/approve-box-employee/*` (placeholder) | `company.approveBoxEmployee.*` |
| ApproveBoxEmployeeGroup | `approve-box-employee-group` | `approve/approve-box-employee-group/*` (placeholder) | `company.approveBoxEmployeeGroup.*` |
| AdjustApproveBoxEmployee | `adjust-approve-box-employee` | `approve/adjust-approve-box-employee/*` (placeholder) | `company.adjustApproveBoxEmployee.*` |

### Terms Of Use — `/company/terms/`
| หน้าจอ | Route | Components | i18n Key |
|--------|-------|------------|----------|
| User Manual | `user-manual` | `terms/user-manual/*` (placeholder) | `company.userManual.*` |

### อ้างอิง
- **Routing**: `src/app/features/company/company-routing.module.ts`
- **Sidebar เมนู**: `src/app/core/constants/navigation.constant.ts` (Company Management → Human Resources / Employee Self Service)
- **Reference implementation**: Company Type — `docs/migration/COMPANY_TYPE_MIGRATION_GUIDE.md`

---

## หน้าจอที่ยังไม่ Migrate (ควรนำมาใส่)

หน้าจอต่อไปนี้มีใน JSP Inventory และ/หรือมีเมนูใน Sidebar แล้ว แต่ยังไม่มี Angular component (list/form) หรือ route จริง — แนะนำให้ migrate ตาม pattern ใน `docs/migration/COMPANY_TYPE_MIGRATION_GUIDE.md`

### 1. Human Resources — **Migrated (14 หน้าจอ: CRUD + placeholder)**  
→ ดู Angular Migration Status ด้านบน

### 2. Approve (TA01A08) — **Migrated (placeholder)**  
→ ดู Angular Migration Status ด้านบน

### 3. Employee Self Service (ESS) — **Migrated (placeholder สำหรับ 9 หน้าจอใหม่)**  
→ ดู Angular Migration Status ด้านบน

### 4. Reports (CO02A)

- รายงาน 20+ ตัว (ROI1001–ROI10xx ฯลฯ) — ส่วนใหญ่เป็น Report/Export ไม่ใช่หน้าทะเบียน CRUD; อาจทำเป็นหน้าสร้างรายงานหรือลิงก์ไประบบรายงานแยก

### 5. Terms Of Use — **Migrated (placeholder)**  
→ ดู Angular Migration Status ด้านบน (User Manual: `/company/terms/user-manual`)

---

**สรุปจำนวนที่ยังไม่ migrate (หน้าทะเบียน/เมนูหลัก):**

- **Human Resources**: ทำครบ 14 หน้าจอแล้ว (CRUD + placeholder)
- **Approve**: ทำครบ 4 หน้าจอแล้ว (placeholder)
- **ESS**: ทำครบ 13 หน้าจอแล้ว (4 CRUD + 9 placeholder)
- **Terms Of Use**: ทำครบ 1 หน้าจอแล้ว (placeholder)
- **Reports**: 20+ รายงาน (ยังไม่ migrate — แยกประเภทงานออกจากทะเบียน CRUD)

---

## 1. Human Resources (CO01A)

### 1.1 Company Information (CO01A01)

#### 1.1.1 Company Type (CO01A0102)
- **Menu Name (Thai)**: ทะเบียนประเภทบริษัท
- **Menu Name (English)**: Company Type
- **JSP Files**: 
  - `CS008.jsp` - Main screen
- **Permissions**: 
  - Active: Yes (activepermis="1")
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Related Files**: 
  - `CS008031001.jsp` - Related child page

#### 1.1.2 Company Group (CO04A10)
- **Menu Name (Thai)**: การจัดการกลุ่มบริษัท
- **Menu Name (English)**: Company Group
- **JSP Files**: 
  - `CS001_STD.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Note**: Replaces old CS001.jsp

#### 1.1.3 Bank's Company Information (CO01A0110)
- **Menu Name (Thai)**: ข้อมูลธนาคารของบริษัท
- **Menu Name (English)**: Bank's Company Information
- **JSP Files**: 
  - `CS006.jsp` - Main screen
  - `CS002.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.1.4 Company Assets Information (CO01A0116)
- **Menu Name (Thai)**: ทะเบียนทรัพย์สินบริษัท
- **Menu Name (English)**: Company Assets Information
- **JSP Files**: 
  - `CS043.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.1.5 Company Papers Information (CO01A0117)
- **Menu Name (Thai)**: ทะเบียนเอกสาร
- **Menu Name (English)**: Company Papers Information
- **JSP Files**: 
  - `CS045.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.1.6 Company Structure (CO01A0122)
- **Menu Name (Thai)**: โครงสร้างบริษัท
- **Menu Name (English)**: Company Structure
- **JSP Files**: 
  - `COBRANCHLIST.jsp` - Main screen
  - `ALLBRANCHLIST.jsp` - All branches list
  - `ALLEMPLIST.jsp` - All employees list
  - `COBRANCHLIST_PRE_EXPORT.jsp` - Pre-export screen
  - `COBRANCHLIST_EXPORT.jsp` - Export screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

---

### 1.2 Branch and Business Unit (CO01A02)

#### 1.2.1 Branch Social Security (CO01A0201)
- **Menu Name (Thai)**: ทะเบียนสาขาประกันสังคม
- **Menu Name (English)**: Branch Social Security
- **JSP Files**: 
  - `CS047.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.2.2 Division (CO01A0202)
- **Menu Name (Thai)**: ทะเบียนฝ่าย
- **Menu Name (English)**: Division
- **JSP Files**: 
  - `PRU002.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BU01

#### 1.2.3 Department (CO01A0203)
- **Menu Name (Thai)**: ทะเบียนแผนก
- **Menu Name (English)**: Department
- **JSP Files**: 
  - `PRU003.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BU02

#### 1.2.4 Section (CO01A0204)
- **Menu Name (Thai)**: ทะเบียนส่วน
- **Menu Name (English)**: Section
- **JSP Files**: 
  - `PRU004.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BU03

#### 1.2.5 Team (CO01A0205)
- **Menu Name (Thai)**: ทะเบียนทีมงาน
- **Menu Name (English)**: TEAM
- **JSP Files**: 
  - `PRU005.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BU4_B

#### 1.2.6 T2 (CO01A0206)
- **Menu Name (Thai)**: T2
- **Menu Name (English)**: T2
- **JSP Files**: 
  - `PRU037.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BU5_A

#### 1.2.7 T3 (CO01A0208)
- **Menu Name (Thai)**: T3
- **Menu Name (English)**: T3
- **JSP Files**: 
  - `PRU238.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BU6_A

#### 1.2.8 T4 (CO01A0209)
- **Menu Name (Thai)**: T4
- **Menu Name (English)**: T4
- **JSP Files**: 
  - `PRU239.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BU7_A

#### 1.2.9 Company (CO01A0207)
- **Menu Name (Thai)**: ทะเบียนบริษัท
- **Menu Name (English)**: Company
- **JSP Files**: 
  - `PRU009.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: COMPANYMENU

#### 1.2.10 Branch (CO01A0210)
- **Menu Name (Thai)**: ทะเบียนสาขาบริษัท
- **Menu Name (English)**: Branch
- **JSP Files**: 
  - `PRU009_BRANCH.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BRANCHMENU

#### 1.2.11 Working Area Table (CO01A0224)
- **Menu Name (Thai)**: ทะเบียนสถานที่ทำงาน
- **Menu Name (English)**: Working Area Table
- **JSP Files**: 
  - `PRU031.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: WORKAREAMENU

#### 1.2.12 Working Area Type Table (CO01A0224)
- **Menu Name (Thai)**: ทะเบียนประเภทสถานที่ทำงาน
- **Menu Name (English)**: Working Area Type Table
- **JSP Files**: 
  - `PRU150_YUM.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: WORKAREAMENU

#### 1.2.13 PL Table (CO01A0215)
- **Menu Name (Thai)**: ทะเบียน PL
- **Menu Name (English)**: PL Table
- **JSP Files**: 
  - `CO030_PL.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: PLMENU

#### 1.2.14 Approve Level Table (CO01A0213)
- **Menu Name (Thai)**: ทะเบียนสิทธิ์การอนุมัติ
- **Menu Name (English)**: Approve Level Table
- **JSP Files**: 
  - `PRU_APPRVLEVEL.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.2.15 Latitude Longitude Work Area (CO01A0219)
- **Menu Name (Thai)**: ทะเบียนละติจูดลองจิจูดสถานที่ทำงาน
- **Menu Name (English)**: Latitude Longitude Work Area
- **JSP Files**: 
  - `CS052.jsp` - Main screen
  - `CS052_CHILD.jsp` - Child screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.2.16 Work Area Location By Beacon (CO01A0220)
- **Menu Name (Thai)**: ทะเบียนสถานที่ทำงานโดยใช้บีคอน
- **Menu Name (English)**: Work Area Location By Bacon
- **JSP Files**: 
  - `CS053.jsp` - Main screen
  - `CS053_CHILD.jsp` - Child screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.2.17 WorkArea (CO01A0221)
- **Menu Name (Thai)**: สถานที่ทำงาน (WorkArea)
- **Menu Name (English)**: WorkArea
- **JSP Files**: 
  - `PRU148_STORE.jsp` - Main screen
  - `PRU148_VIEW.jsp` - View screen
  - `PRU148_VIEW_CHILD.jsp` - View child screen
  - `PRU148_VIEW_EMP.jsp` - View employee screen
  - `PRU0310_YUM1.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.2.18 Brand Store Table (STORE) (CO01A0222)
- **Menu Name (Thai)**: ทะเบียนสาขาสโตร์ (STORE)
- **Menu Name (English)**: Brand Store Table (STORE)
- **JSP Files**: 
  - `CS050.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Language Code**: BST1

#### 1.2.19 Zone Type Table (CO01A0223)
- **Menu Name (Thai)**: ทะเบียน Zone Type
- **Menu Name (English)**: Zone Type Table
- **JSP Files**: 
  - `CO050.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

---

### 1.3 Reporting Line (CO01A03)

#### 1.3.1 Reporting Line Definition (CO01A0301)
- **Menu Name (Thai)**: สายบังคับบัญชา
- **Menu Name (English)**: Reporting Line Definition
- **JSP Files**: 
  - `CI_01_22.jsp` - Main screen
  - `CI_01_20.jsp` - Related screen
  - `CI_01_21.jsp` - Related screen
  - `PRU085.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.3.2 Change Boss (CO01A0302)
- **Menu Name (Thai)**: เปลี่ยนหัวหน้างาน
- **Menu Name (English)**: Change Boss
- **JSP Files**: 
  - `CI_01_23.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: No
  - Delete: No

---

### 1.4 Job Description (CO01A04)

#### 1.4.1 Position Table (CO01A0401)
- **Menu Name (Thai)**: ทะเบียนตำแหน่ง
- **Menu Name (English)**: Position Table
- **JSP Files**: 
  - `PRU010.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.4.2 Position Group Register (CO01A0406)
- **Menu Name (Thai)**: ทะเบียนกลุ่มตำแหน่ง
- **Menu Name (English)**: Position Group Register
- **JSP Files**: 
  - `CI_09.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.4.3 Job Group Table (CO01A0402)
- **Menu Name (Thai)**: ทะเบียนกลุ่มงาน
- **Menu Name (English)**: Job Group Table
- **JSP Files**: 
  - `CI_08.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.4.4 Job Grade Table (CO01A0403)
- **Menu Name (Thai)**: ทะเบียนตารางกระบอกเงินเดือน
- **Menu Name (English)**: Job Grade Table
- **JSP Files**: 
  - `PRU020.jsp` - Main screen
  - `PRU094.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.4.5 Job Title Table (CO01A040402)
- **Menu Name (Thai)**: ทะเบียนลักษณะงาน
- **Menu Name (English)**: Job Title Table
- **JSP Files**: 
  - `CI_01_GPF.jsp` - Main screen
  - `CI_01_14_GPF.jsp` - Related screen
  - `CI_01_15.jsp` - Related screen
  - `CI_01_8.jsp` - Related screen
  - `CI_01_3.jsp` - Related screen
  - `CI_01_9.jsp` - Related screen
  - `CI_01_7.jsp` - Related screen
  - `CI_01_10.jsp` - Related screen
  - `CI_01_5_GPF.jsp` - Related screen
  - `CI_01_5_STD.jsp` - Related screen
  - `CI_01_5_STD_HELP.jsp` - Help screen
  - `CI_01_12.jsp` - Related screen
  - `CI_01_19_KC_KPI.jsp` - Related screen
  - `CI_01_25.jsp` - Related screen
  - `CI_01_25A_HELP.jsp` - Help screen
  - `CI_01_25B_HELP.jsp` - Help screen
  - `CI_01_15A.jsp` - Related screen
  - `CI_01_8A.jsp` - Related screen
  - `CI_01_9A.jsp` - Related screen
  - `CI_01_7A.jsp` - Related screen
  - `CI_01_5A.jsp` - Related screen
  - `CI_01_12A.jsp` - Related screen
  - `CI_01_25A.jsp` - Related screen
  - `CI_01_25B.jsp` - Related screen
  - `CI_01_26.jsp` - Related screen
  - `CI_01_26A.jsp` - Related screen
  - `CI_01_27.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Note**: Complex screen with many related pages

#### 1.4.6 Job Code Level Table (CO01A0405)
- **Menu Name (Thai)**: ทะเบียนระดับลักษณะงาน
- **Menu Name (English)**: Job Code Level Table
- **JSP Files**: 
  - `CO043.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

---

### 1.5 Master File (CO01A05)

#### 1.5.1 Rounding-off Table (CO01A0501)
- **Menu Name (Thai)**: ตั้งค่าการปัดเศษ
- **Menu Name (English)**: Rounding-off Table
- **JSP Files**: 
  - `CS003.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes
- **Related Files**: 
  - `CS003HELP.jsp` - Help screen
  - `CS003OLD.jsp` - Old version

#### 1.5.2 Change Master File Code (CO01A0503)
- **Menu Name (Thai)**: เปลี่ยนรหัสทะเบียนหลัก
- **Menu Name (English)**: Change Master File Code
- **JSP Files**: 
  - `CO025.jsp` - Main screen
  - `CO025_CHK.jsp` - Check screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: No
  - Delete: No

#### 1.5.3 Signature for e-Payslip Master (CO01A0504)
- **Menu Name (Thai)**: ทะเบียนกำหนดลายเซ็นต์สำหรับ e-payslip
- **Menu Name (English)**: Signature for e-Payslip Master
- **JSP Files**: 
  - `CO026SIG.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.5.4 KC/KPI Group (CO01A0505)
- **Menu Name (Thai)**: กลุ่ม KC/KPI
- **Menu Name (English)**: KC/KPI Group
- **JSP Files**: 
  - `CI_05.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.5.5 Key Competency (CO01A0506)
- **Menu Name (Thai)**: ทะเบียน KC
- **Menu Name (English)**: Key Competency
- **JSP Files**: 
  - `CO030.jsp` - Main screen
  - `CO031.jsp` - Related screen
  - `CO032.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.5.6 Key Performance Indicators (CO01A0507)
- **Menu Name (Thai)**: ทะเบียน KPI
- **Menu Name (English)**: Key Performance Indicators
- **JSP Files**: 
  - `CO033.jsp` - Main screen
  - `CO034.jsp` - Related screen
  - `CO035.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

---

### 1.6 Manpower Analyst (CO01A06)

#### 1.6.1 Manpower Type (CO01A0601)
- **Menu Name (Thai)**: ทะเบียนประเภทอัตรากำลัง
- **Menu Name (English)**: Manpower Type
- **JSP Files**: 
  - `PRU147.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.6.2 Manpower Number Table (CO01A0602)
- **Menu Name (Thai)**: ตารางทะเบียนเลขที่อัตรา
- **Menu Name (English)**: Manpower Number Table
- **JSP Files**: 
  - `PRU148.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.6.3 Manpower Number Data (CO01A0603)
- **Menu Name (Thai)**: ข้อมูลอัตรากำลัง
- **Menu Name (English)**: Manpower Number Data
- **JSP Files**: 
  - `PRU149.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.6.4 Manpower Number Detail (CO01A0604)
- **Menu Name (Thai)**: รายละเอียดข้อมูลอัตรากำลัง
- **Menu Name (English)**: Manpower Number Detail
- **JSP Files**: 
  - `PRU150.jsp` - Main screen
  - `PRU1501.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

---

### 1.7 Manpower (CO01A07)

#### 1.7.1 Generate Manpower Budget (CO03A0301)
- **Menu Name (Thai)**: สร้างงบประมาณกำลังคน
- **Menu Name (English)**: Generate Manpower Budget
- **JSP Files**: 
  - `MANPOWER_GEN.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

#### 1.7.2 Approve Manpower Budget (CO03A0302)
- **Menu Name (Thai)**: หน้ารับรองงบประมาณกำลังคน
- **Menu Name (English)**: Approve Manpower Budget
- **JSP Files**: 
  - `MANPOWER_APP.jsp` - Main screen
  - `MANPOWER_DUPLICATE.jsp` - Duplicate screen
  - `MANPOWER_ADDCHILD.jsp` - Add child screen
- **Permissions**: 
  - Active: Yes
  - Edit: No
  - Save: No
  - Delete: No

#### 1.7.3 Turnover Report (TURNOVER_EXCEL)
- **Menu Name (Thai)**: อัตราการลาออกของพนักงาน
- **Menu Name (English)**: Turnover Report
- **JSP Files**: 
  - `TURNOVER_EXCEL.jsp` - Main screen
  - `TURNOVER_EXCEL_EXPORT.jsp` - Export screen
- **Permissions**: 
  - Active: Yes
  - Edit: No
  - Save: No
  - Delete: No

#### 1.7.4 Compare Manpower and Payroll (MAN001)
- **Menu Name (Thai)**: Compare Manpower and Payroll(HR & Paymaster)
- **Menu Name (English)**: Compare Manpower and Payroll(HR & Paymaster)
- **JSP Files**: 
  - `MAN001` - Report (not JSP, uses linkpageReport2)
- **Type**: Report

#### 1.7.5 Report Excel Report Reconcile (MAN002)
- **Menu Name (Thai)**: Report Excel Report Reconcile
- **Menu Name (English)**: Report Excel Report Reconcile
- **JSP Files**: 
  - `MAN002.jsp` - Main screen
  - `MAN002_EXP.jsp` - Export screen

---

### 1.8 Setup (CO01A08)

#### 1.8.1 Project Table (CO01A0801)
- **Menu Name (Thai)**: ทะเบียนโครงการ
- **Menu Name (English)**: Project Table
- **JSP Files**: 
  - `CS051.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

---

## 2. Approve (TA01A08)

### 2.1 ApproveBox (TA01A0801)
- **Menu Name (Thai)**: ตั้งค่ากล่องการอนุมัติ
- **Menu Name (English)**: ApproveBox
- **JSP Files**: 
  - `TAB01.jsp` - Main screen
  - `TAB011.jsp` - Related screen
  - `TAB012.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 2.2 ApproveBoxEmployee (TA01A0802)
- **Menu Name (Thai)**: กำหนดกล่องการอนุมัติของพนักงานรายบุคคล
- **Menu Name (English)**: ApproveBoxEmployee
- **JSP Files**: 
  - `TAM01.jsp` - Main screen
  - `TAM011.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 2.3 ApproveBoxEmployeeGroup (TA01A0803)
- **Menu Name (Thai)**: กำหนดกล่องการอนุมัติของพนักงานรายกลุ่ม
- **Menu Name (English)**: ApproveBoxEmployeeGroup
- **JSP Files**: 
  - `TAMG01.jsp` - Main screen
  - `TAMG011.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 2.4 AdjustApproveBoxEmployee (TA01A0804)
- **Menu Name (Thai)**: ปรับปรุงประเภทกล่องการอนุมัติของพนักงาน
- **Menu Name (English)**: AdjustApproveBoxEmployee
- **JSP Files**: 
  - `TAMC01.jsp` - Main screen
  - `TAMC011.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: No
  - Delete: No

---

## 3. Employee Self Service (CO04A)

### 3.1 News Setup (CO04A01)
- **Menu Name (Thai)**: การจัดการข่าว
- **Menu Name (English)**: News Setup
- **JSP Files**: 
  - `NEWS_SETUP.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.2 Event Setup (CO04A02)
- **Menu Name (Thai)**: การจัดการกิจกรรม
- **Menu Name (English)**: Event Setup
- **JSP Files**: 
  - `EVENT_SETUP.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.3 Banner Setup (CO04A04)
- **Menu Name (Thai)**: การจัดการแบนเนอร์
- **Menu Name (English)**: Banner Setup
- **JSP Files**: 
  - `TBANNER_SETUP.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.4 Handbook Setup (CO04A05)
- **Menu Name (Thai)**: แบบฟอร์มต่างๆ
- **Menu Name (English)**: Handbook Setup
- **JSP Files**: 
  - `THANDBOOK.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.5 Video Setup (CO04A06)
- **Menu Name (Thai)**: การจัดการวิดีโอ
- **Menu Name (English)**: Video Setup
- **JSP Files**: 
  - `TVIDEO_SETUP.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.6 Logo Setup (CO04A07)
- **Menu Name (Thai)**: การจัดการโลโก้
- **Menu Name (English)**: Logo Setup
- **JSP Files**: 
  - `LOGOSETUP.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.7 External Links Setup (CO04A09)
- **Menu Name (Thai)**: ทะเบียนจัดเก็บลิงก์ภายนอก
- **Menu Name (English)**: External Links Setup
- **JSP Files**: 
  - `LINKSETUP.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.8 Vision Table (CO04A11)
- **Menu Name (Thai)**: การจัดการวิสัยทัศน์
- **Menu Name (English)**: Vision Table
- **JSP Files**: 
  - `CO001_NEW.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.9 Mission Table (CO04A12)
- **Menu Name (Thai)**: ทะเบียนพันธกิจ
- **Menu Name (English)**: Mission Table
- **JSP Files**: 
  - `CO002_NEW.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.10 Company History (CO04A13)
- **Menu Name (Thai)**: ประวัติบริษัท
- **Menu Name (English)**: Company History
- **JSP Files**: 
  - `CO017_NEW.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.11 Regulation/Order/Notice Group Table (CO04A14)
- **Menu Name (Thai)**: กลุ่มข้อบังคับ/ระเบียบ/ประกาศ
- **Menu Name (English)**: Regulation/Order/Notice Group Table
- **JSP Files**: 
  - `CO020.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.12 Regulation/Order/Notice Type Table (CO04A15)
- **Menu Name (Thai)**: ประเภทข้อบังคับ/ระเบียบ/ประกาศ
- **Menu Name (English)**: Regulation/Order/Notice Type Table
- **JSP Files**: 
  - `CO021.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

### 3.13 Regulation/Order/Notice Table (CO04A16)
- **Menu Name (Thai)**: ข้อบังคับ/ระเบียบ/ประกาศ
- **Menu Name (English)**: Regulation/Order/Notice Table
- **JSP Files**: 
  - `CO022.jsp` - Main screen
  - `CO022_1.jsp` - Related screen
  - `CO022_11.jsp` - Related screen
  - `CO022_12.jsp` - Related screen
- **Permissions**: 
  - Active: Yes
  - Edit: Yes
  - Save: Yes
  - Delete: Yes

---

## 4. Report (CO02A)

### 4.1 ROI1001 - Business Type Setup (CO02A01)
- **Menu Name (Thai)**: ROI1001 รายงานข้อมูลประเภทบริษัท
- **Menu Name (English)**: ROI1001 Business Type Setup
- **Report Code**: CS081-CS0081
- **Type**: Report (uses linkpageReport2)

### 4.2 ROI1002 - Company Group Code (CO02A02)
- **Menu Name (Thai)**: ROI1002 รายงานทะเบียนกลุ่มบริษัท
- **Menu Name (English)**: ROI1002 Company Group Code
- **Report Code**: CS15-CS015
- **Type**: Report

### 4.3 ROI1003 - Company Information Setup Report (CO02A03)
- **Menu Name (Thai)**: ROI1003 รายงานทะเบียนบริษัท
- **Menu Name (English)**: ROI1003 Company Information Setup Report
- **Report Code**: M49-CS001
- **Type**: Report

### 4.4 ROI1004 - Branch Information Report (CO02A04)
- **Menu Name (Thai)**: ROI1004 รายงานทะเบียนสาขา
- **Menu Name (English)**: ROI1004 Branch Information Report
- **Report Code**: M01-PRU009
- **Type**: Report

### 4.5 ROI1005 - Position (CO02A05)
- **Menu Name (Thai)**: ROI1005 รายงานทะเบียนตำแหน่งงาน
- **Menu Name (English)**: ROI1005 Position
- **Report Code**: M02-PRU010
- **Type**: Report

### 4.6 ROI1006 - Job Group Setup (CO02A08)
- **Menu Name (Thai)**: ROI1006 รายงานทะเบียนกลุ่มงาน
- **Menu Name (English)**: ROI1006 Job Group Setup
- **Report Code**: M04-PRU012
- **Type**: Report

### 4.7 ROI1007 - Job Code Detail (CO02A09)
- **Menu Name (Thai)**: ROI1007 รายงานรหัสงาน
- **Menu Name (English)**: ROI1007 Job Code Detail
- **Report Code**: M05-PRU013
- **Type**: Report

### 4.8 ROI1008 - CXO Report (CO02A10)
- **Menu Name (Thai)**: ROI1008 รายงาน CXO
- **Menu Name (English)**: ROI1008 CXO Report
- **Report Code**: M06-PRU002
- **Type**: Report
- **Language Code**: ROI1008

### 4.9 ROI1009 - LINE Report (CO02A11)
- **Menu Name (Thai)**: ROI1009 รายงาน LINE
- **Menu Name (English)**: ROI1009 LINE Report
- **Report Code**: M07-PRU003
- **Type**: Report
- **Language Code**: ROI1009

### 4.10 ROI1010 - DEPT Report (CO02A12)
- **Menu Name (Thai)**: ROI1010 รายงาน DEPT
- **Menu Name (English)**: ROI1010 DEPT Report
- **Report Code**: M38-PRU004
- **Type**: Report
- **Language Code**: ROI1010

### 4.11 ROI1011 - TEAM Report (CO02A13)
- **Menu Name (Thai)**: ROI1011 รายงาน TEAM
- **Menu Name (English)**: ROI1011 TEAM Report
- **Report Code**: M39-PRU005
- **Type**: Report
- **Language Code**: ROI1011

### 4.12 ROI1012 - T2 Report (CO02A14)
- **Menu Name (Thai)**: ROI1012 รายงาน T2
- **Menu Name (English)**: ROI1012 T2 Report
- **Report Code**: M40-PRU037
- **Type**: Report
- **Language Code**: ROI1012

### 4.13 ROI1012 - T3 Report (CO02A20)
- **Menu Name (Thai)**: ROI1012 รายงาน T3
- **Menu Name (English)**: ROI1012 T3 Report
- **Report Code**: M40-PRU038
- **Type**: Report
- **Language Code**: ROI1012

### 4.14 ROI1012 - T4 Report (CO02A21)
- **Menu Name (Thai)**: ROI1012 รายงาน T4
- **Menu Name (English)**: ROI1012 T4 Report
- **Report Code**: M40-PRU039
- **Type**: Report
- **Language Code**: ROI1012

### 4.15 ROI1013 - Working Area Setup (CO02A15)
- **Menu Name (Thai)**: ROI1013 รายงานสถานที่ทำงาน
- **Menu Name (English)**: ROI1013 Working Area Setup
- **Report Code**: M37-PRU031
- **Type**: Report

### 4.16 ROI1014 - Fund Type Setup (CO02A16)
- **Menu Name (Thai)**: ROI1014 ประเภทกองทุนแบบ List
- **Menu Name (English)**: ROI1014 Fund Type Setup
- **Report Code**: M35-PRU105
- **Type**: Report

### 4.17 ROI1015 - Manpower Type (CO02A17)
- **Menu Name (Thai)**: ROI1015 รายงานประเภทอัตรากำลัง
- **Menu Name (English)**: ROI1015 Manpower Type
- **Report Code**: M61-PRU147
- **Type**: Report

### 4.18 ROI1016 - Manpower Number (CO02A18)
- **Menu Name (Thai)**: ROI1016 ประวัติอัตรากำลัง
- **Menu Name (English)**: ROI1016 Manpower Number
- **Report Code**: M62-PRU210
- **Type**: Report

### 4.19 ROI1017 - Manpower Number Detail (CO02A19)
- **Menu Name (Thai)**: ROI1017 รายงานข้อมูลอัตรากำลัง
- **Menu Name (English)**: ROI1017 Manpower Number Detail
- **Report Code**: M63-PRU150
- **Type**: Report

### 4.20 RPI3030 - Approve Level (KCG) (PS03A0405)
- **Menu Name (Thai)**: RPI3030 รายงานทะเบียนสิทธิ์การอนุมัติ (KCG)
- **Menu Name (English)**: RPI3030 Approve Level (KCG)
- **Report Code**: PR011
- **Type**: Report

### 4.21 RPI3031 - Approve Level (KCG) (PS03A0406)
- **Menu Name (Thai)**: RPI3031 รายงานสิทธิ์การอนุมัติ (KCG)
- **Menu Name (English)**: RPI3031 Approve Level (KCG)
- **Report Code**: PR012
- **Type**: Report

---

## 5. Terms Of Use (CO05A)

### 5.1 User Manual (CO05A1)
- **Menu Name (Thai)**: คู่มือการใช้งาน
- **Menu Name (English)**: User Manual
- **JSP Files**: 
  - `MODULE_MANUAL.jsp` - Main screen
- **Permissions**: 
  - Active: Yes
  - Edit: No
  - Save: No
  - Delete: No

---

## Additional Files

### Module Index
- `COM_INDEX.jsp` - Main module index page

### Import/Export
- `CSC_IMPORT.jsp` - Import data screen
- `CSC_IMPORT_RESULT.jsp` - Import result screen
- `CSC_EXPORT.jsp` - Export data screen

### Other Company Files
- `CS000.jsp` through `CS049.jsp` - Various company setup screens
- `CO001.jsp` through `CO053.jsp` - Various company configuration screens
- `CI_*.jsp` - Company information screens
- `PRU*.jsp` - Personal/Company related screens (shared with PERSONAL module)

---

## Notes

1. **Shared Files**: Some JSP files (especially PRU*.jsp) are shared between COMPANY and PERSONAL modules
2. **Report Files**: Many reports use `linkpageReport2()` function and may not have direct JSP files
3. **Help Files**: Many screens have corresponding help files (e.g., `*HELP.jsp`, `*_HELP.jsp`)
4. **Child Pages**: Complex screens may have multiple child pages for different views or operations
5. **Company Variants**: Some files have company-specific variants (e.g., `*_GPF.jsp`, `*_STD.jsp`, `*_YUM.jsp`)
6. **Legacy Files**: Some commented-out menu items may reference legacy files that are no longer in use

---

## Migration Considerations

### High Priority Screens
- Company Information screens (CS008, CS001_STD, CS006, CS043, CS045)
- Branch and Business Unit screens (PRU002-PRU005, PRU009, PRU031)
- Position and Job Description screens (PRU010, PRU020, CI_01_GPF)
- Master File screens (CS003, CO025, CO026SIG, CI_05, CO030, CO033)

### Medium Priority Screens
- Reporting Line screens (CI_01_22, CI_01_23)
- Manpower screens (PRU147-PRU150, MANPOWER_*)
- Employee Self Service screens (NEWS_SETUP, EVENT_SETUP, etc.)

### Lower Priority Screens
- Report screens (mostly backend-generated)
- Legacy/commented-out screens

### Technical Notes
- Many screens use the CSC library framework
- Workflow integration may be required for some screens
- File upload/download functionality needs special handling
- Multi-language support (Thai/English) is built into many screens

