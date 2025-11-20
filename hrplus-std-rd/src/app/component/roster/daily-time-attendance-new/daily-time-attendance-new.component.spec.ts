import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTimeAttendanceNewComponent } from './daily-time-attendance-new.component';

describe('DailyTimeAttendanceNewComponent', () => {
  let component: DailyTimeAttendanceNewComponent;
  let fixture: ComponentFixture<DailyTimeAttendanceNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DailyTimeAttendanceNewComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTimeAttendanceNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
