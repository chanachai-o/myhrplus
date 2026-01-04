# 📋 แผนการปรับ API Services และ Models ให้ครบตามเอกสาร

## 📋 Overview

เอกสารนี้สรุปแผนการปรับ API Services และ Models ให้ครบตามเอกสาร Complete API Documentation (150+ endpoints)

**วันที่สร้าง**: 2025-01-01  
**สถานะ**: 📝 **แผนการ**

---

## 📊 สรุป Endpoints ที่ยังขาด

### 1. Organization Management

#### ✅ Company Service (11/12 endpoints)
- ✅ `GET /api/v1/companies` → `getAll()`
- ✅ `GET /api/v1/companies/{id}` → `getById()`
- ✅ `POST /api/v1/companies` → `create()`
- ✅ `PUT /api/v1/companies/{id}` → `update()`
- ✅ `DELETE /api/v1/companies/{id}` → `delete()`
- ✅ `GET /api/v1/companies/stats` → `getStatistics()`
- ✅ `GET /api/v1/companies/{id}/settings` → `getSettings()`
- ✅ `PUT /api/v1/companies/{id}/settings` → `updateSettings()`
- ✅ `POST /api/v1/companies/{id}/activate` → `activate()`
- ✅ `POST /api/v1/companies/{id}/deactivate` → `deactivate()`
- ✅ `POST /api/v1/companies/{id}/suspend` → `suspend()`
- ⚠️ `GET /api/v1/companies/export` → `export()` - **ยังไม่มี**

#### ❌ Department Service (0/6 endpoints) - **ต้องสร้างใหม่**
- ❌ `GET /api/v1/departments` → `getAll()`
- ❌ `GET /api/v1/departments/{id}` → `getById()`
- ❌ `GET /api/v1/departments/company/{company_id}` → `getByCompany()`
- ❌ `POST /api/v1/departments` → `create()`
- ❌ `PUT /api/v1/departments/{id}` → `update()`
- ❌ `DELETE /api/v1/departments/{id}` → `delete()`

#### ❌ Position Service (0/6 endpoints) - **ต้องสร้างใหม่**
- ❌ `GET /api/v1/positions` → `getAll()`
- ❌ `GET /api/v1/positions/{id}` → `getById()`
- ❌ `GET /api/v1/positions/company/{company_id}` → `getByCompany()`
- ❌ `POST /api/v1/positions` → `create()`
- ❌ `PUT /api/v1/positions/{id}` → `update()`
- ❌ `DELETE /api/v1/positions/{id}` → `delete()`

#### ✅ Employee Service (6/6 endpoints)
- ✅ `GET /api/v1/employees` → `getAll()`
- ✅ `GET /api/v1/employees/{id}` → `getById()`
- ✅ `POST /api/v1/employees` → `create()`
- ✅ `PUT /api/v1/employees/{id}` → `update()`
- ✅ `DELETE /api/v1/employees/{id}` → `delete()`
- ✅ `GET /api/v1/employees/{id}/subordinates` → `getSubordinates()`

---

### 2. Time & Attendance

#### ⚠️ Timestamp Service (3/9 endpoints)
- ✅ `GET /api/v1/timestamps/company/{company_id}` → `getAll()` - **ต้องแก้ path**
- ✅ `GET /api/v1/timestamps/company/{company_id}/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/timestamps/company/{company_id}` → `create()` - **ต้องแก้ path**
- ✅ `POST /api/v1/timestamps/company/{company_id}/{id}/approve` → `approve()` - **ต้องแก้ path**
- ✅ `POST /api/v1/timestamps/company/{company_id}/{id}/reject` → `reject()` - **ต้องแก้ path**
- ❌ `PUT /api/v1/timestamps/company/{company_id}/{id}` → `update()` - **ยังไม่มี**
- ❌ `DELETE /api/v1/timestamps/company/{company_id}/{id}` → `delete()` - **ยังไม่มี**
- ❌ `POST /api/v1/timestamps/company/{company_id}/bulk-approve` → `bulkApprove()` - **ยังไม่มี**
- ❌ `GET /api/v1/timestamps/company/{company_id}/export` → `export()` - **ยังไม่มี**

