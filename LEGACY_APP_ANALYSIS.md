# การวิเคราะห์แอป Angular ตัวเก่า (hrplus-std-rd)

## สารบัญ
1. [ภาพรวมโปรเจ็ค](#ภาพรวมโปรเจ็ค)
2. [Employee View Module](#employee-view-module)
3. [Workflow Module](#workflow-module)
4. [Services](#services)
5. [Models](#models)
6. [Shared UI Components](#shared-ui-components)
7. [Assets](#assets)
8. [ESS Layout Components](#ess-layout-components)
9. [Pipes & Directives](#pipes--directives)
10. [คำแนะนำการ Migration](#คำแนะนำการ-migration)

---

## ภาพรวมโปรเจ็ค

### ข้อมูลพื้นฐาน
- **Angular Version**: 20.1.7
- **TypeScript**: 5.8.3
- **UI Framework**: 
  - Bootstrap 5.3.3
  - Syncfusion EJ2 Angular (v29-31)
  - ng-bootstrap 19.0.1
- **State Management**: RxJS 7.8.1
- **Internationalization**: @ngx-translate/core 15.0.0

### โครงสร้างหลัก
```
hrplus-std-rd/
├── src/
│   ├── app/
│   │   ├── component/
│   │   │   ├── employee/          # Employee View Module
│   │   │   ├── workflow/          # Workflow Module
│   │   │   ├── shared-ui/         # Shared UI Components
│   │   │   └── [other modules]
│   │   ├── ess-layout/            # ESS Layout Module
│   │   ├── services/              # Services
│   │   ├── models/                # Data Models (329 files)
│   │   └── pipes/                 # Custom Pipes
│   └── assets/
│       ├── i18n/                  # Translation files
│       ├── images/                # Images
│       ├── font/                  # Fonts
│       ├── scss/                  # SCSS styles
│       └── template/              # JSON templates
```

---

## Employee View Module

### 📁 โครงสร้าง Module
**Path**: `src/app/component/employee/`

### Components (14 components)

#### 1. **Employee Profile** ⭐⭐⭐
- **File**: `employee-profile/employee-profile.component.ts`
- **Functionality**: 
  - แสดงข้อมูลส่วนตัวพนักงาน (Personal Profile)
  - แสดงที่อยู่, ครอบครัว, ธนาคาร, บัตร, การศึกษา, ประสบการณ์ทำงาน
  - แสดงข้อมูลภาษี (Tax)
  - รองรับทั้ง Employee View และ Supervisor View
- **Features**:
  - Tab navigation (NgbNav)
  - Dynamic employee ID routing
  - Mask toggle สำหรับข้อมูลส่วนตัว
  - Loading states
- **Dependencies**:
  - `EmployeeService`
  - `TranslateService`
  - Multiple models (EmployeeProfileModel, AddressModel, FamilyModel, etc.)
- **Recommendation**: ✅ **ควรนำมาใช้** - Core feature สำคัญ

#### 2. **Employee Attendance** ⭐⭐
- **File**: `employee-attendance/employee-attendance.component.ts`
- **Functionality**: แสดงข้อมูล Raw Data การเข้างาน
- **Recommendation**: ✅ **ควรนำมาใช้** - ข้อมูลพื้นฐาน

#### 3. **Employee Timestamp** ⭐⭐
- **File**: `employee-timestamp/employee-timestamp.component.ts`
- **Functionality**: แสดงข้อมูล Working Hour Data
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 4. **Employee Payslip** ⭐⭐⭐
- **File**: `employee-payslip/employee-payslip.component.ts`
- **Functionality**: แสดง e-Payslip
- **Recommendation**: ✅ **ควรนำมาใช้** - Feature สำคัญ

#### 5. **Employee PND91** ⭐⭐
- **File**: `employee-pnd91/employee-pnd91.component.ts`
- **Functionality**: แสดงข้อมูล PND91 (ภาษี)
- **Recommendation**: ✅ **ควรนำมาใช้** - สำหรับประเทศไทย

#### 6. **Employee TWI50** ⭐
- **File**: `employee-twi50/employee-twi50.component.ts`
- **Functionality**: แสดงข้อมูล 50Twi
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น** - อาจเป็น feature เฉพาะ

#### 7. **Employee Leave Statistic** ⭐⭐
- **File**: `employee-leavestatistic/employee-leavestatistic.component.ts`
- **Functionality**: สถิติการขอ Leave
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 8. **Employee OT Statistic** ⭐⭐
- **File**: `employee-otstatistic/employee-otstatistic.component.ts`
- **Functionality**: สถิติการขอ OT
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 9. **Employee Edit Time Statistic** ⭐⭐
- **File**: `employee-edittimestatistic/employee-edittimestatistic.component.ts`
- **Functionality**: สถิติการขอแก้ไขเวลา
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 10. **Employee Leave Role** ⭐⭐
- **File**: `employee-leaverole/employee-leaverole.component.ts`
- **Functionality**: Privilege Leave
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 11. **Employee Time Warning** ⭐⭐
- **File**: `employee-time-warning/employee-time-warning.component.ts`
- **Functionality**: Punch In/Out Checking Data
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 12. **Employee Work Information** ⭐⭐⭐
- **File**: `employee-work-information/employee-work-information.component.ts`
- **Functionality**: ข้อมูลการทำงานของพนักงาน
- **Recommendation**: ✅ **ควรนำมาใช้** - Core feature

#### 13. **PI Shiftplan** ⭐⭐
- **File**: `pi-shiftplan/pi-shiftplan.component.ts`
- **Functionality**: Shift Plan
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 14. **Working History Data** ⭐⭐
- **File**: `working-history-data/working-history-data.component.ts`
- **Functionality**: ประวัติการทำงาน
- **Recommendation**: ✅ **ควรนำมาใช้**

### Routing
**File**: `employee-routing.module.ts`
- 14 routes ทั้งหมด
- ใช้ `AuthGuard` สำหรับ protection
- รองรับ dynamic employee ID routing

### Module Configuration
**File**: `employee.module.ts`
- Standalone components (Angular 20)
- ใช้ CommonModule และ EmployeeRoutingModule

---

## Workflow Module

### 📁 โครงสร้าง Module
**Path**: `src/app/component/workflow/`

### Main Components

#### 1. **MyHR In-Box** ⭐⭐⭐
- **File**: `myhr-in-box/myhr-in-box/myhr-in-box.component.ts`
- **Functionality**: 
  - Inbox สำหรับ workflow documents
  - แสดงรายการ workflow ที่รอการอนุมัติ
- **Recommendation**: ✅ **ควรนำมาใช้** - Core workflow feature

#### 2. **MyHR Out-Box** ⭐⭐⭐
- **File**: `myhr-out-box/myhr-out-box/myhr-out-box.component.ts`
- **Functionality**: 
  - Sentbox สำหรับ workflow ที่ส่งแล้ว
- **Recommendation**: ✅ **ควรนำมาใช้** - Core workflow feature

#### 3. **MyHR Center Box** ⭐⭐
- **File**: `myhr-center-box/myhr-center-box/myhr-center-box.component.ts`
- **Functionality**: Sharebox
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 4. **MyHR Create WF** ⭐⭐⭐
- **File**: `myhr-create-wf/myhr-create-wf/myhr-create-wf.component.ts`
- **Functionality**: สร้าง workflow ใหม่
- **Recommendation**: ✅ **ควรนำมาใช้** - Core feature

#### 5. **MyHR Manage Doc** ⭐⭐
- **File**: `myhr-manage-doc/myhr-manage-doc/myhr-manage-doc.component.ts`
- **Functionality**: จัดการเอกสาร workflow
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 6. **MyHR Move Doc** ⭐
- **File**: `myhr-move-doc/myhr-move-doc/myhr-move-doc.component.ts`
- **Functionality**: ย้ายเอกสาร
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 7. **MyHR Delete Doc** ⭐
- **File**: `myhr-delete-doc/myhr-delete-doc/myhr-delete-doc.component.ts`
- **Functionality**: ลบเอกสาร
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 8. **Workflow Type** ⭐⭐⭐
- **File**: `workflow-type/workflow-type.component.ts`
- **Functionality**: 
  - Dynamic workflow type rendering
  - รองรับ workflow types หลายแบบ:
    - Leave (TAUCSCWF001)
    - OT (TAUCSCWF021)
    - Edit Time (TAUCSCWF005, TAUCSCWF006)
    - Shift (TAUCSCWF007)
    - ExShift (TAUCSCWF009)
    - Training (Trawf004, Trawf005, etc.)
    - Certificate (Pwf001)
    - Employee Edit (Pwf014)
    - และอื่นๆ อีกมากมาย
- **Features**:
  - Dynamic component loading (ng-dynamic-component)
  - Create และ Detail views
  - รองรับหลาย workflow types
- **Recommendation**: ✅ **ควรนำมาใช้** - Core workflow engine

### Workflow Type Containers

#### Leave Container
- `leave-contrainer/` - Leave workflow types
- Components: TauCscwf001, TauCscwf001Hr, TauCscwf001Center

#### OT Container
- `ot-contrainer/` - OT workflow types
- Components: TauCscwf021, TauCscwf021Sup, TauCscwf021Center, TauCscwf004Center

#### Edit Container
- `edit-contrainer/` - Edit time workflow types
- Components: TAUCSCWF005, TAUCSCWF005Center, TAUCSCWF006

#### Shift Container
- `shift-contrainer/` - Shift change workflow types
- Components: TAUCSCWF007, TAUCSCWF007Center, TauCscwf007Sup

#### ExShift Container
- `exshift-contrainer/` - Exchange shift workflow types
- Components: TauCscwf009, TauCscwf009Center, TauCscwf009Sup

#### Changeday Container
- `changeday-contrainer/` - Change day workflow types
- Components: TAUCSCWF008STD, TAUCSCWF008Hr, TAUCSCWF008Center

#### Cumday Container
- `cumday-contrainer/` - Cumulative day workflow types
- Components: TAUCSCWF018, TAUCSCWF018Sup, TAUCSCWF018Center

#### Comot Container
- `comot-contrainer/` - Cancel OT workflow types
- Components: TAUCSCWF122, TAUCSCWF122Center, TAUCSCWF123

#### Training Container
- `training-contrainer/` - Training workflow types
- Components: Trawf004, Trawf005, Trawf007, Trawf0071, Trawf009, Trawf001v2

#### Certificate Container
- `certificate-contrainer/` - Certificate workflow types
- Components: Pwf001, Pwf001new, Pwf001newBoss, Pwf001DaBdfNew

#### Employee Edit Container
- `empedit-contrainer/` - Employee edit workflow types
- Components: Pwf014, Pwf014Sup, Pwf014Center

#### Other Containers
- `cancellation-contrainer/` - Wf2559 (Cancel workflow)
- `employment-requisition-contrainer/` - Rwf001
- `hiring-requisition-contrainer/` - Pwf017Recruit
- `welfare-requisition-contrainer/` - Welwf001
- `reques-changing-contrainer/` - Wel210Nstda
- `employee-bank-contrainar/` - Pwf020, Pwf021
- `update-employee-tax/` - Pwf014Tax
- `provident-fund/` - Provident fund workflows
- `provident-fund-reg/` - Provident fund registration
- `provident-fund-sup/` - Provident fund supervisor
- `welfare-offsite/` - Welfare offsite

### Shared Workflow Components
- `workflow-create/` - Create workflow component
- `workflow-detail/` - Detail workflow component
- `workflow-remark/` - Remark component
- `workflow-sendto/` - Send to component
- `workflow-attach-file/` - Attach file (single)
- `workflow-attach-file-multi/` - Attach file (multiple)
- `workflow-emp-information/` - Employee information in workflow
- `workflow-employee-modal/` - Employee modal
- `workflow-mix-model/` - Mixed model component
- `alert-modal/` - Alert modal
- `confirm-modal/` - Confirm modal
- `doc-reference-modal/` - Document reference modal

### Routing
**File**: `workflow-routing.module.ts`
- 8 main routes
- Dynamic routing สำหรับ workflow-type (`:wfid`, `:runno`, `:traningId`)
- ใช้ `AuthGuard`

### Module Configuration
**File**: `workflow.module.ts`
- Standalone components
- ใช้ DatepickerI18nThaiComponent สำหรับ Thai datepicker

---

## Services

### Core Services

#### 1. **EmployeeService** ⭐⭐⭐
- **File**: `services/employee.service.ts`
- **Functionality**: 
  - CRUD operations สำหรับ employee data
  - Get employee profile, address, family, bank, card, education, work experience
  - Get leave statistics, OT statistics
  - Get payslip, tax, PND91
  - Get attendance, timestamp data
  - Get shift plan, working history
- **Methods**: 100+ methods
- **Recommendation**: ✅ **ควรนำมาใช้** - Core service สำคัญ

#### 2. **WorkflowService** ⭐⭐⭐
- **File**: `services/workflow.service.ts`
- **Functionality**:
  - Create workflow
  - Get inbox/outbox lists
  - Get workflow details
  - Approve/reject workflow
  - Send workflow
  - Get workflow types
  - Upload/download files
  - Get workflow statistics
- **Methods**: 100+ methods
- **Recommendation**: ✅ **ควรนำมาใช้** - Core workflow service

#### 3. **CompanyService** ⭐⭐
- **File**: `services/company.service.ts`
- **Functionality**: Company data operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 4. **BankService** ⭐⭐
- **File**: `services/bank.service.ts`
- **Functionality**: Bank data operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 5. **ApproveService** ⭐⭐
- **File**: `services/approve.service.ts`
- **Functionality**: Approval operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 6. **AssessService** ⭐
- **File**: `services/assess.service.ts`
- **Functionality**: Assessment operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 7. **BackpayService** ⭐
- **File**: `services/backpay.service.ts`
- **Functionality**: Backpay operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 8. **CertificateTemplateService** ⭐⭐
- **File**: `services/certificate-template.service.ts`
- **Functionality**: Certificate template operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 9. **DashboardService** ⭐⭐
- **File**: `services/dashboard-service.service.ts`
- **Functionality**: Dashboard data operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 10. **DatepickerNgbService** ⭐⭐
- **File**: `services/datepicker-ngb.service.ts`
- **Functionality**: Datepicker utility service
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 11. **EncodeCyptoService** ⭐⭐
- **File**: `services/encode-cypto.service.ts`
- **Functionality**: Encryption/decryption service
- **Recommendation**: ✅ **ควรนำมาใช้** - Security

#### 12. **EventgrpService** ⭐⭐
- **File**: `services/eventgrp.service.ts`
- **Functionality**: Event group operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 13. **FieldMaskingConfigService** ⭐⭐
- **File**: `services/field-masking-config.service.ts`
- **Functionality**: Field masking configuration
- **Recommendation**: ✅ **ควรนำมาใช้** - Privacy/security

#### 14. **Holiday2Service** ⭐⭐
- **File**: `services/holiday2.service.ts`
- **Functionality**: Holiday operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 15. **IdleTimeoutService** ⭐⭐
- **File**: `services/idleTimeout.service.ts`
- **Functionality**: Idle timeout management
- **Recommendation**: ✅ **ควรนำมาใช้** - Security

#### 16. **LogHistoryService** ⭐⭐
- **File**: `services/logHistory.service.ts`
- **Functionality**: Log history operations
- **Recommendation**: ✅ **ควรนำมาใช้** - Audit trail

#### 17. **MemplService** ⭐
- **File**: `services/mempl.service.ts`
- **Functionality**: Member operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 18. **MemplGroupallowanceService** ⭐
- **File**: `services/mempl-groupallowance.service.ts`
- **Functionality**: Member group allowance
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 19. **MoliPriceService** ⭐
- **File**: `services/moliprice.service.ts`
- **Functionality**: Moli price operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 20. **MrateService** ⭐
- **File**: `services/mrate.service.ts`
- **Functionality**: Rate operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 21. **MyjobService** ⭐
- **File**: `services/myjob.service.ts`
- **Functionality**: Job operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 22. **OrgchartnewService** ⭐⭐
- **File**: `services/orgchartnew.service.ts`
- **Functionality**: Organization chart operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 23. **PositionGroupService** ⭐⭐
- **File**: `services/position-group.service.ts`
- **Functionality**: Position group operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 24. **PrivateMessageService** ⭐⭐
- **File**: `services/private-message.service.ts`
- **Functionality**: Private message operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 25. **ResignReasonService** ⭐⭐
- **File**: `services/resign-reason.service.ts`
- **Functionality**: Resign reason operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 26. **ShiftplanService** ⭐⭐
- **File**: `services/shiftplan.service.ts`
- **Functionality**: Shift plan operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 27. **ShiftTempService** ⭐
- **File**: `services/shift-temp.service.ts`
- **Functionality**: Temporary shift operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 28. **SwaplangCodeService** ⭐⭐
- **File**: `services/swaplang-code.service.ts`
- **Functionality**: Language code swap operations
- **Recommendation**: ✅ **ควรนำมาใช้** - i18n

#### 29. **TimeService** ⭐⭐
- **File**: `services/time.service.ts`
- **Functionality**: Time operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 30. **Time0Service** ⭐
- **File**: `services/time0.service.ts`
- **Functionality**: Time0 operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 31. **TotmdateService** ⭐
- **File**: `services/totmdate.service.ts`
- **Functionality**: Totmdate operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 32. **TransferRosterService** ⭐⭐
- **File**: `services/transfer-roster.service.ts`
- **Functionality**: Transfer roster operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 33. **UserProfileService** ⭐⭐
- **File**: `services/uprofile.service.ts`
- **Functionality**: User profile operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 34. **VShiftService** ⭐
- **File**: `services/vshift.service.ts`
- **Functionality**: VShift operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 35. **WorkAreaService** ⭐⭐
- **File**: `services/work-area.service.ts`, `workarea.service.ts`
- **Functionality**: Work area operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 36. **WorkingTimeService** ⭐⭐
- **File**: `services/working-time.service.ts`
- **Functionality**: Working time operations
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 37. **Gworkarea0Service** ⭐
- **File**: `services/gworkarea0.service.ts`
- **Functionality**: Gworkarea0 operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 38. **HighcostService** ⭐
- **File**: `services/highcost.service.ts`
- **Functionality**: High cost operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 39. **Tc1Service** ⭐
- **File**: `services/tc1.service.ts`
- **Functionality**: Tc1 operations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

### HTTP Interceptor
- **File**: `services/http-request.interceptor.ts`
- **Functionality**: HTTP request interceptor
- **Recommendation**: ✅ **ควรนำมาใช้** - Request/response handling

---

## Models

### จำนวน Models
- **Total**: 329 model files
- **Location**: `src/app/models/`

### Categories

#### Employee Models ⭐⭐⭐
- `employee.model.ts`
- `employeeprofilemodel.model.ts`
- `employeeprofileall.model.ts`
- `employeemodel.model.ts`
- `employeesubordinatespage.model.ts`
- `employeetype.model.ts`
- `empstatus.model.ts`
- `emptype.model.ts`
- `empworkingplan.model.ts`
- `empBank.model.ts`
- `empCard.model.ts`
- `empGroup.model.ts`
- `empLeaveSum.model.ts`
- `empShift.model.ts`
- `empposition.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้** - Core data models

#### Workflow Models ⭐⭐⭐
- `workflow.model.ts`
- `workflowmain.model.ts`
- `workflowmodel.model.ts`
- `workflowdata.model.ts`
- `workflowdefinition.model.ts`
- `workflowmenu.model.ts`
- `workflowposition.model.ts`
- `workflowremark.model.ts`
- `workflowremarkmodel.model.ts`
- `requireWF.model.ts`
- `sendto.model.ts`
- `sendtomodel.model.ts`
- `leaveworkflow.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้** - Core workflow models

#### Time & Attendance Models ⭐⭐
- `timeattendance.model.ts`
- `timestamp.model.ts`
- `timestampcontent.model.ts`
- `timecurrent.model.ts`
- `timecurrent.modal.ts`
- `timeedit.model.ts`
- `timeWarning.model.ts`
- `swipecard.model.ts`
- `swipetime.model.ts`
- `cardswiping.model.ts`
- `forgetcard.model.ts`
- `forgettime.model.ts`
- `edittime.model.ts`
- `edittime.content.model.ts`
- `leavetime.model.ts`
- `workingtimeplan.model.ts`
- `workingTime.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้**

#### Leave Models ⭐⭐
- `leavestat.model.ts`
- `leavestatevent.model.ts`
- `leavestateventContent.model.ts`
- `leavestatjboss.model.ts`
- `leaveSummary.model.ts`
- `eventgrpleave.model.ts`
- `eventgrpleavemodel.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้**

#### OT Models ⭐⭐
- `otstat.model.ts`
- `otstatcontent.model.ts`
- `overtime.model.ts`
- `wf_ot.model.ts`
- `wfot.model.ts`
- `wfotscreen.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้**

#### Shift Models ⭐⭐
- `shiftmodel.model.ts`
- `shiftlist.model.ts`
- `shiftlisttime.model.ts`
- `shiftimelist.model.ts`
- `shiftplan.model.ts`
- `shift-temp.model.ts`
- `shiftworkarea.model.ts`
- `vshift.model.ts`
- `vshift1.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้**

#### Training Models ⭐⭐
- `training.model.ts`
- `trainingcontent.model.ts`
- `traininghis.model.ts`
- `trainingplan.model.ts`
- `trainingstat.model.ts`
- `trainingtype.model.ts`
- `trainin.model.ts`
- `trainout.model.ts`
- `traineeplan.model.ts`
- `raineeplancontent.model.ts`
- `traincost.model.ts`
- `traintrner.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้**

#### Welfare Models ⭐⭐
- `Welfare.model.ts`
- `welfarecheck.model.ts`
- `welfarehistory.model.ts`
- `welfareview.model.ts`
- `welfaredia.model.ts`
- `welfare-group.model.ts`
- `sitewel.model.ts`
- `Welg.model.ts`
- `welgrp.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้**

#### Address & Personal Models ⭐⭐
- `address.model.ts`
- `family.model.ts`
- `familylists.model.ts`
- `educatemodel.model.ts`
- `workexp.model.ts`
- `movementmodel.model.ts`
- `personalmodel.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้**

#### Company & Organization Models ⭐⭐
- `companyhistory.model.ts`
- `branch.model.ts`
- `branchmodel.model.ts`
- `position.model.ts`
- `positionmodel.model.ts`
- `job.model.ts`
- `jobcodemodel.model.ts`
- `workarea.model.ts`
- `workareamodel.model.ts`
- `costcenter.model.ts`
- `costcentermodel.model.ts`
- `orgchartnew.service.ts` (service)
- **Recommendation**: ✅ **ควรนำมาใช้**

#### Master Data Models ⭐⭐
- `prefix.model.ts`
- `prefixmodel.model.ts`
- `nationality.model.ts`
- `nationalitymodel.model.ts`
- `national.model.ts`
- `religion.model.ts`
- `religionmodel.model.ts`
- `degree.model.ts`
- `degreemodel.model.ts`
- `institue.model.ts`
- `instituemodel.model.ts`
- `faculty.model.ts`
- `facultymodel.model.ts`
- `major.model.ts`
- `majormodel.model.ts`
- `province.model.ts`
- `provincemodel.model.ts`
- `district.model.ts`
- `districtmodel.model.ts`
- `zipcode.model.ts`
- `zipcodemodel.model.ts`
- `zipcodeObject.model.ts`
- `country.model.ts`
- `countrylist.model.ts`
- `bank.model.ts`
- `bankBranch.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้** - Master data

#### Tax & Financial Models ⭐⭐
- `tax.model.ts`
- `config_tax.model.ts`
- `pvf.model.ts`
- `providentmodel.model.ts`
- `Fund.model.ts`
- `income-deduction.model.ts`
- `income-deduction-list.model.ts`
- `mrate.model.ts`
- `mrate1.model.ts`
- `changemoney.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้**

#### Page & Pagination Models ⭐⭐
- `page.model.ts`
- `pageable.model.ts`
- `pageablemodel.model.ts`
- **Recommendation**: ✅ **ควรนำมาใช้** - Common pagination

#### Other Models
- `dashboard/` - Dashboard models
- `globals/` - Global models
- `workflowMap/` - Workflow mapping models
- และอื่นๆ อีกมากมาย

---

## Shared UI Components

### 📁 โครงสร้าง Module
**Path**: `src/app/component/shared-ui/`

### Core Components

#### 1. **EmpviewComponent** ⭐⭐
- **File**: `empview.component.ts`
- **Functionality**: Employee view wrapper
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 2. **Modal Components** ⭐⭐⭐
- **ModalEmployeeComponent** - Employee selection modal
- **ModalEmployeeComponentPassComponent** - Employee pass modal
- **KerryEmployeeModalComponent** - Kerry employee modal
- **Recommendation**: ✅ **ควรนำมาใช้** - Reusable modals

#### 3. **Datepicker Components** ⭐⭐⭐
- **DatepickerI18nThaiComponent** - Thai datepicker with i18n
- **LanguageDatepickerComponent** - Language datepicker
- **Recommendation**: ✅ **ควรนำมาใช้** - Essential for Thai locale

#### 4. **Toast & Notification** ⭐⭐⭐
- **ToastComponent** - Toast notifications
- **ToastsContainer** - Toast container
- **ToastService** - Toast service
- **NotifierComponent** - Notifier component
- **Recommendation**: ✅ **ควรนำมาใช้** - User feedback

#### 5. **Loading Components** ⭐⭐⭐
- **LoadingSpinnerComponent** - Loading spinner
- **ShowLoadingDirective** - Loading directive
- **Recommendation**: ✅ **ควรนำมาใช้** - UX essential

#### 6. **Form Components** ⭐⭐
- **TypeheadComponent** - Typeahead input
- **TimepickerComponent** - Time picker
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 7. **UI Components** ⭐⭐
- **AlertComponent** - Alert component
- **ButtonsComponent** - Buttons
- **CardsComponent** - Card component
- **CarouselComponent** - Carousel
- **DropdownCollapseComponent** - Dropdown collapse
- **ModalComponent** - Modal
- **PaginationComponent** - Pagination
- **PopoverTooltipComponent** - Popover/tooltip
- **ProgressbarComponent** - Progress bar
- **RatingComponent** - Rating
- **TabsComponent** - Tabs
- **Recommendation**: ✅ **ควรนำมาใช้** - Reusable UI components

#### 8. **Chat Component** ⭐
- **ChatComponent** - Chat functionality
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 9. **Dashboard Component** ⭐⭐
- **DashboardsComponent** - Dashboard component
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 10. **Modal Mix Components** ⭐⭐
- **Kerry Modals**: BackpayType, Bank, CostCenter, Employee, Reason, ReasonOt, ResignReason, Time0
- **MyHR Modals**: CreateDoc, CreateMessage, Definition, Workarea
- **Recommendation**: ✅ **ควรนำมาใช้** - Business-specific modals

#### 11. **Pipes** ⭐⭐
- **ThaiDatePipe** - Thai date formatting
- **Recommendation**: ✅ **ควรนำมาใช้**

### Module Configuration
**File**: `shared-ui.module.ts`
- Dependencies:
  - NgbModule (ng-bootstrap)
  - NotifierModule
  - TranslateModule
  - CalendarModule
  - DynamicIoModule
  - FullCalendarModule
  - PdfViewerModule
  - KtdGridModule
  - Syncfusion modules (SpeechToText, TextArea, DropDownList, Switch, Toast)

---

## Assets

### 📁 โครงสร้าง Assets
**Path**: `src/assets/`

### 1. **i18n (Internationalization)** ⭐⭐⭐
**Path**: `assets/i18n/`
- `th.json` - Thai translation
- `en.json` - English translation
- `lo.json` - Lao translation
- `my.json` - Myanmar translation
- `vi.json` - Vietnamese translation
- `zh.json` - Chinese translation
- **Recommendation**: ✅ **ควรนำมาใช้** - Multi-language support

### 2. **Fonts** ⭐⭐
**Path**: `assets/font/`
- `leelawad/` - Leelawadee font
- `sarabunpsk/` - Sarabun PSK font (17 files)
- **Recommendation**: ✅ **ควรนำมาใช้** - Thai fonts

### 3. **Images** ⭐⭐
**Path**: `assets/images/`
- `logo/` - Logo files
- `users/` - User avatars (43 files)
- `iconworkflow/` - Workflow icons (19 files)
- `alert/` - Alert icons (10 files)
- `calendar/` - Calendar icons
- `background/` - Background images
- `tooltip/` - Tooltip icons
- และอื่นๆ
- **Recommendation**: ✅ **ควรนำมาใช้** - UI assets

### 4. **SCSS Styles** ⭐⭐⭐
**Path**: `assets/scss/`
- `style.scss` - Main style file
- `_variable.scss` - SCSS variables
- `_core-design.scss` - Core design
- `_components.scss` - Component styles
- `_pages.scss` - Page styles
- `_responsive.scss` - Responsive styles
- `_custom.scss` - Custom styles
- `_mobile-card.scss` - Mobile card styles
- `components/` - Component-specific styles
- `core/` - Core styles (15 files)
- `pages/` - Page-specific styles (13 files)
- `icons/` - Icon styles (425 files)
- `theme-colors/` - Theme color styles
- `widgets/` - Widget styles
- `mixins/` - SCSS mixins
- `rtl/` - RTL styles
- `horizontal/` - Horizontal layout styles
- **Recommendation**: ✅ **ควรนำมาใช้** - Styling system

### 5. **Templates** ⭐⭐
**Path**: `assets/template/`
- JSON templates: Bu1.json, Bu2.json, Bu3.json, Bu4.json, Bu5.json, CompanySale.json, EmpWork.json, etc.
- CSV templates: Example_Import.csv, importshift-template.csv
- Excel templates: Example_Import.xlsx, Import_Planing.xlsx
- **Recommendation**: ✅ **ควรนำมาใช้** - Import/export templates

### 6. **JavaScript Libraries** ⭐
**Path**: `assets/JS/`
- `pace/` - Pace loading library (148 files)
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น** - อาจใช้ Angular alternatives

### 7. **Vendor Files** ⭐
**Path**: `assets/vendor/`
- `css-chart.css`
- `sparkline.js`
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

### 8. **Balkan App** ⭐
**Path**: `assets/balkanapp/`
- `orgchart.js` - Organization chart library
- `orgchart.d.ts` - TypeScript definitions
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น** - อาจใช้ @balkangraph/orgchart.js แทน

### 9. **Config** ⭐⭐
**Path**: `assets/configAppMyhr/`
- `configappmyhr.txt` - App configuration
- **Recommendation**: ✅ **ควรนำมาใช้** - Configuration

### 10. **CSS** ⭐⭐
**Path**: `assets/css/`
- `tailwind3.css` - Tailwind CSS
- **Recommendation**: ✅ **ควรนำมาใช้** - ถ้าใช้ Tailwind

---

## ESS Layout Components

### 📁 โครงสร้าง Module
**Path**: `src/app/ess-layout/`

### Components

#### 1. **FullComponent** ⭐⭐⭐
- **File**: `full/full.component.ts`
- **Functionality**: Main layout component
- **Recommendation**: ✅ **ควรนำมาใช้** - Core layout

#### 2. **VerticalSidebarComponent** ⭐⭐⭐
- **File**: `shared/vertical-sidebar/vertical-sidebar.component.ts`
- **Functionality**: Vertical sidebar navigation
- **Recommendation**: ✅ **ควรนำมาใช้** - Navigation

#### 3. **VerticalHeaderComponent** ⭐⭐⭐
- **File**: `shared/vertical-header/vertical-navigation.component.ts`
- **Functionality**: Vertical header navigation
- **Recommendation**: ✅ **ควรนำมาใช้** - Header

#### 4. **HorizontalSidebarComponent** ⭐
- **File**: `shared/horizontal-sidebar/horizontal-sidebar.component.ts`
- **Functionality**: Horizontal sidebar
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 5. **HorizontalHeaderComponent** ⭐
- **File**: `shared/horizontal-header/horizontal-navigation.component.ts`
- **Functionality**: Horizontal header
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 6. **BreadcrumbComponent** ⭐⭐
- **File**: `shared/breadcrumb/breadcrumb.component.ts`
- **Functionality**: Breadcrumb navigation
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 7. **MaskToggleComponent** ⭐⭐⭐
- **File**: `shared/mask-toggle/mask-toggle.component.ts`
- **Functionality**: Field masking toggle
- **Recommendation**: ✅ **ควรนำมาใช้** - Privacy feature

#### 8. **MaskFieldPipe** ⭐⭐
- **File**: `shared/mask-field.pipe.ts`
- **Functionality**: Field masking pipe
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 9. **MaskInputDirective** ⭐⭐
- **File**: `shared/maskInput.directive.ts`
- **Functionality**: Input masking directive
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 10. **SpinnerComponent** ⭐⭐
- **File**: `shared/spinner.component.ts`
- **Functionality**: Loading spinner
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 11. **DateCustomFormatter** ⭐⭐
- **File**: `shared/date-custom-formatter.ts`
- **Functionality**: Custom date formatter
- **Recommendation**: ✅ **ควรนำมาใช้**

#### 12. **Animations** ⭐
- **File**: `shared/animations/`
- **Functionality**: Route animations
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

---

## Pipes & Directives

### Pipes

#### 1. **SafeHtmlPipe** ⭐⭐
- **File**: `pipes/safe-html.pipe.ts`
- **Functionality**: Sanitize HTML for display
- **Recommendation**: ✅ **ควรนำมาใช้** - Security

#### 2. **CustomRoundPipe** ⭐
- **File**: `pipes/custom-round.pipe.ts`
- **Functionality**: Custom rounding
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 3. **MinusOneCheckPipe** ⭐
- **File**: `pipes/minus-one-check.pipe.ts`
- **Functionality**: Minus one check
- **Recommendation**: ⚠️ **ตรวจสอบความจำเป็น**

#### 4. **ThaiDatePipe** ⭐⭐
- **File**: `component/shared-ui/thaidate.pipe.ts`
- **Functionality**: Thai date formatting
- **Recommendation**: ✅ **ควรนำมาใช้** - Thai locale

---

## คำแนะนำการ Migration

### ✅ สิ่งที่ควรนำมาใช้ (High Priority)

#### 1. **Core Modules**
- ✅ Employee Module (ทั้งหมด 14 components)
- ✅ Workflow Module (ทั้งหมด 8 main components + workflow types)
- ✅ Shared UI Module (core components)

#### 2. **Core Services**
- ✅ EmployeeService
- ✅ WorkflowService
- ✅ CompanyService
- ✅ BankService
- ✅ ApproveService
- ✅ CertificateTemplateService
- ✅ DashboardService
- ✅ DatepickerNgbService
- ✅ EncodeCyptoService
- ✅ FieldMaskingConfigService
- ✅ IdleTimeoutService
- ✅ LogHistoryService
- ✅ OrgchartnewService
- ✅ PositionGroupService
- ✅ PrivateMessageService
- ✅ ResignReasonService
- ✅ ShiftplanService
- ✅ SwaplangCodeService
- ✅ TimeService
- ✅ TransferRosterService
- ✅ UserProfileService
- ✅ WorkAreaService
- ✅ WorkingTimeService
- ✅ HTTP Request Interceptor

#### 3. **Models**
- ✅ Employee models (ทั้งหมด)
- ✅ Workflow models (ทั้งหมด)
- ✅ Time & Attendance models
- ✅ Leave models
- ✅ OT models
- ✅ Shift models
- ✅ Training models
- ✅ Welfare models
- ✅ Address & Personal models
- ✅ Company & Organization models
- ✅ Master Data models
- ✅ Tax & Financial models
- ✅ Page & Pagination models

#### 4. **Assets**
- ✅ i18n files (ทั้งหมด 6 ภาษา)
- ✅ Fonts (Leelawad, Sarabun PSK)
- ✅ Images (logo, icons, avatars)
- ✅ SCSS styles (ทั้งหมด)
- ✅ Templates (JSON, CSV, Excel)

#### 5. **ESS Layout**
- ✅ FullComponent
- ✅ VerticalSidebarComponent
- ✅ VerticalHeaderComponent
- ✅ BreadcrumbComponent
- ✅ MaskToggleComponent
- ✅ MaskFieldPipe
- ✅ MaskInputDirective
- ✅ SpinnerComponent
- ✅ DateCustomFormatter

#### 6. **Pipes & Directives**
- ✅ SafeHtmlPipe
- ✅ ThaiDatePipe
- ✅ ShowLoadingDirective

### ⚠️ สิ่งที่ควรตรวจสอบก่อนนำมาใช้ (Medium Priority)

#### 1. **Services**
- ⚠️ AssessService
- ⚠️ BackpayService
- ⚠️ MemplService
- ⚠️ MemplGroupallowanceService
- ⚠️ MoliPriceService
- ⚠️ MrateService
- ⚠️ MyjobService
- ⚠️ ShiftTempService
- ⚠️ Time0Service
- ⚠️ TotmdateService
- ⚠️ VShiftService
- ⚠️ Gworkarea0Service
- ⚠️ HighcostService
- ⚠️ Tc1Service

#### 2. **Components**
- ⚠️ Employee TWI50 (อาจเป็น feature เฉพาะ)
- ⚠️ MyHR Move Doc
- ⚠️ MyHR Delete Doc
- ⚠️ Chat Component
- ⚠️ Horizontal Layout Components

#### 3. **Assets**
- ⚠️ Pace loading library (อาจใช้ Angular alternatives)
- ⚠️ Vendor files (css-chart, sparkline)
- ⚠️ Balkan App orgchart (อาจใช้ @balkangraph/orgchart.js แทน)

### ❌ สิ่งที่ไม่ควรนำมาใช้ (Low Priority)

- ❌ Components ที่ไม่ได้ใช้งานแล้ว
- ❌ Services ที่ deprecated
- ❌ Models ที่ไม่เกี่ยวข้อง
- ❌ Duplicate services (work-area.service.ts vs workarea.service.ts)

---

## แผนการ Migration

### Phase 1: Foundation (Week 1-2)
1. ✅ Setup project structure
2. ✅ Migrate core models
3. ✅ Migrate core services (EmployeeService, WorkflowService)
4. ✅ Migrate i18n files
5. ✅ Migrate SCSS styles
6. ✅ Migrate fonts and images

### Phase 2: Core Modules (Week 3-4)
1. ✅ Migrate Employee Module
2. ✅ Migrate Workflow Module (main components)
3. ✅ Migrate Shared UI Module
4. ✅ Migrate ESS Layout Module

### Phase 3: Workflow Types (Week 5-6)
1. ✅ Migrate Leave workflow types
2. ✅ Migrate OT workflow types
3. ✅ Migrate Edit Time workflow types
4. ✅ Migrate Shift workflow types
5. ✅ Migrate Training workflow types
6. ✅ Migrate Certificate workflow types
7. ✅ Migrate other workflow types

### Phase 4: Integration & Testing (Week 7-8)
1. ✅ Integration testing
2. ✅ Bug fixes
3. ✅ Performance optimization
4. ✅ Documentation

---

## สรุป

### สถิติ
- **Employee Components**: 14 components
- **Workflow Components**: 8 main + 30+ workflow type containers
- **Services**: 40 services
- **Models**: 329 model files
- **Shared UI Components**: 20+ components
- **ESS Layout Components**: 12 components
- **i18n Languages**: 6 languages
- **SCSS Files**: 100+ files

### Priority Summary
- ✅ **High Priority**: ~80% ของ codebase
- ⚠️ **Medium Priority**: ~15% ของ codebase
- ❌ **Low Priority**: ~5% ของ codebase

### Recommendations
1. **ควรเริ่มจาก Core Modules** (Employee, Workflow)
2. **ควร Migrate Models และ Services ก่อน** Components
3. **ควรใช้ Standalone Components** (Angular 20)
4. **ควรปรับปรุง Code Structure** ในระหว่าง migration
5. **ควรทำ Testing อย่างละเอียด** สำหรับแต่ละ module

---

**เอกสารนี้สร้างเมื่อ**: 2024
**Version**: 1.0
**Status**: Draft for Review



