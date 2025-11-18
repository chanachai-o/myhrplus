# Glassmorphism Template Guide

## 🎨 Overview
Template สไตล์ Glassmorphism สำหรับ Angular HR System ที่ทันสมัย สะอาดตา และมีมิติ

## 📦 Installation

### 1. ติดตั้ง Tailwind CSS และ Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
```

### 2. สร้างไฟล์ Configuration
ไฟล์ที่สร้างแล้ว:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

### 3. อัปเดต styles.scss
ไฟล์ `src/styles.scss` ได้ถูกอัปเดตแล้วพร้อม:
- Google Fonts imports (Inter, Sarabun, JetBrains Mono)
- Tailwind directives
- Glassmorphism components
- Material Design overrides

## 🎯 Core Concepts

### 1. Aesthetic Principles
- **Modern**: ใช้เทคนิค Glassmorphism และ Gradient backgrounds
- **Clean**: Layout ที่สะอาดตา ไม่รกตา
- **Secure**: สีและสไตล์ที่สื่อถึงความปลอดภัย
- **Intelligent**: UI ที่ใช้งานง่ายและมีประสิทธิภาพ

### 2. Glassmorphism Style
ใช้เทคนิค Glassmorphism เพื่อสร้างความรู้สึกที่ล้ำสมัย:
- Background: `rgba(255, 255, 255, 0.25)` with `backdrop-filter: blur(10px)`
- Border: `rgba(255, 255, 255, 0.3)`
- Shadow: `0 8px 32px 0 rgba(31, 38, 135, 0.37)`

### 3. Background Gradient
```scss
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
// หรือใช้ Tailwind class:
bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
```

## 📝 Typography

### Font Families

#### 1. Inter (UI & English)
```scss
font-family: 'Inter', sans-serif;
```
- ใช้สำหรับ: Headings, UI elements, English text
- Weights: 300, 400, 500, 600, 700, 800

#### 2. Sarabun (Thai)
```scss
font-family: 'Sarabun', sans-serif;
```
- ใช้สำหรับ: ข้อความภาษาไทยทั้งหมด
- Weights: 300, 400, 500, 600, 700, 800
- Class: `.thai-text`

#### 3. JetBrains Mono (Code)
```scss
font-family: 'JetBrains Mono', monospace;
```
- ใช้สำหรับ: Code, API keys, JSON, Logs
- Class: `.font-mono`

## 🎨 Reusable Components

### Glass Cards

#### Basic Glass Card
```html
<div class="glass-card p-6">
  <!-- Content -->
</div>
```

#### Strong Glass Card (More opaque)
```html
<div class="glass-card-strong p-6">
  <!-- Content -->
</div>
```

#### Weak Glass Card (More transparent)
```html
<div class="glass-card-weak p-6">
  <!-- Content -->
</div>
```

### Glass Buttons
```html
<button class="glass-button">
  Click Me
</button>
```

### Glass Inputs
```html
<input type="text" class="glass-input" placeholder="Enter text...">
```

### Glass Navigation
```html
<nav class="glass-nav">
  <!-- Navigation items -->
</nav>
```

## 🎭 Animation Classes

### Fade In
```html
<div class="animate-fade-in">
  <!-- Content -->
</div>
```

### Slide Up
```html
<div class="animate-slide-up">
  <!-- Content -->
</div>
```

### Slide Down
```html
<div class="animate-slide-down">
  <!-- Content -->
</div>
```

### Scale In
```html
<div class="animate-scale-in">
  <!-- Content -->
</div>
```

## 🎨 Color Palette

### Primary Colors
- `primary-50` to `primary-900`: Blue scale
- Default: `primary-500` (#3b82f6)

### Glass Colors
- `glass-white`: `rgba(255, 255, 255, 0.25)`
- `glass-white-strong`: `rgba(255, 255, 255, 0.4)`
- `glass-white-weak`: `rgba(255, 255, 255, 0.1)`

### Text Colors
- `text-slate-800`: Headings
- `text-slate-700`: Body text
- `text-slate-600`: Secondary text
- `text-slate-500`: Muted text

## 📐 Layout Components

### Main Layout
```html
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  <!-- Content with glass cards -->
</div>
```

### Content Container
```html
<main class="main-content animate-fade-in">
  <div class="glass-card p-6 animate-slide-up">
    <router-outlet></router-outlet>
  </div>