#### ⚠️ Shift Service (5/6 endpoints)
- ✅ `GET /api/v1/shifts/company/{company_id}/shifts` → `getAll()` - **ต้องแก้ path**
- ✅ `GET /api/v1/shifts/company/{company_id}/shifts/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/shifts/company/{company_id}/shifts` → `create()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/shifts/company/{company_id}/shifts/{id}` → `update()` - **ต้องแก้ path**
- ✅ `DELETE /api/v1/shifts/company/{company_id}/shifts/{id}` → `delete()` - **ต้องแก้ path**
- ❌ `POST /api/v1/shifts/company/{company_id}/shifts/user-shifts` → `assign()` - **ต้องแก้ path และ method**

#### ⚠️ Leave Service (7/9 endpoints)
- ✅ `GET /api/v1/leaves/leave-requests` → `getAll()` - **ต้องแก้ path**
- ✅ `GET /api/v1/leaves/leave-requests/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/leaves/leave-requests` → `create()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/leaves/leave-requests/{id}` → `update()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/leaves/leave-requests/{id}/approve` → `approve()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/leaves/leave-requests/{id}/reject` → `reject()` - **ต้องแก้ path**
- ⚠️ `DELETE /api/v1/leaves/leave-requests/{id}` → `cancel()` - **ต้องแก้ path และ method (ใช้ DELETE แทน POST)**
- ❌ `GET /api/v1/leaves/employees/{employee_id}/leave-balance` → `getLeaveBalance()` - **ยังไม่มี**
- ❌ `GET /api/v1/leaves/companies/{company_id}/leave-statistics` → `getCompanyStatistics()` - **ยังไม่มี**

---

### 3. Access Control & Device Management

#### ⚠️ Device Service (5/13 endpoints)
- ✅ `GET /api/v1/devices/company/{companyId}/devices` → `getAll()` - **ต้องแก้ path**
- ✅ `GET /api/v1/devices/{deviceId}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/devices/company/{companyId}/devices` → `create()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/devices/{deviceId}` → `update()` - **ต้องแก้ path**
- ✅ `DELETE /api/v1/devices/{deviceId}` → `delete()` - **ต้องแก้ path**
- ❌ `GET /api/v1/devices/devices/{deviceId}/key` → `getApiKey()` (Public) - **ยังไม่มี**
- ❌ `GET /api/v1/devices/company/{companyId}/devices/{deviceId}/key` → `getApiKey()` (Admin) - **ยังไม่มี**
- ❌ `POST /api/v1/devices/{deviceId}/regenerate-key` → `regenerateKey()` - **ยังไม่มี**
- ❌ `POST /api/v1/devices/{deviceId}/link-event` → `linkEvent()` - **ยังไม่มี**
- ❌ `GET /api/v1/devices/company/{companyId}/devices/statistics` → `getStatistics()` - **ยังไม่มี**
- ❌ `GET /api/v1/devices/{deviceId}/config` → `getConfig()` (Public) - **ยังไม่มี**
- ❌ `PUT /api/v1/devices/{deviceId}/config` → `updateConfig()` (Public) - **ยังไม่มี**
- ❌ `POST /api/v1/devices/{deviceId}/heartbeat` → `heartbeat()` (Public) - **ยังไม่มี**

#### ⚠️ Door Service (5/8 endpoints)
- ✅ `GET /api/v1/doors/company/{company_id}/doors` → `getAll()` - **ต้องแก้ path**
- ✅ `GET /api/v1/doors/company/{company_id}/doors/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/doors/company/{company_id}/doors` → `create()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/doors/company/{company_id}/doors/{id}` → `update()` - **ต้องแก้ path**
- ✅ `DELETE /api/v1/doors/company/{company_id}/doors/{id}` → `delete()` - **ต้องแก้ path**
- ✅ `GET /api/v1/doors/company/{company_id}/doors/{id}/access-logs` → `getAccessLogs()` - **ต้องแก้ path**
- ✅ `POST /api/v1/doors/company/{company_id}/doors/permissions` → `grantAccess()` - **ต้องแก้ path**
- ✅ `DELETE /api/v1/doors/company/{company_id}/doors/permissions/{id}` → `revokeAccess()` - **ต้องแก้ path**
- ❌ `GET /api/v1/doors/company/{company_id}/doors/{id}/permissions` → `getPermissions()` - **ยังไม่มี**

---

### 4. Verification & Identification

