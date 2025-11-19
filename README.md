# HR System Angular Migration

**เวอร์ชัน**: 2.0.0  
**อัปเดตล่าสุด**: 2024-12-19

## 📋 ภาพรวม

ระบบบริหารทรัพยากรบุคคล (HR System) ที่พัฒนาโดยใช้ Angular 17+ พร้อม Design System ที่ทันสมัย

## ✨ Features

- 🎨 **Gemini 1.5 Theme** - ธีมสีฟ้าเข้มพร้อม gradient effects และ animations
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

### Gemini 1.5 Theme

ระบบรองรับธีม **Gemini 1.5** ที่มีลักษณะ:
- พื้นหลังสีเข้มเกือบดำ (#000000)
- Gradient สีฟ้าอ่อนไปฟ้าเข้ม (Light blue → Darker blue)
- Vector effects และ animated particles
- Text gradient effects
- Animated border glows

**วิธีใช้งาน:**
```typescript
// เปิดใช้งานผ่าน ThemeService
this.themeService.setTheme({ color: 'gemini', mode: 'dark' });
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
- และอื่นๆ...

ดูรายละเอียด: [TEMPLATE_AND_COMPONENTS_GUIDE.md](./TEMPLATE_AND_COMPONENTS_GUIDE.md)

## 📁 Project Structure

```
angular-hr-migration/
├── src/
│   ├── app/
│   │   ├── core/              # Core services, guards, interceptors
│   │   ├── shared/            # Shared components, directives, pipes
│   │   │   └── components/     # 30+ reusable components
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── home/          # Dashboard/Home
│   │   │   ├── empview/       # Employee view
│   │   │   ├── ta/            # Time attendance
│   │   │   ├── personal/      # Personal information
│   │   │   ├── payroll/       # Payroll
│   │   │   └── ...            # Other modules
│   │   └── layout/            # Layout components
│   │       ├── main-layout/   # Main layout
│   │       ├── header/        # Header component
│   │       ├── sidebar/       # Sidebar component
│   │       └── footer/        # Footer component
│   ├── assets/                # Static assets
│   ├── environments/          # Environment configurations
│   └── styles.scss            # Global styles (Gemini theme)
├── angular.json
├── package.json
├── tailwind.config.js         # Tailwind + Gemini config
└── tsconfig.json
```

## 🛠️ Technology Stack

- **Angular**: 17+
- **TypeScript**: 5+
- **Tailwind CSS**: 3+ (Utility-first CSS)
- **Syncfusion**: Enterprise UI Components
- **RxJS**: Reactive programming
- **Angular Material**: UI Component Library (optional)

## 📚 Documentation

### เอกสารหลัก
- **[TEMPLATE_AND_COMPONENTS_GUIDE.md](./TEMPLATE_AND_COMPONENTS_GUIDE.md)** ⭐ - เอกสารหลักที่ครอบคลุมทุกอย่าง
- **[COMPONENTS_INDEX.md](./COMPONENTS_INDEX.md)** - เอกสารอ้างอิง Components
- **[UI_KIT_GUIDE.md](./UI_KIT_GUIDE.md)** - Syncfusion UI-KIT Guide

### เอกสาร Design System
- **[GLASSMORPHISM_TEMPLATE_GUIDE.md](./GLASSMORPHISM_TEMPLATE_GUIDE.md)** - Glass Morphism Guide
- **[DARK_MODE_THEME_GUIDE.md](./DARK_MODE_THEME_GUIDE.md)** - Dark Mode Guide
- **[TAILWIND_SETUP.md](./TAILWIND_SETUP.md)** - Tailwind Configuration

### เอกสาร API & Integration
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API Documentation
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Setup Guide

### Module Inventories
- **[EMPVIEW_MODULE_INVENTORY.md](./EMPVIEW_MODULE_INVENTORY.md)** - Employee View Module
- **[PAYROLL_MODULE_INVENTORY.md](./PAYROLL_MODULE_INVENTORY.md)** - Payroll Module
- **[TIME_MODULE_INVENTORY.md](./TIME_MODULE_INVENTORY.md)** - Time Attendance Module
- และอื่นๆ...

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
- **`gemini`** - Gemini 1.5 theme (new)

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
**Last Updated**: 2024-12-19
