# IVAP Frontend - Intelligent Video Analytics Platform

**เวอร์ชัน**: 1.0.0  
**อัปเดตล่าสุด**: 2025-01-XX

## 📋 ภาพรวม

ระบบ Intelligent Video Analytics Platform (IVAP) Frontend ที่พัฒนาโดยใช้ Angular 17+ พร้อม Design System ที่ทันสมัย สำหรับจัดการ Visitor Access, Access Control, และ Video Analytics

## ✨ Features

- 🎨 **MyHR Theme** - ธีมสีฟ้าเข้มพร้อม gradient effects และ animations
- 🌓 **Dark/Light Mode** - รองรับทั้งโหมดมืดและสว่าง
- 📱 **Responsive Design** - Mobile-first approach
- 🎭 **Glass Morphism** - Modern UI design system
- ⚡ **Standalone Components** - Angular standalone components
- 🔄 **Syncfusion UI-KIT** - Enterprise UI components
- 🌐 **Multi-language** - รองรับภาษาไทยและอังกฤษ

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+ or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Development Server
The app will be available at `http://localhost:4200`

## 🎨 Design System

### MyHR Theme

ระบบรองรับธีม **MyHR** ที่มีลักษณะ:
- พื้นหลังสีเข้มเกือบดำ (#000000)
- Gradient สีฟ้าอ่อนไปฟ้าเข้ม (Light blue → Darker blue)
- Vector effects และ animated particles
- Text gradient effects
- Animated border glows
- Dynamic primary color support

**วิธีใช้งาน:**
```typescript
// เปิดใช้งานผ่าน ThemeService
this.themeService.setTheme({ color: 'myhr', mode: 'dark' });
this.themeService.setPrimaryColor('59, 130, 246'); // RGB values
```

### Glass Morphism Components

โปรเจคใช้ **Glass Morphism Design System** พร้อม components:

#### Glass Components (3)
- **GlassCard** - Card component with glass effect
- **GlassButton** - Button component with glass styling
- **GlassInput** - Input component with glass styling

#### UI Components (30+)
- EmptyState, Loading, StatisticsCard, Tabs, ProgressBar
- Rating, Tooltip, Modal, PageLayout, DataTable
- Icon, Avatar, Spinner, ThemeToggle, StatusBadge
- ErrorState, Breadcrumbs, Stepper, Timeline
- SearchFilter, DateRangePicker, FileUpload, ImageUpload
- FormValidationMessages, ConfirmDialog, SkeletonLoader
- และอื่นๆ...

ดูรายละเอียด: [TEMPLATE_AND_COMPONENTS_GUIDE.md](./TEMPLATE_AND_COMPONENTS_GUIDE.md)

### Demo System

ระบบ Demo ที่ครบถ้วนสำหรับแสดงตัวอย่างการใช้งาน components:

- **96 Demo Components** - ทุก component มี demo page
- **Live Interactive Demos** - ทดสอบได้จริง
- **Code Examples** - พร้อม syntax highlighting
- **API Documentation** - Props tables ครบถ้วน
- **Multiple Examples** - หลายรูปแบบการใช้งาน

**เข้าดู Demo**: `http://localhost:4200/demo`

**Syncfusion Components**: Data Grid, Scheduler, Chart, Rich Text Editor, Query Builder, Document Editor, Speech to Text, Image Editor, Tree Grid, Spreadsheet, PDF Viewer, Diagrams, Signature, Carousel, Gantt Chart, File Manager, Uploader, Autocomplete, Smart TextArea, AI Assist View

ดูรายละเอียด: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

## 📁 Project Structure

```
ivap-frontend/
├── src/
│   ├── app/
│   │   ├── core/              # Core services, guards, interceptors, models
│   │   ├── shared/            # Shared components, directives, pipes
│   │   │   └── components/    # 30+ reusable components
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── ivap/          # IVAP features
│   │   │   │   ├── dashboard/ # IVAP Dashboard
│   │   │   │   ├── visitors/  # Visitor Management
│   │   │   │   ├── guests/    # Guest Management
│   │   │   │   ├── events/    # Event Management
│   │   │   │   ├── organization/ # Organization Management
│   │   │   │   ├── time-attendance/ # Time & Attendance
│   │   │   │   ├── access-control/ # Access Control
│   │   │   │   ├── devices/   # Device Management
│   │   │   │   ├── verification/ # Verification
│   │   │   │   ├── biometric/ # Biometric & Face Recognition
│   │   │   │   ├── vehicles/  # Vehicle Management
│   │   │   │   ├── parking/   # Parking Management
│   │   │   │   ├── qr-rfid/   # QR Code & RFID
│   │   │   │   ├── notifications/ # Notifications
│   │   │   │   ├── analytics/ # Analytics & Reporting
│   │   │   │   ├── video-ai/  # Video Analytics & AI
│   │   │   │   └── system/    # System Administration
│   │   │   ├── demo/          # Demo components
│   │   │   ├── error/         # Error pages
│   │   │   └── not-found/     # 404 page
│   │   └── layout/            # Layout components
│   │       ├── main-layout/   # Main layout
│   │       ├── header/        # Header component
│   │       ├── sidebar/       # Sidebar component
│   │       └── footer/        # Footer component
│   ├── assets/                # Static assets
│   ├── environments/          # Environment configurations
│   └── styles.scss            # Global styles (MyHR theme)
├── angular.json
├── package.json
├── tailwind.config.js         # Tailwind + Gemini config
└── tsconfig.json
```

## 🎯 IVAP Features

### Core Modules (16 Modules)

1. **Dashboard** - IVAP Dashboard with statistics and analytics
2. **Organization** - Company, Employee, Department, Position, Member management
3. **Time & Attendance** - Timestamps, Shifts, Leaves management
4. **Visitors** - Visitor registration and management
5. **Guests** - Guest registration and management
6. **Events** - Event creation and management
7. **Access Control** - Door access control and rules
8. **Devices** - Device management (cameras, sensors, etc.)
9. **Verification** - Verification sessions, templates, and configuration
10. **Biometric** - Face enrollment and biometric data management
11. **Vehicles** - Vehicle registration and management
12. **Parking** - Parking management with LPR (License Plate Recognition)
13. **QR Code & RFID** - QR code and RFID card management
14. **Notifications** - Alerts and notifications system
15. **Analytics** - Reports and monitoring dashboards
16. **Video & AI** - Video analytics and AI model management
17. **System** - System settings, logs, and safety dashboard

### API Integration

- **Base URL**: `http://localhost:8000` (development)
- **API Version**: `/api/v1`
- **Services**: 27 IVAP services extending `BaseApiService`
- **Authentication**: JWT token-based authentication
- **Models**: Complete TypeScript models matching backend API

ดูรายละเอียด: [IVAP_MIGRATION_SUMMARY.md](./IVAP_MIGRATION_SUMMARY.md)

## 🛠️ Technology Stack

- **Angular**: 17+
- **TypeScript**: 5+
- **Tailwind CSS**: 3+ (Utility-first CSS) ✅ **Full Migration Complete**
- **Syncfusion**: Enterprise UI Components
- **RxJS**: Reactive programming
- **Angular Material**: UI Component Library (optional)

### Tailwind CSS Migration ✅

โปรเจคได้ migrate ไปใช้ **Tailwind CSS แบบสมบูรณ์** แล้ว:

- ✅ **43+ Components** ใช้ Tailwind โดยสมบูรณ์
- ✅ **CSS Bundle Size** ลดลง ~80-90% per component
- ✅ **Tailwind Plugins** - Glass Morphism และ Animation utilities
- ✅ **Design Tokens** - Migrate ไป Tailwind config แล้ว
- ✅ **Dark Mode & Gemini Theme** - รองรับผ่าน Tailwind variants

ดูรายละเอียด: [TAILWIND_MIGRATION_COMPLETE.md](./TAILWIND_MIGRATION_COMPLETE.md)

## 📚 Documentation

### Main Documentation
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** ⭐ - คู่มือเอกสารทั้งหมด (อัปเดตล่าสุด)
- **[ROUTES_RESTRUCTURE_COMPLETE.md](./ROUTES_RESTRUCTURE_COMPLETE.md)** ✅ - Routes Restructure Complete (2024-12-29)
- **[TAILWIND_MIGRATION_COMPLETE.md](./TAILWIND_MIGRATION_COMPLETE.md)** ✅ - Tailwind Migration Complete Summary
- **[TAILWIND_FULL_MIGRATION_GUIDE.md](./TAILWIND_FULL_MIGRATION_GUIDE.md)** - Tailwind Full Migration Guide
- **[UX_UI_DESIGN_SYSTEM_RULES.md](./UX_UI_DESIGN_SYSTEM_RULES.md)** - UX/UI Design System Rules
- **[TEMPLATE_AND_COMPONENTS_GUIDE.md](./TEMPLATE_AND_COMPONENTS_GUIDE.md)** - Template and Components Guide
- **[DEMO_SYSTEM_GUIDE.md](./DEMO_SYSTEM_GUIDE.md)** - Demo System Guide

### Syncfusion Component Documentation
ทุก component มี 2 ไฟล์: **GUIDE.md** (คู่มือละเอียด) และ **SUMMARY.md** (สรุปย่อ)

**Data Display**: Data Grid, Pivot Table, Tree Grid, Spreadsheet, Chart, Diagrams, PDF Viewer, Carousel, Gantt Chart, File Manager

**Form & Input**: Scheduler, Rich Text Editor, Document Editor, Query Builder, Speech to Text, Image Editor, Signature, Uploader, Autocomplete, Smart TextArea, AI Assist View

ดูรายละเอียดทั้งหมด: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

### Design System Guides
- **[UI_KIT_GUIDE.md](./UI_KIT_GUIDE.md)** - UI Kit Guide
- **[GLASSMORPHISM_TEMPLATE_GUIDE.md](./GLASSMORPHISM_TEMPLATE_GUIDE.md)** - Glass Morphism Guide
- **[DARK_MODE_THEME_GUIDE.md](./DARK_MODE_THEME_GUIDE.md)** - Dark Mode Guide
- **[RESPONSIVE_BREAKPOINTS_GUIDE.md](./RESPONSIVE_BREAKPOINTS_GUIDE.md)** - Responsive Breakpoints Guide
- **[TAILWIND_SETUP.md](./TAILWIND_SETUP.md)** - Tailwind Configuration

### เอกสาร API & Integration
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API Documentation
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Setup Guide

### IVAP Features Documentation
- **[IVAP_MIGRATION_PLAN.md](./IVAP_MIGRATION_PLAN.md)** - IVAP Migration Plan (Complete)
- **[IVAP_MIGRATION_SUMMARY.md](./IVAP_MIGRATION_SUMMARY.md)** ⭐ - IVAP Migration Summary (Complete)
- **[doc-backend/SYSTEM_ARCHITECTURE_ANALYSIS.md](./doc-backend/SYSTEM_ARCHITECTURE_ANALYSIS.md)** - IVAP Backend Architecture
- **[doc-backend/API_DOCUMENTATION.md](./doc-backend/API_DOCUMENTATION.md)** - IVAP API Documentation
- **[doc-backend/ANGULAR_INTEGRATION_GUIDE.md](./doc-backend/ANGULAR_INTEGRATION_GUIDE.md)** - Angular Integration Guide

### AI Assistant & Developer Reference
- **[AI_ASSISTANT_REFERENCE.md](./AI_ASSISTANT_REFERENCE.md)** ⭐ - AI Assistant Reference (Quick guide for AI coding assistants)
- **[OPENAI_JSON_SERVICES_DOCUMENTATION.md](./OPENAI_JSON_SERVICES_DOCUMENTATION.md)** - Complete Services & Models Documentation

### UX/UI Improvement Plans
- **[UX_UI_COMPONENTS_IMPROVEMENT_PLAN.md](./UX_UI_COMPONENTS_IMPROVEMENT_PLAN.md)** ⭐ - แผนการปรับปรุง UX/UI Components
- **[UX_UI_COMPONENTS_CHECKLIST.md](./UX_UI_COMPONENTS_CHECKLIST.md)** - Checklist สำหรับการปรับปรุง
- **[PHASE_1_PROGRESS_REPORT.md](./PHASE_1_PROGRESS_REPORT.md)** - รายงานความคืบหน้า Phase 1

## 🎯 Key Features

### Authentication
- JWT-based authentication
- Role-based access control
- Session management
- Multi-database support

### Layout System
- Two-layer sidebar design
- Responsive header
- Modern footer
- Gemini theme support

### Components
- 30+ reusable components
- Glass morphism design
- Dark/Light mode support
- Responsive design

## 🔧 Configuration

### Environment Variables
See `src/environments/` for environment configurations

### Proxy Configuration
API calls are proxied to the backend server. See `proxy.conf.json`

### Theme Configuration
Themes are managed through `ThemeService`. Available themes:
- `blue`, `indigo`, `purple`, `green`, `orange`, `red`, `teal`, `pink`
- **`myhr`** - MyHR theme (default)

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run e2e

# Coverage
npm run test:coverage
```

## 📦 Build & Deploy

```bash
# Development build
npm run build

# Production build
npm run build:prod

# Analyze bundle
npm run build:analyze
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 Changelog

See [DOCUMENTATION_CHANGELOG.md](./DOCUMENTATION_CHANGELOG.md) for detailed changelog

## 📄 License

Proprietary - Enterprise PT

---

**Maintainer**: Development Team  
**Last Updated**: 2024-12-29

---

## 🔄 Recent Changes (2025-01-01)

### Phase 1-10: API Services & Models Implementation ✅ **COMPLETE**
- ✅ **Services**: 17 services, 150+ endpoints (100% coverage)
- ✅ **Models**: 45+ interfaces (100% coverage)
- ✅ **Barrel Exports**: ครบถ้วนทั้งหมด
- ✅ **Code Quality**: 0 TypeScript errors, 0 Linter errors
- ✅ **Build Errors**: แก้ไขเรียบร้อย (DeviceStatus conflicts)

**เอกสารที่เกี่ยวข้อง**:
- [FINAL_IMPLEMENTATION_SUMMARY.md](./FINAL_IMPLEMENTATION_SUMMARY.md) - สรุปผลรวม Phase 1-10
- [PHASE_1_7_IMPLEMENTATION_SUMMARY.md](./PHASE_1_7_IMPLEMENTATION_SUMMARY.md) - สรุป Phase 1-7
- [PHASE_8_10_IMPLEMENTATION_SUMMARY.md](./PHASE_8_10_IMPLEMENTATION_SUMMARY.md) - สรุป Phase 8-10
- [BUILD_ERRORS_FIX_SUMMARY.md](./BUILD_ERRORS_FIX_SUMMARY.md) - สรุปการแก้ไข build errors
- [NEXT_STEPS_RECOMMENDATIONS.md](./NEXT_STEPS_RECOMMENDATIONS.md) - แนะนำขั้นตอนถัดไป

### IVAP Migration ✅
- ✅ **HR System → IVAP Frontend** - Migrated from HR System to IVAP Frontend
- ✅ **IVAP Features** - 16 IVAP modules implemented:
  - Dashboard, Organization, Time & Attendance
  - Visitors, Guests, Events
  - Access Control, Devices, Verification, Biometric
  - Vehicles, Parking, QR & RFID
  - Notifications, Analytics, Video & AI, System
- ✅ **Routes** - All routes updated to `/ivap/*` structure
- ✅ **Services & Models** - IVAP services and models implemented (17 services, 45+ interfaces)
- ✅ **Components** - IVAP components created (16 modules)

**See**: [IVAP_MIGRATION_PLAN.md](./IVAP_MIGRATION_PLAN.md) for complete migration details.
