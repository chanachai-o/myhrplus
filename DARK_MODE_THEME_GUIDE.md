# Dark Mode & Theme Customization Guide

## 🎨 Overview
Template รองรับ Dark Mode และการเปลี่ยนสี Theme อย่างสมบูรณ์ พร้อม Glassmorphism effects ในทุกโหมด

## ✨ Features

### 1. Dark Mode Support
- ✅ Light Mode (โหมดสว่าง)
- ✅ Dark Mode (โหมดมืด)
- ✅ Auto Mode (อัตโนมัติตามระบบ)

### 2. Theme Colors
รองรับ 8 สีธีม:
- 🔵 Blue (น้ำเงิน) - Default
- 🟣 Indigo (คราม)
- 🟣 Purple (ม่วง)
- 🟢 Green (เขียว)
- 🟠 Orange (ส้ม)
- 🔴 Red (แดง)
- 🔵 Teal (เทาเขียว)
- 🩷 Pink (ชมพู)

### 3. Components ที่รองรับ
- ✅ Header (พร้อม Logo)
- ✅ Sidebar
- ✅ Footer
- ✅ Main Layout
- ✅ Glass Cards
- ✅ Material Components
- ✅ Forms & Inputs
- ✅ Buttons
- ✅ Tables
- ✅ Dialogs
- ✅ Snackbars

## 🚀 Usage

### Theme Service

```typescript
import { ThemeService } from './core/services/theme.service';

constructor(private themeService: ThemeService) {}

// Set theme mode
this.themeService.setMode('dark'); // 'light' | 'dark' | 'auto'

// Set theme color
this.themeService.setColor('purple'); // 'blue' | 'indigo' | 'purple' | etc.

// Toggle mode
this.themeService.toggleMode();

// Get current theme
const theme = this.themeService.getCurrentTheme();

// Subscribe to theme changes
this.themeService.theme$.subscribe(theme => {
  console.log('Current theme:', theme);
});
```

### Theme Toggle Component

```html
<!-- Add to any component -->
<app-theme-toggle></app-theme-toggle>
```

Component นี้จะแสดง:
- ปุ่มเปลี่ยนโหมด (Light/Dark/Auto)
- ปุ่มเลือกสีธีม (8 สี)

## 🎨 CSS Variables

### Primary Color
```css
--primary-rgb: 59, 130, 246; /* RGB format */
```

ใช้ใน CSS:
```css
color: rgb(var(--primary-rgb));
background: rgba(var(--primary-rgb), 0.2);
border-color: rgba(var(--primary-rgb), 0.5);
```

## 📝 Dark Mode Classes

### Tailwind Dark Mode
ใช้ `dark:` prefix สำหรับ dark mode styles:

```html
<div class="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
  Content
</div>
```

### Custom Dark Mode Classes
```scss
.dark .my-class {
  // Dark mode styles
}
```

## 🎯 Background Gradients

### Light Mode
- Default: `from-slate-50 via-blue-50 to-indigo-50`
- Blue: `from-blue-50 via-blue-100 to-blue-200`
- Indigo: `from-indigo-50 via-indigo-100 to-indigo-200`
- และอื่นๆ...

### Dark Mode
- Default: `from-slate-900 via-slate-800 to-slate-900`
- Blue: `from-blue-900 via-blue-800 to-blue-900`
- Indigo: `from-indigo-900 via-indigo-800 to-indigo-900`
- และอื่นๆ...

## 🔧 Customization

### Change Default Theme
ใน `theme.service.ts`:
```typescript
private readonly DEFAULT_THEME: ThemeConfig = {
  mode: 'light', // Change default mode
  color: 'blue', // Change default color
  primaryColor: '59, 130, 246' // Change default RGB
};
```

### Add Custom Theme Color
1. เพิ่มใน `tailwind.config.js`:
```js
backgroundImage: {
  'gradient-custom-light': 'linear-gradient(...)',
  'gradient-custom-dark': 'linear-gradient(...)',
}
```

2. เพิ่มใน `styles.scss`:
```scss
body.theme-custom {
  background: linear-gradient(...);
}

.dark body.theme-custom {
  background: linear-gradient(...);
}
```

3. เพิ่มใน `theme.service.ts`:
```typescript
const colorMap: Record<ThemeColor, string> = {
  // ... existing colors
  custom: '255, 0, 0', // RGB
};
```

## 📱 Responsive Dark Mode

Dark mode ทำงานได้ดีในทุกขนาดหน้าจอ:
- Mobile: ✅
- Tablet: ✅
- Desktop: ✅

## 🎭 Glassmorphism in Dark Mode

Glass cards ใน dark mode ใช้:
- Background: `rgba(15, 23, 42, 0.25)` (slate-900)
- Border: `rgba(51, 65, 85, 0.3)` (slate-700)
- Shadow: Dark shadows

## 🔄 Transitions

ทุก component มี smooth transitions:
```scss
transition: all 0.3s ease;
```

## 📚 Examples

### Glass Card with Dark Mode
```html
<div class="glass-card dark:!bg-slate-900/25 dark:border-slate-700/30 p-6">
  <h2 class="text-slate-800 dark:text-slate-100">Title</h2>
  <p class="text-slate-600 dark:text-slate-400">Content</p>
</div>
```

### Button with Theme Color
```html
<button class="bg-[rgb(var(--primary-rgb))] text-white">
  Click Me
</button>
```

### Form Field with Dark Mode
```html
<mat-form-field>
  <input matInput class="glass-input dark:!bg-slate-800/20">
</mat-form-field>
```

## 🎨 Logo Styling

Logo ใน header รองรับ theme colors:
```html
<div class="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700">
  <mat-icon>business_center</mat-icon>
</div>
```

## 💾 Persistence

Theme settings ถูกบันทึกใน localStorage:
- Key: `hr-theme-config`
- Format: JSON
- Auto-load on app start

## 🐛 Troubleshooting

### Theme ไม่เปลี่ยน
1. ตรวจสอบว่า `ThemeService` ถูก inject แล้ว
2. ตรวจสอบว่า `app.component.ts` initialize theme service
3. ตรวจสอบ localStorage

### Dark mode ไม่ทำงาน
1. ตรวจสอบว่า `darkMode: 'class'` ใน `tailwind.config.js`
2. ตรวจสอบว่า class `dark` ถูกเพิ่มใน `html` element
3. ตรวจสอบ CSS transitions

### Colors ไม่เปลี่ยน
1. ตรวจสอบ CSS variable `--primary-rgb`
2. ตรวจสอบว่าใช้ `rgb(var(--primary-rgb))` ใน CSS
3. ตรวจสอบ theme color mapping

## 📖 API Reference

### ThemeService Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `setMode(mode)` | Set theme mode | `'light' \| 'dark' \| 'auto'` |
| `setColor(color)` | Set theme color | `ThemeColor` |
| `setPrimaryColor(rgb)` | Set custom RGB | `string` (format: "r, g, b") |
| `toggleMode()` | Toggle light/dark | - |
| `getCurrentTheme()` | Get current theme | - |
| `isDarkMode()` | Check if dark mode | - |
| `resetTheme()` | Reset to default | - |
| `watchSystemPreference()` | Watch system changes | - |

### ThemeService Observables

| Observable | Description | Type |
|------------|-------------|------|
| `theme$` | Current theme config | `Observable<ThemeConfig>` |
| `isDarkMode$` | Dark mode status | `Observable<boolean>` |

## 🎉 Ready to Use!

Template พร้อมใช้งาน Dark Mode และ Theme Customization แล้ว! 🚀


