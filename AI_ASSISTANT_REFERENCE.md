# AI Assistant Reference - IVAP Frontend

## 📋 Overview

เอกสารนี้เป็น reference สำหรับ AI coding assistants (เช่น Cursor AI, GitHub Copilot, ChatGPT) เพื่อช่วยในการเขียนโค้ดสำหรับ IVAP Frontend

---

## 📚 Documentation Files

### 1. `OPENAI_JSON_SERVICES_DOCUMENTATION.md`
- **Purpose**: เอกสารอ้างอิง Services, Models และ Functions ทั้งหมด
- **Content**:
  - BaseApiService Methods (10 methods)
  - IVAP Services (22 services)
  - Models (84+ models)
  - Query Parameters
  - Usage Examples
  - Import Paths

### 2. `openai.json`
- **Purpose**: OpenAPI 3.1.0 specification สำหรับ backend API
- **Content**: Complete API schema with all endpoints, models, and responses

---

## 🔧 Quick Reference

### Services Structure
```
src/app/core/services/ivap/
├── auth/              # Authentication
├── organization/      # Company, Employee
├── visitor-guest/     # Visitor, Guest
├── event/            # Event Management
├── access-control/    # Device, Door, Verification
├── biometric/         # Face Recognition
├── qr-rfid/          # QR Code, RFID Card
├── vehicle-parking/   # Vehicle, Parking
├── time-attendance/   # Timestamp, Shift, Leave
├── analytics/        # Analytics, Dashboard
├── monitoring/       # System Monitoring
├── notifications/     # Notifications
└── system/           # System Settings
```

### Models Structure
```
src/app/core/models/ivap/
├── common/           # Common types, Pagination
├── auth/             # Authentication models
├── organization/     # Company, Employee models
├── visitor-guest/    # Visitor, Guest models
├── event/           # Event models
├── access-control/   # Device, Door, Verification models
├── biometric/       # Face Enrollment models
├── qr-rfid/         # QR Code, RFID models
├── vehicle-parking/ # Vehicle, Parking models
├── time-attendance/ # Timestamp, Shift, Leave models
├── analytics/       # Analytics, Dashboard models
└── notifications/   # Notification models
```

---

## 💡 Common Patterns

### 1. Creating a Service
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import { ModelName, PaginatedResponse, QueryParams } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapModelNameService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/model-name';
  }

  getAll(params?: QueryParams): Observable<PaginatedResponse<ModelName>> {
    return this.getPaginated<ModelName>('', params);
  }

  getById(id: string): Observable<ModelName> {
    return this.get<ModelName>(`/${id}`);
  }

  create(data: Partial<ModelName>): Observable<ModelName> {
    return this.post<ModelName>('', data);
  }

  update(id: string, data: Partial<ModelName>): Observable<ModelName> {
    return this.put<ModelName>(`/${id}`, data);
  }

  override delete(id: string): Observable<void> {
    return super.delete(`/${id}`);
  }
}
```

### 2. Using a Service in Component
```typescript
import { Component, OnInit } from '@angular/core';
import { IvapModelNameService } from '@core/services/ivap';
import { ModelName, PaginatedResponse } from '@core/models';

@Component({
  selector: 'app-model-name-list',
  templateUrl: './model-name-list.component.html'
})
export class ModelNameListComponent implements OnInit {
  items: ModelName[] = [];
  loading = false;

