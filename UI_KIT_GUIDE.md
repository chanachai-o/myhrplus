# UI Component Kit Guide

**อัปเดตล่าสุด**: 2024-12-19  
**เวอร์ชัน**: 2.0.0

## 🎨 Overview
UI Kit page ที่แสดงตัวอย่างการใช้งาน Components, Directives, และ Pipes ทั้งหมดในระบบ พร้อม Glassmorphism, Dark Mode, และ **Gemini 1.5 Theme** support

## 📍 Access
เข้าถึงได้ที่: `/ui-kit` (ต้อง login ก่อน)

## 📦 Components ที่แสดงใน UI Kit

### 1. Glass Cards
- **Glass Card** - Basic glass card
- **Glass Card Strong** - Stronger glass effect
- **Glass Card Weak** - Weaker glass effect

### 2. Buttons
- **Material Buttons**
  - Raised Button
  - Stroked Button
  - Flat Button
  - Icon Button
  - FAB (Floating Action Button)
  - Mini FAB
- **Glass Buttons**
  - Basic glass button
  - Primary glass button
- **Button States**
  - Disabled
  - Loading

### 3. Form Controls
- **Text Inputs**
  - Username field
  - Email field
  - Password field
- **Textarea**
  - Multi-line text input
- **Select**
  - Dropdown selection
- **Date Picker**
  - Date selection
- **Checkbox**
  - Single checkbox
  - Multiple checkboxes
- **Radio Buttons**
  - Radio group selection

### 4. Data Table
- **Features**
  - Sorting
  - Pagination
  - Filtering
  - Actions (Edit/Delete)
- **Example Data**
  - 5 sample records
  - Thai names and data

### 5. File Upload
- **Single File Upload**
  - PDF, DOC, DOCX files
  - Max size: 5MB
- **Multiple Files Upload**
  - Image files
  - Max size: 10MB
- **Features**
  - File list display
  - File size display
  - Remove file option

### 6. Chips & Badges
- **Chips**
  - Removable chips
  - Custom chip list
- **Badges**
  - Notification badges
  - Different colors

### 7. Tabs
- **Material Tabs**
  - 3 example tabs
  - Tab content display

### 8. Dialogs
- **Confirm Dialog**
  - Confirmation messages
  - Custom buttons

### 9. Snackbars / Notifications
- **Success** - Green notification
- **Error** - Red notification
- **Warning** - Orange notification
- **Info** - Blue notification

### 10. Loading Indicators
- **Spinner**
  - Different sizes (40, 60, 80)
  - Different colors
- **Progress Bar**
  - Indeterminate
  - Determinate
  - Buffer
- **Global Loading**
  - Full-screen overlay

### 11. Expansion Panels
- **Accordion**
  - 3 example panels
  - Collapsible content

### 12. Pipes
- **DateFormat Pipe**
  - `short` format
  - `long` format
  - `time` format
  - `datetime` format

### 13. Tooltips
- **Positions**
  - Above
  - Below
  - Left
  - Right

### 14. Material Icons
- **Icon Gallery**
  - Common icons display
  - Icon names

### 15. Color Palette
- **Primary Colors**
  - Shades 50-900
- **Theme Colors**
  - Blue, Purple, Green, Orange

### 16. Typography
- **Headings**
  - H1, H2, H3, H4
- **Body Text**
  - Base, Small
- **Code Text**
  - Monospace font

### 17. Spacing & Layout
- **Padding Examples**
  - p-1 to p-6
- **Grid Layout**
  - Responsive grid

## 🎯 Features

### Dark Mode Support
ทุก component รองรับ dark mode:
- ใช้ `dark:` prefix สำหรับ Tailwind classes
- CSS variables สำหรับ colors
- Smooth transitions

### Theme Colors
- เปลี่ยนสีธีมได้ผ่าน Theme Toggle
- Primary color เปลี่ยนตาม theme
- Background gradients เปลี่ยนตาม theme
- **Gemini 1.5 Theme** - ธีมสีฟ้าเข้มพร้อม gradient effects และ animations