#### ⚠️ Face Service (5/6 endpoints)
- ✅ `GET /api/v1/face` → `getAll()` - **ต้องแก้ path (ใช้ /face/members/{id}/encodings)**
- ✅ `GET /api/v1/face/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/face/enroll` → `enroll()` - **ต้องแก้ path (ใช้ /face/members/{id}/add-face)**
- ✅ `POST /api/v1/face/verify` → `verify()` - **ต้องแก้ path (ใช้ /face/verify/{member_id})**
- ✅ `DELETE /api/v1/face/{id}` → `delete()` - **ต้องแก้ path (ใช้ /face/encodings/{id})**
- ❌ `POST /api/v1/face/members/check-face-emp` → `checkFaceEmp()` (Public) - **ยังไม่มี**
- ❌ `POST /api/v1/face/recognize-many` → `recognizeMany()` (Public) - **ยังไม่มี**

#### ⚠️ RFID Service (5/13 endpoints)
- ✅ `GET /api/v1/rfid-cards` → `getAll()`
- ✅ `GET /api/v1/rfid-cards/{id}` → `getById()`
- ✅ `POST /api/v1/rfid-cards` → `create()`
- ✅ `PUT /api/v1/rfid-cards/{id}` → `update()`
- ✅ `DELETE /api/v1/rfid-cards/{id}` → `delete()`
- ❌ `GET /api/v1/rfid-cards/number/{card_number}` → `getByNumber()` - **ยังไม่มี**
- ❌ `POST /api/v1/rfid-cards/verify` → `verify()` - **ยังไม่มี**
- ❌ `GET /api/v1/rfid-cards/statistics` → `getStatistics()` - **ยังไม่มี**
- ❌ `GET /api/v1/rfid-cards/types` → `getTypes()` - **ยังไม่มี**
- ❌ `PATCH /api/v1/rfid-cards/{id}/status` → `updateStatus()` - **ยังไม่มี**
- ❌ `PATCH /api/v1/rfid-cards/{id}/authorization` → `updateAuthorization()` - **ยังไม่มี**
- ❌ `POST /api/v1/rfid-cards/import` → `import()` - **ยังไม่มี**
- ❌ `GET /api/v1/rfid-cards/export` → `export()` - **ยังไม่มี**

#### ⚠️ QR Code Service (4/13 endpoints)
- ✅ `GET /api/v1/qr-codes` → `getAll()`
- ✅ `GET /api/v1/qr-codes/{id}` → `getById()`
- ✅ `POST /api/v1/qr-codes/generate` → `generate()` - **ต้องแก้ path (ใช้ /qr-codes)**
- ✅ `DELETE /api/v1/qr-codes/{id}` → `delete()`
- ❌ `GET /api/v1/qr-codes/data/{qr_data}` → `getByData()` - **ยังไม่มี**
- ❌ `POST /api/v1/qr-codes` → `create()` - **ยังไม่มี (แยกจาก generate)**
- ❌ `PUT /api/v1/qr-codes/{id}` → `update()` - **ยังไม่มี**
- ❌ `POST /api/v1/qr-codes/verify` → `verify()` - **ยังไม่มี**
- ❌ `GET /api/v1/qr-codes/generate-image` → `generateImage()` - **ยังไม่มี**
- ❌ `GET /api/v1/qr-codes/statistics` → `getStatistics()` - **ยังไม่มี**
- ❌ `GET /api/v1/qr-codes/types` → `getTypes()` - **ยังไม่มี**
- ❌ `PATCH /api/v1/qr-codes/{id}/status` → `updateStatus()` - **ยังไม่มี**
- ❌ `PATCH /api/v1/qr-codes/{id}/authorization` → `updateAuthorization()` - **ยังไม่มี**
- ❌ `POST /api/v1/qr-codes/import` → `import()` - **ยังไม่มี**
- ❌ `GET /api/v1/qr-codes/export` → `export()` - **ยังไม่มี**

---

### 5. Visitor & Guest Management

