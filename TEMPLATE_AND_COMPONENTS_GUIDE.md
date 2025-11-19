# 🎨 Glass Morphism Template & Components Guide

**อัปเดตล่าสุด**: 2024-12-19  
**เวอร์ชัน**: 1.0.0

---

## 📋 สารบัญ

1. [ภาพรวม](#ภาพรวม)
2. [Design System](#design-system)
3. [Configuration](#configuration)
4. [Shared Components](#shared-components)
5. [Demo Page](#demo-page)
6. [การใช้งาน](#การใช้งาน)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 ภาพรวม

โปรเจคนี้ใช้ **Glass Morphism Design System** ที่ดึงมาจาก Intelligent-Video-Analytics-Platform โดยมีลักษณะ:

- ✨ **Glass Morphism Effects** - เอฟเฟกต์กระจกใสพร้อม backdrop blur
- 🌓 **Dark/Light Mode** - รองรับทั้งโหมดมืดและสว่าง
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern Typography** - รองรับทั้งภาษาไทยและอังกฤษ
- ⚡ **Standalone Components** - ใช้ Angular standalone components

---

## 🎨 Design System

### Color Palette

#### Primary Colors
```scss
Primary 50:  #f0f9ff
Primary 100: #e0f2fe
Primary 200: #bae6fd
Primary 300: #7dd3fc
Primary 400: #38bdf8
Primary 500: #0ea5e9  ← Main primary color
Primary 600: #0284c7
Primary 700: #0369a1
Primary 800: #075985
Primary 900: #0c4a6e
Primary 950: #082f49
```

#### Background Gradients

**Light Mode:**
- Base: `#faf8f3 → #ede8d8` (Beige/Cream gradients)
- Blue Theme: `#eff6ff → #bfdbfe`
- Indigo Theme: `#eef2ff → #c7d2fe`
- Purple Theme: `#faf5ff → #e9d5ff`

**Dark Mode:**
- Base: `#000000 → #1e293b` (Dark gradients)
- Blue Theme: `#1e3a8a → #2563eb`
- Indigo Theme: `#312e81 → #4338ca`
- Purple Theme: `#581c87 → #7c3aed`

### Typography

#### Font Families
```scss
// Modern fonts (from Intelligent-Video-Analytics-Platform)
sans: 'Noto Sans', 'Noto Sans Thai', 'Poppins', 'Inter', 'Kanit', 'Sarabun'

// Language-specific
english: 'Poppins', 'Noto Sans', 'Inter'
thai: 'Kanit', 'Noto Sans Thai', 'Sarabun', 'Noto Sans'
mono: 'JetBrains Mono'
```

#### Font Sizes
- **H1**: 36px (text-4xl), font-bold
- **H2**: 24px (text-2xl), font-semibold
- **H3**: 20px (text-xl), font-semibold
- **H4**: 18px (text-lg), font-medium
- **Body**: 16px (text-base), font-normal
- **Label**: 14px (text-sm), font-medium
- **Caption**: 12px (text-xs), font-normal

### Glass Morphism Effects

#### Glass Card Variants
```scss
// Default
background: rgba(255, 255, 255, 0.25)
backdrop-filter: blur(10px)
border: 1px solid rgba(255, 255, 255, 0.3)

// Strong
background: rgba(255, 255, 255, 0.4)
backdrop-filter: blur(16px)
border: 1px solid rgba(255, 255, 255, 0.4)

// Weak
background: rgba(255, 255, 255, 0.1)
backdrop-filter: blur(6px)
border: 1px solid rgba(255, 255, 255, 0.2)
```

#### Dark Mode Glass Effects
```scss
// Default
background: rgba(15, 23, 42, 0.25)
backdrop-filter: blur(10px)
border: 1px solid rgba(51, 65, 85, 0.3)

// Strong
background: rgba(15, 23, 42, 0.4)
backdrop-filter: blur(16px)
border: 1px solid rgba(51, 65, 85, 0.4)

// Weak
background: rgba(15, 23, 42, 0.1)
backdrop-filter: blur(6px)
border: 1px solid rgba(51, 65, 85, 0.2)
```

---

## ⚙️ Configuration

### Tailwind Config (`tailwind.config.js`)

```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: [
          'Noto Sans', 
          'Noto Sans Thai', 
          'Poppins',
          'Inter',
          'Kanit', 
          'Sarabun',
          ...fontFamily.sans
        ],
        english: ['Poppins', 'Noto Sans', 'Inter', ...fontFamily.sans],
        thai: ['Kanit', 'Noto Sans Thai', 'Sarabun', 'Noto Sans', ...fontFamily.sans],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... full color scale
          500: '#0ea5e9',
          950: '#082f49',
        },
      },
    },
  },
};
```

### Angular Build Budget (`angular.json`)

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "3mb",
      "maximumError": "5mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "6kb",
      "maximumError": "10kb"
    }
  ],
  "allowedCommonJsDependencies": [
    "sha1",
    "moment",
    "crypt",
    "charenc"
  ]
}
```

### Prettier Config (`package.json`)

```json
{
  "prettier": {
    "printWidth": 100,
    "singleQuote": true,
    "overrides": [
      {
        "files": "*.html",
        "options": {
          "parser": "angular"
        }
      }
    ]
  }
}
```

---

## 🧩 Shared Components

### Glass Components

#### 1. GlassCardComponent
**Location**: `src/app/shared/components/glass-card/glass-card.component.ts`

**Features:**
- ✅ 3 variants: `default`, `strong`, `weak`
- ✅ Customizable padding
- ✅ Custom class support
- ✅ Animation support

**Usage:**
```html
<app-glass-card variant="default" padding="p-6" customClass="my-custom-class">
  <h3>Title</h3>
  <p>Content</p>
</app-glass-card>
```

#### 2. GlassButtonComponent
**Location**: `src/app/shared/components/glass-button/glass-button.component.ts`

**Features:**
- ✅ 3 variants: `primary`, `secondary`, `danger`
- ✅ 3 sizes: `sm`, `md`, `lg`
- ✅ Loading state
- ✅ Disabled state
- ✅ Full width option

**Usage:**
```html
<app-glass-button 
  variant="primary" 
  size="md"
  [loading]="isLoading"
  [disabled]="isDisabled"
  [fullWidth]="false"
  (clicked)="handleClick()">
  Click Me
</app-glass-button>
```

#### 3. GlassInputComponent
**Location**: `src/app/shared/components/glass-input/glass-input.component.ts`

**Features:**
- ✅ FormControl integration (ControlValueAccessor)
- ✅ Label, placeholder, error message, hint
- ✅ Required field indicator
- ✅ Validation support

**Usage:**
```html
<app-glass-input
  label="Username"
  placeholder="Enter username"
  [required]="true"
  [errorMessage]="errorMsg"
  formControlName="username">
</app-glass-input>
```

### UI Components

#### 4. EmptyStateComponent
**Location**: `src/app/shared/components/empty-state/empty-state.component.ts`

**Features:**
- ✅ Customizable icon, title, description
- ✅ Action button support
- ✅ Icon size variants

**Usage:**
```html
<app-empty-state
  icon="📭"
  title="ไม่มีข้อมูล"
  description="ยังไม่มีข้อมูลในส่วนนี้"
  [action]="emptyStateAction">
</app-empty-state>
```

**TypeScript:**
```typescript
emptyStateAction = {
  label: 'เพิ่มข้อมูล',
  variant: 'primary' as const,
  onClick: () => {
    // Handle action
  }
};
```

#### 5. LoadingComponent
**Location**: `src/app/shared/components/loading/loading.component.ts`

**Usage:**
```html
<app-loading [show]="isLoading" message="กำลังโหลดข้อมูล..."></app-loading>
```

#### 6. StatisticsCardComponent
**Location**: `src/app/shared/components/statistics-card/statistics-card.component.ts`

**Usage:**
```html
<app-statistics-card
  icon="👥"
  label="Total Users"
  value="1,234"
  suffix=""
  [change]="12">
</app-statistics-card>
```

#### 7. TabsComponent
**Location**: `src/app/shared/components/tabs/tabs.component.ts`

**Usage:**
```html
<app-tabs [tabs]="tabs" [activeTab]="activeTab" (activeTabChange)="onTabChange($event)">
  <div *ngIf="activeTab === 'tab1'">Tab 1 Content</div>
  <div *ngIf="activeTab === 'tab2'">Tab 2 Content</div>
</app-tabs>
```

**TypeScript:**
```typescript
tabs = [
  { id: 'tab1', label: 'Tab 1', icon: '📄' },
  { id: 'tab2', label: 'Tab 2', icon: '📊', badge: '3' },
  { id: 'tab3', label: 'Tab 3', icon: '⚙️', disabled: false }
];
```

#### 8. ProgressBarComponent
**Location**: `src/app/shared/components/progress-bar/progress-bar.component.ts`

**Usage:**
```html
<app-progress-bar
  [value]="65"
  label="Progress"
  variant="primary"
  description="Current progress: 65%">
</app-progress-bar>
```

#### 9. RatingComponent
**Location**: `src/app/shared/components/rating/rating.component.ts`

**Usage:**
```html
<app-rating
  [rating]="rating"
  [showValue]="true"
  icon="star"
  [readonly]="false"
  (ratingChange)="onRatingChange($event)">
</app-rating>
```

#### 10. TooltipComponent
**Location**: `src/app/shared/components/tooltip/tooltip.component.ts`

**Usage:**
```html
<app-tooltip text="This is a tooltip" position="bottom">
  <app-glass-button variant="primary">Hover me</app-glass-button>
</app-tooltip>
```

#### 11. ModalComponent
**Location**: `src/app/shared/components/modal/modal.component.ts`

**Usage:**
```html
<app-modal
  [show]="showModal"
  title="Modal Title"
  size="md"
  [closable]="true"
  (closeEvent)="closeModal()"
  (confirmEvent)="onConfirm()">
  <p>Modal content here</p>
</app-modal>
```

#### 12. PageLayoutComponent
**Location**: `src/app/shared/components/page-layout/page-layout.component.ts`

**Usage:**
```html
<app-page-layout 
  title="Page Title" 
  subtitle="Page subtitle"
  [showHeader]="true"
  [showFooter]="false">
  <div header-actions>
    <app-glass-button>Action</app-glass-button>
  </div>
  <div>Page content</div>
  <div footer>Footer content</div>
</app-page-layout>
```

---

## 🎬 Demo Page

### Route
```
/demo
```

### Features
หน้า demo แสดง components ทั้งหมดพร้อมตัวอย่างการใช้งาน:

1. **Statistics Cards** - แสดงสถิติพร้อม change indicators
2. **Glass Cards** - 3 variants (default, strong, weak)
3. **Glass Buttons** - ทุก variants, sizes, และ states
4. **Glass Inputs** - Form integration และ validation
5. **Tabs** - Tab navigation พร้อม icons และ badges
6. **Progress Bars** - ทุก variants (primary, success, warning, danger)
7. **Rating** - Star และ Heart rating
8. **Loading States** - Loading indicators
9. **Empty States** - Empty state displays
10. **Modal** - Modal dialogs
11. **Tooltips** - Tooltip displays
12. **Interactive Demos** - Interactive examples

### Access
```
URL: http://localhost:4200/demo
```

**Note**: Route `/demo` ไม่มี AuthGuard เพื่อให้เข้าถึงได้โดยไม่ต้อง login

---

## 🚀 การใช้งาน

### 1. Import Components

```typescript
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '@shared/components/glass-button/glass-button.component';
import { GlassInputComponent } from '@shared/components/glass-input/glass-input.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { StatisticsCardComponent } from '@shared/components/statistics-card/statistics-card.component';
// ... etc
```

### 2. ใช้ใน Module

```typescript
@NgModule({
  imports: [
    GlassCardComponent,
    GlassButtonComponent,
    GlassInputComponent,
    // ... other components
  ]
})
export class YourModule { }
```

### 3. ใช้ใน Template

```html
<app-glass-card variant="default" padding="p-6">
  <app-statistics-card
    icon="👥"
    label="Users"
    value="1,234"
    [change]="12">
  </app-statistics-card>
  
  <app-glass-input
    label="Email"
    type="email"
    placeholder="Enter email"
    [required]="true">
  </app-glass-input>
  
  <app-glass-button variant="primary" (clicked)="handleSubmit()">
    Submit
  </app-glass-button>
</app-glass-card>
```

---

## 💡 Best Practices

### 1. Component Usage
- ✅ ใช้ Glass Morphism components สำหรับ UI ที่ต้องการ modern look
- ✅ ใช้ PageLayoutComponent เป็น wrapper สำหรับทุกหน้า
- ✅ ใช้ EmptyStateComponent เมื่อไม่มีข้อมูล
- ✅ ใช้ LoadingComponent สำหรับ async operations

### 2. Styling
- ✅ ใช้ Tailwind utility classes แทน custom SCSS เมื่อเป็นไปได้
- ✅ ใช้ CSS variables สำหรับ theme colors
- ✅ ใช้ Dark mode classes (`dark:`) สำหรับ dark mode styles

### 3. Performance
- ✅ ใช้ lazy loading สำหรับ routes
- ✅ ใช้ OnPush change detection strategy
- ✅ หลีกเลี่ยง inline styles และ functions ใน templates

### 4. Accessibility
- ✅ ใช้ semantic HTML
- ✅ เพิ่ม ARIA labels เมื่อจำเป็น
- ✅ รองรับ keyboard navigation
- ✅ ใช้ proper color contrast

---

## 🔧 Troubleshooting

### ปัญหา: Component ไม่แสดงผล
**แก้ไข:**
- ตรวจสอบว่า import component ใน module แล้ว
- ตรวจสอบว่า component เป็น standalone และถูก import ถูกต้อง

### ปัญหา: Styles ไม่ทำงาน
**แก้ไข:**
- ตรวจสอบว่า Tailwind CSS ถูก compile แล้ว
- ตรวจสอบว่า dark mode class ถูก apply ที่ html/body
- ตรวจสอบว่า styles.scss ถูก import ใน angular.json

### ปัญหา: Fonts ไม่แสดง
**แก้ไข:**
- ตรวจสอบว่า Google Fonts ถูก import ใน index.html
- ตรวจสอบว่า font-family ถูกตั้งค่าใน tailwind.config.js

### ปัญหา: Bundle size เกิน budget
**แก้ไข:**
- ปรับ budget limits ใน angular.json
- ใช้ lazy loading สำหรับ routes
- ตรวจสอบ dependencies ที่ไม่จำเป็น

---

## 📚 เอกสารที่เกี่ยวข้อง

- [GLASS_MORPHISM_COMPONENTS_ANALYSIS.md](./GLASS_MORPHISM_COMPONENTS_ANALYSIS.md) - การวิเคราะห์ Glass Morphism Components
- [SHARED_COMPONENTS_SUMMARY.md](./SHARED_COMPONENTS_SUMMARY.md) - สรุป Shared Components
- [CONFIG_UPDATE_SUMMARY.md](./CONFIG_UPDATE_SUMMARY.md) - สรุปการอัปเดต Configuration
- [TAILWIND_SETUP.md](./TAILWIND_SETUP.md) - Tailwind CSS Setup Guide
- [GLASSMORPHISM_TEMPLATE_GUIDE.md](./GLASSMORPHISM_TEMPLATE_GUIDE.md) - Glass Morphism Template Guide

---

## ✅ Checklist

### Components
- [x] Glass Card Component
- [x] Glass Button Component
- [x] Glass Input Component
- [x] Empty State Component
- [x] Loading Component
- [x] Statistics Card Component
- [x] Tabs Component
- [x] Progress Bar Component
- [x] Rating Component
- [x] Tooltip Component
- [x] Modal Component
- [x] Page Layout Component

### Configuration
- [x] Tailwind Config อัปเดต
- [x] Styles อัปเดต
- [x] Package.json อัปเดต
- [x] Angular.json Budget อัปเดต
- [x] Index.html อัปเดต

### Documentation
- [x] Template Guide
- [x] Components Summary
- [x] Configuration Summary
- [x] Demo Page

---

## 🔄 Next Steps

1. **เพิ่ม Components:**
   - Data Table Component
   - Calendar Component
   - Chart Component
   - File Upload Component
   - Date Picker Component

2. **Improvements:**
   - เพิ่ม Animation effects
   - เพิ่ม Accessibility features
   - เพิ่ม Unit tests
   - เพิ่ม Storybook documentation

3. **Optimization:**
   - Code splitting
   - Tree shaking
   - Bundle optimization
   - Performance monitoring

---

**อัปเดตล่าสุด**: 2024-12-19  
**Maintainer**: Development Team


