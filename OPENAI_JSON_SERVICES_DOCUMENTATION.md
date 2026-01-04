# IVAP Frontend - Services & Models Documentation for OpenAI

## 📋 Overview

เอกสารนี้สรุป Services, Models และ Functions ทั้งหมดใน IVAP Frontend สำหรับใช้เป็น reference ใน `openai.json` หรือ AI assistants

---

## 🔧 BaseApiService Methods

### Core HTTP Methods

#### `get<T>(path: string, params?: QueryParams): Observable<T>`
- **Description**: GET request สำหรับดึงข้อมูล single item
- **Parameters**:
  - `path`: API path (optional, default: '')
  - `params`: Query parameters (optional)
- **Returns**: `Observable<T>`
- **Example**:
  ```typescript
  getById(id: string): Observable<Company> {
    return this.get<Company>(`/${id}`);
  }
  ```

#### `getPaginated<T>(path: string, params?: QueryParams): Observable<PaginatedResponse<T>>`
- **Description**: GET request สำหรับดึงข้อมูลแบบ paginated
- **Parameters**:
  - `path`: API path (optional, default: '')
  - `params`: Query parameters (optional, supports `page`, `page_size`, `search`, etc.)
- **Returns**: `Observable<PaginatedResponse<T>>`
- **Example**:
  ```typescript
  getAll(params?: QueryParams): Observable<PaginatedResponse<Company>> {
    return this.getPaginated<Company>('', params);
  }
  ```

#### `post<T>(path: string, body: any): Observable<T>`
- **Description**: POST request สำหรับสร้างข้อมูลใหม่
- **Parameters**:
  - `path`: API path (optional, default: '')
  - `body`: Request body
- **Returns**: `Observable<T>`
- **Example**:
  ```typescript
  create(data: CompanyBase): Observable<Company> {
    return this.post<Company>('', data);
  }
  ```

#### `put<T>(path: string, body: any): Observable<T>`
- **Description**: PUT request สำหรับอัพเดทข้อมูลทั้งหมด
- **Parameters**:
  - `path`: API path (optional, default: '')
  - `body`: Request body
- **Returns**: `Observable<T>`
- **Example**:
  ```typescript
  update(id: string, data: CompanyUpdate): Observable<Company> {
    return this.put<Company>(`/${id}`, data);
  }
  ```

#### `patch<T>(path: string, body: any): Observable<T>`
- **Description**: PATCH request สำหรับอัพเดทข้อมูลบางส่วน
- **Parameters**:
  - `path`: API path (optional, default: '')
  - `body`: Request body
- **Returns**: `Observable<T>`

#### `delete(path: string, params?: QueryParams): Observable<void>`
- **Description**: DELETE request สำหรับลบข้อมูล
- **Parameters**:
  - `path`: API path (optional, default: '')
  - `params`: Query parameters (optional)
- **Returns**: `Observable<void>`
- **Example**:
  ```typescript
  override delete(id: string): Observable<void> {
    return super.delete(`/${id}`);
  }
  ```

### File Upload/Download Methods

#### `postFormData<T>(path: string, formData: FormData): Observable<T>`
- **Description**: POST request สำหรับอัพโหลดไฟล์ (FormData)
- **Parameters**:
  - `path`: API path (optional, default: '')
  - `formData`: FormData object
- **Returns**: `Observable<T>`
- **Example**:
  ```typescript
  enroll(formData: FormData): Observable<FaceEnrollment> {
    return this.postFormData<FaceEnrollment>('/enroll', formData);
  }
  ```

#### `downloadFile(path: string, params?: QueryParams): Observable<Blob>`
- **Description**: GET request สำหรับดาวน์โหลดไฟล์
- **Parameters**:
  - `path`: API path (optional, default: '')
  - `params`: Query parameters (optional)
- **Returns**: `Observable<Blob>`

### Token Management Methods

#### `getToken(): string | null`
- **Description**: ดึง JWT token จาก localStorage
- **Returns**: `string | null`

#### `setToken(token: string): void`
- **Description**: บันทึก JWT token ลง localStorage
- **Parameters**:
  - `token`: JWT token string

#### `removeToken(): void`
- **Description**: ลบ JWT token จาก localStorage

---

## 🔐 Auth Services

### `IvapAuthService`
- **Endpoint**: `/auth`
- **Methods**:
  - `login(credentials: LoginRequest): Observable<Token>`
  - `register(data: RegisterRequest): Observable<Member>`
  - `getCurrentUser(): Observable<Member>`
  - `forgotPassword(data: ForgotPasswordRequest): Observable<ForgotPasswordResponse>`
  - `resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse>`
  - `logout(): void`
  - `isAuthenticated(): boolean`
  - `getCurrentToken(): string | null`

---

## 🏢 Organization Services