#### ⚠️ Visitor Service (9/11 endpoints)
- ✅ `GET /api/v1/visitors/company/{company_id}` → `getAll()` - **ต้องแก้ path**
- ✅ `GET /api/v1/visitors/company/{company_id}/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/visitors/company/{company_id}` → `create()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/visitors/company/{company_id}/{id}` → `update()` - **ต้องแก้ path**
- ✅ `POST /api/v1/visitors/company/{company_id}/{id}/check-in` → `checkIn()` - **ต้องแก้ path**
- ✅ `POST /api/v1/visitors/company/{company_id}/{id}/check-out` → `checkOut()` - **ต้องแก้ path**
- ✅ `GET /api/v1/visitors/company/{company_id}/{id}/visits` → `getVisits()` - **ต้องแก้ path**
- ✅ `POST /api/v1/visitors/company/{company_id}/{id}/invitations` → `createInvitation()` - **ต้องแก้ path**
- ✅ `GET /api/v1/visitors/company/{company_id}/{id}/badges` → `getBadges()` - **ต้องแก้ path**
- ❌ `DELETE /api/v1/visitors/company/{company_id}/{id}` → `delete()` - **ยังไม่มี**
- ❌ `GET /api/v1/visitors/company/{company_id}/statistics` → `getStatistics()` - **ยังไม่มี**
- ❌ `GET /api/v1/visitors/company/{company_id}/export` → `export()` - **ยังไม่มี**

#### ⚠️ Guest Service (8/10 endpoints)
- ✅ `GET /api/v1/guests/company/{company_id}` → `getAll()` - **ต้องแก้ path**
- ✅ `GET /api/v1/guests/company/{company_id}/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/guests/company/{company_id}` → `create()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/guests/company/{company_id}/{id}` → `update()` - **ต้องแก้ path**
- ✅ `POST /api/v1/guests/company/{company_id}/{id}/check-in` → `checkIn()` - **ต้องแก้ path**
- ✅ `POST /api/v1/guests/company/{company_id}/{id}/check-out` → `checkOut()` - **ต้องแก้ path**
- ✅ `POST /api/v1/guests/register` → `register()` - **ต้องแก้ path (ใช้ /guests/company/{id})**
- ✅ `GET /api/v1/guests/company/{company_id}/{id}/registrations` → `getRegistrations()` - **ต้องแก้ path**
- ❌ `DELETE /api/v1/guests/company/{company_id}/{id}` → `delete()` - **ยังไม่มี**
- ❌ `GET /api/v1/guests/company/{company_id}/statistics` → `getStatistics()` - **ยังไม่มี**
- ❌ `GET /api/v1/guests/company/{company_id}/export` → `export()` - **ยังไม่มี**

---

### 6. Event Management

#### ⚠️ Event Service (7/17 endpoints)
- ✅ `GET /api/v1/events` → `getAll()`
- ✅ `GET /api/v1/events/{id}` → `getById()`
- ✅ `POST /api/v1/events` → `create()`
- ✅ `PUT /api/v1/events/{id}` → `update()`
- ✅ `DELETE /api/v1/events/{id}` → `delete()`
- ✅ `POST /api/v1/events/{id}/register` → `register()` - **ต้องแก้ path (ใช้ /events/public/register/{public_url})**
- ✅ `GET /api/v1/events/{id}/registrations` → `getRegistrations()` - **ต้องแก้ path**
- ✅ `GET /api/v1/events/{id}/participants` → `getParticipants()` - **ต้องแก้ path (ใช้ /events/{id}/attendees)**
- ✅ `POST /api/v1/events/{id}/publish` → `publish()`
- ✅ `POST /api/v1/events/{id}/cancel` → `cancel()`
- ❌ `GET /api/v1/events/public/details/{public_url}` → `getPublicDetails()` (Public) - **ยังไม่มี**
- ❌ `POST /api/v1/events/public/register/{public_url}` → `publicRegister()` (Public) - **ยังไม่มี**
- ❌ `POST /api/v1/events/kiosk/check-in` → `kioskCheckIn()` (Public) - **ยังไม่มี**
- ❌ `POST /api/v1/events/kiosk/check-in-many` → `kioskCheckInMany()` (Public) - **ยังไม่มี**
- ❌ `POST /api/v1/events/public/register/{public_url}/confirm-email` → `confirmEmail()` (Public) - **ยังไม่มี**
- ❌ `GET /api/v1/events/public/{public_url}/qr-code` → `getPublicQrCode()` (Public) - **ยังไม่มี**
- ❌ `GET /api/v1/events/public/{public_url}/check-status` → `checkStatus()` (Public) - **ยังไม่มี**
- ❌ `GET /api/v1/events/{id}/attendees` → `getAttendees()` - **ยังไม่มี**
- ❌ `GET /api/v1/events/{id}/devices` → `getLinkedDevices()` - **ยังไม่มี**
- ❌ `POST /api/v1/events/attendees` → `addAttendee()` - **ยังไม่มี**
- ❌ `GET /api/v1/events/{id}/statistics` → `getStatistics()` - **ยังไม่มี**
- ❌ `POST /api/v1/events/{id}/send-reminders` → `sendReminders()` - **ยังไม่มี**

