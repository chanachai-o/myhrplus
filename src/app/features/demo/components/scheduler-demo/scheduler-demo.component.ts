import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent, SchedulerEvent } from '../../../../shared/components/scheduler/scheduler.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { View } from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-scheduler-demo',
  standalone: true,
  imports: [CommonModule, SchedulerComponent, GlassCardComponent],
  templateUrl: './scheduler-demo.component.html',
  styleUrls: ['./scheduler-demo.component.scss']
})
export class SchedulerDemoComponent {
  // Sample events
  events: SchedulerEvent[] = [
    {
      Id: 1,
      Subject: 'ประชุมทีม',
      StartTime: new Date(2024, 11, 20, 10, 0),
      EndTime: new Date(2024, 11, 20, 11, 0),
      Description: 'ประชุมทีมเพื่อวางแผนงาน',
      Location: 'ห้องประชุม A',
      CategoryColor: '#1e40af'
    },
    {
      Id: 2,
      Subject: 'สัมภาษณ์งาน',
      StartTime: new Date(2024, 11, 21, 14, 0),
      EndTime: new Date(2024, 11, 21, 15, 0),
      Description: 'สัมภาษณ์ผู้สมัครงานตำแหน่ง Developer',
      Location: 'ห้องสัมภาษณ์',
      CategoryColor: '#059669'
    },
    {
      Id: 3,
      Subject: 'อบรมพนักงาน',
      StartTime: new Date(2024, 11, 22, 9, 0),
      EndTime: new Date(2024, 11, 22, 17, 0),
      Description: 'อบรมพนักงานเรื่องระบบใหม่',
      Location: 'ห้องอบรม',
      IsAllDay: false,
      CategoryColor: '#dc2626'
    },
    {
      Id: 4,
      Subject: 'ประชุมผู้บริหาร',
      StartTime: new Date(2024, 11, 23, 13, 0),
      EndTime: new Date(2024, 11, 23, 15, 0),
      Description: 'ประชุมผู้บริหารรายเดือน',
      Location: 'ห้องประชุมใหญ่',
      CategoryColor: '#7c3aed'
    }
  ];

  // Basic events (simpler example)
  basicEvents: SchedulerEvent[] = [
    {
      Id: 1,
      Subject: 'Meeting',
      StartTime: new Date(2024, 11, 20, 10, 0),
      EndTime: new Date(2024, 11, 20, 11, 0)
    },
    {
      Id: 2,
      Subject: 'Interview',
      StartTime: new Date(2024, 11, 21, 14, 0),
      EndTime: new Date(2024, 11, 21, 15, 0)
    }
  ];

  // Event settings
  eventSettings = {
    dataSource: this.events
  };

  basicEventSettings = {
    dataSource: this.basicEvents
  };

  // Views
  views: View[] = ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'];
  currentView: View = 'Month';
  selectedDate: Date = new Date(2024, 11, 20);

  // Event handlers
  onEventClick(event: any): void {
    console.log('Event clicked:', event);
  }

  onEventDoubleClick(event: any): void {
    console.log('Event double clicked:', event);
  }

  onCellClick(event: any): void {
    console.log('Cell clicked:', event);
  }

  onActionComplete(event: any): void {
    console.log('Action completed:', event);
  }
}

