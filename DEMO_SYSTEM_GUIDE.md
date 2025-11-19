# 🎬 Demo System Guide

**อัปเดตล่าสุด**: 2024-12-20  
**เวอร์ชัน**: 2.1.0

---

## 📋 ภาพรวม

Demo System เป็นระบบแสดงตัวอย่างการใช้งาน components ทั้งหมด (32 components) พร้อม:
- ✅ Live Interactive Demos
- ✅ Code Examples พร้อม syntax highlighting
- ✅ API Documentation (Props tables)
- ✅ Multiple Usage Examples
- ✅ Responsive Design
- ✅ Dark Mode & Gemini Theme Support

---

## 🚀 Quick Start

### Access Demo
```
URL: http://localhost:4200/demo
```

### Navigation
1. ไปที่ `/demo` เพื่อดู component index
2. คลิกที่ component ที่ต้องการดู demo
3. ทดสอบ live demo และดู code examples
4. อ่าน API documentation สำหรับ props และ events

---

## 📁 Structure

```
src/app/features/demo/
├── demo.component.ts              # Main demo container
├── demo-routing.module.ts         # Demo routes
├── demo.module.ts                 # Demo module
├── demo-index/
│   ├── demo-index.component.ts    # Component index page
│   ├── demo-index.component.html
│   └── demo-index.component.scss
├── components/
│   ├── glass-card-demo/
│   ├── glass-button-demo/
│   ├── glass-input-demo/
│   ├── icon-demo/
│   ├── avatar-demo/
│   └── ... (32 demo components)
└── shared/
    ├── code-viewer/
    │   ├── code-viewer.component.ts
    │   ├── code-viewer.component.html
    │   └── code-viewer.component.scss
    └── props-table/
        ├── props-table.component.ts
        ├── props-table.component.html
        └── props-table.component.scss
```

---

## 🧩 Demo Components

### Glass Components (3)
1. **Glass Card** - Variants, animations, custom classes
2. **Glass Button** - Variants, sizes, states, events
3. **Glass Input** - Types, validation, states

### UI Components (29)
4. **Icon** - Sizes, colors, common icons
5. **Avatar** - Sizes, status, badges, shapes
6. **Spinner** - Sizes, colors, with message
7. **Theme Toggle** - Mode switching, color picker
8. **Status Badge** - All status types, variants, sizes
9. **Page Layout** - Breadcrumbs, actions, header
10. **Error State** - Error types, retry functionality
11. **Breadcrumbs** - With icons, custom separator
12. **Data Table** - Sorting, filtering, pagination
13. **Stepper** - Horizontal, vertical, optional steps
14. **Timeline** - Vertical, horizontal, with status
15. **Search Filter** - Debounced search, filters
16. **Date Range Picker** - Presets, validation
17. **File Upload** - Single, multiple, validation
18. **Image Upload** - Single, multiple, preview
19. **Form Validation Messages** - Error messages
20. **Confirm Dialog** - Confirmation dialogs
21. **Skeleton Loader** - Types, animations
22. **Loading Spinner** - Service integration
23. **Modal** - Sizes, events, customization
24. **Tabs** - Badges, disabled states
25. **Progress Bar** - Variants, animated
26. **Rating** - Star/Heart, readonly
27. **Loading** - With message, conditional
28. **Empty State** - Icons, sizes, actions
29. **Notification** - All types (success/error/warning/info)
30. **Tooltip** - All positions
31. **Statistics Card** - Change indicators
32. **Statistics Grid** - Grid layouts

---

## 🎯 Features

### 1. Live Demo Sections
ทุก component มี live demo ที่สามารถทดสอบได้จริง:
- Interactive controls
- Real-time updates
- State management examples

### 2. Code Examples
- Basic usage examples
- Advanced usage examples
- Reactive forms integration
- Event handling examples
- Customization examples

### 3. API Documentation
- Props tables with types
- Input/Output documentation
- Required/Optional indicators
- Default values
- Descriptions

### 4. Multiple Examples
- Different variants
- Different sizes
- Different states
- Different configurations