---

### 7. Vehicle & Parking Management

#### ⚠️ Vehicle Service (8/10 endpoints)
- ✅ `GET /api/v1/vehicles/company/{company_id}` → `getAll()` - **ต้องแก้ path**
- ✅ `GET /api/v1/vehicles/company/{company_id}/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/vehicles/company/{company_id}` → `create()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/vehicles/company/{company_id}/{id}` → `update()` - **ต้องแก้ path**
- ✅ `DELETE /api/v1/vehicles/company/{company_id}/{id}` → `delete()` - **ต้องแก้ path**
- ✅ `POST /api/v1/vehicles/company/{company_id}/{id}/check-in` → `checkIn()` - **ต้องแก้ path**
- ✅ `POST /api/v1/vehicles/company/{company_id}/{id}/check-out` → `checkOut()` - **ต้องแก้ path**
- ✅ `GET /api/v1/vehicles/company/{company_id}/{id}/access-logs` → `getAccessLogs()` - **ต้องแก้ path**
- ❌ `POST /api/v1/vehicles/company/{company_id}/{id}/assign-parking` → `assignParking()` - **ยังไม่มี**
- ❌ `GET /api/v1/vehicles/company/{company_id}/parking-spots` → `getParkingSpots()` - **ยังไม่มี**
- ❌ `GET /api/v1/vehicles/company/{company_id}/statistics` → `getStatistics()` - **ยังไม่มี**

#### ⚠️ Parking Service (5/5 endpoints)
- ✅ `GET /api/v1/parking` → `getAll()` - **ต้องแก้ path (ใช้ /parking/company/{id})**
- ✅ `GET /api/v1/parking/{id}` → `getById()` - **ต้องแก้ path**
- ✅ `POST /api/v1/parking` → `create()` - **ต้องแก้ path**
- ✅ `PUT /api/v1/parking/{id}` → `update()` - **ต้องแก้ path**
- ✅ `POST /api/v1/parking/{id}/exit` → `exit()` - **ต้องแก้ path**
- ✅ `POST /api/v1/parking/entry` → `entry()` - **ต้องแก้ path**
- ✅ `POST /api/v1/parking/exit` → `exitLpr()` - **ต้องแก้ path**
- ✅ `GET /api/v1/parking/spaces` → `getSpaces()` - **ต้องแก้ path**
- ✅ `GET /api/v1/parking/statistics` → `getStatistics()` - **ต้องแก้ path**

---

## 📝 แผนการดำเนินงาน

### Phase 1: Organization Management (Priority: High)

#### 1.1 สร้าง Department Service
**ไฟล์**: `src/app/core/services/ivap/organization/department.service.ts`

**Methods**:
- `getAll(params?: QueryParams): Observable<PaginatedResponse<Department>>`
- `getById(departmentId: string, companyId: string): Observable<Department>`
- `getByCompany(companyId: string, params?: QueryParams): Observable<PaginatedResponse<Department>>`
- `create(data: Partial<Department>): Observable<Department>`
- `update(departmentId: string, companyId: string, data: Partial<Department>): Observable<Department>`
- `delete(departmentId: string, companyId: string): Observable<void>`

**Endpoint Paths**:
- Base: `/departments`
- Get by Company: `/departments/company/{company_id}`
- All methods require `company_id` query parameter

#### 1.2 สร้าง Position Service
**ไฟล์**: `src/app/core/services/ivap/organization/position.service.ts`

**Methods**:
- `getAll(params?: QueryParams): Observable<PaginatedResponse<Position>>`
- `getById(positionId: string, companyId: string): Observable<Position>`
- `getByCompany(companyId: string, params?: QueryParams): Observable<PaginatedResponse<Position>>`
- `create(data: Partial<Position>): Observable<Position>`
- `update(positionId: string, companyId: string, data: Partial<Position>): Observable<Position>`
- `delete(positionId: string, companyId: string): Observable<void>`

**Endpoint Paths**:
- Base: `/positions`
- Get by Company: `/positions/company/{company_id}`
- All methods require `company_id` query parameter

#### 1.3 เพิ่ม Company Export
**ไฟล์**: `src/app/core/services/ivap/organization/company.service.ts`

**Method**:
- `export(params?: QueryParams): Observable<Blob>`

