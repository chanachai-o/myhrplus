# 📸 Demo Screenshots & GIFs Guide

คู่มือสำหรับเพิ่ม screenshots และ GIFs สำหรับ demo components

## 📋 Overview

Screenshots และ GIFs ช่วยให้ผู้ใช้เข้าใจการทำงานของ components ได้ดีขึ้น โดยเฉพาะสำหรับ:
- Interactive components
- Complex animations
- State changes
- Responsive behavior

## 🎯 Components ที่ควรมี Screenshots/GIFs

### Priority 1 (High Priority)
1. **Glass Card** - แสดง variants และ animations
2. **Modal** - แสดงการเปิด/ปิด และ sizes
3. **Tabs** - แสดงการเปลี่ยน tabs
4. **Progress Bar** - แสดง animated progress
5. **Rating** - แสดงการคลิกและ hover effects

### Priority 2 (Medium Priority)
6. **Glass Button** - แสดง states และ variants
7. **Glass Input** - แสดง validation states
8. **Loading** - แสดง loading animation
9. **Notification** - แสดงการแสดงผลและ auto-close
10. **Tooltip** - แสดง positions และ hover effects

### Priority 3 (Low Priority)
11. **Empty State** - แสดง different states
12. **Statistics Card** - แสดง change indicators
13. **Theme Toggle** - แสดง theme switching

## 📁 Directory Structure

```
src/assets/demo/
├── screenshots/
│   ├── glass-card/
│   │   ├── default-variant.png
│   │   ├── strong-variant.png
│   │   ├── weak-variant.png
│   │   └── animations.gif
│   ├── modal/
│   │   ├── basic-modal.png
│   │   ├── sizes-comparison.png
│   │   └── open-close.gif
│   └── ...
└── gifs/
    ├── progress-bar-animation.gif
    ├── rating-interaction.gif
    └── ...
```

## 🎬 Creating Screenshots

### Tools
- **Browser DevTools**: ใช้สำหรับ capture screenshots
- **Screen Recording**: OBS, ShareX, หรือ built-in screen recorder
- **Image Editing**: GIMP, Photoshop, หรือ online tools

### Best Practices
1. **Resolution**: ใช้ความละเอียดสูง (1920x1080 หรือสูงกว่า)
2. **Background**: ใช้ background ที่สะอาด ไม่รบกวน
3. **Consistency**: ใช้ขนาดและสไตล์เดียวกันทุก screenshot
4. **File Naming**: ใช้ชื่อไฟล์ที่ชัดเจน เช่น `glass-card-default-variant.png`

## 🎥 Creating GIFs

### Tools
- **ScreenToGif**: สำหรับ Windows
- **GIPHY Capture**: สำหรับ Mac
- **LICEcap**: Cross-platform
- **Online Tools**: ezgif.com, gifmaker.me

### Best Practices
1. **Duration**: 3-5 วินาที สำหรับ simple interactions
2. **Loop**: ตั้งให้ loop อัตโนมัติ
3. **File Size**: พยายามให้ไฟล์ไม่ใหญ่เกินไป (< 2MB)
4. **Frame Rate**: 15-30 fps สำหรับ smooth animation

## 📝 Implementation

### Adding Screenshots to Demo Components

```html
<!-- In demo component HTML -->
<section class="demo-section">
  <h2 class="section-title">Visual Examples</h2>
  
  <div class="screenshots-grid">
    <div class="screenshot-item">
      <img 
        src="assets/demo/screenshots/glass-card/default-variant.png" 
        alt="Glass Card Default Variant"
        class="screenshot-image">
      <p class="screenshot-caption">Default Variant</p>
    </div>
    <!-- More screenshots -->
  </div>
</section>
```

### Adding GIFs to Demo Components

```html
<section class="demo-section">
  <h2 class="section-title">Animation Demo</h2>
  
  <div class="gif-container">
    <img 
      src="assets/demo/gifs/progress-bar-animation.gif" 
      alt="Progress Bar Animation"
      class="demo-gif">
    <p class="gif-caption">Animated progress bar example</p>
  </div>
</section>
```

## 🎨 Styling Screenshots/GIFs

```scss
.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-6;
}

.screenshot-item {
  @include glass-morphism('default', 'light');
  border-radius: $radius-lg;
  overflow: hidden;
  padding: $spacing-4;
}

.screenshot-image {
  width: 100%;
  height: auto;
  border-radius: $radius-md;
  box-shadow: $shadow-lg;
}

.screenshot-caption {
  margin-top: $spacing-2;
  text-align: center;
  font-size: $text-sm;
  color: $gray-600;
}

.gif-container {
  text-align: center;
  margin: $spacing-6 0;
}

.demo-gif {
  max-width: 100%;
  height: auto;
  border-radius: $radius-lg;
  box-shadow: $shadow-xl;
}
```

## 📋 Checklist

### สำหรับแต่ละ Component
- [ ] Screenshot ของ default state
- [ ] Screenshot ของ variants (ถ้ามี)
- [ ] GIF ของ interactive behavior
- [ ] Screenshot ของ responsive behavior (mobile/tablet/desktop)
- [ ] Screenshot ของ dark mode (ถ้ามี)
- [ ] Screenshot ของ Gemini theme (ถ้ามี)

## 🔄 Update Process

1. **Capture**: ใช้ screen capture tool
2. **Edit**: ตัดแต่งและปรับขนาด
3. **Optimize**: ลดขนาดไฟล์แต่รักษาคุณภาพ
4. **Save**: บันทึกใน `src/assets/demo/`
5. **Reference**: เพิ่มใน demo component HTML
6. **Document**: อัปเดต documentation

## 💡 Tips

1. **Use Consistent Browser**: ใช้ browser เดียวกันทุกครั้ง
2. **Window Size**: ใช้ window size ที่สม่ำเสมอ
3. **Theme**: ระบุ theme ที่ใช้ (light/dark/gemini)
4. **Annotations**: เพิ่ม annotations ถ้าจำเป็น
5. **Alt Text**: ใส่ alt text ที่ชัดเจนสำหรับ accessibility

## 🚀 Quick Start

1. สร้าง directory `src/assets/demo/screenshots/` และ `src/assets/demo/gifs/`
2. Capture screenshots/GIFs ตาม checklist
3. เพิ่มใน demo component HTML
4. Test responsive และ accessibility

## 📚 Resources

- [Screen Capture Tools](https://www.techradar.com/best/screen-capture-software)
- [GIF Creation Tools](https://www.makeuseof.com/tag/best-gif-creator-tools/)
- [Image Optimization](https://imageoptim.com/)


