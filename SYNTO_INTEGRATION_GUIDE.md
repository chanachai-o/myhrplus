# Synto-Angular Integration Guide

## สรุปการติดตั้งและใช้งาน

เอกสารนี้สรุปการติดตั้งและใช้งาน packages, components, และ directives จาก Synto-Angular ที่ได้ถูก integrate เข้าโปรเจ็ค myHR-STD แล้ว

---

## 📦 Packages ที่ติดตั้งแล้ว

### High Priority Packages

#### 1. **sweetalert2** ⭐⭐⭐
- **Version**: ^11.26.3
- **การใช้งาน**: Alert/Dialog ที่สวยงามกว่า alert() แบบเดิม
- **ตัวอย่างการใช้งาน**:
```typescript
import Swal from 'sweetalert2';

// Success Alert
Swal.fire({
  title: 'สำเร็จ!',
  text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
  icon: 'success',
  confirmButtonText: 'ตกลง'
});

// Confirmation Dialog
Swal.fire({
  title: 'ยืนยันการลบ',
  text: 'คุณแน่ใจหรือไม่?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'ลบ',
  cancelButtonText: 'ยกเลิก'
}).then((result) => {
  if (result.isConfirmed) {
    // Handle delete
  }
});
```

#### 2. **ngx-bar-rating** ⭐⭐⭐
- **Version**: ^6.0.0
- **การใช้งาน**: Component สำหรับแสดง rating (ดาว)
- **Module**: `BarRatingModule` (imported ใน `SharedModule`)
- **ตัวอย่างการใช้งาน**:
```html
<bar-rating
  [(rate)]="rating"
  [max]="5"
  [readOnly]="false"
  [showText]="true"
  (rateChange)="onRatingChange($event)">
</bar-rating>
```

#### 3. **@ng-select/ng-select** ⭐⭐⭐
- **Version**: ^11.2.0
- **การใช้งาน**: Select dropdown ที่ดีกว่า native select
- **Module**: `NgSelectModule` (imported ใน `SharedModule`)
- **ตัวอย่างการใช้งาน**:
```html
<ng-select
  [(ngModel)]="selectedItem"
  [items]="items"
  [searchable]="true"
  [clearable]="true"
  placeholder="เลือก..."
  (change)="onChange($event)">
</ng-select>
```

#### 4. **ngx-daterangepicker-material** ⭐⭐⭐
- **Version**: ^6.0.4
- **การใช้งาน**: Date range picker
- **Module**: `NgxDaterangepickerMdModule` (imported ใน `SharedModule`)
- **ตัวอย่างการใช้งาน**:
```html
<input
  ngxDaterangepickerMd
  [(ngModel)]="dateRange"
  [locale]="locale"
  [ranges]="ranges"
  placeholder="เลือกช่วงวันที่"
  class="form-control" />
```

#### 5. **ng-apexcharts** ⭐⭐⭐
- **Version**: ^2.0.3
- **การใช้งาน**: ApexCharts integration
- **Module**: `NgApexchartsModule` (imported ใน `SharedModule`)
- **ตัวอย่างการใช้งาน**:
```html
<apx-chart
  [series]="chartOptions.series"
  [chart]="chartOptions.chart"
  [xaxis]="chartOptions.xaxis"
  [title]="chartOptions.title">
</apx-chart>
```

### Medium Priority Packages

#### 6. **ngx-colors** ⭐⭐
- **Version**: ^3.6.0
- **การใช้งาน**: Color picker component
- **Module**: `NgxColorsModule` (imported ใน `SharedModule`)

#### 7. **ngx-drag-drop** ⭐⭐
- **Version**: ^20.0.1
- **การใช้งาน**: Drag and drop functionality
- **Module**: `NgxDragDropModule` (imported ใน `SharedModule`)

#### 8. **ngx-dropzone** ⭐⭐
- **Version**: ^3.1.0
- **การใช้งาน**: File upload component แบบ drag & drop
- **Module**: `NgxDropzoneModule` (imported ใน `SharedModule`)
- **หมายเหตุ**: มี `ngx-filepond` อยู่แล้ว แต่ `ngx-dropzone` มี UI ที่แตกต่าง