**Endpoint**: `GET /api/v1/companies/export`

#### 1.4 อัพเดท Models
**ไฟล์**: `src/app/core/models/ivap/organization/organization.models.ts`

**ตรวจสอบ**: Models มีครบแล้ว (Department, Position)

---

### Phase 2: Time & Attendance (Priority: High)

#### 2.1 แก้ไข Timestamp Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/time-attendance/timestamp.service.ts`

**Changes**:
- Base endpoint: `/timestamps/company/{company_id}`
- All methods require `company_id` in path
- Add `update()`, `delete()`, `bulkApprove()`, `export()`

**Methods to Add**:
- `update(companyId: string, timestampId: string, data: Partial<EmployeeTimestamp>): Observable<EmployeeTimestamp>`
- `delete(companyId: string, timestampId: string): Observable<void>`
- `bulkApprove(companyId: string, timestampIds: string[]): Observable<any>`
- `export(companyId: string, params?: QueryParams): Observable<Blob>`

#### 2.2 แก้ไข Shift Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/time-attendance/shift.service.ts`

**Changes**:
- Base endpoint: `/shifts/company/{company_id}/shifts`
- All methods require `company_id` in path
- Fix `assign()` method path: `/shifts/company/{company_id}/shifts/user-shifts`

**Methods to Fix**:
- `assign(companyId: string, data: { company_employeeId: string; shiftId: string }): Observable<any>`

#### 2.3 แก้ไข Leave Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/time-attendance/leave.service.ts`

**Changes**:
- Base endpoint: `/leaves/leave-requests`
- Fix `approve()` and `reject()` to use `PUT` instead of `POST`
- Fix `cancel()` to use `DELETE` instead of `POST`
- Add `getLeaveBalance()` and `getCompanyStatistics()`

**Methods to Add/Fix**:
- `cancel(leaveRequestId: string, employeeId: string): Observable<any>` - Use DELETE
- `getLeaveBalance(employeeId: string): Observable<any>`
- `getCompanyStatistics(companyId: string, year?: number): Observable<any>`

---

### Phase 3: Access Control & Device Management (Priority: High)

#### 3.1 แก้ไข Device Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/access-control/device.service.ts`

**Changes**:
- Base endpoint: `/devices/company/{companyId}/devices`
- Add public endpoints (no auth required)
- Add device management endpoints

**Methods to Add**:
- `getApiKey(deviceId: string): Observable<any>` (Public)
- `getApiKeyAdmin(companyId: string, deviceId: string): Observable<any>`
- `regenerateKey(companyId: string, deviceId: string): Observable<Device>`
- `linkEvent(deviceId: string, eventId: string | null): Observable<any>`
- `getStatistics(companyId: string): Observable<any>`
- `getConfig(deviceId: string): Observable<any>` (Public)
- `updateConfig(deviceId: string, config: any): Observable<any>` (Public)
- `heartbeat(deviceId: string, data: any): Observable<any>` (Public)

#### 3.2 แก้ไข Door Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/access-control/door.service.ts`

**Changes**:
- Base endpoint: `/doors/company/{company_id}/doors`
- All methods require `company_id` in path
- Fix permissions endpoints

**Methods to Add/Fix**:
- `getPermissions(companyId: string, doorId: string): Observable<any>`
- Fix `grantAccess()` path: `/doors/company/{company_id}/doors/permissions`
- Fix `revokeAccess()` path: `/doors/company/{company_id}/doors/permissions/{permission_id}`

---

### Phase 4: Verification & Identification (Priority: Medium)

#### 4.1 แก้ไข Face Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/biometric/face.service.ts`

**Changes**:
- Base endpoint: `/face`
- Fix all endpoint paths to match API documentation

**Methods to Fix/Add**:
- `getAll()` → `GET /api/v1/face/members/{member_id}/encodings`
- `getById()` → `GET /api/v1/face/encodings/{face_encoding_id}`
- `enroll()` → `POST /api/v1/face/members/{member_id}/add-face`
- `verify()` → `POST /api/v1/face/verify/{member_id}`
- `delete()` → `DELETE /api/v1/face/encodings/{face_encoding_id}`
- `checkFaceEmp()` → `POST /api/v1/face/members/check-face-emp` (Public)
- `recognizeMany()` → `POST /api/v1/face/recognize-many` (Public)

#### 4.2 เพิ่ม RFID Service Extended Methods
**ไฟล์**: `src/app/core/services/ivap/qr-rfid/rfid-card.service.ts`

