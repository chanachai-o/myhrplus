import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth,
  format
} from 'date-fns';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { GlassButtonComponent } from '../../../../shared/components/glass-button/glass-button.component';
import { CalendarComponent } from '../../../../shared/components/calendar/calendar.component';
import { CalendarService, CalendarEventMeta } from '../../../../core/services/calendar.service';
import { CodeViewerComponent } from '../../shared/code-viewer/code-viewer.component';
import { PropsTableComponent, PropDefinition } from '../../shared/props-table/props-table.component';

@Component({
  selector: 'app-calendar-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GlassCardComponent,
    GlassButtonComponent,
    CalendarComponent,
    CodeViewerComponent,
    PropsTableComponent
  ],
  templateUrl: './calendar-demo.component.html',
  styleUrl: './calendar-demo.component.scss'
})
export class CalendarDemoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Calendar State
  view = signal<CalendarView>(CalendarView.Month);
  viewDate = signal<Date>(new Date());
  activeDayIsOpen = signal<boolean>(true);
  refresh = new Subject<void>();

  // Event Data
  events = signal<CalendarEvent<CalendarEventMeta>[]>([]);
  selectedEvent = signal<CalendarEvent<CalendarEventMeta> | null>(null);
  showEventForm = signal<boolean>(false);

  // UI State
  activeTab = signal<'calendar' | 'events' | 'stats' | 'settings'>('calendar');
  tabs: ('calendar' | 'events' | 'stats' | 'settings')[] = ['calendar', 'events', 'stats', 'settings'];

  // Expose CalendarView to template
  CalendarView = CalendarView;

  // Calendar Settings
  showWeekends = signal<boolean>(true);
  dayStartHour = signal<number>(6);
  dayEndHour = signal<number>(22);
  hourSegments = signal<number>(2);
  weekStartsOn = signal<number>(1);
  excludeDays = signal<number[]>([]);
  weekendDays = signal<number[]>([0, 6]);

  // Statistics
  totalEvents = computed(() => this.events().length);
  upcomingEvents = computed(() => this.events().filter(e => e.start > new Date()).length);
  completedEvents = computed(() => this.events().filter(e => e.meta?.status === 'completed').length);
  cancelledEvents = computed(() => this.events().filter(e => e.meta?.status === 'cancelled').length);

  // Event Actions
  eventActions = [
    {
      label: '<i class="fas fa-edit"></i>',
      onClick: ({ event }: { event: CalendarEvent<CalendarEventMeta> }): void => {
        this.editEvent(event);
      }
    },
    {
      label: '<i class="fas fa-trash"></i>',
      onClick: ({ event }: { event: CalendarEvent<CalendarEventMeta> }): void => {
        this.deleteEvent(event);
      }
    }
  ];

  // Code Examples
  basicUsageCode = `import { Component } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { CalendarComponent } from '@shared/components/calendar/calendar.component';

@Component({
  selector: 'app-my-calendar',
  standalone: true,
  imports: [CalendarComponent],
  template: \`
    <app-calendar
      [view]="CalendarView.Month"
      [viewDate]="viewDate"
      [events]="events"
      (eventClicked)="onEventClick($event)">
    </app-calendar>
  \`
})
export class MyCalendarComponent {
  CalendarView = CalendarView;
  viewDate = new Date();
  events = [];

  onEventClick(event: any) {
    console.log('Event clicked:', event);
  }
}`;

  eventManagementCode = `import { Component } from '@angular/core';
import { CalendarService, CalendarEventMeta } from '@core/services/calendar.service';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-calendar-with-service',
  standalone: true,
  imports: [CalendarComponent],
  template: \`
    <app-calendar
      [events]="events"
      (eventClicked)="onEventClick($event)">
    </app-calendar>
  \`
})
export class CalendarWithServiceComponent {
  events: CalendarEvent<CalendarEventMeta>[] = [];

  constructor(private calendarService: CalendarService) {
    this.calendarService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  onEventClick(event: CalendarEvent<CalendarEventMeta>) {
    // Handle event click
  }

  addEvent() {
    const newEvent: CalendarEvent<CalendarEventMeta> = {
      start: new Date(),
      title: 'New Event',
      meta: {
        id: '',
        title: 'New Event',
        category: 'General',
        priority: 'medium',
        status: 'scheduled'
      }
    };
    this.calendarService.addEvent(newEvent);
  }
}`;

  // Props for documentation
  calendarProps: PropDefinition[] = [
    { name: 'view', type: 'CalendarView', default: 'CalendarView.Month', description: 'Current calendar view (Month, Week, Day)', required: false },
    { name: 'viewDate', type: 'Date', default: 'new Date()', description: 'Currently displayed date', required: false },
    { name: 'events', type: 'CalendarEvent[]', default: '[]', description: 'Array of calendar events', required: false },
    { name: 'activeDayIsOpen', type: 'boolean', default: 'true', description: 'Whether active day is expanded in month view', required: false },
    { name: 'showToolbar', type: 'boolean', default: 'true', description: 'Show navigation toolbar', required: false },
    { name: 'showWeekends', type: 'boolean', default: 'true', description: 'Show weekend days', required: false },
    { name: 'dayStartHour', type: 'number', default: '0', description: 'Start hour for day/week view', required: false },
    { name: 'dayEndHour', type: 'number', default: '23', description: 'End hour for day/week view', required: false },
    { name: 'weekStartsOn', type: 'number', default: '1', description: 'Day of week to start (0=Sunday, 1=Monday)', required: false }
  ];

  constructor(
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.calendarService.getEvents().pipe(takeUntil(this.destroy$)).subscribe((events: CalendarEvent<CalendarEventMeta>[]) => {
      this.events.set(events);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(tab: 'calendar' | 'events' | 'stats' | 'settings'): void {
    this.activeTab.set(tab);
  }

  // Calendar Event Handlers
  onViewChange(view: CalendarView): void {
    this.view.set(view);
  }

  onViewDateChange(date: Date): void {
    this.viewDate.set(date);
  }

  onEventClicked(event: CalendarEvent<CalendarEventMeta>): void {
    this.selectedEvent.set({ ...event });
    this.showEventForm.set(true);
  }

  onDayClicked({ date, events }: { date: Date; events: CalendarEvent<CalendarEventMeta>[] }): void {
    if (isSameMonth(date, this.viewDate())) {
      if (
        (isSameDay(this.viewDate(), date) && this.activeDayIsOpen()) ||
        events.length === 0
      ) {
        this.activeDayIsOpen.set(false);
      } else {
        this.activeDayIsOpen.set(true);
      }
      this.viewDate.set(date);
    }
  }

  onEventTimesChanged(event: CalendarEventTimesChangedEvent): void {
    this.calendarService.eventTimesChanged(event);
    this.refresh.next();
  }

  onEventDropped(event: CalendarEvent<CalendarEventMeta>): void {
    this.calendarService.eventDropped(event);
    this.refresh.next();
  }

  onRefreshClicked(): void {
    this.refresh.next();
  }

  // Event Management
  addEvent(): void {
    this.selectedEvent.set({
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      title: 'New Event',
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      meta: {
        id: '',
        title: 'New Event',
        description: '',
        location: '',
        priority: 'medium',
        category: 'General',
        allDay: false,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    this.showEventForm.set(true);
  }

  saveEvent(): void {
    const event = this.selectedEvent();
    if (event) {
      if (event.meta?.id) {
        this.calendarService.updateEvent(event);
      } else {
        this.calendarService.addEvent(event);
      }
      this.showEventForm.set(false);
      this.selectedEvent.set(null);
      this.refresh.next();
    }
  }

  deleteEvent(event: CalendarEvent<CalendarEventMeta>): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.calendarService.deleteEvent(event);
      this.refresh.next();
    }
  }

  editEvent(event: CalendarEvent<CalendarEventMeta>): void {
    this.selectedEvent.set({ ...event });
    this.showEventForm.set(true);
  }

  cancelEdit(): void {
    this.showEventForm.set(false);
    this.selectedEvent.set(null);
  }

  // Export/Import
  exportEvents(format: 'json' | 'csv' | 'ical'): void {
    const data = this.calendarService.exportEvents(format);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  importEvents(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const format = file.name.split('.').pop() as 'json' | 'csv' | 'ical';
        this.calendarService.importEvents(e.target.result, format);
        this.refresh.next();
      };
      reader.readAsText(file);
    }
  }

  // Utility Functions
  formatEventDate(event: CalendarEvent<CalendarEventMeta>): string {
    if (event.allDay) {
      return format(event.start, 'MMM d, yyyy');
    } else {
      return `${format(event.start, 'MMM d, yyyy h:mm a')} - ${format(event.end || event.start, 'h:mm a')}`;
    }
  }

  getEventColor(event: CalendarEvent<CalendarEventMeta>): string {
    switch (event.meta?.priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }

  getEventIcon(event: CalendarEvent<CalendarEventMeta>): string {
    switch (event.meta?.category) {
      case 'Meeting': return 'fas fa-handshake';
      case 'Task': return 'fas fa-tasks';
      case 'Personal': return 'fas fa-user';
      case 'Holiday': return 'fas fa-umbrella-beach';
      default: return 'fas fa-calendar-alt';
    }
  }

  // Event Form Helpers
  updateEventTime(type: 'start' | 'end', time: string): void {
    const event = this.selectedEvent();
    if (!event) return;

    const [hours, minutes] = time.split(':').map(Number);
    const date = type === 'start' ? event.start : event.end;

    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);

      if (type === 'start') {
        event.start = newDate;
      } else {
        event.end = newDate;
      }
    }
  }

  updateEventDate(type: 'start' | 'end', date: string): void {
    const event = this.selectedEvent();
    if (!event) return;

    const newDate = new Date(date);

    if (type === 'start') {
      event.start = newDate;
    } else {
      event.end = newDate;
    }
  }
}