### `IvapCompanyService`
- **Endpoint**: `/companies`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Company>>`
  - `getById(companyId: string): Observable<Company>`
  - `create(data: CompanyBase): Observable<Company>`
  - `update(companyId: string, data: CompanyUpdate): Observable<Company>`
  - `delete(companyId: string): Observable<void>`
  - `getStatistics(): Observable<CompanyStatistics>`
  - `getSettings(companyId: string): Observable<CompanySettings>`
  - `updateSettings(companyId: string, data: CompanySettingsUpdate): Observable<CompanySettings>`
  - `activate(companyId: string): Observable<any>`
  - `deactivate(companyId: string): Observable<any>`
  - `suspend(companyId: string, reason: string): Observable<any>`

### `IvapEmployeeService`
- **Endpoint**: `/employees`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<CompanyEmployee>>`
  - `getById(employeeId: string): Observable<CompanyEmployee>`
  - `create(data: CompanyEmployeePost): Observable<CompanyEmployee>`
  - `update(employeeId: string, data: CompanyEmployeeUpdate): Observable<CompanyEmployee>`
  - `delete(employeeId: string): Observable<void>`
  - `getSubordinates(employeeId: string, params?: QueryParams): Observable<PaginatedResponse<CompanyEmployee>>`

---

## 👥 Visitor & Guest Services

### `IvapVisitorService`
- **Endpoint**: `/visitors`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Visitor>>`
  - `getById(visitorId: string): Observable<Visitor>`
  - `create(data: Partial<Visitor>): Observable<Visitor>`
  - `update(visitorId: string, data: Partial<Visitor>): Observable<Visitor>`
  - `checkIn(visitorId: string): Observable<Visitor>`
  - `checkOut(visitorId: string): Observable<Visitor>`

### `IvapGuestService`
- **Endpoint**: `/guests`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Guest>>`
  - `getById(guestId: string): Observable<Guest>`
  - `create(data: Partial<Guest>): Observable<Guest>`
  - `update(guestId: string, data: Partial<Guest>): Observable<Guest>`
  - `checkIn(guestId: string): Observable<Guest>`
  - `checkOut(guestId: string): Observable<Guest>`

---

## 🎉 Event Services

### `IvapEventService`
- **Endpoint**: `/events`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Event>>`
  - `getById(eventId: string): Observable<Event>`
  - `create(data: Partial<Event>): Observable<Event>`
  - `update(eventId: string, data: Partial<Event>): Observable<Event>`
  - `delete(eventId: string): Observable<void>`

---

## 🚪 Access Control Services

### `IvapDeviceService`
- **Endpoint**: `/devices`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Device>>`
  - `getById(deviceId: string): Observable<Device>`
  - `create(data: Partial<Device>): Observable<Device>`
  - `update(deviceId: string, data: Partial<Device>): Observable<Device>`
  - `delete(deviceId: string): Observable<void>`

### `IvapDoorService`
- **Endpoint**: `/doors`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Door>>`
  - `getById(doorId: string): Observable<Door>`
  - `create(data: Partial<Door>): Observable<Door>`
  - `update(doorId: string, data: Partial<Door>): Observable<Door>`
  - `delete(doorId: string): Observable<void>`

### `IvapVerificationService`
- **Endpoint**: `/verification`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Verification>>`
  - `getById(verificationId: string): Observable<Verification>`

---

## 🔬 Biometric Services

### `IvapFaceService`
- **Endpoint**: `/verification/face`
- **Methods**:
  - `enroll(formData: FormData): Observable<FaceEnrollment>`
  - `createEnrollmentFormData(image: File, memberId: string, companyId: string): FormData`

---

## 📱 QR Code & RFID Services

### `IvapQrCodeService`
- **Endpoint**: `/verification/qr-code`
- **Methods**:
  - `generate(data: QRCodeGenerateRequest): Observable<QRCode>`

### `IvapRfidCardService`
- **Endpoint**: `/verification/rfid-card`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<RFIDCard>>`
  - `getById(rfidCardId: string): Observable<RFIDCard>`
  - `create(data: Partial<RFIDCard>): Observable<RFIDCard>`
  - `update(rfidCardId: string, data: Partial<RFIDCard>): Observable<RFIDCard>`
  - `delete(rfidCardId: string): Observable<void>`

---

## 🚗 Vehicle & Parking Services

### `IvapVehicleService`
- **Endpoint**: `/vehicles`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Vehicle>>`
  - `getById(vehicleId: string): Observable<Vehicle>`
  - `create(data: Partial<Vehicle>): Observable<Vehicle>`
  - `update(vehicleId: string, data: Partial<Vehicle>): Observable<Vehicle>`
  - `delete(vehicleId: string): Observable<void>`