**Methods to Add**:
- `getByNumber(cardNumber: string): Observable<RFIDCard>`
- `verify(data: { card_number: string; door_id: string }): Observable<any>`
- `getStatistics(): Observable<any>`
- `getTypes(): Observable<string[]>`
- `updateStatus(rfidCardId: string, newStatus: string): Observable<RFIDCard>`
- `updateAuthorization(rfidCardId: string, isAuthorized: boolean): Observable<RFIDCard>`
- `import(file: File): Observable<any>`
- `export(params?: QueryParams): Observable<Blob>`

#### 4.3 เพิ่ม QR Code Service Extended Methods
**ไฟล์**: `src/app/core/services/ivap/qr-rfid/qr-code.service.ts`

**Methods to Add/Fix**:
- `getByData(qrData: string): Observable<QRCode>`
- `create()` → Separate from `generate()` - `POST /api/v1/qr-codes`
- `update()` → `PUT /api/v1/qr-codes/{id}`
- `generate()` → Keep as is - `POST /api/v1/qr-codes/generate`
- `verify(data: { qr_data: string; door_id: string }): Observable<any>`
- `generateImage(qrData: string): Observable<Blob>`
- `getStatistics(): Observable<any>`
- `getTypes(): Observable<string[]>`
- `updateStatus(qrCodeId: string, newStatus: string): Observable<QRCode>`
- `updateAuthorization(qrCodeId: string, isAuthorized: boolean): Observable<QRCode>`
- `import(file: File): Observable<any>`
- `export(params?: QueryParams): Observable<Blob>`

---

### Phase 5: Visitor & Guest Management (Priority: Medium)

#### 5.1 แก้ไข Visitor Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/visitor-guest/visitor.service.ts`

**Changes**:
- Base endpoint: `/visitors/company/{company_id}`
- All methods require `company_id` in path

**Methods to Add**:
- `delete(companyId: string, visitorId: string): Observable<void>`
- `getStatistics(companyId: string): Observable<any>`
- `export(companyId: string, params?: QueryParams): Observable<Blob>`

#### 5.2 แก้ไข Guest Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/visitor-guest/guest.service.ts`

**Changes**:
- Base endpoint: `/guests/company/{company_id}`
- All methods require `company_id` in path
- Fix `register()` method

**Methods to Add/Fix**:
- `delete(companyId: string, guestId: string): Observable<void>`
- `register(companyId: string, data: Partial<Guest>): Observable<Guest>` - Fix path
- `getStatistics(companyId: string): Observable<any>`
- `export(companyId: string, params?: QueryParams): Observable<Blob>`

---

### Phase 6: Event Management (Priority: High)

#### 6.1 เพิ่ม Event Service Public & Kiosk Endpoints
**ไฟล์**: `src/app/core/services/ivap/event/event.service.ts`

**Methods to Add**:
- `getPublicDetails(publicUrl: string): Observable<Event>` (Public)
- `publicRegister(publicUrl: string, data: any): Observable<any>` (Public)
- `kioskCheckIn(apiKey: string, formData: FormData): Observable<any>` (Public)
- `kioskCheckInMany(apiKey: string, formData: FormData): Observable<any>` (Public)
- `confirmEmail(publicUrl: string, token: string): Observable<any>` (Public)
- `getPublicQrCode(publicUrl: string): Observable<any>` (Public)
- `checkStatus(publicUrl: string, email: string): Observable<any>` (Public)
- `getAttendees(eventId: string, params?: QueryParams): Observable<PaginatedResponse<any>>`
- `getLinkedDevices(eventId: string): Observable<any[]>`
- `addAttendee(data: { event_id: string; member_id: string; registration_type: string }): Observable<any>`
- `getStatistics(eventId: string): Observable<any>`
- `sendReminders(eventId: string, data: any): Observable<any>`

**Methods to Fix**:
- `register()` → Use public endpoint path
- `getParticipants()` → Use `/events/{id}/attendees`

---

### Phase 7: Vehicle & Parking Management (Priority: Medium)

#### 7.1 แก้ไข Vehicle Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/vehicle-parking/vehicle.service.ts`

**Changes**:
- Base endpoint: `/vehicles/company/{company_id}`
- All methods require `company_id` in path

**Methods to Add**:
- `assignParking(companyId: string, vehicleId: string, data: any): Observable<Vehicle>`
- `getParkingSpots(companyId: string): Observable<any[]>`
- `getStatistics(companyId: string): Observable<any>`

