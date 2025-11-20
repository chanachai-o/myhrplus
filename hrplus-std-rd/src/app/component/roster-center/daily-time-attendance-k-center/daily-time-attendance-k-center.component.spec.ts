/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DailyTimeAttendanceKCenterComponent } from './daily-time-attendance-k-center.component';

describe('DailyTimeAttendanceKCenterComponent', () => {
  let component: DailyTimeAttendanceKCenterComponent;
  let fixture: ComponentFixture<DailyTimeAttendanceKCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [DailyTimeAttendanceKCenterComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTimeAttendanceKCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