### `IvapParkingService`
- **Endpoint**: `/parking`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<ParkingRecord>>`
  - `getById(parkingId: string): Observable<ParkingRecord>`
  - `create(data: Partial<ParkingRecord>): Observable<ParkingRecord>`
  - `update(parkingId: string, data: Partial<ParkingRecord>): Observable<ParkingRecord>`
  - `exit(parkingId: string): Observable<ParkingRecord>`

---

## ⏰ Time & Attendance Services

### `IvapTimestampService`
- **Endpoint**: `/timestamps`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<EmployeeTimestamp>>`
  - `getById(timestampId: string): Observable<EmployeeTimestamp>`
  - `create(data: Partial<EmployeeTimestamp>): Observable<EmployeeTimestamp>`

### `IvapShiftService`
- **Endpoint**: `/shifts`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Shift>>`
  - `getById(shiftId: string): Observable<Shift>`
  - `create(data: Partial<Shift>): Observable<Shift>`
  - `update(shiftId: string, data: Partial<Shift>): Observable<Shift>`
  - `delete(shiftId: string): Observable<void>`

### `IvapLeaveService`
- **Endpoint**: `/leaves`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<LeaveRequest>>`
  - `getById(leaveId: string): Observable<LeaveRequest>`
  - `create(data: Partial<LeaveRequest>): Observable<LeaveRequest>`
  - `update(leaveId: string, data: Partial<LeaveRequest>): Observable<LeaveRequest>`
  - `approve(leaveId: string): Observable<LeaveRequest>`
  - `reject(leaveId: string, reason?: string): Observable<LeaveRequest>`
  - `cancel(leaveId: string): Observable<LeaveRequest>`

---

## 📊 Analytics Services

### `IvapAnalyticsService`
- **Endpoint**: `/analytics`
- **Methods**:
  - `getAnalytics(params?: QueryParams): Observable<AnalyticsResponse>`

### `IvapDashboardService`
- **Endpoint**: `/dashboard`
- **Methods**:
  - `getDashboard(): Observable<DashboardResponse>`

---

## 📡 Monitoring Services

### `IvapMonitoringService`
- **Endpoint**: `/monitoring`
- **Methods**:
  - `getHealth(): Observable<SystemHealth>`

---

## 🔔 Notification Services

### `IvapNotificationService`
- **Endpoint**: `/notifications`
- **Methods**:
  - `getAll(params?: QueryParams): Observable<PaginatedResponse<Notification>>`
  - `getById(notificationId: string): Observable<Notification>`
  - `markAsRead(notificationId: string): Observable<Notification>`
  - `markAllAsRead(): Observable<any>`

---

## ⚙️ System Services

### `IvapSystemService`
- **Endpoint**: `/system`
- **Methods**:
  - `getSettings(): Observable<Record<string, any>>`
  - `updateSettings(settings: Record<string, any>): Observable<Record<string, any>>`

---

## 📦 Models by Domain

### Common Models
- `PaginatedResponse<T>`
- `QueryParams`
- `ErrorResponse`
- `ApiResponse<T>`

### Auth Models
- `LoginRequest`
- `RegisterRequest`
- `Token`
- `Member`
- `ForgotPasswordRequest`
- `ForgotPasswordResponse`
- `ResetPasswordRequest`
- `ResetPasswordResponse`

### Organization Models
- `Company`
- `CompanyBase`
- `CompanyUpdate`
- `CompanySettings`
- `CompanySettingsUpdate`
- `CompanyStatistics`
- `CompanyEmployee`
- `CompanyEmployeePost`
- `CompanyEmployeeUpdate`

### Visitor & Guest Models
- `Visitor`
- `Guest`

### Event Models
- `Event`

### Access Control Models
- `Device`
- `Door`
- `Verification`

### Biometric Models
- `FaceEnrollment`

### QR Code & RFID Models
- `QRCode`
- `QRCodeGenerateRequest`
- `RFIDCard`

### Vehicle & Parking Models
- `Vehicle`
- `ParkingRecord`

### Time & Attendance Models
- `EmployeeTimestamp`
- `Shift`
- `LeaveRequest`

### Analytics Models
- `AnalyticsResponse`
- `DashboardResponse`
- `DashboardStatistics`

### Monitoring Models
- `SystemHealth`

### Notification Models
- `Notification`

---

## 🔄 Query Parameters (QueryParams)

### Standard Query Parameters
- `page`: number - หน้า (default: 1)
- `page_size`: number - จำนวนรายการต่อหน้า (default: 10)
- `search`: string - ค้นหา
- `sort_by`: string - เรียงตาม field
- `sort_order`: 'asc' | 'desc' - ทิศทางการเรียง
- `filter`: object - ตัวกรองข้อมูล