#### 7.2 แก้ไข Parking Service Endpoint Paths
**ไฟล์**: `src/app/core/services/ivap/vehicle-parking/parking.service.ts`

**Changes**:
- Base endpoint: `/parking/company/{company_id}` (if needed)
- Fix all endpoint paths

**Methods to Fix**:
- All methods need to check if they require `company_id` in path

---

### Phase 8: Models Creation/Update (Priority: High)

#### 8.1 Models ที่ต้องสร้าง/อัพเดท

**Organization Models** (มีแล้ว):
- ✅ `Department`, `Position` - มีแล้วใน `organization.models.ts`

**Time & Attendance Models**:
- ⚠️ `EmployeeTimestamp` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `Shift` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `LeaveRequest` - ตรวจสอบว่ามี fields ครบหรือไม่

**Access Control Models**:
- ⚠️ `Device` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `Door` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `DoorPermission` - ต้องสร้างใหม่

**Verification Models**:
- ⚠️ `FaceEnrollment` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `RFIDCard` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `QRCode` - ตรวจสอบว่ามี fields ครบหรือไม่

**Visitor & Guest Models**:
- ⚠️ `Visitor` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `Guest` - ตรวจสอบว่ามี fields ครบหรือไม่

**Event Models**:
- ⚠️ `Event` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `Attendee` - ต้องสร้างใหม่
- ⚠️ `EventRegistration` - ต้องสร้างใหม่

**Vehicle & Parking Models**:
- ⚠️ `Vehicle` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `ParkingRecord` - ตรวจสอบว่ามี fields ครบหรือไม่
- ⚠️ `ParkingSpot` - ต้องสร้างใหม่

---

## 📊 Summary Statistics

### Current Status:
- **Total Endpoints in Documentation**: 150+ endpoints
- **Current Coverage**: ~80 endpoints (53%)
- **Missing Endpoints**: ~70 endpoints (47%)

### Breakdown by Category:
- **Organization**: 12/24 endpoints (50%) - Missing: Department, Position, Company Export
- **Time & Attendance**: 15/24 endpoints (63%) - Missing: Extended methods, path fixes
- **Access Control**: 10/21 endpoints (48%) - Missing: Device extended, Door permissions
- **Verification**: 14/32 endpoints (44%) - Missing: Face extended, RFID extended, QR extended
- **Visitor & Guest**: 17/21 endpoints (81%) - Missing: Statistics, Export, Delete
- **Event**: 7/17 endpoints (41%) - Missing: Public endpoints, Kiosk endpoints, Extended
- **Vehicle & Parking**: 13/15 endpoints (87%) - Missing: Extended methods

---

## 🎯 Implementation Priority

### Priority 1: Critical (Must Have)
1. ✅ Department Service
2. ✅ Position Service
3. ✅ Fix Timestamp Service paths
4. ✅ Fix Shift Service paths
5. ✅ Fix Leave Service paths
6. ✅ Fix Device Service paths
7. ✅ Fix Door Service paths
8. ✅ Event Public & Kiosk endpoints

### Priority 2: Important (Should Have)
1. ✅ Company Export
2. ✅ Timestamp extended methods
3. ✅ Device extended methods
4. ✅ Face Service path fixes
5. ✅ RFID extended methods
6. ✅ QR Code extended methods
7. ✅ Visitor/Guest Statistics & Export
8. ✅ Event extended methods

### Priority 3: Nice to Have (Optional)
1. ✅ Import/Export for RFID & QR Code
2. ✅ Vehicle extended methods
3. ✅ Parking extended methods

---

## 📝 Next Steps

1. **Phase 1**: สร้าง Department และ Position Services
2. **Phase 2**: แก้ไข Time & Attendance Service paths
3. **Phase 3**: แก้ไข Access Control Service paths
4. **Phase 4**: แก้ไข Verification Service paths
5. **Phase 5**: แก้ไข Visitor & Guest Service paths
6. **Phase 6**: เพิ่ม Event Public & Kiosk endpoints
7. **Phase 7**: แก้ไข Vehicle & Parking Service paths
8. **Phase 8**: สร้าง/อัพเดท Models
9. **Phase 9**: อัพเดท Barrel Exports
10. **Phase 10**: Testing & Documentation

---

**Last Updated**: 2025-01-01  
**Version**: 1.0.0

