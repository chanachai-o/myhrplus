import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DatePreset {
  label: string;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  @Input() presets: DatePreset[] = [];
  @Input() showPresets: boolean = true;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() format: string = 'dd/MM/yyyy';

  @Output() rangeChange = new EventEmitter<{start: Date | null, end: Date | null}>();

  dateRangeForm: FormGroup;
  showPresetMenu: boolean = false;

  constructor(private fb: FormBuilder) {
    this.dateRangeForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.startDate) {
      this.dateRangeForm.patchValue({ startDate: this.startDate });
    }
    if (this.endDate) {
      this.dateRangeForm.patchValue({ endDate: this.endDate });
    }

    // Watch for changes
    this.dateRangeForm.valueChanges.subscribe(() => {
      this.onDateChange();
    });
  }

  onDateChange(): void {
    const start = this.dateRangeForm.get('startDate')?.value;
    const end = this.dateRangeForm.get('endDate')?.value;
    
    if (start && end && start > end) {
      // Swap dates if start is after end
      this.dateRangeForm.patchValue({
        startDate: end,
        endDate: start
      });
      return;
    }

    this.rangeChange.emit({
      start: start,
      end: end
    });
  }

  onPresetSelect(preset: DatePreset): void {
    this.dateRangeForm.patchValue({
      startDate: preset.startDate,
      endDate: preset.endDate
    });
    this.showPresetMenu = false;
  }

  getPresets(): DatePreset[] {
    if (this.presets.length > 0) {
      return this.presets;
    }
    
    const now = new Date();
    return [
      {
        label: 'วันนี้',
        startDate: new Date(now),
        endDate: new Date(now)
      },
      {
        label: 'เมื่อวาน',
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(Date.now() - 86400000)
      },
      {
        label: 'สัปดาห์นี้',
        startDate: this.getStartOfWeek(new Date(now)),
        endDate: new Date(now)
      },
      {
        label: 'สัปดาห์ที่แล้ว',
        startDate: this.getStartOfWeek(new Date(Date.now() - 7 * 86400000)),
        endDate: this.getEndOfWeek(new Date(Date.now() - 7 * 86400000))
      },
      {
        label: 'เดือนนี้',
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now)
      },
      {
        label: 'เดือนที่แล้ว',
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0)
      },
      {
        label: 'ปีนี้',
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now)
      }
    ];
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  private getEndOfWeek(date: Date): Date {
    const start = this.getStartOfWeek(date);
    return new Date(start.getTime() + 6 * 86400000);
  }

  clearDates(): void {
    this.dateRangeForm.patchValue({
      startDate: null,
      endDate: null
    });
  }

  togglePresetMenu(): void {
    this.showPresetMenu = !this.showPresetMenu;
  }
}