### Example Usage
```typescript
const params: QueryParams = {
  page: 1,
  page_size: 20,
  search: 'john',
  sort_by: 'created_at',
  sort_order: 'desc',
  filter: {
    status: 'active',
    company_id: '550e8400-e29b-41d4-a716-446655440000'
  }
};

service.getAll(params).subscribe(response => {
  console.log(response.data); // Array of items
  console.log(response.total); // Total count
});
```

---

## 📝 Usage Examples

### Example 1: Get All Companies with Pagination
```typescript
constructor(private companyService: IvapCompanyService) {}

loadCompanies(): void {
  this.companyService.getAll({
    page: 1,
    page_size: 20,
    search: 'tech',
    sort_by: 'name',
    sort_order: 'asc'
  }).subscribe({
    next: (response) => {
      console.log('Companies:', response.data);
      console.log('Total:', response.total);
    },
    error: (error) => {
      console.error('Error loading companies:', error);
    }
  });
}
```

### Example 2: Create New Employee
```typescript
createEmployee(): void {
  const employeeData: CompanyEmployeePost = {
    member_id: '550e8400-e29b-41d4-a716-446655440000',
    company_id: '550e8400-e29b-41d4-a716-446655440001',
    employee_code: 'EMP001',
    department_id: '550e8400-e29b-41d4-a716-446655440002',
    position_id: '550e8400-e29b-41d4-a716-446655440003'
  };

  this.employeeService.create(employeeData).subscribe({
    next: (employee) => {
      console.log('Employee created:', employee);
    },
    error: (error) => {
      console.error('Error creating employee:', error);
    }
  });
}
```

### Example 3: Face Enrollment
```typescript
enrollFace(imageFile: File, memberId: string, companyId: string): void {
  const formData = this.faceService.createEnrollmentFormData(
    imageFile,
    memberId,
    companyId
  );

  this.faceService.enroll(formData).subscribe({
    next: (enrollment) => {
      console.log('Face enrolled:', enrollment);
    },
    error: (error) => {
      console.error('Error enrolling face:', error);
    }
  });
}
```

### Example 4: Check In Visitor
```typescript
checkInVisitor(visitorId: string): void {
  this.visitorService.checkIn(visitorId).subscribe({
    next: (visitor) => {
      console.log('Visitor checked in:', visitor);
    },
    error: (error) => {
      console.error('Error checking in visitor:', error);
    }
  });
}
```

---

## 🔗 Service Import Paths

### Barrel Exports (Recommended)
```typescript
// Import from domain barrel
import { IvapAuthService } from '@core/services/ivap';
import { IvapCompanyService, IvapEmployeeService } from '@core/services/ivap';
import { IvapVisitorService, IvapGuestService } from '@core/services/ivap';
```

### Direct Imports
```typescript
// Import from specific domain
import { IvapAuthService } from '@core/services/ivap/auth';
import { IvapCompanyService } from '@core/services/ivap/organization';
import { IvapVisitorService } from '@core/services/ivap/visitor-guest';
```

---

## 📚 Model Import Paths

### Barrel Exports (Recommended)
```typescript
// Import from main models barrel
import {
  Company,
  CompanyEmployee,
  Visitor,
  Guest,
  Event,
  Device,
  Door,
  Vehicle,
  ParkingRecord,
  EmployeeTimestamp,
  Shift,
  LeaveRequest,
  Notification,
  DashboardResponse
} from '@core/models';
```

### Domain-Specific Imports
```typescript
// Import from specific domain
import { Company, CompanyEmployee } from '@core/models/ivap/organization';
import { Visitor, Guest } from '@core/models/ivap/visitor-guest';
import { Event } from '@core/models/ivap/event';
```

---

## ✅ Summary

### Total Services: 22 Services
- Auth: 1 service
- Organization: 2 services
- Visitor & Guest: 2 services
- Event: 1 service
- Access Control: 3 services
- Biometric: 1 service
- QR Code & RFID: 2 services
- Vehicle & Parking: 2 services
- Time & Attendance: 3 services
- Analytics: 2 services
- Monitoring: 1 service
- Notifications: 1 service
- System: 1 service

### Total BaseApiService Methods: 10 Methods
- HTTP Methods: `get`, `getPaginated`, `post`, `put`, `patch`, `delete`
- File Methods: `postFormData`, `downloadFile`
- Token Methods: `getToken`, `setToken`, `removeToken`

### Total Models: 84+ Models
- Common: 4 models
- Auth: 8 models
- Organization: 9 models
- Visitor & Guest: 2 models
- Event: 1 model
- Access Control: 3 models
- Biometric: 1 model
- QR Code & RFID: 3 models
- Vehicle & Parking: 2 models
- Time & Attendance: 3 models
- Analytics: 3 models
- Monitoring: 1 model
- Notifications: 1 model

---

**Last Updated**: 2025-01-01
**Version**: 1.0.0

