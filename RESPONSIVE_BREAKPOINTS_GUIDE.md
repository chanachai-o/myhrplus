# 📱 Responsive Breakpoints Guide

**วันที่สร้าง**: 2024-12-19  
**สถานะ**: Complete ✅

---

## 📋 Overview

ระบบใช้ responsive breakpoints ที่สอดคล้องกันระหว่าง:
- **Design Tokens** (`src/styles/_design-tokens.scss`)
- **Tailwind CSS** (`tailwind.config.js`)
- **SCSS Mixins** (`src/styles/_mixins.scss`)

---

## 🎯 Breakpoints

### Breakpoint Values

| Breakpoint | Value | Device Type | Usage |
|------------|-------|-------------|-------|
| `xs` | `0px` | Extra small devices | Phones (portrait) |
| `sm` | `640px` | Small devices | Phones (landscape), Small tablets |
| `md` | `768px` | Medium devices | Tablets, Small laptops |
| `lg` | `1024px` | Large devices | Desktops, Laptops |
| `xl` | `1280px` | Extra large devices | Large desktops |
| `2xl` | `1536px` | 2X Extra large devices | Larger desktops, 4K displays |

---

## 📁 Implementation

### 1. Design Tokens (`src/styles/_design-tokens.scss`)

```scss
/* Breakpoints */
$breakpoint-xs: 0;
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;

/* Breakpoint Map */
$breakpoints: (
  xs: $breakpoint-xs,
  sm: $breakpoint-sm,
  md: $breakpoint-md,
  lg: $breakpoint-lg,
  xl: $breakpoint-xl,
  '2xl': $breakpoint-2xl
);
```

### 2. Tailwind Config (`tailwind.config.js`)

```javascript
theme: {
  screens: {
    'xs': '0px',      // Extra small devices (phones)
    'sm': '640px',    // Small devices (tablets)
    'md': '768px',    // Medium devices (small laptops)
    'lg': '1024px',   // Large devices (desktops)
    'xl': '1280px',   // Extra large devices (large desktops)
    '2xl': '1536px',  // 2X Extra large devices (larger desktops)
  },
  // ...
}
```

### 3. SCSS Mixins (`src/styles/_mixins.scss`)

```scss
/* Mobile First Approach */
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    $breakpoint-value: map-get($breakpoints, $breakpoint);
    @media (min-width: $breakpoint-value) {
      @content;
    }
  } @else {
    @warn "Unknown breakpoint: #{$breakpoint}";
  }
}

/* Desktop First Approach */
@mixin respond-to-down($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    $breakpoint-value: map-get($breakpoints, $breakpoint);
    @media (max-width: $breakpoint-value - 1px) {
      @content;
    }
  } @else {
    @warn "Unknown breakpoint: #{$breakpoint}";
  }
}

/* Between Breakpoints */
@mixin respond-to-between($min, $max) {
  $min-value: map-get($breakpoints, $min);
  $max-value: map-get($breakpoints, $max);
  @media (min-width: $min-value) and (max-width: $max-value - 1px) {
    @content;
  }
}
```

---

## 💡 Usage Examples

### In SCSS Files (Using Mixins)

```scss
/* Mobile First - Apply styles from sm breakpoint and up */
@include respond-to(sm) {
  .container {
    padding: $spacing-4;
  }
}

/* Desktop First - Apply styles below md breakpoint */
@include respond-to-down(md) {
  .container {
    padding: $spacing-2;
  }
}

/* Between Breakpoints */
@include respond-to-between(sm, lg) {
  .container {
    max-width: 1200px;
  }
}
```

### In HTML/Template Files (Using Tailwind Classes)

```html
<!-- Responsive padding -->
<div class="p-2 sm:p-4 md:p-6 lg:p-8">
  Content
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  <!-- Items -->
</div>

<!-- Responsive text size -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Title
</h1>

<!-- Responsive display -->
<div class="hidden md:block">
  Desktop only content
</div>
```