---

## 🛠️ Shared Components

### CodeViewer Component
Component สำหรับแสดง code examples พร้อม syntax highlighting

**Usage:**
```html
<app-code-viewer
  [code]="codeExample"
  language="html"
  title="Code Example">
</app-code-viewer>
```

**Props:**
- `code: string` - Code content
- `language: string` - Language (html, typescript, scss)
- `title: string` - Code title

### PropsTable Component
Component สำหรับแสดง API documentation

**Usage:**
```html
<app-props-table
  [props]="props"
  title="Inputs">
</app-props-table>
```

**Props:**
- `props: PropDefinition[]` - Props array
- `title: string` - Table title

**PropDefinition Interface:**
```typescript
interface PropDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
  required: boolean;
}
```

---

## 📝 Demo Component Template

### Structure
ทุก demo component ควรมี structure ดังนี้:

```typescript
@Component({
  selector: 'app-component-demo',
  standalone: true,
  imports: [CommonModule, SharedModule, ...],
  templateUrl: './component-demo.component.html',
  styleUrls: ['./component-demo.component.scss']
})
export class ComponentDemoComponent {
  // Props for API documentation
  props: PropDefinition[] = [...];
  
  // Code examples
  basicExample = `...`;
  advancedExample = `...`;
  
  // Demo data
  demoData = {...};
}
```

### Template Structure
```html
<div class="demo-page">
  <!-- Header -->
  <div class="demo-header">
    <h1 class="demo-title">Component Name</h1>
    <p class="demo-description">Description</p>
  </div>

  <!-- Live Demo -->
  <section class="demo-section">
    <h2 class="section-title">Live Demo</h2>
    <!-- Demo content -->
  </section>

  <!-- Examples -->
  <section class="demo-section">
    <h2 class="section-title">Examples</h2>
    <!-- Multiple examples -->
  </section>

  <!-- Code Examples -->
  <section class="demo-section">
    <h2 class="section-title">Code Examples</h2>
    <app-code-viewer [code]="basicExample" ...></app-code-viewer>
  </section>

  <!-- API Documentation -->
  <section class="demo-section">
    <h2 class="section-title">API Documentation</h2>
    <app-props-table [props]="props"></app-props-table>
  </section>
</div>
```

---

## 🎨 Styling

### Demo Page Styles
ทุก demo component ใช้ styles ที่สอดคล้องกัน:
- Responsive design
- Dark mode support
- Gemini theme support
- Consistent spacing และ typography

### SCSS Structure
```scss
@import '../../../../../styles/design-tokens';
@import '../../../../../styles/mixins';

.demo-page {
  width: 100%;
  padding: $spacing-6 0;
}

.demo-header {
  margin-bottom: $spacing-8;
}

.demo-title {
  font-size: $text-3xl;
  font-weight: $font-weight-bold;
  // ...
}

// Dark mode
.dark {
  // ...
}

// Gemini theme
body.theme-gemini {
  // ...
}
```

---

## 📚 Related Documentation

- [COMPONENTS_INDEX.md](./COMPONENTS_INDEX.md) - Components reference
- [TEMPLATE_AND_COMPONENTS_GUIDE.md](./TEMPLATE_AND_COMPONENTS_GUIDE.md) - Components guide
- [DEMO_SCREENSHOTS_GUIDE.md](./DEMO_SCREENSHOTS_GUIDE.md) - Screenshots guide

---

## ✅ Checklist

### สำหรับ Demo Component ใหม่
- [ ] สร้าง component files (ts, html, scss)
- [ ] เพิ่ม route ใน demo-routing.module.ts
- [ ] เพิ่ม live demo section
- [ ] เพิ่ม multiple examples
- [ ] เพิ่ม code examples
- [ ] เพิ่ม API documentation (props table)
- [ ] ทดสอบ responsive design
- [ ] ทดสอบ dark mode
- [ ] ทดสอบ Gemini theme
- [ ] อัพเดท demo-index component

---

**Maintainer**: Development Team  
**Last Updated**: 2024-12-20  
**Version**: 2.1.0


