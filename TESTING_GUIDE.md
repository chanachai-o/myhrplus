# Testing Guide - Angular HR System

## 🚀 การรัน Angular Application

### 1. ตรวจสอบ Prerequisites
```bash
# ตรวจสอบ Node.js version (ควรเป็น 18.x หรือสูงกว่า)
node --version

# ตรวจสอบ npm version
npm --version

# ตรวจสอบ Angular CLI
ng version
```

### 2. ติดตั้ง Dependencies (ถ้ายังไม่ได้ติดตั้ง)
```bash
cd angular-hr-migration
npm install
```

### 3. รัน Development Server
```bash
npm start
# หรือ
ng serve
```

### 4. เปิด Browser
- URL: `http://localhost:4200`
- Dev server จะ auto-reload เมื่อมีการเปลี่ยนแปลงไฟล์

### 5. ตรวจสอบหน้าจอต่างๆ

#### หน้าหลัก
- **Login Page**: `http://localhost:4200/auth/login`
  - ตรวจสอบ Glassmorphism UI
  - ตรวจสอบ Dark Mode toggle
  - ตรวจสอบ Theme color selector

#### UI Kit Page (ต้อง login ก่อน)
- **UI Kit**: `http://localhost:4200/ui-kit`
  - ตรวจสอบ Priority 0 Components:
    - Empty State
    - Error State
    - Avatar
    - Status Badge
    - Search/Filter
  - ตรวจสอบ Priority 1 Components:
    - Breadcrumbs
    - Stepper/Wizard
    - Timeline
    - Date Range Picker
    - Skeleton Loader

#### Dashboard
- **Dashboard**: `http://localhost:4200/dashboard`
  - ตรวจสอบ layout
  - ตรวจสอบ sidebar navigation
  - ตรวจสอบ header

## 🎨 ตรวจสอบ Features

### Dark Mode & Theme
1. เปิด Header
2. คลิก Theme Toggle button
3. ตรวจสอบการเปลี่ยนระหว่าง Light/Dark/Auto
4. คลิก Theme Color selector
5. ตรวจสอบการเปลี่ยนสีธีม (8 สี)

### Components Testing
1. ไปที่ `/ui-kit`
2. ทดสอบแต่ละ component:
   - คลิก buttons
   - กรอก forms
   - เปลี่ยน tabs
   - เปิด dialogs
   - ทดสอบ search/filter
   - ทดสอบ date range picker

## 🐛 Troubleshooting

### Port 4200 ถูกใช้แล้ว
```bash
# ใช้ port อื่น
ng serve --port 4201
```

### Build Errors
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install

# หรือใน Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### TypeScript Errors
```bash
# ตรวจสอบ TypeScript version
npm list typescript

# อัปเดต TypeScript
npm install typescript@latest --save-dev
```

### Tailwind CSS ไม่ทำงาน
```bash
# ตรวจสอบ tailwind.config.js
# ตรวจสอบว่า styles.scss มี @tailwind directives
```

## 📝 Checklist การทดสอบ

### ✅ UI Components
- [ ] Empty State - แสดงเมื่อไม่มีข้อมูล
- [ ] Error State - แสดงข้อผิดพลาด
- [ ] Avatar - แสดงรูปโปรไฟล์
- [ ] Status Badge - แสดงสถานะ
- [ ] Search/Filter - ค้นหาและกรอง
- [ ] Breadcrumbs - แสดงเส้นทาง
- [ ] Stepper - แสดงขั้นตอน
- [ ] Timeline - แสดงไทม์ไลน์
- [ ] Date Range Picker - เลือกช่วงวันที่
- [ ] Skeleton Loader - แสดง loading state

### ✅ Dark Mode
- [ ] Light mode ทำงาน
- [ ] Dark mode ทำงาน
- [ ] Auto mode ทำงาน (ตาม system preference)
- [ ] Theme colors เปลี่ยนได้ (8 สี)

### ✅ Responsive Design
- [ ] Desktop view
- [ ] Tablet view
- [ ] Mobile view

### ✅ Navigation
- [ ] Sidebar menu
- [ ] Header navigation
- [ ] Breadcrumbs navigation
- [ ] Route guards

## 🔍 Browser Console

เปิด Browser DevTools (F12) และตรวจสอบ:
- Console errors
- Network requests
- Performance
- Accessibility

## 📊 Performance Testing

```bash
# Build production
ng build --configuration production

# ตรวจสอบ bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/hr-angular-app/stats.json
```

## 🎯 Next Steps

หลังจากทดสอบแล้ว:
1. แก้ไข bugs ที่พบ
2. ปรับปรุง UI/UX
3. เพิ่ม components ตาม Priority 2
4. ทดสอบ integration กับ backend API