### Gemini 1.5 Theme Features
- Gradient text effects (ฟ้าอ่อน→ฟ้าเข้ม)
- Animated border glows
- Vector particles และ patterns
- Enhanced shadows พร้อม blue tints
- Smooth animations (float, pulse, shimmer, wave)

### Glassmorphism
- Glass cards ในทุก section
- Backdrop blur effects
- Transparent backgrounds

### Responsive Design
- Mobile-friendly
- Tablet layout
- Desktop layout

## 📝 Code Examples

### Using Glass Card
```html
<div class="glass-card p-6">
  <h2 class="thai-text font-bold">Title</h2>
  <p>Content</p>
</div>
```

### Using Data Table
```html
<app-data-table
  [columns]="columns"
  [data]="data"
  [pageSize]="10"
  [showActions]="true"
  (actionClick)="onAction($event)">
</app-data-table>
```

### Using File Upload
```html
<app-file-upload
  accept=".pdf,.doc"
  [multiple]="false"
  [maxSize]="5 * 1024 * 1024"
  (fileSelected)="onFileSelected($event)"
  (error)="onError($event)">
</app-file-upload>
```

### Using Confirm Dialog
```typescript
const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  data: {
    title: 'ยืนยัน',
    message: 'คุณแน่ใจหรือไม่?',
    confirmText: 'ยืนยัน',
    cancelText: 'ยกเลิก'
  }
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    // User confirmed
  }
});
```

### Using Snackbar
```typescript
this.snackBar.open('ข้อความ', 'ปิด', {
  duration: 3000,
  panelClass: ['snackbar-success']
});
```

### Using Loading Service
```typescript
this.loadingService.show();
// Do something
this.loadingService.hide();
```

## 🎨 Styling Guidelines

### Glass Cards
- ใช้ `glass-card` สำหรับเนื้อหาทั่วไป
- ใช้ `glass-card-strong` สำหรับ forms และ dialogs
- ใช้ `glass-card-weak` สำหรับ subtle elements

### Colors
- ใช้ `text-slate-800` สำหรับ headings (light mode)
- ใช้ `text-slate-100` สำหรับ headings (dark mode)
- ใช้ `text-slate-600` สำหรับ body text (light mode)
- ใช้ `text-slate-400` สำหรับ body text (dark mode)

### Spacing
- ใช้ `p-6` สำหรับ cards
- ใช้ `space-y-4` หรือ `space-y-6` สำหรับ vertical spacing
- ใช้ `gap-3` หรือ `gap-4` สำหรับ flex/grid spacing

## 🔧 Customization

### Add New Component Example
1. เพิ่ม section ใหม่ใน `ui-kit.component.html`
2. ใช้ `glass-card` หรือ `glass-card-strong` สำหรับ container
3. เพิ่ม dark mode classes
4. ใช้ Thai text สำหรับ labels

### Component Props
ดู component documentation ใน:
- `data-table.component.ts`
- `file-upload.component.ts`
- `confirm-dialog.component.ts`
- `loading-spinner.component.ts`

## 📚 Related Documentation
- `GLASSMORPHISM_TEMPLATE_GUIDE.md` - Glassmorphism guide
- `DARK_MODE_THEME_GUIDE.md` - Dark mode guide
- `STYLE_TEMPLATE_SUMMARY.md` - Style summary

## 🎉 Usage

1. Login เข้าระบบ
2. ไปที่ `/ui-kit`
3. ดูตัวอย่างการใช้งานทุก component
4. ทดสอบ dark mode และ theme colors
5. Copy code examples ไปใช้ใน components ของคุณ

## 📝 Notes

- UI Kit page ใช้สำหรับ reference และ testing
- ทุก component รองรับ dark mode
- ทุก component ใช้ Glassmorphism style
- ใช้ Thai text สำหรับ labels
- Responsive design สำหรับทุกขนาดหน้าจอ


