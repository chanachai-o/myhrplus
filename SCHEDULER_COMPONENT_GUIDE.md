# 📆 Scheduler Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-scheduler`  
**Library**: Syncfusion Schedule

---

## 📋 สารบัญ

1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Styling](#styling)

---

## 🎯 Overview

`SchedulerComponent` เป็น wrapper component สำหรับ Syncfusion Schedule ที่ให้ความสามารถในการแสดงปฏิทินและจัดการกิจกรรมพร้อม features ครบถ้วน พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Multiple Views (Day, Week, WorkWeek, Month, Agenda, MonthAgenda, Timeline)
- ✅ Event Management (Create, Edit, Delete)
- ✅ Drag & Drop
- ✅ Resize Events
- ✅ Recurrence Events
- ✅ Export (Excel, iCalendar)
- ✅ Import (iCalendar)
- ✅ Print
- ✅ Resources & Grouping
- ✅ Time Zones
- ✅ Adaptive UI
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion Schedule ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-schedule": "^29.2.10"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { SchedulerComponent } from '../../shared/components/scheduler/scheduler.component';

@Component({
  imports: [SchedulerComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-scheduler
  [eventSettings]="eventSettings"
  [currentView]="'Month'"
  [selectedDate]="selectedDate">
</app-scheduler>
```

```typescript
import { Component } from '@angular/core';
import { SchedulerEvent } from '../../shared/components/scheduler/scheduler.component';

@Component({
  selector: 'app-example',
  template: `
    <app-scheduler
      [eventSettings]="eventSettings"
      [currentView]="'Month'"
      [selectedDate]="selectedDate">
    </app-scheduler>
  `
})
export class ExampleComponent {
  eventSettings = {
    dataSource: [
      {
        Id: 1,
        Subject: 'Meeting',
        StartTime: new Date(2024, 11, 20, 10, 0),
        EndTime: new Date(2024, 11, 20, 11, 0)
      }
    ]
  };

  selectedDate: Date = new Date(2024, 11, 20);
}
```

---

## ⚙️ Configuration

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `eventSettings` | `EventSettingsModel` | `{ dataSource: [] }` | Event settings |
| `currentView` | `View` | `'Month'` | Current view |
| `views` | `View[]` | `['Day', 'Week', ...]` | Available views |
| `selectedDate` | `Date` | `new Date()` | Selected date |
| `startHour` | `string` | `'09:00'` | Start hour |
| `endHour` | `string` | `'18:00'` | End hour |
| `workDays` | `number[]` | `[1,2,3,4,5]` | Work days |
| `firstDayOfWeek` | `number` | `0` | First day of week |
| `showWeekend` | `boolean` | `true` | Show weekend |
| `allowDragAndDrop` | `boolean` | `true` | Allow drag & drop |
| `allowResizing` | `boolean` | `true` | Allow resizing |
| `allowExcelExport` | `boolean` | `true` | Allow Excel export |
| `allowICalendarExport` | `boolean` | `true` | Allow iCalendar export |
| `allowICalendarImport` | `boolean` | `true` | Allow iCalendar import |
| `allowPrint` | `boolean` | `true` | Allow print |
| `enableRtl` | `boolean` | `false` | Enable RTL |
| `enableAdaptiveUI` | `boolean` | `true` | Enable adaptive UI |
| `group` | `any` | `null` | Group settings |
| `resources` | `any[]` | `[]` | Resources |
| `height` | `string \| number` | `'600px'` | Scheduler height |
| `width` | `string \| number` | `'100%'` | Scheduler width |
| `locale` | `string` | `'en'` | Locale |
| `customClass` | `string` | `''` | Custom CSS class |

### SchedulerEvent Interface

```typescript
interface SchedulerEvent {
  Id?: number | string;              // Event ID
  Subject: string;                   // Event subject
  StartTime: Date | string;          // Start time
  EndTime: Date | string;            // End time
  Description?: string;              // Description
  Location?: string;                 // Location
  IsAllDay?: boolean;                // Is all day event
  RecurrenceRule?: string;           // Recurrence rule
  RecurrenceID?: number | string;   // Recurrence ID
  RecurrenceException?: string;     // Recurrence exception
  StartTimezone?: string;           // Start timezone
  EndTimezone?: string;             // End timezone
  CategoryColor?: string;           // Category color
  [key: string]: any;               // Additional properties
}
```

---

## 📚 API Reference

### Methods

#### `refresh(): void`
Refresh scheduler

```typescript
schedulerComponent.refresh();
```

#### `exportToExcel(): void`
Export to Excel

```typescript
schedulerComponent.exportToExcel();
```

#### `exportToICalendar(): void`
Export to iCalendar

```typescript
schedulerComponent.exportToICalendar();
```

#### `importICalendar(file: File): void`
Import from iCalendar

```typescript
schedulerComponent.importICalendar(file);
```

#### `print(): void`
Print scheduler

```typescript
schedulerComponent.print();
```

#### `navigateToDate(date: Date): void`
Navigate to date

```typescript
schedulerComponent.navigateToDate(new Date(2024, 11, 25));
```

#### `changeView(view: View): void`
Change view

```typescript
schedulerComponent.changeView('Week');
```

#### `getSchedulerInstance(): ScheduleComponent | null`
Get Syncfusion Schedule instance

```typescript
const schedule = schedulerComponent.getSchedulerInstance();
```

#### `addEvent(event: SchedulerEvent): void`
Add event

```typescript
schedulerComponent.addEvent({
  Id: 1,
  Subject: 'New Event',
  StartTime: new Date(2024, 11, 20, 10, 0),
  EndTime: new Date(2024, 11, 20, 11, 0)
});
```

#### `updateEvent(event: SchedulerEvent): void`
Update event

```typescript
schedulerComponent.updateEvent({
  Id: 1,
  Subject: 'Updated Event',
  StartTime: new Date(2024, 11, 20, 10, 0),
  EndTime: new Date(2024, 11, 20, 11, 0)
});
```

#### `deleteEvent(eventId: number | string): void`
Delete event

```typescript
schedulerComponent.deleteEvent(1);
```

### Events

| Event | Type | Description |
|-------|------|-------------|
| `eventClick` | `EventEmitter<any>` | Emitted when event is clicked |
| `eventDoubleClick` | `EventEmitter<any>` | Emitted when event is double clicked |
| `cellClick` | `EventEmitter<any>` | Emitted when cell is clicked |
| `cellDoubleClick` | `EventEmitter<any>` | Emitted when cell is double clicked |
| `navigating` | `EventEmitter<any>` | Emitted when navigating |
| `actionBegin` | `EventEmitter<any>` | Emitted when action begins |
| `actionComplete` | `EventEmitter<any>` | Emitted when action completes |
| `eventRendered` | `EventEmitter<any>` | Emitted when event is rendered |
| `popupOpen` | `EventEmitter<any>` | Emitted when popup opens |
| `popupClose` | `EventEmitter<any>` | Emitted when popup closes |
| `dragStart` | `EventEmitter<any>` | Emitted when drag starts |
| `dragStop` | `EventEmitter<any>` | Emitted when drag stops |
| `resizeStart` | `EventEmitter<any>` | Emitted when resize starts |
| `resizeStop` | `EventEmitter<any>` | Emitted when resize stops |

---

## 💡 Examples

### Example 1: Basic Scheduler

```typescript
eventSettings = {
  dataSource: [
    {
      Id: 1,
      Subject: 'Meeting',
      StartTime: new Date(2024, 11, 20, 10, 0),
      EndTime: new Date(2024, 11, 20, 11, 0)
    }
  ]
};
```

```html
<app-scheduler
  [eventSettings]="eventSettings"
  [currentView]="'Month'"
  [selectedDate]="selectedDate">
</app-scheduler>
```

### Example 2: With Multiple Views

```typescript
views: View[] = ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'];
currentView: View = 'Week';
```

```html
<app-scheduler
  [eventSettings]="eventSettings"
  [currentView]="currentView"
  [views]="views"
  [selectedDate]="selectedDate">
</app-scheduler>
```

### Example 3: With Drag & Drop

```html
<app-scheduler
  [eventSettings]="eventSettings"
  [allowDragAndDrop]="true"
  [allowResizing]="true"
  (dragStop)="onDragStop($event)"
  (resizeStop)="onResizeStop($event)">
</app-scheduler>
```

### Example 4: Using ViewChild

```typescript
import { Component, ViewChild } from '@angular/core';
import { SchedulerComponent } from '../../shared/components/scheduler/scheduler.component';

@Component({
  template: `
    <app-scheduler
      #scheduler
      [eventSettings]="eventSettings">
    </app-scheduler>
    <button (click)="exportExcel()">Export Excel</button>
  `
})
export class ExampleComponent {
  @ViewChild('scheduler') scheduler!: SchedulerComponent;

  exportExcel(): void {
    this.scheduler.exportToExcel();
  }
}
```

---

## 🎨 Styling

### Glass Morphism
Component ใช้ Glass Morphism styling โดยอัตโนมัติ

### Dark Mode
รองรับ Dark Mode โดยอัตโนมัติ

### Gemini Theme
รองรับ Gemini Theme โดยอัตโนมัติ

### Custom Styling
```html
<app-scheduler
  [eventSettings]="eventSettings"
  customClass="my-custom-scheduler">
</app-scheduler>
```

```scss
.my-custom-scheduler {
  // Custom styles
}
```

---

## 📱 Responsive

Component รองรับ responsive design โดยอัตโนมัติ:
- Mobile: ปรับ toolbar และ views
- Tablet: ปรับขนาดและ spacing
- Desktop: Full features

---

## 🔗 Related Documentation

- [Syncfusion Schedule Documentation](https://ej2.syncfusion.com/angular/documentation/schedule/getting-started/)
- [Calendar Component](./calendar/README.md)
- [Data Grid Component](./data-grid/README.md)
- [Pivot Table Component](./pivot-table/README.md)
- [UI Kit Guide](../UI_KIT_GUIDE.md)

---

**Last Updated**: 2024-12-20  
**Version**: 1.0.0