#### 9. **ngx-echarts** ⭐⭐
- **Version**: ^20.0.2
- **การใช้งาน**: ECharts integration
- **Module**: `NgxEchartsModule` (imported ใน `SharedModule`)
- **หมายเหตุ**: Syncfusion Charts ครอบคลุมอยู่แล้ว แต่ ECharts มี chart types เพิ่มเติม

#### 10. **@asymmetrik/ngx-leaflet** ⭐⭐
- **Version**: ^16.0.1
- **การใช้งาน**: Leaflet maps integration
- **Module**: ต้อง import `LeafletModule` ใน component ที่ใช้

#### 11. **ngx-mat-timepicker** ⭐⭐
- **Version**: ^20.0.1
- **การใช้งาน**: Time picker component
- **หมายเหตุ**: Syncfusion มี DatePicker ที่รองรับ time แต่ component นี้เฉพาะเจาะจงกว่า

#### 12. **@angular-slider/ngx-slider** ⭐⭐
- **Version**: ^2.0.4
- **การใช้งาน**: Range slider component
- **Module**: ต้อง import `NgxSliderModule` ใน component ที่ใช้

#### 13. **ng-circle-progress** ⭐⭐
- **Version**: ^1.7.1
- **การใช้งาน**: Circular progress indicator
- **Module**: `NgCircleProgressModule` (imported ใน `SharedModule`)

#### 14. **ng-gallery** ⭐⭐
- **Version**: ^12.0.0
- **การใช้งาน**: Image gallery with lightbox
- **Module**: `GalleryModule` (imported ใน `SharedModule`)

#### 15. **swiper** ⭐⭐
- **Version**: ^12.0.3
- **การใช้งาน**: Modern carousel/slider
- **Module**: `SwiperModule` (imported ใน `SharedModule`)

#### 16. **animate.css** ⭐⭐
- **Version**: ^4.1.1
- **การใช้งาน**: CSS animation library
- **หมายเหตุ**: Imported ใน `angular.json`

---

## 🧩 Components ที่สร้างใหม่

### 1. **BackToTopComponent** ⭐⭐⭐
- **Location**: `src/app/shared/components/back-to-top/`
- **การใช้งาน**: ปุ่ม scroll to top
- **ตัวอย่างการใช้งาน**:
```html
<app-back-to-top></app-back-to-top>
```
- **Features**:
  - แสดงเมื่อ scroll ลงมากกว่า 400px
  - Glassmorphism styling
  - Smooth scroll animation
  - Dark mode support

### 2. **LoaderComponent** ⭐⭐⭐
- **Location**: `src/app/shared/components/loading/`
- **สถานะ**: มีอยู่แล้วในโปรเจ็ค
- **การใช้งาน**:
```html
<app-loading [show]="isLoading" message="กำลังโหลดข้อมูล..."></app-loading>
```

---

## 🎯 Directives ที่สร้างใหม่

### 1. **FullscreenDirective** ⭐⭐⭐
- **Location**: `src/app/shared/directives/fullscreen.directive.ts`
- **การใช้งาน**: Toggle fullscreen mode
- **ตัวอย่างการใช้งาน**:
```html
<button appFullscreen>Toggle Fullscreen</button>
```
- **Features**:
  - รองรับ browser หลายตัว (Chrome, Firefox, Safari, IE/Edge)
  - Toggle fullscreen on click

---

## 📝 Module Configuration

### SharedModule
ไฟล์ `src/app/shared/shared.module.ts` ได้ถูกอัปเดตให้ include modules ต่อไปนี้:

```typescript
imports: [
  // ... existing imports
  NgSelectModule,
  BarRatingModule,
  NgApexchartsModule,
  NgxDaterangepickerMdModule,
  NgxColorsModule,
  NgxDragDropModule,
  NgxDropzoneModule,
  NgxEchartsModule,
  NgCircleProgressModule,
  GalleryModule,
  SwiperModule
],
exports: [
  // ... existing exports
  NgSelectModule,
  BarRatingModule,
  NgApexchartsModule,
  // ... etc
]
```

---

## 🎨 Styles Configuration

### styles.scss
ไฟล์ `src/styles.scss` ได้ถูกอัปเดตให้ include styles ต่อไปนี้:

```scss
/* NgSelect Styles */
@import '~@ng-select/ng-select/themes/default.theme.css';

/* Bar Rating Styles */
@import '~ngx-bar-rating/themes/br-default-theme.css';

/* Swiper Styles */
@import 'swiper/scss';
@import 'swiper/scss/navigation';
@import 'swiper/scss/pagination';

/* Leaflet Styles */
@import '~leaflet/dist/leaflet.css';
```