  constructor(private service: IvapModelNameService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.service.getAll({ page: 1, page_size: 20 }).subscribe({
      next: (response: PaginatedResponse<ModelName>) => {
        this.items = response.items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading = false;
      }
    });
  }
}
```

### 3. Error Handling Pattern
```typescript
this.service.getAll().subscribe({
  next: (response) => {
    // Handle success
  },
  error: (error) => {
    console.error('Error:', error);
    // Show user-friendly error message
  }
});
```

---

## 🎯 Key Services & Methods

### Authentication
- `IvapAuthService.login()` - User login
- `IvapAuthService.getCurrentUser()` - Get current user
- `IvapAuthService.logout()` - User logout

### Organization
- `IvapCompanyService.getAll()` - Get all companies
- `IvapCompanyService.create()` - Create company
- `IvapEmployeeService.getAll()` - Get all employees
- `IvapEmployeeService.getSubordinates()` - Get employee subordinates

### Visitor & Guest
- `IvapVisitorService.checkIn()` - Check in visitor
- `IvapVisitorService.checkOut()` - Check out visitor
- `IvapGuestService.checkIn()` - Check in guest
- `IvapGuestService.checkOut()` - Check out guest

### Access Control
- `IvapDeviceService.getAll()` - Get all devices
- `IvapDoorService.getAll()` - Get all doors
- `IvapVerificationService.getAll()` - Get all verifications

### Biometric
- `IvapFaceService.enroll()` - Enroll face for recognition

### Time & Attendance
- `IvapTimestampService.create()` - Create timestamp (check-in/out)
- `IvapShiftService.getAll()` - Get all shifts
- `IvapLeaveService.approve()` - Approve leave request
- `IvapLeaveService.reject()` - Reject leave request

### Analytics
- `IvapDashboardService.getDashboard()` - Get dashboard data
- `IvapAnalyticsService.getAnalytics()` - Get analytics data

---

## 📦 Import Patterns

### Barrel Exports (Recommended)
```typescript
// Services
import { 
  IvapAuthService,
  IvapCompanyService,
  IvapEmployeeService 
} from '@core/services/ivap';

// Models
import {
  Company,
  CompanyEmployee,
  Visitor,
  Guest,
  PaginatedResponse,
  QueryParams
} from '@core/models';
```

### Domain-Specific Imports
```typescript
// Services
import { IvapAuthService } from '@core/services/ivap/auth';
import { IvapCompanyService } from '@core/services/ivap/organization';

// Models
import { Company } from '@core/models/ivap/organization';
import { Visitor } from '@core/models/ivap/visitor-guest';
```

---

## 🔍 Query Parameters

### Standard QueryParams
```typescript
interface QueryParams {
  page?: number;           // Page number (default: 1)
  page_size?: number;      // Items per page (default: 10)
  search?: string;         // Search term
  sort_by?: string;        // Sort field
  sort_order?: 'asc' | 'desc';  // Sort direction
  filter?: {               // Filter object
    [key: string]: any;
  };
}
```

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
```

---

## 📝 Model Patterns

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
```

### Common Model Fields
```typescript
interface BaseModel {
  id: string;              // UUID
  company_id: string;      // UUID
  created_at: string;      // ISO 8601 date-time
  updated_at: string;      // ISO 8601 date-time
}
```

---

## 🚀 Best Practices

### 1. Always Use TypeScript Types
```typescript
// ✅ Good
getAll(): Observable<PaginatedResponse<Company>> {
  return this.getPaginated<Company>('');
}

// ❌ Bad
getAll(): Observable<any> {
  return this.getPaginated('');
}
```

### 2. Handle Errors Properly
```typescript
// ✅ Good
this.service.getAll().subscribe({
  next: (response) => {
    // Handle success
  },
  error: (error) => {
    console.error('Error:', error);
    // Show user-friendly message
  }
});

// ❌ Bad
this.service.getAll().subscribe(response => {
  // No error handling
});
```

### 3. Use Loading States
```typescript
// ✅ Good
loading = false;

loadData(): void {
  this.loading = true;
  this.service.getAll().subscribe({
    next: (response) => {
      this.data = response.items;
      this.loading = false;
    },
    error: (error) => {
      this.loading = false;
      // Handle error
    }
  });
}
```

### 4. Use Barrel Exports
```typescript
// ✅ Good
import { IvapCompanyService } from '@core/services/ivap';

// ❌ Bad
import { IvapCompanyService } from '@core/services/ivap/organization/company.service';
```

---

## 📖 Additional Resources

- **Backend API Documentation**: `doc-backend/API_DOCUMENTATION.md`
- **System Architecture**: `doc-backend/SYSTEM_ARCHITECTURE_ANALYSIS.md`
- **Angular Integration Guide**: `doc-backend/ANGULAR_INTEGRATION_GUIDE.md`
- **Migration Summary**: `IVAP_MIGRATION_SUMMARY.md`

---

## 🎓 Learning Path

1. **Start with BaseApiService**: Understand the base HTTP methods
2. **Learn Service Patterns**: See how services extend BaseApiService
3. **Understand Models**: Review the model structure and types
4. **Practice with Examples**: Use the usage examples in documentation
5. **Follow Best Practices**: Apply the patterns shown above

---

**Last Updated**: 2025-01-01
**Version**: 1.0.0

