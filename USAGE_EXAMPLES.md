# ตัวอย่างการใช้งาน Components, Services และ Packages ที่เพิ่มมา

## 📋 สารบัญ

1. [Toast Notifications (ngx-toastr)](#toast-notifications)
2. [Theme Switcher Component](#theme-switcher-component)
3. [Page Header Component](#page-header-component)
4. [Content Layout Component](#content-layout-component)
5. [NavService](#navservice)
6. [Simplebar (Custom Scrollbar)](#simplebar)
7. [Icons (Tabler, Bootstrap, Boxicons)](#icons)
8. [Custom Tailwind Classes](#custom-tailwind-classes)

---

## 🍞 Toast Notifications

### การใช้งานพื้นฐาน

```typescript
import { ToastrService } from 'ngx-toastr';

export class MyComponent {
  constructor(private toastr: ToastrService) {}

  showSuccess() {
    this.toastr.success('บันทึกข้อมูลสำเร็จ', 'สำเร็จ');
  }

  showError() {
    this.toastr.error('เกิดข้อผิดพลาด', 'ข้อผิดพลาด');
  }

  showWarning() {
    this.toastr.warning('กรุณาตรวจสอบข้อมูล', 'คำเตือน');
  }

  showInfo() {
    this.toastr.info('มีข้อมูลใหม่', 'ข้อมูล');
  }
}
```

### การใช้งานใน Error Interceptor

Error Interceptor ใช้ ToastrService แล้วอัตโนมัติ:
- 401 Unauthorized → Error toast
- 403 Forbidden → Warning toast
- 500+ Server Error → Error toast
- Other errors → Error toast

### การใช้งานใน Component

```typescript
// ใน home.component.ts
this.toastr.success('โหลดข้อมูลสำเร็จ', 'สำเร็จ');
this.toastr.error('ไม่สามารถโหลดข้อมูลได้', 'ข้อผิดพลาด');
```

---

## 🎨 Theme Switcher Component

### การใช้งานใน Header

```html
<!-- ใน header.component.html -->
<button (click)="toggleThemeSwitcher()">
  <i class="ti ti-palette"></i>
</button>

<div *ngIf="showThemeSwitcher" class="absolute top-full right-4 mt-2 z-50">
  <app-theme-switcher></app-theme-switcher>
</div>
```

### การใช้งานแบบ Standalone

```html
<!-- ใช้ในหน้า Settings หรือ Preferences -->
<app-theme-switcher></app-theme-switcher>
```

### Features
- Toggle between Light/Dark/Auto mode
- Change theme colors (8 colors available)
- Reset to default theme
- Integration with existing ThemeService

---

## 📄 Page Header Component

### การใช้งานพื้นฐาน

```html
<app-page-header
  title="Dashboard"
  subtitle="Overview"
  description="Welcome to your dashboard"
  [showBreadcrumbs]="true">
</app-page-header>
```

### การใช้งานพร้อม Actions

```typescript
export class MyComponent {
  pageActions = [
    {
      label: 'เพิ่มใหม่',
      icon: 'ti ti-plus',
      onClick: () => this.addNew(),
      class: 'glass-button-primary'
    },
    {
      label: 'ส่งออก',
      icon: 'ti ti-download',
      onClick: () => this.export(),
      class: 'glass-button'
    }
  ];
}
```

```html
<app-page-header
  title="จัดการพนักงาน"
  subtitle="Employee Management"
  [actions]="pageActions">
</app-page-header>
```

### ตัวอย่างการใช้งานจริง

**ใน home.component.html:**
```html
<app-page-header
  title="หน้าแรก"
  subtitle="Dashboard"
  description="ยินดีต้อนรับสู่ระบบบริหารทรัพยากรบุคคล">
</app-page-header>
```

---

## 🏗️ Content Layout Component

### การใช้งาน

```html
<!-- ใช้แทน MainLayoutComponent ในบางกรณี -->
<app-content-layout></app-content-layout>
```

### Features
- Header, Sidebar, Footer integration
- Simplebar custom scrollbar
- Responsive overlay for mobile
- Auto-close sidebar on route change

### ตัวอย่างการใช้งานใน Routing

```typescript
// ใน routing module
{
  path: 'content',
  component: ContentLayoutComponent,
  children: [
    { path: 'page1', component: Page1Component },
    { path: 'page2', component: Page2Component }
  ]
}
```

---

## 📱 NavService

### การใช้งาน Screen Width Tracking

```typescript
import { NavService } from './core/services/nav.service';

export class MyComponent implements OnInit {
  screenWidth$ = this.navService.screenWidth;
  
  constructor(private navService: NavService) {}
  
  ngOnInit() {
    // Subscribe to screen width changes
    this.screenWidth$.subscribe(width => {
      console.log('Screen width:', width);
    });
  }
}
```

### การตรวจสอบ Device Type

```typescript
if (this.navService.isMobile()) {
  // Mobile specific code
  console.log('Mobile device');
}

if (this.navService.isTablet()) {
  // Tablet specific code
  console.log('Tablet device');
}

if (this.navService.isDesktop()) {
  // Desktop specific code
  console.log('Desktop device');
}
```

### การจัดการ Sidebar

```typescript
// Toggle sidebar
this.navService.toggleSidebar();

// Close sidebar
this.navService.closeSidebar();

// Open sidebar
this.navService.openSidebar();

// Check sidebar state
if (this.navService.collapseSidebar) {
  // Sidebar is collapsed
}
```

### การใช้งานใน Component

```typescript
// ใน content-layout.component.ts
ngOnInit(): void {
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      if (this.navService.isMobile()) {
        this.navService.closeSidebar();
      }
    });
}
```

---

## 📜 Simplebar (Custom Scrollbar)

### การใช้งานพื้นฐาน

```html
<ngx-simplebar class="h-full max-h-screen">
  <div class="p-4">
    <!-- Your scrollable content -->
    <div *ngFor="let item of items">
      {{ item }}
    </div>
  </div>
</ngx-simplebar>
```

### การใช้งานใน ContentLayoutComponent

```html
<!-- ใน content-layout.component.html -->
<div class="main-content flex-1">
  <ngx-simplebar class="h-full">
    <div class="content-wrapper p-4 md:p-6">
      <router-outlet></router-outlet>
    </div>
  </ngx-simplebar>
</div>
```

### Custom Styling

```scss
// ใน component.scss
.simplebar-scrollbar::before {
  @apply bg-slate-400/50 dark:bg-slate-600/50;
}

.simplebar-track.simplebar-vertical {
  @apply w-2;
}
```

---

## 🎯 Icons

### Tabler Icons

```html
<!-- ใช้ class ti ti-icon-name -->
<i class="ti ti-home"></i>
<i class="ti ti-user"></i>
<i class="ti ti-settings"></i>
<i class="ti ti-bell"></i>
<i class="ti ti-search"></i>
<i class="ti ti-palette"></i>
<i class="ti ti-download"></i>
<i class="ti ti-upload"></i>
```

### Bootstrap Icons

```html
<!-- ใช้ class bi bi-icon-name -->
<i class="bi bi-house"></i>
<i class="bi bi-person-circle"></i>
<i class="bi bi-gear-fill"></i>
<i class="bi bi-bell"></i>
<i class="bi bi-search"></i>
```

### Boxicons

```html
<!-- ใช้ class bx bx-icon-name -->
<i class="bx bx-home"></i>
<i class="bx bx-user"></i>
<i class="bx bx-cog"></i>
<i class="bx bx-bell"></i>
<i class="bx bx-search"></i>
```

### ตัวอย่างการใช้งานใน Components

```html
<!-- ใน header -->
<button>
  <i class="ti ti-bell"></i>
</button>

<!-- ใน buttons -->
<button class="glass-button-primary">
  <i class="ti ti-plus"></i>
  <span>เพิ่มใหม่</span>
</button>

<!-- ใน cards -->
<div class="flex items-center gap-2">
  <i class="ti ti-user text-primary-500"></i>
  <span>ผู้ใช้</span>
</div>
```

---

## 🎨 Custom Tailwind Classes

### Custom Colors

```html
<!-- ใช้ custom colors -->
<div class="bg-secondary text-white">Secondary</div>
<div class="bg-success text-white">Success</div>
<div class="bg-warning text-white">Warning</div>
<div class="bg-danger text-white">Danger</div>
<div class="bg-orange text-white">Orange</div>
<div class="bg-pink text-white">Pink</div>
<div class="bg-teal text-white">Teal</div>
<div class="bg-purple text-white">Purple</div>
```

### Custom Animations

```html
<!-- ใช้ custom animations -->
<div class="animate-particles">Particles Animation</div>
<div class="animate-bell">Bell Animation</div>
<div class="animate-wase">Wave Animation</div>
<div class="animate-spin-slow">Slow Spin</div>
<div class="animate-slow-ping">Slow Ping</div>
```

### Custom Shadows

```html
<div class="shadow-defaultshadow">Default Shadow</div>
```

### Custom Gradients

```html
<div class="bg-gradient-to-r from-instagram">Instagram Gradient</div>
<div class="bg-gradient-radial">Radial Gradient</div>
<div class="bg-gradient-1">Custom Gradient 1</div>
```

---

## 📝 ตัวอย่างการใช้งานแบบครบถ้วน

### ตัวอย่าง Component ที่ใช้ทุกอย่าง

```typescript
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NavService } from '../core/services/nav.service';

@Component({
  selector: 'app-example',
  template: `
    <app-page-header
      title="ตัวอย่าง"
      subtitle="Example Page"
      [actions]="pageActions">
    </app-page-header>

    <div class="container mx-auto p-4">
      <ngx-simplebar class="h-96">
        <div class="space-y-4">
          <div *ngFor="let item of items" class="glass-card p-4">
            <div class="flex items-center gap-2">
              <i class="ti ti-check text-success"></i>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </ngx-simplebar>

      <div class="mt-4 flex gap-2">
        <button 
          class="glass-button-primary"
          (click)="showSuccess()">
          <i class="ti ti-check"></i>
          Success
        </button>
        <button 
          class="glass-button"
          (click)="showError()">
          <i class="ti ti-x"></i>
          Error
        </button>
      </div>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  items = ['Item 1', 'Item 2', 'Item 3'];
  
  pageActions = [
    {
      label: 'เพิ่ม',
      icon: 'ti ti-plus',
      onClick: () => this.addItem(),
      class: 'glass-button-primary'
    }
  ];

  constructor(
    private toastr: ToastrService,
    public navService: NavService
  ) {}

  ngOnInit() {
    // Track screen width
    this.navService.screenWidth.subscribe(width => {
      console.log('Width:', width);
    });
  }

  showSuccess() {
    this.toastr.success('สำเร็จ!', 'Success');
  }

  showError() {
    this.toastr.error('เกิดข้อผิดพลาด', 'Error');
  }

  addItem() {
    this.items.push(`Item ${this.items.length + 1}`);
    this.toastr.info('เพิ่มรายการแล้ว', 'Info');
  }
}
```

---

## 🔧 Tips & Best Practices

### 1. Toast Notifications
- ใช้ `success` สำหรับการกระทำที่สำเร็จ
- ใช้ `error` สำหรับข้อผิดพลาด
- ใช้ `warning` สำหรับคำเตือน
- ใช้ `info` สำหรับข้อมูลทั่วไป
- ตั้งค่า timeout ที่เหมาะสม (3-5 วินาที)

### 2. Theme Switcher
- ใช้ในหน้า Settings หรือ Preferences
- สามารถแสดงใน Header เป็น dropdown
- เก็บค่า theme ใน localStorage อัตโนมัติ

### 3. Page Header
- ใช้ในทุกหน้า content
- เพิ่ม breadcrumbs สำหรับ navigation
- ใช้ actions สำหรับ quick actions

### 4. NavService
- ใช้สำหรับ responsive design
- Track screen width สำหรับ conditional rendering
- ใช้สำหรับ sidebar management

### 5. Simplebar
- ใช้ในพื้นที่ที่มี content ยาว
- ใช้ใน modal หรือ drawer
- Customize styling ตาม design system

### 6. Icons
- Tabler Icons: ใช้สำหรับ modern UI
- Bootstrap Icons: ใช้สำหรับ familiar icons
- Boxicons: ใช้สำหรับ variety
- Material Icons: ใช้สำหรับ existing components

---

## 📚 เอกสารเพิ่มเติม

- [ngx-toastr Documentation](https://www.npmjs.com/package/ngx-toastr)
- [Simplebar Documentation](https://github.com/Grsmto/simplebar)
- [Tabler Icons](https://tabler-icons.io/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Boxicons](https://boxicons.com/)
- [Preline UI Documentation](https://preline.co/docs/index.html)

---

*อัปเดตล่าสุด: 2024*