### angular.json
ไฟล์ `angular.json` ได้ถูกอัปเดตให้ include:

```json
"styles": [
  "src/styles.scss",
  "node_modules/animate.css/animate.min.css"
]
```

---

## 📚 Usage Examples

### Example 1: Using SweetAlert2
```typescript
import Swal from 'sweetalert2';

// In your component
deleteItem(id: number): void {
  Swal.fire({
    title: 'ยืนยันการลบ',
    text: 'คุณแน่ใจหรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed) {
      this.itemService.delete(id).subscribe({
        next: () => {
          Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว', 'success');
          this.loadData();
        },
        error: () => {
          Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้', 'error');
        }
      });
    }
  });
}
```

### Example 2: Using NgSelect with Search
```html
<ng-select
  [(ngModel)]="selectedEmployee"
  [items]="employees"
  [searchable]="true"
  [clearable]="true"
  [multiple]="false"
  bindLabel="name"
  bindValue="id"
  placeholder="เลือกพนักงาน"
  (change)="onEmployeeChange($event)">
  <ng-option *ngFor="let emp of employees" [value]="emp.id">
    {{ emp.name }} - {{ emp.department }}
  </ng-option>
</ng-select>
```

### Example 3: Using ApexCharts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <apx-chart
      [series]="chartOptions.series"
      [chart]="chartOptions.chart"
      [xaxis]="chartOptions.xaxis"
      [title]="chartOptions.title"
      [colors]="chartOptions.colors">
    </apx-chart>
  `
})
export class DashboardComponent {
  chartOptions = {
    series: [{
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }],
    chart: {
      height: 350,
      type: 'line'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    },
    title: {
      text: 'Monthly Sales'
    },
    colors: ['#3b82f6']
  };
}
```

### Example 4: Using BackToTopComponent
```html
<!-- In your main layout or app component -->
<app-back-to-top></app-back-to-top>
```

### Example 5: Using FullscreenDirective
```html
<button appFullscreen class="btn btn-primary">
  <i class="ri-fullscreen-line"></i> Fullscreen
</button>
```

---

## ⚠️ หมายเหตุสำคัญ

1. **Peer Dependencies**: บาง packages ใช้ `--legacy-peer-deps` ในการติดตั้ง เนื่องจากมี peer dependency conflicts กับ Angular 17

2. **Module Imports**: Modules ทั้งหมดถูก import ใน `SharedModule` แล้ว ดังนั้นคุณสามารถใช้ได้ทันทีใน components ที่ import `SharedModule`

3. **Styles**: บาง styles ถูก import ใน `styles.scss` และบางตัวถูก import ใน `angular.json` ตาม best practices

4. **Browser Compatibility**: FullscreenDirective รองรับ browser หลายตัว แต่ควรทดสอบใน browser ที่ใช้จริง

5. **Performance**: เมื่อใช้ charts libraries หลายตัว (ApexCharts, ECharts, Syncfusion) ควรพิจารณา bundle size และเลือกใช้เฉพาะที่จำเป็น

---

## 🔗 Links และ Resources

- [SweetAlert2 Documentation](https://sweetalert2.github.io/)
- [NgSelect Documentation](https://ng-select.github.io/ng-select)
- [ApexCharts Documentation](https://apexcharts.com/)
- [Ngx-Bar-Rating Documentation](https://github.com/brtnshrdr/ngx-bar-rating)
- [Ngx-Daterangepicker Documentation](https://github.com/fetrarij/ngx-daterangepicker-material)
- [Swiper Documentation](https://swiperjs.com/)

---

## 📋 Checklist สำหรับการใช้งาน

- [x] ติดตั้ง High Priority packages
- [x] ติดตั้ง Medium Priority packages
- [x] สร้าง BackToTopComponent
- [x] สร้าง FullscreenDirective
- [x] Configure modules ใน SharedModule
- [x] Update styles.scss
- [x] Update angular.json
- [ ] ทดสอบการใช้งานแต่ละ component
- [ ] สร้าง usage examples ในโปรเจ็คจริง
- [ ] Update documentation เมื่อมีการใช้งานจริง

---

**Last Updated**: 2024-11-19
**Version**: 1.0.0