</main>
```

## 🎯 Material Design Integration

### Form Fields
Material form fields ได้รับการปรับแต่งให้ใช้ Glassmorphism:
- Background: `rgba(255, 255, 255, 0.2)`
- Backdrop blur: `blur(6px)`
- Border: `rgba(255, 255, 255, 0.3)`
- Focus: Blue glow effect

### Cards
Material cards ใช้ Glassmorphism:
- Background: `rgba(255, 255, 255, 0.25)`
- Backdrop blur: `blur(10px)`
- Border: `rgba(255, 255, 255, 0.3)`
- Shadow: Glass shadow

### Dialogs
Material dialogs ใช้ Glassmorphism:
- Background: `rgba(255, 255, 255, 0.3)`
- Backdrop blur: `blur(16px)`
- Border: `rgba(255, 255, 255, 0.4)`
- Shadow: Strong glass shadow

## 📱 Responsive Design

### Mobile (< 768px)
- Glass cards: Smaller border radius
- Padding: Reduced
- Font sizes: Adjusted

### Desktop (>= 768px)
- Full glassmorphism effects
- Larger spacing
- Full animations

## 🎨 Custom Scrollbar

Scrollbar ได้รับการปรับแต่งให้เข้ากับ Glassmorphism:
- Track: `rgba(255, 255, 255, 0.1)` with blur
- Thumb: `rgba(255, 255, 255, 0.3)` with blur
- Hover: `rgba(255, 255, 255, 0.5)`

## 🚀 Usage Examples

### Example 1: Dashboard Card
```html
<div class="glass-card p-6 animate-fade-in">
  <h2 class="thai-text font-bold text-xl text-slate-800 mb-4">แดชบอร์ด</h2>
  <p class="text-slate-600">เนื้อหา...</p>
</div>
```

### Example 2: Form Card
```html
<div class="glass-card-strong p-8 animate-scale-in">
  <h1 class="thai-text font-bold text-2xl text-slate-800 mb-6">แบบฟอร์ม</h1>
  <form class="space-y-4">
    <!-- Form fields -->
  </form>
</div>
```

### Example 3: Data Table Container
```html
<div class="glass-card p-4">
  <mat-table>
    <!-- Table content -->
  </mat-table>
</div>
```

## 🎯 Best Practices

### 1. Background
- ใช้ gradient background เสมอ
- หลีกเลี่ยง solid colors

### 2. Glass Cards
- ใช้ `glass-card` สำหรับเนื้อหาทั่วไป
- ใช้ `glass-card-strong` สำหรับ forms และ dialogs
- ใช้ `glass-card-weak` สำหรับ subtle elements

### 3. Typography
- ใช้ `.thai-text` สำหรับข้อความภาษาไทย
- ใช้ `font-mono` สำหรับ code และ technical text
- ใช้ Inter สำหรับ headings และ English text

### 4. Animations
- ใช้ animations อย่างพอดี ไม่มากเกินไป
- ใช้ `animate-fade-in` สำหรับ page load
- ใช้ `animate-slide-up` สำหรับ cards
- ใช้ `animate-scale-in` สำหรับ dialogs

### 5. Spacing
- ใช้ Tailwind spacing utilities
- `p-4` to `p-8` สำหรับ cards
- `space-y-4` to `space-y-6` สำหรับ forms

## 🔧 Customization

### Change Background Gradient
ใน `styles.scss`:
```scss
body {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Change Glass Opacity
ใน `tailwind.config.js`:
```js
colors: {
  glass: {
    white: 'rgba(255, 255, 255, 0.25)', // Change opacity here
  }
}
```

### Add Custom Glass Component
ใน `styles.scss`:
```scss
@layer components {
  .glass-custom {
    @apply bg-white/30 backdrop-blur-lg rounded-2xl border border-white/40 shadow-glass;
  }
}
```

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Glassmorphism Design Guide](https://www.figma.com/community/file/894435801714405671)
- [Inter Font](https://rsms.me/inter/)
- [Sarabun Font](https://fonts.google.com/specimen/Sarabun)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

## 🎉 Ready to Use!

Template พร้อมใช้งานแล้ว! เริ่มสร้าง components ด้วย Glassmorphism style ได้เลย


