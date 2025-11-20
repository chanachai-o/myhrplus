import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTimeAttendanceComponent } from './daily-time-attendance.component';

describe('DailyTimeAttendanceComponent', () => {
  let component: DailyTimeAttendanceComponent;
  let fixture: ComponentFixture<DailyTimeAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DailyTimeAttendanceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTimeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
