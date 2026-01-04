# 🏗️ โครงสร้างระบบตามกลุ่มการใช้งาน (Functional Groups)

**วันที่สร้าง:** 2025-01-XX  
**สถานะ:** ✅ ครบถ้วน 100%

---

## 📋 สารบัญ

1. [Authentication & Authorization](#1-authentication--authorization)
2. [People Management](#2-people-management)
3. [Access Control](#3-access-control)
4. [Workforce Management](#4-workforce-management)
5. [Event Management](#5-event-management)
6. [Monitoring & Analytics](#6-monitoring--analytics)
7. [Hardware & Device Management](#7-hardware--device-management)
8. [Configuration & Settings](#8-configuration--settings)
9. [Reports & Data Management](#9-reports--data-management)
10. [System Administration](#10-system-administration)

---

## 1. Authentication & Authorization

### 📝 วัตถุประสงค์
จัดการการยืนยันตัวตน การเข้าสู่ระบบ และการควบคุมสิทธิ์การเข้าถึง

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/
├── auth/
│   └── register/
│       ├── register.component.ts
│       ├── register.component.html
│       └── register.component.scss
├── portal/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   ├── mfa-setup/
│   │   ├── mfa-setup.component.ts
│   │   ├── mfa-setup.component.html
│   │   └── mfa-setup.component.scss
│   ├── forgot-password/
│   │   ├── forgot-password.component.ts
│   │   ├── forgot-password.component.html
│   │   └── forgot-password.component.scss
│   └── reset-password/
│       ├── reset-password.component.ts
│       ├── reset-password.component.html
│       └── reset-password.component.scss
└── super-admin/
    └── rbac/
        ├── rbac.component.ts
        ├── rbac.component.html
        └── rbac.component.scss
```

#### Components:
- `LoginComponent` - หน้าเข้าสู่ระบบ
- `RegisterComponent` - หน้าสมัครสมาชิก
- `MfaSetupComponent` - ตั้งค่า Multi-Factor Authentication
- `ForgotPasswordComponent` - ลืมรหัสผ่าน
- `ResetPasswordComponent` - รีเซ็ตรหัสผ่าน
- `RbacComponent` - จัดการ Roles และ Permissions

### 🛣️ Routes

```typescript
// Portal Routes
{
  path: 'portal/login',
  component: LoginComponent
},
{
  path: 'portal/mfa-setup',
  component: MfaSetupComponent
},
{
  path: 'portal/forgot-password',
  component: ForgotPasswordComponent
},
{
  path: 'portal/reset-password/:token',
  component: ResetPasswordComponent
},
{
  path: 'register',
  component: RegisterComponent
}

// Super Admin Routes
{
  path: 'super/rbac',
  component: RbacComponent,
  canActivate: [superAdminGuard]
},
{
  path: 'super/permissions',
  component: RbacComponent,
  canActivate: [superAdminGuard]
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── auth.service.ts          # Authentication service
├── rbac.service.ts          # Role-Based Access Control
├── multi-factor-verification.service.ts  # MFA service
└── user.service.ts          # User management
```

#### Service Methods:
- `AuthService`:
  - `login(email, password)` - เข้าสู่ระบบ
  - `logout()` - ออกจากระบบ
  - `register(data)` - สมัครสมาชิก
  - `forgotPassword(email)` - ขอรหัสผ่านใหม่
  - `resetPassword(token, newPassword)` - รีเซ็ตรหัสผ่าน
  - `refreshToken()` - รีเฟรช token
  - `getCurrentUser()` - ดึงข้อมูลผู้ใช้ปัจจุบัน
  - `hasPermission(permission)` - ตรวจสอบสิทธิ์

- `RbacService`:
  - `loadRoles()` - ดึงรายชื่อ Roles
  - `createRole(data)` - สร้าง Role ใหม่
  - `updateRole(id, data)` - แก้ไข Role
  - `deleteRole(id)` - ลบ Role
  - `loadPermissions()` - ดึงรายชื่อ Permissions
  - `assignPermissionToRole(roleId, permissionId)` - กำหนด Permission ให้ Role
  - `assignUserRole(userId, roleId)` - กำหนด Role ให้ User

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── auth_routes.py           # Authentication routes
├── role_routes.py           # RBAC routes
└── user_routes.py           # User management routes
```

#### API Endpoints:

**Authentication:**
```
POST   /api/v1/auth/login
  - Body: { email, password }
  - Response: { access_token, refresh_token, user }

POST   /api/v1/auth/logout
  - Headers: Authorization: Bearer <token>

POST   /api/v1/auth/refresh
  - Body: { refresh_token }
  - Response: { access_token, refresh_token }

POST   /api/v1/auth/register
  - Body: { email, password, firstName, lastName, companyName, ... }

POST   /api/v1/auth/forgot-password
  - Body: { email }

POST   /api/v1/auth/reset-password
  - Body: { token, new_password }

POST   /api/v1/auth/verify-email
  - Body: { token }

GET    /api/v1/users/me
  - Headers: Authorization: Bearer <token>
  - Response: User object
```

**RBAC:**
```
GET    /api/v1/rbac/roles
  - Query params: page, limit, search
  - Response: { data: Role[], total, page, limit, totalPages }

GET    /api/v1/rbac/roles/{id}
  - Response: Role

POST   /api/v1/rbac/roles
  - Body: { name, description, permissions: string[] }

PUT    /api/v1/rbac/roles/{id}
  - Body: { name?, description?, permissions?: string[] }

DELETE /api/v1/rbac/roles/{id}

GET    /api/v1/rbac/permissions
  - Query params: page, limit, search, category
  - Response: { data: Permission[], total, page, limit, totalPages }

GET    /api/v1/rbac/permissions/{id}
  - Response: Permission

POST   /api/v1/rbac/permissions
  - Body: { name, description, category }

PUT    /api/v1/rbac/permissions/{id}
  - Body: { name?, description?, category? }

DELETE /api/v1/rbac/permissions/{id}

GET    /api/v1/rbac/roles/{id}/permissions
  - Response: Permission[]

POST   /api/v1/rbac/roles/{id}/permissions/{permissionId}
  - Body: {}

DELETE /api/v1/rbac/roles/{id}/permissions/{permissionId}

PUT    /api/v1/rbac/roles/{id}/permissions
  - Body: { permissionIds: string[] }

GET    /api/v1/rbac/users/{id}/roles
  - Response: Role[]

POST   /api/v1/rbac/users/{id}/roles/{roleId}
  - Body: {}

DELETE /api/v1/rbac/users/{id}/roles/{roleId}
```

**User Management:**
```
GET    /api/v1/admin/members
  - Query params: page, limit, search, status, role, companyId
  - Response: { data: User[], total, page, limit, totalPages }

GET    /api/v1/admin/members/{id}
  - Response: User

POST   /api/v1/admin/members
  - Body: { email, password, firstName, lastName, roleId, companyId, ... }

PUT    /api/v1/admin/members/{id}
  - Body: { email?, firstName?, lastName?, roleId?, companyId?, ... }

DELETE /api/v1/admin/members/{id}

POST   /api/v1/admin/members/{id}/status
  - Body: { status }

POST   /api/v1/admin/members/{id}/reset-password
  - Body: { newPassword }
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── user.model.ts            # User interface
├── auth.model.ts            # Auth interfaces
└── rbac.model.ts            # Role, Permission interfaces
```

#### Model Definitions:
```typescript
// User Model
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId?: string;
  roles: Role[];
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Role Model
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt?: string;
}

// Permission Model
interface Permission {
  id: string;
  name: string;
  description?: string;
  category: string;
  createdAt: string;
}
```

---

## 2. People Management

### 📝 วัตถุประสงค์
จัดการข้อมูลบุคคลในระบบ: พนักงาน, ผู้เยี่ยมชม, และแขก

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/portal/
├── employees/
│   ├── employees.component.ts
│   ├── employees.component.html
│   └── employees.component.scss
├── visitors/
│   ├── visitors.component.ts
│   ├── visitors.component.html
│   └── visitors.component.scss
└── guests/
    ├── guests.component.ts
    ├── guests.component.html
    └── guests.component.scss
```

#### Components:
- `EmployeesComponent` - จัดการพนักงาน
- `VisitorsComponent` - จัดการผู้เยี่ยมชม
- `GuestsComponent` - จัดการแขก

### 🛣️ Routes

```typescript
{
  path: 'portal/employees',
  component: EmployeesComponent,
  canActivate: [permissionGuard],
  data: { permission: 'employee.view' }
},
{
  path: 'portal/visitors',
  component: VisitorsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'visitor.view' }
},
{
  path: 'portal/guests',
  component: GuestsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'guest.view' }
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── employee.service.ts      # Employee management
├── visitor.service.ts       # Visitor management
├── visitor-extended.service.ts  # Extended visitor features
└── guest.service.ts         # Guest management
```

#### Service Methods:

**EmployeeService:**
- `getEmployees(filters?)` - ดึงรายชื่อพนักงาน
- `getEmployeeById(id)` - ดึงข้อมูลพนักงานตาม ID
- `createEmployee(data)` - สร้างพนักงานใหม่
- `updateEmployee(id, data)` - แก้ไขข้อมูลพนักงาน
- `deleteEmployee(id)` - ลบพนักงาน
- `getSubordinates(managerId)` - ดึงพนักงานในความดูแล
- `getEmployeeStats(companyId?)` - ดึงสถิติพนักงาน
- `exportEmployees(format, filters?)` - Export ข้อมูลพนักงาน

**VisitorService:**
- `getVisitors(filters?)` - ดึงรายชื่อผู้เยี่ยมชม
- `getVisitorById(id)` - ดึงข้อมูลผู้เยี่ยมชมตาม ID
- `createVisitor(data)` - สร้างผู้เยี่ยมชมใหม่
- `updateVisitor(id, data)` - แก้ไขข้อมูลผู้เยี่ยมชม
- `deleteVisitor(id)` - ลบผู้เยี่ยมชม
- `checkInVisitor(id, data)` - เช็คอินผู้เยี่ยมชม
- `checkOutVisitor(id, data)` - เช็คเอาท์ผู้เยี่ยมชม
- `approveVisitor(id, data)` - อนุมัติผู้เยี่ยมชม
- `blacklistVisitor(id, data)` - เพิ่มเข้า Blacklist
- `getVisitorStats(filters?)` - ดึงสถิติผู้เยี่ยมชม
- `exportVisitors(format, filters?)` - Export ข้อมูลผู้เยี่ยมชม

**GuestService:**
- `getGuests(filters?)` - ดึงรายชื่อแขก
- `getGuestById(id)` - ดึงข้อมูลแขกตาม ID
- `createGuest(data)` - สร้างแขกใหม่
- `updateGuest(id, data)` - แก้ไขข้อมูลแขก
- `deleteGuest(id)` - ลบแขก
- `checkInGuest(id, data)` - เช็คอินแขก
- `checkOutGuest(id, data)` - เช็คเอาท์แขก
- `getGuestStats(filters?)` - ดึงสถิติแขก

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── employee_routes.py       # Employee routes
├── visitor_routes.py        # Visitor routes
├── visitor_extended_routes.py  # Extended visitor features
└── guest_routes.py          # Guest routes
```

#### API Endpoints:

**Employees:**
```
GET    /api/v1/employees
  - Query params: page, limit, search, departmentId, positionId, isActive, sortBy, sortOrder
  - Response: { data: Employee[], total, page, limit, totalPages }

GET    /api/v1/employees/{id}
  - Response: EmployeeDetail

POST   /api/v1/employees
  - Body: { firstName, lastName, email, positionId, departmentId, ... }

PUT    /api/v1/employees/{id}
  - Body: { firstName?, lastName?, email?, positionId?, departmentId?, ... }

DELETE /api/v1/employees/{id}

GET    /api/v1/employees/{id}/subordinates
  - Response: Employee[]

GET    /api/v1/employees/stats
  - Query params: companyId
  - Response: EmployeeStatistics

GET    /api/v1/employees/hierarchy
  - Query params: companyId
  - Response: EmployeeHierarchy[]

GET    /api/v1/employees/export
  - Query params: format (csv|json|excel), filters
  - Response: Blob
```

**Visitors:**
```
GET    /api/v1/visitors/company/{companyId}
  - Query params: page, limit, search, status_filter, sortBy, sortOrder
  - Response: { data: Visitor[], total, page, limit, totalPages }

GET    /api/v1/visitors/company/{companyId}/{visitorId}
  - Response: Visitor

POST   /api/v1/visitors/company/{companyId}
  - Body: { name, email, phone, companyName, visitPurpose, appointmentDate, ... }

PUT    /api/v1/visitors/company/{companyId}/{visitorId}
  - Body: { name?, email?, phone?, companyName?, visitPurpose?, ... }

DELETE /api/v1/visitors/company/{companyId}/{visitorId}

POST   /api/v1/visitors/company/{companyId}/{visitorId}/check-in
  - Body: { checkInTime?, location?, notes? }

POST   /api/v1/visitors/company/{companyId}/{visitorId}/check-out
  - Body: { checkOutTime?, notes? }

POST   /api/v1/visitors/company/{companyId}/{visitorId}/approve
  - Body: { approved: boolean, notes? }

POST   /api/v1/visitors/company/{companyId}/{visitorId}/blacklist
  - Body: { blacklisted: boolean, reason? }

GET    /api/v1/visitors/company/{companyId}/statistics
  - Response: { total, pending, approved, checkedIn, checkedOut, blacklisted }

GET    /api/v1/visitors/company/{companyId}/export
  - Query params: format (csv|json|excel), filters
  - Response: Blob

GET    /api/v1/visitors/{visitorId}/visits
  - Response: VisitorVisit[]

POST   /api/v1/visitor-invitations
  - Body: { visitorId, email, ... }

GET    /api/v1/visitor-invitations
  - Response: VisitorInvitation[]

POST   /api/v1/visitor-invitations/{id}/send
  - Body: {}

POST   /api/v1/visitor-badges
  - Body: { visitorId, ... }

POST   /api/v1/visitor-badges/{id}/return
  - Body: { returnNotes? }

GET    /api/v1/visitor-badges
  - Response: VisitorBadge[]
```

**Guests:**
```
GET    /api/v1/guests/company/{companyId}
  - Query params: page, limit, search, status_filter, sortBy, sortOrder
  - Response: { data: Guest[], total, page, limit, totalPages }

GET    /api/v1/guests/company/{companyId}/{guestId}
  - Response: Guest

POST   /api/v1/guests/company/{companyId}
  - Body: { name, email, phone, companyName, visitPurpose, ... }

PUT    /api/v1/guests/company/{companyId}/{guestId}
  - Body: { name?, email?, phone?, companyName?, visitPurpose?, ... }

DELETE /api/v1/guests/company/{companyId}/{guestId}

POST   /api/v1/guests/company/{companyId}/{guestId}/check-in
  - Body: { checkInTime?, location?, notes? }

POST   /api/v1/guests/company/{companyId}/{guestId}/check-out
  - Body: { checkOutTime?, notes? }

GET    /api/v1/guests/company/{companyId}/statistics
  - Response: GuestStatistics
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── employee-display.model.ts  # Employee interfaces
├── employee.model.ts          # Employee base model
├── visitor.model.ts           # Visitor interfaces
└── guest.model.ts             # Guest interfaces
```

#### Model Definitions:
```typescript
// Employee Model
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId?: string;
  positionId?: string;
  departmentId?: string;
  position?: Position;
  department?: Department;
  isActive: boolean;
  joinedAt?: string;
  leftAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// Visitor Model
interface Visitor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  visitPurpose: string;
  appointmentDate?: string;
  status: VisitorStatus;
  checkInTime?: string;
  checkOutTime?: string;
  isBlacklisted: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Guest Model
interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  visitPurpose: string;
  status: GuestStatus;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
  updatedAt?: string;
}
```

---

## 3. Access Control

### 📝 วัตถุประสงค์
ควบคุมการเข้าถึงสถานที่และทรัพยากรผ่านประตู, ยานพาหนะ, ที่จอดรถ, QR Code, RFID Card, และ Biometric Data

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/portal/
├── doors/
│   ├── doors.component.ts
│   ├── doors.component.html
│   └── doors.component.scss
├── vehicles/
│   ├── vehicles.component.ts
│   ├── vehicles.component.html
│   └── vehicles.component.scss
├── parking-spots/
│   ├── parking-spots.component.ts
│   ├── parking-spots.component.html
│   └── parking-spots.component.scss
├── qr-codes/
│   ├── qr-codes.component.ts
│   ├── qr-codes.component.html
│   └── qr-codes.component.scss
├── rfid-cards/
│   ├── rfid-cards.component.ts
│   ├── rfid-cards.component.html
│   └── rfid-cards.component.scss
└── biometric-data/
    ├── biometric-data.component.ts
    ├── biometric-data.component.html
    └── biometric-data.component.scss
```

#### Components:
- `DoorsComponent` - จัดการประตูและการเข้าถึง
- `VehiclesComponent` - จัดการยานพาหนะ
- `ParkingSpotsComponent` - จัดการที่จอดรถ
- `QRCodesComponent` - จัดการ QR Codes
- `RFIDCardsComponent` - จัดการ RFID Cards
- `BiometricDataComponent` - จัดการข้อมูล Biometric

### 🛣️ Routes

```typescript
{
  path: 'portal/access-control/doors',
  component: DoorsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'door.view' }
},
{
  path: 'portal/vehicles',
  component: VehiclesComponent,
  canActivate: [permissionGuard],
  data: { permission: 'vehicle.view' }
},
{
  path: 'portal/parking-spots',
  component: ParkingSpotsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'parking.view' }
},
{
  path: 'portal/qr-codes',
  component: QRCodesComponent,
  canActivate: [permissionGuard],
  data: { permission: 'qrcode.view' }
},
{
  path: 'portal/rfid-cards',
  component: RFIDCardsComponent
},
{
  path: 'portal/biometric-data',
  component: BiometricDataComponent
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── door.service.ts          # Door management
├── vehicle.service.ts       # Vehicle management
├── parking.service.ts       # Parking management
├── qr-code.service.ts       # QR Code management
├── rfid-card.service.ts     # RFID Card management
└── biometric-data.service.ts  # Biometric data management
```

#### Service Methods:

**DoorService:**
- `getDoors(filters?)` - ดึงรายชื่อประตู
- `getDoorById(id)` - ดึงข้อมูลประตูตาม ID
- `createDoor(data)` - สร้างประตูใหม่
- `updateDoor(id, data)` - แก้ไขข้อมูลประตู
- `deleteDoor(id)` - ลบประตู
- `grantAccess(doorId, data)` - อนุญาตการเข้าถึง
- `revokeAccess(doorId, data)` - ยกเลิกการเข้าถึง
- `getAccessLogs(doorId, filters?)` - ดึงประวัติการเข้าถึง

**VehicleService:**
- `getVehicles(filters?)` - ดึงรายชื่อยานพาหนะ
- `getVehicleById(id)` - ดึงข้อมูลยานพาหนะตาม ID
- `createVehicle(data)` - สร้างยานพาหนะใหม่
- `updateVehicle(id, data)` - แก้ไขข้อมูลยานพาหนะ
- `deleteVehicle(id)` - ลบยานพาหนะ
- `checkInVehicle(id, data)` - เช็คอินยานพาหนะ
- `checkOutVehicle(id, data)` - เช็คเอาท์ยานพาหนะ
- `assignParking(id, data)` - กำหนดที่จอดรถ
- `getVehicleStats(filters?)` - ดึงสถิติยานพาหนะ

**ParkingService:**
- `getParkingSpaces(filters?)` - ดึงรายชื่อที่จอดรถ
- `getParkingSpaceById(id)` - ดึงข้อมูลที่จอดรถตาม ID
- `createParkingSpace(data)` - สร้างที่จอดรถใหม่
- `updateParkingSpace(id, data)` - แก้ไขข้อมูลที่จอดรถ
- `deleteParkingSpace(id)` - ลบที่จอดรถ
- `getReservations(filters?)` - ดึงการจองที่จอดรถ
- `createReservation(data)` - จองที่จอดรถ
- `getParkingStats(filters?)` - ดึงสถิติที่จอดรถ

**QRCodeService:**
- `getQRCodes(filters?)` - ดึงรายชื่อ QR Code
- `getQRCodeById(id)` - ดึงข้อมูล QR Code ตาม ID
- `createQRCode(data)` - สร้าง QR Code ใหม่
- `updateQRCode(id, data)` - แก้ไขข้อมูล QR Code
- `deleteQRCode(id)` - ลบ QR Code
- `verifyQRCode(data)` - ตรวจสอบ QR Code
- `getQRCodeStats(filters?)` - ดึงสถิติ QR Code

**RFIDCardService:**
- `getRFIDCards(filters?)` - ดึงรายชื่อ RFID Card
- `getRFIDCardById(id)` - ดึงข้อมูล RFID Card ตาม ID
- `createRFIDCard(data)` - สร้าง RFID Card ใหม่
- `updateRFIDCard(id, data)` - แก้ไขข้อมูล RFID Card
- `deleteRFIDCard(id)` - ลบ RFID Card
- `verifyRFIDCard(data)` - ตรวจสอบ RFID Card
- `getRFIDCardStats(filters?)` - ดึงสถิติ RFID Card

**BiometricDataService:**
- `getBiometricData(filters?)` - ดึงข้อมูล Biometric
- `getBiometricDataById(id)` - ดึงข้อมูล Biometric ตาม ID
- `createBiometricData(data)` - สร้างข้อมูล Biometric ใหม่
- `updateBiometricData(id, data)` - แก้ไขข้อมูล Biometric
- `deleteBiometricData(id)` - ลบข้อมูล Biometric
- `downloadBiometricData(id)` - ดาวน์โหลดข้อมูล Biometric

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── door_routes.py           # Door routes
├── vehicle_routes.py        # Vehicle routes
├── parking_routes.py       # Parking routes
├── qr_code_routes.py       # QR Code routes
├── rfid_card_routes.py     # RFID Card routes
└── biometric_data_routes.py  # Biometric data routes
```

#### API Endpoints:

**Doors:**
```
GET    /api/v1/doors/company/{companyId}
  - Query params: page, limit, search, status, locationId
  - Response: { data: Door[], total, page, limit, totalPages }

GET    /api/v1/doors/{doorId}
  - Response: Door

POST   /api/v1/doors
  - Body: { name, locationId, deviceId, accessRules, ... }

PUT    /api/v1/doors/{doorId}
  - Body: { name?, locationId?, deviceId?, accessRules?, ... }

DELETE /api/v1/doors/{doorId}

GET    /api/v1/doors/{doorId}/access-logs
  - Query params: page, limit, startDate, endDate, memberId
  - Response: { data: AccessLog[], total, page, limit, totalPages }

POST   /api/v1/doors/{doorId}/grant-access
  - Body: { memberId, startTime, endTime, ... }

POST   /api/v1/doors/{doorId}/revoke-access
  - Body: { memberId }
```

**Vehicles:**
```
GET    /api/v1/vehicles/company/{companyId}
  - Query params: page, limit, search, status, sortBy, sortOrder
  - Response: { data: Vehicle[], total, page, limit, totalPages }

GET    /api/v1/vehicles/company/{companyId}/{vehicleId}
  - Response: Vehicle

POST   /api/v1/vehicles/company/{companyId}
  - Body: { licensePlate, vehicleType, ownerId, brand, model, color, ... }

PUT    /api/v1/vehicles/company/{companyId}/{vehicleId}
  - Body: { licensePlate?, vehicleType?, ownerId?, brand?, model?, color?, ... }

DELETE /api/v1/vehicles/company/{companyId}/{vehicleId}

POST   /api/v1/vehicles/company/{companyId}/{vehicleId}/check-in
  - Body: { checkInTime?, parkingSpotId?, notes? }

POST   /api/v1/vehicles/company/{companyId}/{vehicleId}/check-out
  - Body: { checkOutTime?, notes? }

POST   /api/v1/vehicles/company/{companyId}/{vehicleId}/assign-parking
  - Body: { parkingSpotId }

GET    /api/v1/vehicles/company/{companyId}/parking-spots
  - Response: ParkingSpot[]

GET    /api/v1/vehicles/company/{companyId}/statistics
  - Response: VehicleStatistics
```

**Parking:**
```
GET    /api/v1/parking/spaces
  - Query params: page, limit, search, status, locationId
  - Response: { data: ParkingSpace[], total, page, limit, totalPages }

GET    /api/v1/parking/spaces/{id}
  - Response: ParkingSpace

POST   /api/v1/parking/spaces
  - Body: { name, locationId, spotType, capacity, ... }

PUT    /api/v1/parking/spaces/{id}
  - Body: { name?, locationId?, spotType?, capacity?, ... }

DELETE /api/v1/parking/spaces/{id}

GET    /api/v1/parking/vehicles
  - Query params: page, limit, status
  - Response: { data: Vehicle[], total, page, limit, totalPages }

GET    /api/v1/parking/reservations
  - Query params: page, limit, vehicleId, spaceId, startDate, endDate
  - Response: { data: Reservation[], total, page, limit, totalPages }

POST   /api/v1/parking/reservations
  - Body: { vehicleId, spaceId, startTime, endTime }

GET    /api/v1/parking/statistics
  - Query params: startDate, endDate, locationId
  - Response: ParkingStatistics
```

**QR Codes:**
```
GET    /api/v1/qr-codes
  - Query params: page, limit, search, status, type
  - Response: { data: QRCode[], total, page, limit, totalPages }

GET    /api/v1/qr-codes/{id}
  - Response: QRCode

GET    /api/v1/qr-codes/data/{data}
  - Response: QRCode

POST   /api/v1/qr-codes
  - Body: { data, type, status, expirationDate?, ... }

PUT    /api/v1/qr-codes/{id}
  - Body: { data?, type?, status?, expirationDate?, ... }

DELETE /api/v1/qr-codes/{id}

POST   /api/v1/qr-codes/verify
  - Body: { qrCodeData }

GET    /api/v1/qr-codes/statistics
  - Response: QRCodeStatistics

GET    /api/v1/qr-codes/types
  - Response: QRCodeType[]

POST   /api/v1/qr-codes/{id}/status
  - Body: { status }

POST   /api/v1/qr-codes/{id}/authorization
  - Body: { authorized, memberId?, ... }

POST   /api/v1/qr-codes/import
  - Content-Type: multipart/form-data
  - Body: file
```

**RFID Cards:**
```
GET    /api/v1/rfid-cards
  - Query params: page, limit, search, status, type
  - Response: { data: RFIDCard[], total, page, limit, totalPages }

GET    /api/v1/rfid-cards/{id}
  - Response: RFIDCard

GET    /api/v1/rfid-cards/number/{number}
  - Response: RFIDCard

POST   /api/v1/rfid-cards
  - Body: { cardNumber, memberId, cardType, status, expirationDate?, ... }

PUT    /api/v1/rfid-cards/{id}
  - Body: { cardNumber?, memberId?, cardType?, status?, expirationDate?, ... }

DELETE /api/v1/rfid-cards/{id}

POST   /api/v1/rfid-cards/verify
  - Body: { cardNumber }

GET    /api/v1/rfid-cards/statistics
  - Response: RFIDCardStatistics

GET    /api/v1/rfid-cards/types
  - Response: RFIDCardType[]

POST   /api/v1/rfid-cards/{id}/status
  - Body: { status }

POST   /api/v1/rfid-cards/{id}/authorization
  - Body: { authorized, memberId?, ... }

POST   /api/v1/rfid-cards/import
  - Content-Type: multipart/form-data
  - Body: file
```

**Biometric Data:**
```
GET    /api/v1/biometric-data
  - Query params: page, limit, search, memberId, type
  - Response: { data: BiometricData[], total, page, limit, totalPages }

GET    /api/v1/biometric-data/{id}
  - Response: BiometricData

POST   /api/v1/biometric-data
  - Content-Type: multipart/form-data
  - Body: { memberId, biometricType, data, ... }

PUT    /api/v1/biometric-data/{id}
  - Body: { memberId?, biometricType?, data?, ... }

DELETE /api/v1/biometric-data/{id}

GET    /api/v1/biometric-data/{id}/download
  - Response: Blob

GET    /api/v1/biometric-data/statistics
  - Response: BiometricDataStatistics
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── door.model.ts            # Door interfaces
├── vehicle.model.ts         # Vehicle interfaces
├── parking.model.ts         # Parking interfaces
├── qr-code.model.ts        # QR Code interfaces
├── rfid-card.model.ts      # RFID Card interfaces
└── biometric-data.model.ts  # Biometric data interfaces
```

---

## 4. Workforce Management

### 📝 วัตถุประสงค์
จัดการการเข้างาน, Shift, และการลา

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/portal/
├── attendance/
│   ├── attendance.component.ts
│   ├── attendance.component.html
│   └── attendance.component.scss
├── shifts/
│   ├── shifts.component.ts
│   ├── shifts.component.html
│   └── shifts.component.scss
└── leaves/
    ├── leaves.component.ts
    ├── leaves.component.html
    └── leaves.component.scss
```

#### Components:
- `AttendanceComponent` - จัดการการเข้างาน
- `ShiftsComponent` - จัดการ Shift
- `LeavesComponent` - จัดการการลา

### 🛣️ Routes

```typescript
{
  path: 'portal/attendance',
  component: AttendanceComponent,
  canActivate: [permissionGuard],
  data: { permission: 'attendance.view' }
},
{
  path: 'portal/config/shifts',
  component: ShiftsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'shift.view' }
},
{
  path: 'portal/leaves',
  component: LeavesComponent,
  canActivate: [permissionGuard],
  data: { permission: 'leave.view' }
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── timestamp.service.ts     # Attendance/Timestamp management
├── shift.service.ts         # Shift management
└── leave.service.ts         # Leave management
```

#### Service Methods:

**TimestampService:**
- `getTimestamps(filters?)` - ดึงบันทึกการเข้างาน
- `getTimestampById(id)` - ดึงข้อมูลการเข้างานตาม ID
- `createTimestamp(data)` - สร้างบันทึกการเข้างาน
- `updateTimestamp(id, data)` - แก้ไขบันทึกการเข้างาน
- `deleteTimestamp(id)` - ลบบันทึกการเข้างาน
- `approveTimestamp(id, data)` - อนุมัติการเข้างาน
- `rejectTimestamp(id, data)` - ปฏิเสธการเข้างาน

**ShiftService:**
- `getShifts(filters?)` - ดึงรายชื่อ Shift
- `getShiftById(id)` - ดึงข้อมูล Shift ตาม ID
- `createShift(data)` - สร้าง Shift ใหม่
- `updateShift(id, data)` - แก้ไขข้อมูล Shift
- `deleteShift(id)` - ลบ Shift
- `assignShift(shiftId, data)` - กำหนด Shift ให้พนักงาน

**LeaveService:**
- `getLeaves(filters?)` - ดึงรายการลา
- `getLeaveById(id)` - ดึงข้อมูลการลาตาม ID
- `createLeave(data)` - สร้างคำขอลา
- `updateLeave(id, data)` - แก้ไขข้อมูลการลา
- `deleteLeave(id)` - ลบการลา
- `approveLeave(id, data)` - อนุมัติการลา
- `rejectLeave(id, data)` - ปฏิเสธการลา
- `getLeaveStats(filters?)` - ดึงสถิติการลา

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── employee_timestamp_routes.py  # Attendance/Timestamp routes
├── shift_routes.py              # Shift routes
└── leave_routes.py              # Leave routes
```

#### API Endpoints:

**Timestamps (Attendance):**
```
GET    /api/v1/employee-timestamps/company/{companyId}
  - Query params: page, limit, employeeId, dateFrom, dateTo, type, sortBy, sortOrder
  - Response: { data: Timestamp[], total, page, limit, totalPages }

GET    /api/v1/employee-timestamps/company/{companyId}/{timestampId}
  - Response: Timestamp

POST   /api/v1/employee-timestamps/company/{companyId}
  - Body: { employeeId, type, timestamp, location, method, ... }

PUT    /api/v1/employee-timestamps/company/{companyId}/{timestampId}
  - Body: { employeeId?, type?, timestamp?, location?, method?, ... }

DELETE /api/v1/employee-timestamps/company/{companyId}/{timestampId}

POST   /api/v1/employee-timestamps/company/{companyId}/{timestampId}/approve
  - Body: { approved: true, notes? }

POST   /api/v1/employee-timestamps/company/{companyId}/{timestampId}/reject
  - Body: { approved: false, notes? }

GET    /api/v1/dashboard/employee/{employeeId}/attendance-history
  - Query params: start_date, end_date
  - Response: Timestamp[]
```

**Shifts:**
```
GET    /api/v1/shifts
  - Query params: page, limit, search, status
  - Response: { data: Shift[], total, page, limit, totalPages }

GET    /api/v1/shifts/{id}
  - Response: Shift

POST   /api/v1/shifts
  - Body: { name, startTime, endTime, breakDuration?, ... }

PUT    /api/v1/shifts/{id}
  - Body: { name?, startTime?, endTime?, breakDuration?, ... }

DELETE /api/v1/shifts/{id}

GET    /api/v1/shifts/{id}/assignments
  - Response: ShiftAssignment[]

POST   /api/v1/shifts/{id}/assign
  - Body: { employeeId, startDate, endDate?, ... }
```

**Leaves:**
```
GET    /api/v1/leaves
  - Query params: page, limit, search, status, employeeId, leaveType, startDate, endDate
  - Response: { data: Leave[], total, page, limit, totalPages }

GET    /api/v1/leaves/{id}
  - Response: Leave

POST   /api/v1/leaves
  - Body: { employeeId, leaveType, startDate, endDate, reason, ... }

PUT    /api/v1/leaves/{id}
  - Body: { leaveType?, startDate?, endDate?, reason?, ... }

DELETE /api/v1/leaves/{id}

POST   /api/v1/leaves/{id}/approve
  - Body: { approved: true, notes? }

POST   /api/v1/leaves/{id}/reject
  - Body: { approved: false, notes? }

GET    /api/v1/leaves/statistics
  - Query params: employeeId, year
  - Response: LeaveStatistics
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── timestamp.model.ts       # Timestamp/Attendance interfaces
├── shift.model.ts           # Shift interfaces
└── leave.model.ts           # Leave interfaces
```

---

## 5. Event Management

### 📝 วัตถุประสงค์
จัดการ Events, Attendees, และ Event Check-in

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/
├── portal/
│   └── events/
│       ├── events.component.ts
│       ├── events.component.html
│       ├── events.component.scss
│       ├── event-analytics/
│       │   ├── event-analytics.component.ts
│       │   ├── event-analytics.component.html
│       │   └── event-analytics.component.scss
│       └── event-checkin-history/
│           ├── event-checkin-history.component.ts
│           ├── event-checkin-history.component.html
│           └── event-checkin-history.component.scss
└── public/
    └── event-registration/
        ├── event-registration.component.ts
        ├── event-registration.component.html
        └── event-registration.component.scss
```

#### Components:
- `EventsComponent` - จัดการ Events (Admin)
- `EventAnalyticsComponent` - วิเคราะห์ Events
- `EventCheckinHistoryComponent` - ประวัติการ Check-in
- `EventRegistrationComponent` - ลงทะเบียน Event (Public)

### 🛣️ Routes

```typescript
{
  path: 'portal/events',
  component: EventsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'event.view' }
},
{
  path: 'portal/events/analytics',
  component: EventAnalyticsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'event.view' }
},
{
  path: 'portal/events/:eventId/checkin-history',
  component: EventCheckinHistoryComponent,
  canActivate: [permissionGuard],
  data: { permission: 'event.view' }
},
{
  path: 'events/register/:publicUrl',
  component: EventRegistrationComponent
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── event.service.ts         # Event management
└── public.service.ts        # Public event registration
```

#### Service Methods:

**EventService:**
- `getAll(filters?)` - ดึงรายการ Events
- `getById(id)` - ดึงข้อมูล Event ตาม ID
- `create(data)` - สร้าง Event ใหม่
- `update(id, data)` - แก้ไข Event
- `delete(id)` - ลบ Event
- `getAttendees(eventId)` - ดึงรายชื่อ Attendees
- `addAttendee(data)` - เพิ่ม Attendee
- `getEventStatistics(eventId)` - ดึงสถิติ Event
- `sendReminders(data)` - ส่งการแจ้งเตือน
- `getPublicEventDetails(publicUrl)` - ดึงข้อมูล Event (Public)
- `registerForPublicEvent(publicUrl, data)` - ลงทะเบียน Event (Public)
- `checkInViaKiosk(apiKey, files)` - Check-in ผ่าน Kiosk

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
└── event_routes.py          # Event routes
```

#### API Endpoints:

**Events (Admin):**
```
GET    /api/v1/events
  - Query params: page, size, search, status, eventType, location
  - Response: { items: Event[], total, page, size, totalPages }

GET    /api/v1/events/{eventId}
  - Response: Event

POST   /api/v1/events
  - Body: { eventName, description, startDate, endDate, location, eventType, maxAttendees?, publicUrl?, ... }

PUT    /api/v1/events/{eventId}
  - Body: { eventName?, description?, startDate?, endDate?, location?, eventType?, maxAttendees?, publicUrl?, ... }

DELETE /api/v1/events/{eventId}

GET    /api/v1/events/{eventId}/attendees
  - Response: EventAttendee[]

POST   /api/v1/events/attendees
  - Body: { eventId, memberId, email, firstName, lastName, ... }

POST   /api/v1/events/{eventId}/attendees/bulk
  - Body: { attendees: [{ memberId?, email, firstName, lastName, ... }] }

GET    /api/v1/events/{eventId}/devices
  - Response: Device[]

POST   /api/v1/devices/{deviceId}/link-event
  - Body: { eventId, link: boolean }

GET    /api/v1/events/{eventId}/statistics
  - Response: { totalRegistrations, checkedIn, attendanceRate, ... }

POST   /api/v1/events/{eventId}/send-reminders
  - Body: { reminderType, scheduledTime? }

GET    /api/v1/events/{eventId}/attendees/export
  - Response: Blob
```

**Events (Public):**
```
GET    /api/v1/events/public/details/{publicUrl}
  - Response: PublicEventResponse

POST   /api/v1/events/public/register/{publicUrl}
  - Body: { email, firstName, lastName, phone?, ... }

POST   /api/v1/events/public/register/{publicUrl}/confirm-email
  - Query params: token
  - Body: {}

GET    /api/v1/events/public/{publicUrl}/qr-code
  - Response: { qrCode: string }

GET    /api/v1/events/public/{publicUrl}/check-status
  - Query params: email
  - Response: { status, checkedIn, checkInTime? }
```

**Events (Kiosk):**
```
POST   /api/v1/events/kiosk/check-in
  - Headers: X-API-Key: <api_key>
  - Content-Type: multipart/form-data
  - Body: { files: File[], api_key }
  - Response: { success, attendee, event }
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
└── event.model.ts           # Event interfaces
```

---

## 6. Monitoring & Analytics

### 📝 วัตถุประสงค์
ติดตามและวิเคราะห์ข้อมูลแบบ Real-time, Video Analytics, AI Models, Alerts, และ Notifications

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/portal/
├── monitoring/
│   ├── monitoring.component.ts
│   ├── monitoring.component.html
│   └── monitoring.component.scss
├── video-analytics/
│   ├── video-analytics.component.ts
│   ├── video-analytics.component.html
│   └── video-analytics.component.scss
├── ai-models/
│   ├── ai-models.component.ts
│   ├── ai-models.component.html
│   └── ai-models.component.scss
├── alerts/
│   ├── alerts.component.ts
│   ├── alerts.component.html
│   └── alerts.component.scss
└── notifications/
    ├── notifications.component.ts
    ├── notifications.component.html
    └── notifications.component.scss
```

#### Components:
- `MonitoringComponent` - ติดตามสถานะระบบ
- `VideoAnalyticsComponent` - วิเคราะห์วิดีโอ
- `AIModelsComponent` - จัดการ AI Models
- `AlertsComponent` - จัดการการแจ้งเตือน
- `NotificationsComponent` - จัดการการแจ้งเตือน

### 🛣️ Routes

```typescript
{
  path: 'portal/monitoring',
  component: MonitoringComponent,
  canActivate: [permissionGuard],
  data: { permission: 'monitoring.view' }
},
{
  path: 'portal/video-analytics',
  component: VideoAnalyticsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'analytics.view' }
},
{
  path: 'portal/ai-models',
  component: AIModelsComponent
},
{
  path: 'portal/alerts',
  component: AlertsComponent
},
{
  path: 'portal/notifications',
  component: NotificationsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'notification.view' }
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── monitoring.service.ts     # Monitoring service
├── video-analytics.service.ts  # Video analytics service
├── ai-model.service.ts      # AI model service
├── ai-model-management.service.ts  # AI model management
├── alert.service.ts         # Alert service
└── notification.service.ts  # Notification service
```

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── monitoring_routes.py     # Monitoring routes
├── video_analytics_routes.py  # Video analytics routes
├── ai_models_routes.py     # AI models routes
├── alert_routes.py         # Alert routes
└── notification_routes.py  # Notification routes
```

#### API Endpoints:

**Monitoring:**
```
GET    /api/v1/monitoring/status
  - Response: { systemStatus, activeStreams, alerts, ... }

GET    /api/v1/monitoring/streams
  - Query params: deviceId, status
  - Response: Stream[]

GET    /api/v1/monitoring/alerts
  - Query params: severity, status, startDate, endDate
  - Response: Alert[]

GET    /api/v1/monitoring/logs
  - Query params: level, startDate, endDate, limit
  - Response: Log[]
```

**Video Analytics:**
```
GET    /api/v1/video-analytics/results
  - Query params: page, limit, startDate, endDate, detectionType, deviceId
  - Response: { data: DetectionResult[], total, page, limit, totalPages }

GET    /api/v1/video-analytics/detections
  - Query params: type, confidence, startDate, endDate
  - Response: Detection[]

GET    /api/v1/video-analytics/statistics
  - Query params: startDate, endDate, deviceId
  - Response: AnalyticsStatistics

GET    /api/v1/video-analytics/rules
  - Query params: deviceId, status
  - Response: Rule[]

POST   /api/v1/video-analytics/rules
  - Body: { name, deviceId, detectionType, conditions, actions, ... }

PUT    /api/v1/video-analytics/rules/{id}
  - Body: { name?, detectionType?, conditions?, actions?, ... }

DELETE /api/v1/video-analytics/rules/{id}
```

**AI Models:**
```
GET    /api/v1/ai-models
  - Query params: page, limit, search, type, status
  - Response: { data: AIModel[], total, page, limit, totalPages }

GET    /api/v1/ai-models/{id}
  - Response: AIModel

POST   /api/v1/ai-models
  - Content-Type: multipart/form-data
  - Body: { name, type, modelFile, version, description?, ... }

PUT    /api/v1/ai-models/{id}
  - Body: { name?, version?, description?, status?, ... }

DELETE /api/v1/ai-models/{id}

POST   /api/v1/ai-models/{id}/deploy
  - Body: { deviceIds: string[] }

POST   /api/v1/ai-models/{id}/undeploy
  - Body: { deviceIds: string[] }

GET    /api/v1/ai-models/{id}/performance
  - Query params: startDate, endDate
  - Response: ModelPerformance

POST   /api/v1/ai-models/processing/start
  - Body: {}

POST   /api/v1/ai-models/processing/stop
  - Body: {}
```

**Alerts:**
```
GET    /api/v1/alerts
  - Query params: page, limit, severity, status, startDate, endDate, type
  - Response: { data: Alert[], total, page, limit, totalPages }

GET    /api/v1/alerts/{id}
  - Response: Alert

POST   /api/v1/alerts
  - Body: { name, type, conditions, actions, severity, ... }

PUT    /api/v1/alerts/{id}
  - Body: { name?, type?, conditions?, actions?, severity?, ... }

DELETE /api/v1/alerts/{id}

POST   /api/v1/alerts/{id}/acknowledge
  - Body: { acknowledged: true, notes? }

POST   /api/v1/alerts/{id}/resolve
  - Body: { resolved: true, resolutionNotes? }

GET    /api/v1/alerts/statistics
  - Query params: startDate, endDate, severity
  - Response: AlertStatistics
```

**Notifications:**
```
GET    /api/v1/notifications
  - Query params: page, limit, read, type, startDate, endDate
  - Response: { data: Notification[], total, page, limit, totalPages }

GET    /api/v1/notifications/{id}
  - Response: Notification

POST   /api/v1/notifications
  - Body: { title, message, type, recipientIds?, channels?, ... }

PUT    /api/v1/notifications/{id}
  - Body: { title?, message?, type?, ... }

DELETE /api/v1/notifications/{id}

POST   /api/v1/notifications/{id}/read
  - Body: { read: true }

POST   /api/v1/notifications/{id}/unread
  - Body: { read: false }

GET    /api/v1/notifications/statistics
  - Query params: startDate, endDate
  - Response: NotificationStatistics
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── monitoring.model.ts      # Monitoring interfaces
├── video-analytics.model.ts  # Video analytics interfaces
├── ai-model.model.ts        # AI model interfaces
├── alert.model.ts           # Alert interfaces
└── notification.model.ts    # Notification interfaces
```

---

## 7. Hardware & Device Management

### 📝 วัตถุประสงค์
จัดการอุปกรณ์, Locations, และ Hardware Status

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/portal/
├── devices/
│   ├── devices.component.ts
│   ├── devices.component.html
│   └── devices.component.scss
├── locations/
│   ├── locations.component.ts
│   ├── locations.component.html
│   └── locations.component.scss
└── hardware-status-dashboard/
    ├── hardware-status-dashboard.component.ts
    ├── hardware-status-dashboard.component.html
    └── hardware-status-dashboard.component.scss
```

#### Components:
- `DevicesComponent` - จัดการอุปกรณ์
- `LocationsComponent` - จัดการ Locations
- `HardwareStatusDashboardComponent` - Dashboard สถานะ Hardware

### 🛣️ Routes

```typescript
{
  path: 'portal/devices',
  component: DevicesComponent,
  canActivate: [permissionGuard],
  data: { permission: 'device.view' }
},
{
  path: 'portal/locations',
  component: LocationsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'location.view' }
},
{
  path: 'portal/hardware-status-dashboard',
  component: HardwareStatusDashboardComponent
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── device-configuration.service.ts  # Device configuration
├── hardware-device-management.service.ts  # Hardware device management
├── location.service.ts      # Location management
└── company-location.service.ts  # Company location management
```

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── device_routes.py         # Device routes
├── company_location_routes.py  # Location routes
└── hardware_monitoring_routes.py  # Hardware monitoring routes
```

#### API Endpoints:

**Devices:**
```
GET    /api/v1/devices/company/{companyId}/devices
  - Query params: page, limit, search, status, deviceType, locationId
  - Response: { data: Device[], total, page, limit, totalPages }

GET    /api/v1/devices/{deviceId}
  - Response: Device

POST   /api/v1/devices/company/{companyId}/devices
  - Body: { name, deviceType, locationId, ipAddress?, macAddress?, ... }

PUT    /api/v1/devices/company/{companyId}/devices/{deviceId}
  - Body: { name?, deviceType?, locationId?, ipAddress?, macAddress?, ... }

DELETE /api/v1/devices/company/{companyId}/devices/{deviceId}

POST   /api/v1/devices/{deviceId}/link-event
  - Body: { eventId, link: boolean }

GET    /api/v1/devices/{deviceId}/config
  - Response: DeviceConfig

PUT    /api/v1/devices/{deviceId}/config
  - Body: { settings: {...} }

POST   /api/v1/devices/{deviceId}/regenerate-key
  - Response: { apiKey: string }

POST   /api/v1/devices/{deviceId}/heartbeat
  - Body: { status, metrics? }
```

**Locations:**
```
GET    /api/v1/locations
  - Query params: page, limit, search, parentId, type
  - Response: { data: Location[], total, page, limit, totalPages }

GET    /api/v1/locations/{id}
  - Response: Location

POST   /api/v1/locations
  - Body: { name, type, parentId?, address?, coordinates?, ... }

PUT    /api/v1/locations/{id}
  - Body: { name?, type?, parentId?, address?, coordinates?, ... }

DELETE /api/v1/locations/{id}

GET    /api/v1/locations/{id}/geofence-zones
  - Response: GeofenceZone[]

POST   /api/v1/locations/{id}/geofence-zones
  - Body: { name, coordinates, radius?, ... }

GET    /api/v1/locations/{id}/devices
  - Response: Device[]
```

**Hardware Status:**
```
GET    /api/v1/hardware-devices/status
  - Response: { devices: DeviceStatus[], total, online, offline, ... }

GET    /api/v1/hardware-devices/{deviceId}/metrics
  - Query params: startDate, endDate, metricType
  - Response: DeviceMetrics

GET    /api/v1/hardware-devices/{deviceId}/health
  - Response: { status, cpuUsage, memoryUsage, diskUsage, ... }

GET    /api/v1/monitoring/hardware-alerts
  - Query params: deviceId, severity, startDate, endDate
  - Response: Alert[]
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── device.model.ts          # Device interfaces
└── location.model.ts        # Location interfaces
```

---

## 8. Configuration & Settings

### 📝 วัตถุประสงค์
จัดการการตั้งค่าระบบ, โครงสร้างองค์กร, Departments, Positions, และ Profile

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/portal/
├── profile/
│   ├── profile.component.ts
│   ├── profile.component.html
│   └── profile.component.scss
├── structure/
│   ├── structure.component.ts
│   ├── structure.component.html
│   └── structure.component.scss
├── departments/
│   ├── departments.component.ts
│   ├── departments.component.html
│   └── departments.component.scss
└── positions/
    ├── positions.component.ts
    ├── positions.component.html
    └── positions.component.scss
```

#### Components:
- `ProfileComponent` - จัดการ Profile
- `StructureComponent` - จัดการโครงสร้างองค์กร
- `DepartmentsComponent` - จัดการ Departments
- `PositionsComponent` - จัดการ Positions

### 🛣️ Routes

```typescript
{
  path: 'portal/profile',
  component: ProfileComponent
},
{
  path: 'portal/structure',
  component: StructureComponent
},
{
  path: 'portal/departments',
  component: DepartmentsComponent
},
{
  path: 'portal/positions',
  component: PositionsComponent
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── company.service.ts       # Company management
├── department.service.ts    # Department management
├── position.service.ts      # Position management
└── system-configuration.service.ts  # System configuration
```

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── company_routes.py        # Company routes
├── department_routes.py     # Department routes
└── position_routes.py      # Position routes
```

#### API Endpoints:

**Profile:**
```
GET    /api/v1/users/me
  - Response: User

PUT    /api/v1/users/me
  - Body: { firstName?, lastName?, email?, phone?, ... }

POST   /api/v1/auth/change-password
  - Body: { currentPassword, newPassword }

POST   /api/v1/users/me/avatar
  - Content-Type: multipart/form-data
  - Body: file
```

**Structure (Company):**
```
GET    /api/v1/companies/{id}
  - Response: Company

PUT    /api/v1/companies/{id}
  - Body: { name?, address?, phone?, email?, ... }

GET    /api/v1/employees/hierarchy
  - Query params: companyId
  - Response: EmployeeHierarchy[]
```

**Departments:**
```
GET    /api/v1/departments
  - Query params: page, limit, search, companyId, parentId
  - Response: { data: Department[], total, page, limit, totalPages }

GET    /api/v1/departments/{id}
  - Response: Department

POST   /api/v1/departments
  - Body: { name, companyId, parentId?, description?, ... }

PUT    /api/v1/departments/{id}
  - Body: { name?, parentId?, description?, ... }

DELETE /api/v1/departments/{id}

GET    /api/v1/departments/{id}/employees
  - Response: Employee[]
```

**Positions:**
```
GET    /api/v1/positions
  - Query params: page, limit, search, companyId, departmentId
  - Response: { data: Position[], total, page, limit, totalPages }

GET    /api/v1/positions/{id}
  - Response: Position

POST   /api/v1/positions
  - Body: { name, companyId, departmentId?, description?, ... }

PUT    /api/v1/positions/{id}
  - Body: { name?, departmentId?, description?, ... }

DELETE /api/v1/positions/{id}

GET    /api/v1/positions/{id}/employees
  - Response: Employee[]
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── company.model.ts         # Company interfaces
├── department.model.ts      # Department interfaces
└── position.model.ts        # Position interfaces
```

---

## 9. Reports & Data Management

### 📝 วัตถุประสงค์
สร้างรายงาน, จัดการ Forms, และ Template Management

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/portal/
├── reports/
│   ├── reports.component.ts
│   ├── reports.component.html
│   └── reports.component.scss
├── advanced-forms/
│   ├── advanced-forms.component.ts
│   ├── advanced-forms.component.html
│   └── advanced-forms.component.scss
└── template-management/
    ├── template-management.component.ts
    ├── template-management.component.html
    └── template-management.component.scss
```

#### Components:
- `ReportsComponent` - จัดการรายงาน
- `AdvancedFormsComponent` - จัดการ Forms
- `TemplateManagementComponent` - จัดการ Templates

### 🛣️ Routes

```typescript
{
  path: 'portal/reports',
  component: ReportsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'report.view' }
},
{
  path: 'portal/advanced-forms',
  component: AdvancedFormsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'form.view' }
},
{
  path: 'portal/template-management',
  component: TemplateManagementComponent
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── advanced-reports.service.ts  # Advanced reports service
└── template-management.service.ts  # Template management service
```

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── reports_routes.py        # Reports routes
└── template_management_routes.py  # Template management routes
```

#### API Endpoints:

**Reports:**
```
GET    /api/v1/reports
  - Query params: page, limit, search, type, startDate, endDate
  - Response: { data: Report[], total, page, limit, totalPages }

GET    /api/v1/reports/{id}
  - Response: Report

POST   /api/v1/reports
  - Body: { name, type, templateId?, parameters?, ... }

GET    /api/v1/reports/{type}/export
  - Query params: format (csv|pdf|excel), startDate, endDate, filters
  - Response: Blob

GET    /api/v1/reports/attendance
  - Query params: startDate, endDate, employeeId, departmentId, format
  - Response: Blob (if format specified) or Report data

GET    /api/v1/reports/visitors
  - Query params: startDate, endDate, status, format
  - Response: Blob (if format specified) or Report data

GET    /api/v1/reports/vehicles
  - Query params: startDate, endDate, format
  - Response: Blob (if format specified) or Report data
```

**Advanced Forms:**
```
GET    /api/v1/forms
  - Query params: page, limit, search, status
  - Response: { data: Form[], total, page, limit, totalPages }

GET    /api/v1/forms/{id}
  - Response: Form

POST   /api/v1/forms
  - Body: { name, fields, settings, ... }

PUT    /api/v1/forms/{id}
  - Body: { name?, fields?, settings?, ... }

DELETE /api/v1/forms/{id}

GET    /api/v1/forms/{id}/submissions
  - Query params: page, limit, startDate, endDate
  - Response: { data: Submission[], total, page, limit, totalPages }

GET    /api/v1/forms/{id}/submissions/export
  - Query params: format (csv|excel)
  - Response: Blob
```

**Template Management:**
```
GET    /api/v1/templates
  - Query params: page, limit, search, type, category
  - Response: { data: Template[], total, page, limit, totalPages }

GET    /api/v1/templates/{id}
  - Response: Template

POST   /api/v1/templates
  - Body: { name, type, category, content, settings, ... }

PUT    /api/v1/templates/{id}
  - Body: { name?, category?, content?, settings?, ... }

DELETE /api/v1/templates/{id}

POST   /api/v1/templates/{id}/duplicate
  - Response: Template
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── report.model.ts          # Report interfaces
├── form.model.ts            # Form interfaces
└── template.model.ts        # Template interfaces
```

---

## 10. System Administration

### 📝 วัตถุประสงค์
จัดการระบบระดับ Super Admin: Companies, Users, System Settings, Maintenance, Audit Logs, Backup & Restore, License Management

### 🎯 Angular Components

#### Frontend Structure:
```
frontend/src/app/features/super-admin/
├── companies/
│   ├── companies.component.ts
│   ├── companies.component.html
│   └── companies.component.scss
├── users/
│   ├── users.component.ts
│   ├── users.component.html
│   └── users.component.scss
├── rbac/
│   ├── rbac.component.ts
│   ├── rbac.component.html
│   └── rbac.component.scss
├── system-settings/
│   ├── system-settings.component.ts
│   ├── system-settings.component.html
│   └── system-settings.component.scss
├── maintenance/
│   ├── maintenance.component.ts
│   ├── maintenance.component.html
│   └── maintenance.component.scss
├── audit-logs/
│   ├── audit-logs.component.ts
│   ├── audit-logs.component.html
│   └── audit-logs.component.scss
├── backup-restore/
│   ├── backup-restore.component.ts
│   ├── backup-restore.component.html
│   └── backup-restore.component.scss
├── license-management/
│   ├── license-management.component.ts
│   ├── license-management.component.html
│   └── license-management.component.scss
└── module-subscription/
    ├── module-subscription.component.ts
    ├── module-subscription.component.html
    └── module-subscription.component.scss
```

#### Components:
- `CompaniesComponent` - จัดการ Companies
- `UsersComponent` - จัดการ Users
- `RbacComponent` - จัดการ RBAC
- `SystemSettingsComponent` - จัดการ System Settings
- `MaintenanceComponent` - จัดการ Maintenance
- `AuditLogsComponent` - ดู Audit Logs
- `BackupRestoreComponent` - จัดการ Backup & Restore
- `LicenseManagementComponent` - จัดการ License
- `ModuleSubscriptionComponent` - จัดการ Module Subscription

### 🛣️ Routes

```typescript
{
  path: 'super',
  children: [
    {
      path: 'companies',
      component: CompaniesComponent
    },
    {
      path: 'users',
      component: UsersComponent
    },
    {
      path: 'rbac',
      component: RbacComponent
    },
    {
      path: 'settings',
      component: SystemSettingsComponent
    },
    {
      path: 'maintenance',
      component: MaintenanceComponent
    },
    {
      path: 'audit-logs',
      component: AuditLogsComponent
    },
    {
      path: 'backup-restore',
      component: BackupRestoreComponent
    },
    {
      path: 'license',
      component: LicenseManagementComponent
    },
    {
      path: 'module-subscription',
      component: ModuleSubscriptionComponent
    }
  ],
  canActivate: [superAdminGuard]
}
```

### 🔧 Services

#### Frontend Services:
```
frontend/src/app/core/services/
├── company.service.ts       # Company management
├── user.service.ts          # User management
├── rbac.service.ts          # RBAC service
├── system.service.ts        # System service
├── maintenance.service.ts    # Maintenance service
├── audit.service.ts         # Audit service
├── backup.service.ts        # Backup service
└── license.service.ts       # License service
```

### 🔌 API Endpoints

#### Backend Routes:
```
backend/src/routes/
├── admin_routes.py          # Admin routes
├── company_routes.py        # Company routes
├── role_routes.py           # RBAC routes
├── log_routes.py            # Audit log routes
└── system_routes.py         # System routes
```

#### API Endpoints:

**Companies:**
```
GET    /api/v1/companies
  - Query params: page, limit, search, status, subscriptionType, country, createdFrom, createdTo
  - Response: { data: Company[], total, page, limit, totalPages }

GET    /api/v1/companies/{id}
  - Response: Company

POST   /api/v1/companies
  - Body: { name, email, phone, address, country, subscriptionType, ... }

PUT    /api/v1/companies/{id}
  - Body: { name?, email?, phone?, address?, country?, subscriptionType?, ... }

DELETE /api/v1/companies/{id}

GET    /api/v1/admin/company-stats
  - Response: { total, active, inactive, suspended, ... }

GET    /api/v1/admin/companies/{id}/settings
  - Response: CompanySettings

PUT    /api/v1/admin/companies/{id}/settings
  - Body: { settings: {...} }

POST   /api/v1/admin/companies/{id}/activate
  - Body: {}

POST   /api/v1/admin/companies/{id}/deactivate
  - Body: {}

POST   /api/v1/admin/companies/{id}/suspend
  - Body: { reason }
```

**System Settings:**
```
GET    /api/v1/admin/settings
  - Response: SystemSettings

PUT    /api/v1/admin/settings
  - Body: { settings: {...} }

GET    /api/v1/admin/system/info
  - Response: { version, uptime, database, ... }

GET    /api/v1/admin/system/logs
  - Query params: level, startDate, endDate, limit
  - Response: Log[]

POST   /api/v1/admin/system/clear-cache
  - Body: {}

POST   /api/v1/admin/system/restart
  - Body: { service?: string }

GET    /api/v1/admin/system-health
  - Response: { status, services: {...}, ... }

GET    /api/v1/admin/performance-metrics
  - Response: { cpu, memory, disk, network, ... }
```

**Audit Logs:**
```
GET    /api/v1/log-management/audit-trails
  - Query params: page, limit, search, userId, action, resourceType, startDate, endDate
  - Response: { data: AuditLog[], total, page, limit, totalPages }

GET    /api/v1/log-management/audit-trails/{id}
  - Response: AuditLog

GET    /api/v1/log-management/export
  - Query params: format (csv|json|excel), filters
  - Response: Blob

DELETE /api/v1/log-management/old
  - Query params: olderThan (days)
  - Body: {}
```

**Backup & Restore:**
```
GET    /api/v1/admin/backups
  - Query params: page, limit, type
  - Response: { data: Backup[], total, page, limit, totalPages }

GET    /api/v1/admin/backups/{id}
  - Response: Backup

POST   /api/v1/admin/backups
  - Body: { type, description?, ... }
  - Response: { backupId, status, ... }

POST   /api/v1/admin/backups/{id}/restore
  - Body: { confirm: boolean }

DELETE /api/v1/admin/backups/{id}

GET    /api/v1/admin/backups/schedule
  - Response: BackupSchedule

POST   /api/v1/admin/backups/schedule
  - Body: { enabled, frequency, time, retentionDays, ... }
```

**License Management:**
```
GET    /api/v1/admin/license
  - Response: { licenseKey, type, maxUsers, maxCompanies, expiryDate, ... }

PUT    /api/v1/admin/license
  - Body: { licenseKey }

GET    /api/v1/admin/license/usage
  - Response: { usersUsed, companiesUsed, ... }

GET    /api/v1/admin/license/history
  - Query params: startDate, endDate
  - Response: LicenseHistory[]
```

**Module Subscription:**
```
GET    /api/v1/admin/module-subscriptions
  - Query params: page, limit, companyId, moduleName
  - Response: { data: ModuleSubscription[], total, page, limit, totalPages }

GET    /api/v1/admin/module-subscriptions/{id}
  - Response: ModuleSubscription

POST   /api/v1/admin/module-subscriptions
  - Body: { companyId, moduleName, enabled, limits?, ... }

PUT    /api/v1/admin/module-subscriptions/{id}
  - Body: { enabled?, limits?, ... }

DELETE /api/v1/admin/module-subscriptions/{id}

GET    /api/v1/admin/module-subscriptions/usage
  - Query params: companyId, moduleName
  - Response: { usage: {...}, limits: {...} }
```

### 📦 Models

#### Frontend Models:
```
frontend/src/app/core/models/
├── company.model.ts         # Company interfaces
├── system.model.ts          # System interfaces
├── audit.model.ts           # Audit log interfaces
└── license.model.ts         # License interfaces
```

---

## 📊 สรุปภาพรวม

### สถิติระบบ:

| กลุ่มการใช้งาน | Components | Services | API Endpoints | Routes |
|--------------|-----------|----------|---------------|--------|
| Authentication & Authorization | 6 | 4 | 20+ | 8 |
| People Management | 3 | 4 | 30+ | 3 |
| Access Control | 6 | 6 | 50+ | 6 |
| Workforce Management | 3 | 3 | 20+ | 3 |
| Event Management | 4 | 2 | 15+ | 4 |
| Monitoring & Analytics | 5 | 6 | 40+ | 5 |
| Hardware & Device Management | 3 | 4 | 25+ | 3 |
| Configuration & Settings | 4 | 4 | 20+ | 4 |
| Reports & Data Management | 3 | 2 | 15+ | 3 |
| System Administration | 9 | 8 | 50+ | 9 |
| **รวม** | **46** | **43** | **285+** | **48** |

### โครงสร้างไฟล์:

```
frontend/src/app/
├── core/
│   ├── models/          # 50+ model files
│   ├── services/        # 70+ service files
│   ├── guards/          # Auth guards
│   └── interceptors/    # HTTP interceptors
├── shared/
│   └── components/      # 60+ shared components
└── features/
    ├── auth/            # Authentication
    ├── landing/         # Landing page
    ├── public/          # Public features
    ├── portal/          # Portal features (40+ components)
    ├── super-admin/     # Super admin (9 components)
    └── kiosk/           # Kiosk view

backend/src/
├── models/              # 50+ SQLAlchemy models
├── schemas/             # 50+ Pydantic schemas
├── controllers/         # 50+ controllers
├── services/            # 50+ services
├── repositories/        # 50+ repositories
└── routes/              # 50+ route files
```

---

**หมายเหตุ:** เอกสารนี้อัปเดตล่าสุดเมื่อ 2025-01-XX และครอบคลุมระบบทั้งหมดที่ใช้งานอยู่ในปัจจุบัน