### In TypeScript/Component Files

```typescript
// Using Tailwind responsive classes
@Component({
  template: `
    <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      Responsive width
    </div>
  `
})
```

---

## 🎨 Common Responsive Patterns

### 1. Mobile-First Approach (Recommended)

```scss
// Base styles for mobile
.component {
  padding: $spacing-2;
  font-size: $text-sm;
}

// Tablet and up
@include respond-to(md) {
  .component {
    padding: $spacing-4;
    font-size: $text-base;
  }
}

// Desktop and up
@include respond-to(lg) {
  .component {
    padding: $spacing-6;
    font-size: $text-lg;
  }
}
```

### 2. Desktop-First Approach

```scss
// Base styles for desktop
.component {
  padding: $spacing-6;
  font-size: $text-lg;
}

// Below desktop
@include respond-to-down(lg) {
  .component {
    padding: $spacing-4;
    font-size: $text-base;
  }
}

// Below tablet
@include respond-to-down(md) {
  .component {
    padding: $spacing-2;
    font-size: $text-sm;
  }
}
```

### 3. Container Queries (Future Enhancement)

```scss
// When container is wider than 600px
@container (min-width: 600px) {
  .component {
    // Styles
  }
}
```

---

## ✅ Testing Breakpoints

### Manual Testing

1. **Chrome DevTools**
   - Open DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Test different device sizes

2. **Responsive Design Mode**
   - Test at exact breakpoint values:
     - 640px (sm)
     - 768px (md)
     - 1024px (lg)
     - 1280px (xl)
     - 1536px (2xl)

### Automated Testing (Future)

```typescript
// Example: Visual regression testing
describe('Responsive Breakpoints', () => {
  it('should render correctly at sm breakpoint', () => {
    // Test at 640px
  });
  
  it('should render correctly at md breakpoint', () => {
    // Test at 768px
  });
});
```

---

## 📊 Breakpoint Usage in Components

### Components Using Responsive Styles

1. **glass-card.component.scss**
   - Responsive border radius

2. **page-layout.component.scss**
   - Responsive header layout
   - Responsive title sizes

3. **statistics-grid.component.scss**
   - Responsive grid columns

4. **theme-toggle.component.scss**
   - Responsive menu widths

5. **notification.component.scss**
   - Responsive positioning

---

## 🔧 Best Practices

### 1. Mobile-First Design
- ✅ Start with mobile styles
- ✅ Add styles for larger screens progressively
- ✅ Use `respond-to()` mixin for mobile-first

### 2. Consistent Spacing
- ✅ Use design tokens for spacing
- ✅ Scale spacing proportionally across breakpoints

### 3. Typography Scaling
- ✅ Use relative units (rem, em)
- ✅ Scale font sizes appropriately

### 4. Performance
- ✅ Use CSS containment where possible
- ✅ Avoid unnecessary media queries
- ✅ Use `will-change` sparingly

### 5. Accessibility
- ✅ Ensure touch targets are at least 44x44px on mobile
- ✅ Test with screen readers at all breakpoints
- ✅ Maintain readable font sizes

---

## 🚀 Future Enhancements

1. **Container Queries**
   - Support for container-based responsive design
   - More flexible component-level responsiveness

2. **Custom Breakpoints**
   - Component-specific breakpoints
   - Content-driven breakpoints

3. **Responsive Typography**
   - Fluid typography with clamp()
   - Better scaling across devices

4. **Performance Optimization**
   - Critical CSS extraction
   - Lazy loading of responsive styles

---

## 📚 Related Documents

- [Design Tokens](./src/styles/_design-tokens.scss)
- [Mixins](./src/styles/_mixins.scss)
- [Tailwind Config](./tailwind.config.js)
- [UX/UI Improvement Plan](./UX_UI_COMPONENTS_IMPROVEMENT_PLAN.md)

---

**Last Updated**: 2024-12-19  
**Status**: Complete ✅  
**Version**: 1.0.0

